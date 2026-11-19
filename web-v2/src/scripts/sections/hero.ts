/**
 * S01 Hero — 06:50 (D-080): V1 hero look, V2 ring, Oryzo-style transition to Paper.
 * u: 0 state 1  V1 frame: photo, STILLWAY, tagline / features / price, statement. The ring floats
 *               in front of the wordmark and follows the mouse (fine pointer ≥ 720 px, as V1 / D-051);
 *               it breathes (the one autoplay loop).
 *  0 → 1        the text slides out (wordmark up, tagline/statement left, features/price right)
 *  1 → 2 state 3  the ring zooms in close, turning smoothly until the sensors show; the photo zooms
 *               OUT behind it (content/heroBg.ts)
 *  2 → 3 state 4  the ring zooms out, turning back to the centre at the size and pose of S02 state 1;
 *               the photo fades to Paper, the env swaps from the photo to the paper studio
 *  3 → 3.5      hold; "rhythm" (S02) starts to show
 */
import { gsap } from 'gsap';
import { put, seg, lerp, type Ctx } from '../anim';
import { along, pose, ANGLE, type Pose } from '../ring/poses';
import { heroBg } from '../../content/heroBg';
import { why } from './why';
import type { SectionMotion } from '../story';

let el: Record<string, HTMLElement | null> = {};
const mouse = { x: 0, y: 0 };
const tilt = { x: 0, y: 0 };
const canTilt = () => matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 720;

/** V1 float pose: centred, a little low, min(30vw, 62vh) wide; phones higher and 66vw */
const floatPose = (ctx: Ctx): Pose => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  return pose({
    x: 0,
    y: ctx.mobile ? 0.1 : -0.03,
    w: ctx.mobile ? 0.66 : Math.min(0.3, (0.62 * H) / W),
    ...ANGLE.threeQuarter,
    rz: -0.16, // V1 float roll (−9°)
    photo: 1,
  });
};

export const hero: SectionMotion = {
  init(root) {
    const q = (s: string) => root.querySelector<HTMLElement>(s);
    el = {
      photo: q('[data-h-photo]'),
      img: q('[data-h-img]'),
      glow: q('[data-h-glow]'),
      word: q('[data-h-word]'),
      tag: q('[data-h-tag]'),
      features: q('[data-h-features]'),
      price: q('[data-h-price]'),
      statement: q('[data-h-statement]'),
      foot: q('[data-h-foot]'),
    };
    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
    // V1 load intro: the photo settles, the letters rise (not for reduced motion)
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.timeline({ delay: 0.1 })
        .fromTo(el.img, { scale: 1.08 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
        .fromTo(root.querySelectorAll('.hero__char'), { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.045 }, 0.2)
        .fromTo([el.tag, el.features, el.price, el.statement, el.foot], { opacity: 0 }, { opacity: 1, duration: 0.9, stagger: 0.08, clearProps: 'opacity' }, 0.9);
    }
  },
  update(u, ctx) {
    // 0 → 1: the text slides out
    const k = seg(u, 0.05, 0.9);
    put(el.word, { o: 1 - k, yv: -0.16 * k }, ctx);
    put(el.tag, { o: 1 - k, x: -90 * k }, ctx);
    put(el.features, { o: 1 - k, x: 90 * k }, ctx);
    put(el.price, { o: 1 - k, x: 90 * k }, ctx);
    put(el.statement, { o: 1 - k, x: -120 * k }, ctx);
    put(el.foot, { o: 1 - seg(u, 0.05, 0.5) }, ctx);

    // 1 → 2: the photo zooms out behind the ring; 2 → 3: it fades to Paper
    const z = lerp(1, ctx.mobile ? heroBg.mobile.zoomTo : heroBg.desktop.zoomTo, seg(u, 0.9, 2.2));
    put(el.photo, { o: 1 - seg(u, 2.05, 2.8), s: z }, ctx);
    put(el.glow, { o: seg(u, 2.4, 3) * (1 - seg(u, 3.5, 4.1)) }, ctx);
  },
  theme: (u) => (u < 2.45 ? 'photo' : null),
  ring(u, ctx: Ctx) {
    const m = ctx.mobile;
    const end = why.ring!(0, ctx); // = S02 state 1 (frame end = frame start)
    const p = along(u, [
      [0, floatPose(ctx)],
      [0.9, pose({ ...floatPose(ctx), y: m ? 0.12 : 0.01, w: m ? 0.72 : 0.33, rx: -0.4, ry: -0.62, rz: -0.06, uncap: 1 })],
      // close-up (s01-state3-zoom-in.png): opening toward the camera, the sensors and the green
      // light on the inner wall, the band running off the edge
      [2, pose({ x: m ? 0.34 : 0.12, y: 0.02, w: m ? 1.9 : 0.95, rx: -0.3, ry: -0.42, rz: 0.1, spin: -0.3, photo: 1, uncap: 1, led: 0.6 })],
      [2.4, pose({ x: m ? 0.1 : 0.07, y: 0.02, w: m ? 1.3 : 0.62, rx: -0.24, ry: -0.6, rz: 0.06, spin: -0.15, photo: 0.4, uncap: 1, led: 0.2 })],
      [3, end],
    ]);
    // mouse tilt in state 1 only (V1 heroRing: ±0.22 / ±0.32 rad, eased)
    const w = 1 - seg(u, 0, 0.8);
    const tk = canTilt() && !ctx.reduced ? 1 : 0;
    tilt.x += (mouse.y * 0.22 * tk - tilt.x) * 0.06;
    tilt.y += (mouse.x * 0.32 * tk - tilt.y) * 0.06;
    const bob = Math.sin(performance.now() / 1000 * 1.3) * 0.008 * w * (ctx.reduced ? 0 : 1);
    return { ...p, rx: p.rx + tilt.x * w, ry: p.ry + tilt.y * w, y: p.y + bob, photo: u < 2.4 ? 1 : p.photo };
  },
};

