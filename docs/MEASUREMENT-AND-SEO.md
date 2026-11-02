# Measurement and SEO

## Routing

`src/routes.mjs` is the route map. Stable IDs represent the same product in all
languages. `bs` is the Bosnian language code. Language links preserve the page
ID and allowlisted non-sensitive enquiry choices. No IP redirects are used.
The root permanently redirects to `/bs/`; old English tour URLs permanently
redirect to their matching English product, not the home page.

All pages contain static, crawlable HTML, one H1, localized title and description,
self-canonical and reciprocal hreflang including the same page. `x-default`
points to the corresponding Bosnian page, not indiscriminately to `/bs/`.

See generated `dist/route-manifest.json` and `docs/route-map.json` for exact URLs.
`SITE_ORIGIN` defaults to https://meraktours.vercel.app and must be changed only
when a real domain is configured. Never use the unique preview hostname as the
production canonical origin.

Sitemap contains 50 candidate release URLs: 10 complete page IDs × 5 languages.
Draft kayak detail and the currently incomplete kayak overview/legal pages are
excluded. All owner-preview pages are noindex. Preview robots allows crawling
so noindex can be read; Vercel's existing access protection remains enabled.
A production build is blocked by the owner-release gate; release must verify
that public pages have index, follow and that draft/unfinished pages remain out.

JSON-LD uses Organization, WebSite, BreadcrumbList and Service for the four
private tours. No unverified TravelAgency legal status, address, coordinates,
price, availability, AggregateRating, Review or BookingAction is inserted.
FAQ is plain user content, with no FAQ rich-result promises or markup.

Reference guidance consulted:
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://vercel.com/docs/deployments

## Events

The provider is disabled in `business.analytics`. No analytics script or network
request loads. The first-party adapter in `merak.js` requires both a configured,
policy-approved service and explicit analytics consent before it emits an event.
A reviewed provider can subscribe to `merak:analytics`. Merely setting a boolean
does not install a provider; connecting a real provider and a user-facing consent
interface is a separate integration step. No consent UI is shown while optional
analytics is unavailable. Core content/enquiries work independently.

| Event | Trigger | Meaning |
| --- | --- | --- |
| view_offer | Product/information page view with valid consent | Interest only; once per page |
| hero_kayaks_click | Kayak hero CTA, with consent | Navigation interest; once per page |
| enquiry_start | First form edit or valid review step, with consent | An enquiry is being prepared; once per offer |
| whatsapp_open | Actual prepared-message link click, with consent | WhatsApp opened; duplicate clicks throttled |
| generate_lead | Reserved; not emitted | Only a future backend-accepted enquiry |
| booking_confirmed / revenue | Reserved; not emitted | Only reliable operator records |

Allowlisted parameters: offer_id, language, category, cta_placement. There is no
name, telephone, email, accommodation, message, free text or UTM retention.
No rejected-consent events are queued for later transmission. Optional plan
storage is only at the visitor's explicit choice and is removable in Privacy.

Funnel: offer visit → started enquiry → received enquiry → qualified enquiry →
confirmed booking. WhatsApp opening is not a received lead or sale. Initial
operator-side qualification/confirmation needs a separate operational record.

## Owner follow-through

After approval, inspect public indexability/status codes/canonicals, submit
`/sitemap.xml` in the real Search Console property, and inspect representative
URLs for each language. Search Console access, indexing and ranking were not
claimed or performed. No search volumes or ranking promises are given.

Google Business Profile requires verified legal/business details and eligibility.
Use the real brand, confirmed contact, appropriate service area/address according
to eligibility, actual operating hours and approved images. Do not invent an
address, hours, category entitlement or verification status. No GBP was edited.

Three future guides (not thin pages published now): the actual Počitelj/Kravice
day; what to check before arriving for the approved kayak activity; choosing a
route by available time. Each requires confirmed local/operating information.

Three hypotheses for later testing: clear kayak visibility reduces uncertainty;
a transparent confirmed price reduces clarification messages; simpler contact
channel choice increases completion. Test with real leads; no percentage uplift
is promised. Ask several prospective guests to find kayaking, understand price
and conditions and start an enquiry without help. That user test has not run.
