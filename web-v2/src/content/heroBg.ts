/**
 * S01 background photograph (D-080, D-177, D-179). ONE place to swap it.
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
  v1Ratio: 1818 / 1037,
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
  ringLeft: 0.3897,
  wordGap: 36,
  /** transparent ring + pedestal + shadows in the photo's own frame (the poster) */
  poster: '/ring-fallback/fb-s01-pedestal-alpha.webp',
  desktop: {
    srcset: '/hero/hero-warm-desk-v2-960.webp 960w, /hero/hero-warm-desk-v2-1818.webp 1818w',
    src: '/hero/hero-warm-desk-v2-1818.webp',
    width: 1818,
    height: 1037,
    origW: 1,
    zoomFrom: 1.14,
    /** ring + pedestal size against the photo (1 = the 3D Designer's framing) */
    subject: 1,
    /** vertical shift of ring + pedestal against the photo (fraction of the photo height, − = up) */
    subjectDy: 0,
    /** light first paint: preloaded, shown under the full image */
    placeholder: '/hero/hero-warm-desk-v2-960.webp',
  },
  mobile: {
    media: '(max-width: 760px)',
    srcset: '/hero/hero-warm-desk-v2-960.webp 960w, /hero/hero-warm-desk-v2-1818.webp 1818w',
    width: 1818,
    height: 1037,
    origW: 1,
    zoomFrom: 1.1,
    /** D-179: a portrait phone covers the photo by its height, so at 1 the 41 mm pedestal (~490 px)
     *  would run off both sides and read as the desk; at 0.62 it is ~300 px of 375 and reads as a
     *  pedestal (the ring stays ~175 px wide) */
    subject: 0.62,
    /** D-179 Stage 2: lifted so the intro + scroll hint at the bottom do not cover the pedestal */
    subjectDy: -0.14,
    placeholder: '/hero/hero-warm-desk-v2-960.webp',
  },
  /** warm dim over the photo (0..1); the photo is already a night scene */
  dim: 0.12,
};
