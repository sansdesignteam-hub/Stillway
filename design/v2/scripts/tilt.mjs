import { chromium } from 'playwright-core';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist'] });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('http://localhost:4399/', { waitUntil: 'networkidle' }); await p.waitForTimeout(3500);
for (const [n, x, y] of [['centre', 720, 450], ['top-left', 5, 5], ['top-right', 1435, 5], ['bottom-left', 5, 895], ['bottom-right', 1435, 895]]) {
  await p.mouse.move(x, y, { steps: 10 }); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}_${n}.png`, clip: { x: 360, y: 120, width: 760, height: 640 } });
}
await b.close();
