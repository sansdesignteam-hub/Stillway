/**
 * S06 Product details — 21:00 · Paper + Sand plinth (D-093; flow Storyboard §2, look Figma sticky
 * 40004118:112, geometry design/3d/v2/s06-pose.json).
 * u: -1..0 connection from S05 (card fades, camera backs out of the ring, it shrinks and drops to the
 *          plinth on the left, Dusk → Paper, the plinth appears; clock 17:30 → 21:00)
 *  0..1  state 1  the ring rolls in from the left edge (≈55 vw desktop, 40 vw phone), overshoots,
 *                 rocks back and rests facing the camera; "Made to be forgotten." from 16%
 *  2     state 2  turned ±90° to the side; "One quiet band"
 *  3     state 3  seen from the edge at 45°, tipped 20°; "Softened edges"
 *  4     state 4  the plinth leaves, the hand fades in on the right; the ring moves above the
 *                 fingertip, slides down to the seat and becomes the ring in the photo (A-1b)
 *  > 4.6 to S07 (specs.ts drives the card shrink through this module's update)
 */
import { put, seg, lerp, clamp01, window4, type Ctx } from '../anim';
import { lerpPose, pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
let steps: HTMLElement[] = [];
let root: HTMLElement | null = null;
export const DETAILS_END = 4.6;
const D2R = Math.PI / 180;

/** layout in px for the current viewport: ring diameter, plinth top, hand box (s06-pose.json) */
function layout(ctx: Ctx) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const m = ctx.mobile;
  const D = m ? Math.min(W * 0.5, H * 0.26) : H * 0.3;
  const py = H * (m ? 0.6 : 0.74); // plinth top
  const face = H * 0.036;
  const cy = py + face * 0.55 - D / 2; // the ring stands on the middle of the top face
  // hand A-1 (579 × 1198 img px): desktop right, full height from 10 vh; phone lower right
  const hs = m ? (H * 0.66) / 1198 : H / 1198;
  const hy = m ? H * 0.36 : H * 0.1;
  const seatX = m ? W * 0.6 : W * 0.7;
  const hx = seatX - 343 * hs;
  return { W, H, D, py, face, cy, hs, hx, hy, seat: { x: seatX, y: hy + 360 * hs } };
}

let lastKey = '';
function setVars(ctx: Ctx) {
  const L = layout(ctx);
  const key = `${L.W}x${L.H}${ctx.mobile}`;
  if (key === lastKey || !root) return L;
  lastKey = key;
  root.style.setProperty('--hx', `${L.hx.toFixed(1)}px`);
  root.style.setProperty('--hy', `${L.hy.toFixed(1)}px`);
  root.style.setProperty('--hs', L.hs.toFixed(4));
  root.style.setProperty('--py', `${L.py.toFixed(1)}px`);
  return L;
}

/** px (from the top-left) → pose fractions (from the centre, y up) */
const fx = (px: number, W: number) => px / W - 0.5;
const fy = (py: number, H: number) => 0.5 - py / H;

// rest angle: opening toward the camera, turned a little so the band and the engraved "Stillway"
// on its right side read (Ultrahuman ref: the wordmark runs up the visible side of the band)
const FRONT = { rx: 0, ry: -0.68, rz: 0, spin: 0, pitch: 0.1 };
const SIDE = { rx: 0, ry: -Math.PI / 2 + 0.08, rz: 0, spin: 0, pitch: 0.12 };
const EDGE = { rx: 0, ry: -Math.PI / 4, rz: 0, spin: 0, pitch: 20 * D2R };

function rollX(u: number, ctx: Ctx, L: ReturnType<typeof layout>) {
  const start = ctx.mobile ? -0.42 : -0.5;
  const stop = ctx.mobile ? -0.02 : 0.05;
  const over = stop + (0.06 * L.D) / 2 / L.W;
  const t = ctx.reduced ? 1 : clamp01(u);
  // 0 → 22%: power2.out to a little past the stop; 22 → 25%: sine back (s06-pose.json rolling)
  const k = 0.88;
  let x: number;
  if (t <= k) {
    const q = t / k;
    x = lerp(start, over, 1 - (1 - q) * (1 - q));
  } else {
    const q = (t - k) / (1 - k);
    x = lerp(over, stop, 0.5 - 0.5 * Math.cos(Math.PI * q));
  }
  // rolling: angle = distance / radius, clockwise when moving right
  const spin = FRONT.spin - ((x - stop) * L.W) / (L.D / 2);
  return { x, spin, stop };
}

