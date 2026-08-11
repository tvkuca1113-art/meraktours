/* Frames of the journey at set scroll positions, desktop or mobile.

     npm run shots                  → desktop, tour 01, 10 frames
     npm run shots -- mobile 2 12   → phone, tour 03, 13 frames
*/
import { mkdirSync } from 'node:fs';
import { serve, launch, stubPhotos } from './lib.mjs';
const { server } = await serve(4324);
const mode=process.argv[2]||'desktop', tour=+(process.argv[3]||0), N=+(process.argv[4]||9);
const v = mode==='mobile'?{w:390,h:844,d:2}:{w:1440,h:900,d:1};
mkdirSync('shots', { recursive: true });
const b = await launch({ args: ['--font-render-hinting=none'] });
const ctx=await b.newContext({viewport:{width:v.w,height:v.h},deviceScaleFactor:v.d});
await stubPhotos(ctx);
const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:4324/',{waitUntil:'load'});
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
await p.evaluate(()=>document.getElementById('journey').scrollIntoView());
await p.waitForFunction(()=>document.getElementById('journey').classList.contains('is-live'),{timeout:8000}).catch(()=>{});
await p.waitForTimeout(500);
if (tour) { await p.click(`.jsec__tabs [data-jtour="${tour}"]`); await p.waitForTimeout(900); }
const box = await p.evaluate((mob)=>{
  const t = mob ? document.getElementById('journeyMob') : document.getElementById('journeyTrack');
  const r = t.getBoundingClientRect();
  return { top: r.top+scrollY, span: mob ? t.offsetHeight - innerHeight*0.5 : t.offsetHeight - innerHeight };
}, mode==='mobile');
for (let i=0;i<=N;i++){
  const f=i/N;
  await p.evaluate(y=>scrollTo(0,y), box.top + box.span*f);
  await p.waitForTimeout(950);
  const lbl = await p.evaluate((mob)=>{
    if (mob) { const now=document.querySelector('.mstory.is-on .mstop.is-now'); return now?now.querySelector('.mstop__name').textContent+' · '+now.querySelector('.mstop__time').textContent:'—'; }
    const g=s=>(document.querySelector(s)||{}).textContent||'';
    return g('[data-jstep]')+' | '+g('[data-jname]')+' | '+g('[data-jtime]');
  }, mode==='mobile');
  await p.screenshot({path:`shots/${mode}-t${tour}-${String(i).padStart(2,'0')}.png`});
  console.log(String(i).padStart(2,'0'), (f*100).toFixed(0)+'%', lbl);
}
console.log(errs.length?('ERRORS '+errs[0]):'clean');
await b.close(); server.close();
