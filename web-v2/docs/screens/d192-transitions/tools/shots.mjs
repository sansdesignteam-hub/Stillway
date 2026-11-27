// node shots.mjs <base> <outDir> [trans|s06|spacing ...]
import fs from 'fs'; import { launch, open, go } from './common.mjs';
const [base, out, ...what] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await launch();
const run = async (label, w, h, dpr, mobile, list) => {
  const { ctx, p, errs } = await open(b, base, w, h, dpr, mobile);
  for (const [id, u, name] of list) { await go(p, id, u); await p.screenshot({ path: `${out}/${label}-${name ?? `${id}_${u}`}.jpg`, type: 'jpeg', quality: 88 }); }
  if (errs.length) console.log(label, 'errors', errs);
  await ctx.close();
};
const C1 = [-1.6, -1.3, -1.1, -0.9, -0.64, -0.4, 0].map((u) => ['specs', u]);
const C2 = [-1.3, -1.05, -0.9, -0.75, -0.55, -0.35, 0].map((u) => ['finishes', u]);
if (what.includes('trans')) {
  await run('d', 1440, 900, 1, false, [['details', 7.4], ...C1, ['app', 6.6], ...C2]);
  await run('m375', 375, 812, 2, true, [['details', 7.4], ...C1, ['app', 6.6], ...C2]);
}
if (what.includes('s06')) for (const [w, h] of [[375, 812], [390, 844], [430, 932], [375, 667], [360, 640]]) await run(`s06-${w}x${h}`, w, h, 2, true, [['details', 7.4, 'fits']]);
if (what.includes('spacing')) {
  const L = [['why', 0], ['why', 1], ['why', 2], ['why', 3], ['sleep', 0], ['sleep', 2], ['activity', 0], ['insight', 0], ['insight', 3], ['details', 0], ['details', 1], ['details', 2], ['details', 7.4], ['specs', 0], ['specs', 1], ['specs', 2], ['specs', 6.1], ['features', 0], ['features', 3], ['app', 0.9], ['app', 3], ['app', 5], ['finishes', -0.3], ['finishes', 0], ['finishes', 1], ['close', 0], ['close', 1], ['close', 2], ['close', 3]];
  for (const [w, h] of [[375, 812], [360, 640]]) await run(`sp${w}`, w, h, 1, true, L);
}
await b.close();
