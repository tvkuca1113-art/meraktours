export const languages = ['bs', 'en', 'de', 'it', 'es'];
// Stable IDs; language switches always resolve the same page/product.
export const routeSlugs = {
  home: ['', '', '', '', ''],
  kayaks: ['kajaci', 'kayaking', 'kajakangebote', 'kayak', 'kayak'],
  tours: ['privatne-ture', 'private-tours', 'privattouren', 'tour-privati', 'tours-privados'],
  custom: ['tura-po-mjeri', 'tailor-made-tour', 'individuelle-tour', 'tour-su-misura', 'tour-a-medida'],
  about: ['o-nama', 'about', 'ueber-uns', 'chi-siamo', 'sobre-nosotros'],
  contact: ['kontakt', 'contact', 'kontakt', 'contatti', 'contacto'],
  privacy: ['privatnost', 'privacy', 'datenschutz', 'privacy', 'privacidad'],
  terms: ['uslovi-upita', 'enquiry-terms', 'anfragebedingungen', 'condizioni-richiesta', 'condiciones-consulta'],
  credits: ['fotografije', 'photography', 'fotografie', 'fotografie', 'fotografias'],
  'tour-01': ['privatne-ture/pocitelj-kravice', 'private-tours/pocitelj-kravice-waterfalls', 'privattouren/pocitelj-kravice', 'tour-privati/pocitelj-cascate-kravice', 'tours-privados/pocitelj-cascadas-kravice'],
  'tour-02': ['privatne-ture/fortica-mostar-jablanica', 'private-tours/fortica-mostar-jablanica', 'privattouren/fortica-mostar-jablanica', 'tour-privati/fortica-mostar-jablanica', 'tours-privados/fortica-mostar-jablanica'],
  'tour-03': ['privatne-ture/jablanica-sarajevo', 'private-tours/jablanica-sarajevo', 'privattouren/jablanica-sarajevo', 'tour-privati/jablanica-sarajevo', 'tours-privados/jablanica-sarajevo'],
  'tour-04': ['privatne-ture/blagaj-mostar', 'private-tours/blagaj-mostar', 'privattouren/blagaj-mostar', 'tour-privati/blagaj-mostar', 'tours-privados/blagaj-mostar'],
  'kayak-tandem': ['kajaci/kajak-za-dvoje', 'kayaking/tandem-kayak', 'kajakangebote/zweierkajak', 'kayak/kayak-doppio', 'kayak/kayak-doble']
};
export function pathFor(id, lang = 'bs') {
  if (!routeSlugs[id] || !languages.includes(lang)) throw new Error(`Unknown route ${id}:${lang}`);
  const slug = routeSlugs[id][languages.indexOf(lang)];
  return `/${lang}/${slug ? slug + '/' : ''}`;
}
export const legacyRedirects = [
  { source: '/', destination: pathFor('home'), permanent: true },
  { source: '/create-your-journey/', destination: pathFor('custom','en'), permanent: true },
  { source: '/credits/', destination: pathFor('credits','en'), permanent: true },
  ...['pocitelj-kravice-waterfalls','fortica-mostar-jablanica','jablanica-sarajevo-old-town','blagaj-mostar-old-town'].map((slug,i)=>({source:`/tours/${slug}/`, destination:pathFor(`tour-0${i+1}`,'en'), permanent:true}))
];
