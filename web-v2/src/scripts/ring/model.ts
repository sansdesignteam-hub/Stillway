/**
 * The ring model V2 loads. ONE place to swap it.
 *
 * V2 ring with the engraved "Stillway" text (D-061), stage 1 from the 3D Designer:
 * design/3d/v2/stillway-ring-v2-silver_web.glb + HANDOFF-v2-ring.md (branch 3D-Designer, 41c118e).
 * Finish on the web is satin (roughness 0.26); brushed comes in stage 2 — do not fake it here.
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
  /** emissive intensity when lit (3D handoff: 6–12 with AgX) */
  ledIntensity: 8,
} as const;
