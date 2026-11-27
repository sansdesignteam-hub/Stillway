import fs from 'fs'; import path from 'path';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../lh');
const label = process.argv[2];
const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
for (const preset of ['mobile', 'desktop']) {
  const rows = [1, 2, 3].map((i) => { const j = JSON.parse(fs.readFileSync(path.join(dir, `${label}-${preset}-${i}.json`))); const a = j.audits, c = j.categories; return { bench: j.environment.benchmarkIndex, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c['best-practices'].score * 100), fcp: a['first-contentful-paint'].numericValue, lcp: a['largest-contentful-paint'].numericValue, tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue, si: a['speed-index'].numericValue }; });
  const m = (k) => med(rows.map((r) => r[k]));
  console.log(`${label} ${preset}: perf ${m('perf')} (${rows.map((r) => r.perf).join('/')}) a11y ${m('a11y')} bp ${m('bp')} FCP ${(m('fcp')/1000).toFixed(2)}s LCP ${(m('lcp')/1000).toFixed(2)}s TBT ${Math.round(m('tbt'))}ms (${rows.map((r) => Math.round(r.tbt)).join('/')}) CLS ${m('cls').toFixed(3)} SI ${(m('si')/1000).toFixed(2)}s bench ${rows.map((r) => Math.round(r.bench)).join('/')}`);
}
