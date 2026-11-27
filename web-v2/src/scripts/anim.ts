import { view } from './viewport';
/** Small scrub helpers shared by the section modules. Everything is a pure function of scroll. */
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
    const y = (st.y ?? 0) + (st.yv ?? 0) * view.h;
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
