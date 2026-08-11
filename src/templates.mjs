import { site, media, tours, included, notIncluded, faqs } from './data.mjs';

/* ---------- helpers ------------------------------------------------------ */
export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const WIDTHS = [480, 768, 1080, 1440, 1920, 2400];
const CDN = 'https://images.unsplash.com/';

/* The client's own photographs are served from this origin; the stock ones
   come off the Unsplash CDN, which negotiates AVIF/WebP for us. */
const LOCAL_W = [480, 768, 1080, 1440];
const nearest = (w) => LOCAL_W.find(x => x >= w) || LOCAL_W[LOCAL_W.length - 1];

export const photoUrl = (key, w = 1440, q = 74) =>
  media[key].local
    ? `/assets/photos/${media[key].local}-${nearest(w)}.jpg`
    : `${CDN}${media[key].id}?auto=format&fit=crop&w=${w}&q=${q}`;

/* fixed-ratio crop, used for the photo pins standing on the 3D map */
export const photoCrop = (key, w, h, q = 70) =>
  media[key].local
    ? `/assets/photos/${media[key].local}-${nearest(w)}.jpg`
    : `${CDN}${media[key].id}?auto=format&fit=crop&crop=entropy&w=${w}&h=${h}&q=${q}`;

/**
 * Responsive <img>. Unsplash's CDN negotiates AVIF/WebP via `auto=format`,
 * so we get modern formats without hosting binaries ourselves.
 */
export function img(key, {
  sizes = '100vw', max = 2400, cls = '', loading = 'lazy', priority = false, ratio = '', style = ''
} = {}) {
  const m = media[key];
  if (!m) throw new Error('Unknown media key: ' + key);
  const widths = (m.local ? LOCAL_W : WIDTHS).filter(w => w <= max);
  const srcset = widths.map(w => `${photoUrl(key, w)} ${w}w`).join(', ');
  return `<img src="${photoUrl(key, Math.min(1080, max))}" srcset="${srcset}" sizes="${sizes}"
    alt="${esc(m.alt)}" ${ratio ? `width="${ratio[0]}" height="${ratio[1]}"` : ''}
    loading="${priority ? 'eager' : loading}" decoding="${priority ? 'sync' : 'async'}"
    ${priority ? 'fetchpriority="high"' : ''} ${cls ? `class="${cls}"` : ''} ${style ? `style="${style}"` : ''}>`;
}

/* WhatsApp deep link with a pre-filled message */
export const wa = (text) =>
  `https://wa.me/${site.whatsapp.digits}?text=${encodeURIComponent(text)}`;

export const waGeneral = wa(
  `Hello Merak Tours! I found you on your website and I'd like to ask about your private tours in Bosnia and Herzegovina.`
);

/* ---------- icons -------------------------------------------------------- */
export const icons = {
  wa: `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35M12.05 21.8h-.03a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.78 9.78 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.83-9.8 2.62 0 5.09 1.03 6.94 2.88a9.75 9.75 0 0 1 2.87 6.94c0 5.4-4.4 9.8-9.81 9.8M20.52 3.45A11.6 11.6 0 0 0 12.05 0C5.6 0 .36 5.24.36 11.68c0 2.06.54 4.07 1.56 5.84L.26 24l6.63-1.74a11.66 11.66 0 0 0 5.16 1.24h.01c6.44 0 11.68-5.24 11.69-11.68 0-3.12-1.22-6.06-3.43-8.27"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 12.5 5 5L20 6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14" stroke-linecap="round"/></svg>`,
  van: `<svg viewBox="0 0 32 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 14V7.5C2 6 3 5 4.5 5h11l5 4.5H27c1.7 0 3 1.3 3 3V14" stroke-linejoin="round"/><path d="M2 14h3m6 0h10m6 0h3"/><circle cx="8" cy="15" r="2.6"/><circle cx="24" cy="15" r="2.6"/></svg>`,
  /* the van seen from above, for the vertical rail on a phone */
  vanTop: `<svg viewBox="0 0 20 30" fill="none" aria-hidden="true"><rect x="3.2" y="2.4" width="13.6" height="25.2" rx="4.2" fill="currentColor"/><path d="M5.6 9.2h8.8M5.6 20.2h8.8" stroke="rgba(10,28,20,.55)" stroke-width="1.3" stroke-linecap="round"/><rect x="5.4" y="4.6" width="9.2" height="3.4" rx="1.5" fill="rgba(10,28,20,.5)"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"/></svg>`,
  ig: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0"/></svg>`
};

