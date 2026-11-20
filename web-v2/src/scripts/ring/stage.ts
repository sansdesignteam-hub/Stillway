// @ts-nocheck — three.js types are not installed on purpose (same as V1).
/**
 * The one WebGL ring of V2 (D-063): a single fixed, full-viewport canvas with one renderer and
 * one ring. Sections never touch three.js; they return a Pose (poses.ts) for the current scroll
 * position and story.ts calls `stage.apply(pose)` each frame.
 *
 * Lighting (3D handoff stage 2): all light comes from the V2 environment maps, no extra lamps.
 *  - pose.light 0 = env "paper" (warm studio, S01–S02), 1 = env "night" (near-black with one cold
 *    rim strip, S03). Across a connection the env intensity dips, the env swaps at 0.5, and it
 *    comes back up (handoff: "tween intensity down → swap → up").
 * Returns null without WebGL or if the model fails; the page then shows no ring (sections still read).
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RING_MODEL } from './model';
import type { Pose } from './poses';

const FOV = 30;

export interface RingStage {
  apply: (p: Pose, extra?: { breathe?: number }) => void;
  render: () => void;
  setLed: (color: string | 'off' | null, intensity?: number) => void;
  canvas: HTMLCanvasElement;
  three: typeof THREE;
  pivot: THREE.Group;
}

export async function createRingStage(canvas: HTMLCanvasElement): Promise<RingStage | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  const isPhone = () => window.innerWidth < 720;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isPhone() ? 1.5 : 2));
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 40000);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envs: { paper?: THREE.Texture; night?: THREE.Texture; dusk?: THREE.Texture } = {};
  /** photo → paper blends, index 0 = photo env (S01), last = paper env (S02); see buildBlends */
  let blends: THREE.Texture[] = [];
  const BLEND_STEPS = 9;
  let paperTex: THREE.Texture | null = null;
  let photoTex: THREE.Texture | null = null;
  try {
    paperTex = await new EXRLoader().loadAsync(RING_MODEL.env.paper);
    paperTex.mapping = THREE.EquirectangularReflectionMapping;
    envs.paper = pmrem.fromEquirectangular(paperTex).texture;
  } catch {
    /* no env: the ring still renders, darker */
  }
  // the hero photograph as an equirect environment, exactly as V1 heroRing (D-081: not neutralised)
  try {
    photoTex = await new THREE.TextureLoader().loadAsync(RING_MODEL.env.photo);
    photoTex.mapping = THREE.EquirectangularReflectionMapping;
    photoTex.colorSpace = THREE.SRGBColorSpace;
  } catch {
    /* falls back to paper */
  }
  /**
   * S01 → S02 must not pop (D-083): instead of swapping the photo env for the paper env at one
   * scroll point, prebuild BLEND_STEPS environments that mix the two (photo rotated 0.6π as in V1)
   * and step through them with pose.photo. A shader sphere renders the mix, PMREM bakes each step.
   */
  const buildBlends = () => {
    if (!photoTex || !paperTex) return;
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { photo: { value: photoTex }, paper: { value: paperTex }, t: { value: 0 }, rot: { value: Math.PI * 0.6 } },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `
        uniform sampler2D photo; uniform sampler2D paper; uniform float t; uniform float rot; varying vec3 vDir;
        vec2 equi(vec3 d){ return vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(clamp(d.y,-1.0,1.0)) * 0.31830989 + 0.5); }
        void main(){
          vec3 d = normalize(vDir);
          float c = cos(rot), s = sin(rot);
          vec3 r = vec3(c * d.x + s * d.z, d.y, -s * d.x + c * d.z);
          vec3 a = texture2D(photo, equi(r)).rgb;
          vec3 b = texture2D(paper, equi(d)).rgb;
          gl_FragColor = vec4(mix(a, b, t), 1.0);
        }`,
    });
    const blendScene = new THREE.Scene();
    blendScene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 64, 32), mat));
    blends = [];
    for (let i = 0; i < BLEND_STEPS; i++) {
      mat.uniforms.t.value = i / (BLEND_STEPS - 1);
      blends.push(pmrem.fromScene(blendScene, 0, 0.1, 100).texture);
    }
    mat.dispose();
  };
  buildBlends();
  // night env after the first paint of the ring
  setTimeout(() => loadEnv(RING_MODEL.env.night).then((e) => ((envs.night = e), (lastEnv = ''))).catch(() => {}), 300);
  setTimeout(() => loadEnv(RING_MODEL.env.dusk).then((e) => ((envs.dusk = e), (lastEnv = ''))).catch(() => {}), 900);
  const loadEnv = (url: string) =>
    new EXRLoader().loadAsync(url).then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      const env = pmrem.fromEquirectangular(t).texture;
      t.dispose();
      return env;
    });
  scene.environment = blends[0] ?? envs.paper ?? null;

  // V1 hero rig for S01 (heroRing.ts): warm morning sun upper left + hemisphere, faded in with pose.photo
  const sun = new THREE.DirectionalLight(0xffe2b8, 0);
  sun.position.set(-600, 700, 500);
  const hemi = new THREE.HemisphereLight(0xfff1dc, 0x3b3a1c, 0);
  scene.add(sun, hemi);
  // S03 (Ultrahuman ref): one cold light grazing the band edge from behind one side, so a dark
  // polished ring still reads as silver along its bevel
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0);
  rim.position.set(900, 420, -650);
  // a low, cool front fill so the outer band reads as silver (not black) on Night (D-090)
  const rimFill = new THREE.DirectionalLight(0xdfe8ff, 0);
  rimFill.position.set(-700, 260, 900);
  scene.add(rim, rimFill);
  // S05: one weak ochre rim from the Dusk glow (lower left); the env stays neutral (D-090 r1)
  const warmRim = new THREE.DirectionalLight(0xe0a35c, 0);
  warmRim.position.set(-900, -520, 260);
  scene.add(warmRim);
  // V1 live cast shadow on the stone (D-051): a shadow-only light and a transparent catcher plane
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const shadowSun = new THREE.DirectionalLight(0xffffff, 0); // casts only, adds no light
  shadowSun.shadow.mapSize.set(1024, 1024);
  shadowSun.shadow.radius = 6;
  shadowSun.shadow.bias = -0.0005;
  scene.add(shadowSun, shadowSun.target);
  const catcherMat = new THREE.ShadowMaterial({ color: 0x1c140b, opacity: 0, transparent: true, depthWrite: false });
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), catcherMat);
  catcher.receiveShadow = true;
  catcher.renderOrder = -1;
  catcher.visible = false;
  scene.add(catcher);
  const SHADOW_DIR = new THREE.Vector3(0.55, 1, 0.75).normalize(); // V1 value

  /* S06 finger proxy (s06-pose.json fingerProxy): lathe around +Y in hand-photo px, y = 0 at the
     ring seat; depth only, drawn before the ring so the back of the band hides behind the finger */
  const PROFILE = [[0, 337], [15, 334], [28, 320], [35, 300], [38, 280], [40, 260], [42, 220], [44.6, 160], [48, 120], [47, 60], [46, 0], [48, -110], [0, -110]];
  const finger = new THREE.Mesh(
    new THREE.LatheGeometry(PROFILE.map(([r, y]) => new THREE.Vector2(r * 0.96, y)), 48),
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true }),
  );
  finger.renderOrder = -2;
  finger.visible = false;
  scene.add(finger);
  const FINGER_TILT = THREE.MathUtils.degToRad(2.9);

  const pivot = new THREE.Group(); // position, scale, view rotation
  const spinner = new THREE.Group(); // spin about the ring's own axis (model Z)
  pivot.add(spinner);
  scene.add(pivot);

  let ring: THREE.Object3D;
  try {
    const draco = new DRACOLoader().setDecoderPath(RING_MODEL.dracoPath);
    const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(RING_MODEL.url);
    ring = gltf.scene;
  } catch {
    renderer.dispose();
    return null;
  }
  const box = new THREE.Box3().setFromObject(ring);
  ring.position.sub(box.getCenter(new THREE.Vector3()));
  const ringSize = box.getSize(new THREE.Vector3()).x; // outer diameter
  const M = RING_MODEL.materials;
  const shells: THREE.MeshStandardMaterial[] = [];
  ring.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material;
    o.castShadow = true;
    if (M.shell.test(m.name)) shells.push(m); // brushed silver as authored in the GLB
  });
  // polished (S01, D-081) vs brushed (authored). Values = finishes.json "silver_polished" from the
  // 3D Designer, applied to this same GLB (normal map and anisotropy off), so S01 → S02 can blend the
  // finish continuously instead of swapping to stillway-ring-v2-silver-polished_web.glb mid-scroll.
  const band = shells.find((m) => !/Engrave/i.test(m.name)) as THREE.MeshPhysicalMaterial | undefined;
  const engrave = shells.find((m) => /Engrave/i.test(m.name)) as THREE.MeshPhysicalMaterial | undefined;
  const snap = (m?: THREE.MeshPhysicalMaterial) =>
    m && { color: m.color.clone(), roughness: m.roughness, anisotropy: (m as any).anisotropy ?? 0, normal: m.normalScale?.x ?? 0, env: m.envMapIntensity ?? 1 };
  const brushed = { band: snap(band), engrave: snap(engrave) };
  const lin = (r: number, g: number, b: number) => new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);
  const POLISHED = {
    band: { color: lin(0.92, 0.92, 0.93), roughness: 0.06, anisotropy: 0, normal: 0, env: 1.5 },
    engrave: { color: lin(0.28, 0.28, 0.29), roughness: 0.38, anisotropy: 0, normal: 0, env: 1.0 },
  };
  const mix = (m: THREE.MeshPhysicalMaterial | undefined, a: any, b: any, g: number) => {
    if (!m || !a) return;
    m.color.copy(a.color).lerp(b.color, g);
    m.roughness = a.roughness + (b.roughness - a.roughness) * g;
    if ('anisotropy' in m) (m as any).anisotropy = a.anisotropy + (b.anisotropy - a.anisotropy) * g;
    m.normalScale?.setScalar(a.normal + (b.normal - a.normal) * g);
    m.envMapIntensity = a.env + (b.env - a.env) * g;
  };
  // LEDs (D-062): both off until a section asks (S08 colours, "off" = red dot)
  const ledMain = ring.getObjectByName(RING_MODEL.meshes.ledMain)?.material as THREE.MeshStandardMaterial | undefined;
  const ledPower = ring.getObjectByName(RING_MODEL.meshes.ledPower)?.material as THREE.MeshStandardMaterial | undefined;
  // D-062 / D-090 r2: an unlit LED shows no colour at all (its base colour in the GLB is red/green,
  // which read as lights in close-ups); keep the authored colour only for when it is lit
  const LED_OFF = new THREE.Color(0x1c1c1e);
  const ledBase = new Map<THREE.MeshStandardMaterial, THREE.Color>();
  for (const m of [ledMain, ledPower]) {
    if (!m) continue;
    ledBase.set(m, m.color.clone());
    m.color.copy(LED_OFF);
    m.emissiveIntensity = 0;
  }
  spinner.add(ring);

  let W = 0;
  let H = 0;
  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  const rollQ = new THREE.Quaternion();
  const Z_AXIS = new THREE.Vector3(0, 0, 1);
  const X_AXIS = new THREE.Vector3(1, 0, 0);
  let lastAlpha = -1;
  let lastEnv = '';
  let lastLed = 0;
  let lastGloss = -1;
  const apply = (p: Pose, extra: { breathe?: number } = {}) => {
    // width: fraction of viewport width, but never taller than 82% of the viewport
    const raw = p.w * W;
    const w = (Math.min(raw, H * 0.82) * (1 - p.uncap) + raw * p.uncap) * (1 + (extra.breathe ?? 0));
    pivot.position.set(p.x * W, p.y * H, 0);
    pivot.scale.setScalar(w / ringSize);
    pivot.rotation.set(p.rx, p.ry, p.rz, 'YXZ');
    if (p.pitch) pivot.quaternion.premultiply(rollQ.setFromAxisAngle(X_AXIS, p.pitch));
    if (p.roll) pivot.quaternion.premultiply(rollQ.setFromAxisAngle(Z_AXIS, p.roll));
    finger.visible = p.fing > 0.5;
    if (finger.visible) {
      finger.position.set(p.fx * W, p.fy * H, 0);
      finger.scale.setScalar(p.fs);
      finger.rotation.set(0, 0, FINGER_TILT);
    }
    spinner.rotation.z = p.spin;

    // finish: brushed → polished (V1)
    if (p.gloss !== lastGloss) {
      lastGloss = p.gloss;
      mix(band, brushed.band, POLISHED.band, p.gloss);
      mix(engrave, brushed.engrave, POLISHED.engrave, p.gloss);
    }

    // V1 rig and cast shadow, S01 only
    sun.intensity = 2.2 * p.photo;
    hemi.intensity = 0.35 * p.photo;
    rim.intensity = 14 * p.rim;
    rimFill.intensity = 3.2 * p.rim;
    warmRim.intensity = 7 * p.warm;
    const sh = Math.max(0, p.shadow);
    catcher.visible = sh > 0.005;
    shadowSun.castShadow = catcher.visible;
    if (catcher.visible) {
      catcherMat.opacity = 0.55 * sh;
      catcher.position.set(p.shadowX * W, p.shadowY * H, 0);
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

    // env: night when light ≥ .5, else photo when photo ≥ .5, else paper; intensity dips around a swap
    const n = Math.min(1, Math.max(0, p.light));
    const ph = Math.min(1, Math.max(0, p.photo));
    // photo ↔ paper: step through the prebuilt blends (no pop); paper ↔ night: dip and swap at 0.5
    const step = blends.length ? Math.round((1 - ph) * (blends.length - 1)) : -1;
    const dk = Math.min(1, Math.max(0, p.dusk));
    const key = dk >= 0.5 && envs.dusk ? 'dusk' : n >= 0.5 && envs.night ? 'night' : step >= 0 ? `blend${step}` : 'paper';
    if (key !== lastEnv) {
      lastEnv = key;
      scene.environment = key === 'dusk' ? envs.dusk! : key === 'night' ? envs.night! : step >= 0 ? blends[step] : envs.paper ?? null;
    }
    renderer.toneMappingExposure = 1.0 + 0.15 * ph; // V1 hero exposure 1.15 → 1.0, continuous
    const dip = Math.min(1, Math.abs(n - 0.5) * 2.5, Math.abs(dk - 0.5) * 2.5);
    // on Night the polished env is almost black: lift it with the rim so the band keeps a silver gradient
    // the swap dip never goes below 0.45, so the ring is never a black shape in a connection (D-090 r1)
    scene.environmentIntensity = (0.45 + 0.55 * dip) * (1 + 1.4 * p.rim);

    if (Math.abs(p.led - lastLed) > 0.001) {
      lastLed = p.led;
      setLed(p.led > 0.01 ? '#34E07A' : null, RING_MODEL.ledIntensity * p.led);
    }
    if (p.alpha !== lastAlpha) {
      lastAlpha = p.alpha;
      canvas.style.opacity = String(p.alpha);
    }
  };

  const render = () => {
    if (lastAlpha <= 0.001 || !W) return;
    renderer.render(scene, camera);
  };

  /** colour for window A, or 'off' to light only the red dot, or null for both dark */
  const setLed = (color: string | 'off' | null, intensity: number = RING_MODEL.ledIntensity) => {
    const lit = (m: THREE.MeshStandardMaterial | undefined, c: string | null) => {
      if (!m) return;
      if (c) m.emissive.set(c);
      m.emissiveIntensity = c ? intensity : 0;
      m.toneMapped = !c;
      m.color.copy(c ? ledBase.get(m) ?? LED_OFF : LED_OFF);
    };
    lit(ledMain, color && color !== 'off' ? color : null);
    lit(ledPower, color === 'off' ? '#FF3B30' : null);
  };

  return { apply, render, setLed, canvas, three: THREE, pivot };
}
