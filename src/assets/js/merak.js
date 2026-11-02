import { sarajevoToday, validateEnquiry, buildMessage, safePlan, allowedOffers } from '../../enquiry.mjs';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const config=JSON.parse($('#site-data').textContent),t=config.translations;
const STORE='merak-choice-v1';
let consent=false;
const seen=new Set();
function track(event,params={},once=false){
 if(!consent||!config.analytics.enabled||!config.analytics.policyApproved)return;
 const allowed=['view_offer','hero_kayaks_click','enquiry_start','whatsapp_open'];if(!allowed.includes(event))return;
 const key=event+':'+(params.offer_id||config.id);if(once&&seen.has(key))return;seen.add(key);
 const safe={event,offer_id:params.offer_id||config.id,language:config.lang,category:(params.offer_id||config.id).startsWith('tour-')?'private-tour':'information',cta_placement:params.cta_placement||'page'};
 window.dispatchEvent(new CustomEvent('merak:analytics',{detail:safe}));
}
// A provider is deliberately not loaded. A reviewed integration can listen after consent.
window.addEventListener('merak:consent',e=>{consent=e.detail?.analytics===true&&config.analytics.policyApproved===true;});
if(config.id.startsWith('tour-')||config.id==='kayaks')track('view_offer',{},true);
$('[data-cta="hero-kayaks"]')?.addEventListener('click',()=>track('hero_kayaks_click',{cta_placement:'hero'},true));
const menu=$('.menu-toggle'),drawer=$('#mobile-menu');
function closeMenu(){if(!menu)return;drawer.hidden=true;menu.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));drawer.hidden=!open;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}$$('.language-picker[open]').forEach(d=>d.open=false);}});
document.addEventListener('click',e=>{for(const d of $$('.language-picker[open]'))if(!d.contains(e.target))d.open=false;});
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
const form=$('#enquiry-form');let message='';
function state(){if(!form)return safePlan(new URLSearchParams(location.search));return {offer:form.elements.offer.value,date:form.elements.date.value,flexible:form.elements.flexible.checked,guests:form.elements.guests.value,transfer:form.elements.transfer.checked,kayak:form.elements.kayak.checked,interest:form.elements.interest?.value||null};}
function safeUrl(base){const url=new URL(base,location.origin),s=state();url.search='';if(s.offer&&allowedOffers.includes(s.offer))url.searchParams.set('offer',s.offer);if(s.flexible!==true&&s.flexible!=='1'&&s.date&&/^\d{4}-\d{2}-\d{2}$/.test(s.date))url.searchParams.set('date',s.date);if(s.guests&&/^\d{1,4}$/.test(s.guests))url.searchParams.set('guests',s.guests);for(const k of ['flexible','transfer','kayak'])if(s[k]!==undefined)url.searchParams.set(k,s[k]===true||s[k]==='1'?'1':'0');if(['nature','culture','views'].includes(s.interest))url.searchParams.set('interest',s.interest);return url;}
$$('[data-language]').forEach(a=>a.addEventListener('click',()=>{a.href=safeUrl(a.href).href;}));
function syncFields(){if(!form)return;const isTour=form.elements.offer.value.startsWith('tour-');if(isTour)form.elements.guests.max='6';else form.elements.guests.removeAttribute('max');const isKayak=form.elements.offer.value==='kayaks';$('[data-transfer-choice]',form).hidden=isTour;$('[data-kayak-choice]',form).hidden=isKayak||isTour;if(isTour){form.elements.kayak.checked=false;form.elements.transfer.checked=false;}form.elements.date.disabled=form.elements.flexible.checked;}
function applyPlan(plan){
 if(!form)return;
 if(form.elements.offer.type!=='hidden'&&plan.offer)form.elements.offer.value=plan.offer;
 if(plan.date){form.elements.date.value=plan.date;form.elements.flexible.checked=false;}
 if(plan.flexible!==undefined)form.elements.flexible.checked=plan.flexible==='1';
 if(plan.guests)form.elements.guests.value=String(plan.guests);
 for(const k of ['kayak','transfer'])if(plan[k]!==undefined)form.elements[k].checked=plan[k]==='1';
 if(form.elements.interest&&plan.interest)form.elements.interest.value=plan.interest;
 syncFields();
}
if(form){
 form.elements.date.min=sarajevoToday();syncFields();
 const fromUrl=safePlan(new URLSearchParams(location.search));
 if(Object.keys(fromUrl).length)applyPlan(fromUrl);
 else try{const saved=localStorage.getItem(STORE);if(saved)applyPlan(safePlan(new URLSearchParams(JSON.parse(saved))));}catch{}
 form.elements.flexible.addEventListener('change',syncFields);
 form.elements.offer.addEventListener('change',syncFields);
 form.elements.date.addEventListener('change',()=>{if(form.elements.date.value){form.elements.flexible.checked=false;syncFields();}});
 form.addEventListener('input',()=>track('enquiry_start',{offer_id:state().offer,cta_placement:form.dataset.placement},true));
 form.addEventListener('submit',e=>{
  e.preventDefault();const s=state(),errors=validateEnquiry(s);let first;
  for(const key of ['date','guests']){const el=form.elements[key],err=$('#'+key+'-error');if(errors[key]){el.setAttribute('aria-invalid','true');err.textContent=t[key==='date'?'invalidDate':'invalidGuests'];err.hidden=false;first??=el;}else{el.removeAttribute('aria-invalid');err.hidden=true;}}
  if(Object.keys(errors).length){first?.focus();return;}
  message=buildMessage(s,config);$('#message').value=message;
  $('#whatsapp-link').href=`https://wa.me/${config.phone}?text=${encodeURIComponent(message)}`;
  $('[data-form-step="1"]').hidden=true;$('[data-form-step="2"]').hidden=false;
  $('#message').focus();track('enquiry_start',{offer_id:s.offer,cta_placement:form.dataset.placement},true);
 });
 $('[data-back]').addEventListener('click',()=>{$('[data-form-step="2"]').hidden=true;$('[data-form-step="1"]').hidden=false;form.elements.guests.focus();});
 let lastOpen=0;
 $('#whatsapp-link').addEventListener('click',e=>{if(Date.now()-lastOpen<1200){e.preventDefault();return;}lastOpen=Date.now();track('whatsapp_open',{offer_id:state().offer,cta_placement:form.dataset.placement});});
 $('[data-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message);$('#form-status').textContent=t.copied;}catch{$('#message').focus();$('#message').select();$('#form-status').textContent=t.copyFallback;}});
 $('[data-save]').addEventListener('click',()=>{const s=state();if(Object.keys(validateEnquiry(s)).length){$('[data-save-status]').textContent=t.invalidGuests;return;}try{localStorage.setItem(STORE,JSON.stringify([...safeUrl(location.href).searchParams]));$('[data-save-status]').textContent=t.saved;}catch{$('[data-save-status]').textContent=t.storageError;}});
 $('[data-clear]').addEventListener('click',()=>{try{localStorage.removeItem(STORE);}catch{}form.reset();syncFields();$('[data-save-status]').textContent=t.deleted;});
}
$('[data-delete-saved]')?.addEventListener('click',()=>{try{localStorage.removeItem(STORE);$('[data-delete-status]').textContent=t.deleted;}catch{$('[data-delete-status]').textContent=t.storageError;}});
$('[data-share]')?.addEventListener('click',async()=>{const canonical=$('link[rel="canonical"]').href;const url=safeUrl(canonical).href;try{await navigator.clipboard.writeText(url);$('[data-share-status]').textContent=t.shared;}catch{$('[data-share-status]').textContent=url;}});
const finder=$('#finder-form');finder?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(finder),max=Number(f.get('time')),interest=f.get('interest'),company=f.get('company');const choices=Number.isNaN(max)?[]:config.products.filter(p=>p.max<=max&&p.interests.includes(interest)).sort((a,b)=>a.max-b.max).slice(0,3);const result=$('#finder-results');result.replaceChildren();if(!choices.length){const p=document.createElement('p');p.textContent=t.noResults;result.append(p);}for(const p of choices){const a=document.createElement('a');a.className='recommendation';a.href=p.url;const strong=document.createElement('strong');strong.textContent=p.title;const span=document.createElement('span');span.textContent=`${p.reason} · ${p.min}–${p.max} ${t.hours} · ${t.price}`;a.append(strong,span);result.append(a);}if(company==='family'){const note=document.createElement('p');note.className='form-note';note.textContent=t.familyNote;result.append(note);}});
const lightbox=$('#lightbox'),images=$$('[data-gallery-image]');let imageIndex=0,opener;
function showImage(i){imageIndex=(i+images.length)%images.length;const a=images[imageIndex];$('#lightbox-image').src=a.href;$('#lightbox-image').alt=a.dataset.alt||'';$('#lightbox-caption').textContent=`${t.imageCount} ${imageIndex+1} / ${images.length} · ${a.dataset.alt||''}`;$('[data-previous]').hidden=images.length<2;$('[data-next-photo]').hidden=images.length<2;}
images.forEach((a,i)=>a.addEventListener('click',e=>{if(typeof lightbox.showModal!=='function')return;e.preventDefault();opener=a;showImage(i);lightbox.showModal();document.body.classList.add('modal-open');}));
function closeLightbox(){lightbox.close();}
$('[data-close-lightbox]').addEventListener('click',closeLightbox);
lightbox.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
$('[data-previous]').addEventListener('click',()=>showImage(imageIndex-1));$('[data-next-photo]').addEventListener('click',()=>showImage(imageIndex+1));
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showImage(imageIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showImage(imageIndex+1);}});
const sticky=$('.mobile-cta'),mainCta=$('[data-main-cta]');let ctaVisible=true,formVisible=false;
function updateSticky(){if(!sticky)return;const keyboard=window.visualViewport&&window.visualViewport.height<window.innerHeight*.77;const active=document.activeElement;const editing=active&&['INPUT','SELECT','TEXTAREA'].includes(active.tagName);sticky.hidden=ctaVisible||formVisible||keyboard||editing||lightbox.open;document.body.classList.toggle('has-mobile-cta',!sticky.hidden);}
if(sticky&&mainCta&&'IntersectionObserver' in window){const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.target===mainCta)ctaVisible=entry.isIntersecting;if(entry.target===$('#upit'))formVisible=entry.isIntersecting;});updateSticky();},{rootMargin:'-82px 0px 0px 0px',threshold:0});obs.observe(mainCta);obs.observe($('#upit'));window.visualViewport?.addEventListener('resize',updateSticky);document.addEventListener('focusin',updateSticky);document.addEventListener('focusout',()=>requestAnimationFrame(updateSticky));lightbox.addEventListener('close',updateSticky);}
