import fs from 'fs'; import path from 'path';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../lh');
const label = process.argv[2];
const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
for (const preset of ['mobile', 'desktop']) {
  const files = fs.readdirSync(dir).filter((f) => f.startsWith(`${label}-${preset}-`));
  const rows = files.map((f) => { const j = JSON.parse(fs.readFileSync(path.join(dir, f))); const a = j.audits; return { bench: j.environment.benchmarkIndex, perf: Math.round(j.categories.performance.score * 100), fcp: a['first-contentful-paint'].numericValue, lcp: a['largest-contentful-paint'].numericValue, tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue, si: a['speed-index'].numericValue, bytes: a['total-byte-weight']?.numericValue ?? 0 }; });
  if (!rows.length) continue;
  const m = (k) => med(rows.map((r) => r[k]));
  console.log(`${label} ${preset}: perf ${m('perf')} (${rows.map((r) => r.perf).join('/')})  FCP ${(m('fcp')/1000).toFixed(2)}s  LCP ${(m('lcp')/1000).toFixed(2)}s  TBT ${Math.round(m('tbt'))}ms (${rows.map((r) => Math.round(r.tbt)).join('/')})  CLS ${m('cls').toFixed(3)}  SI ${(m('si')/1000).toFixed(2)}s  bytes ${(m("bytes")/1e6).toFixed(2)}MB  bench ${rows.map((r) => Math.round(r.bench)).join("/")}`);
}
