/** Small scrub helpers shared by the section modules. Everything is a pure function of scroll. */
/** the old content moves up at this fraction of the panel speed while the next panel covers it (story.ts) */
export const PARALLAX = 0.5;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 → 1 while u goes from a to b, eased */
export const seg = (u: number, a: number, b: number) => smooth(clamp01((u - a) / (b - a)));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** fade in over [a, b], fade out over [c, d] */
export const window4 = (u: number, a: number, b: number, c: number, d: number) => seg(u, a, b) * (1 - seg(u, c, d));

export interface Ctx {
  mobile: boolean;
  reduced: boolean;
}

export interface Style {
  o?: number; // opacity
  x?: number; // px
  y?: number; // px
  yv?: number; // fraction of viewport height
  s?: number; // scale
}

/**
 * Write opacity/transform to an element, skipping writes that did not change.
 * Reduced motion: no transform at all. story.ts snaps u to whole states, so opacity jumps from
 * state to state; the CSS transition on html.reduced [data-a] turns that into a ±300 ms fade.
 */
const cache = new WeakMap<HTMLElement, string>();
export function put(el: HTMLElement | null | undefined, st: Style, ctx: Ctx) {
  if (!el) return;
  const o = st.o ?? 1;
  let tr = '';
  if (!ctx.reduced) {
    const y = (st.y ?? 0) + (st.yv ?? 0) * window.innerHeight;
    if (st.x || y) tr += `translate3d(${(st.x ?? 0).toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    if (st.s !== undefined && st.s !== 1) tr += ` scale(${st.s.toFixed(4)})`;
  }
  const key = `${o.toFixed(3)}|${tr}`;
  if (cache.get(el) === key) return;
  cache.set(el, key);
  el.style.opacity = o.toFixed(3);
  el.style.transform = tr;
  el.style.visibility = o < 0.002 ? 'hidden' : '';
}

/* ---------- sentences that replace each other by moving up (Storyboard §1 "Teks", QA G-03/M-01) ---------- */
const boxes = new WeakMap<HTMLElement[], { key: string; top: number[]; h: number[] }>();
/** layout box (ignores transforms): top from the stage, height */
function layoutOf(els: HTMLElement[]) {
  const key = `${window.innerWidth}x${window.innerHeight}|${document.fonts?.status ?? ''}`;
  const c = boxes.get(els);
  if (c && c.key === key && c.h.every((h, i) => h === els[i].offsetHeight)) return c;
  const top = els.map((el) => {
    let t = 0;
    let e: HTMLElement | null = el;
    while (e) {
      t += e.offsetTop;
      e = e.offsetParent as HTMLElement | null;
    }
    return t;
  });
  const v = { key, top, h: els.map((el) => el.offsetHeight) };
  boxes.set(els, v);
  return v;
}

/**
 * A stack of sentences that share one place on screen (same container). `f` = which one is in place,
 * continuous: −1 none yet … 0 the first … n−1 the last … n all gone.
 * The one in place moves up and gets smaller and dimmer (a small line above), the next rises from
 * below; both move by the same distance, so they never overlap. Two steps later the small line moves
 * on up and goes. Reduced motion: only the sentence in place shows.
 * `origin` = transform origin (left or right edge, at the bottom so the small line stays above).
 */
export function roll(
  els: HTMLElement[],
  f: number,
  ctx: Ctx,
  opt: { gap?: number; shrink?: number; dim?: number; origin?: 'left' | 'right' | 'center'; o?: number; stay?: boolean } = {},
) {
  if (!els.length) return;
  const gap = opt.gap ?? 14;
  const shrink = opt.shrink ?? 0.5;
  const dim = opt.dim ?? 0.4;
  const mul = opt.o ?? 1;
  const L = layoutOf(els);
  const n = els.length;
  // distance between i and i+1 so that i's bottom clears i+1's top; the last one leaves by its height
  const E = (i: number) => (i < n - 1 ? Math.max(gap, L.top[i] + L.h[i] - L.top[i + 1] + gap) : L.h[i] + gap);
  els.forEach((el, i) => {
    el.style.transformOrigin = `${opt.origin === 'right' ? '100%' : opt.origin === 'center' ? '50%' : '0%'} 100%`;
    const d = f - i;
    if (ctx.reduced) return put(el, { o: Math.round(d) === 0 ? mul : 0 }, ctx);
    if (d <= -1 || d >= 2) return put(el, { o: 0 }, ctx);
    if (d < 0) {
      const t = d + 1;
      const from = i > 0 ? E(i - 1) : L.h[i] + gap;
      return put(el, { o: clamp01(t * 5) * mul, y: (1 - t) * from }, ctx);
    }
    // stay: false — no small line left behind (headlines near the navbar): it moves on up and goes
    if (d < 1 && opt.stay === false) return put(el, { o: clamp01((1 - d) * 3) * mul, y: -d * (E(i) + L.h[i]), s: 1 - (1 - shrink) * d }, ctx);
    if (d < 1) return put(el, { o: (1 - (1 - dim) * d) * mul, y: -d * E(i), s: 1 - (1 - shrink) * d }, ctx);
    if (opt.stay === false) return put(el, { o: 0 }, ctx);
    const t = d - 1;
    const more = i + 1 < n ? E(i + 1) : L.h[i] + gap;
    put(el, { o: dim * (1 - t) * mul, y: -E(i) - t * more, s: shrink }, ctx);
  });
}
