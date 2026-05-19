# River Premium Apartments — IdoBooking Migration Design

**Data**: 2026-05-19  
**Klient**: Andrzej Kowalski Fundacja Rodzinna  
**Brand**: River Premium Apartments  
**Slug**: `river-premium-apartments`  
**Operator**: Damian (IAI/JARVIS), Claude Opus 4.7  
**Wersja designu**: v1.0  
**Status**: zatwierdzony do implementacji

---

## 1. Kontekst i cel

Migracja istniejącej strony **riverpremiumapartments.pl** (obecnie na platformie Profitroom, template `buenos_aires`) na infrastrukturę IdoBooking (template `default13`). Cel: pełen wizualny clone 1:1 (najlepiej jak się da z bazowymi komponentami JARVIS).

Klient jest **właścicielem** obecnej strony — zero ryzyka IP. Wszystkie materiały (zdjęcia, treści, brand) używamy bezpośrednio.

**Tryb**: nowa strona w JARVIS (greenfield, brak istniejącego folderu klienta).

## 2. Zakres dostawy

7 stron z menu źródła:

1. `/` — HOMEPAGE
2. `/pokoje` — APARTAMENTY (4 typy: A, B, C, D)
3. `/oferty-i-promocje` — OFERTY I PROMOCJE
4. `/atrakcje` — ATRAKCJE
5. `/restauracja` — RESTAURACJA (klient prowadzi własną)
6. `/galeria` — GALERIA
7. `/kontakt` — KONTAKT

**Języki**: PL (default) + EN. DE pominięte (brak na źródle).

## 3. Brand tokens (z recon źródła)

### Kolory

```css
:root {
  --riv-navy:      #12334C;   /* primary navy, tekst, bordery */
  --riv-navy-dark: #051B3D;   /* primary CTA bg, footer bg */
  --riv-gold:      #7E674B;   /* secondary, akcent ciemny */
  --riv-beige:     #978C71;   /* secondary CTA bg, border arrow */
  --riv-bg:        #FFFFFF;   /* tło strony */
  --riv-ink:       #1A1A1A;   /* body text */
}
```

### Fonty

- **Headings**: Bodoni Moda (Google Fonts, weights 400/600/700)
- **Body**: DM Sans (Google Fonts, weights 400/500/700)

### Typografia (px, bo default13 ma `html { font-size: 10px }`)

| Element | Desktop | Mobile | Family | Weight |
|---|---|---|---|---|
| H1 hero | 48 / lh 52 | 32 / lh 38 | Bodoni Moda | 400 |
| H2 sekcji | 32 / lh 38 | 24 / lh 30 | Bodoni Moda | 600 |
| H3 karty | 22 / lh 28 | 20 / lh 26 | Bodoni Moda | 600 |
| Body | 16 / lh 24 | 16 / lh 24 | DM Sans | 400 |
| Button | 14 / lh 20 | 14 / lh 20 | DM Sans | 500 |
| Small/meta | 14 / lh 20 | 14 / lh 20 | DM Sans | 400 |

**Note**: body 16px (źródło ma 14px, ale JARVIS reguła min 16 dla WCAG/UX).

### Buttony

```
PRIMARY:     bg #051B3D / text #FFF / padding 14px 36px / font 14 DM Sans 500 / 
             letter-spacing 0.08em / text-transform uppercase / hover bg #12334C
SECONDARY:   bg #978C71 / text #051B3D / padding 14px 36px / hover bg #7E674B
ARROW LINK:  transparent / text #051B3D / border-bottom 1px #978C71 / 
             font 14 DM Sans 300 / hover color #978C71
```

## 4. Architektura JARVIS

### CSS 3 warstwy

```
ARKUSZ_STYLOW.css = Layer1 (traps, 2093 linii)
                  + Layer2 (komponenty ido-*, 961 linii)
                  + Layer3 (riv-theme, ~250 linii)
```

**Layer 3 zawartość** (jedyne co tworzymy):
1. `:root` z 6 zmiennymi brand
2. default13 overrides (header, footer, fonty global)
3. Theming bazowych komponentów (`ido-hero`, `ido-split`, `ido-cards`, `ido-features`, `ido-testimonials`, `ido-cta`, `ido-faq`, `ido-gallery`, `ido-map`)
4. `riv-amenities` (custom grid 6 ikon)
5. `riv-offer-card` (custom karty featured offers)
6. `riv-header--transparent` (state dla fullpage section 1)
7. `§RIV-CLIENT` (placeholder na ręczne dopiski klienta)

### JS — `body_bottom` shared per strona

- `ido-base.js` (489 linii, biblioteka — wklejana w body_bottom każdej strony)
- Per-strona dodatki (homepage: fullpage detection + hero teleport + featured offers reader; subpages: tylko relevantne moduły)

