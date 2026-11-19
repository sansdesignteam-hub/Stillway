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
  desktop: null, // e.g. { src: '/why/why-bg-desktop.webp', width: 3840, height: 2160, position: '50% 50%' }
  mobile: null, // e.g. { src: '/why/why-bg-mobile.webp', width: 1080, height: 1920, position: '50% 40%', media: '(max-width: 760px)' }
  parallax: 0.04,
  overscan: 1.08,
  envTint: 1,
};
