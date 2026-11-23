/**
 * S04 Activity & rest — Day arc, 07:40 → 15:30 · Night + a soft light lower left (D-138, Figma Design
 * 40004245:50; light colour D-139).
 * u: -TIN..0  connection from S03, the "lens" (x = 0..1 of it; Figma 03→04 State A–D):
 *        A  0%   S03 scrolls up and out (sleep.ts); the ring moves to the centre and turns to face the
 *                camera; a dawn light rises from below (D-139: --cocoa-300); clock 23:10 → 05:30
 *        B  40%  the ring is centred and grows ×1.1 → ×1.6; the 07:40 photo shows in its opening
 *                (a rounded pill) and grows with it, as if the camera comes closer
 *        C  60%  the lens opens: the ring grows past the screen (×4), blurs (28 px) and fades; the
 *                photo shrinks into the 264 × 352 card (radius 220 → 12) at the top of the arc
 *        D  100% = State 1: 09:00 and 10:30 come in along the arc, title + paragraph and the big
 *                07:40 rise in; navbar clock 05:30 → 07:40
 *  0..4  State 1–5: the arc turns left 12° per photo (scrub; centre 720 / 1758, R 1340 at 1440 × 900);
 *        the next photo rises to the top and grows, the last one goes down left and dims; the big
 *        time rolls digit by digit, the status and the navbar clock change with an upward move
 *  > END connection to S05: the arc goes down out of the screen, then the ring rises from below
 *        (insight.ts ringIn)
 * Phones (no Figma frame, proposal): the same arc, smaller (active card 200 wide, R 860 at 390),
 * active card centred a little above the middle, big time under it; the paragraph is hidden.
 */
import { put, seg, clamp01, lerp, type Ctx } from '../anim';
import { pose, lerpPose, type Pose } from '../ring/poses';
import { insightStart } from './insight';
import { S03_WARM } from './sleep';
import { sections } from '../../content/sections';
import { keepLit, LIGHT, type GlowEllipse } from '../glow';
import type { SectionMotion } from '../story';

const TIN = sections.find((d) => d.id === 'activity')!.tin;
const END = 4.6;
const STEP = (12 * Math.PI) / 180;

let root: HTMLElement;
let cards: HTMLElement[] = [];
let labels: HTMLElement[] = [];
let digitStrips: HTMLElement[] = [];
let lines: HTMLElement[] = [];
let times: string[] = [];
let el: Record<string, HTMLElement | null> = {};

/** layout of the arc for the current viewport (px) */
let L = { W: 1440, H: 900, s: 1, cw: 264, ch: 352, R: 1340, cx: 720, yc: 418, labelOff: 140, nowTop: 616, mobile: false };
function measure(mobile: boolean) {
  const W = window.innerWidth;
  const H = (document.querySelector('[data-vh]') as HTMLElement | null)?.offsetHeight || window.innerHeight;
  if (mobile) {
    // proposal: active card 200 × 266 at 390, neighbours half in view at the edges
    const s = Math.min((0.758 * W) / 390, (0.758 * H) / 844);
    const R = (860 * W) / 390;
    const yc = 0.43 * H;
    L = { W, H, s, cw: 264 * s, ch: 352 * s, R, cx: W / 2, yc, labelOff: 140 * s, nowTop: yc + (352 * s) / 2 + 16, mobile };
  } else {
    const s = Math.min(W / 1440, H / 900);
    const yc = H / 2 + (418 - 450) * s;
    L = { W, H, s, cw: 264 * s, ch: 352 * s, R: 1340 * s, cx: W / 2, yc, labelOff: 140 * s, nowTop: yc + (352 * s) / 2 + 22 * s, mobile };
  }
  root.style.setProperty('--cw', `${L.cw.toFixed(1)}px`);
  root.style.setProperty('--ch', `${L.ch.toFixed(1)}px`);
  if (el.orbit) {
    el.orbit.style.width = el.orbit.style.height = `${(2 * L.R).toFixed(1)}px`;
  }
}

