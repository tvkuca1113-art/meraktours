import { site, tours, pillars, quotes, interests, faqs, media, included, notIncluded } from './data.mjs';
import {
  page, img, icons, esc, wa, waGeneral, includedSection, ctaSection, faqSection, photoUrl, photoCrop, archDivider
} from './templates.mjs';
import { atlasSvg, routePath } from './atlas.mjs';

/* ============================ shared blocks ============================== */

/* ---- the scroll journey ------------------------------------------------
   Nodes, times and notes all come out of the itineraries — nothing here is
   written for the 3D scene, it is the same day described on the tour page. */
const J_PLACE = {
  'Mostar': 'mostar',
  'Mostar Old Town': 'mostar',
  'Fortica': 'fortica',
  'Blagaj': 'blagaj',
  'Počitelj': 'pocitelj',
  'Kravice Waterfalls': 'kravice',
  'Jablanica': 'jablanica',
  'Sarajevo Old Town': 'sarajevo',
  'Panoramic viewpoint': 'sarajevo'
};

function stopMinutes(time) {
  const m = /(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})/.exec(time || '');
  if (!m) return 0;
  return (+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2]);
}

function journeyData(t) {
  const nodes = [], stops = [];
  let pendingDrive = '';
  t.itinerary.forEach((s) => {
    if (s.type === 'drive') { pendingDrive = s.dur || ''; return; }
    const key = J_PLACE[s.title];
    if (!key) return;
    if (!nodes.length || nodes[nodes.length - 1] !== key) nodes.push(key);
    stops.push({
      key, node: nodes.length - 1,
      name: s.title, time: s.time || '',
      note: s.note || '',
      tags: (s.tags || []).slice(0, 3).join(' · '),
      mins: stopMinutes(s.time),
      drive: pendingDrive,
      shot: s.img ? photoCrop(s.img, 1100, 1380) : '',
      shotSm: s.img ? photoCrop(s.img, 820, 1030) : ''
    });
    pendingDrive = '';
  });
  return { num: t.num, name: t.titleShort, href: `/tours/${t.slug}/`, duration: t.duration, nodes, stops };
}

