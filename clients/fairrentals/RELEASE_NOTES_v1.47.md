# Fair Rentals — RELEASE NOTES v1.47 (2026-05-16)

**Bazuje na**: v1.46 (deploy live potwierdzony 2026-05-16)
**Wynika z**: Audyt LIVE 2026-05-16 + 6 uwag klienta (Damian)
**Pliki zmienione**: 2
- `DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css` — dodana sekcja §109 (a-g)
- `DO_WKLEJENIA/FR_KONIEC_BODY.html` — dodana funkcja `sanitizeTelLinks()` + wywołania

---

## Zmiany w skrócie

| # | Komponent | Problem | Fix |
|---|-----------|---------|-----|
| §109a | Mapa /contact | top: 4497px (za 4242px kontentu) — klient nie widzi mapy | `flex-direction: column` + `order: -1` na `.leaflet-container` → mapa NAD treścią |
| §109b | /offers mobile filtry | `.filter_header` bez data-toggle, jQuery.collapse nie załadowany → klient nie może rozwinąć | Auto-expand wszystkich `.filter_content` na mobile <992px (pointer-events:none na header) |
| §109c | /offers "Zastosuj filtry" | napis niewyśrodkowany, asymetryczny padding | `display:flex` + `align-items/justify-content: center` + symmetric padding |
| §109d | O nas hero (.fr-page-hero) | bg transparent → szary systemowy tło widoczne | Cream gradient `linear-gradient(135deg, #faf7f2, #fff, #f4ece2)` + decorative gold ribbon na top |
| §109e | DE/PL `.menuOverflow.sub-navi` | systemowy bg: rgba(255,255,255,0.98) — białe popup pod 3 kropki | Dark brand bg `rgba(15,15,14,0.96)` + backdrop blur + white text + gold hover |
| §109f | Mobile grid `.fr-apt-grid` | hardcoded `320px` → karta wycieka na iPhone SE | `minmax(280px, 1fr)` + special case dla <360px |
| §109g | tel: links | klient wpisał "+48 575092755" w panelu → tel:URI ze spacją (RFC 3966 niezgodne) | JS `sanitizeTelLinks()` po DOMContentLoaded + 2× setTimeout retry |

---

## Szczegóły

### §109a + §109a-fix — Mapa /contact (klient: "Na contakc nie ma dalej mapy/ nie działa")

**Diagnoza** (MCP eval — 2 sesje 2026-05-16):

**Sesja 1**: Leaflet działa technicznie — 1185×420, 10 tiles loaded, 21 markers. Top: 4497px (pod 4242px kontentu). Klient nie scrollował tak nisko.

**Sesja 2** (po wczytaniu screenshot klienta): Klient widzi mapę **PUSTĄ** (tylko +/- zoom buttons, brak tiles).
- `window.mymap.getSize()` zwraca `{x: 1105, y: 420}` (Leaflet wie wymiary)
- ALE `.leaflet-map-pane.offsetHeight = 2px` (powinien być 420)
- `.leaflet-tile-pane: width:0, height:0`
- Tiles fizycznie pobrane (10/10 complete: true), ale renderowane na `top:4538, left:489` z `mapPane height: 2px` → CLIP'uje je
- Manualny `invalidateSize({animate: false, pan: false})` **NIE pomógł** (bug systemowy)
- **2 instancje LMap w window** (wpływa na recovery?)

**Root cause**: bug systemowy IdoBooking template default13 — Leaflet inicjalizuje się gdy container ma width=0/height=0 (przed naszym CSS), tiles ładują się ze złym viewport, mapPane pozostaje 2px nawet po późniejszym CSS sizing.

**Fix — 3 warstwy obrony**:

**1. CSS §109a (layout)** — przesunięcie mapy NAD treść:
```css
.contact-page > .contact { display: flex; flex-direction: column; }
.contact-page > .contact > .leaflet-container {
  order: -1; margin-bottom: 2.5rem; border-radius: 16px;
}
@media (max-width: 767px) { .leaflet-container { height: 320px; } }
```

