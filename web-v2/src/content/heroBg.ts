/**
 * S01 background photograph (D-080, D-177). ONE place to swap it.
 *
 * D-177: "Warm Desk Scene Without Ring Shadow" (Figma 40004704:5849, design/assets/v2/hero,
 * 1672 × 941): a warm desk at night, lamp upper right, a light wooden pedestal in the centre where
 * the ring comes down. Not outpainted, so the photo can only zoom out down to "cover": it starts a
 * little zoomed in (zoomFrom) and settles to cover (scale 1) while the ring zooms in. The zoom is
 * centred on the pedestal (anchor), so the landing point keeps its place on screen.
 */
export const heroBg = {
  /** photo ratio: the element covers the viewport at this ratio */
  v1Ratio: 1672 / 941,
  /** the pedestal top (fractions of the photo): zoom origin, landing point, contact shadow */
  anchor: { x: 0.496, y: 0.745 },
  desktop: {
    srcset: '/hero/hero-warm-desk-960.webp 960w, /hero/hero-warm-desk-1672.webp 1672w',
    src: '/hero/hero-warm-desk-1672.webp',
    width: 1672,
    height: 941,
    origW: 1,
    zoomFrom: 1.14,
    /** light first paint: preloaded, shown under the full image */
    placeholder: '/hero/hero-warm-desk-960.webp',
  },
  mobile: {
    media: '(max-width: 760px)',
    srcset: '/hero/hero-warm-desk-960.webp 960w, /hero/hero-warm-desk-1672.webp 1672w',
    width: 1672,
    height: 941,
    origW: 1,
    zoomFrom: 1.1,
    placeholder: '/hero/hero-warm-desk-960.webp',
  },
  /** warm dim over the photo (0..1); the photo is already a night scene */
  dim: 0.12,
};