const attrJson = (v) => JSON.stringify(v).replace(/'/g, '&#39;').replace(/</g, '\\u003c');

const TOUR_NODES = [
  ['mostar', 'pocitelj', 'kravice', 'mostar'],
  ['mostar', 'fortica', 'jablanica', 'mostar'],
  ['mostar', 'jablanica', 'sarajevo', 'jablanica', 'mostar'],
  ['mostar', 'blagaj', 'mostar']
];

function journeySection(tours) {
  const paths = TOUR_NODES.map(routePath);
  const data = tours.map((t, i) => {
    const d = journeyData(t);
    const pts = paths[i].nodes;
    d.box = paths[i].box;
    d.stops.forEach((s) => { const p = pts[s.node] || pts[0]; s.x = p.x; s.y = p.y; });
    return d;
  });
  const first = data[0], s0 = first.stops[0];

  const tabs = (cls) => `
    <div class="${cls}" role="tablist" aria-label="Choose a journey">
      ${data.map((d, i) => `<button class="jtab" type="button" role="tab" aria-selected="${i === 0}" data-jtour="${i}">
        <b>${d.num}</b><span>${esc(d.name)}</span></button>`).join('')}
    </div>`;

  return `
<section class="section jsec" id="journey" data-tours='${attrJson(data)}'>
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">The day, before the day</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>See the whole day before you book it.</h2>
        <p class="lede">Pick a journey and scroll. The line follows the roads we actually drive — down the Neretva, out across the karst, up to Sarajevo — and stops where you'll stop, for as long as you'll be there.</p>
      </div>
    </div>
  </div>

  <div class="jsec__track" id="journeyTrack">
    <div class="jsec__stick">
      ${tabs('jsec__tabs')}
      <div class="jsec__split">
        <div class="jsec__map">
          ${atlasSvg({ id: 'atlas', routes: paths })}
          <p class="jsec__caption" data-jcaption>Journey ${first.num} · ${esc(first.name)} · ${esc(first.duration)}</p>
        </div>

        <div class="jsec__story">
          <figure class="jsec__shot" data-jshot>
            <img alt="" src="${s0.shot}" width="1200" height="1500" decoding="async" loading="lazy">
            <img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1200" height="1500" decoding="async" loading="lazy">
          </figure>
          <div class="jsec__text" aria-live="polite">
            <p class="jsec__step" data-jstep>Stop 1 of ${first.stops.length}</p>
            <h3 class="jsec__name" data-jname>${esc(s0.name)}</h3>
            <p class="jsec__time" data-jtime>${esc(s0.time)}</p>
            <p class="jsec__desc" data-jdesc>${esc(s0.note)}</p>
            <p class="jsec__tags" data-jtags>${esc(s0.tags)}</p>
          </div>
          <div class="jsec__foot">
            <ol class="jsec__dots" data-jdots aria-hidden="true"></ol>
            <a class="btn jsec__cta" data-jcta href="${first.href}">Book this journey</a>
          </div>
        </div>
      </div>
    </div>

    <!-- phone: the day as a story, scrolling under the map -->
    <div class="jsec__mob" id="journeyMob">
      <div class="mrail" aria-hidden="true"><i data-mrail></i><span class="mrail__van" data-mvan>${icons.vanTop}</span></div>
      ${data.map((d, ti) => `
      <ol class="mstory${ti === 0 ? ' is-on' : ''}" data-mtour="${ti}"${ti ? ' hidden' : ''}>
        ${d.stops.map((st, si) => `
        <li class="mstop" data-mstop="${si}">
          <figure class="mstop__fig">
            <img alt="" src="${st.shotSm}" width="900" height="1100" decoding="async" loading="lazy">
          </figure>
          <p class="mstop__time">${esc(st.time)}</p>
          <h3 class="mstop__name">${esc(st.name)}</h3>
          <p class="mstop__desc">${esc(st.note)}</p>
          ${st.tags ? `<p class="mstop__tags">${esc(st.tags)}</p>` : ''}
        </li>`).join('')}
        <li class="mstop mstop--end">
          <p class="mstop__time">${esc(d.duration)}</p>
          <h3 class="mstop__name">${esc(d.name)}</h3>
          <p class="mstop__desc">Back in Mostar, where the day started.</p>
          <a class="btn" href="${d.href}">Book this journey</a>
        </li>
      </ol>`).join('')}
    </div>
  </div>
</section>`;
}

const bookBtn = (tour, cls = 'btn') =>
  `<button class="${cls}" type="button" data-book="${esc(tour ? tour.title : '')}">${icons.wa} ${tour ? 'Check availability' : 'Plan your journey'}</button>`;

function journeyCard(t, i, wide = false) {
  return `
<article class="jcard ${wide ? 'jcard--wide' : ''} rv rv-d${Math.min(i, 3)}">
  <div class="jcard__media">
    ${img(t.cover, { sizes: wide ? '(min-width:860px) 90vw, 100vw' : '(min-width:1100px) 32vw, (min-width:860px) 48vw, 100vw', max: 1920, style: `view-transition-name:tour-${t.num}` })}
  </div>
  <span class="jcard__num">${t.num}</span>
  <span class="jcard__tag">${esc(t.duration)}</span>
  <div class="jcard__body">
    <p class="jcard__kicker">${esc(t.kicker)}</p>
    <h3><a class="jcard__link" href="/tours/${t.slug}/">${esc(t.title)}</a></h3>
    <p class="jcard__route">${t.routeStops.map((s, n) => `${n ? '<i>—</i>' : ''}${esc(s)}`).join('')}</p>
    ${wide ? `<p style="color:rgba(255,255,255,.82);max-width:44ch">${esc(t.lead)}</p>` : ''}
    <ul class="jcard__hl">${t.highlights.slice(1).map(h => `<li>${esc(h)}</li>`).join('')}</ul>
    <div class="jcard__foot">
      <span class="link-arrow">View journey ${icons.arrow}</span>
    </div>
  </div>
</article>`;
}

function builder({ compact = false } = {}) {
  return `
<div class="builder__card rv">
  <form id="journeyForm" class="steps" novalidate>
    <div>
      <div class="step__head"><span class="step__n">1</span><span class="step__t">What pulls you in?</span></div>
      <div class="chips" role="group" aria-label="Interests">
        ${interests.map(it => `
        <label class="chip" title="${esc(it.note)}">
          <input type="checkbox" name="interest" value="${esc(it.label)}">
          <span>${esc(it.label)}</span>
        </label>`).join('')}
      </div>
    </div>

    <div>
      <div class="step__head"><span class="step__n">2</span><span class="step__t">Places you already have in mind</span></div>
      <div class="chips" role="group" aria-label="Destinations">
        ${['Mostar Old Town', 'Stari Most', 'Blagaj', 'Počitelj', 'Kravice Waterfalls', 'Fortica', 'Jablanica', 'Sarajevo', 'Surprise us'].map(p => `
        <label class="chip">
          <input type="checkbox" name="place" value="${esc(p)}">
          <span>${esc(p)}</span>
        </label>`).join('')}
      </div>
    </div>

    <div>
      <div class="step__head"><span class="step__n">3</span><span class="step__t">The practical part</span></div>
      <div class="grid-2">
        <div class="field">
          <label for="jDate">Preferred date</label>
          <input type="date" id="jDate" name="date">
        </div>
        <div class="field">
          <label for="jGuests">Travellers</label>
          <select id="jGuests" name="guests">
            ${[1,2,3,4,5,6].map(n => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} ${n === 1 ? 'traveller' : 'travellers'}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field" style="margin-top:1rem">
        <label for="jPickup">Pickup location</label>
        <input type="text" id="jPickup" name="pickup" placeholder="Hotel or address — in Mostar or elsewhere">
      </div>
      <div class="field" style="margin-top:1rem">
        <label for="jNote">Anything else we should know?</label>
        <textarea id="jNote" name="note" placeholder="Pace, mobility, children, food, how long you have…"></textarea>
      </div>
    </div>

    <div>
      <p class="form-note" style="margin-bottom:.5rem">We'll open WhatsApp with this message ready for you to send:</p>
      <section class="sheet__preview" id="journeyPreview" tabindex="0" aria-live="polite" aria-label="Your custom journey message"></section>
    </div>

    <button class="btn btn--wa btn--block" type="submit">${icons.wa} Send my journey</button>
    <p class="form-note">Private tours for up to six people. Every route is put together with you — nothing is confirmed until we've spoken.</p>
  </form>
</div>`;
}

/* ================================ home =================================== */
export function home() {
  const bandItems = [
    { k: 'mostarArch', t: 'Stari Most', c: 'The bridge Mostar is built around, and the stone streets that lead to it.' },
    { k: 'blagajTekke', t: 'Blagaj', c: 'A 16th-century dervish monastery built into the cliff where the Buna comes out of the rock.' },
    { k: 'kravice', t: 'Kravice', c: 'A wide green amphitheatre of waterfalls — and four hours to actually enjoy it.' },
    { k: 'pocitelj', t: 'Počitelj', c: 'Stone stairs, a tower, and a view down the Neretva that hasn\'t changed much in centuries.' },
    { k: 'sarajevoNight', t: 'Baščaršija', c: 'Sarajevo\'s old bazaar quarter — coppersmiths, coffee, and the sound of the city.' },
    { k: 'bosnianCoffee', t: 'Kahva', c: 'Bosnian coffee is not a drink you take away. It is an hour you give someone.' }
  ];

  const places3d = [
    { k: 'mostarArch',    name: 'Stari Most',        sub: 'Mostar', tour: 3 },
    { k: 'mostarOldTown', name: 'Mostar Old Town',   sub: 'Mostar', tour: 3 },
    { k: 'blagajTekke',   name: 'Blagaj Tekke',      sub: 'Blagaj', tour: 3 },
    { k: 'blagajBuna',    name: 'The Buna spring',   sub: 'Blagaj', tour: 3 },
    { k: 'pocitelj',      name: 'Počitelj',          sub: 'Herzegovina', tour: 0 },
    { k: 'kravice',       name: 'Kravice Waterfalls',sub: 'Herzegovina', tour: 0 },
    { k: 'fortica',       name: 'Fortica',           sub: 'Above Mostar', tour: 1 },
    { k: 'jablanica',     name: 'Jablanica',         sub: 'On the Neretva', tour: 1 },
    { k: 'sarajevoSquare',name: 'Baščaršija',        sub: 'Sarajevo', tour: 2 },
    { k: 'neretvaCanyon', name: 'The Neretva canyon',sub: 'Towards Sarajevo', tour: 2 }
  ];

  const html = `
<!-- HERO -->
<section class="hero grain" id="hero">
  <!-- Mostar first, because that is where every journey starts; then the rest
       of the country the journeys reach. Only the first frame is fetched up
       front — the others load once the page has settled. -->
  <div class="hero__media" data-heroslides>
    ${[
      ['heroMostar', 'Mostar'],
      ['kravice', 'Kravice Waterfalls'],
      ['sarajevoSquare', 'Sarajevo'],
      ['blagajTekke', 'Blagaj']
    ].map(([k, place], i) => i === 0
      ? `<figure class="hero__slide is-on" data-place="${esc(place)}">${img(k, { sizes: '100vw', priority: true, max: 2400 })}</figure>`
      : `<figure class="hero__slide" data-place="${esc(place)}"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${photoCrop(k, 1800, 2200)}" width="1800" height="2200" decoding="async"></figure>`
    ).join('')}
  </div>
  <div class="wrap hero__in">
    <p class="eyebrow hero__eyebrow" style="color:var(--buna-soft)"><span data-heroplace>Mostar</span> · Bosnia and Herzegovina</p>
    <h1>
      <span class="l"><span>Discover Bosnia.</span></span>
      <span class="l"><span>Feel the <em>merak</em>.</span></span>
    </h1>
    <p class="hero__sub">Private journeys through Bosnia and Herzegovina — its culture, its nature, its stories, and the quiet places that never make the coach routes.</p>
    <div class="hero__cta">
      <a class="btn btn--solid-light" href="#journeys">Explore journeys</a>
      <a class="btn btn--light" href="#create">Create your journey</a>
    </div>
    <dl class="hero__meta">
      <div><dt>Four journeys</dt><dd>All from Mostar</dd></div>
      <div><dt>Private</dt><dd>Solo or up to six</dd></div>
      <div><dt>Pickup</dt><dd>At your accommodation</dd></div>
      <div><dt>Guided in</dt><dd>English, by locals</dd></div>
    </dl>
  </div>
  <div class="scroll-cue" aria-hidden="true"></div>