**2. CSS §109a-fix (panes recovery)** — wymuszenie wymiarów Leaflet panes:
```css
.leaflet-container .leaflet-map-pane,
.leaflet-container .leaflet-pane.leaflet-map-pane {
  width: 100% !important; height: 100% !important;
  position: absolute !important; top: 0 !important; left: 0 !important;
}
.leaflet-container .leaflet-tile-pane {
  width: 100% !important; height: 100% !important;
  overflow: visible !important;
}
```

**3. JS `fixSystemicLeafletMap` (wzmocnione)** — 4 metody recovery + fitBounds:
```js
function triggerInvalidate() {
  var mapRef = window.mymap || window.map;
  // 1. Standard invalidateSize
  mapRef.invalidateSize({animate: false, pan: false});
  // 2. Force _onResize (internal Leaflet)
  if (mapRef._onResize) mapRef._onResize();
  // 3. Re-set view (wymusza re-render tiles)
  var center = mapRef.getCenter(); var zoom = mapRef.getZoom();
  mapRef.setView(center, zoom, {animate: false, reset: true});
  // 4. Global resize event
  window.dispatchEvent(new Event('resize'));
  // 5. After 250ms — fitBounds wszystkich markerów (best recovery)
  setTimeout(function() {
    var bounds = null;
    Object.values(mapRef._layers).forEach(function(layer) {
      if (layer.getLatLng) {
        var ll = layer.getLatLng();
        if (!bounds) bounds = L.latLngBounds(ll, ll); else bounds.extend(ll);
      }
    });
    if (bounds && bounds.isValid()) {
      mapRef.fitBounds(bounds, {padding: [40,40], animate: false, maxZoom: 14});
    }
  }, 250);
  // 6. After 600ms — final invalidate
  setTimeout(function() { mapRef.invalidateSize({animate: false}); }, 600);
}
```

IntersectionObserver wywołuje triggerInvalidate **3 razy** (immediate + 300ms + 1000ms) — system bug ma dziwne timing.

**Efekt po deploy v1.47**:
- §109a: mapa pojawia się NAD treścią (top ~600px zamiast 4500px)
- §109a-fix CSS: mapPane wymuszony na 100% wymiarów containera
- JS recovery: tiles przecalkulowywane 3×, fitBounds do 21 markerów

---

### §109b + §109c — /offers mobile filtry + button

**Diagnoza** (MCP eval na 375×667):
- `.filter_header[0]` (Typ obiektu) — cursor:pointer ✅ ale `data-toggle: null, data-target: null, onclick: null`
- `bootstrapLoaded: false`, `jQuery.fn.collapse: undefined` — Bootstrap collapse plugin **nie załadowany**
- Click → `.filter_content.collapse` nadal 0×0
- "Zastosuj filtry" button width:0 height:0 (ukryty wewnątrz collapsed parent)

**Root cause**: bug systemowy template default13 — headery są klikalne wizualnie (cursor:pointer + JS handler dodany przez nasz `initFilterCollapse`), ale CSS reguła `.filter_content.collapse:not(.show)` z naszego CSS blokuje display nawet po dodaniu `.show` class. Lub: handler nie odpala w niektórych przypadkach.

**Fix** (zamiast walczyć z toggle):
- Na **mobile <992px** wszystkie filtry **zawsze rozwinięte** (auto-expand)
- `.filter_header` na mobile: `cursor:default; pointer-events:none` (decorative)
- Visual separators między grupami filtrów (border-bottom dashed)
- Button "Zastosuj filtry": full width na mobile + flex center

**Desktop ≥992px**: toggle nadal działa (CSS §3235-§3243 z poprzednich wersji).

---

### §109d — O nas hero gradient

