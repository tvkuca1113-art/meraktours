# Implementation delivery

The existing Merak Tours project has been extended in its original static
architecture. Branch: `merak-kayaks-multilingual`.

Implemented: two-category home hierarchy, prominent kayaking navigation and
information page, four preserved private-tour details, localized tour overview,
custom-tour/about/contact pages, five-language navigation/content/forms/metadata,
accessible gallery, readable itinerary/map, two-step WhatsApp preparation,
privacy-safe sharing/optional device storage, deterministic suggestions, SEO and
controlled analytics adapter. No fictitious booking or received-lead state exists.

The kayaking model/detail is a draft, not an available product. No unconfirmed
location is in its title, map, metadata or schema. No kayak capacity is borrowed
from the six-person private-tour limit. No tour combination is promised or
automatically charged. Generic combination interest goes through the custom-tour
path; tour-specific additions remain disabled until approved.

The old URLs, including all four tour URLs, have exact permanent redirects in
both local preview and Vercel configuration. Full map: `route-map.json`.

## Configuration and maintenance

- Facts/contact/product states: `src/catalog.mjs`.
- Five localized drafts and form validation messages: `src/i18n.mjs`.
- Slugs and language correspondence: `src/routes.mjs`.
- Sources/rights/localized alt/focal points: `media-manifest.json`.
- Update example and commands: repository README.
- Events, consent/integration status, Search Console/GBP steps and three future
  guide topics/test hypotheses: `MEASUREMENT-AND-SEO.md`.
- Executed tests and explicit omissions: `TEST-REPORT.md`, `qa-evidence.json`.
- Owner facts and approvals: `OWNER_INPUT_REQUIRED.md`.

## Functional versus blocked

The site builds and is navigable; its WhatsApp preparation and actual phone
contact work without an account, marketing cookies or a backend. The user still
needs to send the prepared WhatsApp message. Date/group validation runs in the
browser because no server accepts a web enquiry. No sensitive initial fields are
collected. Dates use Europe/Sarajevo.

A web-form backend, provider analytics/consent UI, live availability, payment,
booking confirmation and operational revenue reporting are not connected. Those
features are not simulated. The analytics adapter is disabled and generates no
lead event.

Public release is deliberately blocked by unconfirmed kayak operating facts,
photograph rights, legal/company details and final language approval, according
to the supplied brief. Production stays on its existing version. The review is
noindex and must keep the existing Vercel access protection. The hosted review excludes the unapproved Instagram photograph. Its local
owner-review copy is ignored by Git; the hosted layout uses a labelled neutral
media panel until rights are confirmed. Normal builds do not use expiring Instagram URLs.

## Production follow-up

Provide the owner facts/rights in `OWNER_INPUT_REQUIRED.md`, apply approved
product copy, public prices and rules, approve the media manifest and language
records, then rerun checks and the release gate. Connect only services actually
needed. Review public robots/indexability, deep routes and sitemap on the final
production build before promoting it to the existing domain.

## Recovered delivery

The interrupted handoff was recovered on 2 November 2026. The exact source tree
was synchronized to GitHub, built successfully by Vercel and verified via HTTP
and the cloud browser at:

https://meraktours-lswnvzqh7-eminjasarevic1-4306s-projects.vercel.app/bs/

The preview uses the existing Vercel project and its access settings. Production
remains unchanged. Hosted browser checks confirmed the kayaking enquiry summary
for three people with transfer interest and BS → DE language switching preserving
those non-sensitive choices. No WhatsApp message was sent. A fresh build without
unapproved kayak media passed 10 tests, HTML validation and 3,075 local references.
