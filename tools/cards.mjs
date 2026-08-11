/* =========================================================================
   The journey cards, under a moving cursor.

   Each card zooms its photograph on hover and leans toward the pointer. Over
   that photograph sit the duration tag and the highlight pills. Anything up
   there carrying a backdrop-filter forces the browser to read back and blur
   the moving picture underneath it every single frame, which is the usual
   reason a slow zoom looks like it is shaking.

   This drags a pointer across a card and records the gap between frames.
   ========================================================================= */
import { serve, launch, mockPhoto } from './lib.mjs';

const { server } = await serve(4392);
const big = await mockPhoto(2000, 1400, 80);

const b = await launch();
const ctx = await b.newContext({ viewport: { width: 1600, height: 950 }, deviceScaleFactor: 1 });
await ctx.route('**/images.unsplash.com/**', r =>
  r.fulfill({ status: 200, contentType: 'image/jpeg', body: big }));
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 2 });
await p.goto('http://127.0.0.1:4392/', { waitUntil: 'load' });
await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
await p.evaluate(() => document.getElementById('journeys').scrollIntoView());
await p.waitForTimeout(2000);

console.log('backdrop-filter elements over the cards:',
  await p.evaluate(() => [...document.querySelectorAll('.jcard *')]
    .filter(el => (getComputedStyle(el).backdropFilter || 'none') !== 'none').length));

const box = await p.evaluate(() => {
  const c = document.querySelector('.jcard--wide') || document.querySelector('.jcard');
  const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});

/* start the frame recorder, then drag a pointer across the card */
await p.evaluate(() => {
  window.__f = []; window.__stop = false;
  let last = performance.now();
  (function loop(t) { window.__f.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(loop); })(last);
});
await p.mouse.move(box.x + 20, box.y + box.h / 2);
for (let i = 0; i <= 90; i++) {
  await p.mouse.move(box.x + 20 + (box.w - 40) * (i / 90), box.y + box.h * (0.3 + 0.4 * Math.sin(i / 9)));
  await p.waitForTimeout(28);
}
const r = await p.evaluate(() => {
  window.__stop = true;
  const f = window.__f.slice(1).sort((a, b) => a - b);
  const q = x => f[Math.floor(x * (f.length - 1))];
  return { n: f.length, median: +q(.5).toFixed(1), p90: +q(.9).toFixed(1), p99: +q(.99).toFixed(1),
           worst: +f[f.length - 1].toFixed(1), over32: f.filter(x => x > 32).length };
});
console.log(`pointer across a card, 2x CPU throttle`);
console.log(`   ${r.n} frames · median ${r.median}ms (${(1000 / r.median).toFixed(0)}fps) · p90 ${r.p90} · p99 ${r.p99} · worst ${r.worst}`);
console.log(`   janky frames over 32ms: ${r.over32}  (${(r.over32 / r.n * 100).toFixed(0)}%)`);

await b.close(); server.close();
