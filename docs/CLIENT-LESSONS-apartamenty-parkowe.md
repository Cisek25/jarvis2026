# CLIENT LESSONS — Apartamenty Parkowe Gniezno (client58154)

**Konsolidacja wszystkich lekcji z sesji 2026-04-16 do 2026-04-21.**
Dokument referencyjny przy kolejnym audycie AP **i przy budowaniu
podobnych klientów** (apartamenty krótkoterminowe, Wielkopolska,
default13 template).

---

## Stan aktualny (v1.5 — 2026-04-21)

- Wersja: v1.5 (z blogiem auto-listing + 5 gotowych wpisów)
- Status: gotowa do wklejenia, NIE jeszcze wdrożona w panelu
- Architektura: jeden template CSS (`AP_CSS_EDYTOR.css` 7600+ linii / 230KB)
  + `AP_HEAD.html` + `AP_KONIEC_BODY.html` + 9 body_top (PL/EN × 4
  podstrony + GŁÓWNA CMS)

### Podstrony
| URL | Plik CMS | Status |
|-----|----------|--------|
| `/` | `GLOWNA_PL__cms.html` | ✓ gotowy |
| `/en/` | `GLOWNA_EN__cms.html` | ✓ gotowy |
| `/txt/201/O-nas` | `ONAS_PL__body_top.html` | ✓ gotowy |
| `/txt/202/Galeria` | `GALERIA_PL__body_top.html` | ✓ gotowy |
| `/txt/203/Lokalizacja` | `LOKALIZACJA_PL__body_top.html` | ✓ v2 (bez duplikacji kontaktu, z obrazkami) |
| `/txt/204/Blog` | `BLOG_PL__body_top.html` | ✓ nowy (auto-listing) |
| `/contact` | systemowa | ✓ Bootstrap grid |
| `/offers` | systemowa | ✓ custom filter button |

---

## Wszystkie iteracje (7 wersji)

### v1.0 — 2026-04-16 — Recon + build
Wstępna budowa z JARVIS template, kolory żywa zieleń #147D3B + Playfair.
CSS L1+L2+L3 (70KB). Gotowa ale nie wdrożona.

### v2.0 — 2026-04-20 — FAILED (adaptacja mockupu)
Próba adaptacji Claude frontend-design mockupu (React → IdoBooking).
**Katastrofa**: 125KB/3356 reguł CSS → panel obciął do 360 reguł. Strona
biała bez kolorów/fontów. Wnioski:
- **Trap #14**: custom.css ma praktyczny limit w okolicy kilkuset reguł
- **Trap #15**: IdoBooking default13 ma własne CSS vars (--maincolor1,
  --supportcolor1, --btn_large...) — MUSZĄ być override z `!important`
- **Trap #16**: mockup ≠ standalone strona — IdoBooking renderuje własne
  system elements (header, .container-hotspot, .footer-contact-baner itd.)
- **Trap #17**: walidator ≠ prod — ZAWSZE live verify przez chrome-devtools MCP

### v2.1 — 2026-04-20 — rebuild MINIMAL
Po odkryciu traps #14-17, CSS odchudzony do 32KB/223 reguł z pełnym
override IdoBooking vars. Działa.

### v1.0 ROLLBACK — 2026-04-20 — user decyzja
User: "zrób strone od nowa jako jarvis, bo widze, ze ten desing nie
działa dobrze". Przywrócone `_OLD_v1_2026-04-20/` z v1.0 (żywa zieleń).

### v1.1 PATCH — 2026-04-21 — filters_submit + header
- `#filters_submit` brand-harmonized (radius 6px, padding 14px 28px,
  letter-spacing 1.5px, hover translate+shadow)
- Header: stałe 88px, logo `align-self: flex-start`, brak shrinku na scroll
- **Lekcja uniwersalna**: instinct 005 (filters_submit) + 006 (header)

