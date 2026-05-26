# Skill - idosell-website-builder

**Damian Cisowski**
*Zespół IdoBooking, IAI S.A.*

`/idosell-website-builder`

## Czym jest to narzędzie?

Master pipeline do budowy kompletnej strony klienta IdoSell/IdoBooking od briefa do paczki `DO_WKLEJENIA`. Skill prowadzi Claude Code przez **7 faz** (RECON, CSS, HTML, JS, META, QA, Dokumentacja) zapewniając, że żadna z 44 udokumentowanych pułapek systemu nie zostanie pominięta.

Cel: skrócić czas budowy strony klienta z ~40h (najdłuższy projekt: Fair Rentals) do **11-15h** przy zachowaniu jakości (Lighthouse ≥85, WCAG 2.1 AA ≥95%, body_bottom ≤60KB).

## Dlaczego to istnieje

Każdy klient IdoSell wymagał ręcznego powtórzenia tych samych kroków (header fix, system overrides, sanitizer-safe HTML, scrape ofert). Bez systematycznego workflow:

- 8 z 11 projektów miało regresję na min. jedną pułapkę (header padding, body_bottom truncate, sanitizer style strip)
- Średnio 3-5 wersji per fix (Fair Rentals v1.58 → v1.62 saga)
- Łącznie 21 wersji na ~6 issues w jednym kliencie

Skill kodyfikuje wnioski z 11 ukończonych projektów w deterministyczny pipeline.

## Jak uruchomić?

W Claude Code wpisz:

```
/idosell-website-builder
```

Lub naturalnie:

```
Nowy klient IdoSell. Panel: https://client12345.idobooking.com/
Brief w załączniku: BRIEF_filled.pdf
```

Claude automatycznie wykryje trigger i aktywuje skill.

## 7-fazowy pipeline

| Faza | Czas | Output | Co produkuje |
|------|------|--------|--------------|
| **Phase 0: RECON** | 1-2h | `BRIEF.md`, scraped data | Panel inspect, scrape ofert, header height, fonty |
| **Phase 1: CSS** | 3-4h | `{PREFIX}_ARKUSZ_STYLOW.css` (~2000 linii) | Design system §0-§12 (zmienne, header, hero, sections, system overrides, responsive) |
| **Phase 2: HTML** | 2-3h | `{PAGE}_{LANG}__body_top.html` per podstrona | CMS sekcje z REAL photos, offer cards, custom podstrony |
| **Phase 3: JS** | 1-2h | `GLOWNA_{LANG}__body_bottom.html` (≤60KB) | Scroll reveal, smooth scroll, mobile menu, FAQ, search placeholders |
| **Phase 4: META** | 30 min | `{PREFIX}_HEAD.html` | OG tags, Schema.org (LodgingBusiness), Google Fonts |
| **Phase 5: QA** | 2-3h | `QA_REPORT.md` | Link verify, image verify, mobile-first responsive (375/768/1440), interaction tests |
| **Phase 6: Docs** | 30 min | `INSTRUKCJA.txt` | Step-by-step paste guide dla operatora panelu |

**Razem**: 11-15h dla wersji PL. EN/DE: +3-4h każda.

## Phase 0: RECON — co skill robi

```
1. Czytaj memory: idosell-clients-db.md + idosell-websites.md
2. Pobierz od użytkownika: panel URL, brand name, paleta, font pair, prefix (2-3 litery)
3. Otwórz panel w MCP chrome-devtools: header class, slider images, offers count
4. Scrape /offers → offer names, prices, person counts, locations
5. Scrape każdy /offer/{id} → photos (first landscape)
6. Scrape /contact → address, phone, email
7. Check gallery: /images/frontpageGallery/pictures/large/
8. Zmierz header height
9. Zapisz body classes na każdym typie strony
```

Output: `clients/<klient>/BRIEF.md` + scraped raw data w `_source/`.

## Phase 1: CSS — struktura design systemu

