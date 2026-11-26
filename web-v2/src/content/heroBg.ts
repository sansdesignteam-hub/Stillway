/**
 * S01 background photograph (D-080, D-177, D-179, D-181). ONE place to swap it.
 *
 * D-181: the photo is now a PLATE: the upscaled desk photo (3632 × 2072) with the oak pedestal rendered
 * into it in Cycles (3D Designer, design/3d/v2/plate/, HANDOFF-s01-pedestal.md). The web no longer
 * shades a pedestal; stage.ts keeps its shape as an invisible proxy for depth and the live ring's
 * shadow. The poster is the ring + its shadow as a transparent layer over the plate (still = plate +
 * overlay), so it cross-fades to the live ring with no change on the pedestal. All files are built
 * by scripts/hero-plate.mjs; a new drop with the same names needs no code change. The D-179 notes
 * below describe the camera and framing, which are unchanged.
 *
 * D-179: the warm desk WITHOUT the pedestal (design/assets/v2/s01/hero-warm-desk-v2-*.webp, from
 * hero-warm-desk-nopedestal-src.png, 1818 × 1037). The pedestal is now 3D (3D Designer,
 * public/models/s01-pedestal.glb + s01-pedestal-pose.json) on the ring's canvas, and the poster
 * (reduced motion / no WebGL / first paint) is fb-s01-pedestal-alpha.webp laid over the photo in
 * the same frame, so both zoom together. D-177 zoom kept: the photo starts a little zoomed in
 * (zoomFrom) and settles to cover (scale 1) around `anchor` (the pedestal top).
 */
export const heroBg = {
  /** photo ratio: the element covers the viewport at this ratio */
  v1Ratio: 3632 / 2072,
  /** the pedestal top (fractions of the photo): zoom origin, so the pedestal keeps its place */
  anchor: { x: 0.503, y: 0.8 },
  /**
   * D-179: the 3D Designer's camera for this photo (s01-pedestal-pose.json): 70 mm on a 36 mm sensor
   * over the 1818 px frame width, optical axis shifted down by 0.135 of the width (Blender shift_y).
   * The ring stage maps the pedestal scene onto the photo with these.
   */
  cam: { frameW: 1818, frameH: 1037, focalPx: (70 / 36) * 1818, shiftY: 0.135 },
  /** where the pedestal's origin (bottom centre, on the desk) falls in the photo (fractions): phones
   *  scale ring + pedestal + shadows about this point (`subject` below), 3D and poster alike */
  subjectOrigin: { x: 0.5, y: 0.86 },
  /**
   * D-180: left edge of the resting ring's screen bbox, maximum hover tilt included, as a fraction of
   * the photo width (measured with ?inspect __ringScreenBox at 43f5c91's pose; re-measure if the pose
   * JSON changes). The desktop wordmark is sized so its right edge stays wordGap px left of it.
   */
  /* D-181b (0742ce3, ring s01_scale 1.125): 532 px at 1440 × 900 and 731 px at 1920 × 1080 → 0.3957 */
  ringLeft: 0.3957,
  wordGap: 33,
  /** the poster: transparent ring + ring shadow in the plate's own frame (ring-overlay-s01*), one set
   *  per plate; the phone ones are rendered in the phone framing, so no CSS scale is applied */
  poster: {
    desktop: { base: '/hero/ring-s01', widths: [1280, 1920, 3632] },
    mobile: { base: '/hero/ring-s01-m', widths: [1280, 1920] },
    portrait: { base: '/hero/ring-s01-mp', widths: [908, 1816] },
  },
  /**
   * D-181 plate sets (scripts/hero-plate.mjs): AVIF first, WebP fallback. `sizes` is the photo's real
   * width on screen at rest, cover × zoomFrom, so a 1440 px retina screen (3283 px needed) takes the
   * 3632 file and a 1440 px 1x screen the 1920 one; nothing larger than needed is fetched.
   */
  desktop: {
    widths: [1280, 1920, 2560, 3632],
    base: '/hero/plate-s01',
    sizes: 'max(114vw, 200lvh)',
    width: 3632,
    height: 2072,
    origW: 1,
    zoomFrom: 1.14,
    /** ring + pedestal size against the photo (1 = the 3D Designer's framing) */
    subject: 1,
    /** vertical shift of ring + pedestal against the photo (fraction of the photo height, − = up) */
    subjectDy: 0,
    /** light first paint: preloaded, shown under the full image */
    placeholder: '/hero/plate-s01-960',
  },
  /**
   * Phones (≤ 760 px) have their OWN plate: the pedestal is in the photo now, so the phone framing
   * (pedestal at `subject` of its desktop size about subjectOrigin, lifted by subjectDy) is rendered
   * into plate-s01-m by the 3D Designer; the live ring + shadows use the same 2D transform (stage.ts
   * photoCam), as before.
   */
  mobile: {
    media: '(max-width: 760px)',
    widths: [960, 1280, 1920],
    base: '/hero/plate-s01-m',
    sizes: 'max(110vw, 193lvh)',
    width: 3632,
    height: 2072,
    origW: 1,
    zoomFrom: 1.1,
    /** D-179: a portrait phone covers the photo by its height, so at 1 the 41 mm pedestal (~490 px)
     *  would run off both sides and read as the desk; at 0.62 it is ~300 px of 375 and reads as a
     *  pedestal (the ring stays ~175 px wide) */
    subject: 0.62,
    /** D-179 Stage 2: lifted so the intro + scroll hint at the bottom do not cover the pedestal */
    subjectDy: -0.14,
    placeholder: '/hero/plate-s01-m-960',
    /**
     * Portrait phones only ever show ≤ 43 % of the photo's width (aspect ≤ 3/4), so they get the
     * centre `crop` of the phone plate at full height: 2072 px of height for ~1/4 of the bytes of the
     * full frame. The <img> then fills only that centre strip of the photo box (Hero.astro).
     */
    portrait: {
      media: '(max-width: 760px) and (max-aspect-ratio: 3/4)',
      crop: 0.5,
      widths: [908, 1280, 1816],
      base: '/hero/plate-s01-mp',
      sizes: '97lvh', // crop × cover × zoomFrom = 0.5 × 175.3lvh × 1.1
    },
  },
  /** warm dim over the photo (0..1); the photo is already a night scene */
  dim: 0.12,
};

/** "/hero/plate-s01-1280.avif 1280w, …" */
export const plateSet = (set: { base: string; widths: readonly number[] }, ext: 'avif' | 'webp') => set.widths.map((w) => `${set.base}-${w}.${ext} ${w}w`).join(', ');
