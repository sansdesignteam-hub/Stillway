/**
 * S02 Why Stillway — 07:10 · Paper (HANDOFF-v2 §2 S02).
 * u: -0.6..0 connection from S01 (same frame; Dawn glow fades, clock 06:50 → 07:10)
 *  0 state 1  "rhythm" behind the ring, label WHY STILLWAY
 *  1 state 2  sentence 1 big left, small paragraph right; ring turns slowly left
 *  2 state 3  sentence 2 replaces 1; sentence 1 becomes a small dim line above
 *  3 state 4  "keeps the pattern." wide behind the ring; full sentence small top-left with an
 *             ochre underline (the only ochre in view; the label turns Stone)
 *  > 3.6      connection to S03: text fades out in its first 30%
 */
import { put, seg, window4, type Ctx } from '../anim';
import { along, pose, ANGLE } from '../ring/poses';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let bigs: HTMLElement[] = [];
let smalls: HTMLElement[] = [];
const END = 3.6;

export const why: SectionMotion = {
  init(root) {
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    el = { word: q('[data-w-word]'), wide: q('[data-w-wide]'), label: q('[data-w-label]'), prev: q('[data-w-prev]'), final: q('[data-w-final]') };
    bigs = [...root.querySelectorAll<HTMLElement>('[data-w-big]')];
    smalls = [...root.querySelectorAll<HTMLElement>('[data-w-small]')];
  },
  update(u, ctx) {
    const out = 1 - seg(u, END, END + 0.3); // connection to S03, first 30%
    // "rhythm": starts faint at the end of S01 (u ≈ -1.1 = hero state 4), full at state 1, gone by state 2
    const rhythm = seg(u, -1.1, -0.2) * (1 - seg(u, 0.35, 0.9));
    put(el.word, { o: rhythm * (seg(u, -1.1, -0.6) * 0.4 + seg(u, -0.6, -0.1) * 0.6) }, ctx);
    put(el.label, { o: seg(u, -0.4, 0) * out }, ctx);
    el.label?.classList.toggle('is-quiet', u > 2.5); // state 4: the underline is the one ochre

    // big sentences: 1 at state 2, 2 at state 3; sentence 3 is told by the wide text + final line
    put(bigs[0], { o: window4(u, 0.45, 1, 1.45, 1.8), yv: 0.03 * (1 - seg(u, 0.45, 1)) }, ctx);
    put(bigs[1], { o: window4(u, 1.45, 2, 2.45, 2.8), yv: 0.03 * (1 - seg(u, 1.45, 2)) }, ctx);
    put(el.prev, { o: window4(u, 1.6, 2.05, 2.45, 2.8) * 0.55 }, ctx);
    put(el.final, { o: seg(u, 2.45, 3) * out }, ctx);
    smalls.forEach((s, i) => {
      const a = 0.5 + i;
      const last = i === smalls.length - 1;
      put(s, { o: window4(u, a, a + 0.5, last ? 99 : a + 0.95, last ? 100 : a + 1.3) * out, yv: 0.02 * (1 - seg(u, a, a + 0.5)) }, ctx);
    });
    put(el.wide, { o: seg(u, 2.4, 3) * out, yv: 0.04 * (1 - seg(u, 2.4, 3)) }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const tq = ANGLE.threeQuarter;
    return along(u, [
      [0, pose({ x: 0, y: 0, w: m ? 0.7 : 0.36, ...tq, ry: tq.ry + 0.2 })],
      [1, pose({ x: 0, y: 0, w: m ? 0.7 : 0.36, ...tq, ry: tq.ry - 0.15 })],
      [2, pose({ x: 0, y: 0, w: m ? 0.7 : 0.36, ...tq, ry: tq.ry - 0.5, rx: tq.rx * 0.7 })],
      [3, pose({ x: 0, y: m ? 0 : -0.02, w: m ? 0.7 : 0.36, ...ANGLE.facing, ry: 0.32 })],
    ]);
  },
};
