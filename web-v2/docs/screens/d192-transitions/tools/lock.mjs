// crop the ring + finger at several points of 06→07; the crop follows the hand photo, so a locked ring looks identical
import { launch, open, go } from './common.mjs';
const [base, out] = process.argv.slice(2);
const b = await launch();
for (const [label, w, h, dpr, m] of [['d', 1440, 900, 2, false], ['m', 375, 812, 3, true]]) {
  const { ctx, p } = await open(b, base, w, h, dpr, m);
  for (const u of [-1.6, -1.4, -1.25, -1.15]) {
    await go(p, 'specs', u);
    const r = await p.evaluate(() => { const b = document.querySelector('[data-d-hand]').getBoundingClientRect(); const s = b.width / 579; return { x: b.x + 343 * s, y: b.y + 360 * s, s, o: document.querySelector('[data-d-card]').style.opacity, c: document.querySelector('[data-ring-canvas]').style.opacity, t: document.querySelector('[data-ring-canvas]').style.transform, ct: document.querySelector('[data-d-card]').style.transform }; });
    console.log(label, u, 'hand o', r.o, 'ring o', r.c, r.ct, '|', r.t);
    const d = 110 * r.s;
    await p.screenshot({ path: `${out}/lock-${label}_${u}.png`, clip: { x: r.x - d, y: r.y - d, width: 2 * d, height: Math.min(2 * d, h - (r.y - d)) } });
  }
  await ctx.close();
}
await b.close();
