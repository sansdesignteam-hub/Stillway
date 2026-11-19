/**
 * S01 Hero — 06:50 · Paper + Dawn glow (HANDOFF-v2 §2 S01, Storyboard §2).
 * u: 0 state 1 · 1 state 2 · 2 state 3 · 3 state 4 · hold to 3.5
 *  1 wordmark behind, Dawn glow behind the ring, ring large and centred, breathing (story.ts)
 *  2 wordmark fades out rising; ring rises a little and tilts
 *  3 headline fades out; ring turns to face the camera
 *  4 ring back to centre at the size of S02 state 1 ("rhythm" belongs to S02, faded in there)
 */
import { put, seg, type Ctx } from '../anim';
import { along, pose, ANGLE } from '../ring/poses';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};

export const hero: SectionMotion = {
  init(root) {
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    el = { word: q('[data-h-word]'), glow: q('[data-h-glow]'), copy: q('[data-h-copy]'), hint: q('[data-h-hint]') };
  },
  update(u, ctx) {
    const wordOut = seg(u, 0.15, 1);
    put(el.word, { o: 1 - wordOut, yv: -0.12 * wordOut }, ctx);
    // Dawn glow stays through the hero and fades in the 01 → 02 connection (S02 u < 0)
    put(el.glow, { o: 1 - seg(u, 3.5, 4.1) }, ctx);
    const copyOut = seg(u, 1.1, 1.9);
    put(el.copy, { o: 1 - copyOut, yv: -0.04 * copyOut }, ctx);
    put(el.hint, { o: 1 - seg(u, 0.05, 0.5) }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    return along(u, [
      [0, pose({ x: 0, y: m ? 0.15 : 0.02, w: m ? 0.78 : 0.34, ...ANGLE.threeQuarter })],
      [1, pose({ x: 0, y: m ? 0.2 : 0.07, w: m ? 0.76 : 0.33, ...ANGLE.tilted })],
      [2, pose({ x: 0, y: m ? 0.08 : 0.03, w: m ? 0.74 : 0.35, ...ANGLE.facing })],
      [3, pose({ x: 0, y: 0, w: m ? 0.7 : 0.36, ...ANGLE.threeQuarter, ry: ANGLE.threeQuarter.ry + 0.2 })],
    ]);
  },
};
