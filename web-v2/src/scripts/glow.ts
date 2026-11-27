/**
 * One light painter for the dark sections (D-136 S03 corner light, D-138 S04 Day arc, D-139: the same
 * colour — --cocoa-300 — and the same technique everywhere; each section keeps its own shape).
 *
 * Why a canvas: a CSS radial/conic gradient at a few % alpha over Night has only a handful of 8-bit
 * steps and bands on a good screen, and a CSS blur of a clipped shape leaves a box edge. Here every
 * shape is evaluated in floats (soft fall-offs), composited source-over (premultiplied), optionally
 * blurred in floats with clamped edges, and written with triangular dither. Painted once per size.
 *
 * Coordinates: ellipses in the 1440 × 900 design frame (x by width, y by height of the canvas box);
 * the wedge apex in fractions of the box, its angles in CSS conic degrees (0 = up, clockwise).
 */

export interface GlowEllipse {
  /** CSS custom property of the colour; the lights use '--cocoa-300' (D-139) */
  token: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** [offset 0..1, alpha] along the normalised radius, linear between */
  stops: Array<[number, number]>;
  /** ease the fall-off with smoothstep (no visible kink where it reaches 0) */
  smooth?: boolean;
  /**
   * one curve instead of linear stops: alpha = stops[0] alpha × smoothstep(1 − d)^power. No slope
   * break anywhere (a middle stop leaves a faint ring you can see on a good screen)
   */
  power?: number;
}
export interface GlowWedge {
  token: string;
  /** apex, fractions of the box */
  ox: number;
  oy: number;
  /** CSS conic degrees: start, full from s1 to s2, gone at s3 (relative to `from`) */
  from: number;
  s1: number;
  s2: number;
  s3: number;
  a: number;
  /** radial fade from the apex, fractions of the farthest-corner distance: full until `in`, 0 at `out` */
  in: number;
  out: number;
}
export interface LightSpec {
  ellipses?: GlowEllipse[];
  wedge?: GlowWedge;
  /** float blur in px (sigma), clamped edges */
  blur?: number;
}

const tokenCache = new Map<string, [number, number, number]>();
export function tokenRgb(token: string): [number, number, number] {
  const hit = tokenCache.get(token);
  if (hit) return hit;
  const probe = document.createElement('i');
  probe.style.display = 'none';
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const m = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['0', '0', '0'];
  probe.remove();
  const rgb: [number, number, number] = [Number(m[0]), Number(m[1]), Number(m[2])];
  tokenCache.set(token, rgb);
  return rgb;
}

import { lightPixels, type ResolvedLight } from './glowPaint';

const resolve = (spec: LightSpec): ResolvedLight => ({
  spec,
  cols: (spec.ellipses ?? []).map((e) => tokenRgb(e.token)),
  wc: spec.wedge ? tokenRgb(spec.wedge.token) : [0, 0, 0],
});

/* D-191: the pixels are computed in a worker. Painting six full-screen lights at page load took the
   main thread for 50–110 ms each on a phone; the picture is the same maths (glowPaint.ts). Without
   workers it is computed here as before. */
let worker: Worker | null | undefined;
let seq = 0;
const jobs = new Map<number, (px: Uint8ClampedArray | null) => void>();
function pixelsOff(W: number, H: number, light: ResolvedLight): Promise<Uint8ClampedArray | null> {
  if (worker === undefined) {
    try {
      worker = new Worker(new URL('./glow.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        jobs.get(e.data.id)?.(e.data.px);
        jobs.delete(e.data.id);
      };
      worker.onerror = () => {
        worker = null;
        jobs.forEach((done) => done(null));
        jobs.clear();
      };
    } catch {
      worker = null;
    }
  }
  if (!worker) return Promise.resolve(null);
  const id = ++seq;
  return new Promise((done) => {
    jobs.set(id, done);
    worker!.postMessage({ id, W, H, light });
  });
}

/** the newest paint asked of each canvas: an older answer that arrives late is dropped */
const asked = new WeakMap<HTMLCanvasElement, number>();
let paintSeq = 0;
export async function paintLight(canvas: HTMLCanvasElement, spec: LightSpec) {
  const W = Math.max(1, Math.round(canvas.clientWidth));
  const H = Math.max(1, Math.round(canvas.clientHeight));
  const mine = ++paintSeq;
  asked.set(canvas, mine);
  const light = resolve(spec);
  const px = (await pixelsOff(W, H, light)) ?? lightPixels(W, H, light);
  if (asked.get(canvas) !== mine) return;
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.putImageData(new ImageData(px, W, H), 0, 0);
}

/**
 * Keep a canvas painted: now (idle) and again after a resize settles. `spec` may depend on the
 * breakpoint (phones get their own shape), so it is asked again on each paint.
 */
export function keepLit(canvas: HTMLCanvasElement, spec: () => LightSpec) {
  let key = '';
  let t = 0;
  const run = () => {
    const s = spec();
    const k = `${canvas.clientWidth}x${canvas.clientHeight}|${JSON.stringify(s).length}|${window.matchMedia('(max-width: 719px)').matches}`;
    if (k === key) return;
    key = k;
    paintLight(canvas, s);
  };
  ('requestIdleCallback' in window ? (window as any).requestIdleCallback : setTimeout)(run);
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = window.setTimeout(run, 150);
  });
}

/** D-139: the one light colour of the dark sections */
export const LIGHT = '--cocoa-300';
