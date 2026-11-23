/**
 * S11 Closing, FAQ & footer — 06:50 tomorrow · Night + Ember glow (D-098; flow Storyboard §2, look
 * Figma sticky 40004118:150, Oryzo).
 * u: -1..0 connection from S10: the Night panel (with the Ember glow) rises over Sand, headline and
 *          panel of S10 move up and out; the ring in the chosen finish moves to the middle and grows
 *          behind the text; navbar Light → Dark and clock 22:00 → 06:50 Tomorrow as the edge passes
 *  0  state 1  "TOMORROW MORNING, see your night." across the ring
 *  1  state 2  one button + one small line; the ring smaller, still in the middle
 *  2  state 3  the FAQ column; the ring and the glow have left upward with the canvas
 *  3  state 4  statement, footer and the full-width wordmark
 * One unbroken dark canvas: past state 2 the column moves like a page (track measured from the blocks).
 */
import { put, seg, lerp, clamp01, type Ctx } from '../anim';
import { pose, ANGLE, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { finishPose } from '../finish';

let root: HTMLElement | null = null;
let el: Record<string, HTMLElement | null> = {};
let stops = [0, 0, 0];
let measured = '';
let trackY = 0;

function measure() {
  if (!el.faq || !el.foot) return;
  const H = window.innerHeight;
  stops = [0, el.faq.offsetTop, Math.max(el.faq.offsetTop, el.foot.offsetTop + el.foot.offsetHeight - H)];
}

/** canvas offset for u: pinned through state 2, then it moves like a page */
const yOf = (u: number) => {
  if (u <= 1) return 0;
  if (u <= 2) return lerp(stops[0], stops[1], clamp01(u - 1));
  return lerp(stops[1], stops[2], clamp01(u - 2));
};

/** scroll the page so a block is in view (keyboard focus inside the moving canvas) */
function scrollToState(uTarget: number) {
  const track = document.getElementById('close');
  if (!track) return;
  const vh = (document.querySelector('[data-vh]') as HTMLElement | null)?.offsetHeight || window.innerHeight;
  const top = track.getBoundingClientRect().top + window.scrollY + (Number(track.dataset.tin) + uTarget) * vh;
  window.scrollTo({ top });
}

function initFaq(r: HTMLElement) {
  const qs = [...r.querySelectorAll<HTMLButtonElement>('[data-cl-q]')];
  qs.forEach((b) =>
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      // one answer open at a time
      qs.forEach((o) => {
        const on = o === b && open;
        o.setAttribute('aria-expanded', String(on));
        const a = document.getElementById(o.getAttribute('aria-controls') ?? '');
        if (a) a.hidden = !on;
      });
      measured = '';
    }),
  );
  el.faq?.addEventListener('focusin', () => scrollToState(2));
  el.foot?.addEventListener('focusin', () => scrollToState(3));
  el.hero?.addEventListener('focusin', () => scrollToState(1));

  // wordmark shine: once per hover; on touch screens once when it comes into view
  const word = el.word;
  if (word) {
    const shine = () => {
      word.classList.remove('is-shine');
      void word.offsetWidth;
      word.classList.add('is-shine');
    };
    word.addEventListener('mouseenter', shine);
    word.addEventListener('animationend', () => word.classList.remove('is-shine'));
    if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) {
          shine();
          io.disconnect();
        }
      }, { threshold: 0.6 });
      io.observe(word);
    }
  }
}

export const close: SectionMotion = {
  init(r) {
    root = r;
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = {
      track: q('[data-cl-track]'),
      hero: q('[data-cl-hero]'),
      faq: q('[data-cl-faq]'),
      foot: q('[data-cl-foot]'),
      title: q('[data-cl-title]'),
      cta: q('[data-cl-cta]'),
      glow: q('[data-cl-glow]'),
      word: q('[data-cl-word]'),
    };
    initFaq(r);
    window.addEventListener('resize', () => (measured = ''));
    document.fonts?.ready.then(() => (measured = ''));
  },
  update(u, ctx) {
    const key = `${window.innerWidth}x${window.innerHeight}`;
    if (key !== measured) {
      measured = key;
      measure();
    }
    trackY = yOf(u);
    if (el.track) el.track.style.transform = `translate3d(0, ${(-trackY).toFixed(1)}px, 0)`;
    const t = seg(u, -0.35, 0);
    put(el.title, { o: Math.min(1, t * 5), y: (1 - t) * 48 }, ctx);
    const c = seg(u, 0.35, 0.85);
    put(el.cta, { o: Math.min(1, c * 5), y: (1 - c) * 40 }, ctx);
    // the glow rises with the panel and leaves upward with the ring and the canvas
    put(el.glow, { o: seg(u, -0.6, -0.2), y: -trackY }, ctx);
  },
  ring(u, ctx) {
    const m = ctx.mobile;
    const H = window.innerHeight;
    const w = lerp(m ? 0.78 : 0.42, m ? 0.56 : 0.3, seg(u, 0.3, 1));
    // moves with the canvas and leaves off the top (never faded, D-120)
    const up = yOf(u) / H + seg(yOf(u) / H, 0.4, 0.9) * 0.5;
    return pose({
      x: 0,
      y: (m ? 0.02 : 0) + up,
      w,
      ...ANGLE.facing,
      // D-098 r1: the neutral studio env (as S05) so every finish reads in its own colour on the dark;
      // the Night env left Gold almost black. A warm rim from the glow side.
      light: 0,
      rim: 0,
      warm: 0.7,
      ...finishPose(1),
    });
  },
  // 10 → 11: the ring in the chosen finish moves to the middle as Sand turns to Night
  ringIn(x, _ctx, from, to): Pose {
    const t = seg(x, 0.25, 0.75);
    const o = {} as Pose;
    for (const k of Object.keys(from) as (keyof Pose)[]) o[k] = from[k] + (to[k] - from[k]) * t;
    return o;
  },
};
