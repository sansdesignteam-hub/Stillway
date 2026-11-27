// node frames.mjs <base> <out.json> — scroll 8 px per frame through 06→07 and 09→10, down and up, 2 passes
import fs from 'fs'; import { launch, open, go, yOf } from './common.mjs';
const [base, out] = process.argv.slice(2);
const b = await launch(); const res = {};
for (const [label, w, h, dpr, mobile, rate] of [['desktop', 1440, 900, 2, false, 1], ['mobile', 375, 812, 3, true, 4]]) {
  const { ctx, p, errs } = await open(b, base, w, h, dpr, mobile);
  const cdp = await ctx.newCDPSession(p);
  for (const [name, id] of [['s06-s07', 'specs'], ['s09-s10', 'finishes']]) {
    const tin = await p.evaluate((id) => Number(document.getElementById(id).dataset.tin), id);
    const a = await yOf(p, id, -tin - 0.4), z = await yOf(p, id, 0.1);
    await go(p, id, -tin - 0.4, 2500);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    for (let pass = 0; pass < 2; pass++) for (const [dir, from, to] of [['down', a, z], ['up', z, a]]) {
      const dts = await p.evaluate(([from, to]) => new Promise((done) => { const step = to > from ? 8 : -8; let y = from, last; const r = []; const f = (n) => { if (last !== undefined) r.push(+(n - last).toFixed(1)); last = n; if ((step > 0 && y >= to) || (step < 0 && y <= to)) return done(r); y += step; window.scrollTo({ top: y, behavior: 'instant' }); requestAnimationFrame(f); }; window.scrollTo({ top: from, behavior: 'instant' }); setTimeout(() => requestAnimationFrame(f), 400); }), [from, to]);
      (res[`${label} ${name} ${dir}`] ??= []).push(dts);
    }
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }
  if (errs.length) console.log(label, errs);
  await ctx.close();
}
await b.close();
fs.writeFileSync(out, JSON.stringify(res));
for (const [k, passes] of Object.entries(res)) { const d = passes.flat().sort((x, y) => x - y); console.log(k.padEnd(24), 'n', d.length, 'median', d[Math.floor(d.length / 2)], 'p95', d[Math.floor(d.length * 0.95)], 'max', d.at(-1), '>50ms', d.filter((x) => x > 50).length); }
