/**
 * S03 Sleep summary — 23:10 · Night (D-090; flow from Storyboard §2, look from the Moodboard
 * Layout references, see Sleep.astro).
 * u: -2.5..0 connection from S02 (D-136, x = 0..1 of it): S02 scrolls out 1:1 (≈ 0–42%, why.ts) while
 *          a warm Cocoa → Night gradient rises from below (15–60%, story.ts); the ring stays centred
 *          and keeps turning; it goes dark with the ground, almost a silhouette (D-140, 15–55%); then
 *          one soft light from the upper right corner (62–80%) lights it, the facing side first, then
 *          warm all over (68–84%, D-137); the green sensor light last (82–95%); clock 07:10 → 23:10 ·
 *          Last night (70–100%). The green stays on to the end of S03.
 *  0 state 1  dark (the navbar clock reads "23:10 · Last night"); ring centred, edge lit, slow turn
 *  1 state 2  headline + SETTLED 23:10 big in the slot; ring moves right (ref 1 composition)
 *  2 state 3  RESTED 7h 12m takes the slot; 23:10 shrinks upward and dims
 *  3 state 4  BROKEN 2× takes the slot, small line + Simulated data; ring at the reference
 *             pose, engraving readable (D-089 lesson)
 *  > 3.6      connection to S04 (D-138 lens): the text goes up with the page 1:1 (reduced: fades),
 *             the corner light gives way to the dawn
 */
