/* axe-core accessibility, HTML validation and Lighthouse, over a local mirror
   of dist/ where every photograph is a stand-in, so the numbers measure the
   site rather than the CDN. */
import { readFileSync, writeFileSync, existsSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { serve, launch, mockPhoto } from './lib.mjs';

/* ---- build an offline mirror of dist so audits aren't skewed by the CDN --- */
rmSync('dist-audit', { recursive: true, force: true });
cpSync('dist', 'dist-audit', { recursive: true });
/* a real JPEG, weighing about what a delivered photograph weighs, so the
   performance numbers stay honest */
writeFileSync('dist-audit/assets/img/mock.jpg', await mockPhoto());
function walk(d) {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) {
      let s = readFileSync(p, 'utf8');
      s = s.replace(/https:\/\/images\.unsplash\.com\/photo-[^\s"',]+/g, '/assets/img/mock.jpg');
      s = s.replace(/<link rel="preconnect"[^>]*images\.unsplash[^>]*>/g, '');
      writeFileSync(p, s);
    }
  }
}
walk('dist-audit');

const ROOT = 'dist-audit';
const { server } = await serve(4399, ROOT);

/* ---------------- axe accessibility ------------------------------------- */
const axeSrc = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const browser = await launch();
const PAGES = ['/', '/tours/pocitelj-kravice-waterfalls/', '/tours/jablanica-sarajevo-old-town/', '/create-your-journey/', '/credits/'];

console.log('\n=== ACCESSIBILITY (axe-core, wcag2a/aa) ===');
for (const path of PAGES) {
  for (const vp of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const ctx = await browser.newContext({ viewport: vp });
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:4399' + path, { waitUntil: 'load' });
    /* walk the page and let every reveal finish — axe skips elements that are
       still transparent, and mis-measures ones caught halfway */
    await p.evaluate(async () => {
      const step = innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
      }
      scrollTo(0, 0);
    });
    await p.waitForTimeout(2600);
    await p.addScriptTag({ content: axeSrc });
    const r = await p.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }));
    const v = r.violations.filter(x => x.impact !== 'minor' || true);
    console.log(`${path} @${vp.width}: ${v.length ? v.map(x => `${x.impact}:${x.id}(${x.nodes.length}) ${x.nodes[0].target}`).join(' | ') : 'clean'}`);
    await ctx.close();
  }
}
await browser.close();

/* ---------------- html validation --------------------------------------- */
console.log('\n=== HTML VALIDATION ===');
const { HtmlValidate, esmResolver } = await import('html-validate');
const hv = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: { 'no-inline-style': 'off', 'attribute-boolean-style': 'off', 'void-style': 'off', 'no-trailing-whitespace': 'off', 'long-title': 'off', 'wcag/h30': 'off', 'form-dup-name': ['error', { shared: ['radio', 'checkbox'] }] }
});
for (const path of PAGES) {
  const f = join(ROOT, path === '/' ? 'index.html' : path + 'index.html');
  const rep = await hv.validateFile(f);
  const msgs = rep.results.flatMap(r => r.messages);
  console.log(`${path}: ${msgs.length ? msgs.slice(0, 8).map(m => `${m.ruleId}@${m.line}:${m.message}`).join(' | ') : 'valid'}`);
}

/* ---------------- lighthouse -------------------------------------------- */
console.log('\n=== LIGHTHOUSE (mobile emulation, images served locally) ===');
const lighthouse = (await import('lighthouse')).default;
const { launch: launchChrome } = await import('chrome-launcher');
const { chromium } = await import('playwright');
const chrome = await launchChrome({
  chromePath: process.env.CHROME_PATH || chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu']
});
for (const path of ['/', '/tours/pocitelj-kravice-waterfalls/']) {
  const res = await lighthouse('http://127.0.0.1:4399' + path, { port: chrome.port, output: 'json', logLevel: 'error' });
  const c = res.lhr.categories;
  console.log(`${path}  perf ${Math.round(c.performance.score * 100)} | a11y ${Math.round(c.accessibility.score * 100)} | best ${Math.round(c['best-practices'].score * 100)} | seo ${Math.round(c.seo.score * 100)}`);
  const a = res.lhr.audits;
  console.log(`   FCP ${a['first-contentful-paint'].displayValue} · LCP ${a['largest-contentful-paint'].displayValue} · TBT ${a['total-blocking-time'].displayValue} · CLS ${a['cumulative-layout-shift'].displayValue} · SI ${a['speed-index'].displayValue}`);
  const fails = Object.values(a).filter(x => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative');
  console.log('   attention: ' + (fails.length ? fails.map(f => f.id).join(', ') : 'none'));
}
await chrome.kill();
server.close();
rmSync('dist-audit', { recursive: true, force: true });
