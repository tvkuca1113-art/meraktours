# Actual test report — 2 November 2026

Owner-review build only. Existing production was not replaced. No 95/100 score
is claimed while critical source/approval blockers remain.

## Executed checks

- Build: 70 localized HTML pages, with local assets and five complete language
  drafts. Root and six legacy English paths have exact permanent redirects.
- `npm run lint`: Node syntax check of project JavaScript modules; passed.
  This is syntax validation, not an ESLint/style score.
- `npm test`: 10 meaningful Node tests passed: Sarajevo winter/summer dates and
  DST boundaries, real/leap/past dates, flexible dates, tour-specific group limit,
  invalid group/offer values, safe shared URLs, and five-language message encoding.
- Static HTML validation: all 70 localized pages passed the configured
  html-validate recommended rules. Native dialog compatibility and formatting
  exceptions are documented in `tools/validate.mjs`.
- 3,130 local link/asset references checked; one H1, language, title uniqueness
  within each language, canonical and all reciprocal language links checked on
  every page. No Instagram CDN dependency, rating or instant-booking schema.
- Production guard intentionally rejects a production build with missing approvals.
- HTTP checks: 70 pages return 200, seven redirects return 308 with the correct
  destinations, an unknown URL returns a real 404.

## Browser evidence

Selected cloud Chrome browser, actual local HTML, self-hosted photographs and
fonts; no substituted screenshot photographs. Test frames use exact CSS widths
and do not emulate hardware, network, pointer type or mobile browser chrome.
`docs/qa-evidence.json` contains the 17 measured page/width observations.

| Page | Widths | Findings |
| --- | --- | --- |
| Bosnian home | 320, 360, 390, 430, 768, 1024, 1440 | No horizontal overflow; one H1; kayak hero CTA visible in the first 844 px |
| English, German, Italian, Spanish homes | 390 each | No horizontal overflow; localized H1/content; hero CTA within the first 844 px |
| Bosnian kayaking | 390, 1440 | No horizontal overflow; no axe violations in the tested initial state |
| Bosnian Tour 02 | 390, 1440 | No horizontal overflow; no axe violations in the tested initial state |
| Bosnian contact | 390, 1440 | No horizontal overflow; no axe violations in the tested initial state |

Axe-core 4.10.2 was run against WCAG A/AA tags through WCAG 2.2 on those 17
states, with zero reported violations. This is not a full WCAG conformance
claim. Some audits cannot establish contrast over photographs or test every
interaction state. The 390 home CTA bottom was approximately 420 CSS px.

Manually observed:
- Mobile menu opens and shows Kajaci in the first level; the link opens the
  kayaking information page.
- An actual past date (2020-01-01) is rejected, with a visible error and focus.
- A flexible date, three people and transport interest produce the correct
  encoded WhatsApp message and confirmed recipient; no message was sent.
- Switching BS kayaking to DE stays on the same offer and retains group size
  and non-sensitive choices. It does not redirect to the home page.
- Gallery opens, ArrowRight advances to photograph 2, Escape closes and focus
  returns to the opener. Visible controls provide an alternative to swipe.
- The existing route map is retained as an optional readable SVG; the itinerary
  works without scroll animation. A kayak launch map is deliberately absent.

Screenshots were captured and visually reviewed for the 390 home and a 1440
CSS-width desktop review frame. Cloud full-page/clip screenshot requests timed
out; the desktop viewport capture is partially constrained by the available
browser surface. This is recorded rather than presenting a synthetic full-page
capture as an actual 1440-pixel screenshot. The 390 × 844 image was saved.

## Not tested or not configured

- Mobile Lighthouse, field LCP/INP/CLS and traffic at the 75th percentile:
  **not measured**. No 90+ performance claim is made.
- Full 200% browser zoom, real iOS/Android keyboard, mobile assistive technology,
  high-contrast modes and all keyboard paths: **not fully tested**.
- WhatsApp without the installed app: alternate copy/telephone UI exists, but
  the external service/device fallback was **not tested**. No live message sent.
- Web-form sending/failure/rate limiting/double submission: **not applicable**;
  the service is not connected or exposed. No simulated backend or success state.
- Seasonal closure and live availability: **not testable with absent operator
  data**; no availability or open-season claim is published.
- Analytics consent and lead receipt in a live provider: **not connected**;
  no analytics/marketing provider loads and no generate_lead is emitted.
- Native-speaker review, legal approval and prospective-guest user testing:
  **not performed**.
- TypeScript type-check: **not applicable to the retained JavaScript stack**;
  syntax, runtime model invariants and validation logic were checked instead.

## The requested rubric

| Criterion | Weight | Evidence / limit |
| --- | ---: | --- |
| Clarity and UX | 20 | Two main categories; first-screen kayak CTA; operator facts still missing |
| CRO and enquiries | 20 | Actual two-step WhatsApp preparation, validation and phone fallback; no web backend |
| Visual identity | 15 | Original brand/fonts retained; warm stone/river palette; real source imagery |
| Content and trust | 15 | Existing four tours preserved; no invented claims; owner/media/legal approval still required |
| Mobile performance | 10 | Responsive local assets and small runtime; Lighthouse/field metrics not measured |
| SEO and languages | 10 | Static pages, localized route map, canonical/hreflang, sitemap; human review pending |
| Accessibility | 10 | Zero axe violations in 17 tested states, keyboard gallery and labelled errors; manual scope limits above |

No numeric total is awarded. Critical production blockers override a score:
image-rights approval, verified kayak product/conditions and legal business
information. See `OWNER_INPUT_REQUIRED.md`. Test a few prospective guests on
finding kayaking, understanding cost/conditions and preparing an enquiry once
those facts are available; this has not yet been carried out.