### v1.2 HOTFIX — 2026-04-21 — scope full-width
User po wklejeniu v1.1: "/contact jest jakos dziwnie rozjechana".
Patch v1.1 nałożył full-width na `.container` wszędzie — `/contact`
używa Bootstrap grid `col-md-6 + col-md-5`, padding:0 zepsuło gutters.
**Fix**: scope ograniczony TYLKO do `body.page-txt`, dla `/contact`
jawny rewert (1200px centered + 15px gutters).
- **Lekcja uniwersalna**: instinct 007 (subpage full-width scope)

### v1.3 — 2026-04-21 — Lokalizacja bez duplikacji + zdjęcia
User: "w lokalizacji mozemy nie powtarzac kontaktu (...) dodaj zdjęcia,
scrapuj z neta". Usunięta sekcja z tel/email (duplikat /contact),
dodane 6 kart atrakcji ze zdjęciami z Pexels CDN.
- **Lekcja uniwersalna**: instinct 008 (no contact duplication + zdjęcia)

### v1.4 — 2026-04-21 — SEO file clean format
User: "Te pliki SEO są dziwnie opisane, tam nie ma byc zadnych twoich
uwag jarvis (...) bez żadnych kresek po prostu do skopiowania".
`SEO_TYTULY_AP.md` refactor: usunięte wszystkie komentarze JARVIS,
dodane 3 brakujące podstrony (O nas, Galeria, Lokalizacja) PL+EN.
- **Lekcja uniwersalna**: instinct 009 (SEO clean format)

### v1.5 — 2026-04-21 — Blog auto-listing + 5 wpisów
User: "stworz jeszcze podstrone z blogiem, automatycznym romawialismy
o tym przy okazji projektu WCA". Implementacja wzorca WCA dla AP.
- `BLOG_PL/EN__body_top.html` — pusta sekcja z hero + empty grid
- CSS: `.ap-blog` / `.ap-blog-card` (§7 w AP_CSS_EDYTOR.css)
- JS: `initBlogListing` czyta `.news-item`, buduje karty
- `BLOG_WPISY/` — 5 gotowych artykułów (1000–1500 słów każdy)
- **Lekcja uniwersalna**: instinct 010 (auto-blog listing)

### v1.6 — 2026-04-21 — Key icon + universal lightbox blacklist
User: "zmien jeszcze ikone tego klucza, to ma byc normalny klucz +
KAZDE zdjecie powinno byc klikalne!!! i zapamietaj to na zawsze do jarvisa".
- Fix SVG klucza na homepage PL+EN (Lucide key icon zamiast zepsutych path)
- `initGalleryLightbox` refactor: **whitelist → blacklist**. Skanuje
  wszystkie `<img>`, filtruje tylko: wewnątrz linka, header/footer/logo,
  <40px, data-no-lightbox. Nowe komponenty działają out-of-the-box.
- **Lekcja uniwersalna**: instinct 011 (every-image-lightbox)
- CLAUDE.md trap #7 upgraded z whitelist na blacklist approach

### v1.8 — 2026-04-21 — UX round 3 (9 fixów + 3 instincty)
User zgłosił 9 problemów jednym ciągiem: logo chip overflow, menu się
nie bieli, hardcoded karty, stopka REZERWACJA, duplikat Sprawdź dostępność,
ikonka kalendarza przy PL, mobile ikona lokalizacji zamiast hamburgera,
mobile rezerwuj button niewyrównany, galeria CTA nierówny.

**3 root causes discovered**:
1. **CLASS MISMATCH**: `initScrollHandler` ustawiał `ap-header-scrolled`
   (single-dash), CSS targetował `ap-header--scrolled` (double-dash) —
   stąd header nigdy się nie bielił na subpagach. Fix: unify BEM convention.
2. **FONTELLO NOT LOADED**: default13 nie ładuje fontello font — user
   widział pin lokalizacji zamiast hamburgera bo `<i class="icon icon-menu">`
   renderował jako placeholder glyph/emoji. Fix: `display:none` na wszystkich
   `.icon/.fa/[class^="icon-"]` + CSS-drawn hamburger.
