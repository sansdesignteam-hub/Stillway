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
  /**
   * D-178: the pedestal traced in the photo (photo px of 1672 × 941). `top` = its top face, `body` =
   * its whole silhouette (top + front + sides). The ring stage turns them into screen-space stencil
   * masks: the shadow falls on the top face only inside `top`, on the desk only outside `body`, and
   * not at all on the visible sides — so it matches the photo's own outline (no patch, no double).
   */
  pedestal: {
    top: [[547.5, 727.5], [552, 712], [560, 700], [571, 686], [587.5, 672.5], [606, 665], [630, 661], [850, 668], [1075, 679], [1100, 688], [1110, 700], [1116, 717.5], [1090, 750], [1050, 767.5], [1020, 772.5], [820, 762], [650, 751], [575, 741.5], [550, 737.5]],
    body: [[547.5, 727.5], [552, 712], [560, 700], [571, 686], [587.5, 672.5], [606, 665], [630, 661], [850, 668], [1075, 679], [1100, 688], [1110, 700], [1116, 717.5], [1115, 740], [1100, 790], [1060, 825], [1025, 840], [950, 855], [800, 848], [650, 835], [570, 820], [546, 800], [545, 760]],
  },
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
