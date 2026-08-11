/* =========================================================================
   A contact sheet for choosing the four full-bleed photographs.

   Nothing in this sandbox can load a photograph from the internet, so the
   only honest way to judge one is in the client's own browser. This writes a
   single self-contained page that shows each candidate exactly as the hero
   shows it — same crop, same scrim, same headline over it — so the choice is
   made on what it will actually look like, not on a description.

     node tools/picker.mjs      →  deliver/izbor-slika.html
   ========================================================================= */
import { mkdirSync, writeFileSync } from 'node:fs';

const CDN = 'https://images.unsplash.com/';
const TONE = 'auto=format&fit=crop&q=82&con=7&sat=4&usm=14';
const src = (id, w = 1080) => `${CDN}${id}?${TONE}&w=${w}`;

const SLOTS = [
  {
    key: 'A', place: 'Mostar', word: 'Discover Bosnia.',
    note: 'Prva slika koju svako vidi. Stari most mora biti jasan.',
    shots: [
      { id: 'photo-1504730461252-26343bc973f1', by: 'Faruk Kaymak', px: '6000×4000', lum: .560, now: true, what: 'NOVA — most u rano jutro, prazan, odraz u vodi' },
      { id: 'photo-1544329095-a7c19df83018', by: 'Yu Siang Teo', px: '4032×3024', lum: .491, what: 'Most s obale, kamene kuće i zelenilo' },
      { id: 'photo-1631621554517-a004faddf097', by: 'Đorđe Pandurević', px: '5184×3456', lum: .493, what: 'Rijeka kroz grad, planine okolo' },
      { id: 'photo-1629016727342-a0d2f2973878', by: 'Ilse', px: '4012×2675', lum: .499, what: 'Most nad rijekom, danje svjetlo' },
      { id: 'photo-1569086038412-d20a387dffc1', by: 'Kenneth Sonntag', px: '6000×4000', lum: .474, what: 'Mostar i dolina Neretve s brda' },
      { id: 'photo-1629061998905-35649c5603d6', by: 'mana5280', px: '8014×5343', lum: .422, what: 'Najveća rezolucija od svih' },
      { id: 'photo-1628011032307-29c736b2ce93', by: 'mana5280', px: '4032×3024', lum: .470, what: 'Iz zraka — Neretva i stari grad' },
      { id: 'photo-1615634428097-c9de2f603798', by: 'Omer Nezih Gerek', px: '4903×3262', lum: .436, what: 'Uz rijeku, danje svjetlo' },
      { id: 'photo-1535627565086-13f55c100c0d', by: 'Anton Sharov', px: '3312×2650', lum: .340, what: 'Odozgo, tamnija' }
    ]
  },
  {
    key: 'B', place: 'Kravice Waterfalls', word: 'Feel the merak.',
    note: 'Ovdje je bio problem. Obje ranije slike bile su USPRAVNE — zato je vodopad ispadao iz kadra.',
    shots: [
      { id: 'photo-1680487927957-661c1bdd90cd', by: 'Sporisevic Photography', px: '4905×2489', lum: .492, now: true, what: 'NOVA — najšira od svih (1.97:1), skoro se ne reže' },
      { id: 'photo-1716968921728-dcab243c9482', by: 'Christian Lue', px: '6000×2515', lum: .373, what: 'Panorama 2.39:1, tamnija' },
      { id: 'photo-1692563318127-49c18bbfc31d', by: 'Mujo Hasanovic', px: '3406×2718', lum: .490, what: 'Pogled s ulaza' },
      { id: 'photo-1677560691918-762bf76472b4', by: 'Jo Barnes', px: '4032×3024', lum: .482, what: 'Ima ljudi koji se kupaju' },
      { id: 'photo-1592494338349-60526052bbbf', by: 'Carolina Fuzinato', px: '3520×1980', lum: .413, what: 'Široka, zelenilo uz vodu' },
      { id: 'photo-1757759170092-bb9d6ff5bc4f', by: 'Stanisław Lul', px: '3872×2592', lum: .442, old: true, what: 'Prva verzija — vodoravna, ali tamna' }
    ]
  },
  {
    key: 'C', place: 'Sarajevo', word: 'Discover Bosnia.',
    note: 'Treba da se odmah prepozna da je Sarajevo.',
    shots: [
      { id: 'photo-1683764681443-c85ff83109b4', by: 'Hongbin', px: '6960×4640', lum: .539, now: true, what: 'Baščaršija — jedina s izričitom oznakom Baščaršije' },
      { id: 'photo-1680220700316-41ec6aa2f805', by: 'Sporisevic Photography', px: '5184×3456', lum: .514, what: 'Pogled na grad' },
      { id: 'photo-1678322326249-120d92ad176e', by: 'Sporisevic Photography', px: '4308×3456', lum: .514, what: 'Vijećnica' },
      { id: 'photo-1763787002975-5aefe199191b', by: 'Sporisevic Photography', px: '5184×3456', lum: .423, what: 'Krovovi grada' },
      { id: 'photo-1636041417222-1305988d38a0', by: 'Lothar Boris Piltz', px: '4928×3264', lum: .452, what: 'Golubovi na trgu, munara iza' },
      { id: 'photo-1722597025874-04b833bc5cf0', by: 'Sarajevo slike', px: '4000×1868', lum: .396, what: 'Vrlo široka (2.14:1), kupola i krovovi' },
      { id: 'photo-1570831709673-03320e9d734f', by: 'ADEV', px: '7296×5472', lum: .427, what: 'Ulica u starom gradu' }
    ]
  },
  {
    key: 'D', place: 'Blagaj', word: 'Feel the merak.',
    note: 'Tekija ispod stijene, na vrelu Bune.',
    shots: [
      { id: 'photo-1652287350277-db5ba07dfd46', by: 'Mujo Hasanovic', px: '4000×3000', lum: .458, now: true, what: 'Tekija i vrelo Bune zajedno' },
      { id: 'photo-1772664507853-456c9d47f024', by: 'Fatih Beki', px: '6240×4160', lum: .420, what: 'Rijeka u prvom planu, kuće pod stijenom' },
      { id: 'photo-1772664452127-7795551e9cc3', by: 'Fatih Beki', px: '6240×4160', lum: .385, what: 'Cvijeće u prvom planu, most iza' },
      { id: 'photo-1772664513700-4fe6a4d1923d', by: 'Fatih Beki', px: '6240×4160', lum: .379, what: 'Objekti uklopljeni u stijenu' },
      { id: 'photo-1772664587058-4bc625e12315', by: 'Fatih Beki', px: '6240×4160', lum: .333, what: 'Sumrak — lijepo, ali tamnije' },
      { id: 'photo-1626729028670-42ff0f142607', by: 'Miguel Alcântara', px: '5412×3608', lum: .295, what: 'Bijela kuća uz rijeku, najtamnija' }
    ]
  }
];

