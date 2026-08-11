/* Measures frame pacing while scrolling the journey on a throttled phone. */
import { serve, launch, stubPhotos } from './lib.mjs';
const { server } = await serve(4333);
const b = await launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await stubPhotos(ctx);
const p=await ctx.newPage();
const cdp=await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});   // roughly a mid-range phone
await p.goto('http://127.0.0.1:4333/',{waitUntil:'load'});
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.getElementById('journey').scrollIntoView();});
await p.waitForTimeout(2500);
const res = await p.evaluate(async () => {
  const frames=[]; let last=performance.now(), stop=false;
  function loop(t){ frames.push(t-last); last=t; if(!stop) requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  const start=scrollY, total=innerHeight*4;
  for (let i=0;i<120;i++){ scrollTo(0,start+total*i/120); await new Promise(r=>setTimeout(r,16)); }
  stop=true; await new Promise(r=>setTimeout(r,60));
  frames.sort((a,b)=>a-b);
  const q=f=>frames[Math.floor(f*(frames.length-1))];
  return { n:frames.length, median:+q(.5).toFixed(1), p90:+q(.9).toFixed(1), p99:+q(.99).toFixed(1),
           worst:+frames[frames.length-1].toFixed(1), over32:frames.filter(x=>x>32).length };
});
console.log('4x CPU throttle · frame gaps (ms):', JSON.stringify(res));
await b.close(); server.close();
