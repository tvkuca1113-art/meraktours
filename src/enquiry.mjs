export const allowedOffers = ['tour-01','tour-02','tour-03','tour-04','kayaks','custom','general'];
export function sarajevoToday(now=new Date()) {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Sarajevo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=k=>parts.find(p=>p.type===k).value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function realDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [y,m,d]=value.split('-').map(Number);const dt=new Date(Date.UTC(y,m-1,d));return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;}
export function validateEnquiry(s,today=sarajevoToday()){
 const errors={};if(!allowedOffers.includes(s.offer))errors.offer=true;
 if(!s.flexible&&(!realDate(s.date)||s.date<today))errors.date=true;
 const guests=Number(s.guests);if(!Number.isSafeInteger(guests)||guests<1||guests>9999||(s.offer.startsWith('tour-')&&guests>6))errors.guests=true;
 return errors;
}
export function safePlan(params){
 const result={};if(allowedOffers.includes(params.get('offer')))result.offer=params.get('offer');
 if(realDate(params.get('date')||''))result.date=params.get('date');
 if(/^\d{1,4}$/.test(params.get('guests')||'')&&Number(params.get('guests'))>0)result.guests=params.get('guests');
 for(const k of ['flexible','kayak','transfer'])if(['0','1'].includes(params.get(k)))result[k]=params.get(k);
 if(['nature','culture','views'].includes(params.get('interest')))result.interest=params.get('interest');
 return result;
}
export function buildMessage(s,{translations:t,products,lang}){
 const title=products.find(p=>p.id===s.offer)?.title || (s.offer==='kayaks'?t.kayakQuestion:s.offer==='custom'?t.custom:t.general);
 const date=s.flexible?t.flexible:new Intl.DateTimeFormat(lang,{timeZone:'Europe/Sarajevo',year:'numeric',month:'long',day:'numeric'}).format(new Date(`${s.date}T12:00:00Z`));
 return [t.greeting,'',title,`${t.date}: ${date}`,`${t.guests}: ${Number(s.guests)}`,s.transfer?`${t.transfer}: ${t.yes}`:null,s.kayak&&s.offer!=='kayaks'?`${t.kayakInterest}: ${t.yes}`:null,s.interest?`${t.preferences}: ${t[s.interest]}`:null,`${t.language}: ${{bs:'Bosanski',en:'English',de:'Deutsch',it:'Italiano',es:'Español'}[lang]}`,'',t.closing].filter(v=>v!==null).join('\n');
}
