/* =========================================================================
   MERAK TOURS — the atlas
   A printed travel map, drawn at build time and animated in the browser.

   Everything here is real geography: the coastline and borders are Natural
   Earth outlines, the rivers are their real courses, every town sits at its
   true latitude and longitude, and the road up the Neretva valley follows
   the river because the road does. No terrain, no relief — a map, the way
   an atlas draws one.
   ========================================================================= */
import { readFileSync } from 'node:fs';

const outline = JSON.parse(readFileSync(new URL('./assets/js/bih-outline.json', import.meta.url)));
const geo = JSON.parse(readFileSync(new URL('./assets/js/bih-geo.json', import.meta.url)));
const world = JSON.parse(readFileSync(new URL('../geo/ne_50m_countries.json', import.meta.url)));

export const PLACES = {
  mostar:    { name: 'Mostar',    lat: 43.3438, lon: 17.8078 },
  fortica:   { name: 'Fortica',   lat: 43.3480, lon: 17.8330 },
  blagaj:    { name: 'Blagaj',    lat: 43.2569, lon: 17.8917 },
  pocitelj:  { name: 'Počitelj',  lat: 43.1300, lon: 17.7397 },
  kravice:   { name: 'Kravice',   lat: 43.1553, lon: 17.6106 },
  jablanica: { name: 'Jablanica', lat: 43.6597, lon: 17.7614 },
  sarajevo:  { name: 'Sarajevo',  lat: 43.8563, lon: 18.4131 }
};

/* Real towns and passes the road runs through, for the legs that do not
   follow the river. Nothing here is an invented waypoint. */
const VIA = {
  'jablanica>sarajevo': [[17.9614, 43.6528], [18.0369, 43.7503], [18.2000, 43.8228]], // Konjic, Ivan Sedlo, Hadžići
  'sarajevo>jablanica': [[18.2000, 43.8228], [18.0369, 43.7503], [17.9614, 43.6528]],
  'pocitelj>kravice':   [[17.6889, 43.1075]],                                          // Čapljina
  'kravice>pocitelj':   [[17.6889, 43.1075]],
  'mostar>blagaj':      [[17.8564, 43.2519]],                                          // Buna
  'blagaj>mostar':      [[17.8564, 43.2519]]
};

/* Smaller towns the map names, because a map with four names on it is a
   diagram rather than a map. All real, all at their real coordinates. */
const MINOR = [
  ['Konjic',        17.9614, 43.6528,  10,   4, 'start'],
  ['Čapljina',      17.6889, 43.1075, -10,  -7, 'end'],
  ['Stolac',        17.9583, 43.0847,  10,   4, 'start'],
  ['Široki Brijeg', 17.5947, 43.3806, -10,   4, 'end'],
  ['Ljubuški',      17.5461, 43.1972, -10,  -7, 'end'],
  ['Neum',          17.6142, 42.9236, -10,   4, 'end'],
  ['Nevesinje',     18.1128, 43.2586,  10,   4, 'start'],
  ['Prozor',        17.6167, 43.8167, -10,   4, 'end'],
  ['Hadžići',       18.2000, 43.8228, -10,   4, 'end']
];

/* ---------- the sheet ---------------------------------------------------- */
const LON0 = 17.02, LON1 = 18.98, LAT0 = 42.80, LAT1 = 44.28;
const K = Math.cos(43.55 * Math.PI / 180);
const S = 640;                                   // sheet units per degree of latitude
export const W = Math.round((LON1 - LON0) * K * S);
export const H = Math.round((LAT1 - LAT0) * S);
export const KM_PER_UNIT = 111.32 / S;           // for the scale bar

const X = (lon) => (lon - LON0) * K * S;
const Y = (lat) => (LAT1 - lat) * S;
const n = (v) => Math.round(v * 10) / 10;
export const at = (key) => ({ x: n(X(PLACES[key].lon)), y: n(Y(PLACES[key].lat)) });

