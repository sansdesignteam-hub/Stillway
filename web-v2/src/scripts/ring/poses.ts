/**
 * Ring poses and lighting presets carried over from V1 (web/src/scripts/heroRing.ts and
 * closeRing.ts, tuned with the 3D Designer, D-051/D-052). V2 poses per section come from
 * HANDOFF-v2.md and the 3D Designer; add them here by name.
 *
 * A pose is measured like a photo cut-out: the opening's axis leans `theta`° from screen-right
 * toward up and `phi`° away from the camera; `psi` turns the ring about that axis; `roll` leans
 * it in the screen plane.
 */
export interface RingPose {
  theta: number;
  phi: number;
  psi: number;
  scale: number;
  roll?: number;
}

export const POSES = {
  v1Hero: { theta: 66, phi: 50, psi: 0, scale: 1.0 },
  v1Close: { theta: 118, phi: 62, psi: -35, scale: 0.9, roll: 40 },
  /** opening faces the camera, logo on top: placeholder for "menghadap kamera" states */
  front: { theta: 90, phi: 0, psi: 0, scale: 1.0 },
} satisfies Record<string, RingPose>;

export interface Lighting {
  env: string; // equirect jpg in /public/env
  envRotationY: number;
  envIntensity: number;
  exposure: number;
  silver: { envMapIntensity: number; roughness: number; tint?: string };
  liner: number;
  lights: Array<
    | { kind: 'dir'; color: number; intensity: number; position: [number, number, number] }
    | { kind: 'hemi'; sky: number; ground: number; intensity: number }
  >;
}

/** Day: V1 hero (warm morning sun, upper left). Night: V1 CTA (moon + warm rim). */
export const LIGHTING = {
  day: {
    env: '/env/hero-env.jpg',
    envRotationY: Math.PI * 0.6,
    envIntensity: 1,
    exposure: 1.15,
    silver: { envMapIntensity: 1.5, roughness: 0.06 },
    liner: 0.5,
    lights: [
      { kind: 'dir', color: 0xffe2b8, intensity: 2.2, position: [-600, 700, 500] },
      { kind: 'hemi', sky: 0xfff1dc, ground: 0x3b3a1c, intensity: 0.35 },
    ],
  },
  night: {
    env: '/env/env-night.jpg',
    envRotationY: Math.PI * 0.6,
    envIntensity: 3.5,
    exposure: 1.7,
    silver: { envMapIntensity: 4.5, roughness: 0.07, tint: '#ffe9cf' },
    liner: 0.6,
    lights: [
      { kind: 'dir', color: 0xffe6c4, intensity: 7, position: [500, 800, 400] },
      { kind: 'dir', color: 0xffe6c4, intensity: 12, position: [-500, 300, -200] },
      { kind: 'hemi', sky: 0x6f86c8, ground: 0x151a10, intensity: 0.4 },
    ],
  },
} satisfies Record<string, Lighting>;

/** LED colours from Moodboard §2.3 (product light, not UI colour). */
export const LED = {
  heartRate: '#34E07A',
  sleep: '#3B8CFF',
  recovery: '#A06BFF',
  off: '#FF3B30',
} as const;
