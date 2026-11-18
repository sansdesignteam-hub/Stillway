// @ts-nocheck — three.js is loaded lazily; types are not installed on purpose.
/**
 * Closing CTA ring in WebGL (D-052, handoff: design/3d/HANDOFF-hero-ring.md, section CTA).
 *
 * The photographed night cut-out (data-close-ring) stays in the DOM: poster while the model
 * loads, reference for the landed position/size, fallback when WebGL fails or motion is
 * reduced. Once the model is ready the canvas fades in and the photo fades out (html.close-3d).
 * The WebGL context is only created when the section is about to come into view, so it does not
 * overlap with the hero's for long.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { gsap } from 'gsap';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2);

export function initCloseRing(): boolean {
  const sec = document.querySelector<HTMLElement>('.close');
  const stage = document.querySelector<HTMLElement>('.close__stage--front');
  const poster = document.querySelector<HTMLElement>('[data-close-ring]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-close-canvas]');
  if (!sec || !stage || !poster || !canvas) return false;

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
  renderer.toneMappingExposure = 1.7;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const FOV = 30;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 20000);

  // Night environment: the night photograph itself (cool sky, dark stone) plus moonlight.
  const pmrem = new THREE.PMREMGenerator(renderer);
  new THREE.TextureLoader().load('/env/env-night.jpg', (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = pmrem.fromEquirectangular(tex).texture;
    scene.environmentRotation = new THREE.Euler(0, Math.PI * 0.6, 0);
    scene.environmentIntensity = 3.5;
    tex.dispose();
  });
  const moon = new THREE.DirectionalLight(0xffe6c4, 7);
  moon.position.set(500, 800, 400);
  const rim = new THREE.DirectionalLight(0xffe6c4, 12); // faint warm rim from behind-left
  rim.position.set(-500, 300, -200);
  scene.add(moon, rim, new THREE.HemisphereLight(0x6f86c8, 0x151a10, 0.4));

  const pivot = new THREE.Group(); // position + scale + scroll spin + mouse tilt
  const pose = new THREE.Group(); // fixed "photo" pose
  pivot.add(pose);
  scene.add(pivot);
  // roll leans the ring in the screen plane so it matches the H-05 cut-out.
  const POSE = { theta: 118, phi: 62, psi: -35, scale: 0.9, roll: 40 };
  let ringSize = 1;
  const leds: THREE.MeshStandardMaterial[] = [];
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

  // ---- layout: 1 unit = 1 css px at z = 0 ----
  let W = 0;
  let H = 0;
  let landed = { x: 0, y: 0, w: 0 };
  function resize() {
    W = sec.clientWidth;
    H = sec.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    camera.updateProjectionMatrix();
    // Landed box from the poster's UN-transformed geometry (the GSAP tween moves the element).
    const pr = sec.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const cx = sr.left - pr.left + poster.offsetLeft + poster.offsetWidth / 2;
    const cy = sr.top - pr.top + poster.offsetTop + poster.offsetHeight / 2;
    landed = { x: cx - W / 2, y: -(cy - H / 2), w: poster.offsetWidth * 0.98 };
  }
  new ResizeObserver(resize).observe(sec);
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
      ringSize = box.getSize(new THREE.Vector3()).x;
      ring.traverse((o) => {
        if (!o.isMesh) return;
        const m = o.material;
        if (/Silver/i.test(m.name)) {
          m.envMapIntensity = 4.5;
          m.roughness = 0.07;
          m.color.set('#ffe9cf'); // warm tint, like the silver in the night cut-out
        }
        if (/Liner/i.test(m.name)) m.envMapIntensity = 0.6;
        if (/LED/i.test(m.name)) {
          m.emissive = new THREE.Color(0xff9a3c); // sensors glow at night
          m.emissiveIntensity = 3;
          m.toneMapped = false;
          leds.push(m);
        }
      });
      pose.add(ring);
      setPose(POSE);
      ready = true;
      document.documentElement.classList.add('close-3d');
    },
    undefined,
    () => {
      /* model failed to load: the photo stays */
    },
  );

  // ---- render only while the section is near the viewport ----
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '10% 0px' }).observe(sec);

  let pSm = 0;
  const loop = (time: number) => {
    if (!ready || !visible || !W) return;
    // same window as the DOM tween: section top from 90% of the viewport to the top
    const top = sec.getBoundingClientRect().top;
    const raw = clamp01((window.innerHeight * 0.9 - top) / (window.innerHeight * 0.9));
    pSm += (raw - pSm) * 0.09;
    const k = easeOut(pSm);
    const drop = 1 - k;

    pivot.position.set(landed.x, landed.y + drop * landed.w * 0.99 + Math.sin(time * 1.1) * 6, 0); // from above, then floats in place
    pivot.scale.setScalar((landed.w / ringSize) * (1 + 0.12 * drop));

    const tk = canTilt() ? 1 : 0;
    tilt.x += (mouse.y * 0.2 * tk - tilt.x) * 0.06;
    tilt.y += (mouse.x * 0.3 * tk - tilt.y) * 0.06;
    pivot.rotation.set(
      tilt.x + Math.sin(time * 0.8) * 0.02,
      -drop * Math.PI * 1.2 + tilt.y, // one and a half turns while it comes down
      THREE.MathUtils.degToRad(-14 * drop + POSE.roll) + Math.sin(time * 0.7) * 0.02,
    );
    const glow = 2.6 + Math.sin(time * 1.6) * 0.5; // slow breathing
    for (const m of leds) m.emissiveIntensity = glow;

    renderer.render(scene, camera);
  };
  gsap.ticker.add(loop);
  return true;
}
