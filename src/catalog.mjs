import { tours as existingTours, site } from './data.mjs';
import { localized, ui } from './i18n.mjs';
import { pathFor, languages } from './routes.mjs';

export const business = {
  brand: 'Merak Tours', legalName: null, registration: null, address: null,
  enquiryRecipient: 'Merak Tours', phone: {...site.whatsapp,display:site.whatsapp.display.replaceAll(' ','\u00a0')}, instagram: site.instagram,
  activityTimeZone: 'Europe/Sarajevo', webForm: { enabled: false, endpoint: null },
  // No analytics script, cookies, campaign retention or network calls until configured.
  analytics: { enabled: false, provider: null, measurementId: null, policyApproved: false },
  legalReview: 'required',
  releaseApproved: false
};
const names = [
 ['Počitelj i Kravice','Počitelj & Kravice Waterfalls','Počitelj & Kravice-Wasserfälle','Počitelj e cascate di Kravice','Počitelj y cascadas de Kravice'],
 ['Fortica, Mostar i Jablanica','Fortica, Mostar & Jablanica','Fortica, Mostar & Jablanica','Fortica, Mostar e Jablanica','Fortica, Mostar y Jablanica'],
 ['Jablanica i Sarajevo','Jablanica & Sarajevo','Jablanica & Sarajevo','Jablanica e Sarajevo','Jablanica y Sarajevo'],
 ['Blagaj i Mostar','Blagaj & Mostar','Blagaj & Mostar','Blagaj e Mostar','Blagaj y Mostar']
];
const leads = [
 ['Kamenim ulicama Počitelja, pa četiri sata slobodnog vremena uz vodopade Kravice.','Wander Počitelj’s stone streets, then enjoy four hours of free time at Kravice Waterfalls.','Steinerne Gassen in Počitelj und anschließend vier Stunden Freizeit an den Kravice-Wasserfällen.','Passeggia tra i vicoli in pietra di Počitelj, poi goditi quattro ore libere alle cascate di Kravice.','Pasea por las calles de piedra de Počitelj y disfruta de cuatro horas libres en las cascadas de Kravice.'],
 ['Jutro na vidikovcu iznad Mostara i slobodno poslijepodne uz vodu u Jablanici.','A morning viewpoint above Mostar and free time by the water in Jablanica.','Vormittags Aussicht über Mostar, danach Freizeit am Wasser in Jablanica.','Una mattina al belvedere sopra Mostar e tempo libero sull’acqua a Jablanica.','Una mañana en el mirador sobre Mostar y tiempo libre junto al agua en Jablanica.'],
 ['Kroz kanjon Neretve do Baščaršije, uz vrijeme za šetnju, kahvu i pogled na Sarajevo.','Through the Neretva canyon to Baščaršija, with time for a walk, coffee and a view over Sarajevo.','Durch den Neretva-Canyon zur Baščaršija, mit Zeit für einen Spaziergang, Kaffee und den Blick über Sarajevo.','Attraverso il canyon della Neretva fino a Baščaršija, con tempo per passeggiare, bere un caffè e ammirare Sarajevo.','Por el cañón del Neretva hasta Baščaršija, con tiempo para pasear, tomar café y contemplar Sarajevo.'],
 ['Stari most i njegove priče, pa tekija i izvor Bune pod stijenama Blagaja.','The Old Bridge and its stories, then the tekke and Buna spring beneath Blagaj’s cliffs.','Die Alte Brücke und ihre Geschichten, danach Tekke und Buna-Quelle unter den Felsen von Blagaj.','Il Ponte Vecchio e le sue storie, poi la tekke e la sorgente della Buna sotto le pareti di Blagaj.','El Puente Viejo y sus historias, después la tekke y la fuente del Buna bajo los acantilados de Blagaj.']
];
const differences = [
 ['Historija + vodopadi','History + waterfalls','Geschichte + Wasserfälle','Storia + cascate','Historia + cascadas'],
 ['Vidikovci + odmor','Viewpoints + downtime','Aussichten + Erholung','Panorami + relax','Miradores + descanso'],
 ['Baščaršija + cijeli dan','Baščaršija + a full day','Baščaršija + ganzer Tag','Baščaršija + giornata intera','Baščaršija + día completo'],
 ['Stari grad + izvor Bune','Old town + Buna spring','Altstadt + Buna-Quelle','Città vecchia + sorgente della Buna','Casco antiguo + fuente del Buna']
];
export const products = existingTours.map((old,i)=>({
  id:`tour-0${i+1}`, category:'private-tour', operator:{displayName:'Merak Tours',legalName:null, source:'existing-site'},
  bookingContact:'merak-tours', activityOperator:'Merak Tours', paymentRecipient:null, confirmationBy:'Merak Tours',
  localizedContent:Object.fromEntries(languages.map(l=>[l,{title:localized(names[i])[l], lead:localized(leads[i])[l], difference:localized(differences[i])[l]}])),
  localizedSlugs:Object.fromEntries(languages.map(l=>[l,pathFor(`tour-0${i+1}`,l)])),
  location:{name:'Mostar',country:'BA'}, meetingPoint:null, duration:{min:i===2?10:7,max:i===2?11:8,unit:'hour'},
  variants:[], capacity:{max:6}, price:null,priceUnit:null,currency:null,
  inclusions:'private-tour', exclusions:'private-tour', season:null, guideLanguages:['en'],
  participantRules:null, weatherPolicy:null,cancellationPolicy:null,deposit:null,paymentMethods:null,
  media:[old.cover,...(i===0?['pocitelj','kravice']:i===1?['fortica','jablanica']:i===2?['jablanica','sarajevoSquare']:['mostarReflection','blagajBuna'])].filter((x,j,a)=>a.indexOf(x)===j),
  bookingMode:'enquiry', publicationStatus:'published', sourceStatus:'preserved-existing-offer',
  routeStops:old.routeStops, mapPath:old.mapPath, itinerary:old.itinerary,
  interests:i===0?['nature','culture']:i===1?['views','nature']:i===2?['culture']:['culture','nature'],
  kayakCombinationApproved:false, legacySlug:old.slug, num:old.num
}));

