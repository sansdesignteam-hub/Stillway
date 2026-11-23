/**
 * S05 Daily insight — 17:30 · Dusk (D-090; flow Storyboard §2, look Oryzo / Ultrahuman / Sensiq).
 * u: -1..0 connection from S04 (15:30 darkens, Dusk rises; the ring fades in right-centre, scale
 *          0.9 → 1, in 70–100%; clock 15:30 → 17:30)
 *  0 state 1  "Everything it noticed." bottom-left; ring large right-centre, Dusk env
 *  1 state 2  "One calm view." joins, text slides to the edge; ring grows, the edge highlight moves
 *  2 state 3  the card appears inside the ring's opening; the ring fills the screen (camera inside)
 *  3 state 4  card fully legible, optional body at the edge; ring still
 *  > 3.6      to S06 (placeholder): the card fades (0–30%), the camera backs out, Dusk → Paper
 */
import { put, seg, window4, type Ctx } from '../anim';
import { along, pose, ANGLE, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
const END = 3.6;
// D-090 r1: the ring must read neutral silver (not copper) — neutral paper-polished env, no Dusk
// env, plus one weak ochre rim from the glow side (lower left)
const DUSK = { dusk: 0, light: 0, rim: 0, warm: 1 };

export const insightStart = (ctx: Ctx): Pose =>
  pose({ x: ctx.mobile ? 0.14 : 0.2, y: ctx.mobile ? 0.12 : 0.04, w: ctx.mobile ? 0.8 : 0.42, ...ANGLE.threeQuarter, ...DUSK });

export const insight: SectionMotion = {
  init(r) {
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { head: q('[data-i-head]'), h2: q('[data-i-h2]'), card: q('[data-i-card]'), body: q('[data-i-body]'), bar: q('[data-i-bar]') };
  },
  update(u, ctx) {
    const out = 1 - seg(u, END, END + 0.3);
    const headIn = seg(u, -0.25, 0.1);
    const toEdge = seg(u, 0.5, 1.3);
    // state 2: the headline stays left, clear of the ring; it is fully gone before the card arrives
    put(el.head, { o: headIn * (1 - seg(u, 1.15, 1.55)) * out, x: ctx.mobile ? 0 : -16 * toEdge, yv: ctx.mobile ? 0 : 0.03 * toEdge }, ctx);
    put(el.h2, { o: seg(u, 0.4, 1) }, ctx);
    const card = seg(u, 1.65, 2.2);
    put(el.card, { o: card * out, s: 0.95 + 0.05 * card }, ctx);
    if (el.bar) el.bar.style.setProperty('--p', String(seg(u, 1.8, 2.8)));
    put(el.body, { o: window4(u, 2.5, 3, END, END + 0.3) }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const start = insightStart(ctx);
    // through the opening: facing, very large, the card sits inside the hole
    const inside = pose({ x: 0, y: 0, w: m ? 2.4 : 1.2, rx: -0.06, ry: 0.04, rz: 0, spin: Math.PI, uncap: 1, ...DUSK });
    return along(u, [
      [0, start],
      // state 2: grows on its own side, leaving the headline area free
      [1, pose({ ...start, x: m ? 0.1 : 0.24, y: m ? 0.1 : 0.02, w: m ? 0.95 : 0.5, ...ANGLE.threeQuarter, ry: ANGLE.threeQuarter.ry + 0.3, uncap: 1, ...DUSK })],
      [2, inside],
      [3, inside],
    ]);
  },
  // 04 → 05: fade in on the right-centre with scale 0.9 → 1 during 70–100%
  ringIn(x, _ctx, _from, to) {
    const t = seg(x, 0.7, 1);
    return { ...to, w: to.w * (0.9 + 0.1 * t), alpha: t };
  },
};