## 5. Mapa sekcji per strona

### 5.1 HOMEPAGE (`/`)

| # | Sekcja | JARVIS component | Treść |
|---|---|---|---|
| 1 | Hero fullscreen | `ido-hero` extended | "Wyjątkowe apartamenty" + sub adres + CTA REZERWUJ |
| 2 | Intro split-reverse | `ido-split-reverse` | "River Premium Apartments" + opis + ZOBACZ WIĘCEJ |
| 3 | Amenities 6 ikon | `riv-amenities` (custom) | Widok na rzekę / Garaż / WiFi / Zwierzęta / Smart TV / Winda |
| 4 | Oferty pobytu | `ido-cards` 3-col + featured-offers JS | Bezzwrotna 202zł / Długoterm 225zł / Elastyczna 250zł |
| 5 | About sticky split | `ido-split` | Drugi blok narracji |
| 6 | Opinie gości | `ido-testimonials` | 3-5 opinii z Booking.com (static) |
| 7 | Apartamenty A-D | `riv-offer-card` + featured-offers JS | 4 karty A 40m² 2os / B 55m² 4os / C 47m² 4os / D 35m² 2os |
| 8 | CTA dark final | `ido-cta-dark` | "Gotowy na pobyt nad Odrą?" |

### 5.2 APARTAMENTY (`/pokoje`)

Hero-small → intro split → grid 4 kart (2×2 desktop, 1col mobile) → split "Co wyróżnia" → CTA.

### 5.3 OFERTY I PROMOCJE (`/oferty-i-promocje`)

Hero-small → 3 karty cenowe (full opisy) → sezonowe placeholdery → FAQ → CTA dark.

### 5.4 ATRAKCJE (`/atrakcje`)

Hero-small → mapa + intro → 6-9 kart atrakcji (Rynek, Ostrów Tumski, ZOO, Hala Stulecia, Park Szczytnicki) → split "Komunikacja i parking" → CTA.

### 5.5 RESTAURACJA (`/restauracja`)

Hero fullscreen → koncept + szef → karta dań highlights → godziny + lokalizacja → CTA "Zarezerwuj stolik" → galeria → FAQ.  
**Treści**: klient dostarcza (nazwa, opis, zdjęcia, menu, godziny).

### 5.6 GALERIA (`/galeria`)

Hero-small → grid masonry z filtrami kategorii (Apartamenty/Wnętrza/Restauracja/Otoczenie) + lightbox → CTA.

### 5.7 KONTAKT (`/kontakt`)

Hero-small → dane + mapa Google → formularz kontaktowy → godziny recepcji → dojazd → footer fine print Powered by IdoBooking.

## 6. Featured offers wzorzec (MADERA pattern)

```
CSS Layer 3:
  .container-hotspot { display: none !important; }
  .riv-apartments-grid, .riv-offers-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  }
  @media (max-width: 680px) { grid-template-columns: 1fr; }
  .riv-offer-card { aspect-ratio 16/10 img, badge price, body, CTA, hover scale }

JS body_bottom:
  function buildRivOfferCards(gridSelector) {
    const hotspot = document.querySelector('.container-hotspot');
    const grid = document.querySelector(gridSelector);
    if (!hotspot || !grid) return;  // graceful exit
    
    const slides = hotspot.querySelectorAll('.slick-slide:not(.slick-cloned) .offer');
    const cards = [];
    const seen = new Set();
    
    slides.forEach(offer => {
      const href = offer.querySelector('a.object-icon')?.href;
      if (!href || seen.has(href)) return;
      seen.add(href);
      const img = offer.querySelector('img[data-src], img[src]')?.dataset.src 
               || offer.querySelector('img')?.src;
      const title = offer.querySelector('h3 a')?.textContent.trim();
      const desc = offer.querySelector('.offer__description')?.textContent.trim();
      const area = offer.querySelector('.accommodation-meters')?.textContent.match(/([\d,.]+)\s*m/i)?.[1];
      const guests = offer.querySelector('.accommodation-roomspace')?.textContent.match(/(\d+)/)?.[1];
      const price = offer.querySelector('.offer__price .price')?.textContent.match(/([\d,.]+)/)?.[1];
      cards.push({ href, img, title, desc, area, guests, price });
    });
    
    grid.innerHTML = cards.map(c => `
      <article class="riv-offer-card">
        <a href="${c.href}" class="riv-offer-card__media">
          <img src="${c.img}" alt="${c.title}" loading="lazy" class="riv-offer-card__img"/>
          ${c.price ? `<span class="riv-offer-card__badge">od ${c.price} zł/noc</span>` : ''}
        </a>
        <div class="riv-offer-card__body">
          <h3 class="riv-offer-card__name">${c.title}</h3>
          ${c.desc ? `<p class="riv-offer-card__desc">${c.desc}</p>` : ''}
          <ul class="riv-offer-card__meta">
            ${c.area ? `<li><svg>...</svg> ${c.area} m²</li>` : ''}
            ${c.guests ? `<li><svg>...</svg> ${c.guests} os.</li>` : ''}
          </ul>
          <a href="${c.href}" class="riv-offer-card__cta">SPRAWDŹ</a>
        </div>
      </article>
    `).join('');
    grid.classList.remove('riv-featured-fallback');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    buildRivOfferCards('.riv-apartments-grid');
    buildRivOfferCards('.riv-offers-grid');
  });

Fallback body_top:
  <div class="riv-apartments-grid riv-featured-fallback">
    <article class="riv-offer-card">... A 40m² ...</article>
    <article class="riv-offer-card">... B 55m² ...</article>
    ...
  </div>
```