</section>

<!-- MERAK -->
<section class="section intro" id="merak">
  <div class="wrap">
    <div class="intro__grid">
      <div class="rv">
        <p class="eyebrow">The name</p>
        <p class="intro__word">Mer<span>a</span>k</p>
        <p class="intro__def">A feeling — not a schedule</p>
        <div class="fig arch rv" data-par="20" style="aspect-ratio:3/4;margin-top:2rem">
          ${img('bosnianCoffee', { sizes: '(min-width:860px) 30vw, 90vw', max: 1080 })}
        </div>
      </div>
      <div class="intro__body rv rv-d1">
        <p>Merak is the pleasure you take in something small and unhurried. A coffee that lasts an hour. A river you hadn't planned to swim in. An afternoon you don't cut short because a bus is leaving.</p>
        <p style="margin-top:1.6rem">${esc(quotes.origin)}</p>
        <p>${esc(quotes.goal)}</p>
        <p>${esc(quotes.belief)}</p>
        <blockquote class="quote" style="margin-top:2.2rem">
          ${esc(quotes.feeling)}
          <cite>Merak Tours</cite>
        </blockquote>
      </div>
    </div>
  </div>
</section>

<!-- JOURNEYS -->
<section class="section journeys" id="journeys">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Four journeys</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Choose a journey — or change it until it's yours.</h2>
        <p class="lede">All four start and end in Mostar, run at your pace, and can be reshaped — before you set off, or on the morning itself.</p>
      </div>
    </div>
    <div class="jlist">
      ${tours.map((t, i) => journeyCard(t, i, i === 0)).join('')}
    </div>
  </div>
