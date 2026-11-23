/**
 * S09 The app — 21:00 · Paper (D-096; flow Storyboard §2, look Figma sticky 40004185:54).
 * u: -1..0 connection from S08: the violet light dims, a brief green; the ring shrinks and leaves off
 *          the top; then the Paper panel rises with the phone in the middle (Heart rate screen); chip,
 *          texts and footer rise in during 70–100%
 *  0  state 1  Heart rate (green)
 *  1  state 2  Sleep (blue)
 *  2  state 3  Recovery (violet)
 *  > 2.6       to S10: the Sand panel rises, phone and texts move up and out with this panel
 * The phone stays still; only its screen content scrolls (one page per state, with a dwell).
 */
import { put, seg, lerp, clamp01, smooth, window4, roll, type Ctx } from '../anim';
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
let stops: number[] = [];
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
    // re-measure the page stops after a resize or when the fonts land
    const reset = () => (page = 0);
    window.addEventListener('resize', reset);
    document.fonts?.ready.then(reset);
  },
  update(u, ctx) {
    // the phone rises with the Paper panel (story.ts) and stays; nothing fades out — the Sand panel of
    // S10 covers this one and its content moves up and out (D-120)
    put(el.phone, { o: 1 }, ctx);
    const inn = seg(u, -0.3, 0); // 70–100%: chip, texts, footer rise in
    const rise = (1 - inn) * 40;
    put(el.sim, { o: Math.min(1, inn * 5), y: rise }, ctx);
    put(el.foot, { o: Math.min(1, inn * 5), y: rise }, ctx);

    const f = focusOf(u);
    // left and right sentences replace each other by moving up (G-03)
    const fr = -1 + inn + Math.max(0, f);
    roll(lefts, fr, ctx, { origin: 'left', gap: 14 });
    roll(rights, fr, ctx, { origin: 'right', gap: 14 });
    const near = (i: number) => clamp01(1 - Math.abs(f - i) * 2.2);
    flabels.forEach((l, i) => (l.style.opacity = near(i).toFixed(3)));

    // the screen scrolls one page per state; pages are as tall as their content, so the head of the
    // next page peeks under the current one (D-096 r1). The last stop is capped so Recovery ends at
    // the bottom of the screen instead of leaving a tall empty space.
    if (el.scroll) {
      const vh = el.scroll.parentElement?.offsetHeight ?? 0;
      if (vh && vh !== page) {
        page = vh;
        const pages = [...el.scroll.children] as HTMLElement[];
        const max = Math.max(0, el.scroll.scrollHeight - vh);
        stops = pages.map((p) => Math.min(p.offsetTop, max));
      }
      const fi = ctx.reduced ? Math.round(f) : f;
      const i0 = Math.min(1, Math.floor(fi));
      const y = stops.length ? lerp(stops[i0], stops[i0 + 1], fi - i0) : 0;
      el.scroll.style.transform = `translate3d(0, ${(-y).toFixed(1)}px, 0)`;
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
  // no ring in S09: parked above the screen
  ring: () => pose({ x: 0, y: 1.4, w: 0.12, light: 0 }),
  // 08 → 09: the violet light dims, the light flashes green for a moment, then the ring shrinks and
  // leaves off the top of the screen before the Paper panel is full — never faded (D-120)
  ringIn(x, _ctx, from): Pose {
    const flash = window4(x, 0.16, 0.22, 0.28, 0.36);
    const go = seg(x, 0.28, 0.62);
    return {
      ...from,
      led: from.led * (1 - seg(x, 0, 0.16)) + flash,
      ledc: x < 0.16 ? from.ledc : 0,
      flare: from.flare * (1 - seg(x, 0, 0.16)) + flash * 0.8,
      y: from.y + go * 1.3,
      w: from.w * lerp(1, 0.45, go),
    };
  },
};