// The profile explicitly says “Kayak za dvoje”. It does not verify its operating terms.
// This draft never enters the recommendation pool, sitemap or availability flow.
export const kayakDraft = {
  id:'kayak-tandem', category:'kayak', operator:null, activityOperator:null,
  bookingContact:'merak-tours', paymentRecipient:null, confirmationBy:null,
  localizedContent:Object.fromEntries(languages.map(l=>[l,{title:localized(['Kajak za dvoje','Tandem kayak','Zweierkajak','Kayak doppio','Kayak doble'])[l]}])),
  localizedSlugs:Object.fromEntries(languages.map(l=>[l,pathFor('kayak-tandem',l)])),
  location:null,meetingPoint:null,duration:null,variants:[],capacity:null,price:null,priceUnit:null,currency:null,
  inclusions:null,exclusions:null,season:null,guideLanguages:null,participantRules:null,weatherPolicy:null,
  cancellationPolicy:null,deposit:null,paymentMethods:null,media:['kayakShore'],bookingMode:'information-only',
  publicationStatus:'draft',source:'https://www.instagram.com/rent_a_boat_2026/',
  partnershipLabel:null,partnershipApproval:null,transfer:null
};
export const translationApprovals = Object.fromEntries(languages.map(l=>[l,{editorial:'complete-draft',humanReview:'required',approved:false}]));
export const isReview = process.env.VERCEL_ENV !== 'production';
export function productTitle(id,lang) {
  return products.find(p=>p.id===id)?.localizedContent[lang].title || (id==='kayaks'?ui[lang].kayaks:id==='custom'?ui[lang].custom:ui[lang].general);
}
export const OWNER_INPUT_REQUIRED = [
 'Legal operator/registration, correspondence address and privacy-controller details',
 'Written confirmation of rights for the Instagram photograph(s), including any identifiable persons',
 'Kayak operator, relationship/permission to advertise, enquiry/payment/confirmation responsibilities',
 'Exact kayak location, meeting point and map pin, parking and arrival information',
 'Actual service model: independent hire, guided activity and/or approved combination',
 'Duration, verified capacity, variants, public price, price unit, billing currency and mandatory extras',
 'Equipment/inclusions/exclusions, swimming/experience/age rules and accompanying-adult requirements',
 'Season, closures, weather rules, cancellation/refund terms, deposit and payment methods',
 'Confirmed transfer, viable tour combination, timing and itemised quote (if offered)',
 'Tour prices and final confirmation of preserved tour content, including inconsistent original schedules',
 'Native-speaker review of five language drafts; legal review and final release approval'
];

