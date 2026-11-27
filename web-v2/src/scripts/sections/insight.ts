/**
 * S05 Daily insight — 17:30 · Dusk (D-142; Figma Design S05 State 1–4, card 40004260:693).
 * u: -1..0 connection from S04 (D-142, the user's transition card): 0–30% the Day arc's frame, big
 *          time, status, the other photos and labels fade (activity.ts); 30–70% the 15:30 photo darkens
 *          and fades while the Dusk rises from below (story.ts); 70–100% the ring fades in right-centre,
 *          scale 0.9 → 1, then holds = State 1; clock 15:30 → 17:30
 *  0 state 1  17:30 · DAILY INSIGHT + "Everything it noticed." bottom left; ring right-centre
 *  1 state 2  the ring grows (camera closer); the text moves down to the edge and dims, "One calm
 *             view." joins
 *  2 state 3  the camera goes into the opening; the glass card starts to show (≈ 45%)
 *  3 state 4  the glass card fully legible + the small paragraph under it; ring still
 *  > 3.6      to S06: the card fades (0–30%), the camera backs out, Dusk → Paper
 */
import { view } from '../viewport';
import { put, seg, lerp, type Ctx } from '../anim';
import { along, pose, ANGLE, type Pose } from '../ring/poses';
import { keepLit, LIGHT } from '../glow';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let words: HTMLElement[] = [];
let stages: HTMLElement[] = [];
let halos: HTMLElement[] = [];
let dots: HTMLElement[] = [];
let line: SVGPathElement | null = null;
/** where the two awake dots sit along the chart (Figma x 140 / 268 of 368) */
const DOT_AT = [0.38, 0.73];
/** a small step of the card's sequence: fade + a short rise, eased, no overshoot */
function step(it: HTMLElement | null | undefined, t: number, rise = 10) {
  if (!it) return;
  it.style.opacity = t.toFixed(3);
  it.style.transform = t >= 0.999 ? '' : `translate3d(0, ${(rise * (1 - t)).toFixed(2)}px, 0)`;
}
const END = 3.6;
// D-090 r1: the ring must read neutral silver (not copper) — neutral paper-polished env, no Dusk
// env, plus one weak warm rim from the glow side (lower left)
const DUSK = { dusk: 0, light: 0, rim: 0, warm: 1 };

export const insightStart = (ctx: Ctx): Pose =>
  pose({ x: ctx.mobile ? 0.14 : 0.2, y: ctx.mobile ? 0.12 : 0.04, w: ctx.mobile ? 0.8 : 0.42, ...ANGLE.threeQuarter, ...DUSK });

export const insight: SectionMotion = {
  init(r) {
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { text: q('[data-i-text]'), head: q('[data-i-head]'), group: q('[data-i-group]'), body: q('[data-i-body]'), glow: q('[data-i-glow]'), inner: q('[data-i-in]'), area: q('[data-i-area]'), div: q('[data-i-div]') };
    words = [...r.querySelectorAll<HTMLElement>('[data-i-w]')];
    stages = [...r.querySelectorAll<HTMLElement>('[data-i-st]')];
    halos = [...r.querySelectorAll<HTMLElement>('[data-i-halo]')];
    dots = [...r.querySelectorAll<HTMLElement>('[data-i-dot]')];
    line = r.querySelector<SVGPathElement>('[data-i-line]');
    // Figma "Glass light" behind the card (centre 820 / 580, 490 × 340, blur 70), in the D-139 colour
    const glow = el.glow as HTMLCanvasElement | null;
    if (glow) keepLit(glow, () => ({ ellipses: [{ token: LIGHT, cx: 820, cy: 580, rx: 560, ry: 410, stops: [[0, 0.42]], power: 4 }], blur: 40 }));
  },
  update(u, ctx) {
    const H = view.h;
    const out = 1 - seg(u, END, END + 0.3);
    // text (D-143): one fixed box, three lines, never reflowed. State 1 shows "Everything it /
    // noticed."; in State 2 the block moves down to the edge and dims (transform + opacity on the
    // whole block) while "One calm view." comes in word by word in its place; gone before State 3
    const t2 = seg(u, 0.25, 1);
    const textIn = seg(u, -0.2, 0.1);
    const down = ctx.mobile ? 0 : (200 / 900) * H; // State 1 sits 250 px up, State 2 50 px (at 900)
    // QA I-02: never dimmed over the ring — full strength beside it in State 2, and fully gone before
    // the camera goes into the opening
    put(el.text, { o: textIn * (1 - seg(u, 1.05, 1.4)), y: -down * (1 - t2) }, ctx);
    words.forEach((w, i) => step(w, ctx.reduced ? (u >= 0.7 ? 1 : 0) : seg(u, 0.45 + i * 0.12, 0.8 + i * 0.12), 12));

    // the glass card (D-143), tied to the scroll, done at State 4 (u = 3): it rises, fades in and
    // grows 0.96 → 1 while its content sharpens (the glass blur is there from the start); then, one
    // after another with a short rise: chip + SIMULATED DATA → 7h 12m → the line drawn left → right
    // (the area under it follows, each awake dot lights as the line reaches it) → settled / up and
    // the divider → the sentence → the paragraph under the card
    const R = ctx.reduced;
    const cardIn = R ? (u >= 1.5 ? 1 : 0) : seg(u, 1.5, 2.4);
    put(el.group, { o: cardIn * out, y: 28 * (1 - seg(u, 1.5, 2.5)), s: 0.96 + 0.04 * seg(u, 1.5, 2.6) }, ctx);
    if (el.inner) {
      const b = R || ctx.mobile ? 0 : 8 * (1 - seg(u, 1.6, 2.4));
      const f = b > 0.05 ? `blur(${b.toFixed(2)}px)` : '';
      if (el.inner.style.filter !== f) el.inner.style.filter = f;
    }
    // QA M-09: phones — the content comes with the card, never an empty card
    const at = (a: number, len = 0.3) => (R ? (u >= (ctx.mobile ? 1.5 : a) ? 1 : 0) : ctx.mobile ? cardIn : seg(u, a, a + len));
    step(stages[0], at(1.85)); // chip + simulated
    step(stages[1], at(1.95)); // 7h 12m
    const draw = ctx.mobile && !R ? seg(u, 1.7, 2.4) : at(2.05, 0.55);
    if (line) line.style.setProperty('--draw', (1 - draw).toFixed(4));
    if (el.area) {
      const a = at(2.15, 0.55);
      el.area.style.opacity = a.toFixed(3);
      el.area.style.clipPath = a >= 0.999 ? '' : `inset(0 ${((1 - a) * 100).toFixed(2)}% 0 0)`;
    }
    DOT_AT.forEach((x, i) => {
      const lit = R ? (draw >= 1 ? 1 : 0) : seg(draw, x - 0.02, x + 0.1);
      [halos[i], dots[i]].forEach((d, k) => {
        if (!d) return;
        d.style.opacity = lit.toFixed(3);
        d.style.transform = lit >= 0.999 ? '' : `scale(${(k === 0 ? 0.4 : 0.6) + (k === 0 ? 0.6 : 0.4) * lit})`;
      });
    });
    step(stages[2], at(2.35)); // settled / up
    step(el.div, at(2.35), 0);
    step(stages[3], at(2.45)); // the sentence
    step(el.body, at(2.6, 0.35), 12); // the paragraph under the card
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
      [1, pose({ ...start, x: m ? 0.06 : 0.18, y: m ? 0.08 : 0, w: m ? 1.15 : 0.7, ...ANGLE.threeQuarter, ry: ANGLE.threeQuarter.ry + 0.3, uncap: 1, ...DUSK })],
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
