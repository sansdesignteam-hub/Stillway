import { chromium } from 'playwright-core';
export const launch = () => chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--window-position=0,0', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'] });
export async function open(b, base, w, h, dpr, mobile) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => document.documentElement.classList.contains('ring-live'), null, { timeout: 30000 });
  await p.waitForTimeout(6000);
  return { ctx, p, errs };
}
export const yOf = (p, id, u) => p.evaluate(([id, u]) => { const t = document.getElementById(id); const vh = document.documentElement.clientHeight; return t.getBoundingClientRect().top + scrollY + (u + Number(t.dataset.tin || 0)) * vh; }, [id, u]);
export async function go(p, id, u, wait = 1400) { const y = await yOf(p, id, u); await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(wait); }
