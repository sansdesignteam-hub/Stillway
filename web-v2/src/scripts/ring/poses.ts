/**
 * Ring pose on the fixed canvas (D-063).
 * x, y: offset of the ring centre from the viewport centre, as a fraction of the viewport
 *       (x of width, y of height, y up).
 * w:    ring width as a fraction of the viewport width (capped by height in stage.ts).
 * rx, ry, rz: rotation in radians. 0/0/0 = the opening faces the camera (a circle).
 * spin: turn about the ring's own axis (radians); brings the engraved logo (outer band, opposite
 *       the sensor window) toward or away from the viewer.
 * roll: turn in the screen plane (radians), applied after rx/ry/rz (default 0).
 * photo: 1 = environment from the hero photograph (D-177: hero-env-warm.jpg, the warm desk) so the ring sits in the
 *        scene of S01 (D-080); 0 = the V2 env picked by `light`.
 * uncap: 0 = width capped at 82% of the viewport height, 1 = no cap (S01 zoom in).
 * dusk: 1 = the Dusk env (S05), swapped in with an intensity dip like night.
 * rim: 0..1 strength of the cold rim light that grazes the band edge in S03 (Ultrahuman ref).
 * warm: 0..1 weak warm (Cocoa) rim from the lower left (S05 Dusk glow side); the body stays neutral silver.
 * light: 0 = Day studio (Paper), 1 = Night rim light (S03).
 * led: 0..1 glow of the green light in sensor window A (S01 close-up shows it, as in the reference).
 * gloss: 1 = polished silver (finishes.json silver_polished) — every V2 section (D-085);
 *        0 = brushed as authored in the GLB (kept only as an option).
 * shadow: 0..1 opacity of the real-time cast shadows on the S01 pedestal and desk (D-179).
 * desk: 0..1 the S01 desk scene (D-179): the 3D pedestal (s01-pedestal.glb), its shadow catcher on
 *       the desk and the 3D Designer's camera matched to the photo (s01-pedestal-pose.json). 1 = the
 *       camera is that photo camera and the pedestal is fully shown; 0 = gone, default FOV.
 * deskZoom: the photo's CSS zoom (content/heroBg.ts), so the pedestal zooms with the photo.
 * fwd: 0..0.9 moves the ring toward the camera by this fraction of the camera distance while keeping its
 *      on-screen size and place (S01 zoom: keeps it in front of the 3D pedestal, D-179).
 * rest: 0..1 the ring stands on the pedestal in the pose JSON's ring pose (1) instead of x/y/w/r*.
 * pitch: turn about the screen X axis (radians), applied after rx/ry/rz and before roll; + tips the
 *        top of the ring toward the viewer (S06: logo on the band reads from slightly above).
 * fing: 0..1 finger proxy on (S06 state 4): a depth-only lathe along the index finger of the hand
 *       photo hides the back of the ring (design/3d/v2/s06-pose.json); fx, fy = ring seat (fractions
 *       of the viewport from the centre, y up), fs = CSS px per image px of the hand photo.
 * ledc: colour of window A while lit, 0 = green (heart rate) → 1 = blue (sleep) → 2 = violet (recovery),
 *       blended between the LED tokens (Moodboard §2.3, D-062). S08 drives it by scroll.
 *       2 → 3 (D-154): window A goes dark and the small red light in the lower window (led_power)
 *       comes on = off / battery empty; the flare and bounce move to that window.
 * flare: 0..1 soft flare on window A (thin streak + glow sprite) and its coloured bounce on the inner
 *        band (S08, client LED reference).
 * custom: 0..1 how much of the visitor's finish choice shows (S10–S11; 0 = polished Silver as everywhere
 *         else). finA → finB by finT (0 silver, 1 black, 2 gold; finishes.json *_polished, D-085).
 * lamp: 0..1 S10 Lamp light (D-100): one warm desk lamp from the side (amber edge highlight), env dimmed
 *       a little; base colours unchanged.
 * corner: 0..1 S03 corner light (D-136): one soft warm light from the upper right corner that
 *         grazes the band from above the side (Avoly ref); the body stays silver.
 * edge: 0..1 S03 state 1 (QA SL-02): one cold light grazing ONE edge of the band from behind on the
 *       left; no fill and no env lift, so the rest of the ring stays in Night.
 * envDim: 0..1.4 dims the environment reflections (S03 warm: the Paper studio env on Night, D-137;
 *         up to 1.4 = almost a silhouette before the S03 corner light reaches the ring, D-140).
 * blur: CSS blur of the ring canvas in px (03 → 04 lens, D-138).
 * table: 0..1 the S06 pine table GLB (D-146) and its opacity; tableD = ring diameter in px (the
 *        table's scale), tableY = the contact line (fraction from the centre, y up); tableShadow =
 *        0..1 the contact shadow under the ring on the table.
 * envRot: environment rotation (rad), S01 reflection movement (D-182).
 * skin: 0..1 S06 ring on the finger (QA27 D-01): the ring takes the light of the hand photo (warm key
 *       from the upper right, warm skin bounce on the lower and inner band); its contact shadow on the
 *       finger is drawn on the finger proxy whenever the proxy is on (fing).
 * alpha: canvas opacity (the ring is the only object, so fading the canvas fades the ring).
 * drop: the canvas moved down by this many CSS px (06 → 07, D-192: the ring leaves with the hand photo).
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
  dusk: number;
  rim: number;
  warm: number;
  photo: number;
  uncap: number;
  led: number;
  gloss: number;
  shadow: number;
  desk: number;
  deskZoom: number;
  rest: number;
  fwd: number;
  /** D-180: hover tilt applied while the ring rests (rad; pitch, yaw about the contact point) */
  tiltX: number;
  tiltY: number;
  pitch: number;
  fing: number;
  fx: number;
  fy: number;
  fs: number;
  ledc: number;
  flare: number;
  custom: number;
  finA: number;
  finB: number;
  finT: number;
  lamp: number;
  corner: number;
  edge: number;
  envDim: number;
  blur: number;
  table: number;
  tableD: number;
  tableY: number;
  tableShadow: number;
  alpha: number;
  /** D-192: CSS translate of the ring canvas, px down */
  drop: number;
  /** D-182: turn of the environment about the vertical axis (rad): the moving reflections of S01 */
  envRot: number;
  /** D-185: 0..1 warm specular highlight of the S01 desk lamp on the band (live ring only) */
  glint: number;
  /** QA27 D-01: 0..1 the hand photo's light on the S06 ring (warm key + skin bounce) */
  skin: number;
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

export const pose = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, w: 0.34, rx: 0, ry: 0, rz: 0, spin: 0, roll: 0, light: 0, dusk: 0, rim: 0, warm: 0, photo: 0, uncap: 0, led: 0, gloss: 1, shadow: 0, desk: 0, deskZoom: 1, rest: 0, fwd: 0, tiltX: 0, tiltY: 0, pitch: 0, fing: 0, fx: 0, fy: 0, fs: 1, ledc: 0, flare: 0, custom: 0, finA: 0, finB: 0, finT: 0, lamp: 0, corner: 0, edge: 0, envDim: 0, blur: 0, table: 0, tableD: 0, tableY: 0, tableShadow: 0, alpha: 1, drop: 0, envRot: 0, glint: 0, skin: 0, ...p });
