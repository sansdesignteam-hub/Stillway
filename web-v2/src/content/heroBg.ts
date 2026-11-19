/**
 * S01 background photograph (D-080). ONE place to swap it.
 *
 * Extended by the Visual Director (design/assets/v2/hero/, branch Visual-Director 72973fa):
 * the V1 hero photo (H-01-hero-bg-noshadow.png, 2556 × 1448) sits pixel-identical in the centre of
 * an outpainted canvas, so the scene can zoom OUT while the ring zooms in (Oryzo pattern).
 *
 * Sizing: the element is sized so that the ORIGINAL photo rectangle covers the viewport exactly as
 * V1's hero did (cover of a 2556:1448 box), i.e. element width = V1 cover width / orig.w.
 * At scale 1 the first frame is V1; scaling happens around the canvas centre (= photo centre).
 * Safe minimum scale (no empty edge): ≈ 0.45 desktop 16:9, 0.42 at 16:10, 0.38 mobile 390 × 844.
 */
export const heroBg = {
  /** V1 photo ratio: the cover box every layout starts from */
  v1Ratio: 2556 / 1448,
  desktop: {
    srcset: '/hero/hero-bg-v2-3840.webp 3840w, /hero/hero-bg-v2-5760.webp 5760w',
    src: '/hero/hero-bg-v2-3840.webp',
    width: 3840,
    height: 2560,
    /** original photo width as a fraction of the canvas width */
    origW: 2556 / 5760,
    zoomTo: 0.55,
  },
  mobile: {
    media: '(max-width: 760px)',
    srcset: '/hero/hero-bg-v2-mobile-1080x1920.webp 1080w, /hero/hero-bg-v2-mobile-2160x3840.webp 2160w',
    width: 2160,
    height: 3840,
    origW: 2556 / 2160,
    zoomTo: 0.5,
  },
  /** warm dim over the photo, as in V1 (0..1) */
  dim: 0.3,
};