**Klient**: *"W 'O nas' daj jakiś pasujacy gradient cała strona na górze jest szara"*

**Diagnoza**: `section.fr-page-hero` ma `bg: rgba(0,0,0,0)` (transparent) — systemowy szary `.page-txt` bg widoczny przez warstwę hero.

**Fix**: cream gradient z subtelnym brand accent:
```css
section.fr-page-hero {
  background:
    linear-gradient(135deg, #faf7f2 0%, #fff 45%, #f4ece2 100%) !important;
}
section.fr-page-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #e2d700, #f4ee8a, #e2d700);
}
```

Dotyczy wszystkich stron `.page-txt`: /O-nas, /Atrakcje, /Obsługa-najmu, /Dla-biznesu, /Blog (gdy korzysta z `.fr-page-hero`).

---

### §109e — `.menuOverflow.sub-navi` popup bg

**Klient**: *"na zagranicznej wersji np. niemieckiej, jak się klika 3 kropki bo się nie mieści menu, tło wyskakujace pod listą jest białe tak jak na zrzucie ma być spójnie jak na wersji PL"*

**Diagnoza**:
- DE menu (viewport 1280): "Sehenswürdigkeiten" (18 chars) + "Kurzzeit-Mietverwaltung" (23 chars) wymuszają overflow → nav-toggler "Weitere Menüs anzeigen" (20×20) pokazuje popup
- Popup `UL.menuOverflow.sub-navi` ma `bg: rgba(255,255,255,0.98)` (systemowy default13)
- **Nasz CSS NIGDY tego nie nadpisywał** (grep "menuOverflow" → 0 matches przed v1.47)
- PL homepage 1100px: tylko 1 item ("Blog") w overflow, wyświetla się inline jako LI bez popup → "spójność" o której mówi klient

**Fix** (§109e): dark brand bg + biały tekst + gold hover na popup, niezależnie od języka:
```css
ul.menuOverflow.sub-navi {
  background: rgba(15, 15, 14, 0.96) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(226, 215, 0, 0.15) !important;
  border-radius: 12px !important;
  box-shadow: 0 12px 32px rgba(15,15,14,0.18) !important;
}
.menuOverflow li a {
  color: #fff !important;
  padding: 10px 18px !important;
}
.menuOverflow li a:hover {
  background: rgba(226, 215, 0, 0.12) !important;
  color: #e2d700 !important;
}
```

---

### §109f — Mobile grid `.fr-apt-grid`

Audyt v1.46: `grid-template-columns: 320px` (hardcoded). Na iPhone SE 320px viewport karta wycieka.

**Fix**:
```css
@media (max-width: 767px) {
  .fr-apt-grid { grid-template-columns: minmax(280px, 1fr) !important; }
}
@media (max-width: 359px) {
  .fr-apt-grid {
    grid-template-columns: 1fr !important;
    padding: 0 0.5rem !important;
  }
}
```

---

### §109g — JS `sanitizeTelLinks()` (RFC 3966)

**Diagnoza**: klient wpisał w panelu Dane firmy `+48 575092755` (ze spacją między kodem kraju a numerem). System IdoBooking generuje wszędzie `<a href="tel:+48 575092755">`. RFC 3966 mówi że tel: URI nie zawiera whitespace — niektóre urządzenia (starsze Androidy, niektóre VoIP apki) mogą nie zadzwonić.

**Fix** (JS w FR_KONIEC_BODY):
```js
function sanitizeTelLinks() {
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a) {
    var href = a.getAttribute('href');
    var cleaned = href.replace(/\s+/g, '');
    if (cleaned !== href) a.setAttribute('href', cleaned);
  });
}
```

Wywołania:
- W `boot()` — pierwszy raz po DOMContentLoaded
- `setTimeout(sanitizeTelLinks, 800)` — po system render
- `setTimeout(sanitizeTelLinks, 2500)` — po lazy-load lub late inject

