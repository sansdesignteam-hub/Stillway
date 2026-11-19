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
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
    gsap.ticker.add((time) => lenis!.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const story = initStory({ reduced, subscribe: (fn) => gsap.ticker.add(fn) });

  const canvas = document.querySelector<HTMLCanvasElement>('[data-ring-canvas]');
  if (canvas) {
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
function initMenu() {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!menu || !btn) return;
  const label = btn.querySelector('[data-menu-label]');
  const set = (open: boolean) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? btn.dataset.close! : btn.dataset.open!;
    document.documentElement.classList.toggle('menu-open', open);
    if (open) lenis?.stop();
    else lenis?.start();
  };
  closeMenu = () => set(false);
  btn.addEventListener('click', () => set(menu.hidden));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !menu.hidden && (set(false), btn.focus()));
  window.matchMedia('(min-width: 720px)').addEventListener('change', (e) => e.matches && set(false));
}
