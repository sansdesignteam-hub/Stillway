// what runs on the main thread in the 6 s after the first pointer movement (real GPU, unminified build)
import { chromium } from 'playwright-core';
const [base, thr = '1'] = process.argv.slice(2);
const b = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--window-position=0,0'] });
const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForFunction(() => document.documentElement.classList.contains('ring-live')); await p.waitForTimeout(5000);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +thr });
const scroll = (limit) => p.evaluate((limit) => new Promise((done) => { const max = Math.min(limit, document.documentElement.scrollHeight - innerHeight); let y = 0, last = performance.now(); const slow = []; const f = (n) => { const dt = n - last; last = n; if (dt > 50) slow.push([y, Math.round(dt)]); y += 16; if (y >= max) return done(slow); window.scrollTo({ top: y, behavior: 'instant' }); requestAnimationFrame(f); }; requestAnimationFrame(f); }), limit);
const events = []; cdp.on('Tracing.dataCollected', (e) => events.push(...e.value));
await cdp.send('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { includedCategories: ['devtools.timeline', 'disabled-by-default-v8.cpu_profiler'] } });
const slow = await scroll(1e9); console.log('pass 1 slow frames (y, ms)', JSON.stringify(slow));
const done = new Promise((r) => cdp.once('Tracing.tracingComplete', r)); await cdp.send('Tracing.end'); await done; await b.close();
const byTid = {}; for (const e of events) if (e.name === 'FireAnimationFrame') byTid[e.pid + ':' + e.tid] = (byTid[e.pid + ':' + e.tid] ?? 0) + 1;
const [pid, tid] = Object.entries(byTid).sort((a, b) => b[1] - a[1])[0][0].split(':').map(Number);
const main = events.filter((e) => e.pid === pid && e.tid === tid && e.ph === 'X').sort((a, b) => a.ts - b.ts); const t0 = main[0].ts;
const prof = events.find((e) => e.name === 'Profile' && e.pid === pid && e.tid === tid); const nodes = new Map(); const samples = [];
for (const e of events) if (e.name === 'ProfileChunk' && e.pid === pid && e.id === prof?.id) { for (const n of e.args.data.cpuProfile?.nodes ?? []) nodes.set(n.id, n); const t = e.args.data.timeDeltas; (e.args.data.cpuProfile?.samples ?? []).forEach((id, i) => samples.push({ id, dt: t[i] })); }
let ts = prof?.args?.data?.startTime ?? 0; for (const s of samples) { ts += s.dt; s.ts = ts; }
const stackOf = (id) => { const out = []; let n = nodes.get(id); while (n) { out.push(n); n = nodes.get(n.parent); } return out; };
for (const t of main.filter((e) => e.name === 'RunTask' && e.dur > 45000)) {
  const fn = {}; for (const s of samples) if (s.ts >= t.ts && s.ts <= t.ts + t.dur) { const st = stackOf(s.id).filter((n) => n.callFrame.functionName); const k = st.slice(0, 1).concat(st.filter((n) => /initTexture|fromEquirect|warmStep|parse|loadTable|frame$|prime|compile|loadEnv|onmessage|putImageData|paintLight|render$|update$|decode|onFirstUse|getProgram|setProgram|stripUpload|raise/.test(n.callFrame.functionName)).slice(0, 3)).map((n) => n.callFrame.functionName).join(' < '); fn[k] = (fn[k] ?? 0) + s.dt; }
  console.log(`@${((t.ts - t0) / 1000) | 0}ms dur ${(t.dur / 1000) | 0}ms  ` + Object.entries(fn).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${(v / 1000) | 0}ms ${k}`).join(' | ').slice(0, 330));
}
