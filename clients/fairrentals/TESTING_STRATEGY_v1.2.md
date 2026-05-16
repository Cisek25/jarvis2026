# Fair Rentals — Testing Strategy v1.2

**Cel**: Komplet planu testowego dla Fair Rentals przed produkcyjnym ogłoszeniem strony. Pokrywa funkcjonalność, dostępność, wydajność, bezpieczeństwo i regresję po każdej iteracji.

## 1. Środowiska

| Środowisko | URL | Cel |
|---|---|---|
| Staging | `https://client58360.idobooking.com/` | Po wklejeniu plików — pełen audyt |
| Lokalny preview | `clients/fairrentals/DO_WKLEJENIA/*.html` | Static HTML inspection przed paste |
| Production target | `fairrentals.pl` (przyszła migracja DNS) | Po akceptacji v2.x |

## 2. Macierz urządzeń × przeglądarek

| Viewport | Device | Browser | Priorytet |
|---|---|---|---|
| 1920×1080 | Desktop | Chrome 120+ | P0 |
| 1440×900 | Laptop | Chrome 120+ | P0 |
| 1280×800 | Laptop SD | Safari 17+ | P1 |
| 1024×768 | iPad horizontal | Safari iOS | P1 |
| 820×1180 | iPad portrait | Safari iOS | P1 |
| 414×896 | iPhone Plus | Safari iOS | P0 |
| 390×844 | iPhone 14/15 | Safari iOS | P0 |
| 375×812 | iPhone 13 mini | Safari iOS | P1 |
| 360×800 | Android Galaxy S | Chrome Android | P0 |
| 320×568 | iPhone SE 1 | Safari iOS | P2 |

P0 = obowiązkowe przed delivery, P1 = audyt po większych zmianach, P2 = sanity check raz na 5 wersji.

## 3. Scenariusze funkcjonalne (TDD format)

### 3.1 Hero + Search
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-01 | Otwarcie `/pl/` na desktop 1440 | hero asym renderuje się 50/50 split, badge 9.8 widoczny w prawym górnym | Manual + screenshot |
| F-02 | Klik CTA "Sprawdź dostępność" w hero | Smooth scroll do `#fr-search` baner | Keyboard Tab + Enter |
| F-03 | Klik CTA "Zobacz apartamenty" | Smooth scroll do `#fr-apartments` | jak wyżej |
| F-04 | Klik input "Przyjazd" w command bar | Litepicker otwiera się DOKŁADNIE pod inputem (nie środek viewportu) | DevTools `getBoundingClientRect()` |
| F-05 | Wybór 2 dat → klik "Szukaj" | Form submit do `engine58360.idobooking.com/widget/index.php?dateFrom=...&dateTo=...&persons-adult=2&lang=pl` | Network tab |
| F-06 | Mobile @390px hero asym | Photo nad text, command-bar pełnoszerokie 1-col | Real device |

### 3.2 Featured Offers (Pattern A)
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-10 | Strona główna z 0 wyróżnionych | Sekcja `.fr-apartments` `display: none`, brak pustego white space | DevTools |
| F-11 | Strona z 2 wyróżnionych (current state) | 2 karty `.fr-apt-card` editorial overlay style | Visual diff |
| F-12 | Strona z 6+ wyróżnionych | Grid auto-fit minmax(320px, 1fr), responsive | Resize browser |
| F-13 | Hover na kartę | `transform: translateY(-6px)` + `img scale(1.05)` | Manual |
| F-14 | Klik karta | Navigate do `/pl/offer/{id}/{slug}` | Network |
| F-15 | Karta image lazy load | `loading="lazy"` + `data-src` parsing | DevTools Network throttle 3G |

### 3.3 Trust Score
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-20 | Trust bar (4 cells dark) | 9.6 / 4.7 / 19 / 200+ widoczne, primary yellow numbers | Visual |
| F-21 | Klik "Zobacz opinie na Booking" | Otwiera się `booking.com/hotel/...` w nowej karcie (`target="_blank"`) | Click test |
| F-22 | Mobile @390 trust bar | Grid 2×2 cells (zamiast 1×4) | Real device |

