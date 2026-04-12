# Visual QA Report — Live Client Sites
Generated: 2026-03-13

## Sites Audited

| Client | Live URL | IdoSell Panel |
|--------|----------|---------------|
| wawabed2 | client53370.idosell.com (wawabed.pl = ISPConfig default, NOT live) | client53370 |
| willa kapitanska | client57041.idosell.com / villakapitanska.pl | client57041 |
| GoldenApartments | goldenapartments.com.pl | client57304 |

> Note: `wawabed.pl` and `www.wawabed.pl` show an ISPConfig default page — the custom domain is not yet pointed to IdoSell. The actual live site is at `client53370.idosell.com`.

---

## Screenshots Index

All screenshots in `claudedocs/screenshots/qa2_*.png`

| File | Page | Viewport |
|------|------|----------|
| qa2_wawabed_home_desktop.png | WawaBed home | 1440px |
| qa2_wawabed_offers_desktop.png | WawaBed /offers | 1440px |
| qa2_wawabed_galeria_desktop.png | WawaBed /txt/201/Galeria | 1440px |
| qa2_wawabed_atrakcje_desktop.png | WawaBed /txt/202/Atrakcje | 1440px |
| qa2_wawabed_kontakt_desktop.png | WawaBed /txt/203/Kontakt | 1440px |
| qa2_wawabed_home_mobile.png | WawaBed home | 390px |
| qa2_willa_home_desktop.png | Willa Kapitanska home | 1440px |
| qa2_willa_onas_desktop.png | Willa /txt/201/O-nas | 1440px |
| qa2_willa_atrakcje_desktop.png | Willa /txt/200/Atrakcje | 1440px |
| qa2_willa_galeria_desktop.png | Willa /txt/202/Galeria | 1440px |
| qa2_willa_kontakt_desktop.png | Willa /contact | 1440px |
| qa2_willa_de_desktop.png | Willa /de/ (German) | 1440px |
| qa2_willa_home_mobile.png | Willa Kapitanska home | 390px |
| qa2_willa_de_mobile.png | Willa /de/ (German) | 390px |
| qa2_golden_home_desktop.png | GoldenApartments home | 1440px |
| qa2_golden_apt_desktop.png | Golden /pl/bastion-walowa | 1440px |
| qa2_golden_rez_desktop.png | Golden /pl/rezerwacje | 1440px |
| qa2_golden_home_mobile.png | GoldenApartments home | 390px |

---

## QA Results by Site

---

### 1. WawaBed (client53370.idosell.com)

**Overall: GOOD — custom design fully live**

#### Desktop
| Page | Status | Notes |
|------|--------|-------|
| Home | PASS | Full-bleed hero with Warszawa skyline, booking search bar visible, warm dark tone consistent |
| Offers (/offers) | PASS | IdoBooking listing: 3 rooms shown (Pokój 1os. 261zł, 2os. 306zł, 2łóżka 360zł), filter sidebar working, no images loaded for rooms (grey placeholder) |
| Galeria | PASS | "Odkryj nasze wnetrza" hero section, 3-row thumbnail grid with real room photos loaded |
| Atrakcje | PASS | "Atrakcje Warszawy" dark green hero, travel-time dots grid (Metro 12min, Las Bielański 10min, etc.) |
| Kontakt | PASS | 3-card layout: Telefon, E-mail, Adres — all data present, Google Maps embed visible at bottom |

#### Mobile (390px)
| Page | Status | Notes |
|------|--------|-------|
| Home | PASS | Full-bleed hero, title text scales well, "SPRAWDZ DOSTEPNOSC" CTA button centered |

#### Issues Found
- **Room images missing on /offers**: Room listing cards show grey placeholder icons — no photos uploaded to IdoBooking for the room offers. Content issue, not CSS.
- **wawabed.pl domain not pointed to IdoSell**: `wawabed.pl` resolves to ISPConfig default page. Client needs to update DNS / domain redirect.
- **Nav on home shows 4 items** (Oferta, Galeria, Atrakcje, Kontakt) but actual URLs use /txt/201, /txt/202, /txt/203 slugs — navigation works correctly despite different display.

---

### 2. Willa Kapitanska (client57041.idosell.com / villakapitanska.pl)

**Overall: LIVE — unique vintage map design, responsive but visually dense at desktop**

#### Desktop (1440px)
| Page | Status | Notes |
|------|--------|-------|
| Home (PL) | PASS | Vintage nautical map illustration full-bleed hero, booking date widget overlaid on map, anchor icon visible, brand is distinctive |
| Home (DE) | PASS | German translation active — "ONLINE BUCHEN" button, "MEHR" instead of "CZYTAJ WIECEJ", content properly switched |
| O nas | PASS | Secondary hero with map, "Gdzie kazdy moze" heading visible in below-fold content |
| Atrakcje | PASS | Same map hero, "Atrakcje Kolobrzegu" heading below fold |
| Galeria | PASS | Map hero + "Galeria" heading below fold |
| Kontakt | PASS | "Dane kontaktowe" + "Platnosci" two-column layout visible below map hero |

#### Mobile (390px)
| Page | Status | Notes |
|------|--------|-------|
| Home (PL) | PASS | Map fills screen properly, "VILLA KAPITANSKA" title stacked, "REZERWUJ ONLINE" button prominent, "CYTAJ WIECEJ" below |
| Home (DE) | PASS | "ONLINE BUCHEN" button correct, "MEHR" link present |

