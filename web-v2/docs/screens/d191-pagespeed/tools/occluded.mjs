import { chromium } from 'playwright-core';
const b = await chromium.launch({ headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--window-position=0,0'] });
const p1 = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage(); await p1.goto(process.argv[2]); await p1.waitForFunction(() => document.documentElement.classList.contains('ring-live')); await p1.waitForTimeout(3000);
const p = await (await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })).newPage(); p.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 200)));
await p.goto(process.argv[2]);
for (const ms of [2000, 4000, 8000, 10000]) { await p.waitForTimeout(ms); console.log(JSON.stringify(await p.evaluate(() => ({ t: Math.round(performance.now()), vis: document.visibilityState, cls: document.documentElement.className.replace('js motion-ready ', ''), up: document.querySelectorAll('.scene[data-up]').length, motion: !!window.__stillwayMotion, gl: !!document.querySelector('[data-ring-canvas]').getContext('webgl2')?.isContextLost?.() })))); }
await b.close();
