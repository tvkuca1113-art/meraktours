/* =========================================================================
   MERAK TOURS — static build
   Self-contained: no system binaries. Fonts are subset with harfbuzz (WASM),
   Open Graph images and PWA icons are rasterised with resvg (WASM), so the
   same build runs locally and on any CI/host.
   Run: npm run build   ·   SITE_ORIGIN=https://example.com npm run build
   ========================================================================= */
import { mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as esbuild from 'esbuild';
import subsetFont from 'subset-font';
import { Resvg } from '@resvg/resvg-js';
import { site, tours } from './src/data.mjs';
import { home, tourPage, createPage, creditsPage, notFound } from './src/pages.mjs';

const OUT = 'dist';
const write = (p, s) => { mkdirSync(dirname(join(OUT, p)), { recursive: true }); writeFileSync(join(OUT, p), s); };

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* ---------------- pages -------------------------------------------------- */
write('index.html', home());
tours.forEach((t, i) => write(`tours/${t.slug}/index.html`, tourPage(t, i)));
write('create-your-journey/index.html', createPage());
write('credits/index.html', creditsPage());
write('404.html', notFound());

/* ---------------- css ---------------------------------------------------- */
const cssSrc = readFileSync('src/assets/css/merak.css', 'utf8') + '\n' +
               readFileSync('src/assets/css/atlas.css', 'utf8');
const css = await esbuild.transform(cssSrc, { loader: 'css', minify: true });
write('assets/css/merak.css', css.code);

/* ---------------- js ----------------------------------------------------- */
const mainJs = await esbuild.build({
  entryPoints: ['src/assets/js/merak.js'],
  bundle: false, minify: true, target: ['es2019'], write: false
});
write('assets/js/merak.js', mainJs.outputFiles[0].text);

/* No WebGL anywhere on this site: the map is an SVG the browser already
   knows how to draw. */

/* ---------------- the client's own photographs --------------------------- */
if (existsSync('src/assets/photos')) {
  for (const f of readdirSync('src/assets/photos')) {
    write(`assets/photos/${f}`, readFileSync(join('src/assets/photos', f)));
  }
}

/* ---------------- fonts -------------------------------------------------- */
/* Variable sources come from the upstream Google Fonts repository (OFL) and
   are cached in vendor-fonts/ so repeat builds work offline. */
const FONT_SRC = {
  'Fraunces.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf',
  'Inter.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf'
};
mkdirSync('vendor-fonts', { recursive: true });
const fontBuf = {};
for (const [name, url] of Object.entries(FONT_SRC)) {
  const p = join('vendor-fonts', name);
  if (!existsSync(p)) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Could not download ${name}: ${r.status}`);
    writeFileSync(p, Buffer.from(await r.arrayBuffer()));
  }
  fontBuf[name] = readFileSync(p);
}

/* Only the characters this site can render — keeps the woff2 files small. */
const CHARS =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' +
  'ČčĆćŠšŽžĐđÁáÀàÂâÄäÉéÈèÊêËëÍíÎîÓóÔôÖöÚúÜüÝýÑñÅåØøÆæßÇç' +
  '·–—…‘’“”„«»•°×→←™®©€£§№';

write('assets/fonts/fraunces.woff2', await subsetFont(fontBuf['Fraunces.ttf'], CHARS, {
  targetFormat: 'woff2',
  variationAxes: { opsz: { min: 9, max: 144 }, wght: { min: 200, max: 900 }, SOFT: 26, WONK: 0 }
}));
write('assets/fonts/inter.woff2', await subsetFont(fontBuf['Inter.ttf'], CHARS, {
  targetFormat: 'woff2',
  variationAxes: { opsz: { min: 14, max: 32 }, wght: { min: 300, max: 700 } }
}));

/* Static instances, used only to rasterise the social images below. */
mkdirSync('.cache', { recursive: true });
writeFileSync('.cache/og-display.ttf', await subsetFont(fontBuf['Fraunces.ttf'], CHARS, {
  targetFormat: 'truetype', variationAxes: { opsz: 120, wght: 400, SOFT: 26, WONK: 0 }
}));
writeFileSync('.cache/og-sans.ttf', await subsetFont(fontBuf['Inter.ttf'], CHARS, {
  targetFormat: 'truetype', variationAxes: { opsz: 20, wght: 500 }
}));

/* ---------------- brand mark, social images, icons ----------------------- */
/* The mark is the silhouette of Stari Most: the rising deck, the arch beneath
   it, the piers, and the Neretva running underneath. */
const markPaths = (color, w = 2.4) => `
  <circle cx="24" cy="24" r="22.4" fill="none" stroke="${color}" stroke-opacity=".3" stroke-width="1.2"/>
  <path d="M7.5 27.6C7.5 20.9 14.9 15.6 24 15.6s16.5 5.3 16.5 12" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>
  <path d="M7.5 27.6h4.2m24.6 0h4.2M11.7 27.6v4.6m24.6-4.6v4.6" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>
  <path d="M9 36.2c2.6 0 2.6 1.7 5.2 1.7s2.6-1.7 5.2-1.7 2.6 1.7 5.2 1.7 2.6-1.7 5.2-1.7 2.6 1.7 5.2 1.7 2.6-1.7 5.2-1.7" fill="none" stroke="${color}" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>`;

const markSvg = (fg, bg, r = 11) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">` +
  (bg ? `<rect width="48" height="48" rx="${r}" fill="${bg}"/>` : '') +
  `<g transform="translate(24 24) scale(.88) translate(-24 -24)">${markPaths(fg)}</g></svg>`;

write('favicon.svg', markSvg('#f8f4ed', '#12301f'));
write('assets/img/logo.svg', markSvg('#f8f4ed', '#12301f'));
write('assets/img/logo-mark.svg', markSvg('#1e4b39', null));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(text, max) {
  const words = text.split(' '); const lines = []; let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) { lines.push(line.trim()); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function ogSvg({ kicker, title, meta }) {
  const lines = wrap(title, 21).slice(0, 3);
  const size = lines.length > 2 ? 60 : lines[0].length > 17 ? 68 : 78;
  const startY = 402 - (lines.length - 1) * size * 0.56;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#245741"/><stop offset="52%" stop-color="#12301f"/><stop offset="100%" stop-color="#091d14"/>
  </linearGradient>
  <pattern id="orn" width="74" height="74" patternUnits="userSpaceOnUse">
    <g fill="none" stroke="#ffffff" stroke-opacity="0.085" stroke-width="1">
      <path d="M37 5 L69 37 L37 69 L5 37 Z"/><rect x="14.4" y="14.4" width="45.2" height="45.2"/>
      <circle cx="37" cy="37" r="7.5" stroke-opacity="0.055"/>
    </g>
  </pattern>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#orn)"/>
<g transform="translate(766 122) scale(9)" opacity=".085">${markPaths('#bcd8e0', 2)}</g>
<g transform="translate(72 52) scale(1.15)">${markPaths('#f8f4ed')}</g>
<text x="150" y="88" fill="#f8f4ed" font-family="Fraunces" font-size="28" letter-spacing="3.6">MERAK TOURS</text>
<text x="151" y="110" fill="#f8f4ed" fill-opacity=".58" font-family="Inter" font-size="11.5" letter-spacing="3.2">BOSNIA AND HERZEGOVINA</text>
<path d="M74 ${(startY - 82).toFixed(0)}h44" stroke="#bcd8e0" stroke-opacity=".7" stroke-width="1.4"/>
<text x="132" y="${(startY - 76).toFixed(0)}" fill="#bcd8e0" font-family="Inter" font-size="14.5" letter-spacing="3.6">${esc(kicker.toUpperCase())}</text>
${lines.map((l, i) => `<text x="70" y="${(startY + i * size * 1.06).toFixed(0)}" fill="#f8f4ed" font-family="Fraunces" font-size="${size}">${esc(l)}</text>`).join('\n')}
<path d="M74 542h1054" stroke="#ffffff" stroke-opacity=".2" stroke-width="1"/>
${meta.map((m, i) => `<text x="${74 + i * 252}" y="578" fill="#ffffff" fill-opacity=".6" font-family="Inter" font-size="15" letter-spacing="2.4">${esc(m.toUpperCase())}</text>`).join('\n')}
<text x="1128" y="578" text-anchor="end" fill="#bcd8e0" font-family="Inter" font-size="15" letter-spacing="2.4">+387 63 822 083</text>
</svg>`;
}

const fontFiles = ['.cache/og-display.ttf', '.cache/og-sans.ttf'];
const png = (svg, width) => new Resvg(svg, {
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' },
  fitTo: { mode: 'width', value: width }
}).render().asPng();

write('assets/img/og-default.png', png(ogSvg({
  kicker: 'Private & small group tours · Mostar',
  title: 'Discover Bosnia. Feel the merak.',
  meta: ['Four journeys', 'Up to 6 travellers', 'Local guides']
}), 1200));

write('assets/img/og-create.png', png(ogSvg({
  kicker: 'Custom journeys',
  title: 'Create your own journey.',
  meta: ['Your interests', 'Your pace', 'Your route']
}), 1200));

for (const t of tours) {
  write(`assets/img/og-${t.slug}.png`, png(ogSvg({
    kicker: `Journey ${t.num} · Private tour from Mostar`,
    title: t.title,
    meta: [t.duration, 'Private tour', 'Pickup in Mostar']
  }), 1200));
}

/* A pre-rendered noise tile. An SVG feTurbulence filter looks the same but
   costs real main-thread time to rasterise on every paint. */
(function grain() {
  let seed = 20260809;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const N = 64;
  let rects = '';
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const v = Math.round(rnd() * 255);
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(${v},${v},${v})"/>`;
    }
  }
  write('assets/img/grain.png', png(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${N}" height="${N}" shape-rendering="crispEdges">${rects}</svg>`, N));
})();

const iconSvg = (scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">` +
  `<rect width="48" height="48" fill="#12301f"/>` +
  `<g transform="translate(24 24) scale(${scale}) translate(-24 -24)">${markPaths('#f8f4ed')}</g></svg>`;
write('assets/img/apple-touch-icon.png', png(iconSvg(0.8), 180));
write('assets/img/icon-192.png', png(iconSvg(0.82), 192));
write('assets/img/icon-512.png', png(iconSvg(0.82), 512));
write('assets/img/icon-maskable.png', png(iconSvg(0.6), 512));
write('assets/img/logo.png', png(iconSvg(0.82), 512));

/* ---------------- manifest, robots, sitemap, headers --------------------- */
write('site.webmanifest', JSON.stringify({
  name: 'Merak Tours — Private Tours in Bosnia and Herzegovina',
  short_name: 'Merak Tours',
  description: 'Private and small-group tours of Bosnia and Herzegovina, from Mostar.',
  start_url: '/',
  display: 'standalone',
  background_color: '#f8f4ed',
  theme_color: '#12301f',
  icons: [
    { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/assets/img/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}, null, 2));

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);

const urls = [
  { loc: '/', pri: '1.0', freq: 'weekly' },
  ...tours.map(t => ({ loc: `/tours/${t.slug}/`, pri: '0.9', freq: 'monthly' })),
  { loc: '/create-your-journey/', pri: '0.8', freq: 'monthly' },
  { loc: '/credits/', pri: '0.2', freq: 'yearly' }
];
write('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `  <url>
    <loc>${site.origin}${u.loc}</loc>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${site.origin}${u.loc}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.origin}${u.loc}"/>
  </url>`).join('\n')}
</urlset>
`);

console.log(`built ${urls.length + 1} pages · origin ${site.origin}`);
