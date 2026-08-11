/* The behaviour that has to keep working: booking, the journey, the phone. */
import { serve, launch, stubPhotos } from './lib.mjs';
const { server } = await serve(4501);
const b = await launch();
const ok=[],bad=[];
const t=(n,c)=>c?ok.push(n):bad.push(n);

// --- desktop: booking sheet from a tour page
let ctx=await b.newContext({viewport:{width:1440,height:900}});
await stubPhotos(ctx);
await ctx.route('https://wa.me/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>wa</title>' }));
let p=await ctx.newPage();
await p.goto('http://127.0.0.1:4501/tours/jablanica-sarajevo-old-town/',{waitUntil:'load'});
await p.click('[data-book]');
await p.waitForTimeout(500);
t('sheet opens', await p.isVisible('#sheet .sheet__panel'));
t('tour preselected', (await p.inputValue('#bookTourName'))==='Jablanica & Sarajevo Old Town');
await p.fill('#bookDate','2026-09-14');
await p.selectOption('#bookGuests','4');
await p.fill('#bookPickup','Hotel Eden, Mostar');
await p.fill('#bookNote','We would like a slower morning.');
await p.waitForTimeout(200);
const prev=await p.textContent('#bookPreview');
t('preview has tour', prev.includes('Jablanica & Sarajevo Old Town'));
t('preview has date', /Monday,? 14 September 2026/.test(prev));
t('preview has guests', prev.includes('Travellers: 4'));
t('preview has pickup', prev.includes('Hotel Eden, Mostar'));
t('preview has note', prev.includes('slower morning'));
/* the handoff is an anchor click, not window.open, so the new tab arrives
   on the context rather than as a popup event */
const opened=new Promise(r=>ctx.once('page',pg=>r(pg)));
await p.click('#bookForm button[type=submit]');
const popup=await Promise.race([opened,new Promise(r=>setTimeout(()=>r(null),5000))]);
const waUrl=popup?popup.url():'';
t('whatsapp url', waUrl.startsWith('https://wa.me/38763822083?text=') && decodeURIComponent(waUrl.split('text=')[1]).includes('Hotel Eden'));
console.log('   wa url sample:', decodeURIComponent(waUrl.split('text=')[1]||'').split('\n').slice(0,6).join(' / '));
if(popup) await popup.close();
// escape closes
await p.keyboard.press('Escape'); await p.waitForTimeout(500);
t('sheet closes on Escape', !(await p.isVisible('#sheet .sheet__panel')));
await ctx.close();

// --- home: map tabs + builder
ctx=await b.newContext({viewport:{width:1440,height:900}});
await stubPhotos(ctx);
p=await ctx.newPage();
await p.goto('http://127.0.0.1:4501/',{waitUntil:'load'});
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.getElementById('places').scrollIntoView({block:'center'})});
await p.waitForTimeout(900);
t('places index renders', (await p.$$('.pidx__row')).length === 10);
await p.hover('[data-prow="3"]'); await p.waitForTimeout(700);
t('places image follows the list', await p.evaluate(()=>{
  const on=document.querySelector('.pidx__shot.is-on');
  return !!on && on.getAttribute('data-pshot')==='3' && document.querySelector('[data-prow="3"]').classList.contains('is-on');
}));
console.log('   places:', await p.textContent('[data-prow="3"] .pidx__name'));
await p.evaluate(()=>document.getElementById('create').scrollIntoView());
await p.waitForTimeout(400);
await p.click('.chips label:has-text("Nature")');
await p.click('.chips label:has-text("Hidden gems")');
await p.click('#journeyForm .chips >> nth=1 >> label:has-text("Blagaj")');
await p.fill('#jPickup','Villa Anna, Mostar');
await p.waitForTimeout(200);
const jp=await p.textContent('#journeyPreview');
t('journey interests', jp.includes('Interests: Nature, Hidden gems'));
t('journey places', jp.includes('Blagaj'));
t('journey pickup', jp.includes('Villa Anna, Mostar'));
await ctx.close();

// --- mobile drawer
ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await stubPhotos(ctx);
p=await ctx.newPage();
await p.goto('http://127.0.0.1:4501/',{waitUntil:'load'});
await p.click('#burger'); await p.waitForTimeout(800);
t('drawer opens', await p.isVisible('#drawer .drawer__nav a'));
t('burger aria', (await p.getAttribute('#burger','aria-expanded'))==='true');
await p.click('#drawer a:has-text("Journeys")'); await p.waitForTimeout(900);
t('drawer closes on nav', (await p.getAttribute('#burger','aria-expanded'))==='false');
t('scrolled to journeys', await p.evaluate(()=>window.scrollY>400));
await ctx.close();

