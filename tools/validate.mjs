import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { HtmlValidate } from 'html-validate';
import { pathFor,languages,routeSlugs,legacyRedirects } from '../src/routes.mjs';
import { ui } from '../src/i18n.mjs';
import { business,kayakDraft,products } from '../src/catalog.mjs';
const manifest=JSON.parse(readFileSync('dist/route-manifest.json','utf8'));
// The validator's older ARIA table needs an explicit dialog role; native semantics are retained.
const htmlValidator=new HtmlValidate({extends:['html-validate:recommended'],rules:{'void-style':'off','no-inline-style':'off','svg-focusable':'off','long-title':'off','prefer-native-element':'off','no-trailing-whitespace':'off','wcag/h32':'off','no-implicit-close':'off','no-redundant-role':'off'}});
let linkCount=0;const titles=new Set(),failures=[];
for(const page of manifest.pages){
 const html=readFileSync(join('dist',page.path,'index.html'),'utf8');
 assert.ok(html.includes(`<html lang="${page.lang}">`));
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page.path+' H1 count');
 const title=html.match(/<title>(.*?)<\/title>/s)[1];assert.ok(!titles.has(page.lang+title),page.path+' duplicate title');titles.add(page.lang+title);
 assert.ok(html.includes(`rel="canonical" href="https://meraktours.vercel.app${page.path}"`),page.path+' canonical');
 for(const lang of languages)assert.ok(html.includes(`hreflang="${lang}" href="https://meraktours.vercel.app${pathFor(page.id,lang)}"`),page.path+' hreflang');
 assert.ok(!html.includes('AggregateRating')&&!html.includes('BookingAction'));
 assert.ok(!/scontent-|cdninstagram/.test(html));
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const raw=match[1].replace(/&amp;/g,'&');if(!raw.startsWith('/')&&!raw.startsWith('#'))continue;
  const u=new URL(raw,'https://meraktours.vercel.app'+page.path);const path=decodeURIComponent(u.pathname);
  const file=path.endsWith('/')?join('dist',path,'index.html'):join('dist',path);
  assert.ok(existsSync(file),page.path+' missing '+raw);
  if(u.hash){const target=readFileSync(file,'utf8');assert.ok(target.includes(`id="${u.hash.slice(1)}"`),page.path+' missing anchor '+raw);}
  linkCount++;
 }
 const result=await htmlValidator.validateString(html,page.path);if(!result.valid)failures.push({path:page.path,messages:result.results.flatMap(r=>r.messages).map(m=>({rule:m.ruleId,message:m.message,selector:m.selector}))});
}
assert.equal(legacyRedirects.length,7);
assert.equal(kayakDraft.location,null);assert.equal(kayakDraft.capacity,null);assert.equal(kayakDraft.price,null);assert.equal(kayakDraft.publicationStatus,'draft');
assert.equal(business.webForm.enabled,false);assert.equal(business.analytics.enabled,false);
assert.ok(products.every(p=>p.price===null&&p.bookingMode==='enquiry'&&p.kayakCombinationApproved===false));
const production=spawnSync(process.execPath,['build.mjs'],{env:{...process.env,VERCEL_ENV:'production'},encoding:'utf8'});assert.notEqual(production.status,0);assert.match(production.stderr,/PRODUCTION_RELEASE_BLOCKED/);
console.log(JSON.stringify({pages:manifest.pages.length,localLinksAndAssets:linkCount,uniqueTitles:titles.size,languageMaps:'complete',productionGuard:'passed',htmlFailures:failures},null,2));
if(failures.length)process.exitCode=1;
