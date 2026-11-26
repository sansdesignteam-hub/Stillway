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
 *  D-173 (oryzo.ai, the falling object): from the corner the camera follows the ring down —
 *  2.55 → 3.2  it drops off the edge; the frame re-centres on it while the table goes up and out of the
 *              picture (the ring keeps falling, it never fades: one ring from the roll to the finger)
 *  3.2 → 3.6   the ring alone, turning in the air, the focus of the frame
 *  3.35 → 4.45 the hand (photo A-1) rises from below while the ring is still coming down; the ring slows
 *              and turns side-on to the index finger, over the fingertip
 *  4.45 → 5    it passes the fingertip and slides down to the seat (onFinger pose, finger proxy)
 *  5 → 5.3     "Then, it just fit." and the S06 body appear (hidden through the fall); (D-157: no tag)
 *  > END to S07 (specs.ts drives the card shrink through this module's update)
 * The hand photo's cut bottom is always below the viewport (and melted into Paper), on every screen.
 */
import { put, seg, lerp, clamp01, window4, type Ctx } from '../anim';
import { lerpPose, pose, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { sections } from '../../content/sections';

let el: Record<string, HTMLElement | null> = {};
let steps: HTMLElement[] = [];
let ticks: HTMLElement[] = [];
let root: HTMLElement | null = null;
export const DETAILS_END = 5.6;
/** D-173: the camera follows the ring off the edge; the table goes up and out of the frame */
const FOLLOW: [number, number] = [2.55, 3.2];
/** the hand rises from below while the ring is still falling */
const HAND: [number, number] = [3.35, 4.45];
/** the ring meets the fingertip and turns side-on to the finger */
const MEET: [number, number] = [3.55, 4.45];
/** onto the finger and down to the seat */
const SLIDE: [number, number] = [4.45, 5];
/** heading + body, after the ring has seated */
const TEXT: [number, number] = [5, 5.3];
const D2R = Math.PI / 180;

/** layout in px: table, ring, roll stops, hand box (s06-pose.json image px × hs) */
function layout(ctx: Ctx) {
  const W = window.innerWidth;
  const H = window.innerHeight;
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
 * 06 → 07 (D-147): a plain scroll, like 02 → 03 — the hand with the 3D ring on it and
 * "Then, it just fit." go up 1:1 with the page, no fade, blur or scale. The connection is long
 * enough (S07 tin) for the whole photo to leave; its melted bottom keeps the cut out of sight.
 */
const SPECS_TIN = sections.find((d) => d.id === 'specs')!.tin;
let vhPx = 0;
const measureVh = () => (vhPx = (document.querySelector('[data-vh]') as HTMLElement | null)?.offsetHeight || window.innerHeight);

/** the 3D ring on the finger goes up with the hand (it is not part of the photo) */
export function detailsLeaveRing(x: number, ctx: Ctx): Pose {
  const L = layout(ctx);
  const p = fingerPose(1, L, { shadow: 0 });
  if (!vhPx) measureVh();
  const up = ctx.reduced ? 0 : (x * SPECS_TIN * vhPx) / L.H; // fraction of the height, y up
  // QA G-14: the ring (WebGL, not under the CSS fade) is gone before it reaches the navbar
  const fromTop = (0.5 - (p.y + up)) * L.H;
  return { ...p, y: p.y + up, fy: p.fy + up, alpha: ctx.reduced ? 1 - seg(x, 0.3, 0.6) : seg(fromTop, 80, 180) };
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
  // D-173 (oryzo.ai): the camera follows the fall. The ring leaves the corner, dips down and is
  // re-centred as the frame follows it; it turns in the air, alone; then the hand comes up under it,
  // the ring slows, turns side-on to the index finger and slides down to the seat.
  const from = onTable(2.55, ctx, L);
  const m = ctx.mobile;
  const airW = (L.D * (m ? 1.25 : 1.12)) / L.W;
  const air = (uu: number) => {
    const a = uu - 2.55;
    return pose({
      x: fx(L.W / 2, L.W),
      y: fy(L.H * (m ? 0.36 : 0.4) + seg(uu, 3.2, 4.2) * L.H * 0.06, L.H), // drifts down a little
      w: airW,
      rx: -0.35 * Math.sin(a * 1.6),
      ry: a * 2.1,
      rz: 0.25 * Math.sin(a * 1.1),
      spin: from.spin - a * 1.4,
    });
  };
  const start = base(from.cx, from.cy, from.spin);
  let p: Pose;
  if (u < FOLLOW[1]) {
    // off the corner: down first (the fall reads), then the frame catches up and centres it
    const t = seg(u, FOLLOW[0], FOLLOW[1]);
    const e = t * t * (3 - 2 * t);
    p = lerpPose(start, air(u), e);
    const dip = Math.sin(Math.PI * Math.min(1, t * 1.2)) * 0.16 * L.H;
    p.y -= dip / L.H;
    p.x += (Math.sin(Math.PI * t) * 0.15 * L.D) / L.W;
  } else {
    p = air(u);
  }
  const k = seg(u, MEET[0], MEET[1]);
  if (k > 0 && u < SLIDE[0]) {
    // the hand is rising; the ring comes down to its fingertip and turns side-on, slowing
    const above = withHand(fingerPose(0, L, { fing: 0, shadow: 0 }), handOff(u, L, m), L);
    const e = 1 - Math.pow(1 - k, 2.2);
    const turns = Math.round(p.spin / (2 * Math.PI)) * 2 * Math.PI;
    return { ...lerpPose(p, { ...above, spin: turns }, e), fing: 0 };
  }
  if (u >= SLIDE[0]) {
    const slide = seg(u, SLIDE[0], SLIDE[1]);
    const q = withHand(fingerPose(slide, L, { shadow: 0 }), handOff(u, L, m), L);
    return slide < 0.02 ? { ...q, fing: 0 } : q;
  }
  return p;
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
      seatShadow: q('[data-d-seat]'),
      head: q('[data-d-head]'),
      fits: q('[data-d-fits]'),
      progress: q('[data-d-progress]'),
      fb: q('[data-d-fb]'),
    };
    steps = [...r.querySelectorAll<HTMLElement>('[data-d-step]')];
    measureVh();
    window.addEventListener('resize', measureVh);
    ticks = [...r.querySelectorAll<HTMLElement>('[data-d-tick]')];
  },
  update(u, ctx) {
    const L = setVars(ctx);
    // 06 → 07 (D-147): everything still on screen goes up with the page, 1:1 (reduced motion fades)
    const up = ctx.reduced ? 0 : Math.max(0, u - DETAILS_END) * vhPx;
    const gone = ctx.reduced ? seg(u, DETAILS_END, DETAILS_END + 0.3) : 0;
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
    const fits = ctx.reduced ? (u >= 5 ? 1 : 0) : seg(u, TEXT[0], TEXT[1]);
    put(el.fits, { o: fits * (1 - gone), y: (1 - fits) * 16 - up }, ctx);
    put(el.progress, { o: window4(u, -0.3, 0.05, 2.4, 2.6) }, ctx);
    const on = Math.min(3, Math.max(0, Math.round(u)));
    ticks.forEach((t, i) => t.classList.toggle('is-on', i === on));

    // the hand rises from below the screen right of the table (fingertip in view at A), the ring
    // lands on it (B), then both settle at the final place (C)
    const rise = seg(u, HAND[0], HAND[1]);
    const off = handOff(u, L, ctx.mobile);
    // D-093 r1: the polished 3D ring stays on the finger (D-085); A-1b only without WebGL / reduced
    const live = document.documentElement.classList.contains('ring-ready');
    if (el.ringed) el.ringed.style.opacity = live ? '0' : seg(u, 4.8, 5).toFixed(3);
    put(el.seatShadow, { o: live ? seg(u, SLIDE[1] - 0.2, SLIDE[1]) : 0 }, ctx);
    if (el.card) put(el.card, { o: (ctx.reduced ? (u >= 3 ? 1 : 0) : rise > 0 ? 1 : 0) * (1 - gone), y: -up }, ctx);
    put(el.hand, { o: 1, x: off.dx, y: off.dy }, ctx);
    // D-173, reduced motion / no WebGL: the still follows the fall — centred in the air (state 3), then
    // over the fingertip as the hand comes up (state 4); A-1b (ring on the hand) takes over at the seat
    if (el.fb && !live) {
      const fbw = L.D / 0.846;
      const c0x = L.x1 - 0.528 * fbw + fbw / 2;
      const c0y = L.contact - 0.918 * fbw + fbw / 2;
      const airK = seg(u, 2.2, 3);
      const tipK = seg(u, 3.4, 4);
      const tipY = L.seat.y - 337 * L.hs + off.dy - 0.5 * L.D;
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
