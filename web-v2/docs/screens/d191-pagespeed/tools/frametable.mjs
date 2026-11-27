// node frametable.mjs <dir> — markdown tables, before vs after, the runs of each pooled
import fs from 'fs';
const dir = process.argv[2];
const load = (tag) => fs.readdirSync(dir).filter((f) => f.startsWith(`${tag}-run`) && f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(`${dir}/${f}`)));
const B = load('before'), A = load('after');
const q = (a, f) => a[Math.min(a.length - 1, Math.floor(a.length * f))];
const stat = (runs, label, pass) => { const by = {}; for (const r of runs) for (const [id, , dt] of r[label].passes[pass].slice(1)) (by[id] ??= []).push(dt); const out = {}; for (const [id, a] of Object.entries(by)) { a.sort((x, y) => x - y); out[id] = `${q(a, 0.5).toFixed(1)} / ${q(a, 0.95).toFixed(1)} / ${a[a.length - 1].toFixed(0)} | ${a.filter((x) => x > 50).length}`; } return out; };
for (const [label, title] of [['desktop', 'Desktop 1440×900 @2×, no throttle'], ['mobile', 'Mobile 375×812 @3×, CPU throttle 4×']]) for (const [pass, pname] of [[0, 'first pass (cold)'], [1, 'second pass (warm)']]) {
  const b = stat(B, label, pass), a = stat(A, label, pass);
  console.log(`\n**${title} — ${pname}**, ${B.length} + ${A.length} runs pooled\n\n| Section | Before median / p95 / max (ms) | >50 ms | After median / p95 / max (ms) | >50 ms |\n| --- | --- | --- | --- | --- |`);
  for (const id of Object.keys(a)) console.log(`| ${id} | ${b[id] ?? '- | -'} | ${a[id]} |`);
}
for (const [tag, runs] of [['before', B], ['after', A]]) for (const label of ['desktop', 'mobile']) console.log(`\n${tag} ${label}: ` + runs.map((r) => `images ${(r[label].initial.imgBytes / 1e6).toFixed(2)} MB / ${r[label].initial.imgN} files, all transfers ${(r[label].initial.allBytes / 1e6).toFixed(2)} MB, heap ${r[label].initial.heapMB} → ${r[label].afterHeapMB} MB`).join('; '));
