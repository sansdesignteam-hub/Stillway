/**
 * S09 The app — 21:00 · Paper (D-096 layout; D-159 app screen; D-161 motion after the app videos).
 * u: -1..0 connection from S08 (the title fades; the violet light dims, a brief green; the ring shrinks
 *          and leaves upward; Night → Paper; the phone rises to the middle on the Heart rate screen;
 *          chip, texts and footer come in during 70–100%)
 *  0 → 2  Heart rate (green)  ·  2 → 4  Sleep (blue)  ·  4 → 6.6  Recovery (violet)
 * Inside each mode, tied to the scroll (scrub), as in the reference videos (D-161, layout D-162):
 *  (a) the title, the value, the chart panel and the details come in one after another;
 *  (b) the numbers count up, the chart draws left to right (the day line, the night's blocks), the
 *      week's columns grow, then the chart's marks (stairs, now) appear;
 *  (c) then, if the page is taller than the screen, it scrolls up slowly.
 * Between modes: the page and the corner light cross-fade (the texts outside the phone change with
 * them). Soft easing, no bounce.
 * Reduced motion: whole states, every screen shown complete, short opacity fades (global.css).
 *  > 6.6  to S10: the screen fades, the phone slides right and widens into the S10 panel.
 */
import { put, seg, lerp, clamp01, smooth, window4 } from '../anim';
import { pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';

const END = 6.6;
/** section units per mode */
const MODE = 2;

interface Page {
  el: HTMLElement;
  pin: HTMLElement | null;
  items: HTMLElement[];
  nums: Array<{ el: HTMLElement; to: number; from: number; last: string }>;
  draws: HTMLElement[];
  marks: HTMLElement[];
  grows: Array<{ el: HTMLElement; h: number }>;
  growsW: Array<{ el: HTMLElement; w: number }>;
  arcs: Array<{ el: SVGElement; len: number }>;
  dial: { t: number; arc: SVGElement | null; needle: SVGElement | null } | null;
  over: number;
}
let el: Record<string, HTMLElement | null> = {};
let lefts: HTMLElement[] = [];
let rights: HTMLElement[] = [];
let flabels: HTMLElement[] = [];
let glows: HTMLElement[] = [];
let pages: Page[] = [];
let measured = '';
let lastIdx = -1;

/** the active mode as a continuous value 0..2 (the tab highlight, the texts) */
const modeOf = (u: number) => seg(u, MODE - 0.2, MODE + 0.15) + seg(u, 2 * MODE - 0.2, 2 * MODE + 0.15);
/** how far mode k has played, 0..1 (mode 0 starts as the phone lands) */
const playOf = (k: number, u: number) => clamp01((u - MODE * k + 0.14) / 1.7);
/** page k's opacity: the old page goes first, then the new one comes (no double exposure) */
const showOf = (k: number, u: number) =>
  (k === 0 ? 1 : seg(u, MODE * k - 0.14, MODE * k + 0.06)) * (k === 2 ? 1 : 1 - seg(u, MODE * (k + 1) - 0.28, MODE * (k + 1) - 0.1));

const cache = new WeakMap<Element, string>();
function set(e: HTMLElement | SVGElement, prop: 'transform' | 'clipPath' | 'opacity', v: string) {
  const key = `${prop}:${v}`;
  const k = cache.get(e);
  if (k === key) return;
  cache.set(e, key);
  (e.style as any)[prop] = v;
}

function measure() {
  const key = `${window.innerWidth}x${window.innerHeight}`;
  if (key === measured || !el.pages) return;
  measured = key;
  const h = el.pages.clientHeight;
  pages.forEach((p) => {
    p.over = p.pin ? Math.max(0, p.pin.offsetHeight - h) : 0;
  });
}

export const app: SectionMotion = {
  init(r) {
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    const all = (s: string, from: ParentNode = r) => [...from.querySelectorAll<HTMLElement>(s)];
    el = { phone: q('[data-p-phone]'), pages: q('[data-p-pages]'), foot: q('[data-p-foot]'), prog: q('[data-p-prog]'), pct: q('[data-p-pct]') };
    lefts = all('[data-p-left]');
    rights = all('[data-p-right]');
    flabels = all('[data-p-flabel]');
    glows = all('[data-p-glow]');
    pages = all('[data-p-page]').map((pg) => ({
      el: pg,
      pin: pg.querySelector<HTMLElement>('[data-p-pin]'),
      items: all('[data-p-item]', pg),
      nums: all('[data-n]', pg).map((n) => ({ el: n, to: Number(n.dataset.n), from: Number(n.dataset.from ?? 0), last: '' })),
      draws: all('[data-draw]', pg),
      marks: all('[data-p-mark]', pg),
      grows: all('[data-grow]', pg).map((g) => ({ el: g, h: parseFloat(g.style.height) || 0 })),
      growsW: all('[data-grow-w]', pg).map((g) => ({ el: g, w: parseFloat(g.style.width) || 0 })),
      arcs: [...pg.querySelectorAll<SVGElement>('[data-arc]')].map((a) => ({ el: a, len: Number(a.dataset.arc) })),
      dial: (() => {
        const dl = pg.querySelector<HTMLElement>('[data-dial]');
        return dl ? { t: Number(dl.dataset.dial), arc: dl.querySelector<SVGElement>('[data-dial-arc]'), needle: dl.querySelector<SVGElement>('[data-dial-needle]') } : null;
      })(),
      over: 0,
    }));
    const reset = () => (measured = '');
    window.addEventListener('resize', reset);
    document.fonts?.ready.then(reset);
  },
  update(u, ctx) {
    const H = window.innerHeight;
    const out = 1 - seg(u, END, END + 0.4);
    const rise = ctx.reduced ? (u >= -0.5 ? 1 : 0) : seg(u, -0.5, -0.05);
    const inn = seg(u, -0.3, 0); // 70–100%: chip, texts, footer
    // 09 → 10 (Storyboard §3): the screen content fades first, then the phone slides right and widens
    // into the S10 panel (finishes.ts brings the panel in from the same side)
    const go = seg(u, END + 0.25, END + 0.75);
    put(el.phone, { o: Math.min(1, rise * 1.6) * (1 - seg(u, END + 0.5, END + 0.8)), y: (1 - rise) * H * 0.55, x: go * window.innerWidth * 0.26, s: 1 + 0.12 * go }, ctx);
    if (el.pages) el.pages.style.opacity = (1 - seg(u, END, END + 0.3)).toFixed(3);
    put(el.foot, { o: inn * out }, ctx);
    measure();

    // the mode: continuous for the tab highlight and the side texts; whole under reduced motion
    const f = ctx.reduced ? Math.min(2, Math.floor(Math.max(0, u) / MODE)) : modeOf(u);
    const near = (i: number) => clamp01(1 - Math.abs(f - i) * 2.2);
    lefts.forEach((l, i) => put(l, { o: near(i) * inn * out, y: (1 - near(i)) * 10 }, ctx));
    rights.forEach((l, i) => put(l, { o: near(i) * inn * out, y: (1 - near(i)) * 10 }, ctx));
    flabels.forEach((l, i) => (l.style.opacity = near(i).toFixed(3)));

    pages.forEach((pg, k) => {
      const show = ctx.reduced ? (k === f ? 1 : 0) : showOf(k, u);
      put(pg.el, { o: show }, ctx);
      put(glows[k], { o: show }, ctx);
      if (show < 0.002) return;
      // reduced motion: the screen complete, not scrolled
      const p = ctx.reduced ? 1 : playOf(k, u);
      // (a) title, value, chart panel, details: in, one after another (capped, so the lower cards are
      // in by the time the page scrolls to them)
      pg.items.forEach((c, j) => {
        const e = ctx.reduced ? 1 : smooth(clamp01((p - Math.min(0.07 * j, 0.36)) / 0.2));
        set(c, 'opacity', e.toFixed(3));
        set(c, 'transform', e > 0.999 ? '' : `translate3d(0, ${((1 - e) * 14).toFixed(1)}px, 0)`);
      });
      // (b) numbers count up, the chart draws, the columns grow, then the marks
      const count = ctx.reduced ? 1 : seg(p, 0.08, 0.45);
      pg.nums.forEach((n) => {
        const v = String(Math.round(n.from + (n.to - n.from) * count));
        if (v !== n.last) {
          n.last = v;
          n.el.textContent = v;
        }
      });
      const draw = ctx.reduced ? 1 : seg(p, 0.22, 0.58);
      pg.draws.forEach((d) => set(d, 'clipPath', draw > 0.999 ? '' : `inset(-30% ${((1 - draw) * 100).toFixed(2)}% -30% 0)`));
      pg.marks.forEach((m) => set(m, 'opacity', (ctx.reduced ? 1 : seg(p, 0.54, 0.62)).toFixed(3)));
      const fill = ctx.reduced ? 1 : seg(p, 0.2, 0.56);
      pg.arcs.forEach((a) => a.el.setAttribute('stroke-dasharray', `${(a.len * fill).toFixed(2)} 100`));
      pg.growsW.forEach((g) => {
        const v = `${(g.w * fill).toFixed(2)}%`;
        if (g.el.style.width !== v) g.el.style.width = v;
      });
      // the dial: the knob sweeps from the scale's start to today's value as the arc fills
      if (pg.dial) {
        const k = ctx.reduced ? 1 : seg(p, 0.1, 0.48);
        const t = pg.dial.t * k;
        pg.dial.arc?.setAttribute('stroke-dasharray', `${(t * 100).toFixed(2)} 100`);
        if (pg.dial.needle) set(pg.dial.needle, 'transform', `rotate(${(t * 240).toFixed(2)}deg)`);
      }
      pg.grows.forEach((g, j) => {
        const k = ctx.reduced ? 1 : seg(p, 0.24 + 0.035 * j, 0.5 + 0.035 * j);
        const v = `${(g.h * k).toFixed(2)}%`;
        if (g.el.style.height !== v) g.el.style.height = v;
      });
      // (c) the content scrolls up slowly once everything is in
      if (pg.pin) {
        const sc = ctx.reduced ? 0 : seg(p, 0.56, 0.96) * pg.over;
        set(pg.pin, 'transform', sc > 0.05 ? `translate3d(0, ${(-sc).toFixed(1)}px, 0)` : '');
      }
    });

    const idx = Math.round(f);
    if (idx !== lastIdx) {
      lastIdx = idx;
      if (el.pct) el.pct.textContent = `${[33, 66, 100][idx]}%`;
    }
    el.prog?.style.setProperty('--p', ((f + 1) / 3).toFixed(3));
  },
  // no ring in S09
  ring: () => pose({ x: 0, y: 0.6, w: 0.12, alpha: 0, light: 0 }),
  // 08 → 09: the light dims, the light flashes green for a moment, then the ring shrinks and leaves
  // upward before Night turns to Paper
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
