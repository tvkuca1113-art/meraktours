import test from 'node:test';
import assert from 'node:assert/strict';
import { sarajevoToday,realDate,validateEnquiry,safePlan,buildMessage } from '../src/enquiry.mjs';
import { ui } from '../src/i18n.mjs';
import { languages,pathFor } from '../src/routes.mjs';
import { products,kayakDraft } from '../src/catalog.mjs';
const base={offer:'tour-01',date:'2026-11-10',flexible:false,guests:2,transfer:false,kayak:false};
test('Sarajevo dates respect winter offset, summer offset and DST boundaries',()=>{
 assert.equal(sarajevoToday(new Date('2026-11-01T23:30:00Z')),'2026-11-02');
 assert.equal(sarajevoToday(new Date('2026-07-01T22:30:00Z')),'2026-07-02');
 assert.equal(sarajevoToday(new Date('2026-03-29T00:30:00Z')),'2026-03-29');
 assert.equal(sarajevoToday(new Date('2026-10-25T01:30:00Z')),'2026-10-25');
});
test('invalid calendar and past dates are rejected without coercion',()=>{
 for(const d of ['2026-02-30','2026-13-02','02/11/2026','2026-01-00'])assert.equal(realDate(d),false);
 assert.equal(realDate('2028-02-29'),true);assert.equal(realDate('2027-02-29'),false);
 assert.deepEqual(validateEnquiry({...base,date:'2026-11-01'},'2026-11-02'),{date:true});
 assert.deepEqual(validateEnquiry(base,'2026-11-02'),{});
});
test('flexible date works and six-person tour capacity is never applied to kayaking',()=>{
 assert.deepEqual(validateEnquiry({...base,date:'',flexible:true},'2026-11-02'),{});
 assert.equal(validateEnquiry({...base,guests:7},'2026-11-02').guests,true);
 assert.deepEqual(validateEnquiry({...base,offer:'kayaks',guests:7},'2026-11-02'),{});
 assert.equal(kayakDraft.capacity,null);
});
test('group size must be a positive whole number and offer IDs are allowlisted',()=>{
 for(const guests of [0,-1,1.5,'abc',Infinity,10000])assert.equal(validateEnquiry({...base,guests},'2026-11-02').guests,true);
 assert.equal(validateEnquiry({...base,offer:'made-up'},'2026-11-02').offer,true);
});
test('shared plans cannot retain contact data, arbitrary text or arbitrary URLs',()=>{
 const s=safePlan(new URLSearchParams('offer=tour-02&date=2026-11-10&guests=2&kayak=1&name=Emin&email=a%40b.com&phone=123&pickup=hotel&note=private&url=https%3A%2F%2Fexample.com'));
 assert.deepEqual(s,{offer:'tour-02',date:'2026-11-10',guests:'2',kayak:'1'});
 assert.deepEqual(safePlan(new URLSearchParams('offer=unknown&guests=-1&date=2026-02-30&kayak=evil')),{});
});
for(const lang of languages)test(`WhatsApp message is complete and encoded once: ${lang}`,()=>{
 const localizedProducts=products.map(p=>({id:p.id,title:p.localizedContent[lang].title}));
 const message=buildMessage({...base,kayak:true,transfer:true},{translations:ui[lang],products:localizedProducts,lang});
 const url=new URL(`https://wa.me/38763822083?text=${encodeURIComponent(message)}`);
 assert.equal(url.searchParams.get('text'),message);assert.ok(message.includes(localizedProducts[0].title));assert.ok(message.includes(ui[lang].kayakInterest));assert.ok(message.includes(ui[lang].closing));
 assert.equal(pathFor('tour-01',lang).split('/')[1],lang);
});