function plinthPose(u: number, ctx: Ctx, L: ReturnType<typeof layout>): Pose {
  const { x, spin, stop } = rollX(u, ctx, L);
  const y = fy(L.cy, L.H);
  const base = { y, w: L.D / L.W }; // contact shadow is CSS on the plinth (details update)
  if (u <= 1) return pose({ ...base, x, ...FRONT, spin });
  const front = pose({ ...base, x: stop, ...FRONT });
  const side = pose({ ...front, ...SIDE });
  const edge = pose({ ...front, ...EDGE });
  if (u <= 2) return lerpPose(front, side, seg(u, 1.15, 1.85));
  return lerpPose(side, edge, seg(u, 2.15, 2.85));
}

/** state 4: above the fingertip → seat, onFinger pose with the view correction (s06-pose.json) */
function fingerPose(slide: number, L: ReturnType<typeof layout>, extra: Partial<Pose> = {}): Pose {
  const ax = -Math.sin(2.9 * D2R);
  const ay = -Math.cos(2.9 * D2R); // toward the tip in screen px (y down)
  const dist = (360 - 23 + 40) * L.hs * (1 - slide);
  const px = L.seat.x + ax * dist;
  const py = L.seat.y + ay * dist;
  const camZ = L.H / 2 / Math.tan(15 * D2R);
  const rxp = px - L.W / 2;
  const ryp = L.H / 2 - py;
  return pose({
    x: fx(px, L.W),
    y: fy(py, L.H),
    w: (122 * L.hs) / L.W,
    rx: -Math.PI / 2,
    ry: -Math.PI / 2 + Math.atan2(-rxp, camZ),
    rz: 0,
    spin: 0,
    pitch: 10 * D2R + Math.atan2(ryp, camZ),
    roll: 2.9 * D2R,
    fing: 1,
    fx: fx(L.seat.x, L.W),
    fy: fy(L.seat.y, L.H),
    fs: L.hs,
    ...extra,
  });
}

