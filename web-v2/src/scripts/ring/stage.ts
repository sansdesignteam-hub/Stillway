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
import { view } from '../viewport';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { loadExr, closeExr } from './exr';
import { RING_MODEL } from './model';
import type { Pose } from './poses';
import { heroBg } from '../../content/heroBg';

const FOV = 30;

export interface RingStage {
  apply: (p: Pose, extra?: { breathe?: number }) => void;
  render: () => void;
  /** D-191: prepare everything the first frame of this pose needs (programs, textures), in short turns */
  prime: (p: Pose, extra?: { breathe?: number }) => Promise<void>;
  /** QA27 G-19: compile, ahead of the scroll, every shader variant these poses will need */
  prewarm: (poses: Pose[]) => void;
  setLed: (color: string | 'off' | null, intensity?: number) => void;
  canvas: HTMLCanvasElement;
  three: typeof THREE;
  pivot: THREE.Group;
}

/**
 * D-191: setup is cut into short turns. Between two pieces of work the browser gets the main thread
 * back (input, paint), so no single task is long; the work and its order are the same.
 */
const breath = (): Promise<void> => (globalThis as any).scheduler?.yield?.() ?? new Promise((r) => setTimeout(r, 0));

export async function createRingStage(canvas: HTMLCanvasElement): Promise<RingStage | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;
  await breath();

  const isPhone = () => window.innerWidth < 720;
  /* D-182 edges: MSAA (antialias) only smooths silhouettes, not the polished band's thin highlights,
     and the old caps (phone 1.5, a 1× screen at 1) left stair steps. Desktop: supersample to 2× even on
     1× screens; phones: up to 2.5×. Large windows are held to a pixel budget so they stay at 60 fps,
     never below what they had before. */
  const pixelRatio = () => {
    const d = window.devicePixelRatio || 1;
    if (isPhone()) return Math.min(d, 2.5);
    const budget = Math.sqrt(5.6e6 / (view.w * view.lh));
    return Math.max(Math.min(d, 1.5), Math.min(2, budget));
  };
  /* D-191: the drawing buffer is sized here, while the GPU has nothing else to do, and only when the
     size or the ratio really changes. It used to be sized after the environments were built: on a
     slow or software GPU the resize then waited ~100 ms on the main thread for that work to finish. */
  let bufferKey = '';
  const sizeBuffer = () => {
    const pr = pixelRatio();
    const key = `${view.w}x${view.lh}@${pr}`;
    if (key === bufferKey) return;
    bufferKey = key;
    renderer.setDrawingBufferSize(view.w, view.lh, pr); // = setPixelRatio + setSize(w, h, false), one allocation
  };
  sizeBuffer();
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy(); // asked once, now: later the answer would wait for the GPU's queue
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
    paperTex = await loadExr(RING_MODEL.env.paper); // D-191: decoded in a worker
    paperTex.mapping = THREE.EquirectangularReflectionMapping;
    await breath();
    envs.paper = pmrem.fromEquirectangular(paperTex).texture;
    await breath();
  } catch {
    /* no env: the ring still renders, darker */
  }
  // the hero photograph as an equirect environment, exactly as V1 heroRing (D-081: not neutralised)
  try {
    photoTex = await new THREE.TextureLoader().loadAsync(RING_MODEL.env.photo);
    photoTex.mapping = THREE.EquirectangularReflectionMapping;
    photoTex.colorSpace = THREE.SRGBColorSpace;
    photoTex.generateMipmaps = false; // no mip jump at the wrap
    photoTex.minFilter = THREE.LinearFilter;
  } catch {
    /* falls back to paper */
  }
  /**
   * S01 → S02 must not pop (D-083): instead of swapping the photo env for the paper env at one
   * scroll point, prebuild BLEND_STEPS environments that mix the two (photo rotated 0.6π as in V1)
   * and step through them with pose.photo. A shader sphere renders the mix, PMREM bakes each step.
   */
  const buildBlends = async () => {
    if (!photoTex || !paperTex) return;
    renderer.initTexture(photoTex); // D-191: the photo's upload in its own turn, not inside the first blend
    await breath();
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
          // D-182: the photo's left and right edges do not match; reflected in the polished band that
          // wrap seam showed as a serrated line, so the two sides are cross-faded
          vec2 uv = equi(r);
          float seam = 0.5 * (1.0 - smoothstep(0.0, 0.12, min(uv.x, 1.0 - uv.x)));
          vec3 a = mix(texture2D(photo, uv).rgb, texture2D(photo, vec2(1.0 - uv.x, uv.y)).rgb, seam);
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
      await breath(); // D-191: one environment per turn
    }
    mat.dispose();
  };
  await buildBlends();
  let firstFrameDone = () => {};
  /** resolved by `prime`: the first frame of the ring comes before anything for later sections */
  const firstFrame = new Promise<void>((ok) => (firstFrameDone = ok));
  let lateAsset = () => {}; // set once prewarm exists (below)
  /** run in idle time; `left()` = ms left in this slice (Safari has no requestIdleCallback: 8 ms slices) */
  const idle = (fn: (left: () => number) => void) =>
    'requestIdleCallback' in window
      ? (window as any).requestIdleCallback((d: IdleDeadline) => fn(() => d.timeRemaining()), { timeout: 1500 })
      : setTimeout(() => { const t0 = performance.now(); fn(() => 8 - (performance.now() - t0)); }, 60);
  const loadEnv = (url: string) =>
    loadExr(url).then(async (t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      await breath();
      renderer.initTexture(t); // the upload and the prefiltering in two turns
      await breath();
      const env = pmrem.fromEquirectangular(t).texture;
      t.dispose();
      await gpuDone();
      return env;
    });
  /* D-191: what only the sections below the hero need — the night env (S03), the dusk env (S05) and
     the S06 table — comes after the ring's first frame, one after the other in idle time (they used
     to start on timers, 0.3 / 0.9 / 2.5 s into the ring's own loading, and competed with it). Each is
     cheap for the main thread now: decoded in a worker, uploaded in strips. Loading them only once the
     visitor moves was tried and dropped: on a real GPU the prefiltering and the mipmaps then cost two
     or three 50–80 ms frames in the visitor's first second of interaction. */
  const idleTurn = () => new Promise<void>((next) => idle(() => next()));
  const lateAssets = async () => {
    await firstFrame;
    for (const k of ['night', 'dusk'] as const) {
      await idleTurn();
      try {
        envs[k] = await loadEnv(RING_MODEL.env[k]);
        lastEnv = '';
        lateAsset();
      } catch {
        /* the stage keeps the env it has */
      }
    }
    closeExr();
    await idleTurn();
    loadTable();
  };
  lateAssets();
  scene.environment = blends[0] ?? envs.paper ?? null;

  // S01 rig, faded in with pose.photo (so S02 and the rest never see it). D-177, the warm desk photo:
  // the lamp is the key, upper right and a little in front (a warm highlight along the right of the
  // band); the hemisphere gives a dim warm wall above and the wood's warm bounce from below; the
  // dark (left) side only gets a soft fill. Replaces the V1 morning sun upper left / moss green.
  const sun = new THREE.DirectionalLight(0xffdcb2, 0);
  sun.position.set(720, 640, 420);
  const hemi = new THREE.HemisphereLight(0x5a4a3e, 0x8a6040, 0);
  const fill = new THREE.DirectionalLight(0xffe7cf, 0);
  fill.position.set(-700, 120, 600);
  scene.add(sun, hemi, fill);
  // S03 (Ultrahuman ref): one cold light grazing the band edge from behind one side, so a dark
  // polished ring still reads as silver along its bevel
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0);
  rim.position.set(900, 420, -650);
  // a low, cool front fill so the outer band reads as silver (not black) on Night (D-090)
  const rimFill = new THREE.DirectionalLight(0xdfe8ff, 0);
  rimFill.position.set(-700, 260, 900);
  scene.add(rim, rimFill);
  /** a Cocoa primitive from tokens.css: the warm lights of the dark sections use that ramp (D-168) */
  const cocoa = (step: number) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(`--cocoa-${step}`).trim());
  // S05: one weak warm rim from the Dusk glow (lower left); the env stays neutral (D-090 r1)
  const warmRim = new THREE.DirectionalLight(cocoa(300), 0);
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
  const cornerLight = new THREE.DirectionalLight(cocoa(200), 0);
  cornerLight.position.set(700, 900, 350);
  scene.add(cornerLight);
  // S03 state 1 (QA SL-02): one cold light from behind on the left — only that edge of the band
  // catches it; no fill light, no env lift
  const coldEdge = new THREE.DirectionalLight(0xdfe8ff, 0);
  coldEdge.position.set(-1000, 260, -760);
  scene.add(coldEdge);
  /* D-179 S01 desk: the 3D Designer's pedestal (s01-pedestal.glb) on the ring's canvas, a transparent
     shadow catcher on the desk and one warm key light from the lamp (upper right, behind) that casts
     the ring + pedestal shadows: the ring's shadow runs over the pedestal top, down its front and on
     across the desk, to the left and forward. Replaces the D-178 stencil-masked receivers (the photo
     has no pedestal any more). Everything sits in one group in the pose JSON's own space (metres,
     Y up); the group is placed so the 3D Designer's camera, matched to the photo (heroBg.cam), is
     this stage's camera (see placeDesk). Pose values (ring rest height included) come from the JSON
     at runtime, so a revised GLB + JSON swap in without code changes. */
  /* D-179 1b: light values come from the pose JSON (lights.key.intensity, lights.fill,
     lights.pedestal_envMapIntensity); these are only the fallbacks and one gain each, tuned by eye
     against the 3D Designer's poster, so a new JSON drop retunes itself */
  const LAMP_GAIN = 1;
  const SHADOW_RADIUS = 24;
  /* D-181c catcher density, physical: the ring's shadow takes the KEY away and leaves the rest, so
       alpha = K / (K + S + A)
     K = key irradiance n·l (1 = facing the key), S = the plate-only spill lamp at that point from the
     JSON (lights.spill: facing value × (d0 / d)² × cos, zero where the pedestal shades it), A = the
     remaining ambient. Only A is fitted: from the 3D Designer's ring overlay (alpha of its #2A1608
     shadow) 0.70–0.74 on the desk inside the pedestal's spill shade → A ≈ 0.29 (0.15 used: the far, wide
     PCSS penumbra thins the live shadow there, measured against the poster), and ≈ 0.34 on the top
     left of the ring → A ≈ 0.58 (the top sees more of the room). `side` is the least alpha on faces
     the key does not reach (the ring takes bounce away there). A later JSON can set
     desk.catcher_ambient / pedestal.catcher_ambient / pedestal.catcher_side_opacity. */
  /* D-186: both densities × a gain (poster/live mean darkening was 0.204 / 0.159). `fill` / `soft` soften
     the desk mask around the pedestal's own baked shadow: with a hard, full mask the ring's far shadow
     read as a thin arc round it */
  const CATCH = { deskAmb: 0.15, topAmb: 0.58, side: 0.1, deskGain: 0.88, topGain: 1.65, fill: 0.3, soft: 0.003 };
  let LAMP = 2.6;
  /* D-181: the pedestal is no longer shaded here. It is rendered once in Cycles INTO the photo (the
     plate: oak, contact shadow, bounce, AO), and this stage only keeps its shape as an invisible
     proxy: (a) depth only (colorWrite off), so the ring is hidden where the pedestal is in front,
     and (b) a shadow catcher on the same geometry (top, lip, sides) plus the desk plane, which lays
     the moving ring's PCSS shadow over the plate. The canvas is alpha-composited over the photo, so
     a near-black catcher at alpha a is a multiply by (1 − a).
     The proxy casts nothing (its own shadow is in the plate), so the catcher has to know where the
     key light does not reach anyway, or the ring's shadow would darken the plate twice:
       pedestal faces  the key's Lambert term n·l (zero on the left / front faces, soft over the lip)
       desk            the pedestal's own shadow, analytically (rounded-rect prism along the light)
     and alpha = r·n·l / (1 + r·n·l): a shadow takes away the key and leaves the ambient, r = key /
     ambient, set from the opacity asked for a horizontal face (JSON desk.opacity / pedestal.shadowOpacity). */
  renderer.shadowMap.enabled = true;
  /* D-180c: contact-hardening soft shadows (PCSS). The only shadow caster on the page is the S01 lamp
     key, so the map is a plain depth map (Basic) and the two S01 receivers — pedestal and desk
     catcher — get a PCSS getShadow (blocker search → penumbra ∝ blocker distance × light size → PCF),
     so the shadow is dark and tight at the ring's contact and widens and fades with distance, like the
     Cycles area light (Ø55 mm at 333 mm). Nothing outside S01 receives shadows. */
  renderer.shadowMap.type = THREE.BasicShadowMap;
  const PCSS = {
    uLightTan: { value: 0.0826 }, // tan of the light's half-angle: 27.5 mm / 333 mm (HANDOFF, Cycles key)
    uDepthRange: { value: 1 }, // shadow camera far − near (world)
    uFrustumW: { value: 1 }, // shadow camera width (world)
    // D-181 catcher (pedestal-local space, metres)
    uToPed: { value: new THREE.Matrix4() }, // world → pedestal local
    uPedL: { value: new THREE.Vector3(0.57, 0.738, -0.36) }, // unit vector toward the key light
    uPedBox: { value: new THREE.Vector4(0.0205, 0.0068, 0.0128, 0.0053) }, // half width, top y, half depth, corner radius
    /* the plate-only lamp spill (JSON lights.spill). NOT a light here: the catchers only need to know
       how much of it reaches each point of the plate. Fallbacks = the D-181c JSON values */
    uSpillPos: { value: new THREE.Vector3(0.125, 0.058, -0.05) }, // pedestal-local
    uSpillF: { value: 2.374 * 0.14506 * 0.14506 }, // irradiance facing the lamp (key facing = 1) × d0²
    uSpillTan: { value: 0.03 / 0.14506 }, // disk radius / distance
    /* D-181c contact occlusion (pedestal-local): the strip of the band that touches the top this frame
       (centre x, y, z + half-length; direction in the XZ plane) and its strength. The pedestal catcher
       darkens around it by 3D distance, so it runs over the lip and stays on the pedestal */
    uTouch: { value: new THREE.Vector4(0, 0, 0, 0) },
    uTouchDir: { value: new THREE.Vector3(1, 0, 0) }, // x, z of the strip direction; z = strength 0..1
    uOver: { value: new THREE.Vector2(0, 0) }, // x, z under the part of the band that hovers low next to the touch
  };
  const PCSS_N = isPhone() ? 12 : 24; // PCF taps
  const PCSS_B = isPhone() ? 8 : 16; // blocker-search taps
  const pcssChunk = THREE.ShaderChunk.shadowmap_pars_fragment.replace(
    // the Basic getShadow (the bundled chunk has its comments stripped, so match code only)
    /#else\s*float getShadow\( sampler2D shadowMap[\s\S]*?return mix\( 1\.0, shadow, shadowIntensity \);\s*\}/,
    `#else
      uniform float uLightTan; uniform float uDepthRange; uniform float uFrustumW;
      float pcssIGN( vec2 p ) { return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) ); }
      vec2 pcssDisk( int i, int n, float phi ) { float r = sqrt( ( float( i ) + 0.5 ) / float( n ) ); float t = float( i ) * 2.399963 + phi; return vec2( cos( t ), sin( t ) ) * r; }
      float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
        shadowCoord.xyz /= shadowCoord.w;
        shadowCoord.z += shadowBias;
        if ( shadowCoord.x < 0.0 || shadowCoord.x > 1.0 || shadowCoord.y < 0.0 || shadowCoord.y > 1.0 || shadowCoord.z > 1.0 ) return 1.0;
        float phi = pcssIGN( gl_FragCoord.xy ) * 6.2831853;
        float texel = 1.0 / shadowMapSize.x;
        // blocker search over the light's footprint for the farthest plausible blocker (~45 mm)
        // blockers up to half the frustum (~45 mm) away: their penumbra radius is uLightTan · W/2
        float searchUV = max( uLightTan * 0.5, 4.0 * texel );
        float blk = 0.0; float nb = 0.0;
        for ( int i = 0; i < ${PCSS_B}; i ++ ) {
          float d = texture2D( shadowMap, shadowCoord.xy + pcssDisk( i, ${PCSS_B}, phi ) * searchUV ).r;
          if ( d < shadowCoord.z ) { blk += d; nb += 1.0; }
        }
        if ( nb < 0.5 ) return 1.0;
        blk /= nb;
        float distW = ( shadowCoord.z - blk ) * uDepthRange;            // receiver − blocker, world
        float pen = distW * uLightTan / max( uFrustumW, 1e-6 );  // penumbra radius, uv
        pen = clamp( pen, 1.5 * texel, searchUV );
        float lit = 0.0;
        for ( int i = 0; i < ${PCSS_N}; i ++ ) {
          float d = texture2D( shadowMap, shadowCoord.xy + pcssDisk( i, ${PCSS_N}, phi ) * pen ).r;
          lit += step( shadowCoord.z, d );
        }
        float shadow = lit / float( ${PCSS_N} );
        return mix( 1.0, shadow, shadowIntensity );
      }`,
  );
  if (pcssChunk === THREE.ShaderChunk.shadowmap_pars_fragment) console.warn('PCSS: shadow chunk not patched');
  /** a ShadowMaterial catcher for the ring's shadow on the plate: `ped` = on the pedestal proxy
   *  (masked by the key's n·l), else on the desk (masked by the pedestal's own shadow) */
  const catcher = (ped: boolean) => {
    const m = new THREE.ShadowMaterial({ color: 0x2a1608, opacity: 0, transparent: true, depthWrite: false, toneMapped: false }); // the overlay's exact shadow colour, not AgX-lifted
    const uRatio = { value: 0.3 }; // ambient A (key facing = 1)
    const uFloor = { value: 0 }; // least alpha on faces the key does not reach (the ring also blocks the bounce there)
    m.userData.ratio = uRatio;
    m.userData.floor = uFloor;
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, PCSS, { uAmb: uRatio, uSideFloor: uFloor });
      sh.vertexShader = sh.vertexShader
        .replace('void main() {', 'uniform mat4 uToPed; varying vec3 vPedPos; varying vec3 vPedN;\nvoid main() {')
        .replace(
          '#include <worldpos_vertex>',
          `#include <worldpos_vertex>
          mat4 toPed = uToPed * modelMatrix;
          vPedPos = ( toPed * vec4( transformed, 1.0 ) ).xyz;
          vPedN = mat3( toPed ) * objectNormal;`,
        );
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <shadowmap_pars_fragment>', pcssChunk)
        .replace(
          'void main() {',
          `uniform vec3 uPedL; uniform vec4 uPedBox; uniform vec4 uTouch; uniform vec3 uTouchDir; uniform vec2 uOver; uniform float uAmb; uniform float uSideFloor; uniform vec3 uSpillPos; uniform float uSpillF; uniform float uSpillTan; varying vec3 vPedPos; varying vec3 vPedN;
          // 1 where the key light reaches the desk, 0 inside the pedestal's own shadow (soft edge that
          // widens with the distance to the casting edge, like the PCSS penumbra)
          float pedLit( vec3 P, vec3 L, float tanA, float soft ) {
            float tTop = uPedBox.y / L.y;
            float best = 1.0; float bt = 0.0;
            for ( int i = 0; i < 12; i ++ ) {
              float t = tTop * ( float( i ) + 0.5 ) / 12.0;
              vec2 q = abs( P.xz + L.xz * t ) - ( uPedBox.xz - uPedBox.w );
              float d = length( max( q, 0.0 ) ) + min( max( q.x, q.y ), 0.0 ) - uPedBox.w;
              if ( d < best ) { best = d; bt = t; }
            }
            float pw = max( soft, tanA * bt );
            return smoothstep( - pw, pw, best );
          }
          void main() {`,
        )
        .replace(
          'gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );',
          `vec3 n = ${ped ? 'normalize( vPedN )' : 'vec3( 0.0, 1.0, 0.0 )'};
          float K = max( dot( n, uPedL ), 0.0 );
          vec3 toS = uSpillPos - vPedPos; float dS = length( toS ); toS /= dS;
          float S = uSpillF / ( dS * dS ) * max( dot( n, toS ), 0.0 );
          ${
            ped
              ? `float a0 = max( K / ( K + S + uAmb ), uSideFloor );
          float a = min( ${CATCH.topGain.toFixed(4)} * a0, max( a0, 0.82 ) );
          // contact occlusion: distance to the touching strip; measured on the 3D Designer's overlay
          // (82f67c3): alpha 1 within ~2 mm of the band, 0.67 at 5.5 mm, 0.4 at 8 mm, gone by ~11.5 mm
          vec3 tp = vPedPos - uTouch.xyz;
          float tl = clamp( dot( tp.xz, uTouchDir.xy ), - uTouch.w, uTouch.w );
          float td = length( vec3( tp.x - uTouchDir.x * tl, tp.y, tp.z - uTouchDir.y * tl ) );
          // plus a weaker, wider occlusion under the band where it rises away from the touch
          float wl = clamp( dot( tp.xz, uTouchDir.xy ), - 0.010, 0.010 ); // the band hovers low ~10 mm either way along its tangent
          float ov = 0.72 * ( 1.0 - smoothstep( 0.003, 0.011, length( vec3( tp.x - uTouchDir.x * wl, tp.y, tp.z - uTouchDir.y * wl ) ) ) );
          float ao = uTouchDir.z * max( 1.0 - smoothstep( 0.002, 0.0115, td ), ov ) * smoothstep( -0.1, 0.45, n.y ); // top and lip, fading down the front face (as in the overlay)`
              : `// the pedestal shades the spill lamp front-left (there the key is the only light left, so the
          // ring's shadow is denser) and the key itself next to its base (no ring shadow at all)
          S *= pedLit( vPedPos, toS, uSpillTan, ${CATCH.soft.toFixed(4)} );
          float a0 = K / ( K + S + uAmb );
          float a = min( ${CATCH.deskGain.toFixed(4)} * a0, max( a0, 0.82 ) ) * mix( ${CATCH.fill.toFixed(4)}, 1.0, pedLit( vPedPos, uPedL, uLightTan, ${CATCH.soft.toFixed(4)} ) );`
          }
          gl_FragColor = vec4( color, opacity * ${ped ? '( 1.0 - ( 1.0 - a * ( 1.0 - getShadowMask() ) ) * ( 1.0 - ao ) )' : 'a * ( 1.0 - getShadowMask() )'} );`,
        );
      if (!sh.fragmentShader.includes('K + S + uAmb')) console.warn('catcher: ShadowMaterial not patched');
    };
    m.customProgramCacheKey = () => 'catch' + PCSS_N + (ped ? 'p' : 'd');
    return m;
  };
  const setCatch = (m: THREE.ShadowMaterial, amb: number, k: number) => {
    m.userData.ratio.value = Math.max(0, amb);
    m.opacity = k;
  };
  const desk = new THREE.Group();
  desk.matrixAutoUpdate = false;
  desk.visible = false;
  scene.add(desk);
  const lampKey = new THREE.DirectionalLight(0xffb370, 0);
  lampKey.castShadow = true;
  lampKey.shadow.mapSize.set(1024, 1024); // D-179 1b: VSM blurs in texels, so a coarser map gives the wide Cycles penumbra
  lampKey.shadow.radius = SHADOW_RADIUS;
  lampKey.shadow.blurSamples = 32;
  desk.add(lampKey, lampKey.target);
  const deskHemi = new THREE.HemisphereLight(0xffd9b0, 0x3a2414, 0); // JSON lights.fill, no front fill
  let deskHemiI = 0.25;
  desk.add(deskHemi);
  const deskMat = catcher(false);
  const pedCatch = catcher(true);
  pedCatch.polygonOffset = true; // same geometry as the depth proxy: never lose the depth test to it
  pedCatch.polygonOffsetFactor = -1;
  pedCatch.polygonOffsetUnits = -1;
  const pedDepth = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true });
  const deskPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), deskMat);
  deskPlane.rotation.x = -Math.PI / 2;
  deskPlane.receiveShadow = true;
  deskPlane.renderOrder = -1;
  desk.add(deskPlane);
  /** soft radial falloff for the ring's contact shade (the pedestal's own contact shade and AO are in the plate now) */
  const aoTex = (() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;
    const g = cv.getContext('2d')!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(0,0,0,1)');
    grd.addColorStop(0.55, 'rgba(0,0,0,0.6)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(cv);
  })();
  // ring → pedestal contact shade (Cycles' contact occlusion that a blurred VSM cannot give), placed
  // under the ring's lowest point in its JSON rest pose; fades as the ring lifts
  const contactMat = new THREE.MeshBasicMaterial({ map: aoTex, color: 0x140a03, transparent: true, opacity: 0, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), contactMat);
  contact.rotation.x = -Math.PI / 2;
  contact.renderOrder = -1;
  desk.add(contact);
  // D-181b polish: the tight, dark core of that contact (Figma shows it where the band touches the top)
  const coreMat = contactMat.clone();
  const core = new THREE.Mesh(contact.geometry, coreMat);
  core.renderOrder = -1;
  desk.add(core);
  const _inv = new THREE.Matrix4();
  const _toDesk = new THREE.Matrix4();
  /** where the ring touches the pedestal top right now (desk space), from its vertices as posed this
   *  frame, hover tilt included: centre, direction and half-length of the strip of the band within
   *  CONTACT_BAND of the top, and the gap between the lowest vertex and the top (0 while it rests) */
  const CONTACT_BAND = 0.0007;
  const touch = { x: 0, z: 0, ang: 0, len: 0, gap: 0, ox: 0, oz: 0, ok: false };
  const findTouch = () => {
    touch.ok = false;
    if (!deskPose || !ringPts.length) return touch;
    const top = deskPose.pedestal.top_y ?? 0;
    pivot.updateMatrix();
    _toDesk.multiplyMatrices(pivot.matrix, spinner.matrix).premultiply(_inv.copy(desk.matrix).invert());
    let minY = Infinity;
    const P: number[] = [];
    for (const v of ringPts) {
      _v.copy(v).applyMatrix4(_toDesk);
      if (_v.y < minY) minY = _v.y;
      if (_v.y < top + 0.004) P.push(_v.x, _v.y, _v.z);
    }
    let n = 0, sx = 0, sz = 0;
    for (let i = 0; i < P.length; i += 3) if (P[i + 1] < minY + CONTACT_BAND) (n++, (sx += P[i]), (sz += P[i + 2]));
    if (!n) return touch;
    const cx = sx / n, cz = sz / n;
    let xx = 0, zz = 0, xz = 0;
    for (let i = 0; i < P.length; i += 3) if (P[i + 1] < minY + CONTACT_BAND) { const dx = P[i] - cx, dz = P[i + 2] - cz; xx += dx * dx; zz += dz * dz; xz += dx * dz; }
    touch.x = cx; touch.z = cz;
    touch.ang = 0.5 * Math.atan2(2 * xz, xx - zz); // major axis of the strip in the XZ plane
    touch.len = Math.sqrt((xx + zz) / n);
    touch.gap = Math.max(0, minY - top);
    // where the band hovers low over the top next to the touch (within 3 mm): the wider occlusion
    let m = 0, ox = 0, oz = 0;
    for (let i = 0; i < P.length; i += 3) if (P[i + 1] < minY + 0.003) (m++, (ox += P[i]), (oz += P[i + 2]));
    touch.ox = ox / m; touch.oz = oz / m;
    touch.ok = true;
    return touch;
  };
  let contactKey = '';
  let contactLow: THREE.Vector3 | null = null;
  /** the ring's lowest point at rest (desk space, from the JSON pose + ring vertices): contact shade
   *  position and the pivot of the D-180 hover tilt while the ring rests */
  const restLow = () => {
    if (!deskPose || !ringPts.length) return null;
    const R = deskPose.ring;
    const ck = JSON.stringify([R.position, R.quaternion, R.scale, R.s01_scale]);
    if (ck !== contactKey) {
      contactKey = ck;
      const q = new THREE.Quaternion().fromArray(R.quaternion);
      const sc = (R.scale ?? 1) * (R.s01_scale ?? 1);
      const pos = new THREE.Vector3().fromArray(R.position);
      contactLow = null;
      for (const v of ringPts) {
        const w = v.clone().multiplyScalar(sc).applyQuaternion(q).add(pos);
        if (!contactLow || w.y < contactLow.y) contactLow = w;
      }
    }
    return contactLow;
  };
  let deskPose: any = null;
  let pedestal: THREE.Object3D | null = null;
  const deskCam = new THREE.PerspectiveCamera(); // the JSON camera (for its view rotation)
  const loadDesk = async () => {
    deskPose = await fetch(RING_MODEL.desk.pose).then((r) => r.json());
    const c = deskPose.camera;
    deskCam.position.fromArray(c.position);
    deskCam.lookAt(new THREE.Vector3().fromArray(c.lookAt));
    deskCam.updateMatrixWorld(true);
    const L = deskPose.lights.key;
    LAMP = (L.intensity ?? LAMP) * LAMP_GAIN;
    lampKey.color.set(L.color ?? '#FFB370');
    const Fl = deskPose.lights.fill;
    if (Fl?.type === 'HemisphereLight') {
      deskHemi.color.set(Fl.skyColor ?? '#FFD9B0');
      deskHemi.groundColor.set(Fl.groundColor ?? '#3A2414');
      deskHemiI = typeof Fl.intensity === 'number' ? Fl.intensity : 0.25;
    }
    lampKey.position.fromArray(L.position);
    lampKey.target.position.fromArray(L.target);
    const b = L.shadow.camera_bounds_m ?? 0.06;
    const sc = lampKey.shadow.camera;
    sc.left = sc.bottom = -b;
    sc.right = sc.top = b;
    sc.near = 0.01;
    sc.far = lampKey.position.distanceTo(lampKey.target.position) + 0.2;
    // D-180 follow-up: shadow map, blur and bias straight from the JSON (fe485f9)
    const ms = L.shadow.mapSize ?? 2048;
    lampKey.shadow.mapSize.set(ms, ms);
    lampKey.shadow.radius = L.shadow.radius ?? L.shadow.radius_PCFSoft ?? SHADOW_RADIUS;
    lampKey.shadow.blurSamples = L.shadow.blurSamples ?? 16;
    lampKey.shadow.bias = L.shadow.bias ?? -0.0002;
    lampKey.shadow.normalBias = L.shadow.normalBias ?? 0.0004;
    deskMat.color.set(deskPose.desk.color ?? '#2A1608');
    pedCatch.color.set(deskPose.pedestal.shadowColor ?? deskPose.desk.color ?? '#2A1608');
    if (L.light_tan) PCSS.uLightTan.value = L.light_tan;
    const draco = new DRACOLoader().setDecoderPath(RING_MODEL.dracoPath);
    const g = await new GLTFLoader().setDRACOLoader(draco).loadAsync(RING_MODEL.desk.url);
    pedestal = g.scene;
    pedestal.position.fromArray(deskPose.pedestal.position);
    pedestal.quaternion.fromArray(deskPose.pedestal.quaternion);
    pedestal.scale.setScalar(deskPose.pedestal.scale ?? 1);
    // D-181 proxy: depth only + the ring-shadow catcher on the same geometry; the GLB's oak material
    // and textures are dropped (the oak is in the plate)
    const meshes: THREE.Mesh[] = [];
    pedestal.traverse((o) => o.isMesh && meshes.push(o as THREE.Mesh));
    for (const o of meshes) {
      for (const m of [o.material].flat() as THREE.MeshStandardMaterial[]) {
        for (const t of [m.map, m.normalMap, m.roughnessMap, m.metalnessMap, m.aoMap, m.specularIntensityMap]) t?.dispose();
        m.dispose();
      }
      o.material = pedDepth;
      o.castShadow = o.receiveShadow = false;
      o.renderOrder = -2; // before the ring
      const c = new THREE.Mesh(o.geometry, pedCatch);
      c.receiveShadow = true;
      c.renderOrder = -1;
      o.add(c);
    }
    desk.add(pedestal);
    // catcher maths in pedestal-local space
    const sz = deskPose.pedestal.size_mm;
    PCSS.uPedBox.value.set(sz.width_x / 2000, (sz.height_y ?? deskPose.pedestal.top_y * 1000) / 1000, sz.depth_z / 2000, Math.min(sz.corner_radius ?? 0, sz.width_x / 2, sz.depth_z / 2) / 1000);
    PCSS.uPedL.value.copy(lampKey.position).sub(lampKey.target.position).normalize().applyQuaternion(pedestal.quaternion.clone().invert());
    const Sp = deskPose.lights.spill;
    if (Sp?.position) {
      const d0 = Sp.distance_to_target_m ?? 0.14506;
      PCSS.uSpillPos.value.fromArray(Sp.position).sub(pedestal.position).applyQuaternion(pedestal.quaternion.clone().invert());
      PCSS.uSpillF.value = (Sp.intensity_relative_to_key?.facing_the_light_at_target ?? 2.374) * d0 * d0;
      PCSS.uSpillTan.value = (Sp.disk_diameter_m ?? 0.06) / 2 / d0;
    } else PCSS.uSpillF.value = 0; // a JSON without the spill: key + ambient only
  };
  const deskReady = loadDesk().catch((e) => {
    console.warn('S01 pedestal not loaded', e);
    deskPose = null; // no pedestal: the ring still renders; the poster keeps the pedestal
  });
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _v = new THREE.Vector3();
  const _c = new THREE.Color();
  /** the photo camera on screen: focal length (px) and principal point (px from the centre, y down),
   *  through the photo's cover size and its CSS zoom around heroBg.anchor */
  const photoCam = (zoom: number) => {
    const C = heroBg.cam;
    const cw = Math.max(W, LH * heroBg.v1Ratio);
    const ch = cw / heroBg.v1Ratio;
    const toScreen = (fu: number, fv: number) => {
      const ax = (heroBg.anchor.x - 0.5) * cw;
      const ay = (heroBg.anchor.y - 0.5) * ch;
      return [ax + ((fu - 0.5) * cw - ax) * zoom, ay + ((fv - 0.5) * ch - ay) * zoom];
    };
    const [px0, py0] = toScreen(0.5, (C.frameH / 2 + C.shiftY * C.frameW) / C.frameH);
    /* phones: ring + pedestal as a 2D scale of the photo camera's image about the pedestal origin
       (heroBg.subjectOrigin) plus a shift of subjectDy × photo height — exactly what the poster's CSS
       scale + translate does, so poster and 3D stay identical (a 3D scale would change the view) */
    const m = deskSubject();
    const dy = (window.innerWidth <= 760 ? heroBg.mobile.subjectDy : heroBg.desktop.subjectDy) * ch * zoom;
    const [qx, qy] = toScreen(heroBg.subjectOrigin.x, heroBg.subjectOrigin.y);
    const px = qx + (px0 - qx) * m;
    const k = heroBg.keepPedestal;
    const lift = window.innerWidth <= 760 ? 0 : Math.max(0, k.ped * ch - k.room * LH);
    const py = qy + (py0 - qy) * m + dy - lift;
    return { F: C.focalPx * (cw / C.frameW) * zoom * m, px, py };
  };
  /**
   * the desk group: camera space of the JSON camera → this stage's world. Our camera sits at (0,0,F)
   * looking down −Z with the same focal length and principal point, so a point at camera-space p
   * (metres) goes to (0,0,F) + k·p; k = F / (subject distance) keeps the subject near z 0.
   */
  let deskK = 1;
  /** phones: ring + pedestal smaller against the photo, about the pedestal origin (heroBg.mobile.subject) */
  const deskSubject = () => (window.innerWidth <= 760 ? heroBg.mobile.subject : heroBg.desktop.subject);
  const placeDesk = (F: number) => {
    if (!deskPose) return;
    const d = deskCam.position.distanceTo(_v.fromArray(deskPose.camera.lookAt));
    deskK = F / d;
    _m.copy(deskCam.matrixWorldInverse); // world (JSON) → JSON camera space
    desk.matrix.makeScale(deskK, deskK, deskK).premultiply(new THREE.Matrix4().makeTranslation(0, 0, F)).multiply(_m);
    desk.matrixWorldNeedsUpdate = true;
    if (pedestal) {
      pedestal.updateMatrix();
      PCSS.uToPed.value.multiplyMatrices(desk.matrix, pedestal.matrix).invert();
    }
  };
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
  /* QA27 D-01 the ring's contact shadow on the skin: the same lathe drawn once more, in front of the
     photo and behind the ring, dark only next to the band. For each point of the finger the shader
     takes its place in the ring's own space (z along the ring's axis): past the band's edge the shade
     falls off with the distance, short and tight on the edge toward the light (the fingertip side),
     longer and softer on the side away from it (toward the knuckle) and a little denser on the left,
     as the key of A-1 comes from the upper right. It is geometric: it travels with the ring down the
     finger and with the hand, and there is none while the band is still clear of the skin (radius). */
  const SEAT = {
    uToRing: { value: new THREE.Matrix4() }, // world → ring (model metres)
    uBand: { value: new THREE.Vector2(0.004, 0.0095) }, // band half width (z), inner radius — set from the GLB below
    uSeat: { value: 1 },
  };
  const fingerShade = new THREE.Mesh(
    finger.geometry,
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      polygonOffset: true, // same geometry as the depth proxy: never lose the depth test to it
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      uniforms: SEAT,
      vertexShader: `uniform mat4 uToRing; varying vec3 vR; varying vec3 vN;
        void main() {
          vec4 wp = modelMatrix * vec4( position, 1.0 );
          vR = ( uToRing * wp ).xyz;
          vN = normalize( mat3( modelMatrix ) * normal );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); // as the depth proxy, bit for bit
        }`,
      fragmentShader: `uniform vec2 uBand; uniform float uSeat; varying vec3 vR; varying vec3 vN;
        void main() {
          float d = ( abs( vR.z ) - uBand.x ) / uBand.x; // 0 at the band's edge, in band half-widths
          float below = step( vR.z, 0.0 ); // filled per frame through the sign of uToRing: 1 = knuckle side
          float len = mix( 0.16, 0.62, below );
          float core = exp( - max( d, 0.0 ) / ( 0.35 * len ) );
          float soft = exp( - max( d, 0.0 ) / len );
          float a = mix( 0.50 * core + 0.16 * soft, 0.46 * core + 0.40 * soft, below );
          // only where the band is close to the skin; denser on the side away from the key (left)
          a *= smoothstep( 0.55, 0.9, length( vR.xy ) / uBand.y );
          vec3 n = normalize( vN );
          a *= mix( 1.12, 0.8, smoothstep( - 0.7, 0.7, n.x ) );
          // on the left the finger runs into the hand, where the proxy ends: fade out before its outline
          a *= n.x < 0.0 ? smoothstep( 0.05, 0.55, n.z ) : smoothstep( 0.0, 0.12, n.z );
          a *= 1.0 - smoothstep( 0.0, 0.5, - d ); // nothing deep under the band (it is behind the ring anyway)
          gl_FragColor = vec4( 0.20, 0.075, 0.03, clamp( a * uSeat, 0.0, 0.85 ) ); // deep skin shade (display values)
        }`,
    }),
  );
  fingerShade.renderOrder = -1;
  finger.add(fingerShade);
  const _ringW = new THREE.Matrix4();

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
  await breath();
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
  /* D-185 desk-lamp highlight on the S01 band: an analytic specular hotspot of the lamp (a large warm
     area light) from the direction of lights.key (upper right, behind), laid over the shaded pixel in
     display space. It depends on the surface normal and the view ray only, so it sits where the polished
     metal would mirror the lamp (top rim, band edge, the inner edge facing it) and moves with the hover
     tilt and the sway. No scene light: shadows, catchers and the rest of the picture are untouched, and
     at strength 0 (poster cross-fade, every other section) the pixel is exactly as before. */
  const GLINT = {
    uGlint: { value: 0 },
    uGlintDir: { value: new THREE.Vector3(0.57, 0.74, -0.36) }, // toward the lamp, view space (= world: the camera never rotates)
  };
  /* D-186 the ring in its room, while it rests on the pedestal (uRest = pose rest × desk, so nothing
     changes once it lifts or in any other section):
     (a) a slightly warmer ring: a luma-neutral tint, so the poster luma match holds;
     (b) the wood under it mirrored in the lower band: the reflected ray is traced to the pedestal top
     (rounded rectangle) or on to the desk, and the polished pixel is mixed toward that wood colour,
     keeping its own light and dark, weaker with height above the top and darker near the touch. */
  const ROOM = { uRest: { value: 0 } };
  /* QA27 D-01 the S06 ring in the light of the hand photo (A-1: one soft warm key from the upper right
     and front, skin all around), by pose.skin; display space like the two above, so at 0 the pixel is
     exactly as before and S08 stays neutral (D-141). Still silver_polished (D-085):
     (a) a warm white balance; (b) skin mirrored where the polished surface looks down at the back of
     the hand or sideways at the next finger: the pixel goes toward the skin's hue at its own brightness;
     (c) the key as a soft highlight with a brighter core, and a little less light on the side away from it. */
  const SKIN = { uSkin: { value: 0 } };
  const patchRing = (m: THREE.MeshStandardMaterial, metal: boolean, lampGlint: boolean) => {
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, ROOM, SKIN, { uToPed: PCSS.uToPed, uPedBox: PCSS.uPedBox, uTouch: PCSS.uTouch }, lampGlint ? GLINT : {});
      sh.fragmentShader = sh.fragmentShader
        .replace(
          'void main() {',
          `uniform float uRest; uniform float uSkin; uniform mat4 uToPed; uniform vec4 uPedBox; uniform vec4 uTouch;
          ${lampGlint ? 'uniform float uGlint; uniform vec3 uGlintDir;' : ''}
          void main() {`,
        )
        .replace(
          '#include <dithering_fragment>',
          `#include <dithering_fragment>
          if ( uRest > 0.0 ) {
            ${
              metal
                ? `// view space = world axes (the camera never rotates)
            vec3 wP = cameraPosition - vViewPosition;
            vec3 wR = reflect( - normalize( vViewPosition ), normalize( normal ) );
            vec3 P = ( uToPed * vec4( wP, 1.0 ) ).xyz;
            vec3 D = normalize( mat3( uToPed ) * wR );
            float down = smoothstep( 0.02, 0.45, - D.y );
            if ( down > 0.0 ) {
              float h = max( P.y - uPedBox.y, 0.0 );
              vec3 hit = P + D * ( h / max( - D.y, 0.05 ) );
              vec2 q = abs( hit.xz ) - ( uPedBox.xz - uPedBox.w );
              float sd = length( max( q, 0.0 ) ) + min( max( q.x, q.y ), 0.0 ) - uPedBox.w;
              float onTop = 1.0 - smoothstep( - 0.0015, 0.003, sd );
              vec3 wood = mix( vec3( 0.52, 0.31, 0.14 ), vec3( 0.60, 0.43, 0.26 ), onTop ); // sRGB: desk, pedestal top
              wood *= mix( 0.6, 1.0, smoothstep( 0.001, 0.007, distance( hit.xz, uTouch.xz ) ) );
              float lum = dot( gl_FragColor.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
              float k = uRest * down * mix( 1.0, 0.25, smoothstep( 0.003, 0.016, h ) );
              // the wood's hue at the pixel's own brightness (a little darker in the shade), so the luma holds
              vec3 hue = mix( vec3( 1.0 ), wood / dot( wood, vec3( 0.2126, 0.7152, 0.0722 ) ), 0.5 );
              float shade = mix( 1.0, 1.035, smoothstep( 0.2, 0.6, dot( wood, vec3( 0.333 ) ) ) );
              vec3 refl = hue * lum * shade;
              refl += max( max( refl.r, max( refl.g, refl.b ) ) - 1.0, 0.0 ) * vec3( 0.0, 0.6, 0.8 ); // highlights keep their level
              gl_FragColor.rgb = mix( gl_FragColor.rgb, min( refl, vec3( 1.0 ) ), 0.7 * k );
            }`
                : ''
            }
            gl_FragColor.rgb = min( gl_FragColor.rgb * mix( vec3( 1.0 ), vec3( 1.05, 0.99, 0.91 ), uRest ), vec3( 1.0 ) );
          }
          if ( uSkin > 0.0 ) {
            vec3 sV = normalize( vViewPosition );
            vec3 sN = normalize( normal );
            vec3 sR = reflect( - sV, sN );
            const vec3 sL = vec3( 0.52, 0.56, 0.645 ); // toward the key: upper right, in front
            const vec3 sW = vec3( 0.2126, 0.7152, 0.0722 );
            vec3 c = gl_FragColor.rgb * mix( vec3( 1.0 ), vec3( 1.045, 0.998, 0.94 ), uSkin );
            float lum = dot( c, sW );
            float bounce = clamp( 0.9 * smoothstep( 0.02, 0.7, - sR.y ) + 0.5 * smoothstep( 0.25, 0.9, - sR.x ), 0.0, 1.0 );
            const vec3 skinHue = vec3( 1.40, 0.89, 0.62 ); // A-1 skin (205, 140, 96) over its own luma
            c = mix( c, skinHue * lum, 0.30 * uSkin * bounce );
            ${metal ? `float sRL = max( dot( sR, sL ), 0.0 );
            float sKey = 0.26 * pow( sRL, 9.0 ) + 0.5 * pow( sRL, 56.0 );
            c *= mix( 1.0, mix( 0.74, 1.0, smoothstep( - 0.75, 0.35, dot( sN, sL ) ) ), uSkin );
            c += uSkin * sKey * vec3( 1.0, 0.95, 0.87 ) * ( 1.0 - 0.6 * c );` : ''}
            gl_FragColor.rgb = min( c, vec3( 1.0 ) );
          }
          ${lampGlint ? `          if ( uGlint > 0.0 ) {
            vec3 gV = normalize( vViewPosition );
            vec3 gN = normalize( normal );
            float gNV = clamp( dot( gN, gV ), 0.0, 1.0 );
            vec3 gR = reflect( - gV, gN );
            float gRL = max( dot( gR, uGlintDir ), 0.0 );
            // the lamp shade mirrored in the metal: a bright core inside a soft halo
            float core = pow( gRL, 90.0 );
            float halo = pow( gRL, 12.0 );
            // grazing light along the rim on the lamp side (the band's silhouette toward upper right)
            // (leaning upward: the shade sits above, so the top rim catches it too)
            float edge = pow( 1.0 - gNV, 1.8 ) * smoothstep( 0.25, 0.95, dot( gN.xy, normalize( uGlintDir.xy * vec2( 0.35, 1.0 ) ) ) );
            float a = uGlint * clamp( 0.9 * core + 0.4 * halo + 0.95 * edge, 0.0, 1.0 );
            vec3 warm = mix( vec3( 1.0, 0.70, 0.28 ), vec3( 1.0, 0.91, 0.62 ), core ); // sRGB gold → pale core
            gl_FragColor.rgb += a * warm * ( 1.0 - 0.55 * gl_FragColor.rgb ); // soft add: warms silver, never clips hard
            gl_FragColor.rgb = min( gl_FragColor.rgb, vec3( 1.0 ) );
          }` : ''}`,
        );
      if (!sh.fragmentShader.includes('uRest > 0.0')) console.warn('ring: shader not patched');
    };
    m.customProgramCacheKey = () => 'room' + (metal ? 'm' : '') + (lampGlint ? 'g' : '');
  };
  const ringMats = new Set<THREE.MeshStandardMaterial>();
  ring.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && mesh.name !== RING_MODEL.meshes.ledMain && mesh.name !== RING_MODEL.meshes.ledPower) ringMats.add(mesh.material as THREE.MeshStandardMaterial);
  });
  ringMats.forEach((m) => patchRing(m, m === band || m === engrave, m === band));
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
  // ring outer-shell points in ring space (pivot/spinner are identity here), for the contact point
  const ringPts: THREE.Vector3[] = [];
  ring.updateMatrixWorld(true);
  ring.traverse((o) => {
    if (!o.isMesh || !/Shell/i.test(o.name)) return;
    const a = o.geometry.attributes.position;
    for (let i = 0; i < a.count; i += 5) ringPts.push(new THREE.Vector3().fromBufferAttribute(a, i).applyMatrix4(o.matrixWorld));
  });
  {
    // band half width (along the axis) and inner radius, from the shell points (ring space)
    let hz = 0, rin = Infinity;
    for (const v of ringPts) (hz = Math.max(hz, Math.abs(v.z))), (rin = Math.min(rin, Math.hypot(v.x, v.y)));
    if (hz > 0 && isFinite(rin)) SEAT.uBand.value.set(hz, rin);
  }

  /* S06 pine table (D-146, HANDOFF-s06-table.md). Its own scene and lights, drawn before the ring with
     the same camera (depth cleared in between: the ring is always in front), so the warm key +
     hemisphere fill light only the wood and the ring looks exactly as before. Loaded lazily after the ring; until then (and without WebGL) the
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
  /** D-191: one texture to the GPU in strips of 128 rows, a strip per idle turn. three.js sends a
   *  texture in one call: for a 2048 px map that is 16 MB handed to the GPU inside a single task, 25–60 ms
   *  with a real GPU and more with a software one. Here three.js still creates the texture (storage,
   *  format, filtering, anisotropy) but is told the pixels are not ready; the same pixels then go up
   *  row band by row band and the mipmaps are built at the end, as three.js would. Anything unusual
   *  (no ImageBitmap, another format) takes the normal single upload. */
  const stripUpload = async (t: THREE.Texture) => {
    const img = t.image as ImageBitmap;
    const gl = renderer.getContext() as WebGL2RenderingContext;
    const ROWS = 128;
    const plain = typeof ImageBitmap !== 'undefined' && img instanceof ImageBitmap && !!gl.texStorage2D && t.format === THREE.RGBAFormat && t.type === THREE.UnsignedByteType && !t.mipmaps?.length && img.height > ROWS && img.width <= renderer.capabilities.maxTextureSize && img.height <= renderer.capabilities.maxTextureSize;
    const whole = async () => {
      await new Promise<void>((next) => idle(() => next()));
      t.source.dataReady = true;
      renderer.initTexture(t);
    };
    if (!plain) return whole();
    const strips: Array<[number, ImageBitmap]> = [];
    try {
      // cut by the browser off the main thread; same options as GLTFLoader's own bitmaps
      for (let y = 0; y < img.height; y += ROWS)
        strips.push([y, await createImageBitmap(img, 0, y, img.width, Math.min(ROWS, img.height - y), { premultiplyAlpha: 'none', colorSpaceConversion: 'none' })]);
    } catch {
      return whole();
    }
    t.source.dataReady = false;
    renderer.initTexture(t); // storage and parameters only
    t.source.dataReady = true;
    const glTex = renderer.properties.get(t).__webglTexture;
    if (!glTex) {
      t.needsUpdate = true;
      return whole();
    }
    for (const [y, strip] of strips) {
      await new Promise<void>((next) => idle(() => next()));
      renderer.state.bindTexture(gl.TEXTURE_2D, glTex);
      renderer.state.pixelStorei(gl.UNPACK_ALIGNMENT, t.unpackAlignment);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, y, gl.RGBA, gl.UNSIGNED_BYTE, strip);
      strip.close();
    }
    renderer.state.bindTexture(gl.TEXTURE_2D, glTex);
    if (t.generateMipmaps) gl.generateMipmap(gl.TEXTURE_2D);
    renderer.state.unbindTexture();
  };
  const loadTable = () => {
    if (tableLoading) return;
    tableLoading = true;
    new GLTFLoader()
      .loadAsync(RING_MODEL.tableUrl)
      .then((g) => {
        const tbl = g.scene;
        tbl.traverse((o) => {
          if (!o.isMesh) return;
          const m = o.material as THREE.MeshStandardMaterial;
          for (const t of [m.map, m.roughnessMap, m.metalnessMap, m.normalMap]) if (t) t.anisotropy = maxAnisotropy;
          m.transparent = true; // fades with S06 (opacity set per frame)
          tableMats.push(m);
        });
        // QA27 G-19: its textures go to the GPU now, in idle time, not in the frame S06 enters.
        // D-191: and in strips (see stripUpload); the table joins the scene once they are all there
        const texs = [...new Set(tableMats.flatMap((m) => [m.map, m.roughnessMap, m.metalnessMap, m.normalMap]).filter(Boolean))] as THREE.Texture[];
        const up = async () => {
          for (const t of texs) await stripUpload(t);
          await gpuDone();
          table = tbl;
          tableRoot.add(tbl);
          document.documentElement.classList.add('table-ready');
          lastTableKey = '';
          lateAsset();
        };
        return up();
      })
      .catch(() => {
        /* the CSS table stays */
      });
  };
  // D-191: loaded after the late environments (lateAssets above)
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
  // flare / bounce anchors: window A (led_main) and, for "off" (D-154), the lower window (led_power)
  const anchorOf = (name: string) => {
    const mesh = ring.getObjectByName(name) as THREE.Mesh | undefined;
    if (!mesh) return null;
    ring.updateMatrixWorld(true);
    const c = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
    const local = ring.worldToLocal(c.clone());
    // toward the axis (the window faces the skin, inward)
    const inward = new THREE.Vector3(-local.x, -local.y, 0).normalize().multiplyScalar(ringSize * 0.04);
    return { flare: local.clone().add(inward), bounce: local.clone().add(inward.clone().multiplyScalar(2)) };
  };
  const anchorMain = anchorOf(RING_MODEL.meshes.ledMain);
  const anchorPower = anchorOf(RING_MODEL.meshes.ledPower) ?? anchorMain;
  if (anchorMain) {
    flare.position.copy(anchorMain.flare);
    bounce.position.copy(anchorMain.bounce);
    ring.add(flare, bounce);
  }
  const LED_RED = new THREE.Color('#FF3B30'); // --led-off

  let W = 0;
  let H = 0;
  let lastCam = '';
  /* QA27 M-11: poses are laid out in W × H (the small viewport, stable while the address bar moves);
     the canvas is W × LH (the large one), so the view is extended downward, never stretched */
  let LH = 0;
  const frameView = (px: number, py: number) => {
    if (px || py || LH !== H) camera.setViewOffset(W, H, -px, -py, W, LH);
    else camera.clearViewOffset();
  };
  const resize = () => {
    if (W === view.w && H === view.h && LH === view.lh) return; // the browser's bars moved: nothing changes
    W = view.w;
    H = view.h;
    LH = view.lh;
    lastCam = '';
    sizeBuffer();
    camera.aspect = W / H;
    frameView(0, 0);
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
  /* QA27 G-19: a light at intensity 0 adds nothing to the picture but is still evaluated for every
     pixel of the ring (ten directional lights, most of them dark in any one section), so dark lights
     are taken out of the scene. That changes the shader variant three.js picks (light counts), and a
     new variant compiled in the middle of a scroll is a dropped frame (measured: S01 → S02, the S06
     table), so `prewarm` walks the story's poses once after load, in idle time, and compiles every
     variant before it is needed. */
  const lit = (l: THREE.Light, i: number) => {
    l.intensity = i;
    l.visible = i > 0;
  };
  let quiet = false; // prewarm: scene state only, no DOM writes
  let lastPose: Pose | null = null;
  let lastExtra: { breathe?: number } = {};
  const apply = (p: Pose, extra: { breathe?: number } = {}) => {
    if (!quiet) {
      lastPose = p;
      lastExtra = extra;
    }
    // width: fraction of viewport width, but never taller than 82% of the viewport
    const raw = p.w * W;
    const w = (Math.min(raw, H * 0.82) * (1 - p.uncap) + raw * p.uncap) * (1 + (extra.breathe ?? 0) * (1 - Math.min(1, Math.max(0, p.rest))));
    /* D-179: in S01 the camera becomes the photo camera (focal length + principal point of
       s01-pedestal-pose.json on the photo as CSS shows it); poses in screen fractions keep their
       place on the z 0 plane (the principal-point shift is taken back out of pivot.x / y) */
    const dsk = deskPose ? Math.min(1, Math.max(0, p.desk)) : 0;
    const F0 = H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const pc = dsk > 0 ? photoCam(p.deskZoom) : { F: F0, px: 0, py: 0 };
    // the camera stays the photo camera until the pedestal has almost faded (≤ 1/8), so the pedestal
    // never drifts against the photo; only then does it ease back to the default lens
    const cb = Math.min(1, dsk * 8);
    const F = F0 + (pc.F - F0) * cb;
    const Px = pc.px * cb;
    const Py = pc.py * cb;
    const camKey = `${F.toFixed(2)}|${Px.toFixed(2)}|${Py.toFixed(2)}|${W}x${H}x${LH}`;
    if (camKey !== lastCam) {
      lastCam = camKey;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(H / 2 / F));
      camera.position.set(0, 0, F);
      camera.far = Math.max(40000, F * 4);
      /* D-181e: the near plane follows the lens. With near = 1 and the S01 photo camera ~3500–7000 px
         from the ring, a 24-bit depth buffer resolved only ~0.7–3 px (≈ 0.05–0.2 mm) at the ring, so
         the sensor glass, LED dots and their frames, which sit a few hundredths of a millimetre over
         the liner, z-fought into a mottle (there since D-179; a later rest grade then turned its
         dark half black). Nothing is ever nearer than 0.1 F (pose.fwd ≤ 0.9, the ring shrinking with
         it), so 0.02 F costs nothing and gives ~100× the depth precision. */
      camera.near = Math.max(1, F * 0.02);
      frameView(Px, Py);
      camera.updateProjectionMatrix();
      placeDesk(F);
    }
    pivot.position.set(p.x * W - Px, p.y * H + Py, 0);
    pivot.scale.setScalar(w / ringSize);
    pivot.rotation.set(p.rx, p.ry, p.rz, 'YXZ');
    if (p.pitch) pivot.quaternion.premultiply(rollQ.setFromAxisAngle(X_AXIS, p.pitch));
    if (p.roll) pivot.quaternion.premultiply(rollQ.setFromAxisAngle(Z_AXIS, p.roll));
    // fwd: toward the camera, same screen size and place (screen = P + (x, −y)·F/(F − z))
    const fw = Math.min(0.9, Math.max(0, p.fwd));
    if (fw > 0) {
      pivot.position.x *= 1 - fw;
      pivot.position.y *= 1 - fw;
      pivot.position.z = fw * F;
      pivot.scale.multiplyScalar(1 - fw);
    }
    // the ring standing on the pedestal: the JSON ring pose, through the desk group
    const rest = deskPose && dsk > 0 ? Math.min(1, Math.max(0, p.rest)) : 0;
    if (rest > 0) {
      const R = deskPose.ring;
      _v.fromArray(R.position).applyMatrix4(desk.matrix);
      pivot.position.lerp(_v, rest);
      pivot.scale.setScalar(pivot.scale.x + (deskK * (R.scale ?? 1) * (R.s01_scale ?? 1) - pivot.scale.x) * rest);
      // ring.s01_scale (optional, JSON): larger ring only while it rests; the rest blend takes it back to the lift-off size, no pop
      _q.copy(deskCam.quaternion).invert().multiply(new THREE.Quaternion().fromArray(R.quaternion));
      pivot.quaternion.slerp(_q, rest);
      /* D-180 hover tilt while resting: yaw about the desk's vertical axis and a small pitch about the
         camera-right horizontal axis, both through the contact point, so the ring turns in place on
         the pedestal (never lifts or sinks: see design/v2/scripts/d179-ring-clearance.mjs) */
      const low = restLow();
      if (low && (p.tiltX || p.tiltY)) {
        const C = low.clone().applyMatrix4(desk.matrix);
        const U = new THREE.Vector3(0, 1, 0).transformDirection(desk.matrix);
        const X = new THREE.Vector3(1, 0, 0);
        X.addScaledVector(U, -X.dot(U)).normalize();
        const qt = new THREE.Quaternion().setFromAxisAngle(U, p.tiltY * rest).multiply(new THREE.Quaternion().setFromAxisAngle(X, p.tiltX * rest));
        pivot.quaternion.premultiply(qt);
        pivot.position.sub(C).applyQuaternion(qt).add(C);
        // pitching about the contact line can dip the curved band a hair below the top: lift by
        // exactly that much (desk space), so the ring keeps touching and never sinks
        pivot.updateMatrix();
        const M = new THREE.Matrix4().multiplyMatrices(pivot.matrix, spinner.matrix).premultiply(new THREE.Matrix4().copy(desk.matrix).invert());
        let minY = Infinity;
        for (const v of ringPts) minY = Math.min(minY, _v.copy(v).applyMatrix4(M).y);
        const dip = (deskPose.pedestal.top_y ?? low.y) - minY;
        if (dip > 0) pivot.position.addScaledVector(U, (dip + 0.00003) * deskK); // + 0.03 mm: float margin
      }
    }
    finger.visible = p.fing > 0.5;
    if (finger.visible) {
      finger.position.set(p.fx * W, p.fy * H, 0);
      finger.scale.setScalar(p.fs);
      finger.rotation.set(0, 0, FINGER_TILT);
    }
    spinner.rotation.z = p.spin * (1 - rest);
    if (finger.visible) {
      // world → ring space for the contact shadow; z flipped if needed so −z is the knuckle side (screen down)
      pivot.updateMatrix();
      spinner.updateMatrix();
      _ringW.multiplyMatrices(pivot.matrix, spinner.matrix);
      const zDown = _ringW.elements[9] > 0; // the ring axis' world y
      SEAT.uToRing.value.copy(_ringW).invert();
      if (!zDown) SEAT.uToRing.value.premultiply(_m.makeScale(1, 1, -1));
    }
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
    // D-182: the production look: the rig stays on while the ring rests (the desk key and hemisphere
    // add their light and cast the shadow)
    const rig = p.photo;
    lit(sun, 2.6 * rig);
    lit(hemi, 0.55 * rig);
    lit(fill, 0.35 * rig);
    lit(rim, 14 * p.rim);
    lit(rimFill, 3.2 * p.rim);
    lit(warmRim, 10 * p.warm);
    const lp = Math.min(1, Math.max(0, p.lamp));
    lit(deskLamp, 9 * lp);
    // a soft close fill on the lamp side so the edge glows rather than shows one sharp line
    lit(deskFill, 2.2 * lp);
    deskFill.position.set(pivot.position.x - w * 1.1, pivot.position.y + w * 0.45, w * 0.6);
    deskFill.distance = w * 2.6;
    lit(cornerLight, 14 * Math.min(1, Math.max(0, p.corner)));
    lit(coldEdge, 34 * Math.min(1, Math.max(0, p.edge)));
    ROOM.uRest.value = rest * dsk;
    SKIN.uSkin.value = Math.min(1, Math.max(0, p.skin));
    GLINT.uGlint.value = Math.min(1, Math.max(0, p.glint));
    if (GLINT.uGlint.value > 0 && deskPose) {
      const K = deskPose.lights.key;
      // key direction (target → lamp) from desk space into the world, swayed a little with the room
      GLINT.uGlintDir.value
        .fromArray(K.position)
        .sub(_v.fromArray(K.target))
        .transformDirection(desk.matrix)
        .applyAxisAngle(_v.set(0, 1, 0), p.envRot * 0.5);
    }
    // D-179 desk: pedestal, key light and the shadow catcher fade with the photo
    desk.visible = dsk > 0.002;
    lampKey.castShadow = desk.visible;
    if (desk.visible) {
      const sh = Math.max(0, p.shadow);
      lit(lampKey, LAMP * dsk);
      lit(deskHemi, deskHemiI * dsk);
      setCatch(deskMat, deskPose.desk.catcher_ambient ?? CATCH.deskAmb, sh * dsk);
      setCatch(pedCatch, deskPose.pedestal.catcher_ambient ?? CATCH.topAmb, sh * dsk);
      pedCatch.userData.floor.value = deskPose.pedestal.catcher_side_opacity ?? CATCH.side;
      // ring → pedestal contact: a soft oval and a tight dark core under the strip of the band that
      // touches the top this frame (follows the hover tilt), fading as the ring lifts off
      const t = findTouch();
      const topY = (deskPose.pedestal.top_y ?? 0) + 0.00005;
      const near = t.ok ? 1 - Math.min(1, t.gap / 0.0015) : 0; // gone 1.5 mm above the top
      const ck = dsk * Math.min(1, Math.max(0, p.rest)) * near;
      if (t.ok) {
        const along = Math.min(0.006, Math.max(0.0022, t.len * 2.2));
        // desk space → pedestal-local (the catcher's space): position only, the block is not rotated
        // the overlay's occlusion sits ~3.5 mm toward the lamp side of the touch along the band (measured:
        // right end of the top 139 → 49, left front 122 → 68 of 255), so the centre is shifted that way
        const sg = (Math.cos(t.ang) >= 0 ? 1 : -1) * 0.0035;
        PCSS.uTouch.value.set(t.x + Math.cos(t.ang) * sg - (pedestal?.position.x ?? 0), topY, t.z + Math.sin(t.ang) * sg - (pedestal?.position.z ?? 0), along);
        PCSS.uTouchDir.value.set(Math.cos(t.ang), Math.sin(t.ang), ck);
        PCSS.uOver.value.set(t.ox - (pedestal?.position.x ?? 0), t.oz - (pedestal?.position.z ?? 0));
      } else PCSS.uTouchDir.value.z = 0;
      // the two flat ovals of D-179e / the first polish pass are replaced by the catcher's occlusion
      contact.visible = core.visible = false;
      // shadow camera in world units (the group is scaled by deskK)
      const L = deskPose.lights.key.shadow;
      const kk = deskK;
      const b = (L.camera_bounds_m ?? 0.06) * kk;
      const sc = lampKey.shadow.camera;
      if (sc.right !== b) {
        sc.left = sc.bottom = -b;
        sc.right = sc.top = b;
        sc.near = 0.01 * kk;
        sc.far = (lampKey.position.distanceTo(lampKey.target.position) + 0.2) * kk;
        PCSS.uDepthRange.value = sc.far - sc.near;
        PCSS.uFrustumW.value = 2 * b;
        sc.updateProjectionMatrix();
        lampKey.shadow.normalBias = (L.normalBias ?? 0.0004) * kk;
      }
    } else {
      lit(lampKey, 0);
      lit(deskHemi, 0);
    }

    // env: night when light ≥ .5, else photo when photo ≥ .5, else paper; intensity dips around a swap
    const n = Math.min(1, Math.max(0, p.light));
    const ph = Math.min(1, Math.max(0, p.photo));
    // photo ↔ paper: step through the prebuilt blends (no pop); paper ↔ night: dip and swap at 0.5
    // D-182: the ring reflects the photo itself, as in production; a quarter of the paper studio env stays
    // in because the warm desk alone is too dark for the band to read as silver
    const pw = Math.max(1 - ph, 0.25 * Math.min(1, Math.max(0, p.desk)));
    const step = blends.length ? Math.round(pw * (blends.length - 1)) : -1;
    const dk = Math.min(1, Math.max(0, p.dusk));
    const key = dk >= 0.5 && envs.dusk ? 'dusk' : n >= 0.5 && envs.night ? 'night' : step >= 0 ? `blend${step}` : 'paper';
    if (key !== lastEnv) {
      lastEnv = key;
      scene.environment = key === 'dusk' ? envs.dusk! : key === 'night' ? envs.night! : step >= 0 ? blends[step] : envs.paper ?? null;
    }
    renderer.toneMappingExposure = 1.0 + 0.15 * ph; // V1 hero exposure 1.15 → 1.0, continuous
    // D-182: slow reflection movement on the S01 ring (hero.ts drives it), also while it rests
    scene.environmentRotation.y = p.envRot;
    const dip = Math.min(1, Math.abs(n - 0.5) * 2.5, Math.abs(dk - 0.5) * 2.5);
    // on Night the polished env is almost black: lift it with the rim so the band keeps a silver gradient
    // the swap dip never goes below 0.45, so the ring is never a black shape in a connection (D-090 r1)
    // under the desk lamp the room is a little dimmer (evening), so the amber edge reads (D-100)
    scene.environmentIntensity = (0.45 + 0.55 * dip) * (1 + 1.4 * p.rim) * (1 - 0.12 * lp) * (1 - 0.7 * Math.min(1.4, Math.max(0, p.envDim)));

    // D-154: ledc 2 → 3 hands the light from window A (violet) to the small red one in the lower window
    const off = Math.min(1, Math.max(0, p.ledc - 2));
    const ledKey = p.led.toFixed(3) + '|' + p.ledc.toFixed(3);
    if (ledKey !== lastLedKey) {
      lastLedKey = ledKey;
      const li = RING_MODEL.ledIntensity * p.led;
      litLed(ledMain, p.led > 0.01 && off < 1 ? ledColor(p.ledc) : null, li * (1 - off));
      litLed(ledPower, p.led > 0.01 && off > 0 ? LED_RED : null, li * off);
    }
    // the flare fades out at window A, then in (a little smaller: "one small light") at the red one
    const red = off > 0.5;
    const fl = Math.max(0, p.flare) * (red ? (off - 0.5) * 2 : 1 - off * 2);
    flare.visible = fl > 0.005;
    bounce.intensity = 0;
    bounce.visible = flare.visible;
    if (flare.visible) {
      const col = red ? LED_RED : ledColor(p.ledc);
      const at = red ? anchorPower : anchorMain;
      if (at) {
        flare.position.copy(at.flare);
        bounce.position.copy(at.bounce);
      }
      flare.material.color.copy(col);
      flare.material.opacity = Math.min(1, fl);
      const fs = ringSize * 0.6 * (red ? 0.85 : 1);
      flare.scale.set(fs, fs, 1);
      bounce.color.copy(col);
      bounce.distance = w * 0.9;
      bounce.intensity = 2.4 * fl;
    }
    if (quiet) return;
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
      // the ring is always in front of the table: it stands on the top surface or falls beside the
      // right edge, never behind it, and while it comes in from S05 (still large) it must never cut
      // into the wood
      renderer.clearDepth();
      renderer.render(scene, camera);
      renderer.autoClear = true;
      return;
    }
    renderer.render(scene, camera);
  };

  /** what decides the shader variants of a frame: light counts, env, shadow, clearcoat, lit LEDs, and
   *  which of the occasional objects are drawn */
  const variantKey = () => {
    let dir = 0, point = 0, hemiN = 0;
    for (const l of [sun, fill, rim, rimFill, warmRim, deskLamp, cornerLight, coldEdge]) if (l.visible) dir++;
    if (desk.visible && lampKey.visible) dir++;
    if (deskFill.visible) point++;
    if (bounce.visible) point++;
    if (hemi.visible) hemiN++;
    if (desk.visible && deskHemi.visible) hemiN++;
    return [dir, point, hemiN, desk.visible ? 1 : 0, scene.environment?.uuid ?? '', (band as any)?.clearcoat > 0 ? 1 : 0, ledMain?.toneMapped ? 0 : 1, ledPower?.toneMapped ? 0 : 1, finger.visible ? 1 : 0, flare.visible ? 1 : 0, table && tableRoot.visible ? 1 : 0].join('|');
  };
  /** everything three.js draws in a scene (hidden objects too: they show in some other pose) */
  const drawables = (root: THREE.Object3D) => {
    const out: THREE.Object3D[] = [];
    root.traverse((o: any) => (o.isMesh || o.isSprite || o.isPoints || o.isLine) && out.push(o));
    return out;
  };
  /** D-191: the programs of ONE object for the scene as it stands (lights, env, shadow), not of the
   *  whole scene at once: building the shader source of every material in one go was a 50–60 ms task
   *  on a phone. The result is the same program three.js would build when it draws the object. */
  const compileOne = (o: THREE.Object3D, inTable: boolean) => {
    if (inTable) {
      tableScene.environment = scene.environment;
      tableScene.environmentIntensity = 1;
      renderer.compile(o, camera, tableScene);
    } else renderer.compile(o, camera, scene);
  };
  const warmed = new Set<string>();
  let warmQueue: Pose[] = [];
  let warmBusy = false;
  /** the variant being compiled: its pose and the objects still to do */
  let warmJob: { p: Pose; todo: Array<[THREE.Object3D, boolean]> } | null = null;
  const WARM_MS = 3; // prewarm work per idle turn; one object is always finished
  const warmStep = (left: () => number) => {
    warmBusy = false;
    if (!lastPose || (!warmJob && !warmQueue.length)) return;
    const t0 = performance.now();
    const more = () => performance.now() - t0 < WARM_MS && left() > 1;
    quiet = true;
    try {
      if (warmJob) apply(warmJob.p); // the scene was put back after the last turn
      for (;;) {
        if (!warmJob) {
          // skim the poses whose variant is known
          do {
            const p = warmQueue.pop();
            if (!p) break;
            apply(p);
            const key = variantKey();
            if (warmed.has(key)) continue;
            warmed.add(key);
            scene.updateMatrixWorld();
            warmJob = { p, todo: drawables(scene).map((o) => [o, false]) };
            if (table && tableRoot.visible) for (const o of drawables(tableScene)) warmJob.todo.push([o, true]);
          } while (!warmJob && more());
          if (!warmJob) break;
        }
        const next = warmJob.todo.pop();
        if (next) compileOne(next[0], next[1]);
        if (!warmJob.todo.length) warmJob = null;
        if (!more()) break;
      }
      apply(lastPose, lastExtra); // the scene exactly as the last real frame left it
    } finally {
      quiet = false;
    }
    if (warmQueue.length || warmJob) (warmBusy = true), idle(warmStep);
  };
  let warmAll: Pose[] = [];
  const prewarm = (poses: Pose[]) => {
    warmAll = poses;
    warmJob = null;
    warmQueue = poses.slice().reverse(); // from the top of the page down
    if (!warmBusy) (warmBusy = true), idle(warmStep);
  };
  /** an asset that arrived late (night / dusk env, the table) brings new variants: go round again */
  lateAsset = () => {
    if (warmAll.length) prewarm(warmAll);
  };

  /** D-191: resolves once the GPU has worked through everything sent so far (a fence, polled between
   *  turns). The first use of a program asks the GPU questions that wait for its queue: on a slow or
   *  software GPU that wait was spent on the main thread. */
  const gpuDone = () =>
    new Promise<void>((ok) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl.fenceSync) return ok();
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      // never longer than a second: a window that is covered or in the background draws no frames,
      // and its GPU work may not move on until it is seen again
      const t0 = performance.now();
      const poll = () => {
        if (sync && gl.clientWaitSync(sync, 0, 0) === gl.TIMEOUT_EXPIRED && performance.now() - t0 < 1000) return setTimeout(poll, 8);
        gl.deleteSync(sync);
        ok();
      };
      setTimeout(poll, 0);
    });

  /** D-191: the first frame used to build every program and upload every texture inside one task
   *  (250 ms on a phone). Here the same work is done before it, one object and one texture per turn,
   *  and the frame is only drawn once the GPU has linked the programs (KHR_parallel_shader_compile,
   *  where the browser has it), so drawing it never waits. */
  const prime = async (p: Pose, extra: { breathe?: number } = {}) => {
    const set = () => {
      quiet = true;
      try {
        apply(p, extra);
      } finally {
        quiet = false;
      }
    };
    for (const o of drawables(scene)) {
      set(); // each turn: nothing else touches the scene before the first frame, but stay exact
      renderer.compile(o, camera, scene);
      await breath();
    }
    const texs = new Set<THREE.Texture>();
    scene.traverse((o: any) => {
      for (const m of [o.material].flat())
        if (m) for (const k in m) if (m[k]?.isTexture && !m[k].isRenderTargetTexture) texs.add(m[k]);
    });
    for (const t of texs) {
      renderer.initTexture(t);
      await breath();
    }
    set();
    // (with a time limit, for the same reason as in gpuDone: then the frame is drawn the old way)
    await Promise.race([renderer.compileAsync(scene, camera), new Promise((ok) => setTimeout(ok, 2000))]);
    await gpuDone();
    // the first use of each program (its uniform and attribute look-ups, a few hundred questions to
    // the GPU each) one program per turn; the frame then finds them answered
    const firsts = new Set<any>();
    for (const o of drawables(scene))
      for (const m of [(o as any).material].flat()) {
        const program = m && renderer.properties.get(m).currentProgram;
        if (!program || firsts.has(program)) continue;
        firsts.add(program);
        program.getUniforms();
        program.getAttributes();
        await breath();
      }
    firstFrameDone();
  };

  /** colour for window A, or 'off' to light only the red dot, or null for both dark */
  /** one LED: lit in a colour at an intensity, or dark (no colour at all) */
  function litLed(m: THREE.MeshStandardMaterial | undefined, c: THREE.Color | string | null, intensity: number) {
    if (!m) return;
    const on = !!c && intensity > 0.001;
    if (on) m.emissive.set(c as THREE.Color);
    m.emissiveIntensity = on ? intensity : 0;
    m.toneMapped = !on;
    m.color.copy(on ? ledBase.get(m) ?? LED_OFF : LED_OFF);
  }
  const setLed = (color: string | 'off' | null, intensity: number = RING_MODEL.ledIntensity) => {
    litLed(ledMain, color && color !== 'off' ? color : null, intensity);
    litLed(ledPower, color === 'off' ? LED_RED : null, intensity);
  };

  /** D-179 QA: lowest ring point above the pedestal top (m, desk space) while the XZ footprints overlap;
   *  null when the desk is hidden or they do not overlap. Used by the automated clearance check. */
  const clearance = () => {
    if (!deskPose || !desk.visible) return null;
    scene.updateMatrixWorld(true);
    const inv = desk.matrix.clone().invert();
    const M = new THREE.Matrix4().multiplyMatrices(pivot.matrixWorld, spinner.matrix);
    const sz = deskPose.pedestal.size_mm;
    const hx = sz.width_x / 2000, hz = sz.depth_z / 2000, top = deskPose.pedestal.top_y;
    let min: number | null = null;
    for (const v of ringPts) {
      const d = v.clone().applyMatrix4(M).applyMatrix4(inv);
      if (pedestal) d.x -= pedestal.position.x, (d.z -= pedestal.position.z); // D-181b: the block is no longer at the origin
      if (Math.abs(d.x) <= hx && Math.abs(d.z) <= hz) min = min === null ? d.y - top : Math.min(min, d.y - top);
    }
    return min;
  };
  /** D-180 QA: the ring's screen bbox (CSS px) for a pose */
  const screenBox = () => {
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    const M = new THREE.Matrix4().multiplyMatrices(pivot.matrixWorld, spinner.matrix);
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const v of ringPts) {
      const q = v.clone().applyMatrix4(M).project(camera);
      const x = (q.x + 1) / 2 * W, y = (1 - q.y) / 2 * LH;
      l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y);
    }
    return { l, t, r, b };
  };
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('inspect')) {
    (window as any).__ringClearance = (pose: Pose) => (apply(pose), clearance());
    (window as any).__ringScreenBox = (pose: Pose) => (apply(pose), screenBox());
    // light travel direction mapped back into pedestal space (must equal JSON direction_unit)
    // shadow of the ring's highest point at rest on the pedestal top, in screen px (JSON maths only)
    (window as any).__shadowTip = () => {
      const R = deskPose.ring, L = deskPose.lights.key;
      const q = new THREE.Quaternion().fromArray(R.quaternion), sc = (R.scale ?? 1) * (R.s01_scale ?? 1), pos = new THREE.Vector3().fromArray(R.position);
      let hi: THREE.Vector3 | null = null;
      for (const v of ringPts) { const w = v.clone().multiplyScalar(sc).applyQuaternion(q).add(pos); if (!hi || w.y > hi.y) hi = w; }
      const d = new THREE.Vector3().fromArray(L.direction_unit);
      const t = (deskPose.pedestal.top_y - hi!.y) / d.y;
      const hit = hi!.clone().addScaledVector(d, t);
      const low = restLow()!;
      const toScr = (v: THREE.Vector3) => { const q2 = v.clone().applyMatrix4(desk.matrix).project(camera); return [Math.round((q2.x + 1) / 2 * W), Math.round((1 - q2.y) / 2 * LH)]; };
      return { high: hi!.toArray(), hit: hit.toArray(), contact: low.toArray(), scrHigh: toScr(hi!), scrHit: toScr(hit), scrContact: toScr(low) };
    };
    (window as any).__keyDir = () => {
      scene.updateMatrixWorld(true);
      const a = lampKey.getWorldPosition(new THREE.Vector3()), t = lampKey.target.getWorldPosition(new THREE.Vector3());
      const inv = desk.matrix.clone().invert();
      return t.applyMatrix4(inv).sub(a.applyMatrix4(inv)).normalize().toArray().map((x) => +x.toFixed(4));
    };
  }
  await deskReady; // the first frame already shows the pedestal (the poster cross-fades to it)
  return { apply, render, prime, prewarm, setLed, canvas, three: THREE, pivot };
}