export const stopText = {
  mostar: localized(['Polazak i povratak prema dogovoru u Mostaru.','Departure and return as agreed in Mostar.','Abfahrt und Rückkehr nach Vereinbarung in Mostar.','Partenza e rientro concordati a Mostar.','Salida y regreso acordados en Mostar.']),
  pocitelj: localized(['Kamene ulice, stari grad i pogled na dolinu Neretve.','Stone streets, the old town and views over the Neretva valley.','Steinerne Gassen, Altstadt und Blick ins Neretva-Tal.','Vicoli in pietra, borgo storico e vista sulla valle della Neretva.','Calles de piedra, casco antiguo y vistas al valle del Neretva.']),
  kravice: localized(['Slobodno vrijeme uz vodopade. Ulaznica i obroci plaćaju se odvojeno.','Free time by the waterfalls. Entrance fees and meals are paid separately.','Freizeit an den Wasserfällen. Eintritt und Mahlzeiten werden separat bezahlt.','Tempo libero alle cascate. Ingresso e pasti si pagano separatamente.','Tiempo libre junto a las cascadas. Entradas y comidas se pagan aparte.']),
  fortica: localized(['Vidikovac iznad Mostara. Aktivnosti se dogovaraju i plaćaju zasebno.','A viewpoint above Mostar. Activities are agreed and paid for separately.','Aussichtspunkt über Mostar. Aktivitäten werden separat vereinbart und bezahlt.','Belvedere sopra Mostar. Attività da concordare e pagare separatamente.','Mirador sobre Mostar. Las actividades se acuerdan y pagan aparte.']),
  jablanica: localized(['Pauza u Jablanici prema rasporedu ture. Obroci i aktivnosti nisu uključeni.','A stop in Jablanica according to your tour schedule. Meals and activities are not included.','Halt in Jablanica gemäß Tourplan. Mahlzeiten und Aktivitäten sind nicht enthalten.','Sosta a Jablanica secondo il programma. Pasti e attività non sono inclusi.','Parada en Jablanica según el programa. Comidas y actividades no incluidas.']),
  sarajevo: localized(['Šetnja starim gradom i slobodno vrijeme u Baščaršiji.','A walk in the old town and free time in Baščaršija.','Altstadtspaziergang und Freizeit in der Baščaršija.','Passeggiata nel centro storico e tempo libero a Baščaršija.','Paseo por el casco antiguo y tiempo libre en Baščaršija.']),
  viewpoint: localized(['Pogled na grad prije povratka prema Mostaru.','A view over the city before returning towards Mostar.','Blick über die Stadt vor der Rückfahrt Richtung Mostar.','Panorama sulla città prima del rientro verso Mostar.','Vistas de la ciudad antes de regresar hacia Mostar.']),
  blagaj: localized(['Tekija i izvor Bune pod visokim stijenama. Ulaznice i obroci nisu uključeni.','The tekke and Buna spring beneath the cliffs. Entrance fees and meals are not included.','Tekke und Buna-Quelle unter hohen Felsen. Eintritte und Mahlzeiten sind nicht enthalten.','La tekke e la sorgente della Buna sotto le pareti rocciose. Ingressi e pasti non sono inclusi.','La tekke y la fuente del Buna bajo los acantilados. Entradas y comidas no incluidas.'])
};