</section>

<!-- THE JOURNEY, IN 3D -->
${journeySection(tours)}

<!-- THE PLACES -->
<section class="section places" id="places">
  ${archDivider()}
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow on-dark">Where the journeys go</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Ten places. Four days out of Mostar.</h2>
        <p class="lede" style="color:rgba(255,255,255,.68)">Every one of these is a stop on one of the four journeys. Read down the list; the photograph follows you.</p>
      </div>
    </div>

    <div class="pidx rv" id="placesIndex">
      <div class="pidx__stage" aria-hidden="true">
        ${places3d.map((p, i) => `<figure class="pidx__shot${i === 0 ? ' is-on' : ''}" data-pshot="${i}">${img(p.k, { sizes: '(min-width:900px) 42vw, 92vw', max: 1400 })}</figure>`).join('')}
      </div>

      <span class="pidx__cue" aria-hidden="true">${icons.arrow}</span>
      <ol class="pidx__list">
        ${places3d.map((p, i) => `
        <li class="pidx__row${i === 0 ? ' is-on' : ''}" data-prow="${i}">
          <a href="/tours/${tours[p.tour].slug}/">
            <span class="pidx__n">${String(i + 1).padStart(2, '0')}</span>
            <span class="pidx__name">${esc(p.name)}</span>
            <span class="pidx__sub">${esc(p.sub)}</span>
            <span class="pidx__thumb">${img(p.k, { sizes: '30vw', max: 640 })}</span>
            <span class="pidx__go">Journey ${tours[p.tour].num} ${icons.arrow}</span>
          </a>
        </li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<!-- STORYTELLING BAND -->
<section class="section band" id="bosnia">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Bosnia and Herzegovina</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Six things you'll remember longer than the photographs.</h2>
        <p class="lede">${esc(quotes.approach)}</p>
      </div>
    </div>
  </div>
  <ul class="band__rail rv" tabindex="0" aria-label="Places in Bosnia and Herzegovina — scroll horizontally to see more">
    ${bandItems.map(b => `
    <li class="band__item">
      <figure class="fig fig--zoom">${img(b.k, { sizes: '(min-width:860px) 38vw, 74vw', max: 1080 })}</figure>
      <h3>${esc(b.t)}</h3>
      <p>${esc(b.c)}</p>
    </li>`).join('')}
  </ul>
</section>


<div class="marquee" aria-hidden="true">
  <div class="marquee__t"><span>Mostar</span><span class="dot">·</span><span>Stari Most</span><span class="dot">·</span><span>Blagaj</span><span class="dot">·</span><span>Buna</span><span class="dot">·</span><span>Počitelj</span><span class="dot">·</span><span>Kravice</span><span class="dot">·</span><span>Fortica</span><span class="dot">·</span><span>Jablanica</span><span class="dot">·</span><span>Neretva</span><span class="dot">·</span><span>Sarajevo</span><span class="dot">·</span><span>Baščaršija</span><span class="dot">·</span><span>Mostar</span><span class="dot">·</span><span>Stari Most</span><span class="dot">·</span><span>Blagaj</span><span class="dot">·</span><span>Buna</span><span class="dot">·</span><span>Počitelj</span><span class="dot">·</span><span>Kravice</span><span class="dot">·</span><span>Fortica</span><span class="dot">·</span><span>Jablanica</span><span class="dot">·</span><span>Neretva</span><span class="dot">·</span><span>Sarajevo</span><span class="dot">·</span><span>Baščaršija</span><span class="dot">·</span></div>
</div>

<!-- WHY -->
<section class="section why" id="why">
  ${archDivider("archdiv--paper")}
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow on-dark">Why travel with us</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Small groups. Local knowledge. No rush.</h2>
        <p class="lede" style="color:rgba(255,255,255,.66)">${esc(quotes.smallGroups)}</p>
      </div>
    </div>
    <div class="pillars" id="pillars">
      ${pillars.map((p, i) => `
      <article class="pillar rv" data-img="${photoUrl(p.img, 768)}">
        <p class="pillar__n">0${i + 1}</p>
        <div>
          <h3>${esc(p.label)}</h3>
          <p class="pillar__line">${esc(p.line)}</p>
        </div>
        <p>${esc(p.body)}</p>
      </article>`).join('')}
    </div>
    <div class="pillar__img" id="pillarImg" aria-hidden="true"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>
  </div>
</section>

${includedSection()}

<!-- BUILDER -->
<section class="section builder" id="create">
  ${archDivider("archdiv--paper")}
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Create your own journey</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Or tell us what you want to see, and we'll build the day around it.</h2>
        <p class="lede">Any tour can be reshaped, or we can start from a blank page — a different route, a slower morning, a longer swim. Choose what pulls you in and send it over.</p>
      </div>
    </div>
    ${builder()}
  </div>
</section>

${faqSection()}
${ctaSection()}
`;

  /* ---- structured data ---- */
  const org = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': site.origin + '/#organization',
    name: site.name,
    description: 'Private and small-group tours of Bosnia and Herzegovina, based in Mostar. Culture, nature and hidden gems, with local guides and fully customisable itineraries.',
    url: site.origin + '/',
    logo: site.origin + '/assets/img/logo.png',
    image: site.origin + '/assets/img/og-default.png',
    telephone: site.whatsapp.e164,
    areaServed: [
      { '@type': 'Country', name: 'Bosnia and Herzegovina' },
      { '@type': 'City', name: 'Mostar' }
    ],
    address: { '@type': 'PostalAddress', addressLocality: 'Mostar', addressCountry: 'BA' },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lon },
    sameAs: [site.instagram.url, `https://wa.me/${site.whatsapp.digits}`],
    knowsLanguage: ['en'],
    makesOffer: tours.map(t => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'TouristTrip', name: t.title, url: `${site.origin}/tours/${t.slug}/` }
    }))
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': site.origin + '/#website',
    url: site.origin + '/',
    name: site.name,
    inLanguage: 'en',
    publisher: { '@id': site.origin + '/#organization' }
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Merak Tours journeys from Mostar',
    itemListElement: tours.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${site.origin}/tours/${t.slug}/`,
      name: t.title
    }))
  };

  return page({
    title: 'Merak Tours — Private Tours in Bosnia and Herzegovina, from Mostar',
    description: 'Private and small-group day tours from Mostar to Kravice Waterfalls, Blagaj, Počitelj, Jablanica and Sarajevo. Local guides, up to six people, pickup at your accommodation, every itinerary customisable.',
    keywords: 'private tours Mostar, Mostar private tours, Bosnia private tours, Herzegovina tours, Mostar to Kravice tour, Mostar Počitelj tour, Mostar Blagaj tour, Mostar Sarajevo tour',
    path: '/',
    html,
    preloadImage: 'heroMostar',
    jsonld: [org, website, itemList, faqLd]
  });
}

/* ============================== tour page =============================== */
export function tourPage(t, index) {
  const others = tours.filter(o => o.slug !== t.slug);
  const stops = t.itinerary.filter(i => i.type === 'point');

  /* The day as a transit line: stops carry a photograph, a caption and their
     tags; the drive between them is a node of its own, because on a 7–11 hour
     day the travel time is information, not dead space. */
  const trip = `
