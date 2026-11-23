/**
 * S02 Why Stillway — 07:10 · Paper (D-084, after the oryzo.ai intro).
 * u: -0.6..0  connection from S01 (same frame). "rhythm" is already behind the ring as it zooms
 *             out (no Dawn glow), clock 06:50 → 07:10
 *  0 state 1  "rhythm" behind the ring
 *  0 → 1      "rhythm" moves up and out; statement 1 (left) and paragraph 1 (right) rise and light
 *             up character by character with the scroll
 *  1 → 2      they move up and shrink to a small dim line; statement 2 / paragraph 2 rise (G-03)
 *  2 → 3      they move on up and out; "keeps the" slides in from the left and "pattern." from the
 *             right to flank the ring (Oryzo "it's wearable"); "Stillway just keeps the pattern."
 *             small above, paragraph 3 bottom right
 *  > 3.6      connection to S03 (D-120): the Night panel rises, this content moves up with it
 * The ring turns with the scroll the whole time (one continuous tumble, no stops between states).
 */
import { put, seg, smooth, clamp01, roll, type Ctx } from '../anim';
import { pose, ANGLE, type Pose } from '../ring/poses';
import { whyBg } from '../../content/whyBg';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let bigs: HTMLElement[][] = [];
let smalls: HTMLElement[][] = [];
let bigWraps: HTMLElement[] = [];
let smallWraps: HTMLElement[] = [];
const END = 3.6;
/** S02's last pose (the ring stays there through 02 → 03) */
export const WHY_END = END;
const cache = new WeakMap<HTMLElement, number>();

/**
 * Oryzo text: characters light up from 0.12 to 1 one after another as `inP` goes 0 → 1, and go out
 * (to 0) one after another as `outP` goes 0 → 1. `soft` = how many characters fade at once.
 */
function reveal(chars: HTMLElement[], inP: number, outP: number, soft = 6) {
  const n = chars.length;
  chars.forEach((c, i) => {
    const a = clamp01((inP * (n + soft) - i) / soft);
    const b = clamp01((outP * (n + soft) - i) / soft);
    const o = (0.12 + 0.88 * smooth(a)) * (1 - smooth(b));
    const r = Math.round(o * 100) / 100;
    if (cache.get(c) !== r) {
      cache.set(c, r);
      c.style.setProperty('--o', String(r));
    }
  });
}

export const why: SectionMotion = {
  init(root) {
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    el = {
      word: q('[data-w-word]'),
      bg: q('[data-w-bg]'),
      wide: q('[data-w-wide]'),
      wideL: q('[data-w-wide-l]'),
      wideR: q('[data-w-wide-r]'),
      final: q('[data-w-final]'),
      end: q('[data-w-end]'),
    };
    bigWraps = [...root.querySelectorAll<HTMLElement>('[data-w-big]')];
    smallWraps = [...root.querySelectorAll<HTMLElement>('[data-w-small]')];
    bigs = bigWraps.map((b) => [...b.querySelectorAll<HTMLElement>('.c')]);
    smalls = smallWraps.map((b) => [...b.querySelectorAll<HTMLElement>('.c')]);
  },
  update(u, ctx) {
    const H = window.innerHeight;
    // D-088/D-124 wall photo: rises with the S02 panel (story.ts), drifts up slowly with the scroll
    // (parallax), and is covered by the Night panel in 02 → 03. No fades.
    if (el.bg) put(el.bg, { yv: whyBg.parallax * (0.5 - clamp01((u + 2) / (END + 2))) }, ctx);
    // "rhythm": rises with the panel behind the ring, then moves up and out on the way to state 2
    put(el.word, { y: -H * 0.7 * seg(u, 0.15, 0.85), o: u < 0.85 ? 1 : 0 }, ctx);

    // statements (left) and paragraphs (right): one replaces the other by moving up (G-03); the
    // characters still light up with the scroll as each one arrives (Oryzo, D-084)
    const f = -1 + seg(u, 0.15, 0.85) + seg(u, 1.35, 2.0) + 2 * seg(u, 2.3, 2.85);
    roll(bigWraps, f, ctx, { origin: 'left', gap: 18 });
    roll(smallWraps, f, ctx, { origin: 'right', gap: 14 });
    const steps = [0.15, 1.35];
    steps.forEach((a, i) => {
      if (ctx.reduced) {
        bigs[i].concat(smalls[i]).forEach((c) => c.style.setProperty('--o', '1'));
        return;
      }
      reveal(bigs[i], seg(u, a, a + 0.7), 0, 6);
      reveal(smalls[i], seg(u, a + 0.1, a + 0.85), 0, 10);
    });

    // end state: the big words move in from the sides and flank the ring; the small line and the
    // last paragraph rise from below once the statements have gone
    const mv = seg(u, 2.35, 3);
    const off = (1 - mv) * window.innerWidth * 0.55;
    put(el.wide, { o: mv > 0.001 ? 1 : 0 }, ctx);
    put(el.wideL, { x: -off }, ctx);
    put(el.wideR, { x: off }, ctx);
    const fin = seg(u, 2.8, 3.15);
    put(el.final, { o: Math.min(1, fin * 5), y: (1 - fin) * 48 }, ctx);
    const end = seg(u, 2.9, 3.25);
    put(el.end, { o: Math.min(1, end * 5), y: (1 - end) * 48 }, ctx);
  },
  ring(u, ctx: Ctx): Pose {
    const m = ctx.mobile;
    const tq = ANGLE.threeQuarter;
    // D-089: the ring keeps turning with the scroll, but as a turntable (about the vertical axis),
    // one full turn between the key moments and a slow drift while each sentence is lit and at the
    // end. At every key moment it is back at the reference three-quarter pose, where the engraved
    // "Stillway" reads correctly (bottom → top, never upside down or mirrored).
    //   key A: statement 1 lit (u 0.55–1.25) · key B: statement 2 lit (1.85–2.35) · end (≥ 2.85)
    const turns = seg(u, 0, 0.55) + seg(u, 1.25, 1.85) + seg(u, 2.35, 2.85);
    const drift = 0.12 * clamp01(u / 3); // slow motion inside the key moments
    const t = smooth(clamp01(u / 3));
    const ryBase = tq.ry - 0.15 + (0.25 * t); // turns a little toward the camera by the end
    let ry = ryBase + Math.PI * 2 * turns + drift;
    if (u >= 2.85) ry -= Math.PI * 6; // same orientation; the 02 → 03 connection does not unwind
    // phones: the ring gets smaller at the end so "keeps the" / "pattern." clear it above and below
    const w = m ? 0.7 - 0.18 * seg(u, 2.35, 2.85) : 0.36;
    return pose({ x: 0, y: m ? 0 : -0.02 * t, w, rx: -0.15, ry, rz: 0, spin: 0 });
  },
};