3. **HARDCODED FALLBACK**: 3 `<article class="ap-offer-card">` w HTML
   były "na wszelki wypadek" — user widział je gdy 0 wyróżnionych.
   Fix: zero hardcoded, JS fills lub hides section.

**Lekcje uniwersalne**: instincts 015 (featured-no-fallback), 016
(header-scroll-class-unify), 017 (fontello-unavailable).

### v1.7 — 2026-04-21 — UX round 2 (6 punktów)
User feedback: "96 Ocena (ma być 9.6) + logo ledwo widoczne + kolory
się różnią + czcionki za małe + dwie strzałki CTA + galeria otwiera
się w nowej karcie".
- **Counter fix**: `animateCounter` dodane `data-ap-divide` / `data-ap-suffix`
  → 96/10=9.6 z decimal formatting
- **Logo chip**: `.navbar-brand` white bg + padding + border-radius 14px +
  shadow → widoczne na każdym tle
- **CTA unification**: wszystkie `.ap-offer-card__cta` + `body.page-offers .btn`
  → `--ido-primary` (było mieszane primary/accent)
- **Typography scale-up**: body 16→17px, kicker 0.72→0.85rem, final-cta
  kicker #A8E6B8→#CDE6D6 (jaśniejszy) + text-shadow
- **Double arrow CTA**: usunięto hardcoded `→` z HTML, CSS `::after`
  animuje jedną strzałkę
- **Galeria**: `<a href="/images/...">` → `<figure>` (30 zmian × 2 lang)
  → lightbox v2 łapie, nie otwiera w nowej karcie
- **Lekcje uniwersalne**: instincts 012 (typography), 013 (logo chip),
  014 (CTA color consistency)
- CLAUDE.md traps #21-25 dodane

---

## KOLORY I FONTY (do re-use dla podobnych klientów)

```css
:root {
  /* v1.0 "żywa zieleń" — final decyzja usera po rollback */
  --ido-primary:   #147D3B;   /* brand green */
  --ido-secondary: #0E5C2B;   /* hover dark green */
  --ido-accent:    #598700;   /* secondary accent / olive */
  --ido-bg:        #FAFAF8;   /* page bg, cream-white */
  --ido-dark:      #1A2E1A;   /* dark sections, text */
  --ido-light:     #F0F5ED;   /* alt sections, pale green tint */

  /* IdoBooking default13 overrides (MUSZĄ być !important) */
  --maincolor1: var(--ido-primary) !important;
  --maincolor2: var(--ido-secondary) !important;
  --supportcolor1: var(--ido-accent) !important;
  --btn_large: var(--ido-primary) !important;
  --bgcolor1: var(--ido-bg) !important;
  --bgaside: var(--ido-light) !important;

  /* Fonts */
  --ido-font-heading: 'Playfair Display', Georgia, serif;
  --ido-font-body:    'Inter', system-ui, -apple-system, sans-serif;

  /* Header */
  --ido-header-h: 88px;             /* stałe, BEZ shrinku */
  --ap-current-header-h: 88px;      /* używane dla .tabs.--fixed top */
}
```

---

## 12 UNIWERSALNYCH LEKCJI dla IdoBooking + Wielkopolska B&B

### 1. Custom.css limit (trap #14)
Praktyczny limit ~60KB gzipped / 780 reguł. Ponad to panel obcina i
strona traci style. AP 1.5 ma 230KB źródłowo / 40KB gzipped / 780 reguł
(weryfikacja live pokazała że działa).

### 2. IdoBooking default13 vars (trap #15)
Zawsze override `--maincolor1, --maincolor2, --supportcolor1, --btn_large,
--bgcolor1-3, --widget_header, --bgaside` z `!important` w `:root`.
Bez tego kolorystyka nie działa pomimo naszych `--ido-*`.

### 3. Mockup ≠ standalone (trap #16)
Przy adaptacji designu z React/HTML mockupu NIE przepisuj 1:1.
System renderuje własne elementy (header, booking widget, footer,
news section, itd.). Praca = stylizacja system elements (80%) + dodanie
własnych sekcji content w body_top (20%).