<ol class="trip">
  ${t.itinerary.map((step) => step.type === 'drive' ? `
  <li class="trip__leg">
    <span class="trip__dot trip__dot--sm"></span>
    <span class="trip__legrow">${icons.van}<span>Drive to ${esc(step.to)}</span><b>${esc(step.dur)}</b></span>
  </li>` : `
  <li class="trip__stop">
    <span class="trip__dot"></span>
    <article class="trip__card">
      ${step.img ? `<figure class="trip__fig fig-rv rv">${img(step.img, { sizes: '(min-width:860px) 44vw, 92vw', max: 1440 })}</figure>` : ''}
      <div class="trip__body">
        <p class="trip__time">${esc(step.time)}${step.dur ? ` <i>·</i> ${esc(step.dur)}` : ''}</p>
        <h3>${esc(step.title)}</h3>
        ${step.sub ? `<p class="trip__sub">${esc(step.sub)}</p>` : ''}
        ${step.note ? `<p class="trip__note">${esc(step.note)}</p>` : ''}
        ${step.tags ? `<ul class="trip__tags">${step.tags.map(x => `<li${/^Optional/.test(x) ? ' class="is-opt"' : ''}>${esc(x)}</li>`).join('')}</ul>` : ''}
      </div>
    </article>
  </li>`).join('')}
