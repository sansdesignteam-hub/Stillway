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
  // S10 Lamp light (D-100): one warm desk lamp from the side — an amber highlight along the band edge
  // facing it, readable on all three finishes (Black included); the env and base colours stay as in
  // Daylight, so Gold keeps its 18K yellow (the Lamp env made it brownish)
  const deskLamp = new THREE.DirectionalLight(0xffa451, 0);
  deskLamp.position.set(-900, 300, 700);
  const deskFill = new THREE.PointLight(0xff9a3c, 0, 0, 0);
  scene.add(deskLamp, deskFill);
  // S03 corner light (D-136, Avoly ref): one soft warm light from the upper right corner, above and
  // a little in front, so the band catches a warm sheen on its top edge; low, the silver stays silver
  const cornerLight = new THREE.DirectionalLight(0xffd2a8, 0);
  cornerLight.position.set(700, 900, 350);
  scene.add(cornerLight);
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
     ring seat (profile reversed so the faces point outward, as ring-test/s06.html); depth only, drawn before the ring so the back of the band hides behind the finger */
  const PROFILE = [[0, 337], [15, 334], [28, 320], [35, 300], [38, 280], [40, 260], [42, 220], [44.6, 160], [48, 120], [47, 60], [46, 0], [48, -110], [0, -110]];
  const finger = new THREE.Mesh(
    new THREE.LatheGeometry(PROFILE.map(([r, y]) => new THREE.Vector2(r * 1.02, y)).reverse(), 48),
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, side: THREE.DoubleSide }),
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
  /* S10–S11 finishes (finishes.json silver/black/gold = *_polished, D-085): no brushing (normal 0,
     anisotropy 0), Black with a thin clearcoat. Index 0 silver, 1 black, 2 gold. */
  const FIN = [
    { band: { color: lin(0.92, 0.92, 0.93), roughness: 0.06, cc: 0, ccr: 0, env: 1.5 }, engrave: { color: lin(0.28, 0.28, 0.29), roughness: 0.38, cc: 0, ccr: 0, env: 1.0 } },
    { band: { color: lin(0.035, 0.035, 0.04), roughness: 0.07, cc: 0.3, ccr: 0.03, env: 1.5 }, engrave: { color: lin(0.24, 0.24, 0.25), roughness: 0.5, cc: 0, ccr: 0, env: 1.0 } },
    // Gold: finishes.json gold_polished, warmed a little and given more env so AgX keeps it a bright 18K
    // yellow instead of olive (D-098 r1; the user rejected brownish Gold in D-078/D-079)
    { band: { color: lin(1.0, 0.66, 0.15), roughness: 0.06, cc: 0, ccr: 0, env: 2.3 }, engrave: { color: lin(0.4, 0.28, 0.1), roughness: 0.38, cc: 0, ccr: 0, env: 1.0 } },
  ];
  const finSpec = (part: 'band' | 'engrave', a: number, b: number, t: number) => {
    const A = FIN[Math.round(a)]?.[part] ?? FIN[0][part];
    const B = FIN[Math.round(b)]?.[part] ?? FIN[0][part];
    const k = (x: number, y: number) => x + (y - x) * t;
    return { color: A.color.clone().lerp(B.color, t), roughness: k(A.roughness, B.roughness), cc: k(A.cc, B.cc), ccr: k(A.ccr, B.ccr), env: k(A.env, B.env) };
  };
  const applyFin = (m: THREE.MeshPhysicalMaterial | undefined, part: 'band' | 'engrave', p: Pose) => {
    if (!m) return;
    const target = finSpec(part, p.finA, p.finB, p.finT);
    const base = FIN[0][part];
    const g = p.custom;
    m.color.copy(base.color).lerp(target.color, g);
    m.roughness = base.roughness + (target.roughness - base.roughness) * g;
    m.envMapIntensity = base.env + (target.env - base.env) * g;
    if ('clearcoat' in m) {
      m.clearcoat = target.cc * g;
      m.clearcoatRoughness = target.ccr;
    }
  };
  let lastFin = '';
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

  /* S06 pine table (D-146, HANDOFF-s06-table.md). Its own scene and lights, drawn before the ring with
     the same camera and depth buffer, so the warm key + hemisphere fill light only the wood and the
     ring looks exactly as before. Loaded lazily after the ring; until then (and without WebGL) the
     CSS table in Details.astro shows. Contact shadow: two soft planes on the top surface under the
     ring (a tight one at the touch point, a wider one back-right like the review render). */
  const tableScene = new THREE.Scene();
  const tableRoot = new THREE.Group();
  tableScene.add(tableRoot);
  const tableKey = new THREE.DirectionalLight(0xffe6c7, 2.8);
  tableKey.position.set(-600, 900, 700);
  tableScene.add(tableKey, tableKey.target, new THREE.HemisphereLight(0xfff1dc, 0xd9ccb8, 0.75));
  const shadowTex = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const g = cv.getContext('2d')!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,1)');
    grd.addColorStop(0.5, 'rgba(0,0,0,0.35)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(cv);
  })();
  const shadowPlane = (o: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: shadowTex, color: 0x231f20, transparent: true, opacity: o, depthWrite: false, toneMapped: false }),
    );
    m.rotation.x = -Math.PI / 2;
    m.renderOrder = 1;
    tableScene.add(m);
    return m;
  };
  const contactTight = shadowPlane(0.35);
  const contactWide = shadowPlane(0.16);
  let table: THREE.Object3D | null = null;
  const tableMats: THREE.MeshStandardMaterial[] = [];
  let tableLoading = false;
  const loadTable = () => {
    if (tableLoading) return;
    tableLoading = true;
    new GLTFLoader()
      .loadAsync(RING_MODEL.tableUrl)
      .then((g) => {
        table = g.scene;
        const aniso = renderer.capabilities.getMaxAnisotropy();
        table.traverse((o) => {
          if (!o.isMesh) return;
          const m = o.material as THREE.MeshStandardMaterial;
          for (const t of [m.map, m.roughnessMap, m.metalnessMap, m.normalMap]) if (t) t.anisotropy = aniso;
          m.transparent = true; // fades with S06 (opacity set per frame)
          tableMats.push(m);
        });
        tableRoot.add(table);
        document.documentElement.classList.add('table-ready');
        lastTableKey = '';
      })
      .catch(() => {
        /* the CSS table stays */
      });
  };
  // lazily, once the first paint is done (it is needed from S06 on)
  setTimeout(() => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(loadTable, { timeout: 3000 }) : loadTable()), 2500);
  let lastTableKey = '';

  /* S08: window A lit in the three mode colours (D-062), a soft flare sprite and the coloured bounce
     on the inner band (point light). Placed at the LED mesh centre, nudged toward the ring axis. */
  const LED_COLS = [new THREE.Color('#34E07A'), new THREE.Color('#3B8CFF'), new THREE.Color('#A06BFF')];
  const ledColor = (c: number) => {
    const k = Math.min(2, Math.max(0, c));
    const i = Math.min(1, Math.floor(k));
    return LED_COLS[i].clone().lerp(LED_COLS[i + 1], k - i);
  };
  const flareTex = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const g = cv.getContext('2d')!;
    const glow = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    glow.addColorStop(0, 'rgba(255,255,255,1)');
    glow.addColorStop(0.08, 'rgba(255,255,255,0.85)');
    glow.addColorStop(0.3, 'rgba(255,255,255,0.22)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, 256, 256);
    // one thin streak across (the client reference's flare line)
    const st = g.createLinearGradient(0, 0, 256, 0);
    st.addColorStop(0, 'rgba(255,255,255,0)');
    st.addColorStop(0.5, 'rgba(255,255,255,0.9)');
    st.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = st;
    g.fillRect(0, 126, 256, 4);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const flare = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: flareTex, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true, toneMapped: false, opacity: 0 }),
  );
  flare.material.rotation = -0.42;
  flare.renderOrder = 10;
  flare.visible = false;
  const bounce = new THREE.PointLight(0x34e07a, 0, 0, 0);
  const ledMesh = ring.getObjectByName(RING_MODEL.meshes.ledMain) as THREE.Mesh | undefined;
  if (ledMesh) {
    ring.updateMatrixWorld(true);
    const bb = new THREE.Box3().setFromObject(ledMesh);
    const c = bb.getCenter(new THREE.Vector3());
    const local = ring.worldToLocal(c.clone());
    // toward the axis (the window faces the skin, inward)
    const inward = new THREE.Vector3(-local.x, -local.y, 0).normalize().multiplyScalar(ringSize * 0.04);
    flare.position.copy(local).add(inward);
    bounce.position.copy(local).add(inward.multiplyScalar(2));
    ring.add(flare, bounce);
  }

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
  let lastBlur = 0;
  let lastEnv = '';
  let lastLedKey = '';
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
    // S06 table: scale = ring px per metre, origin at the contact line, x 0 = middle of the screen
    const tk = `${p.table.toFixed(3)}|${p.tableD.toFixed(1)}|${p.tableY.toFixed(4)}|${W}x${H}`;
    tableRoot.visible = p.table > 0.002;
    if (tableRoot.visible && tk !== lastTableKey) {
      lastTableKey = tk;
      const s = p.tableD / 0.02384;
      tableRoot.scale.setScalar(s);
      tableRoot.position.set(0, p.tableY * H, 0);
      tableMats.forEach((m) => (m.opacity = Math.min(1, p.table)));
    }
    if (tableRoot.visible) {
      // contact shadows follow the ring on the top surface (just above it, in table space)
      const ux = pivot.position.x;
      const y = p.tableY * H + 0.15;
      const D = p.tableD;
      contactTight.position.set(ux, y, 0);
      contactTight.scale.set(0.55 * D, 0.32 * D, 1);
      contactWide.position.set(ux + 0.12 * D, y, -0.3 * D);
      contactWide.scale.set(1.15 * D, 0.9 * D, 1);
      const so = Math.max(0, p.tableShadow) * Math.min(1, p.table);
      (contactTight.material as THREE.MeshBasicMaterial).opacity = 0.35 * so;
      (contactWide.material as THREE.MeshBasicMaterial).opacity = 0.16 * so;
      contactTight.visible = contactWide.visible = so > 0.003;
    }

    // finish: brushed → polished (V1)
    const finKey = `${p.gloss}|${p.custom.toFixed(3)}|${p.finA}|${p.finB}|${p.finT.toFixed(3)}`;
    if (finKey !== lastFin) {
      lastFin = finKey;
      mix(band, brushed.band, POLISHED.band, p.gloss);
      mix(engrave, brushed.engrave, POLISHED.engrave, p.gloss);
      if (p.custom > 0.001) {
        applyFin(band, 'band', p);
        applyFin(engrave, 'engrave', p);
      } else {
        if (band && 'clearcoat' in band) band.clearcoat = 0;
      }
    }

    // V1 rig and cast shadow, S01 only
    sun.intensity = 2.2 * p.photo;
    hemi.intensity = 0.35 * p.photo;
    rim.intensity = 14 * p.rim;
    rimFill.intensity = 3.2 * p.rim;
    warmRim.intensity = 7 * p.warm;
    const lp = Math.min(1, Math.max(0, p.lamp));
    deskLamp.intensity = 9 * lp;
    // a soft close fill on the lamp side so the edge glows rather than shows one sharp line
    deskFill.intensity = 2.2 * lp;
    deskFill.position.set(pivot.position.x - w * 1.1, pivot.position.y + w * 0.45, w * 0.6);
    deskFill.distance = w * 2.6;
    cornerLight.intensity = 9 * Math.min(1, Math.max(0, p.corner));
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
    // under the desk lamp the room is a little dimmer (evening), so the amber edge reads (D-100)
    scene.environmentIntensity = (0.45 + 0.55 * dip) * (1 + 1.4 * p.rim) * (1 - 0.12 * lp) * (1 - 0.7 * Math.min(1.4, Math.max(0, p.envDim)));

    const ledKey = p.led.toFixed(3) + '|' + p.ledc.toFixed(3);
    if (ledKey !== lastLedKey) {
      lastLedKey = ledKey;
      setLed(p.led > 0.01 ? '#' + ledColor(p.ledc).getHexString() : null, RING_MODEL.ledIntensity * p.led);
    }
    const fl = Math.max(0, p.flare);
    flare.visible = fl > 0.005;
    bounce.intensity = 0;
    if (flare.visible) {
      const col = ledColor(p.ledc);
      flare.material.color.copy(col);
      flare.material.opacity = Math.min(1, fl);
      flare.scale.set(ringSize * 0.6, ringSize * 0.6, 1);
      bounce.color.copy(col);
      bounce.distance = w * 0.9;
      bounce.intensity = 2.4 * fl;
    }
    if (p.alpha !== lastAlpha) {
      lastAlpha = p.alpha;
      canvas.style.opacity = String(p.alpha);
    }
    // 03 → 04 lens (D-138): the camera passes through the hole, the ring goes soft
    const bl = Math.round(Math.max(0, p.blur) * 10) / 10;
    if (bl !== lastBlur) {
      lastBlur = bl;
      canvas.style.filter = bl > 0.05 ? `blur(${bl}px)` : '';
    }
  };

  const render = () => {
    if (lastAlpha <= 0.001 || !W) return;
    if (table && tableRoot.visible) {
      // the table first (its own lights), then the ring over it in the same depth buffer
      tableScene.environment = scene.environment;
      tableScene.environmentIntensity = 1;
      renderer.autoClear = false;
      renderer.clear();
      renderer.render(tableScene, camera);
      renderer.render(scene, camera);
      renderer.autoClear = true;
      return;
    }
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
