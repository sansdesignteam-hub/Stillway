/**
 * S10 Finishes & pricing — 22:00 · Sand (D-098; flow Storyboard §2, look Figma sticky 40004118:141).
 * u: -1..0 connection from S09 (the phone slides right and widens into the panel — app.ts — Paper →
 *          Sand, the ring comes in on the left, the panel content appears; clock 21:00 → 22:00)
 *  0  state 1  "Turn it yourself." — the ring turns by drag / swipe / ‹ ›, finish swatches + light
 *  1  state 4  "Find your size and finish." — size, trial, box, the button and its inline note
 *  > 2         to S11: the panel leaves right, the ring moves to the middle (close.ts ringIn)
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
    view.yaw += dx * 0.012;
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
    gsap.to(view, { yaw: Math.round(view.yaw / (Math.PI / 2)) * (Math.PI / 2) + dir * (Math.PI / 2), duration: reducedRef ? 0 : 0.7, ease: 'power2.inOut', overwrite: true });
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

export const finishes: SectionMotion = {
  init(r) {
    root = r;
    reducedRef = document.documentElement.classList.contains('reduced');
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    el = { panel: q('[data-fn-panel]'), more: q('[data-fn-more]'), turn: q('[data-fn-turn]'), drag: q('[data-fn-drag]') };
    heads = [...r.querySelectorAll<HTMLElement>('[data-fn-head]')];
    initControls(r);
  },
  update(u, ctx) {
    const W = window.innerWidth;
    const inn = seg(u, -0.35, 0);
    const out = seg(u, FINISHES_END, FINISHES_END + 0.45); // 10 → 11: the panel leaves right
    put(heads[0], { o: window4(u, -0.25, 0.05, 0.45, 0.7) }, ctx);
    put(heads[1], { o: seg(u, 0.55, 0.9) * (1 - out) }, ctx);
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
    const s1 = { x: m ? 0 : -0.17, y: m ? 0.2 : -0.05, w: m ? 0.62 : 0.34 };
    const s4 = { x: m ? 0 : -0.17, y: m ? 0.25 : -0.05, w: m ? 0.34 : 0.34 };
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
  // 09 → 10: the ring comes in on the left as the phone becomes the panel
  ringIn(x, _ctx, _from, to): Pose {
    const t = seg(x, 0.35, 0.85);
    return { ...to, w: to.w * lerp(0.85, 1, t), alpha: t };
  },
};
