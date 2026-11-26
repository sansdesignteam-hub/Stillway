/**
 * The ring model V2 loads. ONE place to swap it.
 *
 * V2 ring with the engraved "Stillway" text (D-061, D-071), stage 2 from the 3D Designer:
 * design/3d/v2/stillway-ring-v2-silver_web.glb + HANDOFF-v2-ring.md (branch 3D-Designer, feaa83d).
 * Silver brushed (KHR_materials_anisotropy + normal map) comes from the GLB as authored.
 * Black/Gold (finishes.json) are for S10 only and are not wired yet. S01 uses finishes.json
 * "silver_polished" on this GLB (stage.ts, pose.gloss) instead of the separate polished GLB.
 */
export const RING_MODEL = {
  url: '/models/stillway-ring-v2-silver_web.glb',
  /** S06 light pine table (D-146; 3D Designer 5f00763, design/3d/v2/HANDOFF-s06-table.md): metres,
   *  origin = top surface, right edge, ring path; loaded lazily after the ring */
  tableUrl: '/models/s06-table.glb',
  /** S01 desk (D-179; 3D Designer e7337a6, design/3d/v2/HANDOFF-s01-pedestal.md): the oak pedestal
   *  and its pose JSON (ring rest pose, photo camera, key light, shadow catcher). Keep the names: a
   *  revised GLB + JSON swap in without code changes */
  desk: { url: '/models/s01-pedestal.glb', pose: '/models/s01-pedestal-pose.json' },
  dracoPath: '/draco/',
  /** material name patterns in the GLB */
  materials: {
    shell: /^Ring_Silver/i, // Ring_Silver + Ring_Silver_Engrave (both swap for finishes in stage 2)
    liner: /Liner/i,
    glass: /Glass|Frame/i,
  },
  /** mesh names (HANDOFF-v2-ring.md) */
  meshes: {
    ledMain: 'led_main', // window A: green / blue / violet (D-062)
    ledPower: 'led_power', // red dot, only when the ring is "off"
  },
  /** emissive intensity when lit (3D handoff stage 2: 1.5–3 with AgX, toneMapped = false) */
  ledIntensity: 2.2,
  /** environment maps (EXR, 3D handoff stage 2); all light comes from the env, no extra lamps */
  env: {
    paper: '/env/v2-env-paper-polished.exr', // S02 (3D Designer 16cfbaf: made for the polished finish)
    night: '/env/v2-env-night-polished.exr', // S03
    dusk: '/env/v2-env-dusk.exr', // S05 (3D Designer: low ochre sun and glow, dark sky)
    photo: '/env/hero-env-warm.jpg', // S01: the warm desk photo as the env (V1 approach, D-080; D-177)
  },
} as const;
