/**
 * S07 Specs & benefits — 21:00 · Sand → full-bleed photo (D-093; flow Storyboard §2, look Figma
 * sticky 40004118:121, Obsidian Assembly).
 * u: -1..0 connection from S06 (the hand photo shrinks into a card and fades — details.ts — Paper →
 *          Sand, "Through the day." comes in at the end)
 *  0  state 1  "Through the day." in the middle, pill on a thin line at the bottom
 *  1  state 2  the words split left / right, four cards rise between them
 *  2  state 3  (I) Night in focus: title on a line, counter 1/4, orbit lines, battery panel
 *  3–5 state 4 (II) Desk → (III) Move → (IV) Rinse, one per viewport
 *  6  state 5  the card shrinks, The Everyday opens to full bleed behind it
 *  > 6.6       to S08: the Night panel rises over the photo, everything moves up with it
 * The panels are the only things to touch (range / buttons, keyboard and screen-reader labelled);
 * they never stop the page from scrolling.
 */
import { put, seg, lerp, clamp01, smooth, type Ctx } from '../anim';
import { pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { detailsLeaveRing } from './details';

const END = 6.6;
let root: HTMLElement | null = null;
let el: Record<string, HTMLElement | null> = {};
let cards: HTMLElement[] = [];
let words: HTMLElement[] = [];
let texts: HTMLElement[] = [];
let nums: HTMLElement[] = [];
let panels: HTMLElement[] = [];
let wordW = [0, 0];
let wordH = 0;

function layout(ctx: Ctx) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const m = ctx.mobile;
  const fw = m ? Math.min(W * 0.62, (H * 0.4) / 1.25) : Math.min(W * 0.275, (H * 0.62) / 1.25);
  const fh = fw * 1.25;
  const gap = m ? 8 : W * 0.014;
  const cw = m ? (W - 32 - 3 * gap) / 4 : Math.min(W * 0.125, (H * 0.36) / 1.25);
  const ch = cw * 1.25;
  const rowY = H * (m ? 0.47 : 0.48);
  const cy = H * (m ? 0.43 : 0.5);
  return { W, H, m, fw, fh, gap, cw, ch, rowY, cy };
}

let lastKey = '';
function measure(ctx: Ctx) {
  const L = layout(ctx);
  const key = `${L.W}x${L.H}${ctx.mobile}`;
  if (key !== lastKey && root) {
    lastKey = key;
    root.style.setProperty('--fw', `${L.fw.toFixed(1)}px`);
    root.style.setProperty('--fh', `${L.fh.toFixed(1)}px`);
  }
  // words: measured untransformed (fonts may load late)
  if (words[0] && words[0].offsetWidth !== wordW[0]) {
    wordW = [words[0].offsetWidth, words[1].offsetWidth];
    wordH = words[0].offsetHeight;
  }
  return L;
}

/** focused card index with a dwell at each card (as S04): raw 0..3 → eased between whole cards */
const focusOf = (u: number) => {
  const raw = clamp01((u - 2) / 3) * 3;
  const base = Math.floor(raw);
  return Math.min(3, base + smooth(smooth(raw - base)));
};

function initPanels(r: HTMLElement) {
  // (I) battery: one range over the days; the bars show the week, the output reads the day
  const bat = r.querySelector<HTMLInputElement>('[data-bat]');
  const batOut = r.querySelector<HTMLElement>('[data-bat-out]');
  const bars = [...r.querySelectorAll<HTMLElement>('[data-bat-bar]')];
  const days: Array<{ day: string; pct: number }> = JSON.parse(bat?.dataset.days ?? '[]');
  const long = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const setBat = () => {
    if (!bat) return;
    const i = Number(bat.value);
    const dd = days[i];
    if (!dd) return;
    if (batOut) batOut.textContent = `${dd.day} · ${dd.pct}% left`;
    bat.setAttribute('aria-valuetext', `${long[i]}, ${dd.pct}% battery left, simulated`);
    bars.forEach((b, j) => b.classList.toggle('is-on', j === i));
  };
  bat?.addEventListener('input', setBat);
  setBat();
  // (II) size 6–13
  const size = r.querySelector<HTMLInputElement>('[data-size]');
  const sizeOut = r.querySelector<HTMLElement>('[data-size-out]');
  const setSize = () => {
    if (!size) return;
    if (sizeOut) sizeOut.textContent = `Size ${size.value}`;
    size.setAttribute('aria-valuetext', `Size ${size.value}`);
  };
  size?.addEventListener('input', setSize);
  setSize();
  // (III) weight / thickness, (IV) where it stays on: pressed buttons
  const group = (sel: string, onPick?: (b: HTMLButtonElement) => void) => {
    const bs = [...r.querySelectorAll<HTMLButtonElement>(sel)];
    bs.forEach((b) =>
      b.addEventListener('click', () => {
        bs.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
        onPick?.(b);
      }),
    );
  };
  const wtOut = r.querySelector<HTMLElement>('[data-wt-out]');
  group('[data-wt]', (b) => wtOut && (wtOut.textContent = b.dataset.wt ?? ''));
  group('[data-water]');
}

