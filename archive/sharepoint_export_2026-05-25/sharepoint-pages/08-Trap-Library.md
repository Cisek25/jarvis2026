# Trap Library — 44 pułapek IdoSell/IdoBooking

**Zespół IdoBooking, IAI S.A.**
*Knowledge base — referencja dla wszystkich skille JARVIS*

## Czym jest Trap Library?

Knowledge base 44 udokumentowanych pułapek (system traps) napotkanych w 11 ukończonych projektach klientów IdoSell/IdoBooking. Każda pułapka ma: symptom (jak się objawia), root cause (dlaczego), fix (jak naprawić) i referencję do pliku `feedback_*.md` z pełnymi szczegółami.

Skille JARVIS (`/idosell-website-builder`, `/idosell-deploy-cr`, `/idosell-bug-debug`) referencują tę listę.

## Jak nawigować

Traps są pogrupowane wg domeny:

| Grupa | Liczba | Co tam jest |
|-------|--------|-------------|
| [CSS / Specificity](#grupa-1-css--specificity) | 8 | Walka z system CSS, specificity wars, orphan rules |
| [JavaScript / Behavior](#grupa-2-javascript--behavior) | 7 | Handlery, viewport guards, fullpage.js, MutationObserver |
| [Mobile / Responsive](#grupa-3-mobile--responsive) | 6 | Mobile menu, search-first, touch targets, viewport issues |
| [Sanitizer / WAF / Limits](#grupa-4-sanitizer--waf--limits) | 5 | body_top strip, body_bottom 62KB, emoji rejection, CSS 450KB OOM |
| [System Overrides](#grupa-5-system-overrides) | 8 | Header fixed, hero, font-size, system orange, .iai-search |
| [Components Specific](#grupa-6-components-specific) | 6 | Litepicker, hot map, search widget, language flags |
| [Licensing / Legal](#grupa-7-licensing--legal) | 2 | Powered by IdoBooking, RODO |
| [Workflow / Discipline](#grupa-8-workflow--discipline) | 2 | Iterative debugging, absolute paths |

**Frequency tags**: COMMON (≥3 projekty), RARE (1-2 projekty), ONE-TIME (zaobserwowano raz, ale udokumentowano).

---

## Grupa 1: CSS / Specificity

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 1 | **custom.css specificity war** | Twoja reguła z `!important` przegrywa mimo wszystko | Sprawdź specificity istniejącej (np. 0,3,3) — dodaj `html body` (0,5,3) | `feedback_idobooking_specificity_war.md` | COMMON |
| 2 | **Orphan CSS rules** | "USUNIETE w komentarzu" sekcje zostawiają orphan rules gdzie indziej | Grep cały plik za konfliktujące rules + MCP live inspect | `feedback_orphan_css_rules_audit.md` | COMMON |
| 3 | **System orange #AD5009** | Pomarańczowy w buttonach mimo brand color w :root | HARDCODE hex (nie var) w §6 system overrides | `idosell-website-builder.md` | COMMON |
| 4 | **System z-index: -1 na inputs** | Search inputs niewidoczne (za herobg) | `z-index: 2 !important` na inputs | `idosell-website-builder.md` | COMMON |
| 5 | **CSS size 450KB OOM** | Admin zgłasza memory error w panelu | Strip USUNIETE comments + indent → -50KB | Fair Rentals 2026-05-20 | RARE |
| 6 | **Preserve client CSS block** | Klient sam dodał reguły → niszczymy je przy update | Wrap w `/* §XX-CLIENT */ ... /* END */`, replace całość | `feedback_preserve_client_css_block.md` | RARE |
| 7 | **grid `repeat(7, 1fr)` overflow** | Mobile 240px container × 7 cells × 52px = 364px overflow | `repeat(7, minmax(0, 1fr))` — minimum 0, max 1fr | `idosell-website-builder.md` v1.66 | RARE |
| 8 | **Layer 1 white gradient washes hero** | Hero image niewidoczne pod systemowym overlay | `.parallax-slider::before { display: none !important }` | KNOWN-FIXES CRITICAL-R | COMMON |

## Grupa 2: JavaScript / Behavior

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 9 | **fullpage.js breaks scroll-based shrink** | `window.scrollY` zawsze = 0, header nie scrolluje | MutationObserver na `body.className.match(/fp-viewing-(\d+)/)` | KNOWN-FIXES CRITICAL-QQ | COMMON |
| 10 | **Hero height fullpage overrides** | Background strip pod hero, max-height nie działa | `margin-top: 0; height: 100vh; max-height: none !important` | KNOWN-FIXES CRITICAL-RR | COMMON |
| 11 | **body_top lands in SECTION 2** | Hero content w sekcji 2 zamiast 1 (fullpage.js) | JS teleport `.{prefix}-hero-wrap` do `.section.parallax .fp-tableCell` | KNOWN-FIXES CRITICAL-AA | COMMON |
| 12 | **Responsive handler bez viewport guard** | Desktop outside-click handler psuje mobile state | `if (window.innerWidth <= 991) return;` | `feedback_responsive_handler_viewport_guard.md` | COMMON |
| 13 | **Orphan event handlers z poprzednich er** | Stary handler nadal działa po refactorze | grep body_bottom.js → find all `addEventListener` | `feedback_iterative_debugging_discipline.md` | RARE |
| 14 | **System button text hardcoded "Menu"** | Na /en/ user widzi "MENU" zamiast EN | JS `translateLabel` per `html.lang` (PL: Menu, EN: Menu, DE: Menü) | `feedback_system_button_text_i18n.md` | COMMON |
| 15 | **Map location ID mismatch** | Klik marker → otwiera złą ofertę | Event delegation capture-phase interceptor | `feedback_idobooking_map_location_mismatch.md` | RARE |

## Grupa 3: Mobile / Responsive

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 16 | **Mobile hero search-first order** | Wyszukiwarka zasłonięta przez następną sekcję | `flex-direction: column !important; search order:1, text order:2` | `feedback_idobooking_mobile_search_first.md` | COMMON |
| 17 | **Widget w #navbar (display:none)** | Widget jezykowy ukryty gdy mobile menu zamknięte | JS DOM move widget z #navbar do header.menu-wrapper | `feedback_idobooking_mobile_widget_in_navbar.md` | COMMON |
| 18 | **`position: absolute + top: 50%` spada** | Logo zjeżdża gdy parent rośnie (mobile menu open) | `top: 12px` (fixed) zamiast 50% | `feedback_idobooking_specificity_war.md` | COMMON |
| 19 | **Element invisible** — 4 properties | Element niewidoczny, fix `visibility` nie działa | Sprawdź `display`, `visibility`, `opacity`, `width/height` + parent/child chain | `feedback_element_invisible_debug_checklist.md` | COMMON |
| 20 | **iPhone Safari `<select>` z appearance:none** | Litepicker dropdowny renderują się pusto | `dropdowns: isDesktop ? {...} : false` — na mobile `<strong>` | Fair Rentals v1.66 | RARE |
| 21 | **Touch targets <44×44 px** | Language flags 32x24, footer icons 24x24 | Min 44×44 px (WCAG 2.5.5) | `idosell-a11y-audit.md` | COMMON |

## Grupa 4: Sanitizer / WAF / Limits

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 22 | **body_bottom 62KB silent truncate** | JS dead po deploy, panel nie zgłasza błędu | `wc -c <60KB`, run minify_*.py jeśli zbliżasz | `feedback_idobooking_body_bottom_size_limit.md` | COMMON |
| 23 | **body_top inline style wycinany** | `style="background-image: url()"` zniknął po save | Klasa modyfikator `.foo--with-bg` + reguła CSS | `feedback_idobooking_body_top_inline_style_stripped.md` | COMMON |
| 24 | **Emoji w body_top → WAF reject** | IdoSell odrzuca save body_top | Grep emoji ranges (U+1F300-U+1FAFF, U+2600-U+27BF) → 0 matches | `feedback_no_emoji_client_code.md` | COMMON |
| 25 | **`<script>` w body_top** | System wycina script tags | Cały JS w body_bottom field | `idosell-website-builder.md` | COMMON |
| 26 | **`<style>` block w body_top** | System wycina style block | Cały CSS w ARKUSZ_STYLOW.css field | `idosell-website-builder.md` | COMMON |

## Grupa 5: System Overrides

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 27 | **body font-size 22.4px default** | Tekst za duży na całej stronie | `body { font-size: 16px !important }` | `idosell-website-builder.md` | COMMON |
| 28 | **Header transparent ale .menu-wrapper biały** | Header `transparent` ale child div ma bg | Target child div `.bgd-color-light.menu-wrapper` | KNOWN-FIXES CRITICAL-BB | COMMON |
| 29 | **Header position sticky (NOT fixed)** | Header skacze przy scroll na sub-pages | `position: fixed !important` (nie sticky!) | `idosell-website-builder.md` | COMMON |
| 30 | **.index-info z-index issue** | Hero content covered by search widget | `.index-info { z-index: 1000; overflow: visible }` | `idosell-website-builder.md` | COMMON |
| 31 | **.parallax-slider::before overlay** | Hero image washed out by white gradient | `.parallax-slider::before { display: none !important }` | KNOWN-FIXES CRITICAL-R | COMMON |
| 32 | **.iai-search visible na /offers** | Duplicate search bar | `.iai-search { display: none !important }` na /offers | `idosell-website-builder.md` | COMMON |
| 33 | **/txt subpages render system H1/H2** | System H1 "Strona X" nad body_top | `body.page-static h1.system-title { display: none }` | KNOWN-FIXES CRITICAL-NN | COMMON |
| 34 | **System gray bg na .section.fp-auto-height.pb-5** | Szare paski między sekcjami | Override `background: transparent !important` | KNOWN-FIXES CRITICAL-HH | RARE |

## Grupa 6: Components Specific

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 35 | **Litepicker --static przesunięty** | Kalendarz w prawo, lewa strona pusta | CSS reset `position: relative; margin: auto; left: auto; transform: none !important` | `feedback_idobooking_litepicker_static_centering.md` | COMMON |
| 36 | **Litepicker miesiące widoczne na /offer/N** | `:has(select)` regex hides `<strong>` zamiast `<select>` | `html body .litepicker .month-item-header:has(select.month-item-name) strong.month-item-name { display: none }` | Fair Rentals v1.66 | RARE |
| 37 | **Flatpickr auto-sets checkout** | Annoying UX — checkout automatycznie ustawiony | Custom JS — clear checkout po checkin click | KNOWN-FIXES CRITICAL-T | RARE |
| 38 | **Search widget hidden labels** | Labels w widget za widoczne | `.search-widget label { display: none }` + placeholders via JS | `idosell-website-builder.md` | COMMON |
| 39 | **Language flags bez aria-label** | Screen reader: "image" tylko | `<a aria-label="Polski">` na flag links | `idosell-a11y-audit.md` | COMMON |
| 40 | **Google Maps embed BEZ klucza** | API key leak do GitHub | `maps.google.com/maps?q=<address>&output=embed` — public, bez klucza | RPA 2026-05-19 | RARE |

## Grupa 7: Licensing / Legal

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 41 | **Powered by IdoBooking ukryty** | `.powered_by { display: none / opacity: 0.35 }` — naruszenie licencji | Opacity ≥0.85, max-height ~22px, brand colors (filter: none) | `feedback_powered_by_idobooking_visible.md` | COMMON |
| 42 | **RODO — dane klientów w plikach** | Klient phone/email/address w body_top jako placeholder | Real data z footer (NIE +48000000000), nie zostawiaj test data | `idosell-website-builder.md` | COMMON |

## Grupa 8: Workflow / Discipline

| # | Trap | Symptom | Fix | Reference | Frequency |
|---|------|---------|-----|-----------|-----------|
| 43 | **Iterative debug: bug wraca po fix** | 5 prób żeby naprawić jeden bug (Fair Rentals v1.58-v1.62) | Re-investigate od zera. NIE eskaluj defensywności (MutationObserver, layers, timeout) | `feedback_iterative_debugging_discipline.md` | COMMON |
| 44 | **Absolute paths w chat links** | VSC otwiera worktree dir (stary commit) | `[label](/Users/user/Desktop/jarvis/<path>)` — absolute, NIGDY relative | `feedback_absolute_paths_vsc.md` | COMMON |

---

## TOP 5 najważniejszych (must-apply z dnia 1)

| # | Trap | Dlaczego TOP 5 |
|---|------|----------------|
| 9 | **fullpage.js detection** | Każdy IdoBooking homepage używa fullpage.js. Bez MutationObserver scroll JS nie działa wcale. |
| 11 | **JS teleport hero into section.parallax** | Bez teleport body_top ląduje w sekcji 2 — hero pusty |
| 28 | **Header `.menu-wrapper` child has bg** | Header transparent ale child div nie — najczęściej mylone |
| 24+25 | **Wikimedia URL verification + body_top sanitizer** | NIGDY nie zgaduj hashy. Verify HEAD 200 przed użyciem |
| Wszystkie | **DevTools MCP od pierwszej debug sesji** | Computed styles + ancestor chain + fp-enabled PRZED CSS zmianą |

## Statystyki

| Metryka | Wartość |
|---------|---------|
| Łączna liczba traps | 44 |
| COMMON frequency (≥3 projekty) | 28 |
| RARE frequency (1-2 projekty) | 14 |
| ONE-TIME frequency | 2 |
| Pliki feedback_*.md | 17 |
| Projekty z których pochodzą | 11 (Fair Rentals, Mountain Prestige, EcoCamping, RPA, Madera, Najmar, Mazurski Chill, Apartamenty Parkowe, Piekary 13, WCA, SORS) |
| Najwięcej traps z 1 projektu | Mountain Prestige v1.14 (16 udokumentowanych w RELEASE_NOTES) |
| Najwięcej iteracji per bug | Fair Rentals v1.58-v1.62 (5 wersji na 1 bug) |

## Jak skille korzystają z Trap Library

### `/idosell-website-builder` — Phase 5 QA

Checklist 16 traps weryfikowanych przed delivery (font-size, header position, z-index, system orange, .iai-search, body_top sanitizer safety, Wikimedia thumbnails, photo scraping, links format, tel/mailto real data, no placeholder divs).

### `/idosell-deploy-cr` — 5 BLOCKERS + 4 WARNINGS

Każdy BLOCKER mapowany na trap:
- Blocker #1 (Secret scan) → Trap #40 (Google Maps API)
- Blocker #2 (body_bottom 62KB) → Trap #22
- Blocker #3 (body_top sanitizer) → Trap #23, #24, #25, #26
- Blocker #4 (Powered by) → Trap #41
- Warning #6 (CSS 450KB) → Trap #5

### `/idosell-bug-debug` — Step 3: Load JARVIS memory

Skill czyta `MEMORY.md` index, znajduje matching pattern w traps. Najczęstsze matches:
- Trap #19 (element invisible 4-property)
- Trap #43 (iterative debug discipline)
- Trap #12 (responsive viewport guard)

## Linki do pełnych szczegółów

Wszystkie `feedback_*.md` files w:
- `/Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/`
- Mirror w SharePoint: `sharepoint_export/memory-traps/`

Master release notes Mountain Prestige v1.14 (16 traps udokumentowanych w jednym pliku):
- `/Users/user/Desktop/jarvis/clients/MountainPrestige/RELEASE_NOTES_v1.14.md`

Master KNOWN-FIXES (cross-project):
- `/Users/user/Desktop/jarvis/docs/KNOWN-FIXES.md`

## Workflow: dodawanie nowego trap

Gdy `/idosell-bug-debug` odkryje nowy trap (nie w MEMORY.md):

```
1. Create: ~/.claude/projects/-Users-user-Desktop-jarvis/memory/feedback_<short-name>.md
   - Header: ---name/description/type/originSessionId---
   - # Problem (co user widzi)
   - # Detection (MCP commands)
   - # Fix (exact CSS/JS change)
   - # Reference (klient + wersja)

2. Update: ~/.claude/projects/-Users-user-Desktop-jarvis/memory/MEMORY.md
   - Add 1-liner do listy

3. Update: Trap Library (this page) — add row do appropriate group

4. Update: TOP 5 jeśli applicable

5. Update: skill checklists (np. /idosell-deploy-cr blocker list)
```

## Anti-patterns w trap discovery

| Anti-pattern | Lepiej |
|--------------|--------|
| "Memorize" trap bez dokumentacji | Zapisz w feedback_*.md od razu |
| Trap dla 1 klienta = nie warto dokumentować | Co najmniej 1 reference = wart memo |
| Nie ma ID/przykładu = useless | Konkretny selector, konkretna wersja, konkretny klient |
| Trap obecny w 5 projektach ale ad-hoc fix każdy raz | Po 3. wystąpieniu PROMOTE do `idosell-website-builder.md` checklist |
| Trap "nieoznaczony" w skille | Każdy trap musi mieć # ID w tej Library |
