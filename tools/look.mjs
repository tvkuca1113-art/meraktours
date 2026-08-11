/* Full-page looks at the home page, for judging layout and overflow. */
import { mkdirSync } from 'node:fs';
import { serve, launch, stubPhotos } from './lib.mjs';
const { server } = await serve(4355);
const b = await launch({ args: ['--font-render-hinting=none'] });
mkdirSync('shots', { recursive: true });
const path=process.argv[2]||'/';
for (const v of [{n:'mobile',w:390,h:844,d:2},{n:'desktop',w:1440,h:900,d:1}]) {
  const ctx=await b.newContext({viewport:{width:v.w,height:v.h},deviceScaleFactor:v.d});
  await stubPhotos(ctx);
  const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:4355'+path,{waitUntil:'load'});
  await p.waitForTimeout(1200);
  /* walk the page so every reveal fires */
  await p.evaluate(async()=>{
    const step=innerHeight*0.7;
    for(let y=0;y<document.body.scrollHeight;y+=step){ scrollTo(0,y); await new Promise(r=>setTimeout(r,140)); }
    scrollTo(0,0); await new Promise(r=>setTimeout(r,500));
  });
  const over=await p.evaluate(()=>{
    const bad=[]; const w=document.documentElement.clientWidth;
    document.querySelectorAll('body *').forEach(el=>{
      if(el.ownerSVGElement) return;   // svg internals are clipped by their viewport
      const r=el.getBoundingClientRect();
      if(r.width>0 && (r.right>w+2 || r.left<-2) && getComputedStyle(el).position!=='fixed'){
        /* ignore anything living inside a horizontal scroller */
        let a=el.parentElement, skip=false;
        while(a && a!==document.body){
          const cs=getComputedStyle(a);
          if(a.scrollWidth>a.clientWidth+2 || cs.position==='fixed'){ skip=true; break; }
          a=a.parentElement;
        }
        if(skip) return;
        bad.push((el.tagName)+'.'+(typeof el.className==='string'?el.className:'')+'@'+Math.round(r.left)+'..'+Math.round(r.right)+' in '+(el.parentElement&&(el.parentElement.className||el.parentElement.tagName)));
      }
    });
    return [...new Set(bad)].slice(0,8);
  });
  console.log(v.n, 'doc width', await p.evaluate(()=>document.documentElement.scrollWidth), '| overflow:', over.length?over.join(', '):'none', errs.length?('ERR '+errs[0]):'');
  await p.screenshot({path:`shots/page-${v.n}.png`, fullPage:true});
  await ctx.close();
}
await b.close(); server.close();
