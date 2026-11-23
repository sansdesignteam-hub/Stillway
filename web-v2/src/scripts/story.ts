/**
 * The scroll story of V2 (D-063).
 *
 * Layout: one fixed stage (background layer, scene back layers, the WebGL canvas, scene front
 * layers) and a row of empty "tracks" in normal flow, one per section, that only give the page
 * its scroll length and the anchors (#hero … #close). Sections are "pinned" because their
 * content lives on the fixed stage; scroll position drives every state. Pinning with
 * ScrollTrigger would put each section in its own stacking context, and the ring has to sit
 * between a section's back text ("Stillway", "rhythm", "keeps the pattern.") and its front text.
 *
 * For section i with local position u (in viewport heights):
 *   u in [-tin, 0)        incoming connection from section i-1 (Storyboard §3)
 *   u in [0, states-1]     state 1 … last state (1 state = 1 viewport)
 *   u in (states-1, end]   hold on the last state
 * Each section module (sections/*.ts) gets its own u and writes its DOM; it may also return the
 * ring pose for that u. Mobile uses the same model (D-069: pinned + scrubbed, ring stays 3D).
 * Reduced motion: u is snapped to whole states; elements fade over 300 ms; the ring jumps to the
 * pose of the state; no breathing loop.
 */
import { sections, dayparts, type SectionDef } from '../content/sections';
import { clamp01, seg, lerp, put, window4, type Ctx } from './anim';
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

export interface SectionMotion {
  init?: (root: HTMLElement) => void;
  update?: (u: number, ctx: Ctx, root: HTMLElement) => void;
  ring?: (u: number, ctx: Ctx) => Pose;
  /** navbar theme override for u (S01 over the photograph uses 'photo'); null = from the background */
  theme?: (u: number) => 'photo' | 'light' | 'dark' | null;
  /** clock text (HH:MM) for u, when the section drives its own clock (S04 follows the photo) */
  clock?: (u: number) => string;
  /** custom ring path across the incoming connection, x in [0, 1]; default = lerp in 30–70% */
  ringIn?: (x: number, ctx: Ctx, from: Pose, to: Pose) => Pose;
}
const motions: Record<string, SectionMotion> = { hero, why, sleep, activity, insight, details, specs, features, app, finishes, close };

const BG: Record<string, [number, number, number]> = {
  paper: [0xf7, 0xf5, 0xf0],
  sand: [0xef, 0xe6, 0xdb],
  night: [0x17, 0x12, 0x0f],
  dusk: [0x17, 0x12, 0x0f], // base under the dusk gradient overlay
};
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

interface Item {
  def: SectionDef;
  m: SectionMotion;
  track: HTMLElement;
  scene: HTMLElement;
  top: number; // px
  end: number; // states-1+hold
  visible: boolean;
}

