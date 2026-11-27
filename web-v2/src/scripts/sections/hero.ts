/**
 * S01 Hero — 06:50 (D-080): V1 hero look, V2 ring, Oryzo-style transition to Paper.
 * u: 0 state 1  D-179: photo, Stillway wordmark, intro bottom-right, scroll hint bottom-left. The ring floats
 *               in front of the wordmark and follows the mouse (fine pointer ≥ 720 px, as V1 / D-051);
 *               it breathes (the one autoplay loop).
 *  0 → 1        the text slides out (wordmark up, intro right, scroll hint fades)
 *  1 → 2 state 3  the ring zooms in close, turning smoothly until the sensors show; the photo zooms
 *               OUT behind it (content/heroBg.ts)
 *  2 → 3 state 4  the ring zooms out, turning back to the centre at the size and pose of S02 state 1;
 *               the photo fades to Paper, the env swaps from the photo to the paper studio
 *  3 → 3.5      hold; "rhythm" (S02) starts to show
 */
import { view } from '../viewport';
import { gsap } from 'gsap';
import { put, seg, lerp, type Ctx } from '../anim';
import { along, pose, type Pose } from '../ring/poses';
import { heroBg } from '../../content/heroBg';
import { why } from './why';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
const mouse = { x: 0, y: 0 };
const tilt = { x: 0, y: 0 };
/** D-182: start of the reflection movement (s), set once the poster has cross-faded, so it begins at 0 */
let envT0 = 0;
/** D-185: pause after the cross-fade and the length of the highlight's fade-in (s) */
const GLINT_DELAY = 0.15;
const GLINT_IN = 1.6;
/** pitch share of the tilt while resting (yaw is full): keeps the band on the pedestal */
const REST_PITCH = 0.5;
const canTilt = () => matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 720;

/**
 * V1 float pose (web/src/scripts/heroRing.ts + motion.ts), same place and angle as V1 (D-081):
 * centred, a little low, min(30vw, 62vh) wide (phones higher, 66vw); orientation = V1 photo pose
 * (theta 66°, phi 50°, psi 0) with the −9° float roll, converted to this stage's Euler (YXZ).
 * With psi 0 (3D Designer, HANDOFF-v2-ring "S01 silver polished") the engraved side is on the
 * near band and "Stillway" reads left → right, descending with the band (D-081; replaces the
 * bottom → top reading of D-075 for S01). Polished V1 silver, V1 env and rig, and the
 * live shadow on the stone (D-051/D-052).
 */
const V1 = { rx: -0.6977, ry: 0.5757, rz: -2.3613 };
const LOGO_FRONT = 0; // psi 0
/** the photo's CSS zoom (D-177), shared with the 3D desk so the pedestal zooms with the photo */
const photoZoom = (u: number, ctx: Ctx) => lerp(ctx.mobile ? heroBg.mobile.zoomFrom : heroBg.desktop.zoomFrom, 1, seg(u, 0.9, 2.2));
/**
 * D-179 state 1: the ring stands on the 3D pedestal in the 3D Designer's pose (rest 1, stage.ts takes
 * the pose from s01-pedestal-pose.json) and casts its shadow over the pedestal and the desk, on
 * phones too (it rests on the pedestal, so the shadow is a contact shadow, not a ring floating
 * high above a surface). x / y / w / r* below are the lift-off float pose it rises into (0 → 0.9).
 */
const floatPose = (ctx: Ctx): Pose => {
  const W = window.innerWidth;
  const H = view.h;
  return pose({
    x: 0,
    y: ctx.mobile ? 0.1 : -0.03,
    w: ctx.mobile ? 0.66 : Math.min(0.3, (0.62 * H) / W),
    ...V1,
    spin: LOGO_FRONT,
    photo: 1,
    gloss: 1,
    shadow: 1,
    desk: 1,
    rest: 1,
  });
};

if (import.meta.env.DEV && typeof location !== 'undefined' && new URLSearchParams(location.search).has('inspect'))
  (window as any).__heroRing = (u: number, mobile: boolean) => hero.ring!(u, { mobile, reduced: true } as Ctx);