### 3.4 Districts
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-30 | 4 dzielnice grid | A/B/C/D piny widoczne, Stare Miasto 5 / Kępa 8 / Karłowice 4 / Centrum 2 | Visual |
| F-31 | Hover na dzielnicy | Border-color primary + translateY(-4px) | Manual |
| F-32 | Mobile @390 districts | 1 column stack (lub 2×2 @991px) | Resize |

### 3.5 Journey timeline
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-40 | 5 kroków horizontal desktop | Linia łącząca okręgi widoczna od 10% do 90% | Visual |
| F-41 | 5 kroków mobile @991 | Stack vertikalny, linia ukryta | Resize |
| F-42 | Pierwszy krok (filled) | Background `--fr-primary` żółty | Visual |

### 3.6 Footer (light v1.2)
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-50 | Footer cream `#FAF7F2` bg | Nie czarny (różny od SA-style) | DevTools `bgcolor` |
| F-51 | Brand "Fair Rentals" italic | Display serif, top-left | Visual |
| F-52 | 4 kolumny (Adres / Telefon / E-mail / Dokumenty) | Każda z kicker label uppercase | Visual |
| F-53 | Górna granica żółta `4px` | Border-top primary | DevTools |
| F-54 | Visa+Mastercard SVG | Małe ikonki w dolnym banerze, IAI logo ukryte | Visual |

### 3.7 Header + fullpage.js
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-60 | Strona index, fp-viewing-1 | Header transparent (no bg) | DevTools |
| F-61 | Scroll do fp-viewing-2 | Header `.fr-header--scrolled` → bg white | DevTools `body.className` |
| F-62 | Subpage `/txt/201` | Header zawsze white (no transparent state) | Manual |
| F-63 | Mobile @390 fp navigation | Skrol działa naturalnie (no fp.js artifacts) | Real device |

### 3.8 Lightbox
| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| F-70 | Klik dowolne `<img>` w content | Modal otwiera się centrowane | Manual |
| F-71 | Klik poza modalem | Modal close | Manual |
| F-72 | Klik header logo `<img>` | Brak modal (blacklist exclude) | Manual |
| F-73 | Klik Visa/Mastercard footer SVG | Brak modal (blacklist exclude) | Manual |
| F-74 | Esc keyboard | Modal close | Keyboard |

## 4. Accessibility (WCAG 2.1 AA)

| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| A-01 | Tab przez całą stronę | Wszystkie focusable z visible outline | Keyboard only |
| A-02 | Touch targets ≥ 44×44px | All buttons + links spełniają | DevTools box model |
| A-03 | Kontrast tekstu | ≥ 4.5:1 dla body, ≥ 3:1 dla H1 | WebAIM Contrast Checker |
| A-04 | `alt` na każdym `<img>` | Sensowny opis (nie "image123") | DevTools `document.querySelectorAll('img:not([alt])')` |
| A-05 | Heading hierarchy | H1 → H2 → H3 bez przeskoków | DevTools Accessibility tree |
| A-06 | `lang="pl"` lub `lang="en"` | `<html lang="pl">` per strona | View source |
| A-07 | Skip-to-content link | Visible on focus | Tab od początku |
| A-08 | Form labels | Każdy `<input>` ma `<label for="">` | DevTools |
| A-09 | ARIA labels na ikonach-buttonach | `aria-label="Zadzwoń"` na tel link | DevTools |
| A-10 | Focus visible | `outline: 2px solid var(--fr-primary)` | Tab navigation |

Tools:
- **axe DevTools** — automated WCAG scan
- **Lighthouse Accessibility** — score ≥ 90
- **WebAIM WAVE** — visual report
- **NVDA + Firefox** — screen reader test (PL + EN)

## 5. SEO (techniczny)

| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| S-01 | Meta title per strona | Unikalny, 50-60 znaków | View source |
| S-02 | Meta description | 140-160 znaków | View source |
| S-03 | OG tags | og:title, og:description, og:image present | DevTools `document.querySelectorAll('meta[property^="og:"]')` |
| S-04 | Canonical URL | `<link rel="canonical">` per strona | View source |
| S-05 | Schema.org LodgingBusiness | JSON-LD valid (Google Rich Results Test) | https://search.google.com/test/rich-results |
| S-06 | Schema.org AggregateRating | 9.8 / 10 widoczne w SERP | Rich Results Test |
| S-07 | hreflang PL+EN | `<link rel="alternate" hreflang>` | View source |
| S-08 | sitemap.xml | Wygenerowany przez IdoBooking | `/sitemap.xml` |
| S-09 | robots.txt | Brak `noindex` | `/robots.txt` |
| S-10 | Lighthouse SEO | Score ≥ 90 | Lighthouse |

## 6. Performance

| ID | Metryka | Target | Method |
|---|---|---|---|
| P-01 | Lighthouse Performance | ≥ 80 mobile, ≥ 90 desktop | Lighthouse |
| P-02 | First Contentful Paint | < 1.8s | Lighthouse |
| P-03 | Largest Contentful Paint | < 2.5s | Lighthouse |
| P-04 | Cumulative Layout Shift | < 0.1 | Lighthouse |
| P-05 | Total Blocking Time | < 200ms | Lighthouse |
| P-06 | CSS size | < 290 KB (panel limit) | `wc -c` |
| P-07 | JS size | < 50 KB body_bottom | `wc -c` |
| P-08 | Hero image | WebP/AVIF lub Unsplash auto=format | DevTools Network |
| P-09 | Lazy load images | `loading="lazy"` na non-hero | DevTools |
| P-10 | No 404 requests | 0 failed network requests | DevTools Network |

## 7. Security + Privacy

| ID | Scenariusz | Expected | Method |
|---|---|---|---|
| Sec-01 | HTTPS only | Brak mixed content | DevTools Console |
| Sec-02 | External link rel | `rel="noopener noreferrer"` na `target="_blank"` | DevTools |
| Sec-03 | Brak inline `<script>` w body_top | CMS wycina | Live diff post-paste |
| Sec-04 | Brak danych PII na stronie | Tylko firmowe (NIP/adres) | Source review |
| Sec-05 | Trust score Booking links | Linki publiczne, nie wewnętrzne API | View source |
| Sec-06 | Cookie banner / consent | Obsługiwany przez IdoSell system | Live test |

## 8. IdoBooking-specific traps (instinct registry)

| Trap | Test | Expected | Pass criteria |
|---|---|---|---|
| #1 fp.js MutationObserver | Scroll homepage | Header zmienia stan na fp-viewing-N | F-61 |
| #14 CSS limit | `wc -c FR_ARKUSZ_STYLOW.css` | < 290 KB | Build automation |
| #14c bash heredoc escape | `grep '\\!important' *.css` | 0 occurrences | Pre-commit |
| #15 vars override | `getComputedStyle(html).getPropertyValue('--maincolor1')` | `#E2D700` | DevTools console live |
| #18 page-index full-width | `getComputedStyle(...container).maxWidth` na page-index | `none` lub `100%` | DevTools |
| #26 featured Pattern A | Panel "Wyróżnione" → strona aktualizuje | 0 hardcoded fallback | Manual panel test |
| #27 zero emoji | `grep -P '[\\x{1F300}-\\x{1FAFF}]' *.html *.css` | 0 matches | Pre-commit |
| #28 JS w body_bottom | View source | `<script>` tylko w `body_bottom` field | Manual |
| #29 Wikimedia | `grep -i 'wikimedia' *.html *.css` | 0 matches | Pre-commit |
| #30 px nad rem | `grep -nE 'font-size: [0-9]+rem' *.css` | 0 (lub minimal kontekstowo) | Pre-commit |
| #34 inline script CMS | Po paste: sprawdź czy `<script>` z body_top zostało | jeśli tak — nie ma OK; jeśli nie — OK | Live diff |

## 9. Regression test po każdej iteracji v1.x

