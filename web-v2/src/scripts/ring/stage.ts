// @ts-nocheck — three.js types are not installed on purpose (same as V1).
/**
 * The one WebGL ring of V2 (D-063): a single fixed, full-viewport canvas with one renderer and
 * one ring. Sections never touch three.js; they return a Pose (poses.ts) for the current scroll
 * position and story.ts calls `stage.apply(pose)` each frame.
 *
 * Lighting: two rigs mixed by pose.light.
 *  - Day (0): neutral studio environment (three's RoomEnvironment, placeholder for the 3D
 *    Designer's warm studio HDRI) + warm key light upper left.
 *  - Night (1): environment almost off, one cool rim light from behind one side, so only the
 *    edge of the ring catches light (S03).
 * Returns null without WebGL or if the model fails; the page then shows no ring (sections still read).
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 40000);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentRotation = new THREE.Euler(0.2, Math.PI * 0.25, 0);

  // Day rig
  const key = new THREE.DirectionalLight(0xffe6c8, 2.0);
  key.position.set(-600, 700, 600);
  const fill = new THREE.HemisphereLight(0xfff4e6, 0xd9cbb8, 0.5);
  // Night rig: one cool light from behind-right, grazing the edge
  const rim = new THREE.DirectionalLight(0xcfe0ff, 0);
  rim.position.set(900, 250, -500);
  const rim2 = new THREE.DirectionalLight(0xcfe0ff, 0);
  rim2.position.set(700, -200, -300);
  scene.add(key, fill, rim, rim2);

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
    if (M.shell.test(m.name)) shells.push(m); // roughness/metalness as authored (satin, stage 1)
    if (M.liner.test(m.name)) m.envMapIntensity = 0.5;
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

  let lastAlpha = -1;
  const apply = (p: Pose, extra: { breathe?: number } = {}) => {
    // width: fraction of viewport width, but never taller than 82% of the viewport
    const w = Math.min(p.w * W, H * 0.82) * (1 + (extra.breathe ?? 0));
    pivot.position.set(p.x * W, p.y * H, 0);
    pivot.scale.setScalar(w / ringSize);
    pivot.rotation.set(p.rx, p.ry, p.rz, 'YXZ');
    spinner.rotation.z = p.spin;

    const n = Math.min(1, Math.max(0, p.light));
    key.intensity = 2.0 * (1 - n);
    fill.intensity = 0.5 * (1 - n);
    scene.environmentIntensity = 1 - 0.94 * n;
    rim.intensity = 9 * n;
    rim2.intensity = 3 * n;
    for (const m of shells) m.envMapIntensity = 1.2 - 0.8 * n;

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
