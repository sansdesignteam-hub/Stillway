/**
 * S09 The app — 21:00 · Paper (D-096; flow Storyboard §2, look Figma sticky 40004185:54).
 * u: -1..0 connection from S08 (the title fades; the violet light dims, a brief green; the ring shrinks
 *          and leaves upward; Night → Paper; the phone rises to the middle on the Heart rate screen;
 *          chip, texts and footer come in during 70–100%)
 *  0  state 1  Heart rate (green)
 *  1  state 2  Sleep (blue)
 *  2  state 3  Recovery (violet)
 *  > 2.6       to S10 (placeholder): everything fades, Paper → Sand
 * The phone stays still; only its screen content scrolls (one page per state, with a dwell).
 */
import { put, seg, lerp, clamp01, smooth, window4, type Ctx } from '../anim';
import { pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';

const END = 2.6;
let el: Record<string, HTMLElement | null> = {};
let lefts: HTMLElement[] = [];
let rights: HTMLElement[] = [];
let flabels: HTMLElement[] = [];
let cards: HTMLElement[] = [];
let tabs: HTMLElement[] = [];
let page = 0;
let lastIdx = -1;

const focusOf = (u: number) => {
  const raw = clamp01(u / 2) * 2;
  const base = Math.floor(raw);
  return Math.min(2, base + smooth(smooth(raw - base)));
};

export const app: SectionMotion = {
  init(r) {
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    const all = (s: string) => [...r.querySelectorAll<HTMLElement>(s)];
    el = { phone: q('[data-p-phone]'), scroll: q('[data-p-scroll]'), sim: q('[data-p-sim]'), foot: q('[data-p-foot]'), prog: q('[data-p-prog]'), pct: q('[data-p-pct]') };
    lefts = all('[data-p-left]');
    rights = all('[data-p-right]');
    flabels = all('[data-p-flabel]');
    cards = all('[data-p-card]');
    tabs = all('[data-p-tab]');
  },
  update(u, ctx) {
    const H = window.innerHeight;
    const out = 1 - seg(u, END, END + 0.4);
    const rise = ctx.reduced ? (u >= -0.5 ? 1 : 0) : seg(u, -0.5, -0.05);
    const inn = seg(u, -0.3, 0); // 70–100%: chip, texts, footer
    put(el.phone, { o: Math.min(1, rise * 1.6) * out, y: (1 - rise) * H * 0.55 }, ctx);
    put(el.sim, { o: inn * out }, ctx);
    put(el.foot, { o: inn * out }, ctx);

    const f = focusOf(u);
    const near = (i: number) => clamp01(1 - Math.abs(f - i) * 2.2);
    lefts.forEach((l, i) => put(l, { o: near(i) * inn * out, y: (1 - near(i)) * 10 }, ctx));
    rights.forEach((l, i) => put(l, { o: near(i) * inn * out, y: (1 - near(i)) * 10 }, ctx));
    flabels.forEach((l, i) => (l.style.opacity = near(i).toFixed(3)));

    // the screen scrolls one page per state; the phone does not move
    if (el.scroll) {
      // one page = the visible screen height (between the status bar and the tab bar)
      const vh = el.scroll.parentElement?.offsetHeight ?? 0;
      if (vh && vh !== page) {
        page = vh;
        el.scroll.style.setProperty('--pageh', `${vh}px`);
      }
      if (ctx.reduced) el.scroll.style.transform = `translate3d(0, ${(-Math.round(f) * page).toFixed(1)}px, 0)`;
      else el.scroll.style.transform = `translate3d(0, ${(-f * page).toFixed(1)}px, 0)`;
    }
    const idx = Math.round(f);
    if (idx !== lastIdx) {
      lastIdx = idx;
      cards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
      tabs.forEach((t, i) => t.classList.toggle('is-on', i === idx));
      if (el.pct) el.pct.textContent = `${[33, 66, 100][idx]}%`;
    }
    el.prog?.style.setProperty('--p', ((f + 1) / 3).toFixed(3));
  },
  // no ring in S09
  ring: () => pose({ x: 0, y: 0.6, w: 0.12, alpha: 0, light: 0 }),
  // 08 → 09: the violet light dims, the light flashes green for a moment, then the ring shrinks and
  // leaves upward before Night turns to Paper
  ringIn(x, _ctx, from): Pose {
    const flash = window4(x, 0.16, 0.22, 0.28, 0.36);
    const go = seg(x, 0.28, 0.62);
    return {
      ...from,
      led: from.led * (1 - seg(x, 0, 0.16)) + flash,
      ledc: x < 0.16 ? from.ledc : 0,
      flare: from.flare * (1 - seg(x, 0, 0.16)) + flash * 0.8,
      y: from.y + go * 0.75,
      w: from.w * lerp(1, 0.45, go),
      alpha: 1 - seg(x, 0.42, 0.62),
    };
  },
};