Wybór "smoke test" 8 punktów (do uruchomienia po każdej zmianie CSS lub HTML):

```javascript
// Run in DevTools Console na live URL — wszystkie powinny być true
const tests = [
  ['CSS vars override', getComputedStyle(document.documentElement).getPropertyValue('--maincolor1').trim() === '#E2D700'],
  ['Hero asym renderuje', !!document.querySelector('.fr-hero-asym')],
  ['Search banner sekcja', !!document.querySelector('.fr-search-banner #fr-cmd-bar')],
  ['Magazine quote ink bg', getComputedStyle(document.querySelector('.fr-magazine')).backgroundColor === 'rgb(26, 26, 24)'],
  ['Trust bar 4 cells', document.querySelectorAll('.fr-trust__bar-cell').length === 4],
  ['Footer light cream', getComputedStyle(document.querySelector('footer')).backgroundColor.includes('250, 247, 242')],
  ['Featured grid present', !!document.getElementById('fr-apt-grid')],
  ['No SA leftovers', !document.body.innerHTML.match(/\\bsa-/i)]
];
console.table(tests);
const failures = tests.filter(t => !t[1]).length;
console.log(failures === 0 ? 'ALL PASS ✓' : `${failures} FAIL ✗`);
```

## 10. Test execution checklist

Pre-delivery (każda wersja):
- [ ] `node library/qa/run-all-checks.js` — SEO 0 critical, UX critical wszystkie udokumentowane jako false-positive
- [ ] `wc -c FR_ARKUSZ_STYLOW.css` — < 290 KB
- [ ] `grep -P '[\\x{1F300}-\\x{1FAFF}]'` — 0 emoji
- [ ] `grep '\\!important'` — 0 escape (bash heredoc)
- [ ] `grep client57511\|panel\|TODO\|FIXME` — 0 panel refs / dev artifacts
- [ ] Read 1 strona x 1 viewport (desktop preview locally)

Post-delivery (po wklejeniu przez Damiana):
- [ ] Smoke test (Section 9) → ALL PASS
- [ ] Lighthouse mobile + desktop → score table
- [ ] Visual regression desktop 1440 + mobile 390 (screenshot pair, diff)
- [ ] axe DevTools accessibility → 0 critical
- [ ] Manual click-through: hero CTA, search bar, featured cards, dual CTA, trust links, footer links
- [ ] Form submit test: data picker → search submit → engine redirect

Pre-production (przed promocją do `fairrentals.pl`):
- [ ] All scenarios F-* + A-* + S-* + P-* + Sec-*
- [ ] Cross-browser: Chrome 120+, Safari 17+, Firefox 120+
- [ ] Real device test: iPhone 13/14, Samsung Galaxy S22
- [ ] Lighthouse CI baseline saved
- [ ] Booking widget end-to-end: rezerwacja testowa → potwierdzenie → faktura

## 11. Bug taxonomy + severity

| Severity | Definition | SLA |
|---|---|---|
| P0 — Critical | Strona nie ładuje się / blokuje rezerwację / utrata danych | Fix tego samego dnia |
| P1 — High | Sekcja nie renderuje / trap IdoBooking active / WCAG critical | Fix < 48h |
| P2 — Medium | Visual issue na specyficznym viewport / dropdown nie działa | Fix w następnej wersji |
| P3 — Low | Polish / typo / nieoptymalny UX | Backlog |

Każdy bug pre-delivery raportowany w RELEASE_NOTES jako known limitation; każdy bug post-delivery → instinct lub lesson w `memory/`.

## 12. Continuous improvement

Po każdej delivery v1.x:
1. Zapisz feedback Damiana w `memory/clients_data/fairrentals.json` history
2. Jeśli pojawił się nowy pattern (np. "Trust Score zamiast fake testimonials") → instinct (`memory/instincts/045-...`)
3. Jeśli odkryto bug nieobjęty trapami → lesson (`memory/lessons/...`)
4. Update tego pliku (TESTING_STRATEGY) o nowy scenariusz