export const photoAlts = {
 mostarReflection:localized(['Stari most i njegov odraz u Neretvi u Mostaru','The Old Bridge reflected in the Neretva in Mostar','Die Alte Brücke spiegelt sich in der Neretva in Mostar','Il Ponte Vecchio riflesso nella Neretva a Mostar','El Puente Viejo reflejado en el Neretva en Mostar']),
 kravice2:localized(['Vodopadi Kravice iznad zelenog bazena vode','Kravice Waterfalls above a green pool','Kravice-Wasserfälle über einem grünen Wasserbecken','Cascate di Kravice sopra una pozza verde','Cascadas de Kravice sobre una poza verde']),
 kravice:localized(['Široki slapovi Kravica okruženi zelenilom','The broad falls of Kravice surrounded by greenery','Die breiten Kravice-Wasserfälle im Grünen','Le ampie cascate di Kravice immerse nel verde','Las amplias cascadas de Kravice rodeadas de vegetación']),
 mostarValley:localized(['Pogled s padine na Mostar i dolinu Neretve','Mostar and the Neretva valley viewed from the hillside','Blick vom Hang auf Mostar und das Neretva-Tal','Mostar e la valle della Neretva viste dalla collina','Mostar y el valle del Neretva vistos desde la ladera']),
 sarajevoSquare:localized(['Trg u sarajevskoj Baščaršiji','Square in Sarajevo’s Baščaršija','Platz in Sarajevos Baščaršija','Piazza nella Baščaršija di Sarajevo','Plaza de Baščaršija en Sarajevo']),
 blagajTekke:localized(['Bijela blagajska tekija pod stijenom uz izvor Bune','The white Blagaj tekke beneath the cliff at the Buna spring','Die weiße Tekke von Blagaj unter dem Felsen an der Buna-Quelle','La bianca tekke di Blagaj sotto la parete alla sorgente della Buna','La tekke blanca de Blagaj bajo el acantilado en la fuente del Buna']),
 fortica:localized(['Pogled s Fortice prema Mostaru i dolini','View from Fortica towards Mostar and the valley','Blick von Fortica auf Mostar und das Tal','Vista da Fortica verso Mostar e la valle','Vista desde Fortica hacia Mostar y el valle']),
 jablanica:localized(['Zelena voda i planine kod Jablanice','Green water and mountains near Jablanica','Grünes Wasser und Berge bei Jablanica','Acqua verde e montagne vicino a Jablanica','Agua verde y montañas cerca de Jablanica']),
 pocitelj:localized(['Kamene kuće, džamija i kula u Počitelju','Stone houses, mosque and tower in Počitelj','Steinhäuser, Moschee und Turm in Počitelj','Case in pietra, moschea e torre a Počitelj','Casas de piedra, mezquita y torre en Počitelj']),
 blagajBuna:localized(['Bistra voda Bune ispod stijena u Blagaju','Clear water of the Buna beneath the cliffs in Blagaj','Klares Wasser der Buna unter den Felsen in Blagaj','Acqua limpida della Buna sotto le pareti di Blagaj','Agua clara del Buna bajo los acantilados en Blagaj']),
 neretvaCanyon:localized(['Neretva između planinskih padina','The Neretva between mountain slopes','Die Neretva zwischen Berghängen','La Neretva tra i versanti delle montagne','El Neretva entre laderas de montaña']),
 kayakShore:localized(['Kajak uz kamenu obalu, zelena voda i planine na fotografiji profila rent_a_boat_2026','A kayak beside a stone shore, green water and mountains in a photo from rent_a_boat_2026','Kajak am steinigen Ufer, grünes Wasser und Berge auf einem Foto von rent_a_boat_2026','Un kayak presso la riva in pietra, acqua verde e montagne in una foto di rent_a_boat_2026','Un kayak junto a la orilla de piedra, agua verde y montañas en una foto de rent_a_boat_2026'])
};
