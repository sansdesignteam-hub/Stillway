/**
 * D-185 responsive S07 "The everyday." photo: AVIF + WebP sets from the user's 4K master
 * (3840 × 2400), same approach as hero-plate.mjs. Run from web-v2/:
 *
 *   node scripts/s07-plate.mjs [--src <master>] [--out public/s07]
 *
 *   everyday-{960,1280,1920,2560,3840}    full frame
 *   everyday-p-{768,1280,1920}            portrait phones: the right 50 % of the width, full height
 *                                         (the phone crop shows the black ring, far less than that half)
 * AVIF quality is searched downward to its byte budget (2560 ≤ 250 KB); WebP is the fallback.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const src = arg('src', '../design/assets/v2/s07/Stillway_Three_Rings_4K.avif');
const out = arg('out', 'public/s07');
const KB = 1024;
const sets = [
  { name: 'everyday', crop: 1, widths: { 960: 70, 1280: 110, 1920: 180, 2560: 250, 3840: 450 } },
  { name: 'everyday-p', crop: 0.5, widths: { 768: 80, 1280: 160, 1920: 280 } },
];

await mkdir(out, { recursive: true });
const meta = await sharp(src).metadata();
const rows = [];
for (const set of sets) {
  const cw = Math.round(meta.width * set.crop);
  for (const [width, budgetKB] of Object.entries(set.widths)) {
    const w = Number(width);
    const base = () => {
      let im = sharp(src);
      if (set.crop < 1) im = im.extract({ left: meta.width - cw, top: 0, width: cw, height: meta.height });
      return w < cw ? im.resize({ width: w, kernel: 'lanczos3' }) : im;
    };
    let q = 80;
    let buf;
    for (;;) {
      buf = await base().avif({ quality: q, effort: 7, chromaSubsampling: '4:2:0' }).toBuffer();
      if (buf.length <= budgetKB * KB || q <= 40) break;
      q -= buf.length > budgetKB * KB * 1.25 ? 6 : 3;
    }
    const webp = await base().webp({ quality: 80, effort: 6, smartSubsample: true }).toBuffer();
    await writeFile(path.join(out, `${set.name}-${w}.avif`), buf);
    await writeFile(path.join(out, `${set.name}-${w}.webp`), webp);
    const row = { file: `${set.name}-${w}`, width: w, height: Math.round((w / cw) * meta.height), avifKB: +(buf.length / KB).toFixed(1), avifQ: q, budgetKB, webpKB: +(webp.length / KB).toFixed(1) };
    rows.push(row);
    console.log(row);
  }
}
await writeFile(path.join(out, 'everyday-sizes.json'), JSON.stringify(rows, null, 1) + '\n');
