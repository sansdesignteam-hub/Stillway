/**
 * S07 Specs & benefits — 21:00 · Sand → the everyday photo (D-149, Figma Design 07 State 1–7 with
 * the user's notes; Specs.astro has the layout).
 * u: -1.6..0 connection from S06 (D-147, unchanged: the hand goes up 1:1 — details.ts — and
 *          "Through the day." comes in at the end)
 *  0     State 1  "Through the day." in the middle
 *  0 → 1 State 2  the words part and shrink to fit beside the row (D-172); the four cards scale up
 *                 and fade in where they stand, left to right
 *  1 → 2 State 3  the words fade where they stand, then the cards close into a stack, the line grows from the
 *                 middle; (I) Night: title letter by letter from behind the line, lines rise
 *  2 → 5 States 4–6  the front card rises behind the stack, the next comes forward (II)–(IV); the
 *                 counter circle fills; by (IV) Rinse the cards behind it are gone (Figma State 6)
 *  5.1 → 6.1 end  (obsidianassembly.com "The Connection") the big photo comes up from below at
 *                 scroll speed (1:1), its content slower (parallax); the Rinse card moves down and
 *                 shrinks in front of it, then the words run over it (D-151: photo → card → words →
 *                 caption); the group is centred in the frame (D-150); caption last
 *  > 6.6 to S08   the frame opens to full bleed and goes to Night, the words and the card fade
 * Reduced motion: story.ts snaps u to whole states; everything is placed for that state and only
 * the opacity changes (short fade per state, global.css).
 */
import { seg, lerp, clamp01, smooth, type Ctx } from '../anim';
import { pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { detailsLeaveRing } from './details';

const END = 6.6;
/** the end: the frame starts to come up at RISE and moves 1:1 with the page */
const RISE = 5.12;
/** parallax: the photo moves at (1 − PAR) of the frame's speed */
const PAR = 0.18;

let root: HTMLElement | null = null;
let el: Record<string, HTMLElement | null> = {};
let cards: HTMLElement[] = [];
let words: HTMLElement[] = [];
let texts: HTMLElement[] = [];
let nums: HTMLElement[] = [];
/** per (I)–(IV): the title letters, the left lines, the right lines (made by splitLines) */
let chars: HTMLElement[][] = [];
let leftLines: HTMLElement[][] = [];
let rightLines: HTMLElement[][] = [];
let wordW = [0, 0];
let wordH = 0;
let wordFs = 0;
let vhPx = 0;
/** "Everyday" glyph metrics in its own box: baseline from the top, bottom of the "y", ink right inset */
let ev = { base: 0, desc: 0, right: 0 };
/** the navbar's height (--header-h); the end group is centred in the part of the frame below it */
let headerH = 76;

/* ---------- layout ---------- */

/** card box in Figma px (the slots are clip windows inside it) */
const BW = 392;
const BH = 602;
interface Slot {
  x: number; // centre, viewport px
  y: number;
  w: number; // visible window, viewport px
  h: number;
  s: number; // scale of the box
  o: number;
}
const lerpSlot = (a: Slot, b: Slot, t: number): Slot => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  s: lerp(a.s, b.s, t),
  o: lerp(a.o, b.o, t),
});

