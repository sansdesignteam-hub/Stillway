/**
 * S02 Why Stillway — 07:10 · Paper (D-084, after the oryzo.ai intro).
 * u: -0.6..0  connection from S01 (same frame). "rhythm" is already behind the ring as it zooms
 *             out (no Dawn glow), clock 06:50 → 07:10
 *  0 state 1  "rhythm" behind the ring
 *  0 → 1      "rhythm" fades; statement 1 (left) and paragraph 1 (right) light up character by
 *             character with the scroll
 *  1 → 2      they go out the same way, statement 2 / paragraph 2 light up
 *  2 → 3      they go out; "keeps the" slides in from the left and "pattern." from the right to
 *             flank the ring (Oryzo "it's wearable"); "Stillway just keeps the pattern." small above,
 *             paragraph 3 bottom right
 *  > 3.6      connection to S03: text out in its first 30%
 * The ring turns with the scroll the whole time (one continuous tumble, no stops between states).
 */
import { put, seg, smooth, clamp01, type Ctx } from '../anim';
import { pose, ANGLE, type Pose } from '../ring/poses';
import { whyBg } from '../../content/whyBg';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let bigs: HTMLElement[][] = [];
let smalls: HTMLElement[][] = [];
let bigWraps: HTMLElement[] = [];
let smallWraps: HTMLElement[] = [];
const END = 3.6;
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
    const out = 1 - seg(u, END, END + 0.3); // connection to S03, first 30%
    // D-088 background: fades in from Paper while S01 hands over (the photo there has faded to
    // Paper by u ≈ −0.6), drifts up slowly with the scroll (parallax), and leaves in the 30–70%
    // middle of the connection to S03, together with Paper → Night.
    if (el.bg) {
      const inn = seg(u, -1.0, -0.2);
      const leave = 1 - seg(u, END + 0.3, END + 0.7);
      put(el.bg, { o: inn * leave, yv: whyBg.parallax * (0.5 - clamp01((u + 1) / (END + 1))) }, ctx);
    }
    // "rhythm": shows while the ring zooms out of S01 (u ≈ −1.1 … −0.4), gone on the way to state 2
    put(el.word, { o: seg(u, -1.1, -0.4) * (1 - seg(u, 0.25, 0.8)) }, ctx);

    // statements and paragraphs: light up / go out per character (reduced: whole-block fades)
    const steps: Array<[number, number]> = [
      [0.15, 1.35], // statement 1 lit over 0.15 → 0.85, out over 1.35 → 1.85
      [1.4, 2.35],
    ];
    steps.forEach(([a, b], i) => {
      const inP = seg(u, a, a + 0.7);
      const outP = seg(u, b, b + 0.5);
      const vis = u > a - 0.05 && u < b + 0.55;
      if (ctx.reduced) {
        put(bigWraps[i], { o: vis && u >= a + 0.35 && u < b + 0.25 ? 1 : 0 }, ctx);
        put(smallWraps[i], { o: vis && u >= a + 0.35 && u < b + 0.25 ? 1 : 0 }, ctx);
        bigs[i].concat(smalls[i]).forEach((c) => c.style.setProperty('--o', '1'));
        return;
      }
      put(bigWraps[i], { o: vis ? 1 : 0 }, ctx);
      put(smallWraps[i], { o: vis ? 1 : 0 }, ctx);
      reveal(bigs[i], inP, outP, 6);
      reveal(smalls[i], seg(u, a + 0.1, a + 0.85), seg(u, b + 0.05, b + 0.55), 10);
    });

    // end state: the big words move in from the sides and flank the ring
    const mv = seg(u, 2.35, 3);
    const off = (1 - mv) * window.innerWidth * 0.55;
    put(el.wide, { o: Math.min(1, mv * 1.6) * out }, ctx);
    put(el.wideL, { x: -off }, ctx);
    put(el.wideR, { x: off }, ctx);
    put(el.final, { o: seg(u, 2.55, 3) * out, yv: 0.02 * (1 - seg(u, 2.55, 3)) }, ctx);
    put(el.end, { o: seg(u, 2.7, 3.1) * out, yv: 0.02 * (1 - seg(u, 2.7, 3.1)) }, ctx);
  },
  ring(u, ctx: Ctx): Pose {
    const m = ctx.mobile;
    const tq = ANGLE.threeQuarter;
    const w = m ? 0.7 : 0.36;
    // one continuous tumble over the whole section (state 1 → 4), eased only at the ends:
    // a full turn about the screen's horizontal axis while turning toward the camera
    const t = smooth(clamp01(u / 3));
    const start = { rx: -0.15, ry: tq.ry - 0.15 };
    const endP = { rx: ANGLE.facing.rx, ry: -0.3 };
    let rx = start.rx + (endP.rx - start.rx) * t + Math.PI * 2 * t;
    if (u >= 3) rx -= Math.PI * 2; // same orientation; keeps the 02 → 03 connection from unwinding
    const ry = start.ry + (endP.ry - start.ry) * t;
    return pose({ x: 0, y: m ? 0 : -0.02 * t, w, rx, ry, rz: 0, spin: 0 });
  },
};
