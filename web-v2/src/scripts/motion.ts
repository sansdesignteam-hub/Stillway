/**
 * Motion entry for Stillway V2.
 * - Lenis smooth scroll on the GSAP ticker (skipped for reduced motion).
 * - story.ts: the fixed stage, sections, clock, rail, navbar theme — updated every tick.
 * - The ring (three.js) loads lazily after first paint and joins the story when ready.
 * - Mobile menu panel.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { initStory } from './story';
import { loadRing } from './ring';

declare global {
  interface Window {
    __stillwayMotion?: boolean;
  }
}

export let lenis: Lenis | null = null;

export function initMotion() {
  window.__stillwayMotion = true;
  // dev only: ?reduced-test on localhost simulates prefers-reduced-motion (review screenshots)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduced');

  if (!reduced) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
    gsap.ticker.add((time) => lenis!.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const story = initStory({ reduced, subscribe: (fn) => gsap.ticker.add(fn) });

  // Reduced motion: no WebGL; the still poses from the 3D Designer (public/ring-fallback) stand in.
  const canvas = document.querySelector<HTMLCanvasElement>('[data-ring-canvas]');
  if (canvas && !reduced) {
    const start = () =>
      loadRing()
        .then(({ createRingStage }) => createRingStage(canvas))
        .then((r) => r && story.setRing(r))
        .catch(() => {
          /* no WebGL / model failed: the story reads without the ring */
        });
    if ('requestIdleCallback' in window) (window as any).requestIdleCallback(start, { timeout: 800 });
    else setTimeout(start, 200);
  }

  initMenu();
  initAnchors();
}

/** In-page links scroll with Lenis; the hash targets are the tracks. */
function initAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      if (id === '#main') return; // skip link: focus only
      const target = id === '#top' ? 0 : document.querySelector<HTMLElement>(id);
      if (target === null) return;
      e.preventDefault();
      closeMenu?.();
      // land on state 1 of the section (after its incoming connection)
      const tin = target === 0 ? 0 : Number(target.dataset.tin ?? 0);
      const y = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY + tin * window.innerHeight;
      if (lenis) lenis.scrollTo(y, { duration: 1.6 });
      else window.scrollTo({ top: y });
    }),
  );
}

let closeMenu: (() => void) | null = null;
/** Mobile menu panel, same behaviour as V1 (D-053): focus trap, Escape, backdrop closes. */
function initMenu() {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const openers = [...document.querySelectorAll<HTMLButtonElement>('[data-menu-open]')];
  if (!menu || !openers.length) return;
  const panel = menu.querySelector<HTMLElement>('.menu__panel')!;
  const closeBtn = menu.querySelector<HTMLButtonElement>('.menu__close')!;
  let lastFocus: HTMLElement | null = null;
  const setOpen = (open: boolean) => {
    menu.classList.toggle('is-open', open);
    menu.toggleAttribute('hidden', false);
    document.documentElement.classList.toggle('menu-open', open);
    openers.forEach((b) => b.setAttribute('aria-expanded', String(open)));
    if (open) {
      lenis?.stop();
      lastFocus = document.activeElement as HTMLElement;
      window.setTimeout(() => closeBtn.focus(), 60);
    } else {
      lenis?.start();
      lastFocus?.focus?.();
    }
  };
  closeMenu = () => menu.classList.contains('is-open') && setOpen(false);
  openers.forEach((b) => b.addEventListener('click', () => setOpen(true)));
  menu.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') {
      const f = [...panel.querySelectorAll<HTMLElement>('a, button')];
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => e.matches && closeMenu?.());
}
