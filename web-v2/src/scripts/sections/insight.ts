/**
 * S05 Daily insight — 17:30 · Dusk (D-142; Figma Design S05 State 1–4, card 40004260:693).
 * u: -1..0 connection from S04 (D-142, the user's transition card): 0–30% the Day arc's frame, big
 *          time, status, the other photos and labels fade (activity.ts); 30–70% the 15:30 photo darkens
 *          and fades while the Dusk rises from below (story.ts); 70–100% the ring fades in right-centre,
 *          scale 0.9 → 1, then holds = State 1; clock 15:30 → 17:30
 *  0 state 1  [ 17:30 · DAILY INSIGHT ] + "Everything it noticed." bottom left; ring right-centre
 *  1 state 2  the ring grows (camera closer); the text moves down to the edge and dims, "One calm
 *             view." joins
 *  2 state 3  the camera goes into the opening; the glass card starts to show (≈ 45%)
 *  3 state 4  the glass card fully legible + the small paragraph under it; ring still
 *  > 3.6      to S06: the card fades (0–30%), the camera backs out, Dusk → Paper
 */
import { put, seg, lerp, type Ctx } from '../anim';
import { along, pose, ANGLE, type Pose } from '../ring/poses';
import { keepLit, LIGHT } from '../glow';
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
    el = { text: q('[data-i-text]'), head: q('[data-i-head]'), h2: q('[data-i-h2]'), group: q('[data-i-group]'), body: q('[data-i-body]'), glow: q('[data-i-glow]') };
    // Figma "Glass light" behind the card (centre 820 / 580, 490 × 340, blur 70), in the D-139 colour
    const glow = el.glow as HTMLCanvasElement | null;
    if (glow) keepLit(glow, () => ({ ellipses: [{ token: LIGHT, cx: 820, cy: 580, rx: 560, ry: 410, stops: [[0, 0.42]], power: 4 }], blur: 40 }));
  },
  update(u, ctx) {
    const H = window.innerHeight;
    const out = 1 - seg(u, END, END + 0.3);
    // text: in with the ring (end of the connection), down to the edge and dimmer in State 2, gone
    // before the camera enters the ring (State 3)
    const t2 = seg(u, 0.25, 1);
    const textIn = seg(u, -0.2, 0.1);
    const down = ctx.mobile ? 0 : (200 / 900) * H; // State 1 sits 250 px up, State 2 50 px (at 900)
    put(el.text, { o: textIn * (1 - seg(u, 1.3, 1.75)), y: -down * (1 - t2) }, ctx);
    if (el.head) {
      el.head.style.opacity = String(lerp(1, 0.5, t2).toFixed(3));
      // State 1 on one line (Figma 520 px box; Geist here runs a little wider), State 2 400 px
      el.head.style.setProperty('--hw', t2 > 0.3 ? '400px' : '600px');
    }
    if (el.h2) {
      const o2 = seg(u, 0.4, 1);
      el.h2.style.setProperty('--o2', o2.toFixed(3));
      // not there at all in State 1, so the headline sits where Figma has it (one line)
      const disp = o2 > 0.001 ? '' : 'none';
      if (el.h2.style.display !== disp) el.h2.style.display = disp;
    }
    // the glass card: starts to show in State 3 (≈ 45%), full in State 4, with the paragraph
    const show = 0.45 * seg(u, 1.45, 2) + 0.55 * seg(u, 2.2, 2.85);
    put(el.group, { o: show * out, s: 0.95 + 0.05 * seg(u, 1.45, 2.85) }, ctx);
    if (el.body) el.body.style.opacity = String(seg(u, 2.45, 3).toFixed(3));
    put(el.glow, { o: seg(u, 1.5, 2.6) * out }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const start = insightStart(ctx);
    // State 4 (Figma "Ring macro"): through the opening, the card sits inside the hole
    const inside = pose({ x: 0, y: 0, w: m ? 2.4 : 1.2, rx: -0.06, ry: 0.04, rz: 0, spin: Math.PI, uncap: 1, ...DUSK });
    return along(u, [
      [0, start],
      // State 2 (Figma): the ring grows toward the centre (centre ≈ 900 / 450, 1042 wide at 1440)
      [1, pose({ ...start, x: m ? 0.06 : 0.125, y: m ? 0.08 : 0, w: m ? 1.15 : 0.72, ...ANGLE.threeQuarter, ry: ANGLE.threeQuarter.ry + 0.3, uncap: 1, ...DUSK })],
      [2, inside],
      [3, inside],
    ]);
  },
  // 04 → 05 (D-142): the ring fades in right-centre in the last 30%, scale 0.9 → 1, then holds
  ringIn(x, _ctx, _from, to) {
    const t = seg(x, 0.7, 1);
    return { ...to, w: to.w * (0.9 + 0.1 * t), alpha: t };
  },
};