### 4. LIVE VERIFY (trap #17)
Przed oddaniem ZAWSZE: chrome-devtools MCP → paste CSS → verify computed
styles, CSS vars, hero parent, document.fonts. Walidator lokalny łapie
syntax ale nie działanie.

### 5. Subpage full-width TYLKO /txt (trap #18 / instinct 007)
System owija body_top w Bootstrap `.container` (max-width 1170px).
Override TYLKO dla `body.page-txt` (nasze podstrony). NIE dla
`/contact` (ma Bootstrap grid 2-col) ani `/offer` (sidebar).

### 6. filters_submit brand-styled (trap #19 / instinct 005)
Przycisk "Zastosuj filtry" na /offers ma default padding:0, radius:0,
font 12px. Zawsze override: radius match inne CTA, padding 14px 28px,
letter-spacing, hover translate.

### 7. Header no-shrink + logo top (trap #20 / instinct 006)
Nie zmniejszaj header na scroll. Logo `align-self: flex-start` (nie
vertical-center). Klasa `.{prefix}-header--scrolled` może zostać dla
zmiany tła, ale nie zmian rozmiarów.

### 8. Podstrony nie dublują kontaktu (instinct 008)
`/lokalizacja`, `/o-nas`, `/galeria` NIE mają sekcji kontaktowej.
Delikatny link `<a href="/contact">szczegółowe dane kontaktowe</a>`
wystarczy. Inaczej klient zmieni numer i zapomni o 4 miejscach.

### 9. Atrakcje zawsze ze zdjęciami (instinct 008 + CLAUDE.md #9)
Karty atrakcji bez obrazków wyglądają anemicznie. Wariant
`.ap-attraction-card--media` (aspect 16/10, distance badge abs
top-left z blur bg, hover scale). Zdjęcia z **Pexels CDN** (hotlink
allowed, free, no attribution). ❌ Wikimedia (429 rate limit).

### 10. SEO file — clean copy-paste (instinct 009)
`SEO_TYTULY_{KLIENT}.md` bez komentarzy JARVIS, liczników znaków,
uzasadnień. Tylko `SEKCJA (LANG)` + 4 pola (Nazwa:, Podpis pod nazwą:,
META Tytuł:, META Opis:) z treścią. User kopiuje i wkleja w panel.

### 11. Blog = systemowe Aktualności + JS auto-listing (instinct 010)
Blog NIE jako podstrona z ręcznym wpisem HTML — to systemowe
"Aktualności" + pusty grid + JS który czyta `.news-item` i renderuje
karty. Klient dodaje wpis w panelu → karta pojawia się automatycznie.
Wzorzec wzięty z WCA.

### 12. Custom offer cards (MADERA/NAJMAR pattern)
Na stronie głównej system renderuje `.container-hotspot` z Slick
carousel "wyróżnionych ofert" (brzydki default). Ukrywamy go CSS-em,
JS czyta `.offer` elementy i buduje własne karty `.ap-offer-card` z
obrazkiem, ceną, metadanymi. Bez tego homepage wygląda jak placeholder.

---

## Co zabrać do kolejnego podobnego klienta

### Szablon początkowy (apartamenty krótkoterminowe / default13)
1. Kopiuj `AP_CSS_EDYTOR.css` jako baza → zmień prefix `ap-` → `{prefix}-`
   → zmień kolory `:root` → gotowe
2. Kopiuj `AP_HEAD.html` → zmień meta, canonical, schema LodgingBusiness
3. Kopiuj `AP_KONIEC_BODY.html` → prefix rename → sekcje §15 (blog) i §14
   (lightbox) działają out-of-box
4. Kopiuj `GLOWNA_PL/EN__cms.html` jako wzorzec → edytuj treści
5. Kopiuj wszystkie `*_body_top.html` (O nas, Galeria, Lokalizacja, Blog)
6. Dla bloga — kopiuj `BLOG_WPISY/` jako template → edytuj nazwy miasta
   i atrakcje

