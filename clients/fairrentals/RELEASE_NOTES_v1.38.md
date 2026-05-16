# Fair Rentals — Release v1.38 (Post-deploy 4 fixes)

**Data**: 2026-05-15 (sesja 7 — fixy zgłoszone przez klienta po wgraniu v1.37 + włączeniu modułu Aktualności)
**Stan przed**: v1.37 (blog v4 systemic /news scraper)
**Stan po**: v1.38 (4 fixy z feedbacku klienta)

---

## 4 problemy zgłoszone przez klienta (live audit chrome-devtools)

### 1. Systemowy widget aktualności pojawia się na home

**Problem**: Po włączeniu modułu Aktualności IdoBooking, na stronie głównej pojawia się sekcja z kartami newsów (klasa `.news-container` / `.news-wrapper`). Klient nie chce żeby blog był widoczny na home — tylko gdy ktoś kliknie "Blog" w menu.

**Fix CSS §106a**:
```css
html body.page-index .news-container,
html body.page-index .news-wrapper,
html body.page-index .news-list,
html body.page-index .cmsnews,
html body.page-index .section .news-container {
  display: none !important;
}
```

### 2. Powered by IdoBooking ma `width: 0px` (lazy load nie odpalił)

**Problem**: Img w stopce ma `src=null`, tylko `data-src` ustawione. Lazy load library nie zaintersowała tego elementu — `naturalWidth: 0`, `offsetWidth: 0`. Klient widzi puste miejsce zamiast badge "Powered by IdoBooking".

**Fix JS** w FR_KONIEC_BODY (nowa funkcja `forceLoadPoweredBy`):
```js
function forceLoadPoweredBy() {
  var imgs = document.querySelectorAll('.powered_by img, .powered_by_logo img, img.powered_by_logo');
  imgs.forEach(function(img) {
    var dataSrc = img.getAttribute('data-src');
    var currentSrc = img.getAttribute('src');
    if (dataSrc && (!currentSrc || currentSrc === '')) {
      img.setAttribute('src', dataSrc);
    }
  });
}
```

Wywoływana w `boot()` + retry po 1s i 3s (dla edge case gdy panel system załaduje obrazek później).

**Fix CSS §106d**: dodaje `min-width: 120px` na kontener powered_by + fallback `::after` z tekstem "Powered by idoBooking" gdyby img miał pusty src.

**Live verified**:
```
Before: src=null, naturalWidth=0, offsetWidth=0
After:  src='/images/.../powered_by.svg', naturalWidth=120, offsetWidth=60 ✓
```

### 3. Dropdown menu "..." znika gdy najeżdżasz myszką na Blog/Kontakt

**Problem**: System Idosell tworzy `.menuOverflow.nav-item` z "..." trigger gdy menu nie mieści się w linii. Nasz §103a stylizował dropdown z `margin-top: 8px` — kursor traci hover na trigger przed dotarciem do dropdown (klasyczny hover gap bug).

**Fix CSS §106b**:
- `margin-top: 0` na `.sub-navi` (dropdown przykleja się bezpośrednio do triggera)
- `padding-top: 12px` na `.sub-navi` (wizualne odsunięcie wewnętrzne)
- `padding-bottom: 12px` na `.menuOverflow.nav-item` (rozszerza hover area triggera w dół)
- `::before` pseudo-bridge na dropdown jako fallback (invisible row łączący trigger z dropdown)

Po fix: kursor może przejść z "..." do dowolnej pozycji dropdown bez utraty hover.

### 4. Białe tło dropdown na home — wystaje nad hero photo

**Problem**: Na stronie głównej header jest transparent (chip białe dla loga, reszta przejrzysta) — biały dropdown menu nie pasuje wizualnie do hero photo.

**Fix CSS §106c**: 
- `backdrop-filter: blur(8px)` na dropdown na home (efekt szkła)
- Subtelny border z `rgba(255,255,255,0.5)` (smooth granica)
- Wzmocniony box-shadow dla głębi
- Arrow indicator pod triggerem ("...") wskazujący kierunek dropdown — wizualnie łączy