const ring = (pts, close) => pts.map(([lon, lat], i) =>
  `${i ? 'L' : 'M'}${n(X(lon))} ${n(Y(lat))}`).join('') + (close ? 'Z' : '');

/* Sutherland–Hodgman: trim a country to the edge of the sheet, so no path
   carries thousands of points that will never be seen. */
const MG = 0.05;
function clipRing(pts) {
  const edges = [
    { v: LON0 - MG, axis: 0, keep: (p) => p[0] >= LON0 - MG },
    { v: LON1 + MG, axis: 0, keep: (p) => p[0] <= LON1 + MG },
    { v: LAT0 - MG, axis: 1, keep: (p) => p[1] >= LAT0 - MG },
    { v: LAT1 + MG, axis: 1, keep: (p) => p[1] <= LAT1 + MG }
  ];
  let out = pts;
  for (const e of edges) {
    const src = out; out = [];
    for (let i = 0; i < src.length; i++) {
      const cur = src[i], prev = src[(i + src.length - 1) % src.length];
      const ci = e.keep(cur), pi = e.keep(prev);
      if (ci !== pi) {
        const t = (e.v - prev[e.axis]) / ((cur[e.axis] - prev[e.axis]) || 1e-12);
        const q = [0, 0];
        q[e.axis] = e.v;
        q[1 - e.axis] = prev[1 - e.axis] + t * (cur[1 - e.axis] - prev[1 - e.axis]);
        out.push(q);
      }
      if (ci) out.push(cur);
    }
    if (!out.length) return [];
  }
  return out;
}

/* Douglas–Peucker: at this scale a coastline needs far fewer points than
   Natural Earth ships, and every point removed is bytes off the page. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-9;
    let worst = 0, wi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len;
      if (d > worst) { worst = d; wi = i; }
    }
    if (worst > tol && wi > 0) { keep[wi] = 1; stack.push([a, wi], [wi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/* Catmull-Rom through the points, written out as cubics — a road on a map is
   never a sequence of straight segments. */