### Pułapki do ominięcia (z AP)
- NIE próbuj przepisywać mockupu 1:1 (v2.0 FAIL)
- NIE skracaj CSS "na siłę" — praktyczny limit jest wyżej niż myślisz
- NIE nakładaj full-width na /contact /offer (v1.1 FAIL)
- NIE duplikuj kontaktu na innych podstronach
- NIE dodawaj komentarzy JARVIS do SEO file
- NIE róbmy blogu jako static subpage — zawsze Aktualności + JS

### Co musi być od dnia 1
- Brand vars override (--maincolor1 itd.)
- Prefix klienta (`ap-`, `md-`, `nj-`...)
- Header no-shrink + logo top
- `.container-hotspot` hide + `initFeaturedOffers` JS
- Subpage full-width dla `/txt/*` (TYLKO)
- Universal lightbox na wszystkie `<img>` z excludami

---

## Plik-lista do ostatecznego deploymentu AP v1.5

Wszystko w `clients/apartamenty-parkowe/DO_WKLEJENIA/`:
- AP_CSS_EDYTOR.css (panel → Arkusz stylów)
- AP_HEAD.html (panel → Kody śledzące HEAD)
- AP_KONIEC_BODY.html (panel → Kody śledzące Koniec BODY)
- GLOWNA_PL__cms.html (panel → Strona główna PL → TRYB HTML)
- GLOWNA_EN__cms.html (panel → Strona główna EN → TRYB HTML)
- ONAS_PL/EN__body_top.html (panel → /txt/201)
- GALERIA_PL/EN__body_top.html (panel → /txt/202)
- LOKALIZACJA_PL/EN__body_top.html (panel → /txt/203)
- BLOG_PL/EN__body_top.html (panel → /txt/204)
- BLOG_WPISY/01-05*.html (panel → Wygląd i treści → Aktualności → Dodaj)
- SEO_TYTULY_AP.md (referencja — wprowadza ręcznie z kopiuj-wklej)

---

## Open questions (do ustalenia z klientem)

Z `memory/clients_data/apartamenty-parkowe.json`:
- Dwa H1 na homepage — ukryć pierwszy?
- Touch targets footer: phone/email h=29px < WCAG 44px — zwiększyć?
- Ile apartamentów faktycznie — brief 4 vs panel 3?
- Rozliczenie: pakiet 1000 zł vs nakład ~25-30h (przekroczyło)?

---

## Historia sesji w skrócie

```
2026-04-16 v1.0 recon + build (70KB, żywa zieleń)
2026-04-20 v2.0 adapter mockup FAILED (125KB cut to 360 rules)
2026-04-20 v2.1 rebuild minimal (32KB/223 rules)
2026-04-20 v1.0 ROLLBACK (user chose original design)
2026-04-21 v1.1 filters_submit + header no-shrink (+ 2 instincts)
2026-04-21 v1.2 scope full-width TYLKO /txt (+ 1 instinct)
2026-04-21 v1.3 Lokalizacja no-contact-dup + zdjęcia (+ 1 instinct)
2026-04-21 v1.4 SEO clean format (+ 1 instinct)
2026-04-21 v1.5 Blog auto-listing + 5 wpisów (+ 1 instinct)
2026-04-21 v1.6 Key icon + universal lightbox blacklist (+ 1 instinct)
2026-04-21 v1.7 Counter + logo chip + typography + CTA unify + galeria (+ 3 instincts)
2026-04-21 v1.8 Class unify + featured-no-fallback + fontello-hide + 6 UX (+ 3 instincts)
2026-05-04 v1.9.0 drone video + Google reviews + Modern badge + mobile patches (+ 8 fixes)
2026-05-13 v1.9.1 Advanced Mobile UX/A11y TDD — search visibility + a11y + specificity war (+ 1 trap #31)
```

---

### v1.9.1 — 2026-05-13 — Advanced Mobile UX/A11y (TDD methodology)

