/**
 * S06 Product details — 21:00 · Paper + Sand plinth (D-093; flow Storyboard §2, look Figma sticky
 * 40004118:112, geometry design/3d/v2/s06-pose.json).
 * u: -1..0 connection from S05 (card fades, camera backs out of the ring, it shrinks and drops to the
 *          plinth on the left, Dusk → Paper, the plinth appears; clock 17:30 → 21:00)
 *  0..1  state 1  the ring rolls in from the left edge (≈55 vw desktop, 40 vw phone), overshoots,
 *                 rocks back and rests facing the camera; "Made to be forgotten." from 16%
 *  2     state 2  turned ±90° to the side; "One quiet band"
 *  3     state 3  seen from the edge at 45°, tipped 20°; "Softened edges"
 *  4     state 4  the plinth leaves, the hand rises on the right; the ring moves above the
 *                 fingertip and slides down to the seat (A-1b only without WebGL)
 *  > 4.6 to S07: the hand photo shrinks into a card, then card and ring leave upward while the Sand
 *        panel rises (no fade; the snapshot-to-card of D-123 P10 comes in phase 3)
 */
import { put, seg, lerp, clamp01, roll, PARALLAX, type Ctx } from '../anim';
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
  // D-093 r1: the standing ring is the figure of the screen (Ultrahuman ref ±55–65% of the height)
  const D = m ? Math.min(W * 0.7, H * 0.36) : Math.min(H * 0.6, W * 0.36);
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
  // reduced motion / no WebGL: polished still (fb-s02, ring 84.6% of the image height) on the plinth
  const fbw = L.D / 0.846;
  const cx = (0.5 + (ctx.mobile ? -0.02 : 0.12)) * L.W;
  root.style.setProperty('--fbw', `${fbw.toFixed(1)}px`);
  root.style.setProperty('--fbx', `${(cx - 0.528 * fbw).toFixed(1)}px`);
  root.style.setProperty('--fby', `${(L.py + L.face * 0.55 - 0.918 * fbw).toFixed(1)}px`);
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
  const start = ctx.mobile ? -0.42 : -0.43;
  const stop = ctx.mobile ? -0.02 : 0.12;
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

/**
 * 06 → 07 (Storyboard §3): the hand photo shrinks into a card with rounded corners around the
 * finger, moves to the centre (where S07's cards appear) and fades. leave 0..1 (eased).
 */
function cardLeave(leave: number, L: ReturnType<typeof layout>, ctx: Ctx) {
  const k = seg(leave, 0, 0.55);
  const cw = Math.min(L.W * (ctx.mobile ? 0.5 : 0.2), L.H * 0.36);
  const ch = cw * 1.25;
  const cx = L.seat.x;
  const cy = L.hy + 300 * L.hs;
  const mv = seg(leave, 0.15, 0.6);
  return {
    k,
    t: lerp(0, cy - ch / 2, k),
    b: lerp(0, L.H - (cy + ch / 2), k),
    l: lerp(0, cx - cw / 2, k),
    r: lerp(0, L.W - (cx + cw / 2), k),
    mx: (L.W / 2 - cx) * mv,
    my: (L.H / 2 - cy) * mv,
    s: 1 - 0.35 * seg(leave, 0.2, 0.6),
    up: seg(leave, 0.5, 0.95) * L.H * 1.15, // then up and off the screen (no fade, D-120)
  };
}

/**
 * the 3D ring on the finger follows the card out (it is not part of the photo, D-093 r1); k = how far
 * the S07 panel has risen (the S06 layer moves up with it, story.ts)
 */
