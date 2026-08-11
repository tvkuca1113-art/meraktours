/* ============================================================================
   MERAK TOURS — content model
   ----------------------------------------------------------------------------
   EVERY business fact below is taken verbatim (or near-verbatim) from the
   official Merak Tours Instagram account @bosnia.merak.tours.
   Nothing here is invented: no prices, no reviews, no ratings, no awards,
   no statistics, no years of experience, no policies.
   ========================================================================== */

export const site = {
  name: 'Merak Tours',
  legalName: 'Merak Tours',
  tagline: 'Private & Small Group Tours · Bosnia and Herzegovina',
  city: 'Mostar',
  country: 'Bosnia and Herzegovina',
  countryCode: 'BA',
  // Set SITE_ORIGIN at build time; change the default to the real domain
  // once it is registered, then rebuild so canonicals + sitemap follow.
  // Canonical origin. Set SITE_ORIGIN to the real domain once it is live;
  // on Vercel it falls back to the project's production URL automatically.
  origin: (
    process.env.SITE_ORIGIN ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    'https://meraktours.ba'
  ).replace(/\/$/, ''),
  lang: 'en',
  // Architecture is prepared for en / de / bs. Only `en` is published today,
  // so only `en` is advertised in hreflang (never point hreflang at a 404).
  locales: [
    { code: 'en', label: 'English', short: 'EN', published: true, prefix: '' },
    { code: 'de', label: 'Deutsch', short: 'DE', published: false, prefix: '/de' },
    { code: 'bs', label: 'Bosanski', short: 'BS', published: false, prefix: '/bs' }
  ],
  whatsapp: {
    display: '+387 63 822 083',
    e164: '+38763822083',
    digits: '38763822083'
  },
  instagram: {
    handle: '@bosnia.merak.tours',
    url: 'https://www.instagram.com/bosnia.merak.tours/'
  },
  geo: { lat: 43.3438, lon: 17.8078 } // Mostar
};

/* -------------------------------------------------------------------------
   Photography — Unsplash License (free for commercial use).
   Every photo below was checked against its Unsplash page: the location field
   or description confirms the place. Credits are published on /credits/.
   ---------------------------------------------------------------------- */
/* A photograph carrying a headline needs slightly more contrast and a little
   sharpening than the same photograph does at postcard size — the scrim eats
   local contrast, and the browser's own downscale softens the detail. The CDN
   does it for us, so it costs nothing at runtime. Applied to the four
   full-bleed pictures only; galleries stay untouched. */
const HERO_TONE = 'con=7&sat=4&usm=14';

