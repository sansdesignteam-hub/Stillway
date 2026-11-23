/**
 * S08 Features — 21:00 · Night (D-096; flow Storyboard §2, look Figma sticky 40004118:132).
 * u: -1..0 connection from S07 (the photo darkens, The Everyday fades; the ring in the small card
 *          becomes the main ring in the same place, a little larger; faint green in window A)
 *  0  state 1  "Inside the ring." + "One small window, facing your skin."; ring centred, floating
 *  1  state 2  camera close to the window (big ring on the right, three-quarter); green full
 *  2  state 3  same place; blue at ±75% (u 1.5), violet at 100% (u 2); "Red means it's off."
 *  > 2.6       to S09 (sections/app.ts ringIn: the light dims, a brief green, the ring leaves upward)
 * Colour by scroll only (D-062 mode lights): green full 25–50%, → blue 50–75%, → violet 75–100%.
 */
import { put, seg, lerp, clamp01, window4, type Ctx } from '../anim';
import { along, pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { keepLit, LIGHT } from '../glow';

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
    el = { sub: q('[data-f-sub]'), legend: q('[data-f-legendwrap]'), off: q('[data-f-off]'), light: q('[data-f-light]') };
    // D-139: a weak light from above, behind the ring (the ring sits centre → right), kept low so the
    // green / blue / violet sensor light leads; phones: centred over the ring
    const light = el.light as HTMLCanvasElement | null;
    if (light)
      keepLit(light, () =>
        window.matchMedia('(max-width: 719px)').matches
          ? { ellipses: [{ token: LIGHT, cx: 720, cy: -60, rx: 1300, ry: 430, stops: [[0, 0.2]], power: 1.8 }] }
          : { ellipses: [{ token: LIGHT, cx: 860, cy: -120, rx: 760, ry: 560, stops: [[0, 0.2]], power: 1.8 }] },
      );
  },
  update(u, ctx) {
    const out = 1 - seg(u, FEATURES_END, FEATURES_END + 0.3); // the title fades first in 08 → 09
    const win = [window4(u, -0.3, 0, 0.35, 0.6), window4(u, 0.55, 0.85, 1.15, 1.35), seg(u, 1.3, 1.55)];
    heads.forEach((h, i) => put(h, { o: win[i] * out, y: (1 - Math.min(1, win[i] * 1.5)) * 12 }, ctx));
    counts.forEach((c, i) => put(c, { o: win[i] * out }, ctx));
    put(el.sub, { o: window4(u, -0.2, 0.1, 0.35, 0.6) }, ctx);
    put(el.legend, { o: seg(u, 0.55, 0.85) * out }, ctx);
    const c = ledcOf(u);
    legs.forEach((l, i) => l.style.setProperty('--on', (0.68 + 0.32 * clamp01(1 - Math.abs(c - i))).toFixed(3)));
    bodies.forEach((b, i) => put(b, { o: clamp01(1 - Math.abs(c - i) * 1.8) }, ctx));
    put(el.off, { o: seg(u, 1.6, 1.9) }, ctx);
    // the light comes with the Night ground and leaves before the Paper sweeps in (08 → 09)
    put(el.light, { o: window4(u, -0.5, 0, FEATURES_END, FEATURES_END + 0.45) }, ctx);
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
  // 07 → 08: the ring in the small card becomes the main ring in the same place, a little larger,
  // after the photo has darkened; the faint green comes on last
  ringIn(x, ctx, _from, to) {
    const t = seg(x, 0.3, 1);
    return {
      ...to,
      y: lerp(ctx.mobile ? 0.07 : 0, to.y, t),
      w: to.w * lerp(0.4, 1, t),
      alpha: seg(x, 0.3, 0.55),
      led: to.led * seg(x, 0.7, 1),
      flare: to.flare * seg(x, 0.7, 1),
    };
  },
};
