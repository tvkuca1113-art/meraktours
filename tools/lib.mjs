/* =========================================================================
   Shared bits for the local checks.

   A static server for dist/, a browser launcher that works with whichever
   Chromium is on the machine, and a stand-in photograph so the checks don't
   depend on the CDN being reachable.
   ========================================================================= */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const MIME = {
  '.html': 'text/html;charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json'
};

/* dist/ is a folder of clean URLs, so /tours/x/ has to fall through to
   /tours/x/index.html the way the host does it in production */
export function resolveFile(url, root = 'dist') {
  const p = decodeURIComponent(url.split('?')[0]);
  const bare = p.replace(/\/+$/, '') || '/';
  let f = join(root, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) f = join(root, bare, 'index.html');
  if (!existsSync(f)) f = join(root, bare + '.html');
  return existsSync(f) ? f : null;
}

export async function serve(port, root = 'dist') {
  if (!existsSync(root)) {
    console.error(`\n  ${root}/ does not exist yet — run  npm run build  first.\n`);
    process.exit(1);
  }
  const server = createServer((req, res) => {
    const f = resolveFile(req.url, root);
    if (!f) {
      const four = resolveFile('/404/', root);
      res.writeHead(404, { 'content-type': 'text/html;charset=utf-8' });
      return res.end(four ? readFileSync(four) : '404');
    }
    const body = readFileSync(f);
    res.writeHead(200, {
      'content-type': MIME[extname(f)] || 'application/octet-stream',
      'cache-control': f.includes('assets') ? 'public,max-age=31536000,immutable' : 'no-cache',
      'content-length': body.length
    });
    res.end(body);
  });
  await new Promise(r => server.listen(port, r));
  return { server, origin: `http://127.0.0.1:${port}` };
}

/* Playwright downloads its own Chromium on install. CHROME_PATH overrides it,
   which is what you want on a machine that already has one. */
export async function launch(opts = {}) {
  const { chromium } = await import('playwright');
  const exe = process.env.CHROME_PATH;
  try {
    return await chromium.launch({ ...(exe ? { executablePath: exe } : {}), ...opts });
  } catch (e) {
    console.error('\n  Could not start Chromium. Run  npx playwright install chromium\n' +
                  '  or point CHROME_PATH at a Chrome you already have.\n');
    throw e;
  }
}

/* A plain green rectangle standing in for every photograph, so the checks run
   the same offline as online and don't hammer the CDN. */
let cached = null;
export function placeholder() {
  if (!cached) {
    cached = new Resvg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#3d7a5f"/><stop offset="1" stop-color="#1a3a2c"/>` +
      `</linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/></svg>`
    ).render().asPng();
  }
  return cached;
}

/* A JPEG version, encoded by the browser itself, so the audit measures image
   weight in the same ballpark as a real delivered photograph. */
export async function mockPhoto(w = 1600, h = 1000, quality = 72) {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.setContent(
    `<body style="margin:0;width:${w}px;height:${h}px;` +
    `background:linear-gradient(135deg,#3d7a5f,#1a3a2c)"></body>`);
  const buf = await p.screenshot({ type: 'jpeg', quality });
  await b.close();
  return buf;
}

/* every context wants the same stub */
export async function stubPhotos(ctx) {
  const body = placeholder();
  await ctx.route('**/images.unsplash.com/**', r =>
    r.fulfill({ status: 200, contentType: 'image/png', body }));
}