function smooth(pts) {
  if (pts.length < 2) return '';
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)},` +
         `${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)},` +
         `${n(p2[0])} ${n(p2[1])}`;
  }
  return d;
}

/* ---------- land around Bosnia, so the Adriatic has a coast -------------- */
const NEIGHBOURS = ['Croatia', 'Montenegro', 'Serbia', 'Albania'];
const neighRings = [];
world.features.forEach((f) => {
  const nm = f.properties.NAME || f.properties.name || f.properties.ADMIN;
  if (!NEIGHBOURS.includes(nm)) return;
  const g = f.geometry;
  (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).forEach((poly) => neighRings.push(poly[0]));
});

/* ---------- the Neretva, which most of the driving follows ---------------- */
const neretva = (geo.rivers.find(r => r.n === 'Neretva' && r.c.length > 40) || { c: [] }).c;
function nearestOnNeretva(lon, lat) {
  let best = -1, bd = 1e9;
  for (let i = 0; i < neretva.length; i++) {
    const dx = (neretva[i][0] - lon) * K, dy = neretva[i][1] - lat;
    const d = dx * dx + dy * dy;
    if (d < bd) { bd = d; best = i; }
  }
  return { i: best, d: Math.sqrt(bd) };
}

function legPoints(ka, kb) {
  const a = PLACES[ka], b = PLACES[kb];
  const na = nearestOnNeretva(a.lon, a.lat), nb = nearestOnNeretva(b.lon, b.lat);
  let mid = [];
  if (na.d < .09 && nb.d < .09 && Math.abs(na.i - nb.i) > 1) {
    const step = na.i < nb.i ? 1 : -1;
    for (let i = na.i + step; i !== nb.i; i += step) mid.push(neretva[i]);
  } else {
    mid = (VIA[ka + '>' + kb] || []).slice();
  }
  return [[a.lon, a.lat]].concat(mid, [[b.lon, b.lat]]);
}

/* a route as one smooth path, where each node falls on it, and the frame the
   sheet should settle into when this route is chosen */
export function routePath(nodes) {
  const pts = [];
  const nodeIdx = [0];
  for (let i = 0; i < nodes.length - 1; i++) {
    const leg = legPoints(nodes[i], nodes[i + 1]);
    leg.forEach((p, j) => { if (i === 0 || j > 0) pts.push(p); });
    nodeIdx.push(pts.length - 1);
  }
  /* the way home retraces the way out, so nudge it sideways — two lines you
     can tell apart, the way a map draws a there-and-back */
  const seen = new Map();
  const xy = pts.map(([lon, lat]) => [X(lon), Y(lat)]);
  for (let i = 0; i < xy.length; i++) {
    const key = Math.round(xy[i][0] / 7) + ':' + Math.round(xy[i][1] / 7);
    if (seen.has(key)) {
      const a = xy[Math.max(0, i - 1)], b = xy[Math.min(xy.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      xy[i] = [xy[i][0] - dy / L * 5, xy[i][1] + dx / L * 5];
    } else seen.set(key, i);
  }
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  xy.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  /* the dotted preview only has to suggest the shape, so it gets far fewer
     points than the line that draws itself */
  const hint = simplify(xy, 3.5);
  return {
    d: smooth(xy),
    hint: hint.map((p, i) => (i ? 'L' : 'M') + n(p[0]) + ' ' + n(p[1])).join(''),
    nodes: nodeIdx.map(i => ({ x: n(xy[i][0]), y: n(xy[i][1]) })),
    box: { x: n(x0), y: n(y0), w: n(x1 - x0), h: n(y1 - y0) }
  };
}

/* ---------- the printed sheet -------------------------------------------- */
export function atlasSvg({ id = 'atlas', routes = [], minimal = false, bare = false, coarse = false } = {}) {
  const land = bare ? '' : neighRings.map(clipRing).filter(r => r.length > 2)
    .map(r => simplify(r, .0035)).filter(r => r.length > 2).map(r => ring(r, true)).join('');
  const bih = ring(simplify(clipRing(outline), .0025), true);
  const onSheet = ([lon, lat]) => lon > LON0 - .3 && lon < LON1 + .3 && lat > LAT0 - .3 && lat < LAT1 + .3;
  const rivers = geo.rivers
    .filter(r => !bare || r.n === 'Neretva')
    .map(r => ({ n: r.n, c: r.c.filter(onSheet) }))
    .map(r => ({ n: r.n, c: simplify(r.c, .0055) }))
    .filter(r => r.c.length > 4)
    .map(r => ({ n: r.n, d: smooth(r.c.map(([lon, lat]) => [X(lon), Y(lat)])) }));

  /* a faint graticule, every quarter degree */
  let grat = '';
  if (!minimal && !bare) {
    for (let lon = Math.ceil(LON0 * 4) / 4; lon < LON1; lon += .25) grat += `M${n(X(lon))} 0V${H}`;
    for (let lat = Math.ceil(LAT0 * 4) / 4; lat < LAT1; lat += .25) grat += `M0 ${n(Y(lat))}H${W}`;
  }

  /* every label sits in a group that the client scales back down, so type
     stays type when the sheet settles onto a route */
  const minor = minimal ? '' : MINOR.map(([nm, lon, lat, dx, dy, anchor]) => `
    <g class="atlas__minor" transform="translate(${n(X(lon))} ${n(Y(lat))})"><g data-ctr="1">
      <circle cx="0" cy="0" r="2.3"/>
      <text x="${dx}" y="${dy}" text-anchor="${anchor}">${nm}</text>
    </g></g>`).join('');

  const head = (elId, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" class="atlas${extra}" id="${elId}" viewBox="0 0 ${W} ${H}"
     preserveAspectRatio="xMidYMid slice"`;

  return `
${head(id)} role="img" aria-label="Map of Herzegovina and central Bosnia showing the journeys out of Mostar">
  <defs>
    <clipPath id="${id}-clip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>
    <filter id="${id}-lift" x="-6%" y="-6%" width="112%" height="112%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#4a5148" flood-opacity=".14"/>
    </filter>
  </defs>
  <g clip-path="url(#${id}-clip)">
    <rect class="atlas__sea" x="0" y="0" width="${W}" height="${H}"/>
    <g class="atlas__view" data-view="1">
      ${land ? `<path class="atlas__land" d="${land}"/>` : ''}
      <path class="atlas__home" d="${bih}"${bare ? '' : ` filter="url(#${id}-lift)"`}/>
      <path class="atlas__border" d="${bih}" vector-effect="non-scaling-stroke"/>
      ${grat ? `<path class="atlas__grat" d="${grat}" vector-effect="non-scaling-stroke"/>` : ''}
      <g class="atlas__water">
        ${rivers.map(r => `<path class="atlas__river${r.n === 'Neretva' ? ' is-main' : ''}" d="${r.d}" vector-effect="non-scaling-stroke"/>`).join('')}
      </g>
      ${minimal ? '' : `
      <g class="atlas__notes" aria-hidden="true">
        <g transform="translate(${n(X(17.30))} ${n(Y(42.96))}) rotate(-40)"><g data-ctr="1"><text class="atlas__sealabel">Adriatic Sea</text></g></g>
        <g transform="translate(${n(X(17.10))} ${n(Y(43.66))})"><g data-ctr="1"><text class="atlas__country">Croatia</text></g></g>
        <g transform="translate(${n(X(18.56))} ${n(Y(42.90))})"><g data-ctr="1"><text class="atlas__country">Montenegro</text></g></g>
      </g>
      <g class="atlas__minors" aria-hidden="true">${minor}</g>`}
    </g>
  </g>
</svg>
<!-- Only this layer changes while you scroll, so the printed sheet above is
     never repainted. -->
${head(id + 'Live', ' atlas--live')} aria-hidden="true">
  <g clip-path="url(#${id}-clip)">
    <g class="atlas__view" data-live-view="1">
      <g class="atlas__routes">
        <!-- the ghost is the same road, drawn faintly ahead of the traveller.
             It used to be a simplified polyline, which wandered off the drawn
             line and read as a second, wrong route. -->
        ${routes.map((r, i) => `<path class="atlas__ghost" data-ghost="${i}" d="${r.d}" vector-effect="non-scaling-stroke"/>`).join('')}
        ${routes.map((r, i) => `<path class="atlas__route${i ? '' : ' is-on'}" data-route="${i}" d="${r.d}" pathLength="1000"/>`).join('')}
      </g>
    </g>
    <g class="atlas__marks" data-marks="1"></g>
    ${minimal ? '' : `
    <g class="atlas__rose" data-rose="1"><path class="atlas__roseNeedle" d="M0 -16 L4.4 5 L0 1.4 L-4.4 5 Z"/><text class="atlas__roseN" y="-21" text-anchor="middle">N</text></g>
    <g class="atlas__scale" data-scale="1"><path class="atlas__scaleBar" data-scalebar="1" d="M0 0 H80"/><text class="atlas__scaleLabel" data-scalelabel="1" x="0" y="-8">20 km</text></g>`}
  </g>
</svg>`;
}

export const LABEL_OFFSETS = {
  mostar:    [0, -17, 'middle'],
  fortica:   [15, 6, 'start'],
  blagaj:    [14, 15, 'start'],
  pocitelj:  [14, 14, 'start'],
  kravice:   [-14, 14, 'end'],
  jablanica: [-15, 5, 'end'],
  sarajevo:  [0, -17, 'middle']
};