#### Issues Found
- **Desktop renders small/zoomed-out**: At 1440px viewport the site appears to render at ~50% zoom. The entire page layout (hero + booking widget + all text) is visible but tiny. This suggests the site may have a fixed max-width or viewport meta that causes it to render as if the viewport is much wider than 1440px. Likely a `width=1920` or similar viewport configuration issue.
- **No booking search bar on mobile home** at 390px — the date picker widget that appears on desktop hero is not visible on mobile (may be hidden intentionally or collapsed).
- **Booking widget at mobile**: The date range picker (Poczatek/Koniec) is only partially visible on the desktop hero — it appears truncated at the right edge in some views.
- **villakapitanska.pl domain**: Points correctly to the live site (confirmed from nav link discovery).

---

### 3. GoldenApartments (goldenapartments.com.pl)

**Overall: LIVE — older-style site, no cookie modal, different platform (not IdoSell CMS)**

#### Desktop (1440px)
| Page | Status | Notes |
|------|--------|-------|
| Home | PASS | Full-bleed Gdansk Motlawa waterfront photo, "GOLDEN APARTMENTS / APARTAMENTY GDANSK" title, below-fold content cards |
| O Apartamentach (/pl/bastion-walowa) | PASS | Standard article layout, image + text, footer with logo/contact columns |
| Rezerwacje | PASS | Booking search bar (Termin/Liczba osob), apartment listing: "Apartament Walowa c 26" (259zł, 4 osoby) and "Apartament Walowa c 37" — real photos in thumbnail strip |

#### Mobile (390px)
| Page | Status | Notes |
|------|--------|-------|
| Home | PASS | Hero image scales, title stacks properly, "WIECEJ" link visible |

#### Issues Found
- **Different platform**: GoldenApartments runs on a different CMS (goldenapartments.com.pl appears to be a WordPress or custom PHP site, NOT IdoSell). This is separate from the `client57304.idosell.com` panel. The IdoSell panel (`client57304`) is the newer version currently being built — the live `goldenapartments.com.pl` is the old site still serving customers.
- **Nav only 4 items**: HOME, O APARTAMENTACH, REZERWACJE, SKONTAKTUJ SIE — no Galeria or Atrakcje pages.
- **"O Apartamentach" page is dated**: Shows "UTWORZONO: 05 PAZDZIERNIK 2017" — old article content.
- **No language switcher visible on home**: The EN flag is visible in the desktop nav but the EN version content may not be maintained.
- **Hero slider appears frozen**: Only one image visible on home (confirmed from earlier work — slider CSS was intentionally freezing slide 0).

---

## Cross-Site Summary

### Positive Findings
1. **All 3 sites are live and serving content** — no blank pages or server errors
2. **WawaBed design is the strongest**: Clean dark/cream palette, all custom sections rendering correctly, mobile responsive
3. **Willa Kapitanska multilingual works**: PL/DE switch functions, button text translates correctly
4. **GoldenApartments booking engine active**: Real apartments with prices and photos in the listing
5. **Cookie consent modal**: Both IdoSell sites (wawabed, willa_kap) have GDPR modal — this is platform-level, not a bug

### Issues Requiring Action

| Priority | Site | Issue | Action |
|----------|------|-------|--------|
| HIGH | wawabed | `wawabed.pl` domain not pointing to IdoSell | Client must update DNS A record / CNAME |
| HIGH | willa_kap | Desktop renders at ~50% scale (zoomed out) | Check viewport meta tag in IdoSell HEAD code — may need `width=device-width` |
| MEDIUM | wawabed | Room images missing on /offers listing | Upload room photos in IdoBooking admin panel |
| MEDIUM | golden | Live site is old platform, not IdoSell — separate from v3 work | New IdoSell site (client57304) when ready should replace goldenapartments.com.pl |
| LOW | willa_kap | Booking date widget slightly cut off at right on some desktop views | Minor CSS overflow check needed |
| LOW | golden | "O Apartamentach" content dated 2017 | Content refresh needed |

### Page Availability Matrix

| Page | wawabed | willa_kap | golden |
|------|:-------:|:---------:|:------:|
| Home | LIVE | LIVE | LIVE |
| Oferta/Rezerwacje | LIVE | LIVE (via /offers) | LIVE |
| Galeria | LIVE | LIVE | missing |
| Atrakcje | LIVE | LIVE | missing |
| O nas / Kontakt | LIVE | LIVE | partial |
| DE version | — | LIVE | — |
| Mobile responsive | GOOD | GOOD | GOOD |

---

## Technical Notes

### Cookie Modal Bypass (QA Method)
IdoSell's cookie consent modal is rendered via JavaScript after page load and cannot be bypassed via pre-set cookies. Screenshots in this report were taken using CSS injection (`position: fixed` elements with `z-index > 100` hidden) to reveal the underlying page content for QA purposes. Real users must interact with the modal on first visit.

### URL Slugs Confirmed
- wawabed pages: `/offers`, `/txt/201/Galeria`, `/txt/202/Atrakcje`, `/txt/203/Kontakt`
- willa_kapitanska pages: `/txt/200/Atrakcje`, `/txt/201/O-nas`, `/txt/202/Galeria`, `/contact`, `/de/`
- GoldenApartments: `/pl/`, `/pl/bastion-walowa`, `/pl/rezerwacje`, `/pl/skontaktuj-sie`
