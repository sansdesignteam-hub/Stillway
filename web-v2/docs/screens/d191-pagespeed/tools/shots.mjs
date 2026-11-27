// node shots.mjs <base> <outDir> [desktop|mobile|both] — one screenshot per main state of every section
import { chromium } from 'playwright-core'; import fs from 'fs';
const [base, out, which = 'both'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const SECT = [['hero', 4, 0], ['why', 4, 0.6], ['sleep', 4, 2.5], ['activity', 5, 2], ['insight', 4, 1], ['details', 8, 1], ['specs', 7, 1.6], ['features', 4, 1], ['app', 7, 1], ['finishes', 2, 1.3], ['close', 4, 1]];
const b = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--window-position=0,0', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'] });
for (const [label, w, h, dpr, mobile] of [['desktop', 1440, 900, 1, false], ['mobile', 375, 812, 2, true]]) {
  if (which !== 'both' && which !== label) continue;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => document.documentElement.classList.contains('ring-live'), null, { timeout: 30000 });
  await p.waitForTimeout(6000); // prewarm, late envs, the table
  const shot = (name) => p.screenshot({ path: `${out}/${label}-${name}.png` });
  if (!mobile) { await p.mouse.move(w * 0.8, h * 0.3); await p.waitForTimeout(2500); await shot('hero_hover'); await p.mouse.move(w * 0.5, h * 0.5); await p.waitForTimeout(2500); }
  for (const [id, states, tin] of SECT) {
    const us = []; if (tin) us.push(-tin / 2); for (let s = 0; s < states; s++) us.push(s);
    for (const u of us) {
      await p.evaluate(([id, u]) => { const t = document.getElementById(id); const vh = document.documentElement.clientHeight; const top = t.getBoundingClientRect().top + scrollY; window.scrollTo({ top: top + (u + Number(t.dataset.tin || 0)) * vh, behavior: 'instant' }); }, [id, u]);
      await p.waitForTimeout(1600);
      await shot(`${id}_${u}`);
    }
  }
  await ctx.close();
}
await b.close();
