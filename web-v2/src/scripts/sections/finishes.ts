/**
 * S10 Finishes & pricing — 22:00 · Sand (D-098; flow Storyboard §2, look Figma sticky 40004118:141).
 * u: -1..0 connection from S09 (the phone slides right and widens into the panel — app.ts — Paper →
 *          Sand, the ring comes in on the left, the panel content appears; clock 21:00 → 22:00)
 *  0  state 1  "Turn it yourself." — the ring turns by drag / swipe / ‹ ›, finish swatches + light
 *  1  state 4  "Find your size and finish." — size, trial, box, the button and its inline note
 *  D-165: S09 → S10 is a plain scroll (app.ts); the S10 panel and ring come in after S09 has left
 *  > 2         to S11: the panel leaves right, the ring moves to the middle (close.ts ringIn)
 * D-171 phones: no pin, fade or ring scale. Title, ring, arrows and panel are one column that moves
 *   1:1 with the page; the S10 track is sized to the column (flowTrack), so its height is the content's.
 * States 2–3 of the Storyboard (Black, Gold + Lamp) are the visitor's own clicks, not scroll (D-069).
 */
import gsap from 'gsap';
import { put, seg, lerp, window4, type Ctx } from '../anim';
import { pose, ANGLE, type Pose } from '../ring/poses';
import type { SectionMotion } from '../story';
import { choice, setFinish, setLamp, finishPose, onChoice, FINISHES } from '../finish';
import { finishes as d } from '../../content/copy';

export const FINISHES_END = 2;
const TAU = Math.PI * 2;
const wrapPi = (a: number) => a - TAU * Math.round(a / TAU);
let root: HTMLElement | null = null;
let el: Record<string, HTMLElement | null> = {};
let heads: HTMLElement[] = [];
const view = { yaw: 0 };
let idle: ReturnType<typeof setTimeout> | null = null;
let reducedRef = false;
let sizeChosen = '';

/** after a few seconds alone, ease back to the start pose (shortest way) */
const settle = () => {
  if (idle) clearTimeout(idle);
  idle = setTimeout(() => {
    const target = Math.round(view.yaw / TAU) * TAU;
    gsap.to(view, { yaw: target, duration: reducedRef ? 0 : 1.6, ease: 'power2.inOut' });
  }, 3200);
};

