// Run only when editing media. Normal builds are offline and reuse committed assets.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { media } from '../src/data.mjs';
import { photoAlts } from '../src/catalog.mjs';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
mkdirSync('src/assets/photos',{recursive:true});
mkdirSync('docs',{recursive:true});
const entries=[];
for (const [key,alt] of Object.entries(photoAlts)) {
 const old = media[key];
 const pending = key==='kayakShore';
 let original;
 if(pending) {
   if(!existsSync('.review-media/kayak-shore-original.jpg')) continue;
   original=readFileSync('.review-media/kayak-shore-original.jpg');
 } else if(old.local) original=readFileSync(`src/assets/photos/${old.local}-1440.jpg`);
 else {
   const response=await fetch(`https://images.unsplash.com/${old.id}?fit=max&w=1800&q=86`);
   if(!response.ok) throw new Error(`${key}: ${response.status}`);
   original=Buffer.from(await response.arrayBuffer());
 }
 const metadata=await sharp(original).metadata();
 for(const width of [480,768,1080,1440]) {
   for (const format of ['webp','jpg']) {
     const file=`src/assets/photos/${key}-${width}.${format}`;
     await sharp(original).rotate().resize({width,withoutEnlargement:true}).toFormat(format==='jpg'?'jpeg':'webp',{quality:format==='jpg'?79:78}).toFile(file);
   }
 }
 entries.push({id:key,file:`/assets/photos/${key}-{width}.{webp,jpg}`,sourcePost:pending?'https://www.instagram.com/rent_a_boat_2026/p/DZsQSDao4jC/':old.page||'existing repository / owner photograph',
 rightsHolder:pending?null:old.by, sourceAccount:pending?'@rent_a_boat_2026':null,
 approvalStatus:pending?'pending_owner_rights_confirmation':old.own?'existing_owner_asset':'existing_unsplash_license',
 actualLocation:pending?null:old.place,productIds:pending?['kayak-tandem']:null,
 alt,focus:{desktop:pending?[0.58,0.72]:[0.5,0.5],mobile:pending?[0.58,0.75]:[0.5,0.5]},
 originalDimensions:[metadata.width,metadata.height],sourceObserved:'2026-11-02',
 approvedForProduction:!pending,derivativesCommitted:!pending});
 console.log(`Prepared ${key}`);
}
writeFileSync('docs/media-manifest.json',JSON.stringify(entries,null,2)+'\n');
