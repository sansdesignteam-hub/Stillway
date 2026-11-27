import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'] });
for (const [w, h, mob] of [[1440, 900, false], [375, 812, true]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('http://localhost:4399/?inspect', { waitUntil: 'networkidle' }); await p.waitForTimeout(3500);
  for (const base of [true, false]) { const r = await p.evaluate(([mob, base]) => { let min = Infinity, at = -1, n = 0, rest0 = null; for (let i = 0; i <= 400; i++) { const u = (i / 400) * 3; const pz = window.__heroRing(u, mob); if (base) pz.fwd = 0; const c = window.__ringClearance(pz); if (i === 0) { rest0 = c; continue; } if (c !== null) { n++; if (c < min) { min = c; at = u; } } } window.__ringClearance(window.__heroRing(0, mob)); return { restContact_mm: rest0 * 1000, minAfterRest_mm: min * 1000, at_u: at, overlapSamples: n }; }, [mob, base]);
  console.log(w, base ? 'BEFORE (fwd 0)' : 'AFTER', JSON.stringify(r)); }
}
await b.close();
