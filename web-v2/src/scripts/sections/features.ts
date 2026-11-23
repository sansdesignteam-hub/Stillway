/**
 * S08 Features — 21:00 · Night (D-096; flow Storyboard §2, look Figma sticky 40004118:132).
 * u: -1..0 connection from S07: the Night panel rises over the photo; the ring rises with it from
 *          the bottom edge and stops in the middle, then stays (sticky); faint green in window A
 *  0  state 1  "Inside the ring." + "One small window, facing your skin."; ring centred, floating
 *  1  state 2  camera close to the window (big ring on the right, three-quarter); green full
 *  2  state 3  same place; blue at ±75% (u 1.5), violet at 100% (u 2); "Red means it's off."
 *  > 2.6       to S09 (sections/app.ts ringIn: the light dims, a brief green, the ring leaves off the
 *              top before the Paper panel is full)
 * Colour by scroll only (D-062 mode lights): green full 25–50%, → blue 50–75%, → violet 75–100%.
 */
import { put, seg, lerp, clamp01, roll, type Ctx } from '../anim';
import { along, pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';

export const FEATURES_END = 2.6;
let heads: HTMLElement[] = [];
let counts: HTMLElement[] = [];
let legs: HTMLElement[] = [];
let bodies: HTMLElement[] = [];
let el: Record<string, HTMLElement | null> = {};

/** 0 = green, 1 = blue, 2 = violet */
export const ledcOf = (u: number) => seg(u, 1.0, 1.5) + seg(u, 1.5, 2.0);
const NIGHT = { light: 1, rim: 0.55 };
// three-quarter view into the opening with window A on the inner wall facing the camera (as the S01 close-up)
const INSIDE = { rx: -0.3, ry: -0.42, rz: 0.1, spin: -0.3 };

const centre = (ctx: Ctx, u = 0): Pose =>
  pose({ x: 0, y: (ctx.mobile ? 0.02 : 0) + 0.012 * Math.sin(u * Math.PI * 1.5), w: ctx.mobile ? 0.72 : 0.34, ...INSIDE, ...NIGHT, led: 0.25, flare: 0.12 });
const close = (ctx: Ctx): Pose =>
  pose({ x: ctx.mobile ? 0.22 : 0.25, y: ctx.mobile ? 0.02 : -0.04, w: ctx.mobile ? 1.05 : 0.64, rx: -0.36, ry: -0.5, rz: 0.12, spin: -0.36, uncap: 1, ...NIGHT, led: 1, flare: 1 });

export const features: SectionMotion = {
  init(r) {
    const all = (s: string) => [...r.querySelectorAll<HTMLElement>(s)];
    heads = all('[data-f-head]');
    counts = all('[data-f-count]');
    legs = all('[data-f-leg]');
    bodies = all('[data-f-body]');
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { sub: q('[data-f-sub]'), legend: q('[data-f-legendwrap]'), off: q('[data-f-off]') };
  },
  update(u, ctx) {
    const H = window.innerHeight;
    // the three headlines replace each other by moving up (G-03)
    roll(heads, -1 + seg(u, -0.3, 0) + seg(u, 0.35, 0.85) + seg(u, 1.15, 1.5), ctx, { origin: 'left', gap: 16, stay: false });
    // the counter (small numbers): short fades
    const win = [u < 0.6 ? 1 : 0, u >= 0.6 && u < 1.33 ? 1 : 0, u >= 1.33 ? 1 : 0];
    counts.forEach((c, i) => put(c, { o: win[i] * (u > -0.3 ? 1 : 0) }, ctx));
    // the small line rises in state 1 and moves up and out on the way to state 2
    const sIn = seg(u, -0.3, 0.05);
    const sOut = seg(u, 0.35, 0.65);
    put(el.sub, { o: Math.min(1, sIn * 5) * (sOut < 0.999 ? 1 : 0), y: (1 - sIn) * 40 - sOut * H * 0.3 }, ctx);
    const lg = seg(u, 0.55, 0.85);
    put(el.legend, { o: Math.min(1, lg * 5), y: (1 - lg) * 40 }, ctx);
    const c = ledcOf(u);
    legs.forEach((l, i) => l.style.setProperty('--on', (0.68 + 0.32 * clamp01(1 - Math.abs(c - i))).toFixed(3)));
    bodies.forEach((b, i) => put(b, { o: clamp01(1 - Math.abs(c - i) * 1.8) }, ctx));
    put(el.off, { o: seg(u, 1.6, 1.9) }, ctx);
  },
  ring(u, ctx) {
    const p = along(u, [
      [0, centre(ctx, 0)],
      [1, close(ctx)],
      [2, close(ctx)],
    ]);
    if (u < 1) {
      const c = centre(ctx, u);
      p.y = lerp(c.y, p.y, seg(u, 0, 1));
    }
    // green from faint to full by 50%, then the colour turns by scroll
    // capped so the emissive keeps its hue (full strength clips green to cyan)
    p.led = lerp(0.18, 0.62, seg(u, 0.3, 0.75));
    p.flare = lerp(0.12, 1, seg(u, 0.4, 0.85));
    p.ledc = ledcOf(u);
    return p;
  },
  // 07 → 08 (Storyboard §3): the ring comes in from the bottom with the Night panel (it rides on the
  // panel, so it sits where it will stay once the panel is full), then stays; the faint green comes on
  // last — never faded (D-120)
  ringIn(x, _ctx, _from, to, k) {
    return {
      ...to,
      y: to.y - (1 - k),
      led: to.led * seg(x, 0.7, 1),
      flare: to.flare * seg(x, 0.7, 1),
    };
  },
};