## 7. fullpage.js handling — HOMEPAGE only

```js
const body = document.body;
const header = document.querySelector('.menu-wrapper');

const observer = new MutationObserver(() => {
  const m = body.className.match(/fp-viewing-(\d+)/);
  const section = m ? parseInt(m[1], 10) : 1;
  if (section === 0 || section === 1) {
    header.classList.add('riv-header--transparent');
  } else {
    header.classList.remove('riv-header--transparent');
  }
});
observer.observe(body, { attributes: true, attributeFilter: ['class'] });

// JS teleport hero do .section.parallax .fp-tableCell
const hero = document.querySelector('.riv-hero');
const target = document.querySelector('.section.parallax .fp-tableCell');
if (hero && target && !target.contains(hero)) target.appendChild(hero);
```

CSS:
```css
.menu-wrapper { background: white; transition: background 0.3s; }
.riv-header--transparent .menu-wrapper { background: transparent !important; }
.riv-header--transparent .menu-wrapper a { color: white !important; }
```

## 8. i18n — PL + EN

- IdoBooking native lang switcher w header (style override w Layer 3).
- Per strona × 2 języki = 14 plików body_top.
- body_bottom shared (1 plik per strona, JS lang-agnostic).
- `<html lang="pl">` / `<html lang="en">` — system ustawia.
- Translations w przyciskach systemowych: JS `translateLabel(html.lang)` mapuje "Menu" → PL/EN.

## 9. SEO

| Element | Implementacja |
|---|---|
| `<title>` | "River Premium Apartments — {Strona} Wrocław" (unique per strona, 50-60 znaków) |
| Meta description | 140-160 znaków, CTA, słowa kluczowe regionalne ("apartamenty Wrocław centrum", "noclegi nad Odrą") |
| OG / Twitter | 1200×630 hero crop per strona |
| Canonical | Auto IdoBooking, weryfikacja w QA |
| Schema.org JsonLD | HOME `LodgingBusiness`, KONTAKT `LocalBusiness`, RESTAURACJA `Restaurant` |
| Hreflang | `<link rel="alternate" hreflang="pl/en/x-default">` per strona |
| Sitemap | IdoBooking auto, weryfikacja obecności 7 stron |

**Lighthouse target**: Performance ≥85, Accessibility ≥95, Best Practices ≥90, SEO ≥95 (mobile + desktop).

## 10. Accessibility (WCAG 2.1 AA)

- Kontrast: navy `#051B3D` na bieli = 16.4:1 (AAA). Beige `#978C71` na navy = 4.1:1 (AA dla 14px+).
- Touch ≥44×44px (zwiększam padding gdzie potrzeba w buttonach).
- Heading hierarchy bez przeskoków, jedna H1 per strona.
- ARIA na nav/lang switch/lightbox/modal.
- Focus states: `outline 2px solid var(--riv-beige)`.
- Alt na każdym obrazie (klient dostarcza, ja waliduję).
- Keyboard nav: Tab, Enter, Esc dla lightbox.

## 11. Trapy IdoBooking — applied

Zob. `docs/KNOWN-FIXES.md` i `memory/instincts/000-MASTER-PLAYBOOK-idobooking-default13.md`:

- O — `html { font-size: 10px }` → wszystko w PX
- 037 — body_top hero teleport do `.section.parallax .fp-tableCell`
- 003 — fullpage.js scroll detection via MutationObserver
- 026 — Featured offers MADERA pattern
- `.menu-wrapper` child bg (nie header)
- 040 — Verify paste before iterate on fix
- Powered by IdoBooking footer (opacity ≥0.85)
- Wikimedia forbidden (Unsplash verified lub source CDN)
- 030 — Default brak instrukcji edycji dla klienta
- Zero emoji + zero komentarzy `// generated` w plikach klienta (WAF-safe)
- 033 — Live verification via chrome-devtools po dostawie