| Sekcja | Co zawiera | Typowy rozmiar |
|--------|-----------|----------------|
| §0 | CSS variables (colors, fonts, shadows, radii) | 50 linii |
| §1 | Global resets (`body { font-size: 16px !important }`, html/body border-top) | 80 linii |
| §2 | Typography (Merriweather/Playfair + Inter pattern) | 100 linii |
| §3 | Header (`position: fixed !important`, brand bg, padding-top per subpage) | 200 linii |
| §4 | Hero (`.parallax-slider::before { display: none }`, gradient overlay, `.index-info` z-index 1000) | 300 linii |
| §5 | Search widget (pill-bar lub card style, labels hidden) | 250 linii |
| §6 | System overrides (#bounce, #backTop, cookie, skip — HARDCODED hex) | 150 linii |
| §7 | Sections (cards grid, alternating layouts, CTAs) | 400 linii |
| §8-§11 | Responsive (1200, 1024, 768, 480) | 400 linii |
| §12+ | Subpage-specific (/offers filters, /contact links, custom subpages) | 200 linii |

**Razem**: ~2000 linii, ~80-150KB (target <450KB, admin OOM przy ~500KB).

## Phase 5: QA — sub-fazy

| Sub-faza | Co testuje | Narzędzie |
|----------|-----------|-----------|
| 5A | Link verification (twice) — wszystkie `href`, format `/txt/{ID}/{Slug}`, anchor, tel/mailto | curl + grep |
| 5B | Image verification — HEAD 200, naturalWidth > 0, no placeholder divs | curl + DevTools |
| 5C | Mobile-first responsive — 375x812 (iPhone), 768x1024 (iPad), 1440x900 (Desktop) | MCP chrome-devtools |
| 5D | Interaction testing — search dropdowns, FAQ, filter toggle, smooth scroll, mobile menu | MCP eval scripts |
| 5E | Visual testing — full-page screenshots, contrast check, brand colors weryfikacja | MCP screenshot |
| 5F | Contact data verification — scrape footer live, porównaj `tel:`/`mailto:` w HTML | DevTools + sed |

## System Traps Checklist (16 obowiązkowych)

Przed dostawą każdy build musi przejść:

```
[ ] body { font-size: 16px !important } (system = 22.4px)
[ ] .index-info { z-index: 1000; overflow: visible }
[ ] .parallax-slider::before { display: none }
[ ] System z-index: -1 na inputs → z-index: 2
[ ] System orange #AD5009 → brand color
[ ] Header: position: fixed (NIE sticky!) + correct padding-top
[ ] Litepicker: width: fit-content
[ ] .iai-search hidden na /offers
[ ] body_top NIE zawiera <script>
[ ] Footer: style via CSS only, never custom HTML
[ ] Wikimedia thumbnails max 600px
[ ] Photo scraping z /offer pages dla homepage cards
[ ] WSZYSTKIE linki używają /txt/{ID}/{Slug} format
[ ] WSZYSTKIE tel/mailto z REAL data z footer
[ ] BRAK img-placeholder divs
[ ] QA test results zalogowane przed delivery
```

Pełna lista 44 pułapek: [Trap Library](08-Trap-Library.md).

## Przykład: brief klienta i output

### Input (brief klienta)

```
Klient: Mountain Prestige Apartments
Panel: https://client34211.idobooking.com/
Brand: górski, ciepły, premium
Paleta: #4A6B3A (zielony), #C9A77D (beż), #1A1A18 (czarny)
Fonty: Playfair Display (heading) + Inter (body)
Prefix CSS: mp-
Liczba ofert: 8 apartamentów
Języki: PL, EN
Custom podstrony: Atrakcje, Dla biznesu, Galeria
```

### Output (paczka DO_WKLEJENIA)

```
clients/mountain-prestige/DO_WKLEJENIA/
├── MP_ARKUSZ_STYLOW.css           (98 KB, ~1900 linii)
├── MP_HEAD.html                    (3 KB, OG + Schema.org)
├── GLOWNA_PL__body_top.html        (8 KB, homepage sekcje)
├── GLOWNA_PL__body_bottom.html     (58 KB, global JS)
├── KONTAKT_PL__body_top.html       (3 KB)
├── ATRAKCJE_PL__body_top.html      (12 KB)
├── DLA_BIZNESU_PL__body_top.html   (5 KB)
├── GALERIA_PL__body_top.html       (6 KB)
├── /en/ (mirror dla wersji EN)
└── INSTRUKCJA.txt                  (paste guide)
```

Plus per-projekt:

```
clients/mountain-prestige/
├── BRIEF.md                        # filled brief
├── QA_REPORT.md                    # Phase 5 results
├── RELEASE_NOTES_v1.0.md           # changelog
└── _source/                        # raw scrapes, screenshots, working files
```

## Output skill

| Co produkuje | Gdzie | Format |
|--------------|-------|--------|
| Paczka DO_WKLEJENIA | `clients/<klient>/DO_WKLEJENIA/` | HTML + CSS + JS |
| Brief klienta | `clients/<klient>/BRIEF.md` | Markdown |
| QA report | `clients/<klient>/QA_REPORT.md` | Markdown z PASS/FAIL |
| Release notes | `clients/<klient>/RELEASE_NOTES_v1.0.md` | Markdown changelog |
| Instrukcja dla operatora | `clients/<klient>/DO_WKLEJENIA/INSTRUKCJA.txt` | Plain text |

## Powiązane skille

- **Pre-build**: `idosell-project-manager` — load client memory
- **Pre-deploy**: [/idosell-deploy-cr](02-Skill-deploy-cr.md) — MANDATORY code review
- **Post-deploy**: [/idosell-seo-audit](04-Skill-seo-audit.md), [/idosell-e2e-test](06-Skill-e2e-test.md)
- **Issue handling**: [/idosell-bug-debug](03-Skill-bug-debug.md)
- **Sign-off**: [/idosell-a11y-audit](05-Skill-a11y-audit.md)

## Wymagania

- Claude Code z aktywnym MCP `chrome-devtools` (do RECON i QA)
- Dostęp do panelu klienta IdoSell (URL + login operatora)
- Brief klienta (wypełniony PDF lub Markdown)
- Python 3.9+ (do minify scripts gdy body_bottom > 60KB)
- Opcjonalnie: Playwright MCP (advanced E2E)

## KPI per skill (target)

| Metryka | Cel | Achieved (Fair Rentals) |
|---------|-----|------------------------|
| Time to launch (PL only) | 11-15h | 40h → planowo 12h |
| Lighthouse Performance (mobile) | ≥85 | 87-92 |
| Lighthouse SEO | 100 | 100 |
| WCAG 2.1 AA compliance | ≥95% | 95-98% |
| CSS size | <450KB | 410KB (po refactor z 460KB) |
| body_bottom size | <60KB | 57KB (limit systemu: 62KB) |
| Bug fix iterations avg | <2 wersji | 1.5 |
