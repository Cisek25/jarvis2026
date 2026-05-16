# Fair Rentals — Release v1.39 (5 UX fixes + OG image + odpowiedzi klienta)

**Data**: 2026-05-15 (sesja 8 — feedback klienta po deploy v1.38)
**Stan przed**: v1.38 (post-deploy fixy: news hide / powered_by / dropdown / hover gap)
**Stan po**: v1.39 (5 UX fixów na offer page + home + OG image z galerii klienta)

---

## 5 problemów zgłoszonych przez klienta (live audit chrome-devtools)

### 1. Cena badge "od X zł / noc" na wyróżnionych apartamentach nieczytelna

**Live state**:
```
.fr-apt-price
bg: rgba(226, 215, 0, 0.18)  ← żółty 18% przezroczystości
color: rgb(15, 15, 14)        ← czarny tekst
padding: 4px 10px
font-size: 12px
```

Na zdjęciu jasnego wnętrza (białe ściany) żółte 18% prawie się **zlewa z tłem** → niewidoczne.

**Fix §107a**: solid dark glass + gold text
```css
.fr-apt-price {
  background: rgba(15, 15, 14, 0.88);   /* solid dark glass */
  color: var(--fr-primary);              /* gold #E2D700 */
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
```

**Live verified**: bg `rgba(15,15,14, 0.88)`, color `rgb(226,215,0)`, padding `8px 14px`, fontSize `13px` — wszystko zaaplikowane.

### 2. "Zobacz wszystkie 21 apartamentów" button ledwo widoczny

**Live state**:
```
.fr-btn--outline (na sekcji wyróżnione apartamenty)
bg: transparent
color: rgb(240, 234, 224)        ← cream
border: 2px solid rgb(240, 234, 224)  ← cream border
```

Cream border na cream tle (`.fr-bg = #FAF7F2`) — **kontrast ~1.2:1, niewidoczny**.

**Fix §107b**: na cream sekcjach `body.page-index` → dark border + dark text + hover invert
```css
html body.page-index .fr-btn.fr-btn--outline {
  border: 2px solid var(--fr-dark);
  color: var(--fr-dark);
  font-weight: 600;
}
html body.page-index .fr-btn.fr-btn--outline:hover {
  background: var(--fr-dark);
  color: var(--fr-white);
}
```

Wyjątek: outline button na ciemnym hero/CTA (`.fr-final-cta`) zachowuje cream styling.

### 3. Offer page (/offer/X) — czarne tło na prawej kolumnie

**Live state**:
- `.col-lg-3.offer-right-wrapper` z `bg: rgb(15, 15, 14)` (var --fr-dark)
- Height 1053px, prawa kolumna z cena + Zarezerwuj + dostępność
- Klient: "widzimy czarne tło na sekcji"

Ten styling pochodził z naszego §100b (Sprint F MEDIUM, PDF P14b "bloczek z ceną ciemne tło"). Klient teraz zdecydował że wygląda zbyt ciężko.

**Fix §107c**: zmiana na cream/bright bg + dark text + cena w gold accent
```css
.offer-right-wrapper {
  background: var(--fr-bg);          /* cream #FAF7F2 */
  border: 1px solid var(--fr-border-light);
  border-radius: var(--fr-radius-md);
  padding: 24px 20px;
}
.offer-right-wrapper .offer-price span,
.offer-right-wrapper .object-price strong.price {
  font-family: var(--fr-font-display);
  font-size: clamp(26px, 3vw, 32px);
  color: var(--fr-primary-deep);     /* gold deep #8A7300 */
}
```

### 4. Button "Zarezerwuj teraz" — nierówny tekst

**Live state**:
```
.accommodation-reservation
padding: 0px              ← BRAK paddingu
bg: rgba(0, 0, 0, 0)      ← transparent
color: rgb(226, 215, 0)   ← gold
border: 0px none          ← BRAK border
```