export const media = {
  heroMostar:        { id: 'photo-1784694461396-98717a83ace5', alt: 'Stari Most, the Ottoman stone bridge over the Neretva, with Mostar Old Town and mountains behind', by: 'Josip Ivanković', user: 'piak', page: 'https://unsplash.com/photos/P9ezYYYPmpg', place: 'Stari Most, Mostar', tone: HERO_TONE },
  mostarReflection:  { id: 'photo-1504730461252-26343bc973f1', alt: 'The Old Bridge in Mostar reflected in the still emerald water of the Neretva', by: 'Faruk Kaymak', user: 'fkaymak', page: 'https://unsplash.com/photos/VKz0LHnGzU0', place: 'Mostar' },
  mostarGreenRiver:  { id: 'photo-1643054136954-684629fedc90', alt: 'The Old Bridge of Mostar above the green Neretva river', by: 'Mujo Hasanovic', user: 'mujoh', page: 'https://unsplash.com/photos/8_QKTRYoVbc', place: 'Mostar' },
  mostarOldTown:     { id: 'photo-1761383341037-81c78353cb91', alt: 'Cobbled bazaar street in Mostar Old Town with market stalls, shops and the stone clock tower', by: 'Josip Ivanković', user: 'piak', page: 'https://unsplash.com/photos/ZjS2emXzRZ8', place: 'Mostar Old Town' },
  mostarBazaar:      { id: 'photo-1628828098981-9856314fc978', alt: 'Visitors walking through the Kujundžiluk bazaar street in Mostar Old Town', by: 'mana5280', user: 'mana5280', page: 'https://unsplash.com/photos/vwk17ByFLKw', place: 'Mostar Old Town' },
  mostarDiver:       { id: 'photo-1544673442-5ef41de781ce', alt: 'People gathered on Stari Most in Mostar watching a diver above the Neretva', by: 'Darcey Beau', user: 'darceybeau', page: 'https://unsplash.com/photos/Aj-a_XCTWcc', place: 'Stari Most, Mostar' },
  mostarArch:        { id: 'photo-1676064905210-25bdafa708a7', alt: 'The arch of Stari Most seen from the bank of the Neretva', by: 'Anna Jewels', user: 'earthpeek', page: 'https://unsplash.com/photos/UBYgDsAdwOI', place: 'Mostar' },
  mostarAerial:      { id: 'photo-1535627565086-13f55c100c0d', alt: 'View over Mostar with Stari Most spanning the Neretva and the old town rooftops', by: 'Anton Sharov', user: 'antonsharov', page: 'https://unsplash.com/photos/cPSZkNTGF5I', place: 'Mostar' },
  fortica:           { local: 'fortica', alt: 'The view over Mostar and the Neretva valley from the Fortica viewpoint, with the skywalk on the ridge', by: 'Merak Tours', own: true, place: 'Fortica, Mostar' },
  mostarValley:      { id: 'photo-1569086038412-d20a387dffc1', alt: 'Mostar and the Neretva valley seen from the hillside above the town', by: 'Kenneth Sonntag', user: 'kennethsonntag', page: 'https://unsplash.com/photos/XVv47YyUBXM', place: 'Mostar' },
  mostarWindow:      { id: 'photo-1628830861270-036f22f90e64', alt: 'Carved wooden window frame on an old house in Mostar', by: 'mana5280', user: 'mana5280', page: 'https://unsplash.com/photos/p2i2s0gU2iU', place: 'Mostar' },
  blagajTekke:       { id: 'photo-1652287350277-db5ba07dfd46', alt: 'The white Blagaj Tekke at the foot of the limestone cliff where the Buna river springs', by: 'Mujo Hasanovic', user: 'mujoh', page: 'https://unsplash.com/photos/HP-OVRpg1Xc', tone: HERO_TONE, place: 'Blagaj' },
  blagajDusk:        { id: 'photo-1772664587058-4bc625e12315', alt: 'The Blagaj Tekke dervish monastery set into the rock face at dusk', by: 'Fatih Beki', user: 'mfbeki', page: 'https://unsplash.com/photos/irRzmw1NPrQ', place: 'Blagaj' },
  blagajBuna:        { id: 'photo-1634796607963-9e3726f5264f', alt: 'Clear turquoise water at the source of the Buna river beneath the cliffs at Blagaj', by: 'Bakir Custovic', user: 'bacust_', page: 'https://unsplash.com/photos/GRVJoavJD-Y', place: 'Blagaj' },
  pocitelj:          { id: 'photo-1772663221140-3177d407b0b1', alt: 'The historic village of Počitelj with its mosque and tower above the Neretva valley', by: 'Fatih Beki', user: 'mfbeki', page: 'https://unsplash.com/photos/blI_h-Kf3RE', place: 'Počitelj' },
  pocitelj2:         { id: 'photo-1772663271932-4eb45c754f8f', alt: 'The stone village of Počitelj beside the winding Neretva', by: 'Fatih Beki', user: 'mfbeki', page: 'https://unsplash.com/photos/tY6l0_5DNX8', place: 'Počitelj' },
  pociteljStairs:    { id: 'photo-1772663187575-ee6216385425', alt: 'Stone stairway and old walls in Počitelj', by: 'Fatih Beki', user: 'mfbeki', page: 'https://unsplash.com/photos/eqnjOmw89NU', place: 'Počitelj' },
  pociteljTower:     { id: 'photo-1772663182135-00a3c7b9982c', alt: 'Stone houses and the Kula fortress on the hillside at Počitelj', by: 'Fatih Beki', user: 'mfbeki', page: 'https://unsplash.com/photos/nHcKRgjnv5Y', place: 'Počitelj' },
  /* The hero and the tour cover want the falls in open sunlight with the pool
     showing. The forest-framed frames below are gallery pictures — beautiful
     small, unreadable at full bleed. */
  kraviceFalls:      { id: 'photo-1752159276871-30b5aa5e0241', alt: 'Kravice Waterfalls cascading into the turquoise pool below, in summer sun', by: 'Stanisław Lul', user: 'stchuu', page: 'https://unsplash.com/photos/Ilsqyn9As_Q', place: 'Kravice Waterfall, Studenci', tone: HERO_TONE },
  kraviceSummer:     { id: 'photo-1733254145554-e49274aa95df', alt: 'The full width of Kravice Waterfalls in high summer water', by: 'Francesco Torsello', user: 'fratorsello', page: 'https://unsplash.com/photos/A3yK31IGLIE', place: 'Kravice Waterfall, Studenci' },
  kravice:           { id: 'photo-1757759170092-bb9d6ff5bc4f', alt: 'The wide amphitheatre of Kravice Waterfalls falling into a green pool', by: 'Stanisław Lul', user: 'stchuu', page: 'https://unsplash.com/photos/3rNk8P03wNs', place: 'Kravice Waterfall' },
  kravice2:          { id: 'photo-1680487927957-661c1bdd90cd', alt: 'Kravice Waterfalls falling into an emerald pool in Herzegovina', by: 'Sporisevic Photography', user: 'sporisevicphotography', page: 'https://unsplash.com/photos/NFGq1SSVWCA', place: 'Kravice Waterfall' },
  kraviceSwim:       { id: 'photo-1677560691918-762bf76472b4', alt: 'People swimming in the river beside Kravice Waterfalls', by: 'Jo Barnes', user: 'yourlifestylebusiness', page: 'https://unsplash.com/photos/W2Fj8SQeQnY', place: 'Kravica Nature Park' },
  kraviceForest:     { id: 'photo-1692563318127-49c18bbfc31d', alt: 'Kravice Waterfall surrounded by dense green forest', by: 'Mujo Hasanovic', user: 'mujoh', page: 'https://unsplash.com/photos/shj0Pg9HrH4', place: 'Kravice Waterfall' },
  jablanica:         { id: 'photo-1626026579686-39fdf58e3b67', alt: 'The green Neretva at Jablanica, framed by mountains', by: 'Adnan Hajvazovic', user: 'adnanhazz', page: 'https://unsplash.com/photos/F-i_vAk_xXs', place: 'Jablanica' },
  neretvaCanyon:     { id: 'photo-1675907353678-95d401c6d2dc', alt: 'The Neretva winding through its canyon near Jablanica', by: 'Sporisevic Photography', user: 'sporisevicphotography', page: 'https://unsplash.com/photos/u1XLrGhaaoo', place: 'Bijela, near Jablanica' },
  neretvaTeal:       { id: 'photo-1698863985793-9885b29da3bb', alt: 'The teal Neretva running below green hillsides at Mostar', by: 'Anesa Atlić', user: 'aatlic1', page: 'https://unsplash.com/photos/BtnSKNYwycU', place: 'Mostar' },
  sarajevoSquare:    { id: 'photo-1683764681443-c85ff83109b4', alt: 'The main square of Baščaršija, Sarajevo’s old bazaar quarter', by: 'Hongbin', user: 'hbsun2013', page: 'https://unsplash.com/photos/OT8bxxMA3j0', tone: HERO_TONE, place: 'Baščaršija, Sarajevo' },
  sarajevoPigeons:   { id: 'photo-1636041417222-1305988d38a0', alt: 'Pigeons and passers-by on the square in Sarajevo old town, a minaret behind', by: 'Lothar Boris Piltz', user: 'lotharborispiltz', page: 'https://unsplash.com/photos/nk6N5vCDbDE', place: 'Sarajevo' },
  sarajevoNight:     { id: 'photo-1705451298117-66d3579e722a', alt: 'Lantern-lit lanes of Baščaršija at night in Sarajevo', by: 'Sporisevic Photography', user: 'sporisevicphotography', page: 'https://unsplash.com/photos/r77YIL-jmXY', place: 'Baščaršija, Sarajevo' },
  sarajevoStreet:    { id: 'photo-1777918210754-8d8fc75ed4c5', alt: 'Narrow cobbled old town street in Sarajevo with a minaret and green hills behind', by: 'Alexei Kramskoi', user: 'rzhavii', page: 'https://unsplash.com/photos/DxcKvmHI_Ko', place: 'Sarajevo' },
  sarajevoRooftops:  { id: 'photo-1763787002975-5aefe199191b', alt: 'Sarajevo’s old town rooftops seen from above', by: 'Sporisevic Photography', user: 'sporisevicphotography', page: 'https://unsplash.com/photos/8quwwLg1Mgc', place: 'Sarajevo' },
  sarajevoView:      { id: 'photo-1680220700316-41ec6aa2f805', alt: 'Sarajevo seen from a viewpoint above the valley', by: 'Sporisevic Photography', user: 'sporisevicphotography', page: 'https://unsplash.com/photos/sNavsW2j9es', place: 'Sarajevo' },
  bosnianCoffee:     { id: 'photo-1605958759017-9c38541ad9e5', alt: 'Traditional Bosnian coffee served in a small cup', by: 'abdurahman iseini', user: 'bizzle_555', page: 'https://unsplash.com/photos/luCibs6BjK0', place: 'Sarajevo' },
  craftStall:        { id: 'photo-1690323027889-cb2819e7f429', alt: 'Metal and ceramic vessels on a craft stall in Sarajevo’s old bazaar', by: 'Adél Grőber', user: 'ninszi', page: 'https://unsplash.com/photos/8GADbM3TZr8', place: 'Sarajevo' },
  mountains:         { id: 'photo-1643581744816-51808de1c6fe', alt: 'Pine-covered mountain peaks on Zvijezda mountain in Bosnia and Herzegovina', by: 'Mujo Hasanovic', user: 'mujoh', page: 'https://unsplash.com/photos/c0qPcBksajU', place: 'Zvijezda' },
  boracko:           { id: 'photo-1668200130005-f00145d1a82e', alt: 'Autumn morning over Boračko Lake, ringed by forest and mountains', by: 'Mujo Hasanovic', user: 'mujoh', page: 'https://unsplash.com/photos/gSAaF7qR42o', place: 'Boračko Lake' },
  countryside:       { id: 'photo-1760865839125-615cca7fa2a9', alt: 'Old stone house among the green hills of the Počitelj countryside', by: 'Ivan Ovych', user: 'kehl', page: 'https://unsplash.com/photos/Gnww9wenuLI', place: 'Počitelj' }
};

