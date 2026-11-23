/**
 * S05 Daily insight — 17:30 · Dusk (D-090; flow Storyboard §2, look Oryzo / Ultrahuman / Sensiq).
 * u: -1..0 connection from S04 (Viture Mobile Dock Mini, A-06): 0–40% the Dusk panel rises and S04
 *          moves up and out until the screen is dark and empty; 40–90% the ring rises from the bottom
 *          edge with a warm rim and stops right-centre; 70–100% eyebrow + headline rise bottom-left;
 *          clock 15:30 → 16:40 → 17:10 → 17:30
 *  0 state 1  "Everything it noticed." bottom-left; ring large right-centre, Dusk env
 *  1 state 2  "One calm view." joins, text slides to the edge; ring grows, the edge highlight moves
 *  2 state 3  the card appears inside the ring's opening; the ring fills the screen (camera inside)
 *  3 state 4  card fully legible, optional body at the edge; ring still
 *  > 3.6      to S06: the camera backs out of the ring, the Paper panel rises (no fade)
 */
import { put, seg, type Ctx } from '../anim';
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
    const H = window.innerHeight;
    const headIn = seg(u, -0.3, 0.05);
    const toEdge = seg(u, 0.5, 1.3);
    // state 2: the headline stays left, clear of the ring; it moves up and out before the card arrives
    const away = seg(u, 1.15, 1.6);
    put(el.head, { o: Math.min(1, headIn * 5) * (away < 0.999 ? 1 : 0), x: ctx.mobile ? 0 : -16 * toEdge, y: (1 - headIn) * H * 0.3 - away * H * 0.6 + (ctx.mobile ? 0 : 0.03 * toEdge * H) }, ctx);
    const h2 = seg(u, 0.4, 0.9);
    put(el.h2, { o: Math.min(1, h2 * 5), y: (1 - h2) * 40 }, ctx);
    const card = seg(u, 1.65, 2.2);
    put(el.card, { o: card, s: 0.95 + 0.05 * card }, ctx);
    if (el.bar) el.bar.style.setProperty('--p', String(seg(u, 1.8, 2.8)));
    const body = seg(u, 2.5, 2.95);
    put(el.body, { o: Math.min(1, body * 5), y: (1 - body) * 32 }, ctx);
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
  // 04 → 05 (Viture): the ring rises from below the bottom edge into the empty dark screen with a
  // warm rim, after S04 has left (40–90%), and stops right-centre — never faded (D-120)
  ringIn(x, _ctx, _from, to) {
    const t = seg(x, 0.4, 0.9);
    return { ...to, y: to.y - 1.35 * (1 - t), ry: to.ry + 0.5 * (1 - t), warm: to.warm * (0.6 + 0.4 * t) };
  },
};
