/**
 * The scroll story of V2 (D-063; panel model of Storyboard v3 §1 "Aturan gerak", D-120).
 *
 * Layout: one fixed stage (WebGL ring canvas + one scene per section) and a row of empty "tracks"
 * in normal flow, one per section, that only give the page its scroll length and the anchors
 * (#hero … #close). Scroll position drives every state.
 *
 * Panels (D-120): every section is a panel — its own background (`.scene__panel`, injected here)
 * plus its layers (`.scene__back` z 1, `.scene__front` z 3). Moving on = the next panel rises from
 * the bottom with a straight edge and covers the previous one; the old content moves up and out
 * (half speed) and is clipped at the rising edge; the new content rises with its panel. There is no
 * background cross-fade anywhere. The ring is one sticky layer (canvas z 2) above every panel and
 * back layer and below the front text; it is never faded — it only moves, turns, scales and changes
 * light. Sections without a 3D ring (04, 07, 09) send it off the top of the screen before their panel
 * is full; the next section brings it in from the bottom with its panel.
 *
 * Scenes never get opacity/transform/clip themselves (that would make a stacking context and pull
 * their back text in front of the ring). The panel motion is written as CSS variables on the scene
 * (--ly offset, --ct/--cb clip, --py panel edge) and applied to its children in global.css.
 *
 * For section i with local position u (in viewport heights):
 *   u in [-tin, 0)        incoming connection from section i-1 (Storyboard §3); x = (u + tin) / tin
 *   u in [0, states-1]     state 1 … last state (1 state = 1 viewport)
 *   u in (states-1, end]   hold on the last state
 * The panel of section i rises over the local window `panel` (default: the first 40% of its
 * connection). The navbar theme and the clock follow the panel that covers the navbar, so both
 * change exactly when a panel edge passes it (Storyboard §1).
 * Reduced motion: content u is snapped to whole states (elements fade ≤ 250 ms, CSS); panels still
 * move with the scroll like a normal page; no WebGL (still posters), no loops.
 */
import { sections, dayparts, type SectionDef } from '../content/sections';
import { clamp01, seg, lerp, put, window4, PARALLAX, type Ctx } from './anim';
import { lerpPose, type Pose } from './ring/poses';
import type { RingStage } from './ring/stage';
import { hero } from './sections/hero';
import { why } from './sections/why';
import { sleep } from './sections/sleep';
import { placeholder } from './sections/placeholder';
import { activity } from './sections/activity';
import { insight } from './sections/insight';
import { details } from './sections/details';
import { specs } from './sections/specs';
import { features } from './sections/features';
import { app } from './sections/app';
import { finishes } from './sections/finishes';
import { close } from './sections/close';

export type Theme = 'photo' | 'light' | 'dark';

export interface SectionMotion {
  init?: (root: HTMLElement) => void;
  update?: (u: number, ctx: Ctx, root: HTMLElement) => void;
  ring?: (u: number, ctx: Ctx) => Pose;
  /** navbar theme override for u (S01 over the photograph uses 'photo'); null = from the background */
  theme?: (u: number) => Theme | null;
  /** clock text (HH:MM) for u ≥ 0, when the section drives its own clock (S04 follows the photo) */
  clock?: (u: number) => string;
  /**
   * custom ring path across the incoming connection, x in [0, 1]; k = how far this section's panel
   * has risen (0..1). Default = lerp in 30–70%.
   */
  ringIn?: (x: number, ctx: Ctx, from: Pose, to: Pose, k: number) => Pose;
}
const motions: Record<string, SectionMotion> = { hero, why, sleep, activity, insight, details, specs, features, app, finishes, close };