export const details: SectionMotion = {
  init(r) {
    root = r;
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = {
      plinth: q('[data-d-plinth]'),
      shadow: q('[data-d-shadow]'),
      card: q('[data-d-card]'),
      hand: q('[data-d-hand]'),
      ringed: q('[data-d-ringed]'),
      head: q('[data-d-head]'),
      fits: q('[data-d-fits]'),
      label: q('[data-d-label]'),
    };
    steps = [...r.querySelectorAll<HTMLElement>('[data-d-step]')];
  },
  update(u, ctx) {
    const L = setVars(ctx);
    const leave = seg(u, DETAILS_END, DETAILS_END + 1); // the 06 → 07 connection, 0..1
    // plinth rises with the end of the connection, leaves before the hand comes in
    const plinthIn = ctx.reduced ? (u >= -0.5 ? 1 : 0) : seg(u, -0.35, -0.05);
    const plinthOut = seg(u, 3.05, 3.45);
    put(el.plinth, { o: plinthIn * (1 - plinthOut), y: (1 - plinthIn) * 40 + plinthOut * 60 }, ctx);
    // soft contact shadow under the ring on the top face; follows the roll, narrows side-on
    if (el.shadow && u < 3.2) {
      const p = plinthPose(Math.max(0, u), ctx, L);
      const wpx = L.D * (0.92 * Math.abs(Math.cos(p.ry)) + 0.36 * Math.abs(Math.sin(p.ry)));
      el.shadow.style.width = `${wpx.toFixed(1)}px`;
      el.shadow.style.left = `${((p.x + 0.5) * L.W - wpx / 2 + L.W * 0.04).toFixed(1)}px`;
    }
    put(el.head, { o: window4(u, ctx.reduced ? -0.5 : 0.45, 0.75, 3.05, 3.35), y: (1 - seg(u, 0.45, 0.75)) * 16 }, ctx);
    steps.forEach((s, i) => {
      const a = 1.4 + i;
      put(s, { o: window4(u, a, a + 0.35, a + 0.85, a + 1.15), y: (1 - seg(u, a, a + 0.35)) * 14 }, ctx);
    });
    const fits = seg(u, 3.35, 3.75);
    put(el.fits, { o: fits * (1 - seg(leave, 0, 0.3)), y: (1 - fits) * 16 }, ctx);
    put(el.label, { o: seg(u, 3.8, 3.98) * (1 - seg(leave, 0, 0.3)) }, ctx);

    // hand: fades in with the end of the plinth, slight rise
    const hand = seg(u, 3.1, 3.5);
    if (el.ringed) el.ringed.style.opacity = seg(u, 3.88, 3.98).toFixed(3);
    // 06 → 07 (Storyboard §3): the hand photo shrinks into a card with rounded corners, then fades
    const shrink = seg(leave, 0, 0.55);
    if (el.card && root) {
      // card = portrait box around the finger, centred on the screen when it is done
      const cw = Math.min(L.W * (ctx.mobile ? 0.5 : 0.2), L.H * 0.36);
      const ch = cw * 1.25;
      const cx = L.seat.x;
      const cy = L.hy + 300 * L.hs;
      const k = shrink;
      const t = lerp(0, cy - ch / 2, k);
      const b = lerp(0, L.H - (cy + ch / 2), k);
      const l = lerp(0, cx - cw / 2, k);
      const r = lerp(0, L.W - (cx + cw / 2), k);
      const cs = el.card.style;
      cs.setProperty('--ct', `${t.toFixed(1)}px`);
      cs.setProperty('--cb', `${b.toFixed(1)}px`);
      cs.setProperty('--cl', `${l.toFixed(1)}px`);
      cs.setProperty('--cr', `${r.toFixed(1)}px`);
      cs.setProperty('--cr0', `${(14 * k).toFixed(1)}px`);
      cs.setProperty('--cbg', k > 0.001 ? '1' : '0');
      // move the card toward the centre of the screen (where S07's Night card appears)
      const mx = (L.W / 2 - cx) * seg(leave, 0.15, 0.6);
      const my = (L.H / 2 - cy) * seg(leave, 0.15, 0.6);
      put(el.card, { o: hand * (1 - seg(leave, 0.5, 0.7)), x: mx, y: my, s: 1 - 0.35 * seg(leave, 0.2, 0.6) }, ctx);
      put(el.hand, { o: 1, y: (1 - hand) * 30 }, ctx);
    }
  },
  ring(u, ctx) {
    const L = layout(ctx);
    if (u <= 3.1) return plinthPose(u, ctx, L);
    const edge = plinthPose(3, ctx, L);
    // 3.1 → 3.55 lift over the fingertip, scale to the finger and turn to onFinger; 3.55 → 3.9 slide
    const above = fingerPose(0, L, { fing: 0 });
    const lift = seg(u, 3.1, 3.55);
    if (u < 3.55) {
      const p = lerpPose(edge, above, lift);
      return { ...p, fing: 0 };
    }
    const slide = seg(u, 3.55, 3.9);
    // the 3D ring hands over to the photo ring (A-1b) at the seat
    return fingerPose(slide, L, { alpha: 1 - seg(u, 3.92, 4.0), shadow: 0 });
  },
  // 05 → 06 (Storyboard §3): the camera backs out of the ring — it shrinks (geometric, so it reads
  // as distance) and drops to the plinth on the left; the cast shadow lands as it touches down
  ringIn(x, _ctx, from, to) {
    const t = seg(x, 0.05, 0.85);
    const p = lerpPose(from, to, t);
    p.w = from.w * Math.pow(to.w / from.w, t);
    p.shadow = to.shadow * seg(x, 0.7, 0.95);
    p.warm = from.warm * (1 - seg(x, 0.2, 0.6));
    return p;
  },
};

/** S06 first frame for the incoming connection (ring on the plinth, half cut off at the left edge) */
export const detailsStart = (ctx: Ctx) => details.ring!(0, ctx);
