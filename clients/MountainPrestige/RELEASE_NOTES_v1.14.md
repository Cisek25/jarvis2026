# Mountain Prestige — Release Notes v1.14

**Data**: 2026-04-13
**Status**: deployed-iterating
**Klient**: Maria Makuch — mtnprestigepodhale@gmail.com — +48 535 267 585
**Engine**: client57060.idobooking.com
**Iteracji**: 14
**Source**: jarvis-rebuild-2026-04-13

---

## Co dostarczone (DO_WKLEJENIA/)

| Plik | Linii | Gdzie wkleić |
|---|---|---|
| MP_HEAD.html | 119 | Ustawienia → Kody śledzące → HEAD |
| MP_CSS_EDYTOR.css | **5286** | Wygląd → Edytor CSS |
| MP_KONIEC_BODY.html | **881** | Ustawienia → Kody śledzące → Koniec BODY |
| GLOWNA_PL__body_top.html | 429 | Strona główna → Początek BODY (TRYB HTML) |
| LOKALIZACJA_PL__body_top.html | 172 | Strony → /txt/lokalizacja → Treść (TRYB HTML) |
| WSPOLPRACA_PL__body_top.html | 148 | Strony → /txt/wspolpraca → Treść (TRYB HTML) |
| INSTRUKCJA.txt | ~600 | (lokalna dokumentacja, nie wkleja się) |

---

## Krytyczne odkrycia (do JARVIS trap library — apply EVERY new client)

### 🚨 1. fullpage.js DETECTION (CRITICAL-AA, QQ)
IdoBooking homepage używa **fullpage.js**. Konsekwencje:
- DOM: `main.fullpage-wrapper > .section.parallax + .section.fp-auto-height + ...`
- **Body_top content LANDS w SECTION 2** (.fp-auto-height), nie w hero!
- `window.scrollY` ZAWSZE = 0 (fullpage używa CSS transforms)
- Body class `fp-viewing-N` zmienia się przy section change

**FIX 1**: JS teleport hero-wrap INTO `.section.parallax` `.fp-tableCell`
**FIX 2**: MutationObserver na body class — `fp-viewing-1` = transparent header, `fp-viewing-2+` = scrolled state

### 🚨 2. Header `.menu-wrapper` child has bg (CRITICAL-BB)
`header.default13` jest computed `transparent` ALE child `<div class="bgd-color-light menu-wrapper">` ma `background: rgb(255,255,255)`. **Target child, not header**.

### 🚨 3. `.section.fp-auto-height.pb-5` gray bg (CRITICAL-HH)
fullpage wrapper ma `background: rgb(241,241,241)` + `padding-bottom: 30px`. Override.

### 🚨 4. CSS rule order matters (CRITICAL-KK lesson)
Same specificity → LATER wins. Edit at SOURCE rule, nie dopisuj override.

### 🚨 5. Empty system elements show as boxes
System renderuje 2 `.contact__tel`, jeden empty z `href="tel: "`. Hide via CSS `:empty` + JS whitespace check.

### 🚨 6. Layer 2 `.ido-hero__content` covers entire body (CRITICAL-O)
`position: absolute; inset: 0;` bez positioned parent fills viewport. Use wrap pattern.

### 🚨 7. Wikimedia URL verification (CRITICAL-W)
NIGDY nie zgaduj hashy. Methodology: `curl pl.wikipedia.org/wiki/X | grep upload.wikimedia.org | curl -sI verify 200`.

### 🚨 8. Container breakout fails with padding (CRITICAL-Z)
`width: 100vw + margin-left: -50vw` zawodzi gdy parent ma padding (Bootstrap 15px). Use `position: absolute` z body relative.

---

## Lista wszystkich CRITICAL traps (31 sztuk)