import { put, seg, window4, clamp01, lerp, type Ctx } from '../anim';
import { along, pose, ANGLE, lerpPose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { sections } from '../../content/sections';
import { keepLit, LIGHT, type LightSpec } from '../glow';

let el: Record<string, HTMLElement | null> = {};
let stats: HTMLElement[] = [];
const END = 3.6;
const TIN = sections.find((d) => d.id === 'sleep')!.tin;
/** 100svh in px (the scroll length of one u) */
let vhPx = 0;
const measureVh = () => (vhPx = (document.querySelector('[data-vh]') as HTMLElement | null)?.offsetHeight || window.innerHeight);
/** D-136 timing inside the 02 → 03 connection (x 0..1) */
const CORNER: [number, number] = [0.62, 0.8];
const GREEN: [number, number] = [0.82, 0.95];
/**
 * S03 corner light (D-136; Avoly ref): a soft glow in the upper right corner and a wedge falling from
 * it toward the ring, blur 30. The only section with a wedge (D-139: "the lamp comes on at night").
 */
const S03_LIGHT: LightSpec = {
  ellipses: [{ token: LIGHT, cx: 0.92 * 1440, cy: 0, rx: 0.3 * 1440, ry: 0.42 * 900, stops: [[0, 0.42], [1, 0]], smooth: true }],
  wedge: { token: LIGHT, ox: 0.94, oy: -0.06, from: 222, s1: 9, s2: 13, s3: 24, a: 0.3, in: 0.35, out: 0.85 },
  blur: 30,
};
const S03_LIGHT_PHONE: LightSpec = {
  ellipses: [{ token: LIGHT, cx: 0.92 * 1440, cy: 0, rx: 0.6 * 1440, ry: 0.3 * 900, stops: [[0, 0.42], [1, 0]], smooth: true }],
  wedge: { token: LIGHT, ox: 0.96, oy: -0.04, from: 196, s1: 8, s2: 12, s3: 22, a: 0.3, in: 0.35, out: 0.85 },
  blur: 30,
};
/** D-137 warm S03 ring: Paper env dimmed, ochre rim; no night env, no cold rim */
export const S03_WARM = { light: 0, rim: 0, warm: 1, envDim: 0.45 };
/** D-140: the ring before the corner light reaches it — env almost off (stage.ts: 1 − 0.7 × envDim) */
const DARK_DIM = 1.36;

export const sleep: SectionMotion = {
  init(r) {
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { head: q('[data-s-head]'), line: q('[data-s-line]'), sim: q('[data-s-sim]'), light: q('[data-s-light]') };
    stats = [...r.querySelectorAll<HTMLElement>('[data-s-stat]')];
    measureVh();
    window.addEventListener('resize', measureVh);
    // corner light canvas (glow.ts), painted once per size; phones have their own shape
    const beam = r.querySelector<HTMLCanvasElement>('[data-s-beam]');
    if (beam) keepLit(beam, () => (window.matchMedia('(max-width: 719px)').matches ? S03_LIGHT_PHONE : S03_LIGHT));
  },
  update(u, ctx) {
    // to S04 (D-138 lens, state A): the text goes up with the page, 1:1, no fade; reduced motion fades
    const out = ctx.reduced ? 1 - seg(u, END, END + 0.3) : 1;
    const up = ctx.reduced ? 0 : -Math.max(0, u - END) * vhPx;
    // corner light: comes in once Night is in, stays through S03, gives way to the dawn in the lens
    const x = (u + TIN) / TIN;
    put(el.light, { o: seg(x, CORNER[0], CORNER[1]) * (1 - seg(u, END, END + 0.7)) }, ctx);
    put(el.head, { o: seg(u, 0.45, 0.95) * out, y: up, yv: 0.02 * (1 - seg(u, 0.45, 0.95)) }, ctx);
    stats.forEach((s, i) => {
      const a = 0.5 + i; // number i arrives on the way to state i + 2
      const inn = seg(u, a, a + 0.45);
      const back = seg(u, a + 1, a + 1.45); // the next number arrives: shrink upward, dim
      const gone = seg(u, a + 2, a + 2.45); // two numbers later: out
      const scale = 1 - 0.76 * back; // the previous number ends small (≈ a quarter) and dim
      // the dimmed number moves up by the height of the block that replaces it, so they never overlap
      const lift = (stats[i + 1]?.offsetHeight ?? s.offsetHeight) + 14;
      const y = (1 - inn) * 40 - back * lift + up;
      put(s, { o: inn * (1 - 0.72 * back) * (1 - gone) * out, y, s: scale }, ctx);
      s.classList.toggle('is-active', u >= a + 0.2 && (i === stats.length - 1 || u < a + 1.2));
    });
    put(el.sim, { o: seg(u, 0.6, 1) * out, y: up }, ctx);
    put(el.line, { o: seg(u, 2.6, 3) * out, y: up }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const tq = ANGLE.threeQuarter;
    // ref 1: big ring on the right, may be cut by the edge; phones: upper half
    // the number takes ~half the width (Ultrahuman big-number ref), so the ring sits further right
    const side = m ? { x: 0, y: 0.22, w: 0.72 } : { x: 0.33, y: -0.03, w: 0.48 };
    // D-136: corner light and the green sensor light (heart-rate LED, ledc 0) stay on through S03.
    // D-137: a warm ring — the warm Paper studio env kept (dimmed on Night) with the ochre rim and the
    // corner light, instead of the night env and the cold rim; still silver_polished, never Gold
    const night = { ...S03_WARM, uncap: 1, corner: 1, led: 1, ledc: 0, flare: 0.22 };
    // slow continuous turn (no stops), ending at the reference pose where "Stillway" reads
    const drift = (k: number) => tq.ry + 0.55 * (1 - k);
    return along(u, [
      [0, pose({ x: 0, y: m ? 0.05 : 0, w: m ? 0.72 : 0.46, ...tq, ry: drift(0), rx: -0.2, ...night })],
      [1, pose({ ...side, ...tq, ry: drift(0.4), rx: -0.18, ...night })],
      [2, pose({ ...side, ...tq, ry: drift(0.75), rx: -0.16, ...night })],
      // state 4: a little further in and smaller so the engraving on the band is fully in view
      [3, pose({ ...side, x: m ? 0 : 0.25, w: m ? side.w : 0.4, ...tq, ry: drift(1) - 0.05, rx: -0.15, ...night })],
    ]);
  },
  // 02 → 03 (D-136): the ring stays centred and moves to the S03 state 1 pose over the whole
  // connection (no jump), turning on as a turntable with the scroll (one full turn, ends where S03
  // starts). D-140: as the ground goes dark the ring goes dark with it, almost a silhouette (only a
  // thin warm edge keeps its shape); when the corner light comes in it lights the side facing it
  // first (the corner key light, upper right), then the whole ring comes up warm (D-137); the green
  // sensor light comes on after: dark → light in → ring lit → green.
  ringIn(x, _ctx, from: Pose, to: Pose) {
    const p = lerpPose(from, to, seg(x, 0.08, 0.95));
    const dark = seg(x, 0.15, 0.55); // with the ground
    const lit = seg(x, 0.68, 0.84); // the room comes up after the key light has touched the ring
    return {
      ...p,
      ry: p.ry + Math.PI * 2 * x,
      rim: 0,
      light: 0,
      warm: lerp(0.22 * dark, S03_WARM.warm, lit),
      envDim: lerp(DARK_DIM * dark, S03_WARM.envDim, lit),
      corner: seg(x, CORNER[0], 0.74),
      led: seg(x, GREEN[0], GREEN[1]),
      ledc: 0,
      flare: 0.22 * seg(x, GREEN[0], GREEN[1]),
    };
  },
};
