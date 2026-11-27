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
import { view } from './viewport';
import { keepLit, LIGHT } from './glow';
import { fetchPictures, decodePictures, isStill } from './lazy';
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
  /** clock text inside the incoming connection, x in [0, 1]; null = the default rule (D-138 lens) */
  clockIn?: (x: number) => string | null;
  /** custom ring path across the incoming connection, x in [0, 1]; default = lerp in 30–70% */
  ringIn?: (x: number, ctx: Ctx, from: Pose, to: Pose) => Pose;
}
const motions: Record<string, SectionMotion> = { hero, why, sleep, activity, insight, details, specs, features, app, finishes, close };

/** section backgrounds as RGB for the cross-fade; read from tokens.css (--paper, --sand, --night)
 *  in initStory, so no colour is written here (D-134). Dusk's base under its overlay is Night. */
const BG: Record<string, [number, number, number]> = { paper: [0, 0, 0], sand: [0, 0, 0], night: [0, 0, 0], dusk: [0, 0, 0] };
function readBg() {
  const probe = document.createElement('i');
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const rgb = (token: string): [number, number, number] => {
    probe.style.color = `var(${token})`;
    const m = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['0', '0', '0'];
    return [Number(m[0]), Number(m[1]), Number(m[2])];
  };
  BG.paper = rgb('--paper');
  BG.sand = rgb('--sand');
  BG.night = rgb('--night');
  BG.dusk = BG.night;
  probe.remove();
}
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

/** QA HE-01: the navbar link of each chapter (S01 has none) */
const CHAPTER: Record<string, string> = {
  why: '#sleep', sleep: '#sleep', activity: '#sleep', insight: '#sleep', // Rhythm, S02–S05
  details: '#details', specs: '#details', features: '#details', // The ring, S06–S08
  app: '#app',
  finishes: '#finishes',
  close: '#faq',
};

interface Item {
  def: SectionDef;
  m: SectionMotion;
  track: HTMLElement;
  scene: HTMLElement;
  top: number; // px
  end: number; // states-1+hold
  visible: boolean;
  /** QA27 G-19: pictures fetched / decoded / ring stills fetched (scripts/lazy.ts) */
  fetched: boolean;
  decoded: boolean;
  stills: boolean;
}