/* ---------- brand mark --------------------------------------------------- */
/* A refined mark drawn from the silhouette of Stari Most: the rising deck,
   the arch beneath it and the Neretva below. Vector, so it stays crisp. */
export const logoMark = (cls = 'brand__mark') => `
<svg class="${cls}" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <circle cx="24" cy="24" r="22.4" stroke="currentColor" stroke-opacity=".28" stroke-width="1.2"/>
  <path d="M7.5 27.6C7.5 20.9 14.9 15.6 24 15.6s16.5 5.3 16.5 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M7.5 27.6h4.2m24.6 0h4.2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M11.7 27.6v4.2m24.6-4.2v4.2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M9 35.4c2.6 0 2.6 1.7 5.2 1.7s2.6-1.7 5.2-1.7 2.6 1.7 5.2 1.7 2.6-1.7 5.2-1.7 2.6 1.7 5.2 1.7 2.6-1.7 5.2-1.7"
        stroke="currentColor" stroke-opacity=".5" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

export const brand = (extraClass = '') => `
<a class="brand ${extraClass}" href="/">
  ${logoMark()}
  <span class="brand__txt">
    <span class="brand__name">Merak Tours</span>
    <span class="brand__sub">Bosnia &amp; Herzegovina</span>
  </span>
</a>`;

/* ---------- navigation --------------------------------------------------- */
const NAV = [
  { href: '/#journeys', label: 'Journeys' },
  { href: '/#places', label: 'The places' },
  { href: '/#why', label: 'Why Merak' },
  { href: '/create-your-journey/', label: 'Create your journey' },
  { href: '/#faq', label: 'FAQ' }
];

export function header(current = '') {
  return `