function initControls(r: HTMLElement) {
  const q = (s: string) => r.querySelector<HTMLElement>(s);
  // drag / swipe: horizontal turns the ring; touch-action pan-y keeps vertical page scroll
  const drag = q('[data-fn-drag]');
  let x0 = 0;
  let y0 = 0;
  let dragging = false;
  let decided = false;
  drag?.addEventListener('pointerdown', (e) => {
    x0 = e.clientX;
    y0 = e.clientY;
    dragging = true;
    decided = e.pointerType === 'mouse';
    if (decided) drag.setPointerCapture(e.pointerId);
    gsap.killTweensOf(view);
  });
  drag?.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    if (!decided) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        dragging = false; // a vertical swipe scrolls the page
        return;
      }
      decided = true;
      drag.setPointerCapture(e.pointerId);
    }
    // D-165: kept in −π..π (the same pose, as rotations repeat every turn), so no later step has
    // to unwind the turns of a long drag
    view.yaw = wrapPi(view.yaw + dx * 0.012);
    x0 = e.clientX;
    y0 = e.clientY;
  });
  const end = () => {
    if (dragging) settle();
    dragging = false;
  };
  drag?.addEventListener('pointerup', end);
  drag?.addEventListener('pointercancel', end);

  const step = (dir: number) => {
    gsap.to(view, {
      yaw: Math.round(view.yaw / (Math.PI / 2)) * (Math.PI / 2) + dir * (Math.PI / 2),
      duration: reducedRef ? 0 : 0.7,
      ease: 'power2.inOut',
      overwrite: true,
      onComplete: () => (view.yaw = wrapPi(view.yaw)),
    });
    settle();
  };
  q('[data-fn-prev]')?.addEventListener('click', () => step(-1));
  q('[data-fn-next]')?.addEventListener('click', () => step(1));

  // swatches change the real material; light toggle swaps the env (and warms the panel)
  r.querySelectorAll<HTMLButtonElement>('[data-fn-swatch]').forEach((b) =>
    b.addEventListener('click', () => setFinish(Number(b.dataset.fnSwatch), reducedRef)),
  );
  r.querySelectorAll<HTMLButtonElement>('[data-fn-light]').forEach((b) =>
    b.addEventListener('click', () => setLamp(b.dataset.fnLight === '1', reducedRef)),
  );
  // sizes
  const sizes = [...r.querySelectorAll<HTMLButtonElement>('[data-fn-size]')];
  const sizeName = q('[data-fn-size-name]');
  sizes.forEach((b) =>
    b.addEventListener('click', () => {
      sizes.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      sizeChosen = b.dataset.fnSize ?? '';
      if (sizeName) sizeName.textContent = `: ${sizeChosen}`;
    }),
  );
  // the one button: an inline note, no cart (D-069, D-074)
  const note = q('[data-fn-note]');
  q('[data-fn-cta]')?.addEventListener('click', () => {
    if (note) note.textContent = d.note;
  });

  const sync = () => {
    const i = choice.index;
    r.querySelectorAll<HTMLButtonElement>('[data-fn-swatch]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.fnSwatch) === i)));
    r.querySelectorAll<HTMLButtonElement>('[data-fn-light]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.fnLight === '1') === choice.lampOn)));
    const nm = q('[data-fn-finish-name]');
    if (nm) nm.textContent = FINISHES[i];
    const cta = q('[data-fn-cta]');
    if (cta) cta.textContent = d.button(FINISHES[i]);
    if (note) note.textContent = '';
    r.dataset.lamp = choice.lampOn ? '1' : '0';
    // reduced motion / no WebGL: the still of the chosen finish
    document.querySelectorAll<HTMLImageElement>('[data-fn-still], [data-cl-still]').forEach((img) => (img.src = d.finishes[i].still));
  };
  onChoice(sync);
}

const phoneMq = window.matchMedia('(max-width: 719px)');
let front: HTMLElement | null = null;
let still: HTMLElement | null = null;
let track: HTMLElement | null = null;
const TIN = 1.3; // sections.ts finishes.tin
const vhNow = () => (document.querySelector('[data-vh]') as HTMLElement | null)?.offsetHeight || window.innerHeight;
/** D-171: phones — the S10 track is as long as its column (+ a short rest), desktop keeps --len */
const flowTrack = () => {
  if (!track || !front) return;
  if (!phoneMq.matches) {
    track.style.height = '';
    track.dataset.tin = String(TIN);
    return;
  }
  const H = vhNow();
  // the column starts right under S09 as it leaves (FLOW screens after the track top), so 09 → 10
  // reads as one page; at least TIN + a rest, so u still reaches the S10 states (clock, hash, nav)
  track.style.height = `${Math.round(Math.max((TIN + 0.25) * H, FLOW * H + Math.max(0, front.offsetHeight - H) + 0.25 * H))}px`;
  track.dataset.tin = String(FLOW); // deep links / nav land with the column's top at the top
};
/** D-172: phones — S09 goes up 1:1 at the start of the S10 track, the column follows straight on */
const FLOW = 1;
/** the column's screen y: the page position of the S10 content */
const flowY = () => (track ? track.getBoundingClientRect().top + FLOW * vhNow() : 0);
/** fully shown, no motion offset ([data-a] starts at opacity 0 in CSS, so 1 is written inline) */
const clearInline = (n: HTMLElement | null) => {
  if (!n) return;
  n.style.opacity = '1';
  n.style.visibility = '';
  n.style.transform = '';
};

export const finishes: SectionMotion = {
  init(r) {
    root = r;
    reducedRef = document.documentElement.classList.contains('reduced');
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { panel: q('[data-fn-panel]'), more: q('[data-fn-more]'), turn: q('[data-fn-turn]'), drag: q('[data-fn-drag]') };
    heads = [...r.querySelectorAll<HTMLElement>('[data-fn-head]')];
    front = r.querySelector<HTMLElement>('.scene__front');
    still = q('[data-fn-still]');
    track = document.getElementById('finishes');
    initControls(r);
    // registered before story.ts's own listeners, so the track has its new height when story measures
    flowTrack();
    window.addEventListener('resize', flowTrack);
    phoneMq.addEventListener('change', flowTrack);
    document.fonts?.ready.then(flowTrack);
  },
  update(u, ctx) {
    if (phoneMq.matches) {
      // D-171: plain flow on phones — everything visible, the column moves with the page
      const y = flowY();
      if (front) front.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      [heads[1], el.panel, el.more].forEach(clearInline);
      if (el.more) el.more.style.display = '';
      const live = document.documentElement.classList.contains('ring-ready');
      if (el.turn) {
        clearInline(el.turn);
        el.turn.style.visibility = live ? '' : 'hidden';
      }
      if (still && el.drag) still.style.transform = `translate3d(0, ${(y + el.drag.offsetTop + el.drag.offsetHeight / 2 - still.offsetHeight / 2).toFixed(1)}px, 0)`;
      if (el.drag) el.drag.style.pointerEvents = 'auto';
      return;
    }
    if (front) front.style.transform = '';
    if (still) still.style.transform = '';
    const W = window.innerWidth;
    const inn = seg(u, -0.3, 0);
    const out = seg(u, FINISHES_END, FINISHES_END + 0.45); // 10 → 11: the panel leaves right
    put(heads[0], { o: window4(u, -0.25, 0.05, 0.45, 0.7) }, ctx);
    put(heads[1], { o: seg(u, 0.72, 0.95) * (1 - out) }, ctx);
    put(el.panel, { o: inn * (1 - out), x: (1 - inn) * W * 0.12 + out * W * 0.4 }, ctx);
    // desktop: the whole panel from state 1 (Shift PDP); phone: size, box and button join at state 4
    const more = ctx.mobile ? seg(u, 0.5, 0.95) : 1;
    put(el.more, { o: more }, ctx);
    if (el.more) el.more.style.display = ctx.mobile && more < 0.01 ? 'none' : '';
    // turning needs the 3D ring (no WebGL / reduced motion: a still, so no hint or arrows)
    const live = document.documentElement.classList.contains('ring-ready');
    put(el.turn, { o: live ? window4(u, -0.2, 0.1, 0.55, 0.85) : 0 }, ctx);
    if (el.drag) el.drag.style.pointerEvents = u > -0.3 && u < FINISHES_END + 0.2 ? 'auto' : 'none';
  },
  ring(u, ctx) {
    const m = ctx.mobile;
    // QA F-17: smaller and a little lower, with air to the title above and the arrows below
    // QA M-06: phones — the ring sits in the gap between the title and the panel, never under it
    const W = window.innerWidth;
    const H = window.innerHeight;
    const desk = { x: -0.17, y: -0.065, w: Math.min(0.28, (0.5 * H) / W) };
    const phone = () => {
      const h = heads[u < 0.6 ? 0 : 1];
      const top = (h?.parentElement?.offsetTop ?? 0) + (h?.offsetHeight ?? 0);
      const bottom = Math.min(el.panel?.offsetTop ?? H, u < 0.6 ? H * 0.58 : H); // state 1: the arrows sit above the panel
      const zone = Math.max(60, bottom - top);
      return { x: 0, y: 0.5 - (top + zone / 2) / H, w: Math.min(0.56, (zone * 0.78) / W) };
    };
    if (m && el.drag) {
      // D-171: the ring sits in the column's ring area and scrolls with it, no scale change
      const r = el.drag.getBoundingClientRect();
      return pose({ x: 0, y: 0.5 - (r.top + r.height / 2) / H, w: Math.min(0.56, (r.height * 0.78) / W), ...ANGLE.threeQuarter, ry: ANGLE.threeQuarter.ry + view.yaw, ...finishPose(1), lamp: choice.lamp });
    }
    const s1 = m ? phone() : desk;
    const s4 = s1;
    const k = seg(u, 0.4, 1);
    return pose({
      x: lerp(s1.x, s4.x, k),
      y: lerp(s1.y, s4.y, k),
      w: lerp(s1.w, s4.w, k),
      ...ANGLE.threeQuarter,
      ry: ANGLE.threeQuarter.ry + view.yaw,
      ...finishPose(1),
      lamp: choice.lamp,
    });
  },
  // 09 → 10 (D-165): the ring comes in on the left once S09 has scrolled away
  ringIn(x, ctx, _from, to): Pose {
    if (ctx.mobile) return to; // D-171: phones — the ring comes up with the column, no fade or scale
    const t = seg(x, 0.55, 0.95);
    return { ...to, w: to.w * lerp(0.85, 1, t), alpha: t };
  },
};
