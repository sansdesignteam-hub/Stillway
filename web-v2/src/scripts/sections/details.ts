/**
 * S06 Product details — 21:00 · Paper (D-144; Figma Design 06 State 1–4 40004263:662 … :794 and
 * 06 · Tangan & ring A–C 40004325:3298 … :3368; final pose design/3d/v2/s06-pose.json).
 * u: -1..0 connection from S05 (the camera backs out of the ring, it lands on the table; Dusk → Paper)
 *  0  State 1  one ring stands upright, opening to the camera, against the left edge of the screen
 *              on the pine table; from here it rolls on, smoothly with the scroll, turning by the
 *              distance (angle = distance / radius, no slip) all the way to the table's edge (D-145:
 *              no motion ghosts, no stops); "Made to be forgotten."
 *  1  State 2  on its way; "One quiet band"
 *  2  State 3  at the edge (x 720 of 1440); "Softened edges"; it tips over the corner…
 *  D-173 (oryzo.ai, the falling object), retimed D-174 (slower, one continuous motion):
 *  2.55 → 3.75 the ring drops off the corner (a soft dip) and the frame re-centres on it while the
 *              table goes up and out; it never fades — one ring from the roll to the finger
 *  3.75 → 4.7  alone in the air, still tumbling with the momentum of the roll, slowly coming down
 *  4.3 → 6     the hand (photo A-1) rises from below while the ring is still descending; the ring's
 *              tumble settles progressively into the finger's orientation over the fingertip (6)
 *  5.6 → 6.7   one smooth move from the fingertip down to the seat (onFinger pose, finger proxy)
 *  6.85 → 7.2  "Then, it just fit." and the S06 body appear (hidden through the fall); (D-157: no tag)
 *  > END to S07 (D-192): a crossfade — the hand with the ring slides down and out, the text up and
 *        out, both fading, and then "Through the day." (specs.ts) fades in
 * The hand photo's cut bottom is always below the viewport (and melted into Paper), on every screen.
 */