```css
html body.page-index header.default13:not(.fr-header--scrolled) .menuOverflow .sub-navi {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.12) !important;
}

/* Arrow indicator pod trigger */
html body header .menuOverflow.nav-item:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  /* ...arrow shape... */
  border-bottom: 6px solid rgba(255, 255, 255, 0.98);
}
```

---

## Zmiany w plikach

### FR_ARKUSZ_STYLOW.css (+~90 linii w §106)
- §106a — Hide systemic news widget on homepage
- §106b — Dropdown menu hover gap fix
- §106c — Dropdown homepage backdrop blur + arrow indicator
- §106d — Powered_by min-width + fallback text

### FR_KONIEC_BODY.html
- Nowa funkcja `forceLoadPoweredBy()` — fix lazy load null src
- Wywołanie w `boot()` + retry po 1s i 3s

---

## Wgranie do panelu — checklista v1.38

1. ☐ Wgrać aktualne [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css) (zawiera §106a-d)
2. ☐ Wgrać aktualne [FR_KONIEC_BODY.html](DO_WKLEJENIA/FR_KONIEC_BODY.html) (zawiera forceLoadPoweredBy)
3. ☐ Cmd+Shift+R w przeglądarce
4. ☐ Verify na /:
   - Brak kart aktualności na home ✓
   - Powered_by w stopce widoczne ✓
   - Menu "..." dropdown nie znika przy mouseover do items ✓
5. ☐ Verify na /pl/txt/205/Blog:
   - Karty newsów się ładują (z systemowego /news scrapera v1.37)
6. ☐ Verify na /news:
   - Lista aktualności stylizowana Fair Rentals brand
7. ☐ Verify na /news/X/slug (jakiś post):
   - Typografia post page (h1, data, treść)
   - "← Wróć do listy" link na końcu

---

## Live verified (chrome-devtools MCP)

### Fix #2 powered_by — przed/po:
```javascript
// PRZED (live state):
{src: null, dataSrc: "/images/.../powered_by.svg", offsetWidth: 0, naturalWidth: 0}

// PO symulacji forceLoadPoweredBy:
{src: "/images/.../powered_by.svg", naturalWidth: 120, offsetWidth: 60, complete: true}
```

### Fix #1 news widget — przed:
```
.news-container existing: TRUE
.news-wrapper existing: TRUE
.news-item existing: TRUE
display: block (visible)
```
Po §106a CSS: `display: none !important` — wszystkie ukryte na page-index.

### Fix #3 dropdown — symulacja na 1024px viewport:
- `.menuOverflow.nav-item` pojawia się gdy menu nie mieści (7 items)
- Po §106b: trigger ma `padding-bottom: 12px`, dropdown `margin-top: 0` + `padding-top: 12px`
- Kursor może bezpiecznie przejść z trigger do każdej pozycji dropdown

---

## Status overall

| Bucket | Wersja | Status |
|---|---|---|
| News widget hide na home | v1.38 | ✅ §106a |
| Powered_by lazy load fix | v1.38 | ✅ §106d + forceLoadPoweredBy JS |
| Dropdown hover gap | v1.38 | ✅ §106b |
| Dropdown bg na home | v1.38 | ✅ §106c (backdrop blur + arrow) |
| Klient włączył moduł Aktualności | v1.37 | ✅ Działa, dodał pierwszą aktualność |
| Blog scraper /news | v1.37 | ✅ Po wgraniu v1.37 JS będzie działać |
| Pozostałe akcje klienta panelu | — | ❌ 8 SEO/menu nadal nieukończone |

---

## Co dalej

1. **Damian wgrywa** zaktualizowane FR_ARKUSZ_STYLOW.css + FR_KONIEC_BODY.html
2. **Live verify** wszystkich 4 fixów po refresh
3. Jeśli klient ma jeszcze "Aktualności" w menu jako duplikat Blog → klient usuwa z menu (jak sam napisał: "ukryłem aktualności, bo to samo co blog")
4. **Pozostałe akcje klienta** w panelu (8 SEO/menu) — nadal czeka