export function initStory(opts: { reduced: boolean; subscribe: (fn: () => void) => void }) {
  const { reduced } = opts;
  const mq = window.matchMedia('(max-width: 719px)');
  const ctx: Ctx = { mobile: mq.matches, reduced };

  const bgEl = document.querySelector<HTMLElement>('[data-bg]')!;
  const duskEl = document.querySelector<HTMLElement>('[data-dusk]')!;
  const wipeEl = document.querySelector<HTMLElement>('[data-wipe]')!;
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const clockTime = document.querySelectorAll<HTMLElement>('[data-clock-time]');
  const clockPart = document.querySelectorAll<HTMLElement>('[data-clock-part]');
  const vhProbe = document.querySelector<HTMLElement>('[data-vh]')!;

  const items: Item[] = sections.map((def) => {
    const m = motions[def.id] ?? placeholder;
    const scene = document.querySelector<HTMLElement>(`[data-scene="${def.id}"]`)!;
    m.init?.(scene);
    return {
      def,
      m,
      track: document.getElementById(def.id)!,
      scene,
      top: 0,
      end: def.states - 1 + def.hold,
      visible: true,
    };
  });

  let vh = window.innerHeight;
  const measure = () => {
    vh = vhProbe.offsetHeight || window.innerHeight;
    ctx.mobile = mq.matches;
    for (const it of items) it.top = it.track.getBoundingClientRect().top + window.scrollY;
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

  let t0 = performance.now();
  const frame = () => {
    const y = window.scrollY;
    // current section = last whose track top is above the scroll position
    let ci = 0;
    for (let i = 0; i < items.length; i++) if (y >= items[i].top - 0.5) ci = i;
    const cur = items[ci];
    const uRaw = (y - cur.top) / vh - cur.def.tin;
    const u = snap(cur, uRaw);
    const tinX = cur.def.tin ? clamp01((u + cur.def.tin) / cur.def.tin) : 1; // 0..1 inside the connection
    const inConn = u < 0;
    const prev = items[ci - 1];

    /* still poster of the ring (3D fallback/): while WebGL loads, if it fails, and for reduced motion */
    if (!ring) {
      items.forEach((it) => {
        const uu = snap(it, (y - it.top) / vh - it.def.tin);
        it.scene.querySelectorAll<HTMLElement>('[data-ring-fallback]').forEach((f) => {
          // optional data-fb-range="a,b": the still shows only for states a..b (S01 has three)
          const r = f.dataset.fbRange?.split(',').map(Number);
          const [a, b] = r ?? [0, it.end];
          put(f, { o: window4(uu, a - 0.4, a - 0.05, b + 0.1, b + 0.5) }, ctx);
        });
      });
    }

    /* scenes: the current one, the previous one while it fades out, the next one (for back words) */
    items.forEach((it, i) => {
      const show = i === ci || i === ci - 1 || i === ci + 1;
      if (show !== it.visible) {
        it.visible = show;
        it.scene.style.visibility = show ? '' : 'hidden';
      }
      if (show && it.m.update) it.m.update(snap(it, (y - it.top) / vh - it.def.tin), ctx, it.scene);
    });

    /* background */
    const mid = inConn && prev ? seg(tinX, 0.3, 0.7) : 1;
    // a Dusk side never lerps its base: the base is the other section's colour and the opaque Dusk
    // layer cross-fades over it (D-090 r1: no muddy grey mix between Dusk and Paper)
    let a = prev ? BG[prev.def.bg] : BG[cur.def.bg];
    let b = BG[cur.def.bg];
    if (prev && prev.def.bg === 'dusk') a = b;
    if (prev && cur.def.bg === 'dusk') b = a;
    const k = inConn ? mid : 1;
    bgEl.style.backgroundColor = `rgb(${a.map((v, j) => Math.round(lerp(v, b[j], k))).join(' ')})`;
    // Dusk enters as a soft wipe rising from the bottom (Storyboard 04 → 05: "Dusk naik dari bawah")
    // and leaves as Paper wiping down from the top — never a 50% dissolve, which reads as muddy grey
    // (D-090 r1)
    let duskO = cur.def.bg === 'dusk' ? 1 : 0;
    let wipeY: number | null = null;
    let wipeTone = 'warm';
    let mask = 'none';
    if (inConn && prev && prev.def.bg === 'dusk' && cur.def.bg !== 'dusk') {
      // D-093: Dusk → Paper as light sweeping down (Stage .stage__wipe): Paper, Sand, a warm ochre
      // edge over the Dusk glow. A masked dissolve or a straight mix passes through a grey band.
      duskO = k < 0.999 ? 1 : 0;
      wipeY = -250 + 250 * k;
      wipeTone = 'warm';
    } else if (inConn && prev && cur.def.id === 'close' && !isDark(prev.def.bg)) {
      // D-098: Sand → Night for the closing canvas: night rises from below with a warm Ember edge
      if (k < 0.999) bgEl.style.backgroundColor = `rgb(${BG[prev.def.bg].join(' ')})`;
      wipeY = 100 - 250 * k;
      wipeTone = 'rise';
    } else if (inConn && prev && prev.def.bg === 'night' && !isDark(cur.def.bg)) {
      // D-096: Night → Paper (08 → 09) the same way, light sweeping down, with a plain Sand edge
      if (k < 0.999) bgEl.style.backgroundColor = `rgb(${BG.night.join(' ')})`;
      wipeY = -250 + 250 * k;
      wipeTone = 'plain';
    } else if (inConn && prev && cur.def.bg === 'dusk' && prev.def.bg !== 'dusk') {
      const p = -20 + 140 * k; // dusk edge moves up
      mask = `linear-gradient(to top, #000 ${(p - 20).toFixed(1)}%, transparent ${(p + 20).toFixed(1)}%)`;
    }
    duskEl.style.opacity = duskO.toFixed(3);
    const wv = wipeY === null || (wipeTone === 'rise' ? wipeY <= -149.99 : wipeY >= -0.01) ? 'hidden' : 'visible';
    if (wipeEl.style.visibility !== wv) wipeEl.style.visibility = wv;
    if (wipeY !== null && wipeEl.dataset.tone !== wipeTone) wipeEl.dataset.tone = wipeTone;
    if (wipeY !== null) wipeEl.style.transform = `translate3d(0, ${wipeY.toFixed(2)}lvh, 0)`;
    if (duskEl.style.maskImage !== mask) {
      duskEl.style.maskImage = mask;
      duskEl.style.webkitMaskImage = mask;
    }
    const darkW = (prev && inConn && isDark(prev.def.bg) ? 1 - k : 0) + (isDark(cur.def.bg) ? k : 0);
    const theme = (!inConn && cur.m.theme?.(u)) || (darkW > 0.5 ? 'dark' : 'light');
    if (nav && nav.dataset.theme !== theme) nav.dataset.theme = theme;
    document.documentElement.dataset.surface = theme;

    /* clock: changes in the last 30% of a connection (Storyboard §3) */
    const clockFrom = inConn && tinX < 0.7 && prev ? prev : cur;
    const d = clockFrom.def;
    let min = toMin(d.time);
    if (d.timeEnd) {
      const span = clockFrom === cur ? clamp01(u / Math.max(0.001, cur.end)) : 1;
      min = lerp(toMin(d.time), toMin(d.timeEnd), span);
    }
    let text = fmt(Math.floor(min / 5) * 5);
    if (clockFrom.m.clock) text = clockFrom.m.clock(clockFrom === cur ? u : clockFrom.end);
    const part = d.part ?? partOf(toMin(text));
    clockTime.forEach((el) => el.textContent !== text && (el.textContent = text));
    clockPart.forEach((el) => el.textContent !== part && (el.textContent = part));

    /* ring */
    if (ring) {
      let pose: Pose;
      if (inConn && prev) {
        const from = poseOf(prev, prev.end);
        const to = poseOf(cur, 0);
        pose = cur.m.ringIn ? cur.m.ringIn(tinX, ctx, from, to) : lerpPose(from, to, seg(tinX, 0.3, 0.7));
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