## 12. Struktura dostawy

```
clients/river-premium-apartments/DO_WKLEJENIA/
├── ARKUSZ_STYLOW.css                       (L1+L2+L3, ~3300 linii)
├── HOMEPAGE_PL__head.html
├── HOMEPAGE_PL__body_top.html
├── HOMEPAGE_EN__head.html
├── HOMEPAGE_EN__body_top.html
├── HOMEPAGE__body_bottom.html              (shared)
├── POKOJE_PL__head.html, POKOJE_PL__body_top.html, POKOJE_EN__*, POKOJE__body_bottom.html
├── OFERTY_PL__*, OFERTY_EN__*, OFERTY__body_bottom.html
├── ATRAKCJE_PL__*, ATRAKCJE_EN__*, ATRAKCJE__body_bottom.html
├── RESTAURACJA_PL__*, RESTAURACJA_EN__*, RESTAURACJA__body_bottom.html
├── GALERIA_PL__*, GALERIA_EN__*, GALERIA__body_bottom.html
└── KONTAKT_PL__*, KONTAKT_EN__*, KONTAKT__body_bottom.html

clients/river-premium-apartments/RELEASE_NOTES_v1.0.md
clients/river-premium-apartments/_recon/                (już istnieje)
  ├── source-data.json
  └── screenshots/01-home-desktop-full.png, 02-home-mobile-full.png

memory/clients_data/river-premium-apartments.json       (status, ryzyka, lessons)
```

Łącznie ~30 plików HTML/CSS, ~3300 linii CSS, ~800 linii JS.

## 13. Plan czasowy (estymata)

| Dzień | Faza | Zakres |
|---|---|---|
| 1 | Build A | Layer 3 theme CSS + HOMEPAGE PL + HOMEPAGE body_bottom (fullpage + featured offers + hero teleport) |
| 2 | Build B | HOMEPAGE EN + POKOJE PL/EN + GALERIA PL/EN + lightbox |
| 3 | Build C | OFERTY + ATRAKCJE + KONTAKT (PL/EN) + Schema.org JsonLD |
| 4 | Build D | RESTAURACJA pełna PL/EN (placeholdery na content od klienta) + footer + a11y polish |
| 5 | Review | UX validator + Lighthouse 7×2 + chrome-devtools live audit + fixes + RELEASE_NOTES + commit |

Realistycznie **4-5 dni** roboczych.

## 14. Blokery / oczekiwania od klienta

| Blocker | Status | Workaround |
|---|---|---|
| Logo SVG/PNG hi-res | Klient dostarczy | Build z text-logo Bodoni Moda jako placeholder, podmiana later |
| Treści Restauracji (nazwa, menu, godziny, zdjęcia dań) | Klient dostarczy | Build z placeholderami + TODO note dla Damiana |
| Zdjęcia apartamentów hi-res | Pobieramy ze źródła profitroom CDN | Akceptujemy aktualne 1500×1000, jeśli klient ma większe → podmieniamy |
| Treści PL/EN unikalne (intro, about) | Scrape ze źródła + tłumaczenia | EN tłumaczy klient lub używamy DeepL z ostatnim audytem przez native speakera |
| Atrakcje — które wybrać | Domyślne 6 popularnych (Rynek, Ostrów Tumski, ZOO, Hala Stulecia, Park Szczytnicki, Most Tumski) | Klient może później dopisać/usunąć |
| Schema.org star rating | Klient podaje liczbę gwiazdek (jeśli kategoryzowane) | Default brak `starRating`, dodajemy gdy potwierdzi |

## 15. Decyzje zatwierdzone (lock)

- **Architektura**: A. Bazowe komponenty JARVIS (`ido-*`) + custom `riv-amenities` + `riv-offer-card`
- **Prefix CSS**: `riv-`
- **Slug folderu**: `river-premium-apartments/`
- **Body font-size**: 16px (a11y), nie 14px jak źródło
- **Languages**: PL + EN, bez DE
- **Featured offers pattern**: MADERA/NAJMAR (CSS hide + JS reader + static fallback)
- **Logo**: placeholder text-logo, podmiana po dostarczeniu przez klienta
- **Restauracja**: pełna strona (klient prowadzi)
- **Stan panelu IdoBooking**: brak ofert → fallback static cards z danymi recon

## 16. Następne kroki

1. Hand-off do `writing-plans` skill — szczegółowy implementation plan z krokami atomowymi
2. Branch git: `feature/river-premium-apartments-v1.0`
3. Build Day 1 start: Layer 3 theme + HOMEPAGE PL

---

**Approval**: green light od Damiana (2026-05-19, "działaj wszystko sam").