/** opacity of a card d steps from the top (Figma: future +1 .8, +2 .5; past −1 .55, −2 .28) */
function cardO(d: number) {
  const a = Math.abs(d);
  const pts = d >= 0 ? [1, 0.8, 0.5, 0] : [1, 0.55, 0.28, 0];
  if (a >= 3) return 0;
  const i = Math.floor(a);
  return lerp(pts[i], pts[i + 1], a - i);
}

/** arc position (float index of the photo at the top) for u in S04 */
const arcP = (u: number) => {
  const c = Math.min(4, Math.max(0, u));
  const i = Math.min(3, Math.floor(c));
  return c >= 4 ? 4 : i + seg(c - i, 0.15, 0.85);
};

/**
 * Lights in the 1440 × 900 frame, at the places of the Figma S04 "Ember glow" (lower left) and the
 * 03→04 "Dawn glow" (rising from below), in the one light colour of the dark sections (D-139,
 * --cocoa-300, no wedge); the Figma night shade (upper right) stays.
 */
const EMBER: GlowEllipse[] = [
  { token: LIGHT, cx: 250, cy: 900, rx: 950, ry: 650, stops: [[0, 0.3]], power: 1.8 },
  { token: '--night', cx: 1500, cy: 100, rx: 600, ry: 400, stops: [[0, 0.8], [1, 0]], smooth: true },
];
const DAWN: GlowEllipse[] = [{ token: LIGHT, cx: 720, cy: 1060, rx: 950, ry: 500, stops: [[0, 0.28]], power: 1.8 }];

/** the lens pill relative to the screen centre, in 1440 frame px (Figma B and C) */
const LENS = {
  B: { dx: 130, dy: 22, h: 330, r: 125 },
  C: { dx: 102, dy: 5, h: 494, r: 141 },
};

/** opacity only (the arc writes its own transforms); hidden at 0 like anim.ts put */
function setO(it: HTMLElement, o: number) {
  const v = o.toFixed(3);
  if (it.style.opacity !== v) it.style.opacity = v;
  const vis = o < 0.002 ? 'hidden' : '';
  if (it.style.visibility !== vis) it.style.visibility = vis;
}

function place(it: HTMLElement, x: number, y: number, rot: number, scale: number, o: number, radius: number, border: number) {
  it.style.transform = `translate3d(${(x - L.cw / 2).toFixed(1)}px, ${(y - L.ch / 2).toFixed(1)}px, 0) rotate(${rot.toFixed(4)}rad) scale(${scale.toFixed(4)})`;
  it.style.borderRadius = `${radius.toFixed(1)}px`;
  it.style.setProperty('--b', border.toFixed(3));
  setO(it, o);
}

