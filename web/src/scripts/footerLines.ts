/**
 * Footer wordmark drawn as horizontal lines (after trionn.com).
 * The word is rasterised once, cut into rows, and each row is drawn as the runs
 * of ink it crosses. Under the pointer the rows slide aside and ease back.
 */
export function initFooterLines() {
  const box = document.querySelector<HTMLElement>('[data-footer-lines]');
  const canvas = box?.querySelector('canvas');
  const source = box?.querySelector<HTMLElement>('.footer__mark-text');
  if (!box || !canvas || !source) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  type Row = { y: number; runs: [number, number][]; off: number; vel: number };
  let rows: Row[] = [];
  let W = 0;
  let H = 0;
  let dpr = 1;
  let pointer: { x: number; y: number } | null = null;
  let frame = 0;

  const build = () => {
    W = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) * 2;
    if (W <= 0) return;
    const word = source.textContent || 'STILLWAY';
    const style = getComputedStyle(source);
    const family = style.fontFamily;
    // fit the word to the full width
    const probe = document.createElement('canvas').getContext('2d')!;
    probe.font = `600 100px ${family}`;
    const m = probe.measureText(word);
    const size = (W / m.width) * 100;
    const asc = size * 0.72; // cap height of Geist ≈ 0.72em
    H = Math.ceil(asc + 4);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const off = document.createElement('canvas');
    off.width = Math.ceil(W);
    off.height = H;
    const o = off.getContext('2d')!;
    o.fillStyle = '#000';
    o.font = `600 ${size}px ${family}`;
    o.textBaseline = 'alphabetic';
    o.fillText(word, -m.actualBoundingBoxLeft * (size / 100), asc + 2);
    const data = o.getImageData(0, 0, off.width, off.height).data;

    const gap = Math.max(6, Math.round(H / 20));
    rows = [];
    for (let y = Math.round(gap / 2); y < H; y += gap) {
      const runs: [number, number][] = [];
      let start = -1;
      for (let x = 0; x < off.width; x++) {
        const ink = data[(y * off.width + x) * 4 + 3] > 110;
        if (ink && start < 0) start = x;
        if (!ink && start >= 0) {
          runs.push([start, x]);
          start = -1;
        }
      }
      if (start >= 0) runs.push([start, off.width]);
      if (runs.length) rows.push({ y, runs, off: 0, vel: 0 });
    }
    draw();
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    for (const r of rows) {
      const lift = Math.min(1, Math.abs(r.off) / 30);
      ctx.strokeStyle = `rgba(243, 239, 232, ${0.55 + 0.45 * lift})`;
      ctx.beginPath();
      for (const [a, b] of r.runs) {
        // runs stretch a little toward the direction they are pushed
        const s = r.off;
        ctx.moveTo(a + s * 0.6, r.y + 0.5);
        ctx.lineTo(b + s, r.y + 0.5);
      }
      ctx.stroke();
    }
  };

  const tick = () => {
    let moving = false;
    for (const r of rows) {
      let target = 0;
      if (pointer) {
        const dy = (r.y - pointer.y) / 26;
        const fall = Math.exp(-dy * dy);
        target = fall * 42 * Math.sin(pointer.x / 90 + r.y / 30);
      }
      // a soft spring per row
      r.vel += (target - r.off) * 0.12;
      r.vel *= 0.78;
      r.off += r.vel;
      if (Math.abs(r.vel) > 0.02 || Math.abs(target - r.off) > 0.05) moving = true;
      else r.off = target;
    }
    draw();
    frame = moving || pointer ? requestAnimationFrame(tick) : 0;
  };
  const run = () => {
    if (!frame && !still) frame = requestAnimationFrame(tick);
  };

  box.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    run();
  });
  box.addEventListener('pointerleave', () => {
    pointer = null;
    run();
  });

  let resizeT = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeT);
    resizeT = window.setTimeout(build, 120);
  }).observe(box);
  (document.fonts?.ready ?? Promise.resolve()).then(build);
}
