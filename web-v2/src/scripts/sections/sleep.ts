/**
 * S03 Sleep summary — 23:10 · Night (D-090; flow from Storyboard §2, look from the Moodboard
 * Layout references, see Sleep.astro).
 * u: -1..0 connection from S02 — the model connection of the site (D-120, D-116, D-108):
 *    0–35%   the Night panel rises with a straight edge, S02 moves up and out with it; the ring stays
 *            where it is and its light goes out to an almost-silhouette (not a fade); the navbar
 *            turns Light → Dark and the clock 07:10 → 23:10 as the edge passes it (story.ts)
 *    35–65%  the warm cocoa/200 light from above, and one white glint runs across the band (scrub)
 *    65–100% both windows and the two dots light green; the headline rises from the lower left
 *  0 state 1  = the end of the connection: ring centred in the warm light, sensor green
 *  1 state 2  [ SETTLED ] 23:10 big in the slot; ring moves right (ref 1 composition)
 *  2 state 3  [ RESTED ] 7h 12m takes the slot; 23:10 shrinks upward and dims
 *  3 state 4  [ BROKEN ] 2× takes the slot, small line + Simulated data; ring at the reference
 *             pose, engraving readable (D-089 lesson)
 *  > 3.6      connection to S04: the content moves up with the S04 panel (story.ts)
 * Reduced motion: no WebGL; the connection jumps straight to state C (no glint).
 */
import { put, seg, window4, type Ctx } from '../anim';
import { along, pose, ANGLE, lerpPose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { why, WHY_END } from './why';

let el: Record<string, HTMLElement | null> = {};
let stats: HTMLElement[] = [];
const END = 3.6;

/**
 * the light of S03 (D-108): lights out, the warm light from above, the sensor green. The studio env
 * (dimmed) instead of the Night env: its cold rim strip is not used any more (D-108).
 */
const LIT = { light: 0, rim: 0, dim: 1, spot: 1, sensor: 1, uncap: 1 };

/** Display 4 / Display 2 for the current viewport, read from the rendered unit and number */
let ratioKey = '';
let ratio = 0.45;
const prevScale = () => {
  const key = `${window.innerWidth}`;
  if (key !== ratioKey && stats.length) {
    const unit = stats.map((s) => s.querySelector<HTMLElement>('.stat__unit')).find(Boolean);
    const value = stats[0].querySelector<HTMLElement>('.stat__value');
    const a = unit ? parseFloat(getComputedStyle(unit).fontSize) : 0;
    const b = value ? parseFloat(getComputedStyle(value).fontSize) : 0;
    if (a && b) {
      ratio = a / b;
      ratioKey = key;
    }
  }
  return ratio;
};

export const sleep: SectionMotion = {
  init(r) {
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { head: q('[data-s-head]'), line: q('[data-s-line]'), sim: q('[data-s-sim]'), beam: q('[data-s-beam]') };
    stats = [...r.querySelectorAll<HTMLElement>('[data-s-stat]')];
  },
  update(u, ctx) {
    const H = window.innerHeight;
    // the light cone from above (a glow): 35–65% of the connection, then stays
    put(el.beam, { o: seg(u, -0.65, -0.4) }, ctx);
    // headline rises from the lower left in 65–100% of the connection (D-120)
    const h = seg(u, -0.35, 0);
    put(el.head, { o: Math.min(1, h * 5), y: (1 - h) * H * 0.35 }, ctx);
    stats.forEach((s, i) => {
      const a = 0.5 + i; // number i arrives on the way to state i + 2
      const inn = seg(u, a, a + 0.45);
      const back = seg(u, a + 1, a + 1.45); // the next number arrives: shrink upward, dim
      const gone = seg(u, a + 2, a + 2.45); // two numbers later: up and out
      // the previous number ends small and dim, at the Display 4 size (Figma "Previous value" 72)
      const scale = 1 - (1 - prevScale()) * back;
      // the dimmed number moves up by the height of the block that replaces it, so they never overlap
      const lift = (stats[i + 1]?.offsetHeight ?? s.offsetHeight) + 14;
      const y = (1 - inn) * (s.offsetHeight + 24) - back * lift - gone * lift;
      put(s, { o: Math.min(1, inn * 5) * (1 - 0.6 * back) * (1 - gone), y, s: scale }, ctx);
      s.classList.toggle('is-active', u >= a + 0.2 && (i === stats.length - 1 || u < a + 1.2));
    });
    put(el.sim, { o: seg(u, 0.6, 0.8) }, ctx);
    put(el.line, { o: seg(u, 2.6, 2.8) }, ctx);
  },
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const tq = ANGLE.threeQuarter;
    // state 1 = where S02 left the ring (it stays put through 02 → 03), in the S03 light
    const start = { ...why.ring!(WHY_END, ctx), ...LIT };
    // ref 1: big ring on the right, may be cut by the edge; phones: upper half
    const side = m ? { x: 0, y: 0.22, w: 0.72 } : { x: 0.33, y: -0.03, w: 0.48 };
    // slow continuous turn (no stops), ending at the reference pose where "Stillway" reads
    const drift = (k: number) => tq.ry + 0.55 * (1 - k);
    return along(u, [
      [0, pose(start)],
      [1, pose({ ...side, ...tq, ry: drift(0.4), rx: -0.18, ...LIT })],
      [2, pose({ ...side, ...tq, ry: drift(0.75), rx: -0.16, ...LIT })],
      // state 4: a little further in and smaller so the engraving on the band is fully in view
      [3, pose({ ...side, x: m ? 0 : 0.25, w: m ? side.w : 0.4, ...tq, ry: drift(1) - 0.05, rx: -0.15, ...LIT })],
    ]);
  },
  // 02 → 03 (D-120): the ring does not move; only its light changes
  ringIn(x, _ctx, from: Pose, to: Pose) {
    const p = lerpPose(from, to, seg(x, 0.3, 0.7)); // = from (to starts where from ends)
    const dim = seg(x, 0, 0.35);
    return {
      ...p,
      dim,
      light: 0,
      rim: 0,
      spot: seg(x, 0.35, 0.6),
      sweep: seg(x, 0.35, 0.65),
      sweepI: window4(x, 0.35, 0.42, 0.58, 0.65),
      sensor: seg(x, 0.65, 0.85),
    };
  },
};
