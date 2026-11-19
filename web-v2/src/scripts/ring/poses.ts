/**
 * Ring pose on the fixed canvas (D-063).
 * x, y: offset of the ring centre from the viewport centre, as a fraction of the viewport
 *       (x of width, y of height, y up).
 * w:    ring width as a fraction of the viewport width (capped by height in stage.ts).
 * rx, ry, rz: rotation in radians. 0/0/0 = the opening faces the camera (a circle).
 * spin: turn about the ring's own axis (radians); brings the engraved logo (outer band, opposite
 *       the sensor window) toward or away from the viewer.
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
  light: number;
  alpha: number;
}

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = {} as Pose;
  for (const k of Object.keys(a) as (keyof Pose)[]) o[k] = a[k] + (b[k] - a[k]) * t;
  return o;
};

/**
 * Named angles used by S01–S03, tuned by eye against the V2 GLB (stage 1).
 * spin = π turns the engraved "Stillway" to the visible outer band and the two sensor windows
 * to the visible inner wall.
 */
const LOGO = Math.PI;
export const ANGLE = {
  /** three-quarter: outer band with the logo on the left, inner wall and sensors on the right */
  threeQuarter: { rx: -0.42, ry: 0.95, rz: 0.12, spin: LOGO },
  /** "facing the camera": opening toward the viewer, slight tilt so the band reads as a band */
  facing: { rx: -0.22, ry: 0.18, rz: 0.04, spin: LOGO },
  /** tilted, rising (S01 state 2) */
  tilted: { rx: -0.62, ry: 0.55, rz: 0.22, spin: LOGO + 0.25 },
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

export const pose = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, w: 0.34, rx: 0, ry: 0, rz: 0, spin: 0, light: 0, alpha: 1, ...p });