import { view } from '../viewport';
import { put, seg, lerp, clamp01, window4, type Ctx } from '../anim';
import { lerpPose, pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { sections } from '../../content/sections';

let el: Record<string, HTMLElement | null> = {};
let steps: HTMLElement[] = [];
let ticks: HTMLElement[] = [];
let root: HTMLElement | null = null;
export const DETAILS_END = 7.6; // D-174: states 6 → 8 (sections.ts), the fall and fit get 2 more screens
/** D-173: the camera follows the ring off the edge; the table goes up and out of the frame */
const FOLLOW: [number, number] = [2.55, 3.75];
/** the hand rises from below while the ring is still falling */
const HAND: [number, number] = [4.3, 6.0];
/** the ring meets the fingertip and turns side-on to the finger */
const MEET: [number, number] = [4.7, 6.0];
/** onto the finger and down to the seat */
const SLIDE: [number, number] = [5.6, 6.7];
/** heading + body, after the ring has seated */
const TEXT: [number, number] = [6.85, 7.2];
/** D-174: zero velocity at both ends (smootherstep), for the joins between phases */
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const D2R = Math.PI / 180;

/** layout in px: table, ring, roll stops, hand box (s06-pose.json image px × hs) */
function layout(ctx: Ctx) {
  const W = window.innerWidth;
  const H = view.h;
  const m = ctx.mobile;
  const sy = H / 900;
  const s = Math.min(W / 1440, sy);
  const tx = W / 2; // table right edge (Figma x 720)
  const ty = m ? H * 0.6 : 600 * sy; // table top (back edge)
  const contact = ty + 0.47 * (H - ty); // where the ring stands (Figma y ≈ 741)
  const D = m ? Math.min(W * 0.42, H * 0.22) : 316 * s; // ring diameter (Figma 316)
  // D-145: one roll from the left edge of the screen (the ring just touching it) to the table edge
  const x0 = D / 2;
  const x2 = tx - 0.04 * D; // State 3: at the edge
  const x1 = lerp(x0, x2, 0.5); // the still for reduced motion / no WebGL
  // hand A-1 (579 × 1198 img px). Figma Hand C: A-1 at 0.807 of 900 px, seat (343, 360) at (723, 696)
  const hs = m ? (0.45 * H) / 844 : 0.807 * sy;
  const seatX = m ? W / 2 + 6 : W / 2 + 3 * s;
  const seatY = m ? H * 0.66 : 696 * sy;
  const hx = seatX - 343 * hs;
  const hy = seatY - 360 * hs; // the photo's bottom = seatY + 838 hs, always below the screen
  return { W, H, s, tx, ty, contact, D, x0, x1, x2, hs, hx, hy, seat: { x: seatX, y: seatY } };
}
type L6 = ReturnType<typeof layout>;

let lastKey = '';
function setVars(ctx: Ctx) {
  const L = layout(ctx);
  const key = `${L.W}x${L.H}${ctx.mobile}`;
  if (key === lastKey || !root) return L;
  lastKey = key;
  root.style.setProperty('--hx', `${L.hx.toFixed(1)}px`);
  root.style.setProperty('--hy', `${L.hy.toFixed(1)}px`);
  root.style.setProperty('--hs', L.hs.toFixed(4));
  // the fingertip (img px 23): phones centre "Then, it just fit." above it (D-192)
  root.style.setProperty('--tip', `${(L.seat.y - 337 * L.hs).toFixed(1)}px`);
  root.style.setProperty('--ty', `${L.ty.toFixed(1)}px`);
  root.style.setProperty('--tx', `${L.tx.toFixed(1)}px`);
  // reduced motion / no WebGL: the polished still (fb-s02, ring 84.6% of the image height) on the table
  const fbw = L.D / 0.846;
  root.style.setProperty('--fbw', `${fbw.toFixed(1)}px`);
  root.style.setProperty('--fbx', `${(L.x1 - 0.528 * fbw).toFixed(1)}px`);
  root.style.setProperty('--fby', `${(L.contact - 0.918 * fbw).toFixed(1)}px`);
  return L;
}

/** px (from the top-left) → pose fractions (from the centre, y up) */
const fx = (px: number, W: number) => px / W - 0.5;
const fy = (py: number, H: number) => 0.5 - py / H;

/**
 * the hand's offset from its final place (px). Figma: at A / B it rises right of the table (≈ +255 px
 * at 1440), fingertip near the bottom (B ≈ 84% of the height); at C it is home (offset 0), so the
 * ring falls down and right from the corner onto the fingertip, then hand and ring settle together.
 */
function handOff(u: number, L: L6, _m: boolean) {
  // D-173: straight up from below the screen to its final place, easing out (it meets the ring there)
  const tipY = L.seat.y - 337 * L.hs; // fingertip (img px 23) at the final place
  const below = L.H - tipY + 40; // fingertip just under the bottom edge
  const t = seg(u, HAND[0], HAND[1]);
  const e = 1 - Math.pow(1 - t, 3);
  return { dx: 0, dy: lerp(below, 0, e) };
}
/** shift a finger pose by the hand's offset (ring and finger proxy move with the hand) */
function withHand(p: Pose, off: { dx: number; dy: number }, L: L6): Pose {
  return { ...p, x: p.x + off.dx / L.W, y: p.y - off.dy / L.H, fx: p.fx + off.dx / L.W, fy: p.fy - off.dy / L.H };
}

/** upright, opening to the camera (pose 0/0/0); "Stillway" on the band turns with the roll */
const UP = { rx: 0, ry: 0, rz: 0 };
const TIP = 40 * D2R; // how far it tips over the corner before it lets go

/** ring centre x on the table for u in 0..2: one smooth roll from the left edge to the table edge */
function rollX(u: number, L: L6) {
  return lerp(L.x0, L.x2, seg(u, 0, 2));
}

/** the rolling ring (u ≤ 2) and the tip over the corner (2 → 2.55): centre and spin */
function onTable(u: number, _ctx: Ctx, L: L6) {
  const r = L.D / 2;
  const x = rollX(Math.min(u, 2), L);
  let cx = x;
  let cy = L.contact - r;
  let spin = -(x - L.x0) / r; // rolling without slip, clockwise to the right
  // tip: roll the last bit to the corner, then turn about the corner
  const reach = seg(u, 2, 2.2);
  const tip = seg(u, 2.15, 2.55);
  if (u > 2) {
    const toEdge = lerp(x, L.tx, reach);
    spin = -(toEdge - L.x0) / r;
    const th = TIP * tip;
    cx = L.tx + r * Math.sin(th) - (L.tx - toEdge);
    cy = L.contact - r * Math.cos(th);
    spin -= th;
  }
  return { cx, cy, spin };
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
 * 06 → 07 (D-192, replaces the plain scroll of D-147): x = 0..1 of the connection. The hand with the
 * ring on it slides down and out, "Then, it just fit." slides up and out, both fading; all of it is
 * gone at 60%, then "Through the day." fades in (specs.ts). Transform and opacity only, and a pure
 * function of the scroll, so it plays the same backwards.
 */
const SPECS_TIN = sections.find((d) => d.id === 'specs')!.tin;
const LEAVE = {
  move: (x: number) => seg(x, 0, 0.62),
  o: (x: number) => 1 - seg(x, 0.1, 0.6),
  /** travel, fractions of the screen height: the fingertip (≈ 48%) ends below the screen */
  hand: 0.5,
  text: 0.18,
};

/** the 3D ring leaves with the hand (it is not part of the photo): the pose stays the seated one and
 * the whole canvas (ring, finger proxy, contact shadow) is moved and faded by exactly what the photo
 * is, so nothing can slide against the finger */
export function detailsLeaveRing(x: number, ctx: Ctx): Pose {
  const L = layout(ctx);
  const p = fingerPose(1, L, { shadow: 0, skin: 1 });
  if (ctx.reduced) return { ...p, alpha: 1 - seg(x, 0.3, 0.6) };
  return { ...p, drop: LEAVE.move(x) * LEAVE.hand * L.H, alpha: LEAVE.o(x) };
}

/** the pine table GLB (D-146) in the ring stage: at the same contact line and scale as the ring */
/** D-173: how far the camera has moved down with the ring (px): the table goes up by this much */
function followUp(u: number, L: L6) {
  const t = seg(u, FOLLOW[0], FOLLOW[1]);
  return t * t * (3 - 2 * t) * 1.25 * L.H;
}

function tableOf(u: number, L: L6): Partial<Pose> {
  // 05 → 06: the table rises from below with the Paper ground and arrives exactly when the ring
  // lands on it (ringIn reaches the State 1 pose at 85% of the connection = u −0.15)
  const rise = seg(u, -0.55, -0.15);
  // D-173: the camera follows the falling ring, so the table goes UP and out of the frame
  const up = followUp(u, L);
  const out = seg(u, FOLLOW[0] + 0.35, FOLLOW[1]);
  return {
    table: Math.min(1, rise * 2.5) * (1 - out),
    tableD: L.D,
    tableY: fy(L.contact + (1 - rise) * 0.5 * L.H - up, L.H),
    tableShadow: u < 0 ? seg(u, -0.2, -0.05) : u <= 2.6 ? 1 - seg(u, 2.1, 2.45) : 0,
  };
}

function ringPose(u: number, ctx: Ctx, L: L6): Pose {
  const base = (cx: number, cy: number, spin: number, extra: Partial<Pose> = {}) =>
    pose({ x: fx(cx, L.W), y: fy(cy, L.H), w: L.D / L.W, ...UP, spin, ...extra });
  if (u <= 2.55) {
    const t = onTable(Math.max(0, u), ctx, L);
    return base(t.cx, t.cy, t.spin);
  }
  // D-173/D-174 (oryzo.ai): the camera follows the fall; one continuous motion to the seat.
  // Position: corner → (dip, re-centre) → the air → the fingertip of the rising hand → the seat.
  // Rotation: from the roll, the ring carries its momentum into a tumble whose angular velocity
  // decays steadily (no per-frame turn rounding) and reaches the finger's orientation at the
  // fingertip; the slide to the seat starts before the approach ends, so it never stops at the tip.
  const from = onTable(2.55, ctx, L);
  const m = ctx.mobile;
  const off = handOff(u, L, m);
  const airW = (L.D * (m ? 1.25 : 1.12)) / L.W;
  // position in the air: centred, drifting down slowly (it keeps falling while the hand comes up)
  const airX = L.W / 2;
  const airY = L.H * (m ? 0.36 : 0.4) + smoother(seg(u, FOLLOW[1] - 0.4, MEET[1])) * L.H * 0.1;
  // the follow: off the corner, a soft dip (the fall reads), the frame catches up and centres it
  const t = seg(u, FOLLOW[0], FOLLOW[1]);
  const e = smoother(t);
  const dip = Math.sin(Math.PI * t) * 0.09 * L.H;
  let cx = lerp(from.cx, airX, e) + Math.sin(Math.PI * t) * 0.12 * L.D;
  let cy = lerp(from.cy, airY, e) + dip;
  let w = lerp(L.D / L.W, airW, e);
  // the approach and the slide, with the hand
  const slide = smoother(seg(u, SLIDE[0], SLIDE[1]));
  const tip = withHand(fingerPose(slide, L, { shadow: 0 }), off, L);
  const b = smoother(seg(u, MEET[0], MEET[1]));
  const tipX = (tip.x + 0.5) * L.W;
  const tipY = (0.5 - tip.y) * L.H;
  cx = lerp(cx, tipX, b);
  cy = lerp(cy, tipY, b);
  w = lerp(w, tip.w, b);
  // rotation: S + (T − S)·(1 − (1 − τ)^1.8) over the whole fall; T is the finger's pose with whole
  // extra turns fixed once (from the spin at the corner), so the direction never reverses
  const tau = seg(u, FOLLOW[0], MEET[1]);
  const k = 1 - Math.pow(1 - tau, 1.8);
  const TAU = 2 * Math.PI;
  const spinT = Math.floor(from.spin / TAU) * TAU - TAU; // keeps turning the way it rolled
  const rot = {
    rx: lerp(0, tip.rx, k),
    ry: lerp(0, tip.ry - TAU, k),
    rz: lerp(0, tip.rz, k),
    spin: lerp(from.spin, spinT, k),
    pitch: lerp(0, tip.pitch, k),
    roll: lerp(0, tip.roll, k),
  };
  // past the seat the same formula holds (k = b = slide = 1): no change of representation in S06
  return {
    ...tip,
    ...rot,
    x: fx(cx, L.W),
    y: fy(cy, L.H),
    w,
    // the finger proxy (occlusion) is on once the ring is over the fingertip, before it goes round it
    fing: b > 0.5 ? 1 : 0,
    // QA27 D-01: the hand's light comes onto the ring as it nears the finger, full once it is seated
    skin: b * (0.4 + 0.6 * slide),
  };
}

export const details: SectionMotion = {
  init(r) {
    root = r;
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = {
      table: q('[data-d-table]'),
      shadow: q('[data-d-shadow]'),
      card: q('[data-d-card]'),
      hand: q('[data-d-hand]'),
      ringed: q('[data-d-ringed]'),
      head: q('[data-d-head]'),
      fits: q('[data-d-fits]'),
      progress: q('[data-d-progress]'),
      fb: q('[data-d-fb]'),
    };
    steps = [...r.querySelectorAll<HTMLElement>('[data-d-step]')];
    ticks = [...r.querySelectorAll<HTMLElement>('[data-d-tick]')];
  },
  update(u, ctx) {
    const L = setVars(ctx);
    // 06 → 07 (D-192): the hand goes down, the text goes up, both fade (reduced motion: a fade only)
    const x = clamp01((u - DETAILS_END) / SPECS_TIN);
    const kept = ctx.reduced ? 1 - seg(u, DETAILS_END, DETAILS_END + 0.3) : LEAVE.o(x);
    const move = ctx.reduced ? 0 : LEAVE.move(x) * L.H;
    // the table: in with the end of the connection, out once the ring is in the hand
    // (the CSS stand-in table, until the GLB is in) rises with the same timing as the GLB table
    const tableIn = ctx.reduced ? (u >= -0.5 ? 1 : 0) : seg(u, -0.55, -0.15);
    const out = ctx.reduced ? (u >= 3 ? 1 : 0) : seg(u, FOLLOW[0] + 0.35, FOLLOW[1]);
    put(el.table, { o: Math.min(1, tableIn * 2.5) * (1 - out), y: (1 - tableIn) * 0.5 * L.H - followUp(u, L) }, ctx);
    // contact shadow (Figma 300 × 30 under the 316 ring): follows the roll, fades as it tips
    if (el.shadow) {
      const t = onTable(Math.max(0, Math.min(u, 2.6)), ctx, L);
      const sw = 0.95 * L.D;
      const sh = 0.095 * L.D;
      el.shadow.style.width = `${sw.toFixed(1)}px`;
      el.shadow.style.height = `${sh.toFixed(1)}px`;
      el.shadow.style.transform = `translate3d(${(t.cx - sw / 2).toFixed(1)}px, ${(L.contact - (L.ty - 30) - sh / 2 - followUp(u, L)).toFixed(1)}px, 0)`;
      el.shadow.style.opacity = (1 - seg(u, 2.1, 2.45)).toFixed(3);
    }

    // text: headline (State 1), the two steps (States 2, 3), then "Then, it just fit." on top —
    // faint at A, clearer at B, full at C
    put(el.head, { o: window4(u, ctx.reduced ? -0.5 : -0.3, 0.05, 0.5, 0.72), y: (1 - seg(u, -0.3, 0.05)) * 16 }, ctx);
    steps.forEach((st, i) => {
      const a = 0.75 + i;
      put(st, { o: window4(u, a, a + 0.25, a + 0.75, a + 0.96), y: (1 - seg(u, a, a + 0.25)) * 14 }, ctx);
    });
    // D-173: hidden through the fall and the fitting; in once the ring has seated
    const fits = ctx.reduced ? (u >= 7 ? 1 : 0) : seg(u, TEXT[0], TEXT[1]);
    put(el.fits, { o: fits * kept, y: (1 - fits) * 16 - move * LEAVE.text }, ctx);
    put(el.progress, { o: window4(u, -0.3, 0.05, 2.4, 2.6) }, ctx);
    const on = Math.min(3, Math.max(0, Math.round(u)));
    ticks.forEach((t, i) => t.classList.toggle('is-on', i === on));

    // the hand rises from below the screen right of the table (fingertip in view at A), the ring
    // lands on it (B), then both settle at the final place (C)
    const rise = seg(u, HAND[0], HAND[1]);
    const off = handOff(u, L, ctx.mobile);
    // D-093 r1: the polished 3D ring stays on the finger (D-085); A-1b only without WebGL / reduced
    const live = document.documentElement.classList.contains('ring-ready');
    if (el.ringed) el.ringed.style.opacity = live ? '0' : seg(u, 6.6, 6.9).toFixed(3);
    if (el.card) put(el.card, { o: (ctx.reduced ? (u >= 5 ? 1 : 0) : rise > 0 ? 1 : 0) * kept, y: move * LEAVE.hand }, ctx);
    put(el.hand, { o: 1, x: off.dx, y: off.dy }, ctx);
    // D-173, reduced motion / no WebGL: the still follows the fall — centred in the air (state 3), then
    // over the fingertip as the hand comes up (state 4); A-1b (ring on the hand) takes over at the seat
    if (el.fb && !live) {
      const fbw = L.D / 0.846;
      const c0x = L.x1 - 0.528 * fbw + fbw / 2;
      const c0y = L.contact - 0.918 * fbw + fbw / 2;
      // reduced motion snaps u to whole states: 3–4 the ring alone in the air, 5–6 over the fingertip
      const airK = ctx.reduced ? (u >= 3 ? 1 : 0) : seg(u, 2.2, 3.6);
      const tipK = ctx.reduced ? (u >= 5 ? 1 : 0) : seg(u, 4.6, 6);
      const tipY = L.seat.y - 337 * L.hs + (ctx.reduced ? 0 : off.dy) - 0.5 * L.D; // reduced: the photo has no offset
      const cx = lerp(lerp(c0x, L.W / 2, airK), L.seat.x, tipK);
      const cy = lerp(lerp(c0y, L.H * (ctx.mobile ? 0.36 : 0.4), airK), tipY, tipK);
      const sc = lerp(lerp(1, 1.12, airK), 0.55, tipK);
      el.fb.style.transform = `translate3d(${(cx - c0x).toFixed(1)}px, ${(cy - c0y).toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
    }
  },
  ring(u, ctx) {
    const L = layout(ctx);
    return { ...ringPose(u, ctx, L), ...tableOf(u, L) };
  },
  // 05 → 06 (Storyboard §3): the camera backs out of the ring — it shrinks (geometric, so it reads
  // as distance) and lands on the table on the left
  ringIn(x, ctx, from, to) {
    const t = seg(x, 0.05, 0.85);
    const p = lerpPose(from, to, t);
    p.w = from.w * Math.pow(to.w / from.w, t);
    p.warm = from.warm * (1 - seg(x, 0.2, 0.6));
    // the table is not lerped from S05 (it has none): it rises on its own and meets the ring
    return { ...p, ...tableOf(x - 1, layout(ctx)) };
  },
};

/** S06 first frame for the incoming connection (ring upright on the table) */
export const detailsStart = (ctx: Ctx) => details.ring!(0, ctx);