**Trigger**: user feedback "na różnych telefonach cała wyszukiwarka nie jest widoczna,
zasłania ją np. następna sekcja". Plus wymóg zaawansowanych testów UX i dostępności
cyfrowej (WCAG 2.1 AA).

**Methodology (TDD + testing-strategy)**:
1. Napisanie 25 testów (JS w chrome-devtools MCP) PRZED naprawą — baseline FAIL
2. Identyfikacja root cause przez DOM diagnostics
3. CSS fix z proper specificity
4. Re-test → GREEN
5. Test na 4 viewportach (375/360/390/412)

**Root cause discovered**:
- `.ap-hero-wrap` to `position:absolute + height:100vh` na mobile
- `.ap-hero__grid` (text + search) jest 1013px → overflowuje
- BONUS: `.ap-hero__search-card .ap-search--vertical .ap-search__field`
  w custom.css ma `min-height: 82px !important; padding: 16px 18px !important`
  (specificity 0,3,3 = 33) — pole jest 98px tall × 5 = blow past viewport

**Fix**:
1. CSS §(9) w AP_CSS_EDYTOR.css — selector specificity 0,5,5 = 55 (`html body
   .ap-hero-wrap--split .ap-hero__search-card .ap-search--vertical .ap-search__field`)
2. Hero-wrap → `position:relative + height:auto` na mobile
3. Hero grid → `flex-direction: column` + **order swap** (search first, text below —
   pattern Booking.com/Airbnb)
4. Field compact: 56px height (z 98), label 10px, input 14px
5. Submit button 46-48px touch target (WCAG)
6. iPhone SE/Galaxy S20: chowanie search header decoracyjnego (`.ap-hero__search-header
   { display: none }` @ max-width: 400px)
7. A11y: focus-visible outline 3px + box-shadow 6px, aria-label patcher dla flatpickr
   alt-inputs

**Verified**:
| Device | Viewport | Search h before | Search h after | All Tests |
|---|---|---|---|---|
| iPhone SE | 375×667 | 580px (overlap) | 321px (clear) | 25/25 PASS |
| iPhone 12 | 390×844 | 615px (overlap 119) | 321px (gap 453) | 25/25 PASS |
| Pixel 7 | 412×915 | ~620px | 366px | 25/25 PASS |
| Galaxy S20 | 360×740 | ~600px | 309px | 25/25 PASS |

**TRAP #31 — Specificity War w custom.css**:
Custom.css ma JUŻ rules z `!important` i specificity 0,3,3 na hero/search.
Moje pierwsze próby z `html body .X` (0,2,3) PRZEGRYWAŁY mimo !important —
cascade reguła: same specificity + same !important = późniejszy wygrywa, ALE
specificity różni się → wygrywa większa. ZAWSZE używaj wcześniej istniejących
rules jako template specificity:
- Sprawdź computed style w chrome-devtools
- Znajdź matching rules (np. `document.styleSheets[6].cssRules` walk)
- Użyj **selectorów o tej samej lub wyższej specificity**
- Twoje rules **declared later** w pliku (= dalej w CSS) wygrywają przy tie

**Lekcja uniwersalna (instinct 018 do dodania w jarvis/memory/instincts/)**:
"Booking widget na mobile = search-first order swap. Hero text marketing schodzi poniżej.
Pattern Booking.com, Airbnb, AP. Bez tego search wystaje poniżej fold i user
musi scrollować zanim zobaczy CTA — większy bounce rate."

**13 nowych instynktów uniwersalnych** (005-017) w `memory/instincts/`.
**12 nowych trapów** (#18-29) w `CLAUDE.md` CRITICAL TRAPS + **upgrade trap #7**
(whitelist → blacklist).

---

**Referencje**:
- `memory/clients_data/apartamenty-parkowe.json` — pełna historia
- `memory/instincts/005-010*.md` — uniwersalne reguły
- `library/css/layer1-traps.css` — TRAP #20 (subpage full-width)
- `CLAUDE.md` — traps #18, #19, #20
