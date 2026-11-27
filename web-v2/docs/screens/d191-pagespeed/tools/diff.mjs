// node diff.mjs <dirA> <dirB> — share of pixels whose largest channel difference is above 8/255
import fs from 'fs'; import { PNG } from 'pngjs';
const [A, B] = process.argv.slice(2);
let worst = 0;
for (const f of fs.readdirSync(A).filter((f) => f.endsWith('.png')).sort()) {
  if (!fs.existsSync(`${B}/${f}`)) { console.log(f, 'missing'); continue; }
  const a = PNG.sync.read(fs.readFileSync(`${A}/${f}`)), b = PNG.sync.read(fs.readFileSync(`${B}/${f}`));
  if (a.width !== b.width || a.height !== b.height) { console.log(f, 'size differs'); continue; }
  let n = 0, max = 0; for (let i = 0; i < a.data.length; i += 4) { const d = Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2])); if (d > max) max = d; if (d > 8) n++; }
  const pct = (n / (a.width * a.height)) * 100; worst = Math.max(worst, pct);
  console.log(f.replace('.png', '').padEnd(28), `px>8: ${pct.toFixed(4)}%  max ${max}`);
}
console.log('worst', worst.toFixed(4) + '%');
