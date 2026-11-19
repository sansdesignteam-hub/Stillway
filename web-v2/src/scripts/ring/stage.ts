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
  const envs: { paper?: THREE.Texture; night?: THREE.Texture; photo?: THREE.Texture } = {};
  const loadEnv = (url: string) =>
    new EXRLoader().loadAsync(url).then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      const env = pmrem.fromEquirectangular(t).texture;
      t.dispose();
      return env;
    });
  try {
    envs.paper = await loadEnv(RING_MODEL.env.paper);
  } catch {
    /* no env: the ring still renders, darker */
  }
  // the hero photograph as an equirect environment (V1 heroRing approach): the silver reflects moss and sun
  // Desaturated so the brushed silver stays silver (the raw warm photo turned it gold).
  try {
    const img = await new THREE.ImageLoader().loadAsync(RING_MODEL.env.photo);
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const g = c.getContext('2d')!;
    g.filter = 'saturate(30%) brightness(118%) contrast(108%)';
    g.drawImage(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    envs.photo = pmrem.fromEquirectangular(tex).texture;
    tex.dispose();
  } catch {
    /* falls back to paper */
  }
  // night env after the first paint of the ring
  setTimeout(() => loadEnv(RING_MODEL.env.night).then((e) => ((envs.night = e), (lastEnv = ''))).catch(() => {}), 300);
  scene.environment = envs.photo ?? envs.paper ?? null;

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
    if (M.shell.test(m.name)) shells.push(m); // brushed silver as authored in the GLB
  });
  // LEDs (D-062): both off until a section asks (S08 colours, "off" = red dot)
  const ledMain = ring.getObjectByName(RING_MODEL.meshes.ledMain)?.material as THREE.MeshStandardMaterial | undefined;
  const ledPower = ring.getObjectByName(RING_MODEL.meshes.ledPower)?.material as THREE.MeshStandardMaterial | undefined;
  for (const m of [ledMain, ledPower]) if (m) m.emissiveIntensity = 0;
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
  let lastAlpha = -1;
  let lastEnv = '';
  let lastLed = 0;
  const apply = (p: Pose, extra: { breathe?: number } = {}) => {
    // width: fraction of viewport width, but never taller than 82% of the viewport
    const raw = p.w * W;
    const w = (Math.min(raw, H * 0.82) * (1 - p.uncap) + raw * p.uncap) * (1 + (extra.breathe ?? 0));
    pivot.position.set(p.x * W, p.y * H, 0);
    pivot.scale.setScalar(w / ringSize);
    pivot.rotation.set(p.rx, p.ry, p.rz, 'YXZ');
    if (p.roll) pivot.quaternion.premultiply(rollQ.setFromAxisAngle(Z_AXIS, p.roll));
    spinner.rotation.z = p.spin;

    // env: night when light ≥ .5, else photo when photo ≥ .5, else paper; intensity dips around a swap
    const n = Math.min(1, Math.max(0, p.light));
    const ph = Math.min(1, Math.max(0, p.photo));
    const key = n >= 0.5 && envs.night ? 'night' : ph >= 0.5 && envs.photo ? 'photo' : 'paper';
    if (key !== lastEnv) {
      lastEnv = key;
      scene.environment = envs[key] ?? envs.paper ?? null;
      scene.environmentRotation = new THREE.Euler(0, key === 'photo' ? Math.PI * 0.6 : 0, 0);
    }
    const dip = Math.min(1, Math.abs(n - 0.5) * 2.5, Math.abs(ph - 0.5) * 2.5);
    scene.environmentIntensity = (0.15 + 0.85 * dip) * (key === 'photo' ? 1.7 : 1); // the photo env is darker than the studio EXRs

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
    };
    lit(ledMain, color && color !== 'off' ? color : null);
    lit(ledPower, color === 'off' ? '#FF3B30' : null);
  };

  return { apply, render, setLed, canvas, three: THREE, pivot };
}