export function detailsLeaveRing(x: number, ctx: Ctx, k = 0): Pose {
  const L = layout(ctx);
  const leave = seg(x, 0, 1);
  const c = cardLeave(leave, L, ctx);
  const p = fingerPose(1, L, { shadow: 0 });
  // card transform: translate(mx, my) scale(s) about the viewport centre
  const sx = L.W / 2 + (L.seat.x - L.W / 2) * c.s + c.mx;
  const sy = L.H / 2 + (L.seat.y - L.H / 2) * c.s + c.my - c.up - PARALLAX * L.H * k;
  return {
    ...p,
    x: fx(sx, L.W),
    y: fy(sy, L.H),
    w: p.w * c.s,
    fx: fx(sx, L.W),
    fy: fy(sy, L.H),
    fs: p.fs * c.s,
  };
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
      seatShadow: q('[data-d-seat]'),
      head: q('[data-d-head]'),
      fits: q('[data-d-fits]'),
      label: q('[data-d-label]'),
    };
    steps = [...r.querySelectorAll<HTMLElement>('[data-d-step]')];
  },
  update(u, ctx) {
    const L = setVars(ctx);
    const H = L.H;
    const leave = seg(u, DETAILS_END, DETAILS_END + 1); // the 06 → 07 connection, 0..1
    // the plinth rises with the panel (story.ts) and leaves downward before the hand comes in
    const plinthOut = seg(u, 3.05, 3.45);
    put(el.plinth, { o: plinthOut < 0.999 ? 1 : 0, y: plinthOut * H * 0.5 }, ctx);
    // soft contact shadow under the ring on the top face; follows the roll, narrows side-on
    if (el.shadow && u < 3.2) {
      const p = plinthPose(Math.max(0, u), ctx, L);
      const wpx = L.D * (0.92 * Math.abs(Math.cos(p.ry)) + 0.36 * Math.abs(Math.sin(p.ry)));
      el.shadow.style.width = `${wpx.toFixed(1)}px`;
      const sh = L.D * 0.07;
      el.shadow.style.height = `${sh.toFixed(1)}px`;
      el.shadow.style.top = `${(L.face * 0.55 - sh / 2).toFixed(1)}px`;
      el.shadow.style.left = `${((p.x + 0.5) * L.W - wpx / 2 + L.W * 0.04).toFixed(1)}px`;
    }
    // headline: rises in state 1, moves up and out before state 4
    const hin = ctx.reduced ? (u >= 0 ? 1 : 0) : seg(u, 0.55, 0.85);
    const hout = seg(u, 3.05, 3.4);
    put(el.head, { o: Math.min(1, hin * 5) * (hout < 0.999 ? 1 : 0), y: (1 - hin) * 48 - hout * H * 0.5 }, ctx);
    // the two steps replace each other by moving up (G-03), and both have gone by state 4
    roll(steps, -1 + seg(u, 1.4, 1.75) + seg(u, 2.4, 2.75) + 2 * seg(u, 3.05, 3.4), ctx, { origin: 'left', gap: 16 });
    const fits = seg(u, 3.35, 3.75);
    put(el.fits, { o: Math.min(1, fits * 5), y: (1 - fits) * 48 }, ctx);
    put(el.label, { o: seg(u, 3.8, 3.98) }, ctx); // a small label: short fade

    // hand: rises from the bottom as the plinth leaves
    const hand = seg(u, 3.1, 3.5);
    // D-093 r1: the polished 3D ring stays on the finger (D-085); A-1b only without WebGL / reduced motion
    const live = document.documentElement.classList.contains('ring-ready');
    if (el.ringed) el.ringed.style.opacity = live ? '0' : seg(u, 3.88, 3.98).toFixed(3);
    put(el.seatShadow, { o: live ? seg(u, 3.75, 3.92) : 0 }, ctx);
    // 06 → 07 (Storyboard §3): the hand photo shrinks into a card with rounded corners, then leaves upward
    if (el.card && root) {
      const c = cardLeave(leave, L, ctx);
      const cs = el.card.style;
      cs.setProperty('--ct', `${c.t.toFixed(1)}px`);
      cs.setProperty('--cb', `${c.b.toFixed(1)}px`);
      cs.setProperty('--cl', `${c.l.toFixed(1)}px`);
      cs.setProperty('--cr', `${c.r.toFixed(1)}px`);
      cs.setProperty('--cr0', `${(14 * c.k).toFixed(1)}px`);
      cs.setProperty('--cbg', c.k > 0.001 ? '1' : '0');
      put(el.card, { o: hand > 0.001 ? 1 : 0, x: c.mx, y: c.my - c.up, s: c.s }, ctx);
      put(el.hand, { o: 1, y: (1 - hand) * H * 0.6 }, ctx);
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
    return fingerPose(slide, L, { shadow: 0 });
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