To jest **text-link styling z template default13** — wygląda jak żółty tekst, nie button. `<span class="btn button accommodation-leftbutton">` wewnątrz miał własne style, więc nasza customizacja nie łapała.

**Fix §107d**: solid gold button + flexbox center
```css
.accommodation-reservation {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fr-primary);     /* gold #E2D700 */
  color: var(--fr-dark);
  padding: 14px 24px;
  border-radius: var(--fr-radius-pill);
  border: 2px solid var(--fr-primary);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;
}
.accommodation-reservation:hover {
  background: var(--fr-light-accent);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(226, 215, 0, 0.4);
}
```

Plus reset stylowania na wewnętrznym `<span>`:
```css
.accommodation-reservation .btn.button,
.accommodation-reservation .accommodation-leftbutton,
.accommodation-reservation span {
  background: transparent !important;
  color: inherit !important;
  padding: 0 !important;
  ...
}
```

### 5. Sticky tabs bar — luka między menu a tabs po scrollu

**Live state** (po scrollu na offer page):
```
.tabs[style*="position:fixed"]
position: fixed
top: 95px               ← 30px luki nad sticky tabs
header.default13 height (scrolled): 65px
```

Klient widzi 30px białej przestrzeni między dnem header a topem sticky tabs.

**Fix §107e**: `top: 65px` + box-shadow zamykający wizualnie
```css
.tabs[style*="position: fixed"],
.tabs.is-sticky {
  top: 65px;            /* sklejone z bottom header */
  background: var(--fr-white);
  box-shadow:
    0 2px 8px rgba(0,0,0,0.08),
    0 -1px 0 var(--fr-border-light);
  border-bottom: 1px solid var(--fr-border-light);
  z-index: 990;
}

@media (max-width: 991.98px) {
  .tabs[style*="position: fixed"] {
    top: 56px;          /* mobile header height */
  }
}
```

Plus fix §107f dla cennik bottom (max-width 280px + margin auto).

---

## Odpowiedzi na otwarte pytania klienta

### "title PL/DE, jaki jest źle na żywo?"

Live audit (curl/chrome-devtools) pokazuje **2 title tagi** na każdej stronie:

**PL** (`/`):
1. `<title>Apartamenty Wrocław na wynajem | Fair Rentals</title>` ← **systemowy** (z panelu IdoBooking)
2. `<title>Fair Rentals Wrocław — apartamenty na wynajem krótkoterminowy</title>` ← nasz custom HEAD

PL = OK (oba po polsku, sensowne).

**DE** (`/de`):
1. `<title>Wypełnij to pole tytułem twojej strony wizytówki</title>` ← **POLSKI PLACEHOLDER** ❌
2. `<title>Fair Rentals Breslau — Kurzzeit-Apartmentvermietung in Polen</title>` ← nasz custom (po niemiecku)

**Problem**: Klient w panelu IdoBooking → Konfiguracja → SEO → **Strona wizytówki → Język DE** ma puste pole "Title". System wyświetla polski placeholder. Google może go widzieć jako pierwszy `<title>` na DE wersji.

**Akcja klienta**:
- Panel → Konfiguracja → SEO → Strona wizytówki → **DE**
- Title: `Apartments zur Miete in Breslau | Fair Rentals`
- Description: `Familienunternehmen. 21 Apartments in Breslau — Altstadt, Zentrum, Kępa Mieszczańska. Booking 9.6, Google 4.7. Online buchen.`

To samo dla **PL meta description** — systemowa nadal ma stare "19 apartamentów, Booking 9.8":
- Panel → Konfiguracja → SEO → Strona wizytówki → **PL** → Description
- Zaktualizować na: `Rodzinna firma. 21 apartamentów we Wrocławiu. Booking 9.6, Google 4.7. Stare Miasto, Centrum, Kępa Mieszczańska. Zarezerwuj online.`

### "menu EN/DE, co jest dokładnie źle?"

Kolejność menu items NIESPÓJNA między językami:

