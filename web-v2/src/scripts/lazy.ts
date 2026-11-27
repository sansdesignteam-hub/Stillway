/**
 * QA27 G-19: pictures that are not fetched at page load.
 * Everything visible lives on one fixed stage, so every <img> is "in the viewport" from the first
 * frame and loading="lazy" fetches them all at once. Deferred pictures carry their URLs in
 * data-srcset / data-src (Img.astro `defer`, Specs.astro, AppPhone.astro, the ring stills);
 * story.ts calls `fetchPictures` two sections ahead and `decodePictures` one section ahead, so a
 * picture is downloaded and decoded before the scroll reaches it, never in the frame it appears.
 */
const HELD = '[data-srcset], [data-src]';

/** start loading the held pictures under root that match `only` (sources first, then the img) */
export function fetchPictures(root: ParentNode, only: (el: HTMLElement) => boolean = () => true) {
  root.querySelectorAll<HTMLElement>(HELD).forEach((s) => {
    if (!only(s)) return;
    if (s.dataset.srcset) s.setAttribute('srcset', s.dataset.srcset);
    if (s.dataset.src) s.setAttribute('src', s.dataset.src);
    delete s.dataset.srcset;
    delete s.dataset.src;
  });
}

/** decode off the main thread now, so the first frame that shows them has nothing left to decode */
export function decodePictures(root: ParentNode) {
  root.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    if (!img.currentSrc && !img.getAttribute('src')) return;
    img.decode?.().catch(() => {
      /* not loaded yet or failed: the browser decodes it when it paints */
    });
  });
}

export const isStill = (el: HTMLElement) => el.hasAttribute('data-ring-fallback');