/* Places used by the 3D map — real coordinates */
export const places = {
  mostar:    { name: 'Mostar',    lat: 43.3438, lon: 17.8078 },
  fortica:   { name: 'Fortica',   lat: 43.3480, lon: 17.8330 },
  blagaj:    { name: 'Blagaj',    lat: 43.2569, lon: 17.8917 },
  pocitelj:  { name: 'Počitelj',  lat: 43.1300, lon: 17.7397 },
  kravice:   { name: 'Kravice',   lat: 43.1553, lon: 17.6106 },
  jablanica: { name: 'Jablanica', lat: 43.6597, lon: 17.7614 },
  sarajevo:  { name: 'Sarajevo',  lat: 43.8563, lon: 18.4131 }
};

export const included = [
  'Private transportation',
  'Hotel / accommodation pickup and drop-off',
  'English-speaking local guide',
  'A flexible itinerary adjusted to your pace',
  'Free time at each location'
];

export const notIncluded = [
  'Entrance fees, such as Kravice Waterfalls and museums',
  'Food and drinks',
  'Optional activities such as ziplining, kayaking or boat rides'
];

export const pillars = [
  {
    key: 'local',
    label: 'Local experts',
    line: 'Tours led by locals who know every corner.',
    body: 'You are guided by people who grew up with these roads, these rivers and these stories — not by a script.',
    img: 'mostarBazaar'
  },
  {
    key: 'private',
    label: 'Private tours',
    line: 'Solo, or with your group of up to six people.',
    body: 'The vehicle is yours for the day. No strangers, no clipboard, no waiting for a coach to fill up.',
    img: 'blagajBuna'
  },
  {
    key: 'flexible',
    label: 'Flexible & custom',
    line: 'Every tour can be customised to your preferences.',
    body: 'Pickup and drop-off at the location you choose, and an itinerary adjusted to your pace on the day itself.',
    img: 'pocitelj2'
  },
  {
    key: 'safety',
    label: 'Safety & comfort',
    line: 'Your safety is our priority.',
    body: 'Comfortable vehicles with air conditioning, and a relaxed pace that leaves room to breathe.',
    img: 'neretvaCanyon'
  }
];