Visible text (textContent z numerem) zachowujemy — klient widzi `+48 575092755` formatowany czytelnie, ale tel:URI ma `tel:+48575092755` (RFC compliant).

---

## OG Description PL/EN/DE — propozycja dla panelu klienta

Klient musi zaktualizować w Panel → Konfiguracja → SEO → OG Description (osobno PL/EN/DE):

**PL**:
```
Rodzinna firma, 21 apartamentów we Wrocławiu. Booking 9.6, Google 4.7.
Sprawdź dostępność i zarezerwuj online — potwierdzenie natychmiast.
```

**EN**:
```
Family-run, 21 apartments in Wrocław. Booking 9.6, Google 4.7.
Check availability and book online — instant confirmation.
```

**DE**:
```
Familienunternehmen, 21 Apartments in Breslau. Booking 9.6, Google 4.7.
Verfügbarkeit prüfen und online buchen — sofortige Bestätigung.
```

---

## Akcje klienta nadal blokujące

Niezależne od v1.47 deploy:

1. 🔴 **P0 indeksacja** — odznaczyć "Strona w wersji deweloperskiej" (Panel → Konfiguracja → SEO)
2. 🔴 **DE Title homepage**: aktualnie `"partments in Breslau mieten | Fair Rentals"` — **brak pierwszej litery "A"** (klient wpisał bez "A"). Poprawić w Panel → Wygląd → Strona wizytówki DE → Title na: `"Apartments in Breslau mieten | Fair Rentals"`
3. 🔴 **OG description PL/EN** — stare "19 apartamentów / 9.8" → wstawić propozycje powyżej
4. 🔴 **OG image** — wszędzie `http://` — ponownie wgrać żeby system wymusił `https://`
5. 🟡 **Menu EN/DE** — Contact/Kontakt na pozycję 6-7 (drag & drop w Panel → Wygląd → Menu)
6. 🟡 **Telefon w Dane firmy** — zmień z `+48 575092755` (ze spacją) na `+48575092755` (bez spacji)
7. 🟢 **Blog post #1** — dodać polskie znaki w title + lead ("10 atrakcji **Wrocławia**, **które** musisz **zobaczyć**" + lead z "Wrocławiu", "zobaczyć", "dotrzeć")
8. 🟢 **Strona /txt/205/Blog** — wyczyścić pole Treść strony w panelu (duplikat hero) lub zostawić (mniej elegancko)
9. 🟢 **Małgorzata Banaś** — decyzja A/B/C (zostaw/usuń/pracownik)

**Akceptujemy (limitacja systemu IdoBooking)**:
- /contact title + meta description puste 3 jęz — system nie pozwala edytować mety dla strony /contact

---

## Wymagana akcja Damian

1. Otworzyć w panelu IdoBooking Fair Rentals
2. Zakładka **CSS** — wkleić zawartość `DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css` (cały plik, zastępując poprzednią wersję)
3. Zakładka **Skrypty → Koniec body** — wkleić `DO_WKLEJENIA/FR_KONIEC_BODY.html`
4. Zapisać + sprawdzić live:
   - https://client58360.idobooking.com/contact (mapa NAD treścią)
   - https://client58360.idobooking.com/offers (mobile filtry rozwinięte)
   - https://client58360.idobooking.com/txt/204/O-nas (gradient hero)
   - https://client58360.idobooking.com/de (3 kropki popup ciemny)
5. Klient dosyła:
   - DE Title poprawione ("**A**partments...")
   - OG description PL/EN/DE (3 teksty)
   - OG image https
   - P0 indeksacja włączona

---

## Wersjonowanie

- v1.32 → v1.46: 14 wersji w sesji 2026-05-15 (sprint UX + Blog + post-deploy fixy)
- **v1.47**: 6 fixów post-audyt LIVE 2026-05-16
- Następna: v1.48 — czeka na klienta (DE title, OG, P0 indeksacja, decyzja Małgorzata)