// --- the journey: the line draws, the story follows, the switcher redraws
ctx=await b.newContext({viewport:{width:1440,height:900}});
await stubPhotos(ctx);
p=await ctx.newPage();
await p.goto('http://127.0.0.1:4501/',{waitUntil:'load'});
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
await p.evaluate(()=>document.getElementById('journey').scrollIntoView());
await p.waitForFunction(()=>document.getElementById('journey').classList.contains('is-live'),{timeout:8000}).catch(()=>{});
t('journey is live', await p.evaluate(()=>document.getElementById('journey').classList.contains('is-live')));
t('one route is active', await p.evaluate(()=>document.querySelectorAll('#atlasLive .atlas__route.is-on').length===1));
const jgo=async(f)=>{await p.evaluate((f)=>{const t=document.getElementById('journeyTrack');
  scrollTo(0,t.getBoundingClientRect().top+scrollY+(t.offsetHeight-innerHeight)*f);},f);await p.waitForTimeout(700);};
const jread=()=>p.evaluate(()=>({
  step:document.querySelector('[data-jstep]').textContent,
  name:document.querySelector('[data-jname]').textContent,
  time:document.querySelector('[data-jtime]').textContent,
  desc:document.querySelector('[data-jdesc]').textContent,
  dash:+document.querySelector('#atlasLive .atlas__route.is-on').style.strokeDashoffset,
  cta:document.querySelector('[data-jcta]').getAttribute('href'),
  van:!!document.querySelector('#atlasLive .atlas__van')
}));
await jgo(0); const a0=await jread();
const seen=[a0];
for (const f of [.1,.18,.26,.34,.42,.5,.6,.68,.76,.82,.9,1]) { await jgo(f); seen.push(await jread()); }
const a9=seen[seen.length-1];
const said=(n,tm)=>seen.some(x=>x.name.includes(n)&&x.time.includes(tm));
t('journey starts in Mostar at 09:00', a0.name==='Mostar' && a0.time==='09:00' && a0.dash===1000);
t('journey has a traveller on the line', a0.van);
t('journey reaches Pocitelj', said('Počitelj','09:40'));
t('journey reaches Kravice', said('Kravice','11:30'));
t('journey returns to Mostar at 16:30', said('Mostar','16:30'));
t('the line draws as you scroll', seen.some(x=>x.dash>1&&x.dash<999) && a9.dash===0);
t('journey ends on the whole day', /whole day/i.test(a9.step));
t('journey cta points at tour 01', a0.cta==='/tours/pocitelj-kravice-waterfalls/');
if(bad.length) console.log('   journey trace:', seen.map(x=>x.name+' '+x.time+' d'+x.dash).join(' | '));
await p.click('.jsec__tabs [data-jtour="2"]'); await p.waitForTimeout(1200);
const a10=await jread();
t('switcher redraws tour 03', a10.cta==='/tours/jablanica-sarajevo-old-town/' &&
  await p.evaluate(()=>document.querySelector('#atlasLive .atlas__route.is-on').getAttribute('data-route')==='2'));
await jgo(0); await p.waitForTimeout(700);
t('journey reversible', (await jread()).name==='Mostar');
await ctx.close();

// --- the phone story
ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await stubPhotos(ctx);
p=await ctx.newPage();
await p.goto('http://127.0.0.1:4501/',{waitUntil:'load'});
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.getElementById('journey').scrollIntoView();});
await p.waitForTimeout(700);
t('phone shows the map above the story', await p.evaluate(()=>{
  const map=document.querySelector('.jsec__map'), story=document.querySelector('.jsec__story');
  const mob=document.getElementById('journeyMob');
  return map.offsetHeight>120 && mob.offsetHeight>0 && story.offsetHeight===0;
}));
t('phone story lists every stop', await p.evaluate(()=>
  document.querySelectorAll('.mstory[data-mtour="0"] .mstop').length===5));
await p.evaluate(()=>{const s=document.querySelectorAll('.mstory.is-on .mstop')[2];
  scrollTo(0,s.getBoundingClientRect().top+scrollY-innerHeight*0.35);});
await p.waitForTimeout(1000);
t('phone rail follows the scroll', await p.evaluate(()=>{
  const now=document.querySelector('.mstory.is-on .mstop.is-now');
  return !!now && parseFloat(document.querySelector('[data-mrail]').style.height)>5;
}));
t('phone map draws with the story', await p.evaluate(()=>{
  const d=+document.querySelector('#atlasLive .atlas__route.is-on').style.strokeDashoffset;
  return d>1 && d<999;
}));
await p.click('.jsec__tabs [data-jtour="3"]'); await p.waitForTimeout(900);
t('phone switcher swaps the story', await p.evaluate(()=>{
  const on=document.querySelector('.mstory.is-on');
  return on && on.getAttribute('data-mtour')==='3' && !on.hidden;
}));
await ctx.close();

await b.close();server.close();
console.log('\nPASS ('+ok.length+'): '+ok.join(', '));
console.log(bad.length?('FAIL ('+bad.length+'): '+bad.join(', ')):'FAIL (0)');
process.exit(bad.length ? 1 : 0);
