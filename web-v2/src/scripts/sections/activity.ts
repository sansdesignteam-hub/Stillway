/**
 * S04 Activity & rest — 07:40 → 15:30 · Night (D-090; flow Storyboard §2, look Oryzo refs).
 * u: -1..0 connection from S03: the S04 panel rises and S03 moves up and out (0–40%); the ring
 *          shrinks and leaves off the top of the screen (no fade); the title and the strip rise in
 *          with 07:40 in the frame; clock 23:10 → 05:30 → 07:40. (The lens of Storyboard v3 / D-117
 *          replaces this in phase 2.)
 *  0..4  state 1..5: the strip moves left one photo per state; the photo entering the frame grows,
 *        the one leaving shrinks to the left; big time, status, list and navbar clock follow it
 *  4     state 5: the others have left, the frame lines fade, 15:30 stays
 *  > 4.6 connection to S05 (Viture, A-06): the Dusk panel rises and S04 moves up and out until the
 *        screen is dark and empty; then the ring rises from the bottom edge (insight.ts)
 * The 3D ring is not drawn here (only on the finger in the photos).
 */
import { gsap } from 'gsap';
import { put, seg, clamp01, lerp, smooth, type Ctx } from '../anim';
import type { Pose } from '../ring/poses';
import { insightStart } from './insight';
import type { SectionMotion } from '../story';

let root: HTMLElement;
let items: HTMLElement[] = [];
let ticks: HTMLElement[] = [];
let el: Record<string, HTMLElement | null> = {};
let times: string[] = [];
let shown = -1;
const END = 4.6;

export const activity: SectionMotion = {
  init(r) {
    root = r;
    const q = (s: string) => r.querySelector<HTMLElement>(s);
    items = [...r.querySelectorAll<HTMLElement>('[data-a-item]')];
    ticks = [...r.querySelectorAll<HTMLElement>('[data-a-tick]')];
    times = items.map((i) => i.dataset.time!);
    el = {
      glow: q('[data-a-glow]'),
      head: q('[data-a-head]'),
      frame: q('[data-a-frame]'),
      now: q('[data-a-now]'),
      list: q('[data-a-list]'),
      hint: q('[data-a-hint]'),
      time: q('[data-a-time]'),
      state: q('[data-a-state]'),
      detail: q('[data-a-detail]'),
      key: q('[data-a-key]'),
    };
  },
  update(u, ctx) {
    const H = window.innerHeight;
    const inn = seg(u, -0.6, -0.05); // rises in after the panel (40–95% of the connection)
    const rise = (1 - inn) * H * 0.3;

    put(el.glow, { o: seg(u, -0.6, -0.2) }, ctx); // a glow: the only fade here
    put(el.head, { o: Math.min(1, inn * 5), y: rise }, ctx);
    put(el.frame, { o: inn > 0.001 && u < 3.75 ? 1 : 0, y: rise }, ctx); // ref 3: the frame lines go at state 5
    put(el.now, { o: Math.min(1, inn * 5), y: rise }, ctx);
    put(el.list, { o: Math.min(1, inn * 5), y: rise }, ctx);
    put(el.hint, { o: Math.min(1, inn * 5) * (u < 0.5 ? 1 : 0), y: rise }, ctx);

    // D-092: the strip moves exactly like V1 (web/src/scripts/motion.ts, "activity and rest: the
    // strip"): it dwells on each photo, then slides; the previous photo stays small on the left of
    // the frame, the next one on the right. Entry (from the right) and state 5 (others leave, the
    // frame fades, 15:30 darkens) stay V2.
    const W = window.innerWidth;
    const raw = clamp01(u / 4) * 4;
    const base = Math.floor(raw);
    const f = Math.min(4, base + smooth(smooth(raw - base)));
    const bw = items[0].offsetWidth;
    const sc = ctx.mobile ? 0.4 : 0.36;
    const sw = bw * sc;
    const gap = ctx.mobile ? 12 : 22;
    const near = bw / 2 + gap + sw / 2;
    const enter = (1 - inn) * W * 0.5; // V2: the strip comes in from the right
    const leave = seg(u, 3.3, 4); // V2 state 5: the others leave to the left
    items.forEach((it, i) => {
      const d = i - f;
      const ad = Math.abs(d);
      const k = smooth(Math.min(1, ad));
      let px = Math.sign(d) * (ad <= 1 ? k * near : near + (ad - 1) * (sw + gap));
      const last = i === 4;
      if (!last) px -= leave * W * 0.6;
      const o = (inn > 0.001 ? 1 : 0) * (ad > 4 ? 0 : 1) * (last || leave < 0.999 ? 1 : 0);
      put(it, { o, x: px + enter, y: rise, s: lerp(1, sc, k) }, ctx);
      it.style.zIndex = String(100 - Math.round(ad * 10));
    });

    const idx = Math.round(f);
    if (idx !== shown) {
      shown = idx;
      const it = items[idx];
      if (el.time) el.time.textContent = it.dataset.time!;
      if (el.state) el.state.textContent = it.dataset.state!;
      if (el.detail) el.detail.textContent = it.dataset.detail!;
      if (el.key) el.key.dataset.state = it.dataset.state!.toLowerCase();
      ticks.forEach((t, i) => t.classList.toggle('is-active', i === idx));
      root.dataset.active = String(idx);
      // V1 setActive: the new values fade up
      if (!ctx.reduced && el.time)
        gsap.fromTo([el.time, el.state?.parentElement, el.detail], { y: 10, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.25, stagger: 0.03, overwrite: true });
    }
  },
  clock(u) {
    const raw = clamp01(u / 4) * 4;
    const b = Math.floor(raw);
    return times[Math.round(Math.min(4, b + smooth(smooth(raw - b))))] ?? '07:40';
  },
  // no 3D ring in S04: parked below the screen where S05 brings it in from the bottom edge
  ring(_u, ctx: Ctx) {
    const p = insightStart(ctx);
    return { ...p, y: p.y - 1.4 };
  },
  // 03 → 04 (until the lens of phase 2): the sensor goes out, the ring shrinks a little and leaves off
  // the top of the screen before the S04 panel is full — never faded (D-120)
  ringIn(x, _ctx, from) {
    const t = seg(x, 0.05, 0.4);
    const to: Pose = { ...from, w: from.w * 0.6, y: from.y + 1.25 };
    const o = {} as Pose;
    for (const key of Object.keys(from) as (keyof Pose)[]) o[key] = lerp(from[key], to[key], t);
    o.sensor = from.sensor * (1 - seg(x, 0, 0.2));
    return o;
  },
};
