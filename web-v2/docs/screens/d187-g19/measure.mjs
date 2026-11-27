// node perf.mjs <base> <out.json> [desktop|mobile|both]
import { chromium } from 'playwright-core'; import fs from 'fs';
const [base, out, which = 'both'] = process.argv.slice(2);
const b = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--window-position=0,0','--enable-precise-memory-info','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding'] });
const res = {};
for (const [label, w, h, dpr, throttle, mobile] of [['desktop', 1440, 900, 2, 1, false], ['mobile', 375, 812, 3, 4, true]]) {
  if (which !== 'both' && which !== label) continue;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable'); let imgBytes = 0, imgN = 0, allBytes = 0; const types = new Map();
  cdp.on('Network.responseReceived', (e) => types.set(e.requestId, e.type));
  let counting = true;
  cdp.on('Network.loadingFinished', (e) => { if (!counting) return; allBytes += e.encodedDataLength; if (types.get(e.requestId) === 'Image') { imgBytes += e.encodedDataLength; imgN++; } });
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForFunction(() => document.documentElement.classList.contains('ring-live'), null, { timeout: 30000 });
  await p.waitForTimeout(5000);
  counting = false;
  const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); return +((await p.evaluate(() => performance.memory.usedJSHeapSize)) / 1048576).toFixed(1); };
  const r = { initial: { imgBytes, imgN, allBytes, heapMB: await heap() }, passes: [] };
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(1500);
    const data = await p.evaluate(() => new Promise((done) => {
      const tracks = [...document.querySelectorAll('.track')].map((t) => ({ id: t.id, top: t.getBoundingClientRect().top + scrollY, tin: Number(t.dataset.tin || 0) }));
      const vh = document.documentElement.clientHeight; const max = document.documentElement.scrollHeight - innerHeight;
      const rows = []; let y = 0, last = performance.now();
      const f = (n) => { const dt = n - last; last = n; let id = tracks[0].id, u = 0; for (const t of tracks) if (y >= t.top - 0.5) { id = t.id; u = (y - t.top) / vh - t.tin; } rows.push([id, +u.toFixed(2), +dt.toFixed(1)]); y += 16; if (y >= max) return done(rows); window.scrollTo({ top: y, behavior: 'instant' }); requestAnimationFrame(f); };
      requestAnimationFrame(f);
    }));
    r.passes.push(data);
  }
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  r.afterHeapMB = await heap();
  res[label] = r; await ctx.close();
}
await b.close();
fs.writeFileSync(out, JSON.stringify(res));
const q = (a, f) => a[Math.min(a.length - 1, Math.floor(a.length * f))];
for (const [label, r] of Object.entries(res)) {
  console.log(`\n== ${label}: initial images ${(r.initial.imgBytes/1e6).toFixed(2)} MB / ${r.initial.imgN} files, all ${(r.initial.allBytes/1e6).toFixed(2)} MB, heap ${r.initial.heapMB} MB → after scroll ${r.afterHeapMB} MB`);
  r.passes.forEach((rows, i) => {
    const by = {}; for (const [id, u, dt] of rows.slice(1)) (by[id] ??= []).push([dt, u]);
    console.log(` pass ${i + 1}: section  n  median  p95  max(@u)  >50ms  >20ms`);
    for (const [id, a] of Object.entries(by)) { const d = a.map((x) => x[0]).sort((x, y) => x - y); const mx = a.reduce((m, x) => (x[0] > m[0] ? x : m)); console.log(`  ${id.padEnd(9)} ${String(d.length).padStart(4)} ${q(d, .5).toFixed(1).padStart(6)} ${q(d, .95).toFixed(1).padStart(6)} ${mx[0].toFixed(0).padStart(5)}@${mx[1]}  ${String(d.filter((x) => x > 50).length).padStart(3)} ${String(d.filter((x) => x > 20).length).padStart(4)}`); }
    const big = rows.slice(1).filter((x) => x[2] > 40).map((x) => `${x[0]}@${x[1]}:${x[2]}`); console.log('  frames >40ms:', big.join(' '));
  });
}
