// @ts-nocheck — three.js types are not installed on purpose (same as V1).
/**
 * Reusable WebGL ring stage for V2, distilled from V1's heroRing.ts and closeRing.ts.
 *
 * One stage = one canvas + one copy of the ring. Units: 1 world unit = 1 CSS px at z = 0, so a
 * section can place the ring with DOM measurements (x/y from the container centre, y up).
 *
 *   const stage = await createRingStage({ canvas, container, lighting: 'night' });
 *   stage.place({ x: 0, y: 0, width: 420 });
 *   stage.setPose(POSES.front);
 *   stage.setLed(LED.sleep, 3);
 *   stage.onFrame((time) => { stage.pivot.rotation.y = time * 0.2; });
 *
 * - Renders only while the container is near the viewport.
 * - Returns null when WebGL is missing; sections keep a poster image as fallback.
 * - Import it lazily (see ring/index.ts) so three.js is its own chunk.
 *
 * Open: one stage per section vs. one shared fixed canvas for the whole page — decide with
 * HANDOFF-v2.md (the storyboard keeps the same ring across sections 01→02→03 and 05→06).
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { gsap } from 'gsap';
import { LIGHTING, type Lighting, type RingPose } from './poses';

export const RING_MODEL = '/models/stillway-ring-silver_web.glb';
const DRACO_PATH = '/draco/';
const FOV = 30;

export interface RingStageOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement; // size source + visibility target
  lighting?: keyof typeof LIGHTING | Lighting;
  model?: string;
  shadows?: boolean;
}

export interface RingStage {
  THREE: typeof THREE;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pivot: THREE.Group; // animate this: position / scale / rotation
  pose: THREE.Group; // fixed pose inside the pivot
  ring: THREE.Object3D;
  ringSize: number; // outer diameter in model units
  leds: THREE.MeshStandardMaterial[];
  size: () => { W: number; H: number };
  place: (p: { x: number; y: number; width: number }) => void;
  setPose: (p: RingPose) => void;
  setLed: (color: string | number, intensity?: number) => void;
  onFrame: (fn: (time: number) => void) => () => void;
  dispose: () => void;
}

let dracoLoader: DRACOLoader | null = null;
let modelCache = new Map<string, Promise<THREE.Group>>();
function loadModel(url: string) {
  if (!modelCache.has(url)) {
    dracoLoader ??= new DRACOLoader().setDecoderPath(DRACO_PATH);
    const loader = new GLTFLoader().setDRACOLoader(dracoLoader);
    modelCache.set(
      url,
      new Promise((res, rej) => loader.load(url, (g) => res(g.scene), undefined, rej)),
    );
  }
  // each stage gets its own copy (materials cloned so LEDs/finishes are independent)
  return modelCache.get(url)!.then((src) => {
    const c = src.clone(true);
    c.traverse((o) => o.isMesh && (o.material = o.material.clone()));
    return c;
  });
}

export async function createRingStage(opts: RingStageOptions): Promise<RingStage | null> {
  const { canvas, container, model = RING_MODEL, shadows = false } = opts;
  const L: Lighting = typeof opts.lighting === 'object' ? opts.lighting : LIGHTING[opts.lighting ?? 'day'];

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
  renderer.toneMappingExposure = L.exposure;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 20000);

  const pmrem = new THREE.PMREMGenerator(renderer);
  new THREE.TextureLoader().load(L.env, (tex) => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = pmrem.fromEquirectangular(tex).texture;
    scene.environmentRotation = new THREE.Euler(0, L.envRotationY, 0);
    scene.environmentIntensity = L.envIntensity;
    tex.dispose();
  });
  for (const l of L.lights) {
    if (l.kind === 'dir') {
      const d = new THREE.DirectionalLight(l.color, l.intensity);
      d.position.set(...l.position);
      scene.add(d);
    } else scene.add(new THREE.HemisphereLight(l.sky, l.ground, l.intensity));
  }

  const pivot = new THREE.Group();
  const pose = new THREE.Group();
  pivot.add(pose);
  scene.add(pivot);

  let ring: THREE.Object3D;
  try {
    ring = await loadModel(model);
  } catch {
    renderer.dispose();
    return null;
  }
  const box = new THREE.Box3().setFromObject(ring);
  ring.position.sub(box.getCenter(new THREE.Vector3()));
  const ringSize = box.getSize(new THREE.Vector3()).x;
  const leds: THREE.MeshStandardMaterial[] = [];
  ring.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = shadows;
    const m = o.material;
    if (/Silver/i.test(m.name)) {
      m.envMapIntensity = L.silver.envMapIntensity;
      m.roughness = L.silver.roughness;
      if (L.silver.tint) m.color.set(L.silver.tint);
    }
    if (/Liner/i.test(m.name)) m.envMapIntensity = L.liner;
    if (/Glass|Frame/i.test(m.name)) m.envMapIntensity = 0.9;
    if (/LED/i.test(m.name)) leds.push(m);
  });
  pose.add(ring);

  function setPose({ theta, phi, psi, scale, roll = 0 }: RingPose) {
    const d = THREE.MathUtils.degToRad;
    const a = new THREE.Vector3(Math.sin(d(phi)) * Math.cos(d(theta)), Math.sin(d(phi)) * Math.sin(d(theta)), Math.cos(d(phi)));
    const r = new THREE.Vector3(0, 0, -1).addScaledVector(a, Math.cos(d(phi))).normalize().applyAxisAngle(a, d(psi));
    if (r.lengthSq() < 1e-6) r.set(0, 1, 0); // phi = 0: axis points at the camera
    const xw = r.clone().negate();
    const zw = a;
    const yw = zw.clone().cross(xw);
    pose.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xw, yw, zw));
    if (roll) pose.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), d(roll)));
    pose.scale.setScalar(scale);
  }

  function setLed(color: string | number, intensity = 3) {
    for (const m of leds) {
      m.emissive = new THREE.Color(color);
      m.emissiveIntensity = intensity;
      m.toneMapped = false;
    }
  }

  let W = 0;
  let H = 0;
  function resize() {
    W = container.clientWidth;
    H = container.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const place = ({ x, y, width }: { x: number; y: number; width: number }) => {
    pivot.position.set(x, y, 0);
    pivot.scale.setScalar(width / ringSize);
  };

  let visible = false;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '10% 0px' });
  io.observe(container);

  const frames = new Set<(t: number) => void>();
  const loop = (time: number) => {
    if (!visible || !W) return;
    frames.forEach((f) => f(time));
    renderer.render(scene, camera);
  };
  gsap.ticker.add(loop);

  return {
    THREE,
    renderer,
    scene,
    camera,
    pivot,
    pose,
    ring,
    ringSize,
    leds,
    size: () => ({ W, H }),
    place,
    setPose,
    setLed,
    onFrame: (fn) => {
      frames.add(fn);
      return () => frames.delete(fn);
    },
    dispose: () => {
      gsap.ticker.remove(loop);
      ro.disconnect();
      io.disconnect();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