/* -------------------------------------------------------------------------
   THE FOUR JOURNEYS
   Descriptions, itineraries, durations and highlights are as published by
   Merak Tours on Instagram.
   ---------------------------------------------------------------------- */
export const tours = [
  {
    num: '01',
    slug: 'pocitelj-kravice-waterfalls',
    title: 'Počitelj & Kravice Waterfalls',
    titleShort: 'Počitelj & Kravice',
    kicker: 'Herzegovina · history and water',
    routeLabel: 'Mostar — Počitelj — Kravice Waterfalls — Mostar',
    routeStops: ['Mostar', 'Počitelj', 'Kravice', 'Mostar'],
    mapPath: ['mostar', 'pocitelj', 'kravice', 'mostar'],
    duration: '7–8 hours',
    durationISO: 'PT8H',
    startTime: '09:00',
    endTime: '16:30',
    lead: 'A stone village that has been watching the Neretva for centuries, and an afternoon long enough to actually get in the water.',
    intro: 'Escape the city and enjoy a relaxed day in Herzegovina, where history meets untouched nature. This tour combines the charm of Počitelj with the beauty of Kravice Waterfalls, giving you the perfect mix of sightseeing and free time, including four hours to fully enjoy the falls.',
    body: [
      'Departure is at 09:00 from Mostar, with arrival in Počitelj around 09:40. Take time to explore the old town, its stone streets, tower, and views. At 11:00, we continue to Kravice, arriving around 11:30, where you’ll have time to swim, relax, or enjoy an optional lunch.',
      'Return to Mostar at 15:30, arriving around 16:30.'
    ],
    highlights: [
      'Picked up at your door in Mostar',
      'Počitelj old town, on foot',
      'Four hours at Kravice Waterfalls',
      'Free time, at your own pace'
    ],
    optional: ['Lunch at Kravice'],
    itinerary: [
      { type: 'point', time: '09:00', title: 'Mostar', sub: 'Starting location', note: 'Pickup at your accommodation, or wherever suits you.', img: 'mostarAerial', tags: ['Pickup'] },
      { type: 'drive', to: 'Počitelj', dur: '40 min' },
      { type: 'point', time: '09:40 – 11:00', title: 'Počitelj', dur: '1 hour 20 min', note: 'Explore the old town, its stone streets, tower and views out over the Neretva.', img: 'pocitelj', tags: ['Old town', 'Views', 'Free time'] },
      { type: 'drive', to: 'Kravice Waterfalls', dur: '30 min' },
      { type: 'point', time: '11:30 – 15:30', title: 'Kravice Waterfalls', dur: '4 hours', note: 'Four hours to swim, relax on the grass, or take an optional lunch by the falls.', img: 'kraviceSwim', tags: ['Free time', 'Swimming', 'Optional lunch'] },
      { type: 'drive', to: 'Mostar', dur: '1 hour' },
      { type: 'point', time: '16:30', title: 'Mostar', sub: 'End location', note: 'Drop-off at your accommodation.', img: 'mostarReflection', tags: ['Drop-off'] }
    ],
    hero: 'kraviceFalls',
    cover: 'kraviceFalls',
    gallery: ['kravice', 'pocitelj', 'kraviceSwim', 'pociteljStairs', 'kraviceSummer', 'pociteljTower', 'kraviceForest', 'countryside'],
    seoTitle: 'Počitelj & Kravice Waterfalls Tour from Mostar | Private Day Tour',
    seoDesc: 'A private 7–8 hour tour from Mostar to the Ottoman village of Počitelj and four hours at Kravice Waterfalls. Pickup and drop-off in Mostar, local guide, flexible pace.',
    keywords: 'Kravice waterfalls tour from Mostar, Počitelj tour, private tour Mostar, Herzegovina day trip'
  },
  {
    num: '02',
    slug: 'fortica-mostar-jablanica',
    title: 'Fortica, Mostar & Jablanica',
    titleShort: 'Fortica & Jablanica',
    kicker: 'Views · light adventure · water',
    routeLabel: 'Mostar — Fortica — Jablanica — Mostar',
    routeStops: ['Mostar', 'Fortica', 'Jablanica', 'Mostar'],
    mapPath: ['mostar', 'fortica', 'jablanica', 'mostar'],
    duration: '7–8 hours',
    durationISO: 'PT8H',
    startTime: '09:00',
    endTime: '16:30',
    lead: 'Morning on the ridge above Mostar, afternoon on the water in Jablanica. As much adventure as you feel like, and no more.',
    intro: 'A perfect choice for those who want a mix of light adventure and relaxation in nature. This tour combines activities, scenic views, and time by the water.',
    body: [
      'The day starts at 09:00 with pick-up in Mostar and a short drive to Fortica, where you arrive around 09:20. You can enjoy optional breakfast and activities such as zipline, swing, or skywalk, or simply take in the view. At 10:30, the tour continues to Jablanica, where you’ll have lunch at Kovačević Restaurant. After lunch, you’ll have free time by the water to relax, swim, or rent a kayak or boat.',
      'The tour returns to Mostar at 15:50, arriving around 16:30.'
    ],
    highlights: [
      'Picked up at your door in Mostar',
      'The Fortica ridge above Mostar',
      'Lunch and the water at Jablanica',
      'Free time, at your own pace'
    ],
    optional: ['Breakfast at Fortica', 'Zipline', 'Swing', 'Skywalk', 'Kayak rental', 'Boat rental'],
    itinerary: [
      { type: 'point', time: '09:00', title: 'Mostar', sub: 'Starting location', note: 'Pickup at your accommodation, or wherever suits you.', img: 'mostarAerial', tags: ['Pickup'] },
      { type: 'drive', to: 'Fortica', dur: '20 min' },
      { type: 'point', time: '09:20 – 10:30', title: 'Fortica', dur: '1 hour 10 min', note: 'The view over Mostar and the Neretva valley. Optional breakfast, and optional zipline, swing or skywalk if you feel like it.', img: 'fortica', tags: ['Viewpoint', 'Optional breakfast', 'Optional zipline', 'Optional swing', 'Optional skywalk'], optional: true },
      { type: 'drive', to: 'Jablanica', dur: '1 hour' },
      { type: 'point', time: '11:30 – 15:50', title: 'Jablanica', dur: '4 hours 20 min', note: 'Lunch at Kovačević Restaurant, then free time by the water — relax, swim, or optionally rent a kayak or a boat.', img: 'jablanica', tags: ['Lunch', 'Free time', 'Swimming', 'Optional kayak', 'Optional boat'] },
      { type: 'drive', to: 'Mostar', dur: '40 min' },
      { type: 'point', time: '16:30', title: 'Mostar', sub: 'End location', note: 'Drop-off at your accommodation.', img: 'mostarReflection', tags: ['Drop-off'] }
    ],
    hero: 'jablanica',
    cover: 'jablanica',
    gallery: ['fortica', 'jablanica', 'neretvaCanyon', 'mostarAerial', 'neretvaTeal', 'boracko', 'mountains', 'mostarGreenRiver'],
    seoTitle: 'Fortica, Mostar & Jablanica Tour | Private Day Tour from Mostar',
    seoDesc: 'A private 7–8 hour tour from Mostar to the Fortica viewpoint and Jablanica: scenic views, optional zipline, swing or skywalk, lunch and free time by the water.',
    keywords: 'Fortica Mostar tour, Jablanica tour from Mostar, private tour Mostar, zipline Mostar'
  },
  {
    num: '03',
    slug: 'jablanica-sarajevo-old-town',
    title: 'Jablanica & Sarajevo Old Town',
    titleShort: 'Jablanica & Sarajevo',
    kicker: 'The capital · full day',
    routeLabel: 'Mostar — Jablanica — Sarajevo — Jablanica — Mostar',
    routeStops: ['Mostar', 'Jablanica', 'Sarajevo', 'Jablanica', 'Mostar'],
    mapPath: ['mostar', 'jablanica', 'sarajevo', 'jablanica', 'mostar'],
    duration: '10–11 hours',
    durationISO: 'PT11H',
    startTime: '09:00',
    endTime: '19:30',
    lead: 'The long road north through the Neretva canyon to Sarajevo — four hours in Baščaršija, a viewpoint over the city, and dinner on the way home.',
    intro: 'Experience the energy and history of Bosnia’s capital on this full-day journey through stunning landscapes and cultural highlights. A perfect mix of nature, history, and local life.',
    body: [
      'Your tour begins at 09:00 with pick-up in Mostar, followed by a scenic stop in Jablanica around 09:40, where you can enjoy breakfast at Kovačević Restaurant. The journey continues to Sarajevo, arriving at approximately 12:00.',
      'You’ll explore the Old Town, learn about the city’s unique history, and enjoy free time in Baščaršija for food, coffee, and shopping. After meeting at 16:00, you’ll visit a panoramic viewpoint before returning to Mostar, with a dinner stop in Jablanica along the way.',
      'The tour returns to Mostar around 18:50, arriving around 19:30.'
    ],
    highlights: [
      'Picked up at your door in Mostar',
      'North through the Neretva canyon',
      'Four hours in Baščaršija',
      'A viewpoint over Sarajevo'
    ],
    optional: ['Breakfast at Kovačević Restaurant', 'Dinner stop in Jablanica', 'Food, coffee and shopping in Baščaršija'],
    itinerary: [
      { type: 'point', time: '09:00', title: 'Mostar', sub: 'Starting location', note: 'Pickup at your accommodation, or wherever suits you.', img: 'mostarAerial', tags: ['Pickup'] },
      { type: 'drive', to: 'Jablanica', dur: '40 min' },
      { type: 'point', time: '09:40 – 10:30', title: 'Jablanica', note: 'A scenic stop on the way north, with breakfast at Kovačević Restaurant.', img: 'jablanica', tags: ['Breakfast', 'Scenic stop'] },
      { type: 'drive', to: 'Sarajevo', dur: '1 hour 30 min' },
      { type: 'point', time: '12:00 – 16:00', title: 'Sarajevo Old Town', dur: '4 hours', note: 'The Old Town and the city’s history, then free time in Baščaršija for food, coffee and shopping.', img: 'sarajevoSquare', tags: ['Guided walk', 'Baščaršija', 'Free time'] },
      { type: 'point', time: 'from 16:00', title: 'Panoramic viewpoint', note: 'A view over the whole city before the drive back south.', img: 'sarajevoView', tags: ['Viewpoint'] },
      { type: 'drive', to: 'Jablanica', dur: '2 hours' },
      { type: 'point', time: '18:00 – 18:50', title: 'Jablanica', note: 'A dinner stop before continuing to Mostar.', img: 'neretvaCanyon', tags: ['Dinner'] },
      { type: 'drive', to: 'Mostar', dur: '40 min' },
      { type: 'point', time: '19:30', title: 'Mostar', sub: 'End location', note: 'Drop-off at your accommodation.', img: 'mostarReflection', tags: ['Drop-off'] }
    ],
    hero: 'sarajevoSquare',
    cover: 'sarajevoSquare',
    gallery: ['sarajevoSquare', 'sarajevoStreet', 'sarajevoNight', 'sarajevoRooftops', 'craftStall', 'bosnianCoffee', 'sarajevoPigeons', 'neretvaCanyon'],
    seoTitle: 'Sarajevo Day Trip from Mostar via Jablanica | Private Full-Day Tour',
    seoDesc: 'A private 10–11 hour tour from Mostar to Sarajevo through the Neretva valley, with a stop in Jablanica, four hours in Baščaršija and a panoramic viewpoint over the city.',
    keywords: 'Sarajevo day trip from Mostar, Mostar to Sarajevo private tour, Baščaršija tour, Jablanica'
  },
  {
    num: '04',
    slug: 'blagaj-mostar-old-town',
    title: 'Blagaj & Mostar Old Town',
    titleShort: 'Blagaj & Mostar',
    kicker: 'The cultural heart of Herzegovina',
    routeLabel: 'Mostar — Old Town — Blagaj — Mostar',
    routeStops: ['Mostar', 'Old Town', 'Blagaj', 'Mostar'],
    mapPath: ['mostar', 'blagaj', 'mostar'],
    duration: '7–8 hours',
    durationISO: 'PT8H',
    startTime: '09:00',
    endTime: '16:30',
    lead: 'A guided morning around Stari Most, then the afternoon where the Buna comes out of the cliff at Blagaj.',
    intro: 'Discover the cultural heart of Herzegovina on this short but rich experience combining history, architecture, and nature. Perfect if you want to explore without rushing.',
    body: [
      'The tour starts at 09:00 with pick-up in Mostar, followed by a guided walk through the Old Town from 09:15. You’ll explore the area around Stari Most, hear local stories, and enjoy free time or an optional breakfast. At 11:00, you meet again before heading to Blagaj, arriving around 11:30. Here, you’ll visit the famous Blagaj Tekke, a 16th-century Dervish monastery built into the cliffs at the source of the Buna River. Known for its unique architecture and peaceful setting.',
      'The tour returns to Mostar at 16:00, arriving around 16:30.'
    ],
    highlights: [
      'Picked up at your door in Mostar',
      'Stari Most, with the stories behind it',
      'The Buna, where it leaves the cliff',
      'Free time, at your own pace'
    ],
    optional: ['Breakfast in Mostar Old Town'],
    itinerary: [
      { type: 'point', time: '09:00', title: 'Mostar', sub: 'Starting location', note: 'Pickup at your accommodation, or wherever suits you.', img: 'mostarAerial', tags: ['Pickup'] },
      { type: 'drive', to: 'Mostar Old Town', dur: '15 min' },
      { type: 'point', time: '09:15 – 11:00', title: 'Mostar Old Town', dur: '1 hour 45 min', note: 'A guided walk around Stari Most and the streets that lead to it, with the local stories. Then free time, or an optional breakfast.', img: 'mostarOldTown', tags: ['Guided walk', 'Stari Most', 'Free time', 'Optional breakfast'] },
      { type: 'drive', to: 'Blagaj', dur: '30 min' },
      { type: 'point', time: '11:30 – 16:00', title: 'Blagaj', note: 'The Blagaj Tekke — a 16th-century Dervish monastery built into the cliffs at the source of the Buna river.', img: 'blagajTekke', tags: ['Blagaj Tekke', 'Free time'] },
      { type: 'drive', to: 'Mostar', dur: '30 min' },
      { type: 'point', time: '16:30', title: 'Mostar', sub: 'End location', note: 'Drop-off at your accommodation.', img: 'mostarDiver', tags: ['Drop-off'] }
    ],
    hero: 'blagajTekke',
    cover: 'blagajTekke',
    gallery: ['blagajTekke', 'mostarOldTown', 'blagajBuna', 'mostarArch', 'mostarDiver', 'blagajDusk', 'mostarBazaar', 'mostarWindow'],
    seoTitle: 'Blagaj & Mostar Old Town Tour | Private Tour from Mostar',
    seoDesc: 'A private 7–8 hour tour of Mostar Old Town and Stari Most with a local guide, followed by the Blagaj Tekke at the source of the Buna river. Pickup and drop-off in Mostar.',
    keywords: 'Blagaj tour from Mostar, Mostar old town guided walk, Blagaj Tekke, private tour Mostar'
  }
];