export const activity: SectionMotion = {
  init(r) {
    root = r;
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    cards = [...r.querySelectorAll<HTMLElement>('[data-a-card]')];
    labels = [...r.querySelectorAll<HTMLElement>('[data-a-label]')];
    digitStrips = [...r.querySelectorAll<HTMLElement>('[data-a-dg]')];
    lines = [...r.querySelectorAll<HTMLElement>('[data-a-sline]')];
    times = cards.map((c) => c.dataset.time!);
    el = { glow: q('[data-a-glow]'), dawn: q('[data-a-dawn]'), orbit: q('[data-a-orbit]'), intro: q('[data-a-intro]'), now: q('[data-a-now]') };
    const mq = window.matchMedia('(max-width: 719px)');
    measure(mq.matches);
    window.addEventListener('resize', () => measure(mq.matches));
    mq.addEventListener('change', () => measure(mq.matches));
    const glow = el.glow as HTMLCanvasElement | null;
    const dawn = el.dawn as HTMLCanvasElement | null;
    if (glow) keepLit(glow, () => ({ ellipses: EMBER }));
    if (dawn) keepLit(dawn, () => ({ ellipses: DAWN }));
  },
  update(u, ctx) {
    if (L.mobile !== ctx.mobile) measure(ctx.mobile);
    const x = u < 0 ? clamp01((u + TIN) / TIN) : 1; // incoming connection progress
    const xo = Math.max(0, u - END); // outgoing connection (u past the end)
    const down = seg(xo, 0, 0.55) * L.H * 0.95; // the arc goes down out of the screen
    const uiOut = 1 - seg(xo, 0, 0.3);

    // glows: Dawn rises from below in A–B and hands over to the S04 Ember glow + night shade
    put(el.dawn, { o: seg(x, 0.08, 0.32) * (1 - seg(x, 0.62, 0.95)), y: (1 - seg(x, 0.05, 0.42)) * L.H * 0.5 }, ctx);
    put(el.glow, { o: seg(x, 0.5, 0.9) * (1 - seg(xo, 0.25, 0.7)) }, ctx);

    // arc position: in the lens the waiting cards come in along the arc (from further round)
    const p = u < 0 ? -1.6 * (1 - seg(x, 0.62, 1)) : arcP(u);
    const enter = seg(x, 0.62, 0.92);
    const cy = L.yc + L.R + down;
    if (el.orbit) {
      el.orbit.style.transform = `translate3d(${(L.cx - L.R).toFixed(1)}px, ${(cy - L.R).toFixed(1)}px, 0)`;
      setO(el.orbit, seg(x, 0.7, 1) * uiOut);
    }

    cards.forEach((c, k) => {
      const d = k - p;
      const th = d * STEP;
      const ad = Math.min(1, Math.abs(d));
      let cxk = L.cx + L.R * Math.sin(th);
      let cyk = cy - L.R * Math.cos(th);
      let sc = lerp(1, 176 / 264, ad);
      let rad = lerp(12, 15, ad) * L.s; // 10 px at the small size
      let o = cardO(d) * (k === 0 ? 1 : enter);
      let rot = th;
      let border = 1 - ad;
      if (k === 0 && x < 1) {
        // the lens: pill in the ring's opening (B), larger (C), then the card on the arc (D)
        // phones: the pill fits the smaller ring opening, closer to its centre
        const sx = L.mobile ? (L.s / 0.758) * 0.62 : L.s;
        const ox = L.mobile ? 0.3 : 1;
        const B = { x: L.W / 2 + LENS.B.dx * sx * ox, y: L.H / 2 + LENS.B.dy * sx, sc: (LENS.B.h * sx) / L.ch, r: LENS.B.r * sx };
        const C = { x: L.W / 2 + LENS.C.dx * sx * ox, y: L.H / 2 + LENS.C.dy * sx, sc: (LENS.C.h * sx) / L.ch, r: LENS.C.r * sx };
        // D = the top of the arc (State 1), whatever the waiting cards are doing
        const D = { x: L.cx, y: cy - L.R, sc: 1, r: 12 * L.s };
        const t1 = seg(x, 0.2, 0.4);
        const t2 = seg(x, 0.4, 0.6);
        const t3 = seg(x, 0.6, 1);
        let g;
        if (x < 0.4) g = { x: B.x, y: B.y, sc: B.sc * lerp(0.55, 1, t1), r: B.r };
        else if (x < 0.6) g = { x: lerp(B.x, C.x, t2), y: lerp(B.y, C.y, t2), sc: lerp(B.sc, C.sc, t2), r: lerp(B.r, C.r, t2) };
        else g = { x: lerp(C.x, D.x, t3), y: lerp(C.y, D.y, t3), sc: lerp(C.sc, D.sc, t3), r: lerp(C.r, D.r, t3) };
        cxk = g.x;
        cyk = g.y;
        sc = g.sc;
        rad = g.r / g.sc; // radius in the card's own (unscaled) px
        o = seg(x, 0.2, 0.34);
        rot = 0;
        border = 1;
      } else {
        rad = rad / sc;
      }
      place(c, cxk, cyk, rot, sc, o, rad, border);

      // the time label under each waiting card, along its radius
      const lb = labels[k];
      if (lb) {
        const lx = cxk - L.labelOff * Math.sin(th);
        const ly = cyk + L.labelOff * Math.cos(th);
        lb.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${th.toFixed(4)}rad)`;
        setO(lb, k === 0 && x < 1 ? 0 : cardO(d) * ad * (k === 0 ? 1 : enter));
      }
    });

    // title, paragraph and the big time rise in at D; they leave with the arc
    const rise = seg(x, 0.78, 1);
    put(el.intro, { o: rise * uiOut, y: 24 * (1 - rise) }, ctx);
    if (el.now) {
      el.now.style.left = `${L.cx.toFixed(1)}px`;
      el.now.style.top = `${(L.nowTop + down).toFixed(1)}px`;
      el.now.style.translate = '-50% 0';
    }
    put(el.now, { o: rise * uiOut, y: 24 * (1 - rise) }, ctx);

    // big time: each digit rolls forward from the last time to the next with the scroll (9 → 0 is one
    // step, through a second 0–9 on the strip)
    const pc = Math.max(0, p);
    const i = Math.min(3, Math.floor(pc));
    const t = pc - i;
    const a = times[i].replace(':', '');
    const b = times[Math.min(4, i + 1)].replace(':', '');
    digitStrips.forEach((s, n) => {
      const from = Number(a[n]);
      const v = from + ((Number(b[n]) - from + 10) % 10) * t;
      s.style.transform = `translate3d(0, ${(-v * 5).toFixed(3)}%, 0)`;
    });
    // status: the next line comes up from below as the last one goes up
    lines.forEach((ln, k) => {
      const dk = k - pc;
      ln.style.transform = `translate3d(0, ${(dk * 100).toFixed(2)}%, 0)`;
      ln.style.opacity = String(Math.max(0, 1 - Math.abs(dk)).toFixed(3));
    });
  },
  clock(u) {
    return times[Math.round(arcP(u))] ?? '07:40';
  },
  // navbar clock inside the lens: 23:10 (S03) → 05:30 → 07:40
  clockIn(x) {
    if (x < 0.25) return null;
    return x < 0.85 ? '05:30' : '07:40';
  },
  // hidden; parked where S05 brings it back (insight.ts ringIn: it rises from below)
  ring(_u, ctx: Ctx) {
    const p = insightStart(ctx);
    return { ...p, alpha: 0 };
  },
  // 03 → 04 lens: the same ring moves to the centre and turns to face the camera (A → B, ×1.1 → ×1.6),
  // then opens past the screen (×4), blurs and fades (C)
  ringIn(x, ctx, from) {
    const m = ctx.mobile;
    const k = m ? 1.25 : 1.6;
    const B: Pose = pose({ x: 0, y: m ? 0.02 : 0, w: from.w * k, rx: -0.12, ry: -0.42, rz: 0, spin: from.spin, roll: -0.26, uncap: 1, ...S03_WARM, corner: 0 });
    let p = lerpPose(from, B, seg(x, 0.05, 0.4));
    const open = seg(x, 0.4, 0.75);
    if (x > 0.4) p = { ...p, w: lerp(B.w, from.w * 4 * (m ? 0.8 : 1), open), ry: p.ry + 0.12 * open };
    // Figma C (60%): still in view, soft (blur ≈ 4, opacity .97); fully open and gone by 85%
    p.blur = 28 * seg(x, 0.5, 0.85);
    p.alpha = 1 - seg(x, 0.6, 0.85);
    p.led = from.led * (1 - seg(x, 0, 0.25));
    p.flare = from.flare * (1 - seg(x, 0, 0.2));
    p.corner = from.corner * (1 - seg(x, 0, 0.35));
    return p;
  },
};
