/**
 * Motion foundation for Stillway V2.
 * - Lenis smooth scroll driven by the GSAP ticker; ScrollTrigger kept in sync.
 * - Reduced motion: no Lenis, no pinning, no loops. Every state appears with a short
 *   fade (±300 ms, --fade-reduced) via [data-reveal] + .is-in.
 * - The navbar clock (clock.ts).
 * - A registry so each section can add its own pinned timeline later:
 *     registerSection('hero', ({ el, reduced }) => { ...; return cleanup })
 *   Sections are wired in once HANDOFF-v2.md exists; none are animated yet.
 * Only transform, opacity and clip-path should be animated.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initClock } from './clock';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __stillwayMotion?: boolean;
  }
}

export interface SectionCtx {
  el: HTMLElement;
  reduced: boolean;
  lenis: Lenis | null;
}
type SectionInit = (ctx: SectionCtx) => void | (() => void);
const registry = new Map<string, SectionInit>();

/** Register a section's motion by its id (src/content/sections.ts). Call before initMotion(). */
export function registerSection(id: string, init: SectionInit) {
  registry.set(id, init);
}

export let lenis: Lenis | null = null;

export function initMotion() {
  window.__stillwayMotion = true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  /* ---------- smooth scroll ---------- */
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95, anchors: { offset: 0 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis!.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- clock + navbar theme ---------- */
  const clock = initClock((fn) => {
    if (lenis) lenis.on('scroll', fn);
    else window.addEventListener('scroll', fn, { passive: true });
  });
  ScrollTrigger.addEventListener('refresh', clock.refresh);

  /* ---------- reduced motion: fade states in ---------- */
  if (reduced) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -10% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  }

  /* ---------- per-section motion ---------- */
  const mm = gsap.matchMedia();
  document.querySelectorAll<HTMLElement>('[data-section]').forEach((el) => {
    const init = registry.get(el.dataset.section!);
    if (!init) return;
    mm.add('all', () => init({ el, reduced, lenis }));
  });

  // fonts change line breaks, so pins must be measured after they load
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