function layout(ctx: Ctx) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const m = ctx.mobile;
  // Figma frame 1440 × 900; phones: the front card 60 % of the width
  const k = m ? Math.min((W * 0.6) / BW, (H * 0.36) / 490) : Math.min(W / 1440, H / 900);
  const cx = W / 2;
  const cy = m ? H * 0.4 : H / 2 + 32 * k; // Figma: stack and line centred on y 482
  const ly = m ? cy + (BH / 2) * k + 60 : cy; // phones: the line under the stack
  // stack slots (Figma State 3: front 392 × 490, behind 352 × 602, then 312 wide from y 125)
  const F: Slot = { x: cx, y: cy, w: 392 * k, h: 490 * k, s: 1, o: 1 };
  const B1: Slot = { x: cx, y: cy, w: 352 * k, h: 602 * k, s: 1, o: 1 };
  const s2 = 312 / BW;
  const B2: Slot = { x: cx, y: cy - (482 - 125 - (BH * s2) / 2) * k, w: 312 * k, h: BH * s2 * k, s: s2, o: 1 };
  // State 2 row (Figma 180 × 225 every 200 px, centred on y 482)
  const rw = m ? (W - 32 - 3 * 8) / 4 : 179.93 * k;
  const rgap = m ? 8 : 19.99 * k;
  const rowW = 4 * rw + 3 * rgap;
  const row = (i: number): Slot => ({ x: cx - rowW / 2 + rw / 2 + i * (rw + rgap), y: cy, w: rw, h: rw * 1.25, s: rw / (BW * k), o: 1 });
  // the end: the small Rinse card (Figma State 7 195 × 244); its y is set by endLayout (D-150)
  const ew = m ? Math.min(W * 0.4, H * 0.21) : 195 * k;
  const E: Slot = { x: cx, y: H / 2, w: ew, h: ew * 1.25, s: ew / (BW * k), o: 1 };
  // the photo frame (Figma inset 24 / 40)
  const ey = m ? 16 : 24;
  return { W, H, m, k, cx, cy, ly, F, B1, B2, row, rowW, E, ey };
}
type L7 = ReturnType<typeof layout>;

let lastKey = '';
function measure(ctx: Ctx): L7 {
  const L = layout(ctx);
  const key = `${L.W}x${L.H}${ctx.mobile}`;
  if (key !== lastKey && root) {
    lastKey = key;
    root.style.setProperty('--bw', `${(BW * L.k).toFixed(1)}px`);
    root.style.setProperty('--bh', `${(BH * L.k).toFixed(1)}px`);
    root.style.setProperty('--ly', `${L.ly.toFixed(1)}px`);
    root.style.setProperty('--par', `${(PAR * (L.H - L.ey)).toFixed(1)}px`);
    headerH = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || (ctx.mobile ? 60 : 76);
  }
  if (words[0] && words[0].offsetWidth !== wordW[0]) {
    wordW = [words[0].offsetWidth, words[1].offsetWidth];
    wordH = words[0].offsetHeight;
    wordFs = parseFloat(getComputedStyle(words[0]).fontSize) || 160;
  }
  return L;
}

/* ---------- writes (cached; also used under reduced motion, where u only takes whole states) ---------- */

const cache = new WeakMap<HTMLElement, string>();
function tf(e: HTMLElement | null | undefined, o: number, transform = '', clip = '') {
  if (!e) return;
  const key = `${o.toFixed(3)}|${transform}|${clip}`;
  if (cache.get(e) === key) return;
  cache.set(e, key);
  e.style.opacity = o.toFixed(3);
  e.style.transform = transform;
  e.style.clipPath = clip;
  e.style.visibility = o < 0.002 ? 'hidden' : '';
}
const tr = (x: number, y: number, s = 1) => `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)${s !== 1 ? ` scale(${s.toFixed(4)})` : ''}`;
/** a y shift inside a mask, in % of the element */
const ty = (p: number) => (Math.abs(p) < 0.05 ? '' : `translate3d(0, ${p.toFixed(1)}%, 0)`);

function placeCard(c: HTMLElement, r: Slot, k: number, z: number) {
  const bw = BW * k;
  const bh = BH * k;
  const ix = Math.max(0, (bw - r.w / r.s) / 2);
  const iy = Math.max(0, (bh - r.h / r.s) / 2);
  const rad = 6 / r.s;
  tf(c, r.o, tr(r.x - bw / 2, r.y - bh / 2, r.s), `inset(${iy.toFixed(1)}px ${ix.toFixed(1)}px round ${rad.toFixed(1)}px)`);
  const zs = String(z);
  if (c.style.zIndex !== zs) c.style.zIndex = zs;
}

/* ---------- text masks ---------- */

