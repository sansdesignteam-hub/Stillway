/**
 * S03 Sleep summary — 23:10 · Night (D-090; flow from Storyboard §2, look from the Moodboard
 * Layout references, see Sleep.astro).
 * u: -1..0 connection from S02: text out (0–30%), Paper → Night, the env turns to night and the cold
 *          rim light comes up (30–70%), clock 07:10 → 23:10 · Last night (70–100%)
 *  0 state 1  dark, kicker "Last night"; ring centred, only its edge lit, slow turn
 *  1 state 2  headline + [ SETTLED ] 23:10 big in the slot; ring moves right (ref 1 composition)
 *  2 state 3  [ RESTED ] 7h 12m takes the slot; 23:10 shrinks upward and dims
 *  3 state 4  [ BROKEN ] 2× takes the slot, small line + Simulated data; ring at the reference
 *             pose, engraving readable (D-089 lesson)
 *  > 3.6      connection to S04: everything fades out (0–30%)
 */
import { put, seg, window4, clamp01, type Ctx } from '../anim';
import { along, pose, ANGLE } from '../ring/poses';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let stats: HTMLElement[] = [];
const END = 3.6;

export const sleep: SectionMotion = {
  init(r) {
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { kicker: q('[data-s-kicker]'), head: q('[data-s-head]'), line: q('[data-s-line]'), sim: q('[data-s-sim]') };
    stats = [...r.querySelectorAll<HTMLElement>('[data-s-stat]')];
  },
  update(u, ctx) {
    const out = 1 - seg(u, END, END + 0.3);
    put(el.kicker, { o: seg(u, -0.25, 0.1) * out }, ctx);
    put(el.head, { o: seg(u, 0.45, 0.95) * out, yv: 0.02 * (1 - seg(u, 0.45, 0.95)) }, ctx);
    stats.forEach((s, i) => {
      const a = 0.5 + i; // number i arrives on the way to state i + 2
      const inn = seg(u, a, a + 0.45);
      const back = seg(u, a + 1, a + 1.45); // the next number arrives: shrink upward, dim
      const gone = seg(u, a + 2, a + 2.45); // two numbers later: out
      const scale = 1 - 0.58 * back;
      // the dimmed number moves up by the height of the block that replaces it, so they never overlap
      const lift = (stats[i + 1]?.offsetHeight ?? s.offsetHeight) + 14;
      const y = (1 - inn) * 40 - back * lift;
      put(s, { o: inn * (1 - 0.72 * back) * (1 - gone) * out, y, s: scale }, ctx);
      s.classList.toggle('is-active', u >= a + 0.2 && (i === stats.length - 1 || u < a + 1.2));
    });
    put(el.sim, { o: seg(u, 0.6, 1) * out }, ctx);
    put(el.line, { o: seg(u, 2.6, 3) * out }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const tq = ANGLE.threeQuarter;
    // ref 1: big ring on the right, may be cut by the edge; phones: upper half
    const side = m ? { x: 0, y: 0.2, w: 0.82 } : { x: 0.26, y: -0.03, w: 0.54 };
    const night = { light: 1, rim: 1, uncap: 1 };
    // slow continuous turn (no stops), ending at the reference pose where "Stillway" reads
    const drift = (k: number) => tq.ry + 0.55 * (1 - k);
    return along(u, [
      [0, pose({ x: 0, y: m ? 0.05 : 0, w: m ? 0.72 : 0.46, ...tq, ry: drift(0), rx: -0.2, ...night })],
      [1, pose({ ...side, ...tq, ry: drift(0.4), rx: -0.18, ...night })],
      [2, pose({ ...side, ...tq, ry: drift(0.75), rx: -0.16, ...night })],
      // state 4: a little further in and smaller so the engraving on the band is fully in view
      [3, pose({ ...side, x: m ? 0 : 0.2, w: m ? side.w : 0.48, ...tq, ry: drift(1) + 0.15, rx: -0.15, ...night })],
    ]);
  },
};
