/* =========================================================================
   Is the hero's slow zoom actually smooth?

   The stand-in photograph used by the other checks is small, which hides the
   real cost: a 2400px picture being scaled every frame. This serves a full
   sized one instead, sits still on the hero — no scrolling, nothing else
   moving — and records the gap between frames while the zoom runs.

   A composited transform holds ~16.7ms. Anything that has to repaint the
   picture each frame shows up as gaps of 30ms and more.
   ========================================================================= */
import { serve, launch, mockPhoto } from './lib.mjs';

const { server } = await serve(4390);
const big = await mockPhoto(2400, 1600, 80);   // a real JPEG, hero sized
console.log(`stand-in photograph: ${(big.length / 1024).toFixed(0)} KB`);

const b = await launch();
for (const v of [{ n: 'phone  ', w: 390, h: 844, dpr: 3, cpu: 4 },
                 { n: 'desktop', w: 1600, h: 900, dpr: 2, cpu: 2 }]) {
  const ctx = await b.newContext({
    viewport: { width: v.w, height: v.h }, deviceScaleFactor: v.dpr,
    isMobile: v.w < 500, hasTouch: v.w < 500
  });
  await ctx.route('**/images.unsplash.com/**', r =>
    r.fulfill({ status: 200, contentType: 'image/jpeg', body: big }));
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: v.cpu });
  await p.goto('http://127.0.0.1:4390/', { waitUntil: 'load' });
  /* let the entrance settle and the zoom get past its start delay */
  await p.waitForTimeout(3200);

  const r = await p.evaluate(async () => {
    const frames = [];
    let last = performance.now(), stop = false;
    function loop(t) { frames.push(t - last); last = t; if (!stop) requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
    await new Promise(r => setTimeout(r, 6000));
    stop = true;
    frames.shift();
    frames.sort((a, b) => a - b);
    const q = f => frames[Math.floor(f * (frames.length - 1))];
    return {
      n: frames.length, median: +q(.5).toFixed(1), p90: +q(.9).toFixed(1),
      p99: +q(.99).toFixed(1), worst: +frames[frames.length - 1].toFixed(1),
      over24: frames.filter(x => x > 24).length,
      over32: frames.filter(x => x > 32).length
    };
  });
  const fps = (1000 / r.median).toFixed(0);
  console.log(`${v.n} ${v.w}x${v.h} @${v.dpr}x, ${v.cpu}x CPU throttle`);
  console.log(`   ${r.n} frames · median ${r.median}ms (${fps}fps) · p90 ${r.p90} · p99 ${r.p99} · worst ${r.worst}`);
  console.log(`   janky frames: ${r.over24} over 24ms, ${r.over32} over 32ms`);
  await ctx.close();
}
/* ---------------------------------------------------------------------------
   The other half of "not smooth": a jump rather than a dropped frame.

   While a slide is fading out it is still on screen, so its zoom has to keep
   the scale it had reached. If the animation is taken off it at that moment,
   the picture snaps back to its starting scale mid-fade. That is a hard
   discontinuity, and no amount of frame budget hides it. This watches every
   visible slide's scale frame by frame across a switch and reports the
   largest single-frame change.
--------------------------------------------------------------------------- */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/images.unsplash.com/**', r =>
    r.fulfill({ status: 200, contentType: 'image/jpeg', body: big }));
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4390/', { waitUntil: 'load' });
  await p.waitForTimeout(3000);

  const jump = await p.evaluate(async () => {
    const slides = [...document.querySelectorAll('.hero__slide')];
    const scaleOf = (el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el.querySelector('img')).transform);
      return m.a;
    };
    const prev = slides.map(scaleOf);
    let worst = 0, at = '';
    const t0 = performance.now();
    /* long enough to cross at least one crossfade */
    while (performance.now() - t0 < 9000) {
      await new Promise(r => requestAnimationFrame(r));
      slides.forEach((s, i) => {
        const vis = +getComputedStyle(s).opacity;
        const now = scaleOf(s);
        if (vis > 0.02) {
          const d = Math.abs(now - prev[i]);
          if (d > worst) { worst = d; at = `slide ${i} (opacity ${vis.toFixed(2)})`; }
        }
        prev[i] = now;
      });
    }
    return { worst: +worst.toFixed(5), at };
  });
  /* the zoom moves 0.08 over 30s — about 0.00004 per frame. Anything above a
     hundredth is a visible jump, not a drift. */
  const ok = jump.worst < 0.01;
  console.log(`\nlargest single-frame scale change on a visible slide: ${jump.worst}` +
              (jump.at ? `  (${jump.at})` : ''));
  console.log(ok ? '   smooth — no snap' : '   SNAP: the picture jumps mid-crossfade');
  await ctx.close();
  await b.close(); server.close();
  process.exit(ok ? 0 : 1);
}
