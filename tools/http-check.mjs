import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { serve } from './lib.mjs';
import { legacyRedirects } from '../src/routes.mjs';
const {server}=await serve(0);const origin=`http://127.0.0.1:${server.address().port}`;
try{
 const pages=JSON.parse(readFileSync('dist/route-manifest.json','utf8')).pages;
 for(const p of pages){const r=await fetch(origin+p.path);assert.equal(r.status,200,p.path);assert.ok((r.headers.get('content-type')||'').includes('text/html'));}
 for(const r of legacyRedirects){const result=await fetch(origin+r.source,{redirect:'manual'});assert.equal(result.status,308,r.source);assert.equal(result.headers.get('location'),r.destination);}
 const unknown=await fetch(origin+'/not-a-real-page/');assert.equal(unknown.status,404);assert.ok((await unknown.text()).includes('404'));
 console.log(`HTTP: ${pages.length} pages 200; ${legacyRedirects.length} permanent redirects; unknown path 404`);
}finally{server.close();}
