import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--window-position=-2400,0'] });
const res = [];
for (const [label, w, h, throttle] of [['1440 desktop', 1440, 900, 1], ['1440 4x CPU throttle', 1440, 900, 4], ['375 mobile-size (12 taps)', 375, 812, 4]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
  await p.goto('http://localhost:4399/', { waitUntil: 'networkidle' }); await p.waitForTimeout(4000);
  const measure = (ms) => p.evaluate((ms) => new Promise((r) => { const t = []; let last = performance.now(); const end = last + ms; const f = (n) => { t.push(n - last); last = n; if (n < end) requestAnimationFrame(f); else { t.sort((a, b) => a - b); const avg = t.reduce((a, b) => a + b, 0) / t.length; r({ fps: +(1000 / avg).toFixed(1), avgMs: +avg.toFixed(2), p95Ms: +t[Math.floor(t.length * 0.95)].toFixed(2) }); } }; requestAnimationFrame(f); }), ms);
  const rest = await measure(3000);
  const mv = (async () => { for (let i = 0; i < 60; i++) { await p.mouse.move(100 + (i % 2) * 1200, 100 + ((i >> 1) % 2) * 700, { steps: 6 }); } })();
  const tilt = await measure(3000); await mv;
  res.push({ label, rest, tilt }); console.log(JSON.stringify({ label, rest, tilt }));
  await ctx.close();
}
await b.close();