export function initStory(opts: { reduced: boolean; subscribe: (fn: () => void) => void }) {
  const { reduced } = opts;
  readBg();
  const mq = window.matchMedia('(max-width: 719px)');
  const ctx: Ctx = { mobile: mq.matches, reduced };

  const bgEl = document.querySelector<HTMLElement>('[data-bg]')!;
  const duskEl = document.querySelector<HTMLElement>('[data-dusk]')!;
  // S05 Dusk light (D-139): --cocoa-300 from the lower left, where the ochre sunset glow was, and the
  // Figma "Top shade" upper right (D-142: Night 75%)
  const duskLight = duskEl.querySelector<HTMLCanvasElement>('[data-dusk-light]');
  if (duskLight)
    keepLit(duskLight, () => ({
      ellipses: [
        { token: LIGHT, cx: 0, cy: 900, rx: 1210, ry: 640, stops: [[0, 0.45]], power: 1.8 },
        { token: '--night', cx: 1300, cy: 80, rx: 700, ry: 450, stops: [[0, 0.75], [1, 0]], smooth: true },
      ],
    }));
  const wipeEl = document.querySelector<HTMLElement>('[data-wipe]')!;
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const clockTime = document.querySelectorAll<HTMLElement>('[data-clock-time]');
  const clockPart = document.querySelectorAll<HTMLElement>('[data-clock-part]');

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
      fetched: false,
      decoded: false,
      stills: false,
    };
  });

  let vh = view.h;
  const measure = () => {
    vh = view.h;
    ctx.mobile = mq.matches;
    for (const it of items) it.top = it.track.getBoundingClientRect().top + window.scrollY;
  };

  let ring: RingStage | null = null;
  /** D-191: the stage while it prepares its first frame, and the pose that frame will have */
  let priming: RingStage | null = null;
  let primed: { pose: Pose; breathe: number } | null = null;
  let lastPoseKey = '';
  const progDots = [...document.querySelectorAll<HTMLElement>('[data-gprog] a')];
  let progAt = -1;
  // D-171: the progress shows while the page moves and hides after 2.5 s without scrolling
  const prog = document.querySelector<HTMLElement>('[data-gprog]');
  let progY = -1;
  let progTimer = 0;
  const wakeProg = () => {
    prog?.classList.add('is-awake');
    clearTimeout(progTimer);
    progTimer = window.setTimeout(() => prog?.classList.remove('is-awake'), 2500);
  };
  const poseOf = (it: Item, u: number): Pose => (it.m.ring ?? placeholder.ring!)(u, ctx);

  /** snap to whole states for reduced motion; connections switch at their middle */
  const snap = (it: Item, u: number) => {
    if (!reduced) return u;
    if (u < -it.def.tin) return -99; // not reached yet: nothing of it shows
    if (u < 0) return u < -it.def.tin / 2 ? -it.def.tin : 0;
    if (u > it.end) return u - it.end < 0.15 ? it.end : it.end + 1; // leaving: fully out
    return Math.min(it.def.states - 1, Math.round(u));
  };

  const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.site-nav a, .menu__list a')];
  let chapter: string | null = null;
  const setChapter = (href: string) => {
    if (href === chapter) return;
    chapter = href;
    navLinks.forEach((a) => {
      if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };
  // QA HE-06: the hash follows the section (replaceState: no history entries); S01 has none
  let hash: string | null = null;
  const setHash = (next: string) => {
    if (next === hash) return;
    const first = hash === null;
    hash = next;
    // the first frame must not wipe a deep link before motion.ts has followed it
    if (first && location.hash) return;
    if (location.hash !== next) history.replaceState(history.state, '', location.pathname + location.search + next);
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

    /* QA27 G-19: pictures two sections ahead are fetched, one section ahead decoded (both ways) */
    for (let i = Math.max(0, ci - 2); i <= Math.min(items.length - 1, ci + 2); i++) {
      const it = items[i];
      if (!it.fetched) {
        it.fetched = true;
        fetchPictures(it.scene, (e) => !isStill(e));
      }
      if (!it.decoded && Math.abs(i - ci) <= 1) {
        it.decoded = true;
        decodePictures(it.scene);
      }
      // the ring stills only where they can show: no 3D ring (yet), around the current section
      if (!ring && !it.stills && Math.abs(i - ci) <= 1) {
        it.stills = true;
        fetchPictures(it.scene, isStill);
      }
    }

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
    // D-136: 02 → 03 is a plain scroll; the dark rises behind the content in 15–60% of it
    const nightRise = !reduced && inConn && prev?.def.id === 'why' && cur.def.id === 'sleep';
    const mid = inConn && prev ? (nightRise ? seg(tinX, 0.15, 0.6) : seg(tinX, 0.3, 0.7)) : 1;
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
      // D-093: Dusk → Paper as light sweeping down (Stage .stage__wipe): Paper, Sand, a warm
      // edge over the Dusk glow. A masked dissolve or a straight mix passes through a grey band.
      duskO = k < 0.999 ? 1 : 0;
      wipeY = -300 + 300 * k;
      wipeTone = 'warm';
    } else if (nightRise) {
      // D-136: Paper → Night as a warm Cocoa gradient rising from below behind the S02 page that
      // scrolls away (reference video); only tokens, never a grey mix of Paper and Night
      if (k < 0.999) bgEl.style.backgroundColor = `rgb(${BG.paper.join(' ')})`;
      wipeY = 100 - 300 * k;
      wipeTone = 'rise-cocoa';
    } else if (inConn && prev && cur.def.id === 'close' && !isDark(prev.def.bg)) {
      // D-098: Sand → Night for the closing canvas: night rises from below with a warm Ember edge
      if (k < 0.999) bgEl.style.backgroundColor = `rgb(${BG[prev.def.bg].join(' ')})`;
      wipeY = 100 - 300 * k;
      wipeTone = 'rise';
    } else if (inConn && prev && prev.def.bg === 'night' && !isDark(cur.def.bg)) {
      // D-096: Night → Paper (08 → 09) the same way, light sweeping down, with a plain Sand edge
      if (k < 0.999) bgEl.style.backgroundColor = `rgb(${BG.night.join(' ')})`;
      wipeY = -300 + 300 * k;
      wipeTone = 'plain';
    } else if (inConn && prev && cur.def.bg === 'dusk' && prev.def.bg !== 'dusk') {
      const p = -20 + 140 * k; // dusk edge moves up
      mask = `linear-gradient(to top, #000 ${(p - 20).toFixed(1)}%, transparent ${(p + 20).toFixed(1)}%)`;
    }
    duskEl.style.opacity = duskO.toFixed(3);
    const wv = wipeY === null || (wipeTone.startsWith('rise') ? wipeY <= -199.99 : wipeY >= -0.01) ? 'hidden' : 'visible';
    if (wipeEl.style.visibility !== wv) wipeEl.style.visibility = wv;
    if (wipeY !== null && wipeEl.dataset.tone !== wipeTone) wipeEl.dataset.tone = wipeTone;
    if (wipeY !== null) wipeEl.style.transform = `translate3d(0, ${wipeY.toFixed(2)}lvh, 0)`;
    if (duskEl.style.maskImage !== mask) {
      duskEl.style.maskImage = mask;
      duskEl.style.webkitMaskImage = mask;
    }
    // D-136: the navbar turns dark only once the dark of the ramp has reached the top of the screen
    // (thresholds follow the geometry of Stage .stage__wipe: rising 100 → −200 lvh, light −300 → 0)
    let dark = (prev && inConn && isDark(prev.def.bg) ? 1 - k : 0) + (isDark(cur.def.bg) ? k : 0) > 0.5;
    if (wipeY !== null && wipeTone.startsWith('rise')) dark = k > 0.65;
    else if (wipeY !== null) dark = k < 0.4;
    const theme = (!inConn && cur.m.theme?.(u)) || (dark ? 'dark' : 'light');
    if (nav && nav.dataset.theme !== theme) nav.dataset.theme = theme;
    if (document.documentElement.dataset.surface !== theme) document.documentElement.dataset.surface = theme;

    /* clock: changes in the last 30% of a connection (Storyboard §3) */
    // QA G-15: in 02 → 03 the clock changes to 23:10 · Last night as the ground starts to go dark
    const switched = nightRise ? k >= 0.35 : tinX >= 0.7;
    const clockFrom = inConn && !switched && prev ? prev : cur;
    // QA HE-02: the global progress follows the same section as the clock and the navbar chapter
    const at0 = items.indexOf(clockFrom);
    if (Math.abs(y - progY) > 0.5) {
      if (progY >= 0) wakeProg();
      progY = y;
    }
    if (at0 !== progAt) {
      progAt = at0;
      progDots.forEach((p, i) => {
        p.classList.toggle('is-on', i === at0);
        // D-176: the current section, for assistive tech too
        if (i === at0) p.setAttribute('aria-current', 'location');
        else p.removeAttribute('aria-current');
      });
    }
    const d = clockFrom.def;
    let min = toMin(d.time);
    if (d.timeEnd) {
      const span = clockFrom === cur ? clamp01(u / Math.max(0.001, cur.end)) : 1;
      min = lerp(toMin(d.time), toMin(d.timeEnd), span);
    }
    let text = fmt(Math.floor(min / 5) * 5);
    if (clockFrom.m.clock) text = clockFrom.m.clock(clockFrom === cur ? u : clockFrom.end);
    let part = d.part ?? partOf(toMin(text));
    const own = inConn ? cur.m.clockIn?.(tinX) : null;
    if (own) {
      text = own;
      part = partOf(toMin(own));
    }
    // D-138: in S04 and its lens the navbar time and daypart change with a short upward move
    const rollClock = !reduced && (cur.def.id === 'activity' || (prev?.def.id === 'activity' && inConn));
    clockTime.forEach((el) => {
      if (el.textContent === text) return;
      el.textContent = text;
      if (rollClock) el.animate([{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    });
    clockPart.forEach((el) => {
      if (el.textContent === part) return;
      el.textContent = part;
      if (rollClock) el.animate([{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    });

    /* navbar chapter + URL hash follow the same section as the clock */
    const at = clockFrom.def.id;
    setChapter(CHAPTER[at] ?? '');
    setHash(at === 'hero' ? '' : at === 'close' && clockFrom === cur && u >= 1.5 ? '#faq' : `#${at}`);

    /* ring */
    if (ring || priming) {
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
      if (!ring) primed = { pose, breathe };
      else if (key !== lastPoseKey) {
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
    // the ring stage resizes (and clears) its canvas after this listener: draw once more
    requestAnimationFrame(() => (lastPoseKey = ''));
  };
  window.addEventListener('resize', onResize);
  mq.addEventListener('change', onResize);
  document.fonts?.ready.then(onResize);
  opts.subscribe(frame);

  return {
    frame,
    async setRing(r: RingStage) {
      // D-191: programs and textures of the first frame are prepared in short turns, then it is drawn
      priming = r;
      frame();
      if (primed) await r.prime(primed.pose, { breathe: primed.breathe }).catch(() => {});
      priming = null;
      ring = r;
      lastPoseKey = '';
      frame(); // first frame with the real pose, finish and env; the canvas fades in over 0.9 s
      document.documentElement.classList.add('ring-ready');
      setTimeout(() => document.documentElement.classList.add('ring-live'), 1000);
      // QA27 G-19: every pose the story can ask for (sections, connections, both S10 options that
      // change the shader), so the ring stage compiles its shader variants in idle time, not on scroll.
      // Sampled finely: a variant can exist for a few hundredths of a screen only (lights crossing over)
      setTimeout(async () => {
        const poses: Pose[] = [];
        // D-191: one section per turn (≈ 3000 poses were built in a single 80 ms task on a phone)
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const prev = items[i - 1];
          if (prev && it.def.tin) {
            const from = poseOf(prev, prev.end);
            const to = poseOf(it, 0);
            for (let x = 0; x <= 1.0001; x += 0.01) poses.push(it.m.ringIn ? it.m.ringIn(Math.min(1, x), ctx, from, to) : lerpPose(from, to, seg(x, 0.3, 0.7)));
          }
          for (let u = 0; u <= it.end + 0.0001; u += 0.02) poses.push(poseOf(it, Math.min(it.end, u)));
          if (it.def.id === 'finishes') {
            const p = poseOf(it, 0);
            for (const fin of [0, 1, 2]) for (const lamp of [0, 1]) poses.push({ ...p, custom: 1, finA: fin, finB: fin, finT: 0, lamp });
          }
          await new Promise((next) => setTimeout(next, 0));
        }
        r.prewarm(poses);
      }, 1400);
    },
  };
}
