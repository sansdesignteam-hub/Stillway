/**
 * S04 Activity & rest — 07:40 → 15:30 · Night (D-090; flow Storyboard §2, look Oryzo refs).
 * u: -1..0 connection from S03: numbers out (S03), ring shrinks and fades out (30–70%), then the
 *          title and the strip come in from the right with 07:40 in the frame (70–100%)
 *  0..4  state 1..5: the strip moves left one photo per state; the photo entering the frame grows,
 *        the one leaving shrinks to the left; big time, status, list and navbar clock follow it
 *  4     state 5: the others have left, the frame lines fade, 15:30 stays
 *  > 4.6 connection to S05: text and list out (0–30%), 15:30 darkens toward Dusk and fades (30–70%)
 * The 3D ring is not drawn here (only on the finger in the photos).
 */
import { put, seg, clamp01, lerp, type Ctx } from '../anim';
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
    const inn = seg(u, -0.3, 0); // 70–100% of the incoming connection
    const x = u - END; // outgoing connection progress
    const uiOut = 1 - seg(x, 0, 0.3);
    const k = clamp01(u / 4) * 4; // photo in the frame, continuous

    put(el.glow, { o: seg(u, -0.6, 0) * (1 - seg(x, 0.3, 0.7)) }, ctx);
    put(el.head, { o: inn * uiOut, x: 60 * (1 - inn) }, ctx);
    put(el.frame, { o: inn * (1 - seg(u, 3.5, 4)) }, ctx); // ref 3: the frame lines fade at state 5
    put(el.now, { o: inn * uiOut }, ctx);
    put(el.list, { o: inn * uiOut }, ctx);
    put(el.hint, { o: inn * (1 - seg(u, 0.2, 0.8)) }, ctx);

    // strip geometry: active width A (portrait), small width s, gap g
    const W = window.innerWidth;
    const H = window.innerHeight;
    const A = ctx.mobile ? W * 0.64 : Math.min(H * 0.7 * 0.714, W * 0.34);
    const s = ctx.mobile ? A * 0.32 : A * 0.34;
    const g = ctx.mobile ? 12 : 22;
    const near = A / 2 + g + s / 2;
    const darken = seg(x, 0.2, 0.6);
    const enter = (1 - inn) * W * 0.5; // the strip comes in from the right
    items.forEach((it, i) => {
      const d = i - k;
      const ad = Math.abs(d);
      let px = ad <= 1 ? d * near : Math.sign(d) * (near + (ad - 1) * (s + g));
      if (i < 4) px -= seg(u, 3.3, 4) * W * 0.6; // state 5: the others leave to the left
      const size = lerp(A, s, Math.min(1, ad));
      const last = i === 4;
      const o = inn * (last ? 1 - seg(x, 0.45, 0.8) : 1 - seg(u, 3.4, 4) * 0.999);
      put(it, { o, x: px + enter, s: size / A }, ctx);
      if (last) it.style.setProperty('--dark', darken.toFixed(3));
    });

    const idx = Math.round(k);
    if (idx !== shown) {
      shown = idx;
      const it = items[idx];
      if (el.time) el.time.textContent = it.dataset.time!;
      if (el.state) el.state.textContent = it.dataset.state!;
      if (el.detail) el.detail.textContent = it.dataset.detail!;
      if (el.key) el.key.dataset.state = it.dataset.state!.toLowerCase();
      ticks.forEach((t, i) => t.classList.toggle('is-active', i === idx));
      root.dataset.active = String(idx);
    }
  },
  clock(u) {
    return times[Math.round(clamp01(u / 4) * 4)] ?? '07:40';
  },
  // hidden; parked where S05 brings it back so 04 → 05 only needs a fade and scale 0.9 → 1
  ring(_u, ctx: Ctx) {
    const p = insightStart(ctx);
    return { ...p, w: p.w * 0.9, alpha: 0 };
  },
  // 03 → 04: the ring shrinks and fades out where it is (30–70%)
  ringIn(x, _ctx, from) {
    const t = seg(x, 0.3, 0.7);
    const to: Pose = { ...from, w: from.w * 0.55, alpha: 0 };
    const o = {} as Pose;
    for (const key of Object.keys(from) as (keyof Pose)[]) o[key] = lerp(from[key], to[key], t);
    return o;
  },
};