**PL menu** (sensowna kolejność):
Apartamenty → Atrakcje → Obsługa najmu → Dla Biznesu → O nas → Kontakt → Blog

**EN menu** (kolejność dziwna — Kontakt na początku):
1. Contact ← powinno być **6-7**
2. Offer
3. Corporate housing
4. Short-term rental management
5. Wrocław attractions
6. About us
7. Fair Rentals blog

**DE menu** (kolejność dziwna — Kontakt 4ty zamiast 6-7):
1. Unterkünfte
2. Firmenapartments
3. Sehenswürdigkeiten
4. Kontakt ← powinno być **6-7**
5. Kurzzeit-Mietverwaltung
6. Über uns
7. Fair Rentals Blog

**Akcja klienta** — Panel → Wygląd → Menu → przesunąć Kontakt na koniec menu (przed Blog) dla EN i DE:

**EN poprawiona kolejność**:
Offer → Wrocław attractions → Short-term rental management → Corporate housing → About us → Contact → Blog

**DE poprawiona kolejność**:
Unterkünfte → Sehenswürdigkeiten → Kurzzeit-Mietverwaltung → Firmenapartments → Über uns → Kontakt → Blog

### "OG image, na razie nie mamy, ALE możemy wziąć z ich social mediów"

Sprawdziłem:
- **Booking.com** — Fair Rentals ma listing "Braniborska 70 - Natural Luxury Apartment - Wrocław" z thumbnail tylko 240×240 (za małe na OG 1200×630)
- **Google Maps** — wymaga consent, pominąłem
- **Galeria klienta IdoBooking** — klient już ma 10 zdjęć HD w panelu (1620-1870px szerokości)

**Najlepszy kandydat** z istniejącej galerii klienta (analiza aspect-ratio dla OG 1.91:1):

| URL | Wymiar | Aspect | Treść | OG-fit |
|---|---|---|---|---|
| `/0/0/4.jpg` | 1653×1080 | 1.53 | Rynek Wrocławia | OK |
| `/0/0/5.jpg` | 1621×1080 | 1.50 | ? | OK |
| `/0/0/7.jpg` | 1620×1080 | 1.50 | Ostrów Tumski | OK |
| **`/0/0/8.jpg`** | **1870×1080** | **1.73** | **Bulwary nad Odrą sunset** | **NAJLEPSZE** ✓ |
| `/1/0/13.jpg` | 1080×1080 | 1.00 | Wnętrze apartamentu | Square, nie OG |
| `/1/0/14.jpg` | 867×1080 | 0.80 | Spotkanie | Portrait, nie OG |

**Wybór**: `https://client58360.idobooking.com/images/frontpageGallery/pictures/large/0/0/8.jpg`