</ol>`;

  /* A compact route strip — stops and drive times, no geography. */
  const strip = `
<div class="rstrip" tabindex="0" role="img" aria-label="Route: ${t.routeStops.join(' to ')}, with drive times">
  <div class="rstrip__row">
    ${t.itinerary.filter(i => i.type === 'point' || i.type === 'drive').map(i =>
      i.type === 'drive'
        ? `<span class="rstrip__leg"><i></i>${esc(i.dur)}<i></i></span>`
        : `<span class="rstrip__stop">${esc(i.title)}</span>`).join('')}
  </div>
</div>`;

  const html = `
<article>
<section class="thero">
  <div class="thero__media">${img(t.hero, { sizes: '100vw', priority: true, max: 2400, style: `view-transition-name:tour-${t.num}` })}</div>
  <div class="wrap thero__in">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Merak Tours</a> <span aria-hidden="true">/</span> <a href="/#journeys">Journeys</a> <span aria-hidden="true">/</span> <span>${esc(t.titleShort)}</span>
    </nav>
    <p class="eyebrow" style="color:var(--buna-soft);margin-top:1.2rem">Journey ${t.num} · ${esc(t.kicker)}</p>
    <h1>${esc(t.title)}</h1>
    <p class="thero__lead">${esc(t.lead)}</p>
  </div>
</section>

<div class="wrap">
  <div class="facts rv">
    <div class="facts__grid">
      <dl class="fact"><dt>Duration</dt><dd>${esc(t.duration)}</dd></dl>
      <dl class="fact"><dt>Starts / ends</dt><dd>${esc(t.startTime)} — ${esc(t.endTime)}</dd></dl>
      <dl class="fact"><dt>Pickup &amp; drop-off</dt><dd>Mostar</dd></dl>
      <dl class="fact"><dt>Group</dt><dd>Private, up to 6</dd></dl>
    </div>
  </div>
</div>

<section class="section" style="padding-top:clamp(2.2rem,5vw,3.4rem);padding-bottom:0">
  <div class="wrap">
    <div class="hl-grid rv">
      <div>
        <p class="eyebrow">In short</p>
        <ul class="hl-list">
          ${t.highlights.map(h => `<li>${icons.check}<span>${esc(h)}</span></li>`).join('')}
        </ul>
      </div>
      <div>
        <p class="lede" style="font-family:var(--display);font-size:var(--t-lg);line-height:1.28;color:var(--pine-deep)">${esc(t.intro)}</p>
        ${t.body.slice(0, 1).map(p => `<p style="margin-top:1.1rem;max-width:var(--measure)">${esc(p)}</p>`).join('')}
        <div style="margin-top:1.6rem">${bookBtn(t, 'btn')}</div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-bottom:0">
  <div class="wrap"><p class="eyebrow rv">Where you'll be</p></div>
  <ul class="band__rail rv" tabindex="0" aria-label="Photographs from this journey — scroll for more" style="margin-top:1.2rem">
    ${t.gallery.map((g, n) => `<li class="band__item"><figure class="fig fig--zoom" style="aspect-ratio:4/5;border-radius:var(--r-md)">${img(g, { sizes: '(min-width:860px) 34vw, 74vw', max: 1080 })}</figure></li>`).join('')}
  </ul>
</section>