const card = (s, slot, n) => `
<figure class="c${s.old ? ' c--old' : ''}${s.now ? ' c--now' : ''}">
  <div class="frame">
    <img loading="lazy" src="${src(s.id)}" srcset="${src(s.id, 768)} 768w, ${src(s.id, 1080)} 1080w, ${src(s.id, 1440)} 1440w" sizes="100vw" alt="">
    <div class="scrim"></div>
    <div class="type">
      <p class="eyebrow">— ${slot.place} · Bosnia and Herzegovina</p>
      <h2>${slot.word}</h2>
      <p class="sub">Private journeys through Bosnia and Herzegovina — its culture, its nature, its stories.</p>
    </div>
    <span class="num">${slot.key}${n}</span>
    ${s.now ? '<span class="flag">na stranici sada</span>' : ''}
    ${s.old ? '<span class="flag flag--old">bila prije</span>' : ''}
  </div>
  <figcaption><b>${slot.key}${n}</b> ${s.what} <i>— ${s.by} · ${s.px} · svjetlina ${s.lum}</i></figcaption>
</figure>`;

const html = `<!doctype html>
<html lang="bs"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Merak Tours — izbor slika za naslovnu</title>
<style>
  :root { --paper:#f8f4ed; --ink:#12211a; }
  * { box-sizing: border-box; }
  body { margin:0; background:#0d1512; color:var(--paper);
         font:400 16px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
  header { padding:1.6rem 1.1rem 1rem; border-bottom:1px solid rgba(255,255,255,.12); }
  h1 { font-size:1.25rem; margin:0 0 .5rem; letter-spacing:-.01em; }
  header p { margin:.4rem 0 0; color:rgba(255,255,255,.72); font-size:.92rem; max-width:44rem; }
  .bar { position:sticky; top:0; z-index:9; display:flex; gap:.5rem; padding:.7rem 1.1rem;
         background:rgba(13,21,18,.94); backdrop-filter:blur(8px);
         border-bottom:1px solid rgba(255,255,255,.12); }
  .bar button { flex:1; padding:.6rem; border-radius:99px; border:1px solid rgba(255,255,255,.28);
                background:transparent; color:var(--paper); font:inherit; font-size:.86rem; cursor:pointer; }
  .bar button[aria-pressed="true"] { background:var(--paper); color:#0d1512; border-color:var(--paper); }
  section { padding:1.7rem 0 .6rem; }
  .head { padding:0 1.1rem 1rem; }
  .head h2 { font-size:1.05rem; margin:0; }
  .head p { margin:.3rem 0 0; color:rgba(255,255,255,.66); font-size:.88rem; }
  .c { margin:0 0 1.6rem; }
  .frame { position:relative; aspect-ratio:390/720; overflow:hidden; background:#16241d; }
  .frame img { width:100%; height:100%; object-fit:cover; display:block; }
  .scrim { position:absolute; inset:0; pointer-events:none;
    background:
      linear-gradient(to bottom, rgba(6,16,12,.5) 0%, rgba(6,16,12,.19) 13%, rgba(6,16,12,0) 30%),
      linear-gradient(to top, rgba(6,16,12,.42) 0%, rgba(6,16,12,.2) 16%, rgba(6,16,12,.05) 32%, rgba(6,16,12,0) 46%); }
  .type { position:absolute; left:0; right:0; bottom:0; padding:5rem 1.2rem 1.4rem;
    background:linear-gradient(to top, rgba(6,16,12,.86) 0%, rgba(6,16,12,.78) 26%, rgba(6,16,12,.6) 52%, rgba(6,16,12,.3) 78%, rgba(6,16,12,0) 100%);
    text-shadow:0 1px 2px rgba(4,12,9,.34), 0 10px 34px rgba(4,12,9,.3); }
  .type h2 { font-family:Georgia,"Times New Roman",serif; font-weight:400; font-size:2.1rem;
             line-height:1.02; margin:.35rem 0 .5rem; letter-spacing:-.02em; }
  .type .eyebrow { margin:0; font-size:.66rem; letter-spacing:.16em; text-transform:uppercase; color:#bcd6dd; }
  .type .sub { margin:0; font-size:.85rem; color:rgba(255,255,255,.86); max-width:26rem; }
  .num { position:absolute; top:.7rem; left:.7rem; background:var(--paper); color:#0d1512;
         font-weight:700; font-size:.9rem; padding:.28rem .6rem; border-radius:.35rem; letter-spacing:.02em; }
  .flag { position:absolute; top:.7rem; right:.7rem; background:#2f6a4f; color:#fff;
          font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; padding:.3rem .55rem; border-radius:.3rem; }
  .flag--old { background:#8a3b2a; }
  figcaption { padding:.55rem 1.1rem 0; font-size:.86rem; color:rgba(255,255,255,.78); }
  figcaption b { color:var(--paper); }
  figcaption i { color:rgba(255,255,255,.5); font-style:normal; }
  .c--old .frame { filter:saturate(.6); }
  body.bare .scrim, body.bare .type { display:none; }
  footer { padding:2rem 1.1rem 3rem; border-top:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.7); font-size:.9rem; }
  footer b { color:var(--paper); }
  @media (min-width:760px) {
    .frame { aspect-ratio:16/9; }
    .type { padding:6rem 2.4rem 2rem; max-width:70%;
      -webkit-mask-image:linear-gradient(to right,#000 0 46%,rgba(0,0,0,.25) 74%,transparent 92%);
      mask-image:linear-gradient(to right,#000 0 46%,rgba(0,0,0,.25) 74%,transparent 92%); }
    .type h2 { font-size:3rem; }
    .c { margin-bottom:2.4rem; }
  }
</style>
</head><body>
<header>
  <h1>Izbor slika za naslovnu — Merak Tours</h1>
  <p>Svaka slika je prikazana <b>tačno kako će izgledati na stranici</b>: isti izrez, isto zatamnjenje, isti tekst preko nje. <b>Sve su vodoravne</b> — uspravne sam izbacio jer se u širokom kadru odreže glavni motiv, i to je bio uzrok problema s Kravicama. Prođi kroz sve i javi mi samo oznake — npr. <b>A2, B1, C3, D1</b>. Dugme gore prebacuje na čistu sliku bez teksta.</p>
</header>
<div class="bar">
  <button type="button" data-mode="hero" aria-pressed="true">Kako izgleda na stranici</button>
  <button type="button" data-mode="bare" aria-pressed="false">Čista slika</button>
</div>
${SLOTS.map(slot => `
<section>
  <div class="head">
    <h2>${slot.key} · ${slot.place}</h2>
    <p>${slot.note}</p>
  </div>
  ${slot.shots.map((s, i) => card(s, slot, i + 1)).join('')}
</section>`).join('')}
<footer>
  <p>Sve slike su s Unsplasha (besplatne za komercijalnu upotrebu) i svaka je potvrđena da je zaista to mjesto. Autori se navode na stranici <b>/credits/</b>.</p>
  <p>Ako ti nijedna ne valja za neko mjesto — pošalji svoju fotografiju. Tvoje slike su uvijek bolje od stock fotografija, a Fortica je već tvoja.</p>
</footer>
<script>
  var bs = document.querySelectorAll('.bar button');
  bs.forEach(function (b) {
    b.addEventListener('click', function () {
      document.body.classList.toggle('bare', b.dataset.mode === 'bare');
      bs.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
    });
  });
</script>
</body></html>`;

mkdirSync('deliver', { recursive: true });
writeFileSync('deliver/izbor-slika.html', html);
const n = SLOTS.reduce((a, s) => a + s.shots.length, 0);
console.log(`deliver/izbor-slika.html — ${n} candidates across ${SLOTS.length} slots`);
