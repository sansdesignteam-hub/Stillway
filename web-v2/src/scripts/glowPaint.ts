/**
 * The pixel maths of the light painter (glow.ts), free of the DOM so it can run in a worker
 * (glow.worker.ts, D-191) or on the main thread. Colours arrive resolved (RGB 0–255).
 */
import type { LightSpec } from './glow';

export interface ResolvedLight {
  spec: LightSpec;
  /** RGB of each ellipse's token, in order, and of the wedge's */
  cols: number[][];
  wc: number[];
}

const ss = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const alphaAt = (stops: Array<[number, number]>, t: number) => {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [o1, a1] = stops[i];
    if (t <= o1) {
      const [o0, a0] = stops[i - 1];
      return a0 + (a1 - a0) * ((t - o0) / (o1 - o0));
    }
  }
  return stops[stops.length - 1][1];
};

/** three box passes ≈ a gaussian (sigma in field px), edges clamped, on an interleaved RGBA field */
function blur4(f: Float32Array, w: number, h: number, sigma: number) {
  const r = Math.max(1, Math.round((Math.sqrt((12 * sigma * sigma) / 3 + 1) - 1) / 2));
  const tmp = new Float32Array(f.length);
  const pass = (src: Float32Array, dst: Float32Array, horiz: boolean) => {
    const n = horiz ? w : h;
    const lines = horiz ? h : w;
    const idx = (l: number, i: number) => {
      const c = Math.min(n - 1, Math.max(0, i));
      return (horiz ? l * w + c : c * w + l) * 4;
    };
    for (let l = 0; l < lines; l++) {
      for (let ch = 0; ch < 4; ch++) {
        let acc = 0;
        for (let i = -r; i <= r; i++) acc += src[idx(l, i) + ch];
        for (let i = 0; i < n; i++) {
          dst[idx(l, i) + ch] = acc / (2 * r + 1);
          acc += src[idx(l, i + r + 1) + ch] - src[idx(l, i - r) + ch];
        }
      }
    }
  };
  for (let k = 0; k < 3; k++) {
    pass(f, tmp, true);
    pass(tmp, f, false);
  }
}

/** the RGBA pixels (not premultiplied) of a W × H light */
export function lightPixels(W: number, H: number, { spec, cols, wc }: ResolvedLight): Uint8ClampedArray {
  const sx = W / 1440;
  const sy = H / 900;
  const ells = spec.ellipses ?? [];
  const we = spec.wedge;
  const ox = we ? we.ox * W : 0;
  const oy = we ? we.oy * H : 0;
  const R = we ? Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => Math.hypot(x - ox, y - oy))) : 1;
  const ramp = (t: number) => (!we || t <= 0 ? 0 : t < we.s1 ? t / we.s1 : t <= we.s2 ? 1 : t < we.s3 ? 1 - (t - we.s2) / (we.s3 - we.s2) : 0);

  // premultiplied RGBA field at a quarter of the size (the lights are smooth)
  const q = 4;
  const w = Math.ceil(W / q);
  const h = Math.ceil(H / q);
  const f = new Float32Array(w * h * 4);
  for (let j = 0; j < h; j++) {
    const Y = (j + 0.5) * q;
    for (let i = 0; i < w; i++) {
      const X = (i + 0.5) * q;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      const over = (c: number[], al: number) => {
        r = c[0] * al + r * (1 - al);
        g = c[1] * al + g * (1 - al);
        b = c[2] * al + b * (1 - al);
        a = al + a * (1 - al);
      };
      if (we) {
        const dx = X - ox;
        const dy = Y - oy;
        let th = (Math.atan2(dx, -dy) * 180) / Math.PI;
        if (th < 0) th += 360;
        let rel = th - we.from;
        if (rel < 0) rel += 360;
        const rr = Math.hypot(dx, dy) / R;
        const mask = ss(1 - (rr - we.in) / (we.out - we.in));
        const al = we.a * ss(ramp(rel)) * mask;
        if (al > 0) over(wc, al);
      }
      ells.forEach((e, n) => {
        const d = Math.hypot((X - e.cx * sx) / (e.rx * sx), (Y - e.cy * sy) / (e.ry * sy));
        if (d >= 1) return;
        const al = e.power ? e.stops[0][1] * Math.pow(ss(1 - d), e.power) : alphaAt(e.stops, e.smooth ? 1 - ss(1 - d) : d);
        if (al > 0) over(cols[n], al);
      });
      const o = (j * w + i) * 4;
      f[o] = r;
      f[o + 1] = g;
      f[o + 2] = b;
      f[o + 3] = a;
    }
  }
  if (spec.blur) blur4(f, w, h, spec.blur / q);

  const px = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) {
    const fy = Math.min(h - 1, Math.max(0, (y + 0.5) / q - 0.5));
    const j0 = Math.floor(fy);
    const j1 = Math.min(h - 1, j0 + 1);
    const ty = fy - j0;
    for (let x = 0; x < W; x++) {
      const fx = Math.min(w - 1, Math.max(0, (x + 0.5) / q - 0.5));
      const i0 = Math.floor(fx);
      const i1 = Math.min(w - 1, i0 + 1);
      const tx = fx - i0;
      const o00 = (j0 * w + i0) * 4;
      const o01 = (j0 * w + i1) * 4;
      const o10 = (j1 * w + i0) * 4;
      const o11 = (j1 * w + i1) * 4;
      const at = (k: number) => (f[o00 + k] * (1 - tx) + f[o01 + k] * tx) * (1 - ty) + (f[o10 + k] * (1 - tx) + f[o11 + k] * tx) * ty;
      const a = at(3);
      const o = (y * W + x) * 4;
      if (a <= 0.0005) {
        px[o + 3] = 0;
        continue;
      }
      // un-premultiply for ImageData; triangular dither on the alpha, ±2 alpha steps: over Night one
      // alpha step is only ≈ 0.7 of an output level, so ±1 left faint contour rings
      px[o] = Math.round(at(0) / a);
      px[o + 1] = Math.round(at(1) / a);
      px[o + 2] = Math.round(at(2) / a);
      px[o + 3] = Math.max(0, Math.min(255, Math.round(a * 255 + 2 * (Math.random() - Math.random()))));
    }
  }
  return px;
}
