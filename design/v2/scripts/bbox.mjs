import { chromium } from 'playwright-core';
// ring screen bbox at rest incl. extreme tilts, wordmark rect, per viewport
const vps = [[1280,720],[1366,768],[1440,800],[1440,900],[1680,1050],[1920,1080],[375,812]];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'] });
const out = [];
for (const [w, h] of vps) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('http://localhost:4399/?inspect', { waitUntil: 'networkidle' }); await p.waitForTimeout(3000);
  const r = await p.evaluate(([w]) => {
    const mob = w <= 719; let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
    for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) {
      const pz = window.__heroRing(0, mob); if (!mob) { pz.tiltX = sx * 0.22 * 0.5; pz.tiltY = sy * 0.32; }
      const bb = window.__ringScreenBox(pz); L = Math.min(L, bb.l); T = Math.min(T, bb.t); R = Math.max(R, bb.r); B = Math.max(B, bb.b);
    }
    window.__ringScreenBox(window.__heroRing(0, mob));
    const wr = document.querySelector('.hero__word-inner').getBoundingClientRect();
    return { ring: { l: Math.round(L), t: Math.round(T), r: Math.round(R), b: Math.round(B) }, word: { l: Math.round(wr.left), t: Math.round(wr.top), r: Math.round(wr.right), b: Math.round(wr.bottom) }, font: getComputedStyle(document.querySelector('.hero__word')).fontSize };
  }, [w]);
  r.gapX = r.ring.l - r.word.r; r.gapY = r.ring.t - r.word.b; r.vp = `${w}x${h}`;
  r.ok = w <= 719 ? r.gapY >= 0 || r.gapX >= 32 : r.gapX >= 32;
  out.push(r); console.log(JSON.stringify(r));
  await p.close();
}
await b.close();
