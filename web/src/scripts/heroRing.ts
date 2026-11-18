// @ts-nocheck — three.js is loaded lazily; types are not installed on purpose.
/**
 * Hero ring in WebGL (D-051, handoff from the 3D Designer: design/3d/HANDOFF-hero-ring.md).
 *
 * The photographed cut-out in the hero stays: it is the poster while the model loads, it
 * defines where the ring lands (its un-transformed box is read on every resize), and it is
 * the fallback when WebGL fails or motion is reduced. Once the model is ready the canvas
 * fades in and the photo fades out (html.hero-3d).
 *
 * Scroll progress comes from the hero's ScrollTrigger (getProgress). Mouse tilt only on a
 * fine pointer at ≥ 720 px; phones get 3D without tilt.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { gsap } from 'gsap';

export interface HeroRingOptions {
  getProgress: () => number; // hero ScrollTrigger progress, 0..1
  onReady?: () => void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function initHeroRing({ getProgress, onReady }: HeroRingOptions): boolean {
  const pin = document.querySelector<HTMLElement>('.hero__pin');
  const stage = document.querySelector<HTMLElement>('.hero__stage--front');
  const poster = document.querySelector<HTMLElement>('[data-hero-ring]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const track = document.querySelector<HTMLElement>('[data-hero]');
  if (!pin || !stage || !poster || !canvas || !track) return false;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return false;
  }
  if (!renderer.getContext()) return false;

  const isPhone = () => window.innerWidth < 720;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isPhone() ? 1.5 : 2));
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const FOV = 30;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 20000);

  // The hero photograph as an equirect environment: the polished silver reflects warm moss,
  // stone and sun like the photo cut-out does.
  const pmrem = new THREE.PMREMGenerator(renderer);
  new THREE.TextureLoader().load('/env/hero-env.jpg', (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = pmrem.fromEquirectangular(tex).texture;
    scene.environmentRotation = new THREE.Euler(0, Math.PI * 0.6, 0);
    tex.dispose();
  });
  const sun = new THREE.DirectionalLight(0xffe2b8, 2.2); // warm morning sun, upper left
  sun.position.set(-600, 700, 500);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x3b3a1c, 0.35));

  // Live cast shadow on the stone (the shadow that was printed into the photo is gone). // taste-skill-ignore: WebGL cast shadow, not a CSS shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const shadowSun = new THREE.DirectionalLight(0xffffff, 0); // casts only, adds no light
  shadowSun.castShadow = true;
  shadowSun.shadow.mapSize.set(1024, 1024);
  shadowSun.shadow.radius = 6;
  shadowSun.shadow.bias = -0.0005;
  scene.add(shadowSun, shadowSun.target);
  const catcherMat = new THREE.ShadowMaterial({ color: 0x1c140b, opacity: 0.5, transparent: true });
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), catcherMat);
  catcher.receiveShadow = true;
  catcherMat.depthWrite = false;
  catcher.renderOrder = -1;
  scene.add(catcher);
  // Shadow direction relative to the ring; tuned by eye (open item in the handoff).
  const SHADOW_DIR = new THREE.Vector3(0.55, 1, 0.75).normalize();

  const pivot = new THREE.Group(); // position + scale + scroll spin + mouse tilt
  const pose = new THREE.Group(); // fixed "photo" pose
  pivot.add(pose);
  scene.add(pivot);
  // Measured from the photo cut-out: the opening's axis leans `theta`° from screen-right toward up
  // and `phi`° away from the camera; sensors sit on the inner wall facing the camera.
  const POSE = { theta: 66, phi: 50, psi: 0, scale: 1.0 };
  let ringSize = 1;
  function setPose({ theta, phi, psi, scale }) {
    const d = THREE.MathUtils.degToRad;
    const a = new THREE.Vector3(Math.sin(d(phi)) * Math.cos(d(theta)), Math.sin(d(phi)) * Math.sin(d(theta)), Math.cos(d(phi)));
    const r = new THREE.Vector3(0, 0, -1).addScaledVector(a, Math.cos(d(phi))).normalize().applyAxisAngle(a, d(psi));
    const xw = r.clone().negate();
    const zw = a;
    const yw = zw.clone().cross(xw);
    pose.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xw, yw, zw));
    pose.scale.setScalar(scale);
  }

  // ---- layout: same geometry as the DOM hero (1 unit = 1 css px at z = 0) ----
  let W = 0;
  let H = 0;
  let landed = { x: 0, y: 0, w: 0 };
  let floatP = { x: 0, y: 0, w: 0 };
  function resize() {
    W = pin.clientWidth;
    H = pin.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    camera.updateProjectionMatrix();
    // Landed position from the poster's UN-transformed box (the GSAP tween moves the element,
    // offset* ignores transforms): its box inside the stage, plus the stage inside the pin.
    const pr = pin.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const cx = sr.left - pr.left + poster.offsetLeft + poster.offsetWidth / 2;
    const cy = sr.top - pr.top + poster.offsetTop + poster.offsetHeight / 2;
    landed = { x: cx - W / 2, y: -(cy - H / 2), w: poster.offsetWidth * 0.98 };
    const fw = isPhone() ? window.innerWidth * 0.66 : Math.min(window.innerWidth * 0.3, H * 0.62);
    floatP = { x: 0, y: H * (isPhone() ? 0.1 : -0.03), w: fw }; // y is up; phones float nearer the headline
    placeCatcher();
  }
  function placeCatcher() {
    if (!pose.children.length || !landed.w) return;
    pivot.position.set(landed.x, landed.y, 0);
    pivot.scale.setScalar(landed.w / ringSize);
    pivot.rotation.set(0, 0, 0);
    pivot.updateMatrixWorld(true);
    const bottom = new THREE.Box3().setFromObject(pose).min.y;
    const w = landed.w;
    catcher.position.set(landed.x, bottom + 0.5, 0);
    catcher.rotation.set(-Math.PI / 2 + 0.32, 0, 0); // stone top, foreshortened like the photo
    catcher.scale.set(w * 3.2, w * 2.2, 1);
    shadowSun.target.position.copy(catcher.position);
    shadowSun.position.copy(catcher.position).addScaledVector(SHADOW_DIR, w * 4);
    const c = shadowSun.shadow.camera;
    c.left = c.bottom = -w * 1.6;
    c.right = c.top = w * 1.6;
    c.near = 1;
    c.far = w * 9;
    c.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(pin);
  window.addEventListener('resize', resize);
  resize();

  // ---- input ----
  const mouse = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0 };
  const canTilt = () => matchMedia('(hover: hover) and (pointer: fine)').matches && !isPhone();
  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // ---- model ----
  let ready = false;
  const draco = new DRACOLoader().setDecoderPath('/draco/');
  new GLTFLoader().setDRACOLoader(draco).load(
    '/models/stillway-ring-silver_web.glb',
    (g) => {
      const ring = g.scene;
      const box = new THREE.Box3().setFromObject(ring);
      ring.position.sub(box.getCenter(new THREE.Vector3()));
      ringSize = box.getSize(new THREE.Vector3()).x; // outer diameter
      ring.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true;
        const m = o.material;
        if (/Silver/i.test(m.name)) {
          m.envMapIntensity = 1.5;
          m.roughness = 0.06;
        }
        if (/Liner/i.test(m.name)) m.envMapIntensity = 0.5;
        if (/Glass|Frame/i.test(m.name)) m.envMapIntensity = 0.9;
      });
      pose.add(ring);
      setPose(POSE);
      placeCatcher();
      ready = true;
      // swap: the canvas fades in, the photo fades out
      document.documentElement.classList.add('hero-3d');
      onReady?.();
    },
    undefined,
    () => {
      /* model failed to load: the photo stays */
    },
  );

  // ---- render only while the hero is on screen ----
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(track);

  let pSm = 0;
  const loop = (time: number) => {
    if (!ready || !visible || !W) return;
    const raw = clamp01(getProgress());
    pSm += (raw - pSm) * 0.08; // follows the scrub smoothing of the DOM timeline
    const k = easeIO(clamp01(pSm / 0.72)); // landing progress, same window as the GSAP timeline
    const hover = 1 - k;

    const x = lerp(floatP.x, landed.x, k);
    const y = lerp(floatP.y, landed.y, k) + Math.sin(time * 1.3) * 10 * hover;
    pivot.position.set(x, y, 0);
    pivot.scale.setScalar(lerp(floatP.w, landed.w, k) / ringSize);

    const tk = canTilt() ? 1 : 0;
    tilt.x += (mouse.y * 0.22 * tk - tilt.x) * 0.06;
    tilt.y += (mouse.x * 0.32 * tk - tilt.y) * 0.06;
    const mk = lerp(1, 0.35, k); // less tilt once it rests on the stone
    pivot.rotation.set(
      tilt.x * mk + Math.sin(time * 0.9) * 0.03 * hover,
      -(1 - k) * Math.PI * 2 + tilt.y * mk, // one slow turn while landing; starts and ends on the photo pose
      THREE.MathUtils.degToRad(lerp(-9, 0, k)) + Math.sin(time * 0.9) * 0.028 * hover,
    );

    // the cast shadow grows in as the ring nears the stone // taste-skill-ignore: WebGL cast shadow, not a CSS shadow
    catcherMat.opacity = 0.55 * Math.pow(clamp01((k - 0.35) / 0.65), 1.5);

    renderer.render(scene, camera);
  };
  gsap.ticker.add(loop);
  return true;
}
