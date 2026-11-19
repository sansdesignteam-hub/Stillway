/**
 * S03 Sleep summary — 23:10 · Night (HANDOFF-v2 §2 S03).
 * u: -1..0 connection from S02: text out (0–30%), Paper → Night and ring 0.36 → 0.50 of the
 *          viewport with the light turning to one cold rim (30–70%), clock 07:10 → 23:10 (70–100%)
 *  0 state 1  dark, kicker; ring centred, only its edge lit
 *  1 state 2  SETTLED 23:10 on the right; ring moves left, turning very slowly
 *  2 state 3  RESTED 7h 12m below; the first number dims
 *  3 state 4  BROKEN 2×, small line + Simulated data; ring faces the camera
 *  > 3.6      connection to S04: the three numbers fade out (0–30%)
 * Mobile: ring in the upper half, the numbers below it, left aligned.
 */
import { put, seg, window4, type Ctx } from '../anim';
import { along, pose, ANGLE } from '../ring/poses';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let stats: HTMLElement[] = [];
const END = 3.6;

export const sleep: SectionMotion = {
  init(root) {
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    el = { kicker: q('[data-s-kicker]'), head: q('[data-s-head]'), foot: q('[data-s-foot]') };
    stats = [...root.querySelectorAll<HTMLElement>('[data-s-stat]')];
  },
  update(u, ctx) {
    const out = 1 - seg(u, END, END + 0.3);
    put(el.kicker, { o: window4(u, -0.25, 0.1, 0.6, 1) }, ctx);
    put(el.head, { o: seg(u, 0.5, 1) * out, yv: 0.02 * (1 - seg(u, 0.5, 1)) }, ctx);
    stats.forEach((s, i) => {
      const a = 0.5 + i; // appears on the way to state i+2
      const on = seg(u, a, a + 0.5);
      // older numbers dim to .35 when the next one arrives
      const dim = i < stats.length - 1 ? 1 - 0.65 * seg(u, a + 1, a + 1.5) : 1;
      put(s, { o: on * dim * out, yv: 0.03 * (1 - on) }, ctx);
      s.classList.toggle('is-active', u >= a + 0.25 && (i === stats.length - 1 || u < a + 1.25));
    });
    put(el.foot, { o: seg(u, 2.5, 3) * out }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const side = m ? { x: 0, y: 0.2, w: 0.6 } : { x: -0.25, y: 0, w: 0.4 };
    const tq = ANGLE.threeQuarter;
    return along(u, [
      [0, pose({ x: 0, y: m ? 0.05 : 0, w: m ? 0.78 : 0.5, ...tq, ry: tq.ry - 0.1, light: 1 })],
      [1, pose({ ...side, ...tq, ry: tq.ry + 0.1, light: 1 })],
      [2, pose({ ...side, ...tq, ry: tq.ry + 0.3, rx: -0.22, light: 1 })],
      [3, pose({ ...side, ...ANGLE.facing, light: 1 })],
    ]);
  },
};