<section class="section" id="itinerary">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">The day</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Hour by hour — including the time on the road.</h2>
        <p class="lede">The times are the shape of the day, not a stopwatch. The pace follows you, and any of it can change on the morning.</p>
      </div>
    </div>
    ${strip}
    <div class="tour-layout" style="margin-top:clamp(2rem,5vw,3rem)">
      <div>
        ${trip}
        ${t.optional.length ? `
        <div class="optbox rv" style="margin-top:2.4rem">
          <h2>Optional, and at your own cost</h2>
          <p>These are available along this route but are <strong>not included</strong> in the tour. You decide on the day whether you'd like them, and pay for them directly.</p>
          <ul>${t.optional.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
        </div>` : ''}
      </div>

      <div class="tour-aside rv">
        <div class="builder__card">
          <p class="eyebrow">Journey ${t.num}</p>
          <h2 style="font-size:var(--t-lg);margin:.7rem 0 .4rem">${esc(t.title)}</h2>
          <p class="form-note" style="margin-bottom:1.1rem">${esc(t.duration)} · Private, up to 6 · Pickup in Mostar</p>
          ${bookBtn(t, 'btn btn--wa btn--block')}
          <p class="form-note" style="margin-top:.9rem">Message us to check availability, customise this tour, or keep it exactly as it is.</p>
          <hr style="border:0;border-top:1px solid var(--hair);margin:1.2rem 0">
          <h3 style="font-size:var(--t-sm);letter-spacing:.13em;text-transform:uppercase;font-family:var(--sans);color:var(--ink-3);margin-bottom:.7rem">Included</h3>
          <ul class="ledger__list ledger--in" style="font-size:var(--t-sm)">
            ${included.map(i => `<li>${icons.check}<span>${esc(i)}</span></li>`).join('')}
          </ul>
          <h3 style="font-size:var(--t-sm);letter-spacing:.13em;text-transform:uppercase;font-family:var(--sans);color:var(--ink-3);margin:1.2rem 0 .7rem">Not included</h3>
          <ul class="ledger__list ledger--out" style="font-size:var(--t-sm)">
            ${notIncluded.map(i => `<li>${icons.minus}<span>${esc(i)}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--paper-2);padding-block:clamp(2.6rem,6vw,4rem)">
  <div class="wrap">
    <div class="meet rv">
      <div>
        <p class="eyebrow">Where we meet</p>
        <h2 style="font-size:var(--t-lg);margin:.8rem 0 .8rem">We come to you, in Mostar.</h2>
        <p style="max-width:46ch">Pickup and drop-off happen at your accommodation — or at another location in Mostar you choose. Tell us where you're staying when you message and we'll confirm the time.</p>
        <p style="margin-top:1.2rem"><a class="link-arrow" href="${waGeneral}" target="_blank" rel="noopener">Send us your pickup address ${icons.arrow}</a></p>
      </div>
      <figure class="meet__fig fig arch" data-par="18">${img('mostarBazaar', { sizes: '(min-width:860px) 38vw, 90vw', max: 1200 })}</figure>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Keep exploring</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>The other journeys</h2>
        <p class="lede">Staying more than a day? Tell us how long you have and we'll put them in the right order.</p>
      </div>
    </div>
    <div class="jlist">${others.map((o, i) => journeyCard(o, i)).join('')}</div>
  </div>
</section>

${ctaSection({ title: 'Ready when you are.', imgKey: t.gallery[0] })}
</article>

<div class="bookbar">
  <div>
    <b>${esc(t.titleShort)}</b>
    <span>${esc(t.duration)} · private</span>
  </div>
  ${bookBtn(t, 'btn btn--wa btn--sm')}
</div>`;

  const trip_ld = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${site.origin}/tours/${t.slug}/#trip`,
    name: t.title,
    description: t.intro,
    url: `${site.origin}/tours/${t.slug}/`,
    image: photoUrl(t.hero, 1440),
    touristType: ['Couples', 'Families', 'Small groups', 'Solo travellers'],
    inLanguage: 'en',
    provider: { '@id': site.origin + '/#organization' },
    departureTime: t.startTime,
    arrivalTime: t.endTime,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: stops.length,
      itemListElement: stops.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristAttraction',
          name: s.title,
          ...(s.note ? { description: s.note } : {}),
          address: { '@type': 'PostalAddress', addressCountry: 'BA' }
        }
      }))
    },
    subjectOf: { '@type': 'WebPage', url: `${site.origin}/tours/${t.slug}/`, inLanguage: 'en' }
  };

  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Merak Tours', item: site.origin + '/' },
      { '@type': 'ListItem', position: 2, name: 'Journeys', item: site.origin + '/#journeys' },
      { '@type': 'ListItem', position: 3, name: t.title, item: `${site.origin}/tours/${t.slug}/` }
    ]
  };

  return page({
    title: t.seoTitle + ' | Merak Tours',
    description: t.seoDesc,
    keywords: t.keywords,
    path: `/tours/${t.slug}/`,
    bodyClass: 'has-bookbar',
    html,
    preloadImage: t.hero,
    ogImage: `/assets/img/og-${t.slug}.png`,
    jsonld: [trip_ld, crumbs]
  });
}

