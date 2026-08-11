# Merak Tours

Website for **Merak Tours** — private and small-group tours of Bosnia and
Herzegovina, based in Mostar.

A static site with no framework. Every page is generated from one content file,
so a fact only ever has to be corrected in one place. The output is plain
HTML, CSS and 7 KB of JavaScript, and can be hosted anywhere.

---

## Running it (Windows CMD)

You need **Node.js 20 or newer** — <https://nodejs.org> (LTS installer).
Check it's there:

```
node -v
```

Then, from the project folder:

```
cd C:\path\to\merak-tours
npm install
npm run build
npm start
```

`npm start` prints a link — open <http://localhost:3000> in the browser.

While you work: leave `npm start` running in one window, run `npm run build`
in a second window after each change, then refresh the page. Or use
`npm run dev`, which builds and serves in one go.

`Ctrl + C` stops the server.

| Command | What it does |
|---|---|
| `npm install` | downloads the dependencies (once) |
| `npm run build` | renders the site into `dist\` |
| `npm start` | serves `dist\` at localhost:3000 |
| `npm run dev` | build, then serve |
| `npm test` | booking flow, journey, phone story, internal links |
| `npm run audit` | accessibility, HTML validation, Lighthouse |
| `npm run shots` | screenshots of the journey while it scrolls |

The checks under `tools\` drive a real browser. `npm install` fetches one for
them; if it fails behind a firewall, run `npx playwright install chromium`, or
point at a Chrome you already have:

```
set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
npm test
```

---

## Putting it on the internet

`dist\` is a plain folder of files. Any static host will serve it.

**Vercel** (`vercel.json` is already configured — build `node build.mjs`,
output `dist`):

```
npm i -g vercel
vercel
vercel --prod
```

**Netlify:** drag the `dist` folder onto <https://app.netlify.com/drop>, or
connect the repository with build command `node build.mjs` and publish
directory `dist`.

**Anything else** (cPanel, shared hosting, GitHub Pages): upload the *contents*
of `dist\` so that `index.html` sits at the root of the domain.

### Pushing it to GitHub

```
git init
git add .
git commit -m "Merak Tours website"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/merak-tours.git
git push -u origin main
```

`node_modules\` and `dist\` are ignored on purpose — the host rebuilds them.

### The domain

Canonical URLs, the sitemap and the Open Graph tags all follow `site.origin`
in `src/data.mjs`. On Vercel the production URL is picked up automatically.
When the real domain is live, build with it:

```
set SITE_ORIGIN=https://yourdomain.ba
npm run build
```

Then submit `/sitemap.xml` in Google Search Console.

---

## Where the content lives

`src/data.mjs` is the single source of truth: the four journeys and their
itineraries, durations, highlights, what is and isn't included, the FAQ, the
brand lines and the photo credits.

**Every business fact in it comes from the official Instagram account
(@bosnia.merak.tours).** Nothing is invented — there are no prices, reviews,
ratings, awards, statistics or policies anywhere on the site, because none were
provided. If you want any, add them there.

Two places where the Instagram source contradicts itself, and what the site does:

| Where | Instagram says | Site shows |
|---|---|---|
| Tour 04, Blagaj | timeline graphic: `11:30 – 14:50 (4h 20min)` — but 11:30 + 4h20 = 15:50, and the caption says the tour leaves Blagaj at 16:00 | `11:30 – 16:00`, which matches the caption and the 16:30 arrival |
| Tour 03, Jablanica | `09:40 – 10:30`, labelled `1 hour 10 min` — the times are 50 minutes apart | the times only, without a duration label |

Change these in `src/data.mjs` if the intended times are different.

## Structure

```
build.mjs           renders the pages, subsets the fonts, draws the OG images
                    and icons, writes the sitemap and manifest

src/data.mjs        all content, all photo credits
src/templates.mjs   page shell, header, footer, booking sheet, <head> and SEO
src/pages.mjs       home, tour pages, custom journey, credits, 404
src/atlas.mjs       draws the map sheet from real coordinates at build time
src/assets/css      two hand-written stylesheets, mobile first
src/assets/js       one interaction file, no libraries
src/assets/photos   your own photographs, at four widths each

geo/                Natural Earth country outlines, used to draw the map
vendor-fonts/       Fraunces and Inter, cached so the build works offline
tools/              the local checks: test, audit, shots, perf, motion, look
```

Nothing is downloaded at build time except the two fonts the first time, and
those are cached in `vendor-fonts/` and committed, so the build runs offline.

## The map

The journey map is an SVG drawn at build time from real coordinates — the
border, the Neretva, the towns and the roads between the stops. Nothing is
invented and nothing is rendered in 3D. Scrolling draws the route and moves the
van; the phone version stacks the map above the story and holds at each stop
while you read it.

To change a route, edit the itinerary in `src/data.mjs`. Intermediate
waypoints (Konjic, Ivan Sedlo, Čapljina, Buna) live in `VIA` at the top of
`src/atlas.mjs`.

## Booking

Every call to action opens WhatsApp on **+387 63 822 083** with the message
already written: tour, date, number of travellers, pickup location and notes.
The number is in `src/data.mjs` → `site.whatsapp`.

## Photography

Most photographs are Unsplash-licensed (free for commercial use) and each one
was checked against its Unsplash page so the location is right. Credits are
published at `/credits/`.

**Replace them with your own as you go** — real photographs from your tours
will always convert better. Fortica already uses yours. To add another:

1. Save the photo at four widths — 480, 768, 1080 and 1440 px wide — into
   `src/assets/photos/`, named like `blagaj-480.jpg`, `blagaj-768.jpg` and
   so on.
2. In `src/data.mjs` → `media`, change that entry to
   `{ local: 'blagaj', alt: '…what is in the photo…', by: 'Merak Tours', own: true, place: 'Blagaj' }`.
3. `npm run build`.

The credits page and the `srcset` sort themselves out from there.

## Other languages

The site is in English. `src/data.mjs` → `site.locales` already lists German
and Bosnian with their URL prefixes, and only published locales are advertised
in `hreflang`, so adding a translation means translating the strings and
emitting the pages under `/de/` and `/bs/` — no restructuring needed.

## State

Accessibility and HTML validation clean, Lighthouse 94–98 performance /
100 accessibility / 100 best practices / 100 SEO, and the journey holds 60 fps
on a phone throttled to a quarter speed.
