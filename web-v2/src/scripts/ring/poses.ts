/**
 * Ring pose on the fixed canvas (D-063).
 * x, y: offset of the ring centre from the viewport centre, as a fraction of the viewport
 *       (x of width, y of height, y up).
 * w:    ring width as a fraction of the viewport width (capped by height in stage.ts).
 * rx, ry, rz: rotation in radians. 0/0/0 = the opening faces the camera (a circle).
 * spin: turn about the ring's own axis (radians); brings the engraved logo (outer band, opposite
 *       the sensor window) toward or away from the viewer.
 * roll: turn in the screen plane (radians), applied after rx/ry/rz (default 0).
 * light: 0 = Day studio (Paper), 1 = Night rim light (S03).
 * alpha: canvas opacity (the ring is the only object, so fading the canvas fades the ring).
 */
export interface Pose {
  x: number;
  y: number;
  w: number;
  rx: number;
  ry: number;
  rz: number;
  spin: number;
  roll: number;
  light: number;
  alpha: number;
}

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = {} as Pose;
  for (const k of Object.keys(a) as (keyof Pose)[]) o[k] = a[k] + (b[k] - a[k]) * t;
  return o;
};

/**
 * Named angles used by S01–S03, matched by eye to design/v2/references/ring-logo-engrave-ref.png
 * and the 3D Designer's fallback poses (V2 GLB, stage 2): opening on the left, outer band on the
 * right, the engraved "Stillway" reading bottom → top with the letter tops toward the opening,
 * sensor windows visible on the inner wall (D-075). spin 0 puts the logo on the visible band.
 */
export const ANGLE = {
  /** reference three-quarter (RING_REF): band upright, logo readable bottom → top */
  threeQuarter: { rx: -0.15, ry: -0.85, rz: 0, spin: 0 },
  /** "facing the camera": opening toward the viewer, slight tilt so the band reads as a band */
  facing: { rx: -0.2, ry: -0.2, rz: 0, spin: 0 },
  /** tilted, rising (S01 state 2) */
  tilted: { rx: -0.5, ry: -0.6, rz: -0.18, spin: 0.2 },
};

/** LED colours from Moodboard §2.3 (product light, not UI colour). */
export const LED = {
  heartRate: '#34E07A',
  sleep: '#3B8CFF',
  recovery: '#A06BFF',
  off: '#FF3B30',
} as const;

/** Pose along keyframes [u, pose], eased between neighbours; clamps outside the range. */
export function along(u: number, frames: Array<[number, Pose]>): Pose {
  if (u <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [u1, p1] = frames[i];
    if (u <= u1) {
      const [u0, p0] = frames[i - 1];
      const t = (u - u0) / (u1 - u0);
      return lerpPose(p0, p1, t * t * (3 - 2 * t));
    }
  }
  return frames[frames.length - 1][1];
}

export const pose = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, w: 0.34, rx: 0, ry: 0, rz: 0, spin: 0, roll: 0, light: 0, alpha: 1, ...p });
