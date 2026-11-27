import { chromium } from 'playwright-core';
const [url, n = '4', which = 'mobile'] = process.argv.slice(2);
const b = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--headless=new'] });
for (let i = 0; i < +n; i++) {
  const ctx = await b.newContext(which === 'mobile' ? { viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true } : { viewport: { width: 1350, height: 940 } }); const p = await ctx.newPage();
  await p.addInitScript(() => { window.__lcp = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp.push([Math.round(e.startTime), e.size, (e.element?.tagName ?? '?') + '.' + (e.element?.className ?? '').toString().slice(0, 24), (e.url || '').split('/').pop().slice(0, 44), Math.round(e.loadTime), Math.round(e.renderTime)]); }).observe({ type: 'largest-contentful-paint', buffered: true });
    window.__cls = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__cls.push([Math.round(e.startTime), +e.value.toFixed(4), e.sources.map((s) => (s.node?.tagName ?? '?') + '.' + (s.node?.className ?? '').toString().slice(0, 30)).join('+')]); }).observe({ type: 'layout-shift', buffered: true }); });
  await p.goto(url); await p.waitForTimeout(5000);
  console.log(JSON.stringify(await p.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }))));
  await ctx.close();
}
await b.close();