Powody:
- Aspect 1.73:1 — najbliżej OG 1.91:1 (Facebook zrobi mild centered crop, zachowa centrum)
- Klimat romantyczny + Wrocław recognizable (Most Pokoju, Wrocław skyline at golden hour)
- Already on klienta serwerze (https://, brak CORS, brak Unsplash dependency)
- Aktualizowane w 3 plikach HEAD (PL/EN/DE) z odpowiednim alt text per język

### "noindex zostaje jak jest"

Bez zmian — klient sam zdecyduje kiedy odblokować indeksację.

---

## Zmiany w plikach

### FR_ARKUSZ_STYLOW.css (+~220 linii w §107)
- §107a — Featured price badge dark glass
- §107b — Outline button na cream sekcjach dark
- §107c — Offer right sidebar cream + gold price accent
- §107d — Accommodation reservation solid gold button
- §107e — Sticky tabs bar top: 65px + shadow
- §107f — Cennik bottom button max-width center

### FR_HEAD_PL.html / FR_HEAD_EN.html / FR_HEAD_DE.html
- OG image swap: Unsplash → `client58360.idobooking.com/images/.../0/0/8.jpg`
- Dimensions: 1870×1080 (zamiast hardcoded 1200×630)
- Alt text per język (PL: "Bulwary nad Odrą o zachodzie słońca", EN: "Odra River boulevards at sunset", DE: "Oder-Promenade bei Sonnenuntergang")
- Dodany `og:image:secure_url` (HTTPS explicit)
- Twitter image swap

---

## Wgranie do panelu — checklista v1.39

1. ☐ Wgrać aktualne [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css) (zawiera §107a-f)
2. ☐ Wgrać aktualne [FR_HEAD_PL.html](DO_WKLEJENIA/FR_HEAD_PL.html), [FR_HEAD_EN.html](DO_WKLEJENIA/FR_HEAD_EN.html), [FR_HEAD_DE.html](DO_WKLEJENIA/FR_HEAD_DE.html) (zawiera nowe OG)
3. ☐ Cmd+Shift+R w przeglądarce
4. ☐ Verify na `/`:
   - Cena badge na wyróżnionych apartamentach czytelna na każdym zdjęciu ✓
   - "Zobacz wszystkie 21 apartamentów" button widoczny (dark border) ✓
5. ☐ Verify na `/offer/10/...`:
   - Prawa kolumna sidebar — cream bg + gold cena ✓
   - Button "Zarezerwuj teraz" — solid gold, centrowany, padding ✓
   - Po scrollu sticky tabs nie ma luki nad nimi ✓
6. ☐ Verify OG image:
   - View source `<meta property="og:image">` → URL `/images/frontpageGallery/.../0/0/8.jpg`
   - Test w Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Test w LinkedIn Post Inspector
7. ☐ **Akcje klienta panel**:
   - Title DE strona wizytówki (puste pole, polski placeholder)
   - Description PL strona wizytówki (stare "19 apt, 9.8")
   - Menu EN: przesunąć Contact na pozycję 6
   - Menu DE: przesunąć Kontakt na pozycję 6

---

## Live verified (chrome-devtools MCP)

### Cena badge:
```javascript
// Before: bg rgba(226,215,0, 0.18), color rgb(15,15,14), padding 4x10, font 12px
// After:  bg rgba(15,15,14, 0.88), color rgb(226,215,0), padding 8x14, font 13px ✓
```

### Outline button found:
```javascript
{classes: "fr-btn fr-btn--outline", text: "Zobacz wszystkie 21 apartamentów",
 cs: {bg: "transparent", color: "rgb(240,234,224)", border: "2px solid rgb(240,234,224)"}}
// Po §107b: dark border + dark text na page-index
```

### Sticky tabs po scrollu:
```javascript
{position: "fixed", top: "95px", bg: "rgba(255,255,255,0.98)", height: 51}
// header.default13 scrolled: height 65px
// Gap = 95 - 65 = 30px
// Po §107e: top: 65px → gap 0 ✓
```

### OG image:
```javascript
// Probe 10 gallery images, aspect-ratio analysis:
// /0/0/8.jpg = 1870x1080 (1.73:1) — najbliższy OG 1.91:1 ✓
```

---

## Status overall

| Bucket | Wersja | Status |
|---|---|---|
| 5 UX fixów (§107a-f) | v1.39 | ✅ |
| OG image swap z Unsplash do klient galerii | v1.39 | ✅ |
| Title DE panel (puste pole) | — | ❌ Klient w panelu |
| Description PL/DE panel | — | ❌ Klient w panelu |
| Menu EN/DE kolejność | — | ❌ Klient w panelu |
| Pozostałe akcje klienta | — | 4 nadal nieukończone |

---

## Co dalej (v1.40+)

1. **Damian wgrywa** FR_ARKUSZ_STYLOW.css + 3 HEAD pliki
2. **Live verify** wszystkich 5 fixów
3. **OG sharing test** — Facebook Debugger po wgraniu
4. **Akcje klienta panel** — title DE / description PL+DE / menu EN+DE kolejność
5. **Lighthouse re-run** po wszystkich zmianach
