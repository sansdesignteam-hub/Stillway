// node trace.mjs <url> [mobile|desktop] [throttle]  — long main-thread tasks and what is inside them
import { chromium } from 'playwright-core';
const [url, which = 'mobile', thr = '4', waitMs = '14000'] = process.argv.slice(2);
const b = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--headless=new'] });
const mobile = which === 'mobile';
const ctx = await b.newContext(mobile ? { viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true } : { viewport: { width: 1350, height: 940 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +thr });
const events = []; cdp.on('Tracing.dataCollected', (e) => events.push(...e.value));
await cdp.send('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { includedCategories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'blink.user_timing', 'loading', 'disabled-by-default-v8.cpu_profiler'] } });
await p.goto(url, { waitUntil: 'load' });
await p.waitForTimeout(+waitMs);
const done = new Promise((r) => cdp.once('Tracing.tracingComplete', r)); await cdp.send('Tracing.end'); await done;
await b.close();
// renderer main thread = thread with most RunTask of the pid that has the navigation
const start = events.find((e) => e.name === 'navigationStart' && e.args?.data?.documentLoaderURL?.startsWith('http'));
const pid = start.pid; const t0 = start.ts;
const byTid = {}; for (const e of events) if (e.pid === pid && e.name === 'RunTask' && e.ph === 'X') byTid[e.tid] = (byTid[e.tid] ?? 0) + e.dur;
const tid = +Object.entries(byTid).sort((a, b) => b[1] - a[1])[0][0];
const main = events.filter((e) => e.pid === pid && e.tid === tid && e.ph === 'X').sort((a, b) => a.ts - b.ts);
const tasks = main.filter((e) => e.name === 'RunTask' && e.dur > 50000);
let tbt = 0; const fcp = events.find((e) => e.name === 'firstContentfulPaint' && e.pid === pid); const lcp = events.filter((e) => e.name === 'largestContentfulPaint::Candidate' && e.pid === pid).pop();
console.log('FCP', fcp ? ((fcp.ts - t0) / 1000) | 0 : '-', 'LCP', lcp ? ((lcp.ts - t0) / 1000) | 0 : '-');
// cpu profile samples for function attribution
const prof = events.find((e) => e.name === 'Profile' && e.pid === pid && e.tid === tid);
const nodes = new Map(); const samples = [];
for (const e of events) if (e.name === 'ProfileChunk' && e.pid === pid && e.id === prof?.id) { for (const n of e.args.data.cpuProfile?.nodes ?? []) nodes.set(n.id, n); let t = e.args.data.timeDeltas; const s = e.args.data.cpuProfile?.samples ?? []; s.forEach((id, i) => samples.push({ id, dt: t[i] })); }
let ts = prof?.args?.data?.startTime ?? 0; for (const s of samples) { ts += s.dt; s.ts = ts; }
const stackOf = (id) => { const out = []; let n = nodes.get(id); while (n) { out.push(n); n = nodes.get(n.parent); } return out; };
for (const t of tasks) {
  tbt += t.dur / 1000 - 50;
  const kids = main.filter((e) => e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && e.dur > 3000);
  const agg = {}; for (const k of kids) { const key = k.name + (k.args?.data?.url ? ' ' + k.args.data.url.split('/').pop().slice(0, 40) : '') + (k.args?.data?.functionName ? ' fn:' + k.args.data.functionName : ''); agg[key] = (agg[key] ?? 0) + k.dur; }
  // function self-time inside this task: attribute to the deepest named frame, and top 3 ancestors
  const fn = {}; for (const s of samples) if (s.ts >= t.ts && s.ts <= t.ts + t.dur) { if (process.env.MINT && (t.ts - t0) / 1000 < +process.env.MINT) continue; const st = stackOf(s.id); const named = st.filter((n) => n.callFrame.url).slice(0, 60); const label = (n) => `${n.callFrame.functionName || '(anon)'}@${n.callFrame.url.split('/').pop().slice(0, 18)}:${n.callFrame.lineNumber}`; const leaf = st[0]?.callFrame.functionName || '(anon)'; const chain = named.slice(0, 5).map(label).join(' < '); const k2 = `${leaf} | ${chain}`; fn[k2] = (fn[k2] ?? 0) + s.dt; }
  console.log(`\n@${((t.ts - t0) / 1000) | 0}ms dur ${(t.dur / 1000) | 0}ms`);
  console.log('  events:', Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([k, v]) => `${k}=${(v / 1000) | 0}`).join('; '));
  for (const [k, v] of Object.entries(fn).sort((a, b) => b[1] - a[1]).slice(0, 9)) console.log('   ', ((v / 1000) | 0) + 'ms', k.slice(0, 230));
}
console.log('\nTBT-ish (all long tasks after nav)', tbt | 0, 'tasks', tasks.length);
