/**
 * S03 corner light (D-136), painted once per size into a canvas instead of CSS gradients.
 * The CSS version (radial glow + conic wedge + radial mask + blur 30 px) banded on the dark
 * background: an 8-bit gradient at a few % alpha has only a handful of steps, and the blur of the
 * wedge's end left a square-ish edge. Here the same shape is computed in floats, blurred in floats
 * (clamped edges, so no box edge) and written with triangular dither, so the steps vanish.
 * Shape and strength are the CSS ones (Sleep.astro history): colour --cocoa-300.
 */

interface Shape {
  /** corner glow: ellipse centre (fractions of the box) and radii (fractions of width / height) */
  glow: { cx: number; cy: number; rx: number; ry: number; a: number };
  /** wedge: apex (fractions), angles in CSS conic degrees (0 = up, clockwise) and its alpha */
  wedge: { ox: number; oy: number; from: number; s1: number; s2: number; s3: number; a: number };
}
const DESKTOP: Shape = {
  glow: { cx: 0.92, cy: 0, rx: 0.3, ry: 0.42, a: 0.42 },
  wedge: { ox: 0.94, oy: -0.06, from: 222, s1: 9, s2: 13, s3: 24, a: 0.3 },
};
const PHONE: Shape = {
  glow: { cx: 0.92, cy: 0, rx: 0.6, ry: 0.3, a: 0.42 },
  wedge: { ox: 0.96, oy: -0.04, from: 196, s1: 8, s2: 12, s3: 22, a: 0.3 },
};
const BLUR = 30; // px, as the CSS filter

function tokenRgb(token: string): [number, number, number] {
  const probe = document.createElement('i');
  probe.style.display = 'none';
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const m = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['0', '0', '0'];
  probe.remove();
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

/** three box passes ≈ a gaussian of the given sigma (in field px), edges clamped */
function blur(f: Float32Array, w: number, h: number, sigma: number) {
  const r = Math.max(1, Math.round((Math.sqrt((12 * sigma * sigma) / 3 + 1) - 1) / 2));
  const tmp = new Float32Array(f.length);
  const pass = (src: Float32Array, dst: Float32Array, horiz: boolean) => {
    const n = horiz ? w : h;
    const lines = horiz ? h : w;
    for (let l = 0; l < lines; l++) {
      const at = (i: number) => (horiz ? l * w + Math.min(n - 1, Math.max(0, i)) : Math.min(n - 1, Math.max(0, i)) * w + l);
      let acc = 0;
      for (let i = -r; i <= r; i++) acc += src[at(i)];
      for (let i = 0; i < n; i++) {
        dst[horiz ? l * w + i : i * w + l] = acc / (2 * r + 1);
        acc += src[at(i + r + 1)] - src[at(i - r)];
      }
    }
  };
  for (let k = 0; k < 3; k++) {
    pass(f, tmp, true);
    pass(tmp, f, false);
  }
}

export function paintCornerLight(canvas: HTMLCanvasElement, phone: boolean) {
  const W = Math.max(1, Math.round(canvas.clientWidth));
  const H = Math.max(1, Math.round(canvas.clientHeight));
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const S = phone ? PHONE : DESKTOP;
  const { glow: g, wedge: e } = S;

  // the alpha field at a quarter of the size (it is smooth; blur and dither do the rest)
  const q = 4;
  const w = Math.ceil(W / q);
  const h = Math.ceil(H / q);
  const f = new Float32Array(w * h);
  const ox = e.ox * W;
  const oy = e.oy * H;
  // CSS radial mask "circle" = farthest corner from the apex: 100% there
  const R = Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => Math.hypot(x - ox, y - oy)));
  // smoothstep on every fall-off: a linear fade that stops at Night leaves a kink you can see as a
  // faint edge on a good screen; easing the ends removes it
  const ss = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  const ramp = (t: number) => (t <= 0 ? 0 : t < e.s1 ? t / e.s1 : t <= e.s2 ? 1 : t < e.s3 ? 1 - (t - e.s2) / (e.s3 - e.s2) : 0);
  for (let j = 0; j < h; j++) {
    const Y = (j + 0.5) * q;
    for (let i = 0; i < w; i++) {
      const X = (i + 0.5) * q;
      const d = Math.hypot((X - g.cx * W) / (g.rx * W), (Y - g.cy * H) / (g.ry * H));
      const a1 = g.a * ss(1 - d);
      const dx = X - ox;
      const dy = Y - oy;
      let th = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = up, clockwise
      if (th < 0) th += 360;
      let rel = th - e.from;
      if (rel < 0) rel += 360;
      const rr = Math.hypot(dx, dy) / R;
      const mask = ss(1 - (rr - 0.35) / 0.5);
      const a2 = e.a * ss(ramp(rel)) * mask;
      f[j * w + i] = a1 + a2 * (1 - a1);
    }
  }
  blur(f, w, h, BLUR / q);

  // full size, bilinear from the field, triangular dither on the 8-bit alpha
  const [cr, cg, cb] = tokenRgb('--cocoa-300');
  const img = ctx.createImageData(W, H);
  const px = img.data;
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
      const a = (f[j0 * w + i0] * (1 - tx) + f[j0 * w + i1] * tx) * (1 - ty) + (f[j1 * w + i0] * (1 - tx) + f[j1 * w + i1] * tx) * ty;
      const o = (y * W + x) * 4;
      px[o] = cr;
      px[o + 1] = cg;
      px[o + 2] = cb;
      px[o + 3] = Math.max(0, Math.min(255, Math.round(a * 255 + Math.random() - Math.random())));
    }
  }
  ctx.putImageData(img, 0, 0);
}
