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
    paper: '/env/v2-env-paper.exr', // S01, S02
    night: '/env/v2-env-night.exr', // S03
    photo: '/env/hero-env.jpg', // S01 over the moss photograph (V1 approach, D-080)
  },
} as const;
