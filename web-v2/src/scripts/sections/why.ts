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
 *  > 3.6      connection to S03 (D-136): plain scroll — the text moves up 1:1 with the scroll and
 *             leaves the screen in the first ≈ 40% (no fade, blur, scale or parallax); the ring stays
 *             centred (sleep.ts ringIn). Reduced motion keeps the short fade.
 * Background: plain Paper (D-148, the D-088 wall photo is removed).
 * The ring turns with the scroll the whole time (one continuous tumble, no stops between states).
 */
import { view } from '../viewport';
import { put, seg, smooth, clamp01, type Ctx } from '../anim';
import { pose, ANGLE, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let bigs: HTMLElement[][] = [];
let smalls: HTMLElement[][] = [];
let bigWraps: HTMLElement[] = [];
let smallWraps: HTMLElement[] = [];
const END = 3.6;
/** QA27 M-14 (phones): the last statement's way out, then the start of the big words */
const LAST_OUT = [2.12, 2.45];
const WIDE_IN_PHONE = 2.5;
/** 100svh in px, the scroll length of one u (story.ts measures the same probe) */
let vhPx = 0;
const measureVh = () => (vhPx = view.h);
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
      label: q('[data-w-label]'),
      word: q('[data-w-word]'),
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
    measureVh();
    window.addEventListener('resize', measureVh);
  },
  update(u, ctx) {
    // connection to S03 (D-136): everything goes up exactly as far as the page scrolls. Reduced
    // motion has no transforms, so there the old short fade stays (first 30%).
    const out = ctx.reduced ? 1 - seg(u, END, END + 0.3) : 1;
    const up = ctx.reduced ? 0 : -Math.max(0, u - END) * vhPx; // px
    // "rhythm": shows while the ring zooms out of S01 (u ≈ −1.1 … −0.4), gone on the way to state 2
    put(el.word, { o: seg(u, -1.1, -0.4) * (1 - seg(u, 0.25, 0.8)) }, ctx);
    // QA W-01: the small label of State 1 (Figma Design · 02 State 1)
    put(el.label, { o: seg(u, -0.45, -0.05) * (1 - seg(u, 0.1, 0.35)) }, ctx);

    // statements and paragraphs: light up / go out per character (reduced: whole-block fades)
    // QA R-04 / M-01: statement 1 is fully out before statement 2 starts (they share one slot)
    const steps: Array<[number, number]> = [
      [0.15, 1.1], // statement 1 lit over 0.15 → 0.75, out over 1.1 → 1.5
      [1.55, 2.3],
    ];
    steps.forEach(([a, b], i) => {
      const inP = seg(u, a, a + 0.55);
      // QA27 M-14: phones — the last statement has gone completely before "keeps the pattern." starts
      const early = ctx.mobile && i === steps.length - 1;
      const o0 = early ? LAST_OUT[0] : b;
      const outP = seg(u, o0, early ? LAST_OUT[1] : b + 0.4);
      const vis = u > a && u < (early ? LAST_OUT[1] : b + 0.45);
      if (ctx.reduced) {
        put(bigWraps[i], { o: vis && u >= a + 0.35 && u < b + 0.25 ? 1 : 0 }, ctx);
        put(smallWraps[i], { o: vis && u >= a + 0.35 && u < b + 0.25 ? 1 : 0 }, ctx);
        bigs[i].concat(smalls[i]).forEach((c) => c.style.setProperty('--o', '1'));
        return;
      }
      put(bigWraps[i], { o: vis ? 1 : 0 }, ctx);
      put(smallWraps[i], { o: vis ? 1 : 0 }, ctx);
      reveal(bigs[i], inP, outP, 6);
      reveal(smalls[i], seg(u, a + 0.05, a + 0.6), seg(u, o0, early ? LAST_OUT[1] : b + 0.45), 10);
    });

    // end state: the big words move in from the sides and flank the ring
    const mv = seg(u, ctx.mobile ? WIDE_IN_PHONE : 2.35, 3);
    let offL = (1 - mv) * window.innerWidth * 0.55;
    let offR = offL;
    if (ctx.mobile && el.wide && el.wideL && el.wideR) {
      // QA27 M-14: phones — each half travels only as far as the screen edge allows, never past it
      const room = (px: number) => (1 - mv) * Math.max(0, px - 8);
      offL = room(el.wideL.offsetLeft);
      offR = room(el.wide.offsetWidth - el.wideR.offsetLeft - el.wideR.offsetWidth);
    }
    put(el.wide, { o: Math.min(1, mv * 1.6) * out, y: up }, ctx);
    put(el.wideL, { x: -offL }, ctx);
    put(el.wideR, { x: offR }, ctx);
    put(el.final, { o: seg(u, 2.75, 3.05) * out, y: up, yv: 0.02 * (1 - seg(u, 2.75, 3.05)) }, ctx);
    put(el.end, { o: seg(u, 2.8, 3.15) * out, y: up, yv: 0.02 * (1 - seg(u, 2.8, 3.15)) }, ctx);
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
