import { chromium } from 'playwright-core';
// D-179/D-180 ring vs pedestal clearance: 400 u samples over the S01 path, each at the four extreme hover
// tilts plus none (desktop); min(ring vertex y − pedestal top) inside the pedestal's XZ footprint
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'] });
for (const [w, h, mob] of [[1440, 900, false], [375, 812, true]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('http://localhost:4399/?inspect', { waitUntil: 'networkidle' }); await p.waitForTimeout(3500);
  const r = await p.evaluate((mob) => {
    const seg = (u, a, b) => Math.min(1, Math.max(0, (u - a) / (b - a)));
    const tilts = mob ? [[0, 0]] : [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    const res = {};
    for (const [sx, sy] of tilts) {
      let restC = null, min = Infinity, at = -1;
      for (let i = 0; i <= 400; i++) {
        const u = (i / 400) * 3;
        const pz = window.__heroRing(u, mob);
        const w0 = 1 - seg(u, 0, 0.8);
        pz.tiltX = sx * 0.22 * 0.5 * w0; pz.tiltY = sy * 0.32 * w0;
        pz.rx += sx * 0.22 * w0 * (1 - pz.rest); pz.ry += sy * 0.32 * w0 * (1 - pz.rest);
        const c = window.__ringClearance(pz);
        if (c === null) continue;
        if (i === 0) { restC = c; continue; }
        if (c < min) { min = c; at = u; }
      }
      res[`tilt(${sx},${sy})`] = { rest_mm: +(restC * 1000).toFixed(4), minAfterRest_mm: min === Infinity ? null : +(min * 1000).toFixed(4), at_u: +at.toFixed(4) };
    }
    window.__ringClearance(window.__heroRing(0, mob));
    return res;
  }, mob);
  console.log(`${w}x${h}`, JSON.stringify(r));
}
await b.close();
