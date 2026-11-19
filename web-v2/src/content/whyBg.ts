/**
 * S02 background photograph (D-088): a soft wall with leaf shadows (ref design/v2/references/
 * s02-ref-shadow-wall.png), made by the Visual Director. ONE place to set it.
 *
 * Until the files arrive `desktop` / `mobile` stay null and S02 shows plain Paper (no stand-in).
 * When they land: copy them to public/why/, fill the paths, and tune `position` per breakpoint
 * (CSS object-position: which part of the photo stays in view when it is cropped to cover).
 * `envTint`: optional multiplier for the paper env while S02 shows the photo, if the polished ring
 * needs to sit warmer/cooler against it (1 = unchanged).
 */
export const whyBg: {
  desktop: { src: string; srcset?: string; width: number; height: number; position: string } | null;
  mobile: { src: string; srcset?: string; width: number; height: number; position: string; media: string } | null;
  /** parallax travel over the whole section, as a fraction of the viewport height */
  parallax: number;
  /** extra scale so the parallax never shows an edge */
  overscan: number;
  envTint: number;
} = {
  // option B (warm), Visual Director 0b40d41; leaves and shadows top/top-right, clean wall ≈ Paper
  desktop: {
    src: '/why/s02-wall-B-desktop-1920x1080.webp',
    srcset: '/why/s02-wall-B-desktop-1920x1080.webp 1920w, /why/s02-wall-B-desktop-2880x1620.webp 2880w',
    width: 2880,
    height: 1620,
    position: '50% 20%', // VD note: keeps the leaves clear of the navbar CTA at 1440
  },
  mobile: {
    src: '/why/s02-wall-B-mobile-1080x1920.webp',
    srcset: '/why/s02-wall-B-mobile-1080x1920.webp 1080w, /why/s02-wall-B-mobile-1440x2560.webp 1440w',
    width: 1440,
    height: 2560,
    position: '50% 30%',
    media: '(max-width: 760px)',
  },
  parallax: 0.03,
  overscan: 1.04,
  envTint: 1,
};