export const interests = [
  { key: 'nature',  label: 'Nature',      note: 'Rivers, waterfalls, lakes and mountains' },
  { key: 'culture', label: 'Culture',     note: 'Old towns, crafts, coffee and daily life' },
  { key: 'history', label: 'History',     note: 'Bridges, fortresses and the stories behind them' },
  { key: 'hidden',  label: 'Hidden gems', note: 'The places that are not on the coach routes' },
  { key: 'adventure', label: 'Adventure', note: 'Zipline, kayak, swimming and viewpoints' }
];

/* FAQ — answers contain only information published by Merak Tours. */
export const faqs = [
  {
    q: 'How do I book a tour?',
    a: 'Send a message on WhatsApp to +387 63 822 083. Tell us which tour you are interested in, your preferred date, how many travellers you are and where you would like to be picked up, and we will confirm availability with you directly.'
  },
  {
    q: 'Are the tours private?',
    a: 'Yes. Every tour is private — you travel solo or with your own group of up to six people. There is no one else in the vehicle.'
  },
  {
    q: 'Can a tour be changed to suit us?',
    a: 'Yes. All tours can be customised to your preferences. Pickup and drop-off happen at the location you choose, and the itinerary is adjusted to your pace on the day. You can also keep a tour exactly as it is.'
  },
  {
    q: 'What is included in a tour?',
    a: 'Private transportation, hotel or accommodation pickup and drop-off, an English-speaking local guide, a flexible itinerary adjusted to your pace, and free time at each location.'
  },
  {
    q: 'What is not included?',
    a: 'Entrance fees — such as Kravice Waterfalls and museums — food and drinks, and optional activities such as ziplining, kayaking or boat rides.'
  },
  {
    q: 'Where do the tours start?',
    a: 'All four tours start and end in Mostar, with pickup and drop-off at your accommodation or another location you choose.'
  },
  {
    q: 'What language are the tours in?',
    a: 'Tours are guided in English by a local guide.'
  },
  {
    q: 'Can you build a tour that isn’t on the list?',
    a: 'Yes. Tell us what you would like to see — nature, culture, history, hidden gems or something more active — along with your dates and group size, and we will put a route together with you.'
  }
];

export const quotes = {
  origin: 'Merak Tours is a travel agency based in Mostar, Bosnia and Herzegovina, we have created this agency out of a deep love for this country and everything it represents.',
  goal: 'Our goal is to show people the real beauty of Bosnia and Herzegovina. From breathtaking nature and hidden waterfalls to historic towns full of stories, we want you to experience it all in an authentic and personal way.',
  belief: 'We believe travel should feel relaxed, meaningful, and real. That’s why we focus on private, flexible tours that let you explore at your own pace, with local insight and a personal touch.',
  feeling: 'Merak Tours isn’t just about visiting places, it’s about feeling them.',
  approach: 'At Merak Tours, we create private travel experiences that combine comfort, authenticity, and local insight. Each journey is designed to help you discover the true beauty of Bosnia and Herzegovina, from iconic landmarks to lesser-known hidden spots.',
  smallGroups: 'With a focus on small groups and a relaxed pace, we offer a more personal and meaningful way to explore, guided by locals who know the stories behind every place.',
  booking: 'Send us a message to check availability and customize your tour, or simply keep it as it is. We tailor each experience to your preferences so you can enjoy a relaxed, comfortable, and truly personal day. For the full itinerary and any additional details, feel free to contact us anytime.'
};