/** split a paragraph into line masks (by the browser's own wrapping; '\n' is a hard break) */
function splitLines(p: HTMLElement): HTMLElement[] {
  const src = p.dataset.src ?? (p.textContent ?? '').trim();
  p.dataset.src = src;
  p.textContent = '';
  const spans: HTMLElement[] = [];
  src.split('\n').forEach((part, pi, all) => {
    part
      .trim()
      .split(/\s+/)
      .forEach((w) => {
        const s = document.createElement('span');
        s.textContent = w;
        s.style.display = 'inline-block';
        p.append(s, ' ');
        spans.push(s);
      });
    if (pi < all.length - 1) p.append(document.createElement('br'));
  });
  const groups: string[][] = [];
  let top = -1e9;
  spans.forEach((s) => {
    if (Math.abs(s.offsetTop - top) > 2) {
      groups.push([]);
      top = s.offsetTop;
    }
    groups[groups.length - 1].push(s.textContent ?? '');
  });
  p.textContent = '';
  return groups.map((g) => {
    const ln = document.createElement('span');
    ln.className = 'ln';
    const inner = document.createElement('span');
    inner.className = 'lni';
    inner.textContent = g.join(' ');
    ln.append(inner);
    p.append(ln);
    return inner;
  });
}
function buildMasks() {
  leftLines = texts.map((t) => {
    const p = t.querySelector<HTMLElement>('.sp__ttl');
    return p ? splitLines(p) : [];
  });
  rightLines = texts.map((t) => [...t.querySelectorAll<HTMLElement>('.sp__right [data-s-lines]')].flatMap((p) => splitLines(p)));
}

/** letters rise from behind the line (in), sink back behind it (out); stagger per letter */
function letters(list: HTMLElement[], inP: number, outP: number) {
  const n = list.length;
  const st = 0.5 / Math.max(1, n);
  list.forEach((c, j) => {
    const a = smooth(clamp01((inP - j * st) / 0.5));
    const b = smooth(clamp01((outP - j * st) / 0.5));
    tf(c, 1, ty((1 - a) * 130 + b * 130));
  });
}
/** lines rise into their masks (in) and on out of them (out), one after another */
function lines(list: HTMLElement[], inP: number, outP: number, delay = 0) {
  list.forEach((l, j) => {
    const d = delay + j * 0.12;
    const a = smooth(clamp01((inP - d) / (1 - Math.min(0.6, d))));
    const b = smooth(clamp01((outP - j * 0.12) / 0.88));
    tf(l, 1, ty((1 - a) * 105 - b * 105));
  });
}

/* ---------- motion ---------- */

/**
 * The end group — "The", "Everyday", the small card, the caption — centred as one in the frame,
 * below the navbar (D-150). The word crosses the card's lower half and is drawn over it (D-151,
 * desktop and phones alike). The caption stands free under the descender of the "y" and the card.
 */
function endLayout(L: L7) {
  const th = el.the?.offsetHeight ?? 0;
  const eh = el.evword?.offsetHeight ?? 0;
  const ch = el.caption?.offsetHeight ?? 0;
  const h = L.E.h;
  // offsets from the card centre
  const textTop = h * 0.12 - eh / 2 - th;
  const desc = textTop + th + ev.base + ev.desc;
  const capTop = Math.max(desc, h / 2) + (L.m ? 14 : 22);
  const gTop = Math.min(-h / 2, textTop);
  const gBot = capTop + ch;
  const vTop = Math.max(L.ey, headerH);
  const vBot = L.H - L.ey;
  const y = (vTop + vBot) / 2 - (gTop + gBot) / 2;
  return { E: { ...L.E, y }, textTop: y + textTop, capTop: y + capTop };
}

/** the focused card, 0..3, with a dwell at each card */
const focusOf = (u: number) => {
  const raw = clamp01((u - 2) / 3) * 3;
  const base = Math.floor(raw);
  return Math.min(3, base + smooth(smooth(raw - base)));
};
const mod4 = (v: number) => ((v % 4) + 4) % 4;

/** where card i sits in the stack for focus f; z order with it */
function stackSlot(i: number, f: number, L: L7): [Slot, number] {
  const p = mod4(i - f);
  if (p <= 1) return [lerpSlot(L.F, L.B1, p), 40 - p * 10];
  if (p <= 2) return [lerpSlot(L.B1, L.B2, p - 1), 30 - (p - 1) * 10];
  if (p <= 3) return [{ ...L.B2, o: 1 - (p - 2) }, 20 - (p - 2) * 10];
  // leaving the front: it rises, goes behind the stack and settles at the back (hidden)
  const q = 4 - p;
  const r = lerpSlot(L.F, L.B2, smooth(q));
  r.y -= Math.sin(Math.PI * q) * (L.m ? 0.3 : 0.42) * L.F.h;
  r.o = q < 0.7 ? 1 : 1 - (q - 0.7) / 0.3;
  return [r, q < 0.5 ? 50 : 5];
}

