// a page that loads while another window / tab is in front: does the ring come up, and when?
import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--window-position=0,0'] });
const ctx = await b.newContext({ viewport: { width: 1200, height: 800 } });
const front = await ctx.newPage(); await front.goto('about:blank');
const p = await ctx.newPage(); p.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 200)));
await front.bringToFront();
await p.goto(process.argv[2]);
const st = () => p.evaluate(() => ({ t: Math.round(performance.now()), vis: document.visibilityState, cls: document.documentElement.className.replace('js motion-ready ', ''), up: document.querySelectorAll('.scene[data-up]').length, motion: !!window.__stillwayMotion }));
for (const ms of [1000, 3000, 6000]) { await p.waitForTimeout(ms); console.log('in background', JSON.stringify(await st())); }
await p.bringToFront();
for (const ms of [500, 1500, 3000]) { await p.waitForTimeout(ms); console.log('brought to front', JSON.stringify(await st())); }
await b.close();
