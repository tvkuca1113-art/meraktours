/* reduced motion + no JavaScript: does the section still tell the story? */
import { mkdirSync } from 'node:fs';
import { serve, launch, stubPhotos } from './lib.mjs';
const { server } = await serve(4377);
mkdirSync('shots', { recursive: true });

async function run(label, opts, nojs) {
  const b = await launch();
  const ctx = await b.newContext({ viewport:{width:1280,height:800}, javaScriptEnabled: !nojs, ...opts });
  await stubPhotos(ctx);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('http://127.0.0.1:4377/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.getElementById('journey').scrollIntoView());
  await page.waitForTimeout(3500);
  const out = await page.evaluate(() => {
    const s = document.getElementById('journey');
    const mob = document.getElementById('journeyMob');
    const track = document.getElementById('journeyTrack');
    return {
      live: s.classList.contains('is-live'),
      storyVisible: mob.offsetHeight > 0,
      mapVisible: track.offsetHeight > 0,
      stopsWritten: document.querySelectorAll('.mstory .mstop').length,
      canvases: document.querySelectorAll('canvas').length,
      firstStop: (document.querySelector('.mstory .mstop__name')||{}).textContent
    };
  });
  console.log(label, JSON.stringify(out), errs.length ? 'ERRORS ' + errs.slice(0,2).join(' | ') : 'clean');
  await page.screenshot({ path: `shots/mode-${label}.png`, fullPage: false });
  await b.close();
}
await run('normal', {});
await run('reduced', { reducedMotion: 'reduce' });
await run('nojs', {}, true);
server.close();