export const hero: SectionMotion = {
  init(root) {
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    el = {
      photo: q('[data-h-photo]'),
      img: q('[data-h-img]'),
      word: q('[data-h-word]'),
      statement: q('[data-h-statement]'),
      foot: q('[data-h-foot]'),
    };
    // D-180: the wordmark stays fully readable left of the ring (departs from Figma on purpose)
    const fitWord = () => {
      const word = el.word;
      if (!word) return;
      const W = window.innerWidth;
      const H = view.h;
      if (W <= 760) {
        word.style.fontSize = '';
        return;
      }
      const cw = Math.max(W, view.lh * heroBg.v1Ratio);
      const ax = (heroBg.anchor.x - 0.5) * cw;
      const z = heroBg.desktop.zoomFrom; // the rest frame (u 0)
      const ringLeft = W / 2 + ax + ((heroBg.ringLeft - 0.5) * cw - ax) * z;
      const left = word.getBoundingClientRect().left;
      const EM = 3.0665; // "Stillway" width in em with the Figma tracking
      word.style.fontSize = `${Math.max(64, Math.min(193.59, (ringLeft - heroBg.wordGap - left) / EM)).toFixed(2)}px`;
    };
    fitWord();
    window.addEventListener('resize', fitWord);
    document.fonts?.ready.then(fitWord);
    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / view.h) * 2 - 1;
    });
    // V1 load intro: the photo settles, the letters rise (not for reduced motion)
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.timeline({ delay: 0.1 })
        // D-179: no settle-zoom on the photo any more: the 3D pedestal stands on it and must not slide
        .fromTo(root.querySelectorAll('.hero__char'), { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.045 }, 0.2)
        .fromTo([el.statement, el.foot], { opacity: 0 }, { opacity: 1, duration: 0.9, stagger: 0.08, clearProps: 'opacity' }, 0.9);
    }
  },
  update(u, ctx) {
    // 0 → 1: the text slides out
    const k = seg(u, 0.05, 0.9);
    put(el.word, { o: 1 - k, yv: -0.16 * k }, ctx);
    put(el.statement, { o: 1 - k, x: 120 * k }, ctx); // intro bottom-right slides right
    put(el.foot, { o: 1 - seg(u, 0.05, 0.5) }, ctx);

    // 1 → 2: the photo zooms out behind the ring (D-177: from a little zoomed in down to cover, around
    // the pedestal, so no edge ever shows); 2 → 3: it fades to Paper
    put(el.photo, { o: 1 - seg(u, 2.05, 2.8), s: photoZoom(u, ctx) }, ctx);
  },
  theme: (u) => (u < 2.45 ? 'photo' : null),
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const end = why.ring!(0, ctx); // = S02 state 1 (frame end = frame start)
    const p = along(u, [
      [0, floatPose(ctx)],
      [0.9, pose({ ...floatPose(ctx), y: m ? 0.12 : 0.01, w: m ? 0.72 : 0.34, rx: -0.55, ry: 0.15, rz: -1.2, spin: 0.2, uncap: 1, rest: 0, fwd: 0.35 })],
      // close-up (s01-state3-zoom-in.png): opening toward the camera, the sensors and the green
      // light on the inner wall, the band running off the edge
      [2, pose({ x: m ? 0.34 : 0.12, y: 0.02, w: m ? 1.9 : 0.95, rx: -0.3, ry: -0.42, rz: 0.1, spin: -0.3, photo: 1, desk: 1, shadow: 1, uncap: 1, led: 0.6, fwd: 0.5 })],
      [3, end],
    ]);
    // mouse tilt in state 1 only (V1 heroRing: ±0.22 / ±0.32 rad, eased)
    // no mouse tilt or bob while the ring stands on the pedestal (it lifts off from 0 to 0.9)
    // D-180: hover tilt again (production D-051/D-052 feel), also while resting: there stage.ts turns
    // the ring about its contact point (tiltX/tiltY). Starts after the poster cross-fade (ring-live),
    // eased in from zero by the same 0.06 follow; never on touch, phones or reduced motion.
    const w0 = 1 - seg(u, 0, 0.8);
    const w = w0 * (1 - p.rest);
    const live = document.documentElement.classList.contains('ring-live');
    const tk = canTilt() && !ctx.reduced && live ? 1 : 0;
    tilt.x += (mouse.y * 0.22 * tk - tilt.x) * 0.06;
    tilt.y += (mouse.x * 0.32 * tk - tilt.y) * 0.06;
    const bob = Math.sin(performance.now() / 1000 * 1.3) * 0.008 * w * (ctx.reduced ? 0 : 1);
    // D-182 reflections: the environment sways slowly and a little with the pointer, so the band stays
    // alive while the ring stands still; none for reduced motion, gone with the photo env
    const now = performance.now() / 1000;
    if (live && !envT0) envT0 = now;
    const et = envT0 && !ctx.reduced ? now - envT0 : 0;
    // D-185 desk-lamp highlight: only on the live ring, fading in after the 0.9 s poster cross-fade
    // (ring-live comes at 1 s), so the cross-fade has no tone change; it leaves as the ring lifts
    const glint = envT0 ? seg(now - envT0, GLINT_DELAY, GLINT_DELAY + GLINT_IN) * (1 - seg(u, 0.05, 0.85)) : 0;
    const envRot = (0.28 * Math.sin(et * 0.55) + 0.1 * Math.sin(et * 0.23) + tilt.y * 0.6) * w0;
    // zoom out (2 → 3): one eased segment for position/rotation (no keyframe in between, so no
    // stop-and-go); env photo → paper, exposure and the green light fade over the same stretch
    // (D-083). The finish stays polished throughout (D-085).
    const out = seg(u, 2, 2.95);
    return {
      ...p,
      envRot,
      glint,
      rx: p.rx + tilt.x * w,
      ry: p.ry + tilt.y * w,
      tiltX: tilt.x * w0 * REST_PITCH,
      tiltY: tilt.y * w0,
      y: p.y + bob,
      photo: u < 2 ? 1 : 1 - out,
      led: u < 2 ? p.led : 0.6 * (1 - seg(u, 2, 2.6)),
      uncap: u < 2 ? p.uncap : 1,
      // the pedestal leaves with the photo (same window as the CSS fade below), so S02 is unchanged
      desk: 1 - seg(u, 2.05, 2.8),
      // D-179: the ring stays in front of the 3D pedestal (toward the camera) until the pedestal has gone
      fwd: u < 2 ? p.fwd : 0.5 * (1 - seg(u, 2.75, 3)),
      deskZoom: photoZoom(u, ctx),
    };
  },
};

