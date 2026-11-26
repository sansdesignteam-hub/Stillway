/**
 * D-181 responsive S01 plate: AVIF + WebP sets from the 3D Designer's plates (desk photo + Cycles
 * pedestal, 3632 × 2072). Run from web-v2/:
 *
 *   node scripts/hero-plate.mjs --desktop <plate.png> --mobile <plate-mobile.png> \
 *        [--ring <ring-overlay.png> --ring-mobile <ring-overlay-mobile.png>] [--out public/hero]
 *   (masters: design/3d/v2/plate/ on 3D-Designer; a new drop with the same names just re-runs this)
 *
 * Sets (file names carry the real pixel width; the 3632 one is the brief's "3640"):
 *   plate-s01-{960,1280,1920,2560,3632}       full frame, desktop plate
 *   plate-s01-m-{960,1280,1920}               full frame, phone plate (≤ 760 px wide, not portrait)
 *   plate-s01-mp-{908,1280,1816}              phone plate, centre 50 % of the width (portrait phones
 *                                             only ever show ≤ 43 % of it), full height
 *   ring-s01-{1280,1920,3632}, ring-s01-m-{1280,1920}, ring-s01-mp-{908,1816}
 *                                             the poster: ring + ring shadow, transparent, same frames
 *                                             (AVIF with alpha + WebP)
 * AVIF quality is searched downward per file until it meets its byte budget (brief: 2560 ≤ 250 KB,
 * 3632 ≤ 450 KB; the others are scaled by area), WebP is the fallback at a fixed quality.
 * Prints a size table and writes it to <out>/plate-s01-sizes.json.
 */
import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const out = arg('out', 'public/hero');
const desktop = arg('desktop');
const mobile = arg('mobile');
const ring = arg('ring');
const ringMobile = arg('ring-mobile');
if (!desktop) throw new Error('--desktop <plate> is required');

const KB = 1024;
/** AVIF byte budgets (brief for 2560 / 3632; the rest ∝ area, with a floor) */
const budget = (w, crop = 1) => Math.round(Math.max(28, Math.min(450, 450 * (w / 3632) ** 2 * (w >= 3000 ? 1 : 1.12))) * KB * (crop < 1 ? 1.15 : 1));
const BUDGET = { 2560: 250 * KB, 3632: 450 * KB };
const AVIF_Q = { max: 70, min: 38 };
const WEBP_Q = 80;

const sets = [
  { src: desktop, name: 'plate-s01', widths: [960, 1280, 1920, 2560, 3632], crop: 1 },
  ...(mobile
    ? [
        { src: mobile, name: 'plate-s01-m', widths: [960, 1280, 1920], crop: 1 },
        { src: mobile, name: 'plate-s01-mp', widths: [908, 1280, 1816], crop: 0.5 },
      ]
    : []),
  ...(ring ? [{ src: ring, name: 'ring-s01', widths: [1280, 1920, 3632], crop: 1, alpha: true }] : []),
  ...(ringMobile
    ? [
        { src: ringMobile, name: 'ring-s01-m', widths: [1280, 1920], crop: 1, alpha: true },
        { src: ringMobile, name: 'ring-s01-mp', widths: [908, 1816], crop: 0.5, alpha: true },
      ]
    : []),
];

await mkdir(out, { recursive: true });
const rows = [];
for (const set of sets) {
  const meta = await sharp(set.src).metadata();
  const cw = Math.round(meta.width * set.crop);
  const left = Math.round((meta.width - cw) / 2);
  if (set.alpha && set.crop < 1) {
    // the crop must not cut the ring or its shadow
    const { data, info } = await sharp(set.src).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
    for (let y = 0; y < info.height; y += 2) for (const x of [left - 1, left + cw]) if (data[y * info.width + x] > 2) throw new Error(`${set.name}: the ${set.crop} crop cuts the overlay at x ${x}, y ${y}`);
  }
  for (const w of set.widths) {
    const base = () => {
      let im = sharp(set.src);
      if (set.crop < 1) im = im.extract({ left, top: 0, width: cw, height: meta.height });
      // never upscale: the source is the ceiling
      return w < cw ? im.resize({ width: w, kernel: 'lanczos3' }) : im;
    };
    const h = Math.round((Math.min(w, cw) / cw) * meta.height);
    const max = set.alpha ? 200 * KB : BUDGET[w] ?? budget(w, set.crop);
    // AVIF: highest quality within the budget
    let q = AVIF_Q.max;
    let buf;
    for (;;) {
      buf = await base().avif({ quality: q, effort: 7, chromaSubsampling: '4:2:0' }).toBuffer();
      if (buf.length <= max || q <= AVIF_Q.min) break;
      q -= buf.length > max * 1.25 ? 6 : 3;
    }
    const avif = path.join(out, `${set.name}-${w}.avif`);
    await writeFile(avif, buf);
    const webp = path.join(out, `${set.name}-${w}.webp`);
    await base().webp({ quality: set.alpha ? 86 : WEBP_Q, alphaQuality: 92, effort: 6, smartSubsample: true }).toFile(webp);
    const row = { file: `${set.name}-${w}`, width: Math.min(w, cw), height: h, avifKB: +(buf.length / KB).toFixed(1), avifQ: q, budgetKB: Math.round(max / KB), webpKB: +((await stat(webp)).size / KB).toFixed(1) };
    if (buf.length > max) row.overBudget = true;
    rows.push(row);
    console.log(row);
  }
}
await writeFile(path.join(out, 'plate-s01-sizes.json'), JSON.stringify(rows, null, 1) + '\n');
if (rows.some((r) => r.overBudget)) {
  console.error('AVIF over budget at minimum quality');
  process.exit(1);
}
