/* =========================================================================
   How much of the photograph does the hero actually let you see?

   Every photograph is replaced by a flat mid-grey, the hero is screenshotted,
   and the pixels are read back. Because the stand-in is uniform, whatever
   darkening remains is the scrim — so this reports the scrim's real opacity
   over the words (which has to be high enough for white type to pass WCAG)
   and over the rest of the frame (which has to be low enough that the place
   is still visible).
   ========================================================================= */
import { serve, launch } from './lib.mjs';
import { Resvg } from '@resvg/resvg-js';

const { server } = await serve(4360);
const grey = new Resvg('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000">' +
  '<rect width="1600" height="1000" fill="#808080"/></svg>').render().asPng();

const b = await launch();
for (const v of [{ n: 'phone  ', w: 390, h: 844 }, { n: 'desktop', w: 1440, h: 900 }]) {
  const ctx = await b.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
  await ctx.route('**/images.unsplash.com/**', r =>
    r.fulfill({ status: 200, contentType: 'image/png', body: grey }));
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4360/', { waitUntil: 'load' });
  /* freeze the ken burns drift so the sample is repeatable */
  await p.addStyleTag({ content: '.hero__media img{animation:none!important;transform:none!important}' });
  await p.waitForTimeout(2600);

  /* the words have to come off the frame before the frame is measured, or the
     white glyphs themselves brighten the sample */
  const rects = await p.evaluate(() => {
    const box = (sel) => {
      const e = document.querySelector(sel); if (!e) return null;
      const r = e.getBoundingClientRect();
      return [r.left | 0, r.top | 0, r.right | 0, r.bottom | 0];
    };
    return { h1: box('.hero h1'), sub: box('.hero__sub'), meta: box('.hero__meta'), eyebrow: box('.hero__eyebrow') };
  });
  /* hide the type itself, never its container — part of the scrim hangs off
     .hero__in, and hiding that would measure a hero that doesn't exist */
  await p.addStyleTag({ content: '.hero h1,.hero__sub,.hero__eyebrow,.hero__meta,.hero__cta,.site-head,.scroll-cue{visibility:hidden!important}' });
  await p.waitForTimeout(120);

  const shot = (await p.screenshot({ clip: { x: 0, y: 0, width: v.w, height: v.h } })).toString('base64');
  const out = await p.evaluate(async ({ b64, w, h, rects }) => {
    const im = new Image();
    await new Promise(r => { im.onload = r; im.src = 'data:image/png;base64,' + b64; });
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(im, 0, 0);
    const d = c.getContext('2d').getImageData(0, 0, w, h).data;

    /* mid-grey under a scrim of rgb(6,16,12): pixel = 128(1-a) + 6a  */
    const alphaAt = (x, y) => {
      const i = ((y | 0) * w + (x | 0)) * 4;
      return (128 - d[i]) / (128 - 6);
    };
    const region = (x0, y0, x1, y1) => {
      let s = 0, n = 0;
      for (let y = y0; y < y1; y += 3) for (let x = x0; x < x1; x += 3) { s += alphaAt(x, y); n++; }
      return s / n;
    };
    const at = (r) => r ? region(Math.max(0, r[0]), Math.max(0, r[1]),
                                 Math.min(w, r[2]), Math.min(h, r[3])) : null;
    return {
      h1: at(rects.h1),
      sub: at(rects.sub),
      meta: at(rects.meta),
      eyebrow: at(rects.eyebrow),
      header: region(0, 0, w, 70),
      /* where the photograph is meant to be readable */
      open: region((w * 0.55) | 0, (h * 0.10) | 0, w - 4, (h * 0.42) | 0),
      openTop: region(4, (h * 0.30) | 0, w - 4, (h * 0.42) | 0)
    };
  }, { b64: shot, w: v.w, h: v.h, rects });

  /* white text over a backdrop needs the backdrop's relative luminance at or
     below 0.183 to clear 4.5:1 */
  const lum = (a) => { const c = (128 * (1 - a) + 6 * a) / 255; const l = c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; return l; };
  const ratio = (a) => (1.05 / (lum(a) + .05));
  const f = (x) => x == null ? '  —  ' : (x * 100).toFixed(0).padStart(3) + '%';
  console.log(`\n${v.n}  scrim opacity over a mid-grey photograph`);
  console.log(`  headline ${f(out.h1)}   (white type would read ${ratio(out.h1).toFixed(1)}:1)`);
  console.log(`  standfirst${f(out.sub)}  (${ratio(out.sub).toFixed(1)}:1)`);
  console.log(`  meta row ${f(out.meta)}   (${ratio(out.meta).toFixed(1)}:1)`);
  console.log(`  eyebrow  ${f(out.eyebrow)}   (${ratio(out.eyebrow).toFixed(1)}:1)`);
  console.log(`  header   ${f(out.header)}`);
  console.log(`  photograph, open area ${f(out.open)} covered  → ${(100 - out.open * 100).toFixed(0)}% of the picture showing`);
  console.log(`  photograph, mid band  ${f(out.openTop)} covered  → ${(100 - out.openTop * 100).toFixed(0)}% showing`);
  await ctx.close();
}
await b.close(); server.close();