| TRAP | Issue | Doc |
|---|---|---|
| O | Layer 2 .ido-hero__content overlay covers whole body | KNOWN-FIXES |
| P | Force header visibility | KNOWN-FIXES |
| Q | Footer dark consistency | KNOWN-FIXES |
| R | Hero white gradient overlay reduced | KNOWN-FIXES |
| S | Menu universal selector `:not(.logo):not([class*="btn"])` | KNOWN-FIXES |
| T | Flatpickr no auto-checkout | KNOWN-FIXES |
| U | Hero CSS bg fallback | KNOWN-FIXES |
| V | Transparent header text-stroke menu | KNOWN-FIXES |
| W | Wikimedia URL verification methodology | KNOWN-FIXES |
| X | Hero bg pseudo + Ken Burns | KNOWN-FIXES |
| Y | Search widget INSIDE hero-wrap | KNOWN-FIXES |
| Z | Container padding breakout fix | KNOWN-FIXES |
| **AA** | **fullpage.js teleport hero into section.parallax** | KNOWN-FIXES |
| **BB** | **Target .menu-wrapper + .bgd-color-light child** | KNOWN-FIXES |
| CC | /offers filters collapsed by default + toggle | KNOWN-FIXES |
| DD | navbar-brand size constraint | KNOWN-FIXES |
| EE | .tabs.--fixed width 100vw + dynamic top | KNOWN-FIXES |
| FF | .offer-price asymmetric padding | KNOWN-FIXES |
| GG | Banner quote 8-directional text-stroke | KNOWN-FIXES |
| HH | .section.fp-auto-height.pb-5 gray bg | KNOWN-FIXES |
| II | Footer empty space after VISA | KNOWN-FIXES |
| JJ | Scrolled header SOLID white | KNOWN-FIXES |
| KK | /contact white box tel/email removed | KNOWN-FIXES |
| LL | Gallery lightbox modal | KNOWN-FIXES |
| MM | Universal lightbox (about/location/banners) | KNOWN-FIXES |
| NN | /txt subpages system H1/H2 hide | KNOWN-FIXES |
| OO | Hero subtitle text-stroke | KNOWN-FIXES |
| PP | Gallery anchor → button | KNOWN-FIXES |
| **QQ** | **fullpage.js MutationObserver scroll** | KNOWN-FIXES |
| **RR** | **Hero 100vh embrace fullpage** | KNOWN-FIXES |
| SS | powered_by badge size reduction | KNOWN-FIXES |

---

## TODO Klient (Maria)

- [ ] Upload Mountain Prestige logo SVG (max 240x56) zamiast wideLogo.svg 333x95
- [ ] Upload 12 zdjęć do panelu frontpageGallery (numerowane 1-12)
- [ ] Domena (mountainprestige.com zajęta — szukać alternatywy)
- [ ] Tekst kategorii w panelu Oferty (intro nad listą /offers)
- [ ] Treść H1 w panelu CMS dla /txt/wspolpraca (już ukrywam system H1)

## TODO JARVIS

- [ ] FAZA 2: EN wersje (GLOWNA_EN, LOKALIZACJA_EN, WSPOLPRACA_EN, OBIEKTY_EN)
- [ ] Test responsywność mobile (375px, 768px, 1440px)
- [ ] Performance audit (Lighthouse)
- [ ] Final visual QA wszystkich podstron z DevTools MCP

## Lekcje dla JARVIS (zapisane w MEMORY.md)

1. **DevTools MCP od PIERWSZEJ debug sesji** — nie zgadywać. Każdy nowy klient:
   - Sprawdź `html.fp-enabled` (fullpage.js?)
   - Sprawdź children headera (`.menu-wrapper`, `.navbar-wrapper`)
   - Sprawdź computed styles vs visible

2. **JARVIS Critical Traps Library** — 31 sektordyzowanych traps w `docs/KNOWN-FIXES.md` z generycznym `{prefix}` template. Apply preventywnie dla każdego nowego klienta.

3. **fullpage.js to default IdoBooking template homepage** — assume YES, not NO. Check fp-enabled + fp-viewing-N body class.

4. **Edit at SOURCE rule** — nie dopisuj override z early-CSS gdy LATER rule wygrywa.

5. **System renderuje empty elements** (2 phone fields, system H1) — hide via CSS `:empty` + JS whitespace check.
