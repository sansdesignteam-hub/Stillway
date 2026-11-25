/**
 * S08 Features — 21:00 · Night (D-154: Figma Design 08 State 1–4; Features.astro has the layout).
 * u: -1..0 connection from S07 (the photo darkens, The Everyday fades; the ring comes in centred,
 *          a faint green in window A)
 *  0  State 1  "Inside the ring." — ring floating in the middle, faint green
 *  1  State 2  "One light, tuned to the task." — camera close to the window (big ring right,
 *              three-quarter), green full = Heart rate; the legend comes in
 *  2  State 3  same place; blue at ±75 % (u 1.5), violet at 100 % (u 2); "Red means it's off."
 *  3  State 4  "Red means it's off." — window A goes dark, the small red light in the lower window
 *              comes on (pose.ledc 2 → 3), the three modes dim
 *  > 3.6       to S09 (sections/app.ts ringIn: the light dims, a brief green, the ring leaves upward)
 * Colour by scroll only (D-062 mode lights, not sensor claims).
 */
import { put, seg, lerp, clamp01, window4, type Ctx } from '../anim';
import { along, pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { keepLit, LIGHT } from '../glow';

export const FEATURES_END = 3.6;
let heads: HTMLElement[] = [];
let kicks: HTMLElement[] = [];
let legs: HTMLElement[] = [];
let offs: HTMLElement[] = [];
let el: Record<string, HTMLElement | null> = {};

/** 0 = green, 1 = blue, 2 = violet, 3 = red (off, lower window) */
export const ledcOf = (u: number) => seg(u, 1.0, 1.5) + seg(u, 1.5, 2.0) + seg(u, 2.45, 2.9);
const NIGHT = { light: 1, rim: 0.55 };
// three-quarter view into the opening with window A on the inner wall facing the camera (as the S01 close-up)
const INSIDE = { rx: -0.3, ry: -0.42, rz: 0.1, spin: -0.3 };

// Figma State 1: the ring about 0.47 of the width, centred
const centre = (ctx: Ctx, u = 0): Pose =>
  pose({ x: 0, y: (ctx.mobile ? -0.1 : 0) + 0.012 * Math.sin(u * Math.PI * 1.5), w: ctx.mobile ? 0.72 : 0.46, ...INSIDE, ...NIGHT, led: 0.25, flare: 0.12 });
const close = (ctx: Ctx): Pose =>
  pose({ x: ctx.mobile ? 0.22 : 0.25, y: ctx.mobile ? (window.innerHeight < 740 ? -0.3 : -0.2) : -0.04, w: ctx.mobile ? 0.92 : 0.64, rx: -0.36, ry: -0.5, rz: 0.12, spin: -0.36, uncap: 1, ...NIGHT, led: 1, flare: 1 });

export const features: SectionMotion = {
  init(r) {
    const all = (s: string) => [...r.querySelectorAll<HTMLElement>(s)];
    heads = all('[data-f-head]');
    kicks = all('[data-f-kick]');
    legs = all('[data-f-leg]');
    offs = all('[data-f-off]');
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { col: q('[data-f-col]'), top: q('[data-f-top]'), bottom: q('[data-f-bottom]'), offwrap: q('[data-f-offwrap]'), light: q('[data-f-light]') };
    // D-139: a weak light from above, behind the ring (the ring sits centre → right), kept low so the
    // green / blue / violet / red sensor light leads; phones: centred over the ring
    const light = el.light as HTMLCanvasElement | null;
    if (light)
      keepLit(light, () =>
        window.matchMedia('(max-width: 719px)').matches
          ? { ellipses: [{ token: LIGHT, cx: 720, cy: -60, rx: 1300, ry: 430, stops: [[0, 0.2]], power: 1.8 }] }
          : { ellipses: [{ token: LIGHT, cx: 860, cy: -120, rx: 760, ry: 560, stops: [[0, 0.2]], power: 1.8 }] },
      );
  },
  update(u, ctx) {
    const out = 1 - seg(u, FEATURES_END, FEATURES_END + 0.3); // the words fade first in 08 → 09
    // QA R-04: one title is gone before the next comes in
    const win = [window4(u, -0.3, 0, 0.35, 0.55), window4(u, 0.57, 0.85, 1.1, 1.28), window4(u, 1.3, 1.55, 2.3, 2.5), seg(u, 2.52, 2.77)];
    heads.forEach((h, i) => put(h, { o: win[i] * out, y: (1 - Math.min(1, win[i] * 1.5)) * 12 }, ctx));
    put(kicks[0], { o: win[0] * out }, ctx);
    put(kicks[1], { o: Math.max(win[1], win[2], win[3]) * out }, ctx);

    // legend + note (states 2–4); in state 1 the column is centred on the title alone
    const legIn = seg(u, 0.55, 0.85);
    put(el.bottom, { o: legIn * out }, ctx);
    if (el.col && el.top && el.bottom && !ctx.mobile) {
      const gap = 40;
      const head0 = heads[0]?.offsetHeight ?? 0;
      const cell = el.top.offsetHeight;
      const kick = (kicks[0]?.offsetHeight ?? 0) + 16;
      // the space the legend, the note and the empty second title line take in state 1
      const spare = el.bottom.offsetHeight + gap + (cell - kick - head0);
      put(el.col, { y: (spare / 2) * (1 - legIn) }, ctx);
    } else put(el.col, {}, ctx);

    // which modes are lit: green in state 2, blue then violet in state 3 (Figma: both lit), none in 4
    const c = ledcOf(u);
    const red = clamp01(c - 2);
    const lit = [1 - seg(c, 0.3, 1), seg(c, 0.3, 1), seg(c, 1.3, 2)].map((v) => v * (1 - red));
    const floor = lerp(0.4, 0.35, red);
    legs.forEach((l, i) => {
      l.style.setProperty('--on', (floor + (1 - floor) * lit[i]).toFixed(3));
      l.style.setProperty('--glow', lit[i].toFixed(3));
    });
    // the note: the short line in state 3, the long one in state 4
    put(el.offwrap, { o: seg(u, 1.6, 1.9) }, ctx);
    el.offwrap?.style.setProperty('--glow', red.toFixed(3));
    put(offs[0], { o: 1 - seg(u, 2.4, 2.58) }, ctx);
    put(offs[1], { o: seg(u, 2.6, 2.85) }, ctx);
    // the light comes with the Night ground and leaves before the Paper sweeps in (08 → 09)
    put(el.light, { o: window4(u, -0.5, 0, FEATURES_END, FEATURES_END + 0.45) }, ctx);
  },
  ring(u, ctx) {
    const p = along(u, [
      [0, centre(ctx, 0)],
      [1, close(ctx)],
      [3, close(ctx)],
    ]);
    if (u < 1) {
      const c = centre(ctx, u);
      p.y = lerp(c.y, p.y, seg(u, 0, 1));
    }
    // green from faint to full by 50 %, then the colour turns by scroll; red (off) in state 4
    // capped so the emissive keeps its hue (full strength clips green to cyan)
    p.led = lerp(0.18, 0.62, seg(u, 0.3, 0.75));
    p.flare = lerp(0.12, 1, seg(u, 0.4, 0.85));
    p.ledc = ledcOf(u);
    return p;
  },
  // 07 → 08: the ring comes in centred after the photo has darkened; the faint green comes on last
  ringIn(x, ctx, _from, to) {
    const t = seg(x, 0.3, 1);
    return {
      ...to,
      y: lerp(ctx.mobile ? -0.05 : 0, to.y, t),
      w: to.w * lerp(0.4, 1, t),
      alpha: seg(x, 0.3, 0.55),
      led: to.led * seg(x, 0.7, 1),
      flare: to.flare * seg(x, 0.7, 1),
    };
  },
};