export const specs: SectionMotion = {
  init(r) {
    root = r;
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = {
      every: q('[data-s-every]'),
      par: q('[data-s-par]'),
      dark: q('[data-s-dark]'),
      etext: q('[data-s-etext]'),
      the: q('[data-s-the]'),
      evword: q('[data-s-evword]'),
      line: q('[data-s-line]'),
      count: q('[data-s-count]'),
      arc: q('[data-s-arc]'),
      caption: q('[data-s-caption]'),
      capi: q('[data-s-capi]'),
    };
    const all = (s: string, from: ParentNode = r) => [...from.querySelectorAll<HTMLElement>(s)];
    cards = all('[data-s-card]');
    words = all('[data-s-w]');
    words.forEach((w) => (w.style.transformOrigin = '0 0')); // D-172: the parts shrink from their top left
    texts = all('[data-s-text]');
    nums = all('[data-s-num]');
    chars = texts.map((t) => all('[data-s-ch]', t));
    const vhProbe = () => (vhPx = (document.querySelector('[data-vh]') as HTMLElement | null)?.offsetHeight || window.innerHeight);
    // "The" flush with the E of "Everyday": move it by the difference of the two side bearings
    const alignThe = () => {
      if (!el.the || !el.evword) return;
      const c = document.createElement('canvas').getContext('2d');
      if (!c) return;
      const ink = (e: HTMLElement, ch: string) => {
        const cs = getComputedStyle(e);
        c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        return -c.measureText(ch).actualBoundingBoxLeft; // ink start right of the pen
      };
      root?.style.setProperty('--the-x', `${(ink(el.evword, 'E') - ink(el.the, 'T')).toFixed(1)}px`);
      // where the baseline and the descender of "y" sit in the word's line box, and how far the ink of
      // the last "y" stops short of the box's right edge (side bearing + trailing letter-spacing)
      const cs = getComputedStyle(el.evword);
      c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const mt = c.measureText('y');
      const lh = parseFloat(cs.lineHeight) || el.evword.offsetHeight;
      const asc = mt.fontBoundingBoxAscent;
      const dsc = mt.fontBoundingBoxDescent;
      const ls = parseFloat(cs.letterSpacing) || 0;
      ev = { base: (lh - (asc + dsc)) / 2 + asc, desc: mt.actualBoundingBoxDescent, right: mt.width - mt.actualBoundingBoxRight + ls };
    };
    const rebuild = () => {
      vhProbe();
      buildMasks();
      alignThe();
      lastKey = '';
    };
    rebuild();
    document.fonts?.ready.then(rebuild);
    let t = 0;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = window.setTimeout(rebuild, 120);
      vhProbe();
    });
  },
  update(u, ctx) {
    const L = measure(ctx);
    const { W, H, m, k } = L;
    const vh = vhPx || H;
    const out = seg(u, END, END + 0.3); // leaving for S08
    const inn = seg(u, -0.3, 0); // 70–100 % of the incoming connection (D-147)

    /* ----- States 1–2: the words ----- */
    const split = seg(u, 0.1, 0.62); // D-172: the words are apart before the cards come in
    // D-172 PM review: after State 2 the two parts fade out where they stand — whole, inside the
    // screen — and are gone before the cards start to close (close below starts at 1.1)
    const leave = seg(u, 1.0, 1.1);
    const [w0, w1] = wordW;
    const space = wordFs * 0.24;
    // D-172 (Obsidian Assembly "Origin Objects"): the two parts move apart and shrink in proportion,
    // so each stays whole beside (desktop) or above/below (phones) the row — never cut, never covered
    const tsl = (x: number, y: number, sc: number) => `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
    if (m) {
      // phones: two lines in the middle → above / below the row → out to the sides
      const rowH = L.row(0).h;
      const fit = Math.min(1, (W - 32) / Math.max(w0, w1, 1), (L.cy - rowH / 2 - headerH - 16) / Math.max(wordH, 1));
      const sc = lerp(1, Math.min(fit, 0.8), split);
      const h = wordH * sc;
      const y0 = lerp(L.cy - wordH, L.cy - rowH / 2 - 12 - h, split);
      const y1 = lerp(L.cy, L.cy + rowH / 2 + 12, split);
      tf(words[0], inn * (1 - leave), tsl(W / 2 - (w0 * sc) / 2, y0 + (1 - inn) * 20, sc));
      tf(words[1], inn * (1 - leave), tsl(W / 2 - (w1 * sc) / 2, y1 + (1 - inn) * 20, sc));
    } else {
      // State 1: one line centred on the stack line; State 2: 'Through' at the left margin, 'the
      // day.' at the right one, each scaled to fit the room between the margin and the row (20 px air)
      const margin = Math.min(40, W * 0.028);
      const room = W / 2 - L.rowW / 2 - 20 * k - margin;
      const sc = lerp(1, Math.min(1, room / Math.max(w0, w1, 1)), split);
      const s0 = W / 2 - (w0 + space + w1) / 2;
      const x0 = lerp(s0, margin, split);
      const x1 = lerp(s0 + w0 + space, W - margin - w1 * sc, split);
      const y = L.cy - (wordH * sc) / 2 + (1 - inn) * 20;
      tf(words[0], inn * (1 - leave), tsl(x0, y, sc));
      tf(words[1], inn * (1 - leave), tsl(x1, y, sc));
    }

    /* ----- the cards ----- */
    const f = focusOf(u);
    const close = seg(u, 1.1, 1.75);
    const pe = seg(u, RISE, RISE + 0.98); // the end
    const G = endLayout(L);
    const backsGo = 1 - seg(f, 2.1, 2.9); // Figma State 6: only Rinse is left
    cards.forEach((c, i) => {
      // D-172: the intro cards scale up and fade in where they stand (no rise from below), left to right
      const rise = seg(u, 0.45 + 0.07 * i, 0.85 + 0.07 * i);
      const rw = L.row(i);
      const grow = lerp(0.72, 1, smooth(rise));
      rw.w *= grow;
      rw.h *= grow;
      rw.s *= grow;
      rw.o *= rise;
      const [st, z] = stackSlot(i, f, L);
      let r = lerpSlot(rw, st, close);
      if (i !== 3) r.o *= backsGo;
      if (i === 3) r = lerpSlot(r, G.E, pe);
      r.o *= 1 - out;
      // D-172: while the row closes, the leftmost card (Night) is on top, then Desk, Move, Rinse —
      // the same order the stack keeps, so the last card left in front is Rinse for "Everyday"
      placeCard(c, r, k, close < 0.5 ? 40 - i : i === 3 && pe > 0 ? 60 : Math.round(z));
    });

    /* ----- States 3–6: line, (n) name, lines, counter ----- */
    const grow = seg(u, 1.3, 1.85) * (1 - seg(u, 5.05, 5.45));
    tf(el.line, grow > 0.001 ? 1 - out : 0, `scaleX(${grow.toFixed(4)})`);
    const furn = seg(u, 1.45, 1.8) * (1 - seg(u, 5.1, 5.4)) * (1 - out);
    tf(el.count, furn);
    if (el.arc) el.arc.style.setProperty('--p', (((Math.max(0, f) + 1) / 4) * 100 * seg(u, 1.5, 2)).toFixed(2));
    texts.forEach((t, i) => {
      const inP = i === 0 ? clamp01((u - 1.5) / 0.45) : clamp01((f - i + 0.5) / 0.4);
      const outP = i === 3 ? clamp01((u - 5.05) / 0.4) : clamp01((f - i - 0.1) / 0.4);
      const shown = inP > 0 && outP < 1;
      if (ctx.reduced) {
        // whole state: no masks moving, a short fade (global.css)
        const on = inP >= 1 && outP <= 0 ? 1 : 0;
        tf(t, on * (1 - out));
        chars[i]?.forEach((c) => tf(c, 1));
        leftLines[i]?.forEach((l) => tf(l, 1));
        rightLines[i]?.forEach((l) => tf(l, 1));
        tf(nums[i], on);
        return;
      }
      tf(t, shown ? 1 - out : 0);
      if (!shown) return;
      letters(chars[i] ?? [], inP, outP);
      lines(leftLines[i] ?? [], inP, outP);
      lines(rightLines[i] ?? [], inP, outP, 0.08);
      tf(nums[i], 1, ty((1 - smooth(inP)) * 110 - smooth(outP) * 110));
    });
    if (!ctx.reduced) nums.forEach((n, i) => {
      const inP = i === 0 ? 1 : clamp01((f - i + 0.5) / 0.4);
      const outP = i === 3 ? 0 : clamp01((f - i - 0.1) / 0.4);
      if (inP <= 0 || outP >= 1) tf(n, 0);
    });

    /* ----- the end: the big photo comes up 1:1, its content slower ----- */
    const shut = 1 - seg(u, END, END + 0.45); // to S08: the frame opens to full bleed
    const frameTop = Math.max(L.ey, H - Math.max(0, u - RISE) * vh);
    const lift = frameTop - L.ey; // px still to go
    if (el.every) {
      const ex = m ? 16 : Math.min(40, W * 0.028);
      const es = el.every.style;
      const ins = `${(L.ey * shut).toFixed(1)}px ${(ex * shut).toFixed(1)}px`;
      if (es.inset !== ins) es.inset = ins;
      es.borderRadius = `${(14 * shut).toFixed(1)}px`;
      tf(el.every, u > RISE - 0.02 ? 1 : 0, ctx.reduced ? '' : tr(0, lift));
      tf(el.par, 1, ctx.reduced ? '' : tr(0, -PAR * lift));
      if (el.dark) el.dark.style.opacity = seg(u, END, END + 0.75).toFixed(3);
    }
    // "The / Everyday": rises with the frame, centred, drawn over the card (D-151). The caption rides
    // with it (same lift, so the two never cross during the rise) and stands free under the word,
    // below the descender of "y" (and below the card)
    if (el.etext && el.the && el.evword) {
      const tw = el.evword.offsetWidth;
      const th = el.the.offsetHeight;
      const eh = el.evword.offsetHeight;
      const top = G.textTop; // block top, at rest (endLayout)
      const rise = ctx.reduced ? 0 : lift;
      const left = W / 2 - tw / 2;
      // clipped to the photo frame, so the soft text shadow never spills onto the Sand around it
      const fx = (m ? 16 : Math.min(40, W * 0.028)) * shut;
      const fy = L.ey * shut;
      const bw = el.etext.offsetWidth;
      const bh = el.etext.offsetHeight;
      const ty0 = top + rise;
      const clip = `inset(${(fy + rise - ty0).toFixed(1)}px ${(left + bw - (W - fx)).toFixed(1)}px ${(ty0 + bh - (H - fy + rise)).toFixed(1)}px ${(fx - left).toFixed(1)}px)`;
      tf(el.etext, (u > RISE ? 1 : 0) * (1 - out), tr(left, ty0), clip);
      if (el.caption) {
        const cw = el.caption.offsetWidth;
        // D-155: desktop just right of the card (clear of the Gold ring in the photo's lower right);
        // phones: right edge on the ink of the last "y"
        const x = m ? left + tw - ev.right - cw : G.E.x + G.E.w / 2 + 20 * k;
        const y = G.capTop;
        const cp = seg(u, RISE + 0.72, RISE + 1.0);
        tf(el.caption, cp > 0 ? 1 - out : 0, tr(x, y + rise));
        tf(el.capi, 1, ctx.reduced ? '' : ty((1 - cp) * 105));
      }
    }
  },
  // no 3D ring in S07 (it is only in the card photos)
  ring: () => pose({ x: 0.2, y: 0, w: 0.1, alpha: 0 }),
  // 06 → 07 (D-147): the ring stays on the finger and leaves with the hand, 1:1
  ringIn: (x, ctx) => detailsLeaveRing(x, ctx),
};
