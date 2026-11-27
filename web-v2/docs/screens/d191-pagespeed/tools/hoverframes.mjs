// frame times in the hero for 5 s from the first pointer movement (desktop), and from the first touch scroll (mobile-like wheel)
import { chromium } from 'playwright-core';
const [base] = process.argv.slice(2);
const b = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--window-position=0,0', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'] });
for (const thr of [1, 4]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForFunction(() => document.documentElement.classList.contains('ring-live')); await p.waitForTimeout(6000);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: thr });
  await p.evaluate(() => { window.__ft = []; let last = performance.now(); const f = (n) => { window.__ft.push(+(n - last).toFixed(1)); last = n; requestAnimationFrame(f); }; requestAnimationFrame(f); });
  await p.waitForTimeout(1000);
  const n0 = await p.evaluate(() => window.__ft.length);
  for (let i = 0; i < 40; i++) { await p.mouse.move(400 + i * 15, 300 + i * 5); await p.waitForTimeout(50); }
  await p.waitForTimeout(3000);
  const ft = await p.evaluate(() => window.__ft); const idle = ft.slice(5, n0), act = ft.slice(n0);
  const st = (a) => { const s = a.slice().sort((x, y) => x - y); return `n ${a.length} median ${s[s.length >> 1]} p95 ${s[Math.floor(s.length * 0.95)]} max ${s[s.length - 1]} >20ms ${a.filter((x) => x > 20).length} >50ms ${a.filter((x) => x > 50).length}`; };
  console.log(`cpu ${thr}x  idle before move: ${st(idle)}\n        5 s from first move: ${st(act)}  slow: ${act.filter((x) => x > 20).join(' ')}`);
  await ctx.close();
}
await b.close();
