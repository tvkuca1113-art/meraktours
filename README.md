# Merak Tours

A multilingual, static website for the existing Merak Tours project. The original
Node/esbuild architecture, local Fraunces/Inter fonts, brand mark, four tours,
contact and real route map are retained. There is no framework migration.

## Run

```sh
npm ci --ignore-scripts
npm run build
npm start
npm run lint
npm test
```

Node 20+; production remains on the original Vercel project. The feature branch
is `merak-kayaks-multilingual`. A preview build is deliberately noindex. A
production build is blocked until the business/content/media release is approved.
Do not bypass this gate just to publish an incomplete kayaking offer.

`npm run qa:preview` adds local-only QA frames to the built output, to use with
an existing browser. `/__qa/?width=390&height=844&path=%2Fbs%2F` renders an actual
390 CSS-pixel document, reads overflow/CTA geometry and runs axe-core. It does not
emulate a phone's hardware/network. QA files must not be deployed.

The older screenshot/Lighthouse tools are historical and launch a separate
browser; they were not used for this review. Current browser QA uses the selected
cloud browser. No Lighthouse score or field Core Web Vitals result is claimed.

## Source of truth

| File | Responsibility |
| --- | --- |
| src/data.mjs | Original tour/source records and brand/contact provenance |
| src/catalog.mjs | Product IDs, shared facts, business settings, null/draft states |
| src/i18n.mjs | Complete editorial drafts in BS, EN, DE, IT, ES |
| src/routes.mjs | Localized slugs and exact old-URL redirects |
| src/templates.mjs | Shared HTML, enquiry form, header/footer, gallery, SEO |
| src/pages.mjs | Home, kayaking, tours, details, custom, about, contact, info |
| src/enquiry.mjs | Date/group validation, privacy-safe URL state, message builder |
| src/assets/js/merak.js | Progressive interactions; no runtime libraries |
| src/assets/css/merak.css | Responsive design system and reduced-motion styles |
| docs/media-manifest.json | Photo source, owner/rights status, focus, localized alt |
| docs/OWNER_INPUT_REQUIRED.md | Facts and approvals that still block release |
| docs/MEASUREMENT-AND-SEO.md | SEO map strategy, events, consent, next steps |
| docs/TEST-REPORT.md | Actual tests, evidence and limitations |

## Updating an existing offer

For example, to update Tour 01:

1. Find `tour-01` in `src/catalog.mjs`. Update confirmed shared facts there.
2. Update the five localized titles/leads if the experience changed.
3. Change routes only in `src/routes.mjs`, preserving old URLs with redirects.
4. Prices stay null until confirmed. A future numeric price must include its unit
   and billing currency; never treat it as per-person unless the operator says so.
5. Add only licensed/approved original media. Record rights and actual location in
   the manifest and provide all five alt texts in `photoAlts`.
6. Rebuild, run tests and inspect mobile/desktop before a release.

`tools/prepare-photos.mjs` is a one-time media-preparation helper, not a build-time
network dependency. It requires the `sharp` image processor and uses the existing
licensed sources. Normal builds use the committed, approved local WebP/JPEG derivatives without fetching external images. The
unapproved kayak source and its derivatives are ignored by Git, usable only in
a protected owner review, and unavailable to a fresh checkout until supplied
with permission. Do not add third-party substitute kayak imagery.

## Enquiries and integrations

The first step collects offer, desired/flexible date, group size and relevant
interest. The second prepares an encoded WhatsApp link and a copyable message.
The visitor must send it. Nothing is booked or marked received by this page.
Telephone is the actual alternate contact. No web-form backend, payments or live
availability are configured or simulated. Guide languages are independent from
interface languages; the existing tours list English only.

Analytics is disabled. A provider, reviewed consent UI and approved privacy/legal
information must be connected before optional measurement is activated.

## Delivery

See `docs/DELIVERY.md`. This is an implemented owner-review release, with factual
and legal blockers recorded. The 95/100 target is not presented as an achieved
score, and production is not overwritten while critical blockers remain.