const isDark = (b: string) => b === 'night' || b === 'dusk';
const toMin = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (min: number) => {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
const partOf = (min: number) => {
  let label = dayparts[0][1];
  for (const [start, l] of dayparts) if (min >= start) label = l;
  return label;
};
/** last keyframe at or before x */
const keyAt = (keys: Array<[number, string]>, x: number) => {
  let v = keys[0][1];
  for (const [at, t] of keys) if (x >= at) v = t;
  return v;
};

interface Item {
  def: SectionDef;
  m: SectionMotion;
  track: HTMLElement;
  scene: HTMLElement;
  top: number; // px
  end: number; // states-1+hold
  win: [number, number]; // panel window in local u
  visible: boolean;
  k: number; // panel risen 0..1
  edge: number; // px from the top of the viewport
  vars: string; // last written CSS vars
}

export function initStory(opts: { reduced: boolean; subscribe: (fn: () => void) => void }) {
  const { reduced } = opts;
  const mq = window.matchMedia('(max-width: 719px)');
  const ctx: Ctx = { mobile: mq.matches, reduced };

  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const clockTime = document.querySelectorAll<HTMLElement>('[data-clock-time]');
  const clockPart = document.querySelectorAll<HTMLElement>('[data-clock-part]');
  const vhProbe = document.querySelector<HTMLElement>('[data-vh]')!;

  const items: Item[] = sections.map((def, i) => {
    const m = motions[def.id] ?? placeholder;
    const scene = document.querySelector<HTMLElement>(`[data-scene="${def.id}"]`)!;
    // the panel (background) of the section, first in the scene so it paints under its layers
    const panel = document.createElement('div');
    panel.className = 'scene__panel';
    panel.dataset.bg = def.bg;
    panel.setAttribute('aria-hidden', 'true');
    scene.prepend(panel);
    // the ring stills (no WebGL / reduced motion) live on the back layer, above the back words:
    // same order as the canvas, and they move and clip with the panel
    let back = scene.querySelector<HTMLElement>(':scope > .scene__back');
    const stills = scene.querySelectorAll<HTMLElement>(':scope > [data-ring-fallback]');
    if (stills.length && !back) {
      back = document.createElement('div');
      back.className = 'scene__back';
      panel.after(back);
    }
    stills.forEach((s) => back!.append(s));
    m.init?.(scene);
    const tin = def.tin;
    const win: [number, number] = i === 0 ? [-1e9, -1e9 + 1] : def.panel ?? [-tin, -tin + 0.4 * tin];
    return { def, m, track: document.getElementById(def.id)!, scene, top: 0, end: def.states - 1 + def.hold, win, visible: true, k: i === 0 ? 1 : 0, edge: 0, vars: '' };
  });

  let vh = window.innerHeight;
  let navY = 38;
  const measure = () => {
    vh = vhProbe.offsetHeight || window.innerHeight;
    ctx.mobile = mq.matches;
    for (const it of items) it.top = it.track.getBoundingClientRect().top + window.scrollY;
    if (nav) {
      const bar = nav.querySelector<HTMLElement>('.nav-bar') ?? nav;
      const r = bar.getBoundingClientRect();
      navY = r.height ? r.top + r.height / 2 : 38;
    }
  };

  let ring: RingStage | null = null;
  let lastPoseKey = '';
  const poseOf = (it: Item, u: number): Pose => (it.m.ring ?? placeholder.ring!)(u, ctx);

  /** snap to whole states for reduced motion; connections switch at their middle */
  const snap = (it: Item, u: number) => {
    if (!reduced) return u;
    if (u < -it.def.tin) return -99; // not reached yet: nothing of it shows
    if (u < 0) return u < -it.def.tin / 2 ? -it.def.tin : 0;
    if (u > it.end) return u - it.end < 0.15 ? it.end : it.end + 1; // leaving: fully out
    return Math.min(it.def.states - 1, Math.round(u));
  };

  const t0 = performance.now();
  const frame = () => {
    const y = window.scrollY;
    const H = window.innerHeight;
    // current section = last whose track top is above the scroll position
    let ci = 0;
    for (let i = 0; i < items.length; i++) if (y >= items[i].top - 0.5) ci = i;
    const cur = items[ci];
    const uOf = (it: Item) => (y - it.top) / vh - it.def.tin;
    const uRaw = uOf(cur);
    const u = snap(cur, uRaw);
    const tinX = cur.def.tin ? clamp01((u + cur.def.tin) / cur.def.tin) : 1; // 0..1 inside the connection
    const inConn = u < 0;
    const prev = items[ci - 1];

    /* panels: how far each has risen (with the plain scroll, also for reduced motion) */
    for (let i = 1; i < items.length; i++) {
      const it = items[i];
      const [a, b] = it.win;
      it.k = clamp01((uOf(it) - a) / (b - a));
      // a soft start and stop, but tied to the scroll (no easing that runs on after the scroll stops)
      it.k = it.k * it.k * (3 - 2 * it.k) * 0.5 + it.k * 0.5;
      it.edge = H * (1 - it.k);
    }

    /* scenes: a panel shows from the moment it starts to rise until the next one covers it */
    items.forEach((it, i) => {
      const next = items[i + 1];
      const kn = next ? next.k : 0;
      const show = it.k > 0 && kn < 1;
      if (show !== it.visible) {
        it.visible = show;
        it.scene.style.visibility = show ? '' : 'hidden';
      }
      if (!show) return;
      const top = it.edge; // own panel edge
      const bottom = next ? next.edge : H; // the next panel's edge
      const ly = top - PARALLAX * H * kn; // rises with its panel, then moves up while covered
      const ct = Math.max(0, top - ly);
      const cb = Math.max(0, H - (bottom - ly));
      const vars = `${ly.toFixed(1)}|${ct.toFixed(1)}|${cb.toFixed(1)}|${top.toFixed(1)}`;
      if (vars !== it.vars) {
        it.vars = vars;
        const s = it.scene.style;
        s.setProperty('--ly', `${ly.toFixed(1)}px`);
        s.setProperty('--ct', `${ct.toFixed(1)}px`);
        s.setProperty('--cb', `${cb.toFixed(1)}px`);
        s.setProperty('--py', `${top.toFixed(1)}px`);
      }
    });

    /* still poster of the ring (3D fallback/): while WebGL loads, if it fails, and for reduced motion */
    if (!ring) {
      items.forEach((it) => {
        if (!it.visible) return;
        const uu = snap(it, uOf(it));
        it.scene.querySelectorAll<HTMLElement>('[data-ring-fallback]').forEach((f) => {
          // optional data-fb-range="a,b": the still shows only for states a..b (S01 has three)
          const r = f.dataset.fbRange?.split(',').map(Number);
          const [a, b] = r ?? [0, it.end];
          put(f, { o: window4(uu, a - 0.4, a - 0.05, b + 0.1, b + 0.5) }, ctx);
        });
      });
    }

    /* scene content: every visible scene and the next one (so it is in place when it rises) */
    items.forEach((it, i) => {
      if (!it.m.update) return;
      if (it.visible || i === ci + 1) it.m.update(snap(it, uOf(it)), ctx, it.scene);
    });

    /* navbar: the panel under it decides theme, clock and daypart */
    let ni = 0;
    for (let i = 0; i < items.length; i++) if (items[i].k > 0 && items[i].edge <= navY) ni = i;
    const top = items[ni];
    const uTop = snap(top, uOf(top));
    const theme: Theme = top.m.theme?.(uTop) ?? (isDark(top.def.bg) ? 'dark' : 'light');
    if (nav && nav.dataset.theme !== theme) nav.dataset.theme = theme;
    if (document.documentElement.dataset.surface !== theme) document.documentElement.dataset.surface = theme;

    const d = top.def;
    let text: string;
    if (uTop < 0) {
      // in the connection: Storyboard §3 keyframes, else the section's first time
      const x = d.tin ? clamp01((uTop + d.tin) / d.tin) : 1;
      text = d.clockIn ? keyAt(d.clockIn, x) : top.m.clock ? top.m.clock(0) : d.time;
    } else if (top.m.clock) text = top.m.clock(uTop);
    else if (d.timeEnd) text = fmt(Math.floor(lerp(toMin(d.time), toMin(d.timeEnd), clamp01(uTop / Math.max(0.001, top.end))) / 5) * 5);
    else text = d.time;
    const part = d.part && text === d.time ? d.part : partOf(toMin(text));
    clockTime.forEach((el) => el.textContent !== text && (el.textContent = text));
    clockPart.forEach((el) => el.textContent !== part && (el.textContent = part));

    /* ring: sticky, never faded (pose.alpha stays 1) */
    if (ring) {
      let pose: Pose;
      if (inConn && prev) {
        const from = poseOf(prev, prev.end);
        const to = poseOf(cur, 0);
        pose = cur.m.ringIn ? cur.m.ringIn(tinX, ctx, from, to, cur.k) : lerpPose(from, to, seg(tinX, 0.3, 0.7));
      } else pose = poseOf(cur, u);
      // dev only: window.__ringOverride = { w: 0.9, x: 0 } merges into the pose (stripped from builds)
      if (import.meta.env.DEV && (window as any).__ringOverride) pose = { ...pose, ...(window as any).__ringOverride };
      // breathing: S01 state 1 only, scale 1 → 1.02 (the one autoplay animation), never for reduced motion
      let breathe = 0;
      if (!reduced && cur.def.id === 'hero') {
        const t = (performance.now() - t0) / 1000;
        breathe = 0.01 * (1 - Math.cos(t * 1.25)) * (1 - seg(u, 0, 0.8));
      }
      const key = JSON.stringify(pose) + breathe.toFixed(4) + vh;
      if (key !== lastPoseKey) {
        lastPoseKey = key;
        ring.apply(pose, { breathe });
        ring.render();
      }
    }
  };

  measure();
  frame();
  const onResize = () => {
    measure();
    lastPoseKey = '';
    items.forEach((it) => (it.vars = ''));
    frame();
  };
  window.addEventListener('resize', onResize);
  mq.addEventListener('change', onResize);
  document.fonts?.ready.then(onResize);
  opts.subscribe(frame);

  return {
    frame,
    setRing(r: RingStage) {
      ring = r;
      lastPoseKey = '';
      frame(); // first frame with the real pose, finish and env; the canvas fades in over 0.9 s
      document.documentElement.classList.add('ring-ready');
      setTimeout(() => document.documentElement.classList.add('ring-live'), 1000);
    },
  };
}