/* ========================= create your journey ========================== */
export function createPage() {
  const html = `
<section class="thero" style="min-height:62svh">
  <div class="thero__media">${img('mountains', { sizes: '100vw', priority: true, max: 2400 })}</div>
  <div class="wrap thero__in">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Merak Tours</a> <span aria-hidden="true">/</span> <span>Create your journey</span></nav>
    <p class="eyebrow" style="color:var(--buna-soft);margin-top:1.2rem">Custom journeys</p>
    <h1>Build the day you actually want.</h1>
    <p class="thero__lead">Our four journeys are a starting point, not a menu. Tell us what you're drawn to and how long you have, and we'll put a route together with you.</p>
  </div>
</section>

<section class="section">
  <div class="wrap tour-layout">
    <div>
      <p class="eyebrow rv">How it works</p>
      <h2 class="rv" style="font-size:var(--t-xl);margin:1rem 0 1.2rem">Three messages, and the day is yours.</h2>
      <p class="rv" style="max-width:var(--measure)">${esc(quotes.booking)}</p>
      <div class="steps rv" style="margin-top:2.4rem">
        <div>
          <div class="step__head"><span class="step__n">1</span><span class="step__t">You send us the shape of it</span></div>
          <p style="max-width:var(--measure)">Interests, dates, how many of you, where you're staying. The form does the writing for you.</p>
        </div>
        <div>
          <div class="step__head"><span class="step__n">2</span><span class="step__t">We come back with a route</span></div>
          <p style="max-width:var(--measure)">A realistic day — travel times, where the free time sits, what's worth adding and what's worth cutting.</p>
        </div>
        <div>
          <div class="step__head"><span class="step__n">3</span><span class="step__t">We pick you up</span></div>
          <p style="max-width:var(--measure)">At your accommodation or wherever you choose, in a comfortable vehicle with air conditioning, and the day runs at your pace.</p>
        </div>
      </div>
      <div class="fig arch rv" style="aspect-ratio:16/11;margin-top:2.6rem;border-radius:var(--r-lg)">
        ${img('boracko', { sizes: '(min-width:860px) 60vw, 92vw', max: 1440 })}
      </div>
    </div>
    <div class="tour-aside">
      <div class="builder__card rv">
        <p class="eyebrow">Start here</p>
        <h2 style="font-size:var(--t-lg);margin:.7rem 0 1.2rem">What are you drawn to?</h2>
        <p class="form-note" style="margin-bottom:1rem">Pick as many as you like. Nothing is booked until we've spoken.</p>
        <a class="btn btn--wa btn--block" href="${wa('Hello Merak Tours! I would like to put together a custom journey in Bosnia and Herzegovina. Could you help me plan it?')}" target="_blank" rel="noopener">${icons.wa} Message us directly</a>
      </div>
    </div>
  </div>
</section>

<section class="section builder" style="padding-top:0;background:var(--sky)">
  <div class="wrap" style="padding-top:var(--sec-y)">
    <div class="sec-head rv">
      <p class="eyebrow">Create your own journey</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Interests first. Logistics second.</h2>
        <p class="lede">Nature, culture, history, hidden gems, adventure — or a mix. Choose what pulls you in and we'll do the rest.</p>
      </div>
    </div>
    ${builder()}
  </div>
</section>

${includedSection()}
${ctaSection({ title: 'Tell us what you have in mind.', imgKey: 'neretvaCanyon' })}
`;

  return page({
    title: 'Create Your Own Journey | Custom Private Tours from Mostar — Merak Tours',
    description: 'Build a custom private tour of Bosnia and Herzegovina from Mostar. Choose your interests, dates and pickup location, and we will put a route together with you.',
    keywords: 'custom tour Bosnia, tailor made tour Mostar, private guide Bosnia and Herzegovina, custom day trip Mostar',
    path: '/create-your-journey/',
    html,
    preloadImage: 'mountains',
    ogImage: '/assets/img/og-create.png',
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Merak Tours', item: site.origin + '/' },
        { '@type': 'ListItem', position: 2, name: 'Create your journey', item: site.origin + '/create-your-journey/' }
      ]
    }]
  });
}

/* ============================== credits ================================= */
export function creditsPage() {
  const items = Object.values(media);
  const html = `
<section class="section" style="padding-top:9rem">
  <div class="wrap wrap-narrow">
    <p class="eyebrow">Credits</p>
    <h1 style="font-size:var(--t-2xl);margin:1rem 0 1.2rem">Photography</h1>
    <p class="lede">The landscape and city photographs on this site are published under the Unsplash License, which permits commercial use. Every photographer is credited below. Merak Tours' own photographs will replace them as they are added.</p>
    <ul class="credits-list" style="margin-top:2.5rem">
      ${items.map(m => m.own
        ? `<li><strong>${esc(m.place)}</strong> — ${esc(m.alt)}. Photograph by Merak Tours.</li>`
        : `<li><strong>${esc(m.place)}</strong> — ${esc(m.alt)}. Photograph by <a href="https://unsplash.com/@${esc(m.user)}" target="_blank" rel="noopener nofollow">${esc(m.by)}</a> on <a href="${esc(m.page)}" target="_blank" rel="noopener nofollow">Unsplash</a>.</li>`).join('')}
    </ul>
    <p class="muted" style="margin-top:2.5rem;font-size:var(--t-sm)">Fonts: Fraunces and Inter, both under the SIL Open Font License. Map geometry: Natural Earth (public domain).</p>
  </div>
</section>`;

  return page({
    title: 'Photography Credits | Merak Tours',
    description: 'Credits for the photography, typefaces and map data used on the Merak Tours website.',
    path: '/credits/',
    html
  });
}

/* ================================= 404 ================================== */
export function notFound() {
  const html = `
<section class="section" style="padding-top:9rem;min-height:70svh;display:grid;place-items:center;text-align:center">
  <div class="wrap wrap-narrow">
    <p class="eyebrow is-center">404</p>
    <h1 style="font-size:var(--t-2xl);margin:1rem 0">This road doesn't go anywhere.</h1>
    <p class="lede" style="margin-inline:auto">This page isn't here any more — but the four journeys still are.</p>
    <div class="cta__btns" style="margin-top:2rem">
      <a class="btn" href="/#journeys">Explore journeys</a>
      <a class="btn btn--ghost" href="${waGeneral}" target="_blank" rel="noopener">${icons.wa} WhatsApp us</a>
    </div>
  </div>
</section>`;
  return page({ title: 'Page not found | Merak Tours', description: 'This page could not be found.', path: '/404.html', html });
}