export const specs: SectionMotion = {
  init(r) {
    root = r;
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = {
      every: q('[data-s-every]'),
      dark: q('[data-s-dark]'),
      orbit: q('[data-s-orbit]'),
      pill: q('[data-s-pill]'),
      line: q('[data-s-line]'),
      count: q('[data-s-count]'),
      arc: q('[data-s-arc]'),
      etext: q('[data-s-etext]'),
      caption: q('[data-s-caption]'),
    };
    const all = (s: string) => [...r.querySelectorAll<HTMLElement>(s)];
    cards = all('[data-s-card]');
    words = all('[data-s-w]');
    texts = all('[data-s-text]');
    nums = all('[data-s-num]');
    panels = all('[data-s-panel]');
    initPanels(r);
  },
  update(u, ctx) {
    const L = measure(ctx);
    const { W, H, m } = L;
    const inn = seg(u, -0.35, 0); // 65–100% of the incoming connection: rises in (after the panel)
    const rise = (1 - inn) * H * 0.3;

    /* words: one line in the middle (state 1) → split around the row of cards (state 2) → out */
    const split = seg(u, 0.3, 1);
    const focusIn = seg(u, 1.25, 2); // row → one card in focus
    const rowW = 4 * L.cw + 3 * L.gap;
    const rowL = W / 2 - rowW / 2;
    const [w0, w1] = wordW;
    const space = wordH * 0.25;
    let p0x: number, p0y: number, p1x: number, p1y: number;
    if (m) {
      // phone: stacked in the middle → above / below the row
      const c0 = W / 2 - w0 / 2;
      const c1 = W / 2 - w1 / 2;
      p0x = c0;
      p1x = c1;
      p0y = lerp(H * 0.5 - wordH, L.rowY - L.ch / 2 - wordH - 10, split);
      p1y = lerp(H * 0.5, L.rowY + L.ch / 2 + 6, split);
    } else {
      // Storyboard 07 State 2: "Through" from the left margin and "the day." to the right margin,
      // behind the row of cards (Display 2)
      const total = w0 + space + w1;
      const s0 = W / 2 - total / 2;
      const mg = Math.min(40, W * 0.028);
      p0x = lerp(s0, Math.min(mg, rowL - w0 + L.cw * 0.06), split);
      p1x = lerp(s0 + w0 + space, Math.max(W - mg - w1, rowL + rowW - L.cw * 0.12), split);
      p0y = p1y = L.rowY - wordH / 2;
    }
    // "Through" / "the day." leave to the sides as the cards gather (moving, not fading)
    const wo = inn > 0.001 && focusIn < 0.999 ? 1 : 0;
    put(words[0], { o: wo, x: p0x - (m ? 0 : W * 0.6 * focusIn), y: p0y + rise }, ctx);
    put(words[1], { o: wo, x: p1x + (m ? 0 : W * 0.6 * focusIn), y: p1y + rise }, ctx);
    put(el.pill, { o: wo, y: rise + focusIn * H * 0.5 }, ctx);

    /* cards: rise into the row, then one comes into focus, the next peeks behind it */
    const f = focusOf(u);
    const every = seg(u, 5.2, 5.95);
    cards.forEach((c, i) => {
      const rise = ctx.reduced ? (u >= 1 ? 1 : 0) : seg(u, 0.28 + 0.07 * i, 0.72 + 0.07 * i);
      // row pose (relative to the focus centre, scale to the small card)
      const rx = rowL + L.cw / 2 + i * (L.cw + L.gap) - W / 2;
      const ry = L.rowY - L.cy + (1 - rise) * H * 0.75;
      const rs = L.cw / L.fw;
      // focus pose
      const d = i - f;
      let fx = 0;
      let fy = 0;
      let fs = 1;
      let fo = 1;
      if (d < 0) {
        // leaving upward
        fy = d * H * 0.9;
        fo = clamp01(1 + d * 1.6);
      } else if (d > 0) {
        // behind: a little smaller, peeking above the card in front
        const k = Math.min(1, d);
        fs = lerp(1, 0.9, k);
        fy = -k * L.fh * 0.12;
        fo = d <= 1 ? 1 : clamp01(2 - d);
      }
      // state 5: the last card shrinks to a small card in the middle of the place
      if (i === 3) fs *= lerp(1, m ? 0.55 : 0.5, every);
      const x = lerp(rx, fx, focusIn);
      const y = lerp(ry, fy, focusIn);
      const s = lerp(rs, fs, focusIn);
      const o = lerp(rise, fo, focusIn) * (i === 3 ? 1 : 1 - every);
      put(c, { o, x, y: y + (L.cy - H / 2), s }, ctx);
      c.style.zIndex = String(10 - Math.round(Math.abs(d) * 2) + (d < 0 ? -5 : 0));
    });

    /* focus furniture: line, (n) name, text, counter, orbit, panel */
    const furn = focusIn * (1 - seg(u, 5.15, 5.5));
    put(el.line, { o: furn }, ctx);
    put(el.orbit, { o: furn, y: L.cy - H / 2 }, ctx);
    if (el.orbit) el.orbit.style.rotate = `${(f * 16 + u * 3).toFixed(2)}deg`;
    put(el.count, { o: furn }, ctx);
    if (el.arc) el.arc.style.setProperty('--p', (((f + 1) / 4) * 100).toFixed(2));
    // one card's text replaces the other by moving up (G-03): the old one leaves upward before the
    // new one rises from below, so two never overlap (the S07 layout itself is redone in phase 3)
    texts.forEach((t, i) => {
      const d = f - i;
      const k = clamp01((0.42 - Math.abs(d)) / 0.12);
      put(t, { o: k * (furn > 0.5 ? 1 : furn * 2), y: -d * 140 }, ctx);
    });
    nums.forEach((n, i) => (n.style.opacity = (clamp01(1 - Math.abs(f - i) * 2.4) * 1).toFixed(3)));
    panels.forEach((p, i) => {
      const k = clamp01(1 - Math.abs(f - i) * 2.4);
      put(p, { o: k > 0.35 ? k * furn : 0, y: (1 - k) * 10 }, ctx);
    });

    /* state 5: The Everyday opens from the card to full bleed */
    if (el.every && root) {
      // full bleed with a thin Sand frame; the frame closes as it darkens toward S08 (no grey edge)
      const shut = 1 - seg(u, END, END + 0.45);
      const mx = (m ? 10 : W * 0.026) * shut;
      const my = (m ? 10 : H * 0.03) * shut;
      const top = lerp(L.cy - L.fh / 2, my, every);
      const bot = lerp(H - (L.cy + L.fh / 2), my, every);
      const lft = lerp(W / 2 - L.fw / 2, mx, every);
      const es = el.every.style;
      es.setProperty('--et', `${top.toFixed(1)}px`);
      es.setProperty('--eb', `${bot.toFixed(1)}px`);
      es.setProperty('--el', `${lft.toFixed(1)}px`);
      es.setProperty('--er', `${lft.toFixed(1)}px`);
      es.setProperty('--erad', `${(lerp(6, 14, every) * shut).toFixed(1)}px`);
      put(el.every, { o: u > 5 ? 1 : 0 }, ctx);
      // no darkening toward S08: the Night panel covers the photo with a straight edge (D-120)
      if (el.dark) el.dark.style.opacity = '0';
    }
    const et = seg(u, 5.6, 6);
    put(el.etext, { o: Math.min(1, et * 5), y: (1 - et) * 48 }, ctx);
    const cap = seg(u, 5.75, 6.05);
    put(el.caption, { o: Math.min(1, cap * 5), y: (1 - cap) * 32 }, ctx);
  },
  // no 3D ring in S07 (it is only in the card photos): parked above the screen
  ring: () => pose({ x: 0, y: 1.4, w: 0.1 }),
  // 06 → 07: the polished ring stays on the finger while the hand photo shrinks into a card and
  // leaves upward with it (no fade; phase 3 replaces this with the snapshot card of D-123 P10)
  ringIn: (x, ctx, _from, _to, k) => detailsLeaveRing(x, ctx, k),
};

