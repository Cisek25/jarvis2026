---
name: IdoBooking SEO audit checklist
description: Diagnostic checklist for IdoBooking client SEO complaints — common findings and where to look first
type: reference
originSessionId: b5cf946c-ed62-46b0-af9f-3479383d2b9e
---
When auditing an IdoBooking client site for indexation/SEO complaints, check in this order via Playwright (WebFetch loses HTTP headers via markdown conversion):

1. **HTTP→HTTPS redirect headers** — IdoBooking's nginx may return `X-Robots-Tag: noindex, nofollow` on 301 redirects. This is a known platform behavior that silently breaks indexation of any legacy http:// URLs in Google's index. Verify with `playwright_browser_network_request` → `response-headers` after navigating to `http://domain/`.

2. **HTTP→HTTPS redirect target** — sometimes redirects go to the booking subdomain (`clientXXXX.idobooking.com/...`) instead of the client's own domain. Often the canonical HTTPS URL on the own-domain doesn't even exist (404).

3. **sitemap.xml structure** — IdoBooking generator emits:
   - hreflang `<xhtml:link rel="alternate">` for pl/en/de/es/ru: YES (works correctly)
   - `x-default`: NO (missing)
   - `<priority>`: hardcoded `1` for all URLs
   - `<lastmod>`: same date (today) for all URLs
   - `xmlns:xhtml` and `xmlns:image` namespaces: declared

4. **hreflang in HTML `<head>`** — IdoBooking template does NOT render `<link rel="alternate" hreflang="...">` in head. Only sitemap-level hreflang. Verify with `document.querySelectorAll('link[rel="alternate"]')` in Playwright.

5. **JSON-LD** — IdoBooking auto-injects `LodgingBusiness` schema on every page. Custom JSON-LD per page CAN be added via CMS page HTML field (subject to WAF — no emoji, no admin URLs).

6. **robots.txt** — default IdoBooking robots.txt:
   - Blocks `008, AhrefsBot, MJ12bot, metajobbot, Exabot, Ezooms, fyberspider, dotbot, MojeekBot`
   - `Crawl-delay: 1` for `*`
   - Disallows: `/*?currency`, `/edi/`, `/panel/`, `/widget/`, `/maintenance/`
   - Editable via panel (Configuration → SEO → Sitemap/robots) OR ticket to IAI.

**What client can change in panel:** robots.txt edits, CMS page slugs (for hreflang URL consistency), per-page meta SEO fields, custom JSON-LD in CMS page HTML.

**What requires IAI dev ticket:** X-Robots-Tag on 301 redirects, redirect target (own-domain vs subdomain), x-default in sitemap, hreflang in HTML head, varied priority/lastmod in sitemap.

**Panel field scoping (IMPORTANT, confirmed on 8199):**
- `/panel/frontpage` head/body/body_bottom fields are GLOBAL — content there appears on EVERY subpage, not just the homepage. Hreflang for homepage MUST be injected conditionally via JS in body_bottom (`if (path === '/' || path.match(/^\/(en|de|es|ru)$/)) { inject hreflang }`), not put statically.
- `/panel/frontpage/editsubpage/id/{ID}` head field IS per-CMS-page. Static hreflang for a specific CMS subpage goes here.
- Offer pages (`/{slug}`) have NO per-page head field in panel. For those, hreflang stays in sitemap.xml only (which IdoBooking generates correctly).

**Verification flow after panel edits:** Playwright navigate to each touched URL with `?v=N` cache buster → `evaluate` to count JSON-LD types + hreflang count and targets. Expected output table per page type:
- Homepage: 1 JSON-LD (LodgingBusiness) + 6 hreflang from JS (lang variants of /)
- Offer page: 2 JSON-LD (LodgingBusiness + BreadcrumbList from JS) + 0 hreflang in head (sitemap suffices)
- CMS subpage with rich content: 2-3 JSON-LD (LodgingBusiness + custom @graph + BreadcrumbList) + 2 hreflang (pl + x-default) for monolingual pages

Last confirmed live: 2026-05-12 on comfyapartments.pl, post-fix run.