<header class="hdr" id="hdr">
  <div class="wrap hdr__in">
    ${brand()}
    <nav class="nav" aria-label="Primary">
      ${NAV.map(n => `<a href="${n.href}"${current === n.href ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
    </nav>
    <div class="hdr__act">
      <a class="btn btn--sm" href="${waGeneral}" target="_blank" rel="noopener" data-wa>${icons.wa}<span>Book on WhatsApp</span></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu" id="burger">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="progress" id="progress" aria-hidden="true"></div>
</header>

<div class="drawer" id="drawer" hidden>
  <nav class="drawer__nav" aria-label="Mobile">
    ${NAV.map((n, i) => `<a href="${n.href}" style="transition-delay:${0.08 + i * 0.06}s"><i>0${i + 1}</i>${n.label}</a>`).join('')}
  </nav>
  <div class="drawer__foot">
    <a class="btn btn--wa" href="${waGeneral}" target="_blank" rel="noopener">${icons.wa} WhatsApp ${esc(site.whatsapp.display)}</a>
    <p class="form-note" style="color:rgba(255,255,255,.55)">Mostar · Bosnia and Herzegovina</p>
  </div>
</div>`;
}

/* ---------- footer ------------------------------------------------------- */
export function footer() {
  const year = 2026;
  return `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__grid">
      <div class="ftr__brand">
        ${brand()}
        <p style="max-width:34ch;margin-top:1rem">Private and small-group journeys through Bosnia and Herzegovina, from Mostar. Culture, nature and hidden gems — at your own pace.</p>
      </div>
      <div>
        <h2>Journeys</h2>
        <ul>
          ${tours.map(t => `<li><a href="/tours/${t.slug}/">${esc(t.title)}</a></li>`).join('')}
          <li><a href="/create-your-journey/">Create your own journey</a></li>
        </ul>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          <li><a href="/#merak">The meaning of merak</a></li>
          <li><a href="/#places">The places</a></li>
          <li><a href="/#why">Why travel with us</a></li>
          <li><a href="/#included">What's included</a></li>
          <li><a href="/#faq">Questions</a></li>
        </ul>
      </div>
      <div>
        <h2>Get in touch</h2>
        <ul>
          <li><a href="${waGeneral}" target="_blank" rel="noopener">WhatsApp ${esc(site.whatsapp.display)}</a></li>
          <li><a href="${site.instagram.url}" target="_blank" rel="noopener">Instagram ${esc(site.instagram.handle)}</a></li>
          <li>Mostar, Bosnia and Herzegovina</li>
        </ul>
      </div>
    </div>
    <div class="ftr__bottom">
      <p>© ${year} Merak Tours. Private &amp; small group tours, Bosnia and Herzegovina.</p>
      <p><a href="/credits/">Photography credits</a></p>
    </div>
  </div>
  ${waFloat()}
</footer>`;
}

/* ---------- floating WhatsApp + booking sheet ---------------------------- */
export function waFloat() {
  return `<a class="wa-float" id="waFloat" href="${waGeneral}" target="_blank" rel="noopener" aria-label="Message Merak Tours on WhatsApp">${icons.wa}<span>WhatsApp</span></a>`;
}

export function bookingSheet() {
  return `
<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" hidden>
  <div class="sheet__panel">
    <div class="sheet__grab"></div>
    <div class="sheet__head">
      <div>
        <p class="eyebrow">Check availability</p>
        <h2 id="sheetTitle">Book this journey</h2>
      </div>
      <button class="sheet__close" type="button" id="sheetClose" aria-label="Close">${icons.close}</button>
    </div>
    <form id="bookForm" novalidate>
      <input type="hidden" name="tour" id="bookTour" value="">
      <div class="field">
        <label for="bookTourName">Journey</label>
        <select id="bookTourName" name="tourName">
          ${tours.map(t => `<option value="${esc(t.title)}">${t.num} — ${esc(t.title)}</option>`).join('')}
          <option value="A custom journey">Custom journey</option>
        </select>
      </div>
      <div class="grid-2">
        <div class="field">
          <label for="bookDate">Preferred date</label>
          <input type="date" id="bookDate" name="date">
        </div>
        <div class="field">
          <label for="bookGuests">Travellers</label>
          <select id="bookGuests" name="guests">
            ${[1,2,3,4,5,6].map(n => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n} ${n === 1 ? 'traveller' : 'travellers'}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field">
        <label for="bookPickup">Pickup location</label>
        <input type="text" id="bookPickup" name="pickup" placeholder="Hotel or address in Mostar" autocomplete="off">
      </div>
      <div class="field">
        <label for="bookNote">Anything you'd like to add?</label>
        <textarea id="bookNote" name="note" placeholder="Preferences, questions, things you'd like to see…"></textarea>
      </div>
      <div>
        <p class="form-note" style="margin-bottom:.5rem">This opens WhatsApp with your message ready to send:</p>
        <section class="sheet__preview" id="bookPreview" tabindex="0" aria-live="polite" aria-label="Your booking message"></section>
      </div>
      <button class="btn btn--wa btn--block" type="submit">${icons.wa} Send on WhatsApp</button>
      <p class="form-note">Private tours for up to 6 people · Pickup and drop-off in Mostar · Every tour can be customised</p>
    </form>
  </div>
</div>`;
}

/* ---------- page shell --------------------------------------------------- */
export function page({
  title, description, path, bodyClass = '', jsonld = [], html, ogImage = '/assets/img/og-default.png',
  keywords = '', preloadImage = ''
}) {
  const url = site.origin + path;
  const ld = jsonld.filter(Boolean).map(o =>
    `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ''}
<link rel="canonical" href="${url}">
<link rel="alternate" href="${url}" hreflang="en">
<link rel="alternate" href="${url}" hreflang="x-default">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="theme-color" content="#12301f">
<meta name="format-detection" content="telephone=no">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Merak Tours">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.origin}${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Merak Tours — private tours in Bosnia and Herzegovina">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${site.origin}${ogImage}">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
<link rel="dns-prefetch" href="https://images.unsplash.com">
<link rel="preload" href="/assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
${preloadImage ? `<link rel="preload" as="image" href="${photoUrl(preloadImage, 1440)}" imagesrcset="${WIDTHS.map(w => `${photoUrl(preloadImage, w)} ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">` : ''}
<link rel="stylesheet" href="/assets/css/merak.css">
<noscript><style>.rv,.rv-mask,.hero h1 .l>span,.hero__sub,.hero__cta,.hero__eyebrow,.hero__meta{opacity:1!important;transform:none!important;clip-path:none!important}.routemap .rline{stroke-dashoffset:0!important}.routemap .rdots{opacity:1!important}.wa-float{transform:none}</style></noscript>
${ld}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${header()}
<main id="main">
${html}
</main>
${footer()}
${bookingSheet()}
<script src="/assets/js/merak.js" defer></script>
</body>
</html>`;
}

/* An arch cut between sections — the Stari Most silhouette used as structure. */
export const archDivider = (variant = '') =>
  `<svg class="archdiv ${variant}" viewBox="0 0 1440 74" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 0h1440v30c-232 0-330 44-720 44S232 30 0 30z"/>
  </svg>`;

/* ---------- shared sections ---------------------------------------------- */
export function includedSection() {
  return `
<section class="section" id="included">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Every journey</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>What travelling with us includes — and what it doesn't.</h2>
        <p class="lede">The same terms apply to all four journeys, and to any route we build with you.</p>
      </div>
    </div>
    <div class="ledger">
      <div class="ledger__col rv">
        <h3>Included</h3>
        <ul class="ledger__list ledger--in">
          ${included.map(i => `<li>${icons.check}<span>${esc(i)}</span></li>`).join('')}
        </ul>
      </div>
      <div class="ledger__col rv rv-d1">
        <h3>Not included</h3>
        <ul class="ledger__list ledger--out">
          ${notIncluded.map(i => `<li>${icons.minus}<span>${esc(i)}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

export function ctaSection({
  title = 'Tell us when you\'re coming.',
  text = 'Send a message with your dates and we\'ll come back with availability. Keep a journey exactly as it is, or change it until it fits — either way, the day is built around you.',
  imgKey = 'mostarReflection'
} = {}) {
  return `
<section class="section cta grain">
  <div class="cta__bg">${img(imgKey, { sizes: '100vw', max: 1920 })}</div>
  <div class="wrap">
    <p class="eyebrow on-dark is-center rv">Info &amp; booking</p>
    <h2 class="rv rv-d1 split" data-split>${esc(title)}</h2>
    <p class="rv rv-d2">${esc(text)}</p>
    <div class="cta__btns rv rv-d3">
      <a class="btn btn--wa" href="${waGeneral}" target="_blank" rel="noopener">${icons.wa} ${esc(site.whatsapp.display)}</a>
      <a class="btn btn--light" href="/create-your-journey/">Create your journey</a>
    </div>
  </div>
</section>`;
}

export function faqSection() {
  return `
<section class="section" id="faq" style="background:var(--paper-2)">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Good to know</p>
      <div class="sec-head__row">
        <h2 class="split" data-split>Questions, answered plainly.</h2>
        <p class="lede">Anything else — just ask on WhatsApp. We reply to messages ourselves.</p>
      </div>
    </div>
    <div class="faq rv">
      ${faqs.map((f, i) => `
      <details${i === 0 ? ' open' : ''}>
        <summary>${esc(f.q)}</summary>
        <div><p>${esc(f.a)}</p></div>
      </details>`).join('')}
    </div>
  </div>
</section>`;
}
