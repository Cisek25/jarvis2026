---
name: every-image-lightbox
description: KAŻDE zdjęcie na stronie MUSI być klikalne i otwierać lightbox — wyjątek tylko dla ikon <40px, elementów w headerze/footerze/loga i zdjęć wewnątrz linków nawigacyjnych. initLightbox skanuje ALL <img>, nie whitelistę.
type: instinct
scope: all-clients
trigger: każda strona klienta, każdy nowy komponent z <img>, KAŻDY audyt
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "KAZDE zdjecie powinno byc klikalne!!! i zapamietaj to na zawsze do jarvisa"
previous_versions: CLAUDE.md trap #7 (niekompletny — whitelist selektorów)
---

# Instynkt: KAŻDE zdjęcie klikalne przez lightbox

## Reguła (absolutna)
**Na KAŻDEJ stronie klienta KAŻDY `<img>` musi być klikalny.**
Kliknięcie → lightbox z pełnym obrazem, nawigacją prev/next, ESC zamyka.

To nie jest „nice to have" — to oczekiwanie użytkownika 2026 roku.
Brak lightboxa = klient zgłasza bug.

## Skąd ta reguła (historia)
- **ECC, Madera, Najmar, Mountain Prestige** — wszyscy klienci zgłaszali
  ten sam feedback: "a dlaczego to zdjęcie nie powiększa się po kliknięciu?"
- **CLAUDE.md trap #7** istniał już wcześniej, ale był implementowany
  niekonsekwentnie (whitelist selektorów — łatwo zapomnieć dodać nowy
  typ karty)
- **apartamenty-parkowe (2026-04-21)** — user zgłosił explicit: karty
  atrakcji na /lokalizacja nie były klikalne, bo nie były dodane do
  whitelisty. Decyzja: odwrócić logikę na **blacklist**.

## Implementacja (blacklist, nie whitelist!)

```javascript
function initGalleryLightbox() {
  var EXCLUDE_ANCESTORS = [
    'header', 'footer', '.menu-wrapper', '.footer-contact-baner',
    '.powered_by', '.powered_by_logo', '.ap-lightbox',
    '.navbar-brand', '.logo', '.news-container'
  ];
  var MIN_SIZE = 40;  // px — ikony mniejsze pomijamy

  function isExcluded(img) {
    // opt-out flag
    if (img.hasAttribute('data-no-lightbox')) return true;

    // wewnątrz linku (!= #) — niech link działa
    var linkParent = img.closest('a[href]');
    if (linkParent) {
      var href = linkParent.getAttribute('href') || '';
      if (href && href !== '#' && !href.startsWith('#')) return true;
    }

    // excluded ancestor
    for (var i = 0; i < EXCLUDE_ANCESTORS.length; i++) {
      if (img.closest(EXCLUDE_ANCESTORS[i])) return true;
    }

    // rozmiar
    var rect = img.getBoundingClientRect();
    var w = Math.max(rect.width, img.naturalWidth || 0);
    var h = Math.max(rect.height, img.naturalHeight || 0);
    if (w > 0 && w < MIN_SIZE) return true;
    if (h > 0 && h < MIN_SIZE) return true;

    // bez src
    var src = img.getAttribute('src') || img.src || '';
    if (!src || src.indexOf('data:image/svg') === 0) return true;

    return false;
  }

  var allImgs = Array.from(document.querySelectorAll('img'));
  var validImgs = allImgs.filter(function (img) { return !isExcluded(img); });
  if (!validImgs.length) return;

  // ... modal + handlers (prev/next/ESC)
}
```

Pełna implementacja: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html` §14.

## Zasady exclude

### ✅ Otwiera lightbox (default)
- `.ap-gallery__item img`
- `.ap-about__img`, `.ap-location__img`
- `.ap-banner-image img`
- `.ap-split__img img`
- `.ap-attraction-card__img img` (karty atrakcji /lokalizacja)
- `.ap-narrative__img img`
- Każda `<img>` w sekcjach content (hero content, o-nas, galeria, itd.)

### ❌ Wyłączony z lightbox
- Wewnątrz `header`, `.menu-wrapper`, `.navbar-brand`, `.logo`
  (logo, nav, system widgets — użytkownik nie chce zoom na logo)
- Wewnątrz `footer`, `.footer-contact-baner`, `.powered_by`
- Wewnątrz linku `<a href="...">` innego niż `#`:
  - `.ap-offer-card` (link do /offer/X — niech nawiguje)
  - `.ap-blog-card` (link do pełnego wpisu — niech nawiguje)
  - Main nav links
- `<img>` < 40px (ikony, flagi, avatary)
- `<img>` z atrybutem `data-no-lightbox` (opt-out manualny)
- Empty src / SVG data URI

### ⚠️ Dyskusyjne (case-by-case)
- `.ap-offer-card` — obecnie opakowany w `<a>` → nie otwiera lightbox.
  Jeśli klient chce zoom zdjęcia + link → zrób dwa elementy: `.ap-offer-card__img`
  (lightbox, `data-no-link`) i `.ap-offer-card__cta` (link nawigacyjny)
- Hero parallax slider images — często są w `<figure>` bez linku i mają
  duży rozmiar → OTWORZĄ się w lightbox. Zwykle OK, ale jeśli to tylko
  decoracyjne tło → dodaj `data-no-lightbox`

## Opt-out manualny
Gdy konkretne zdjęcie nie powinno otwierać lightboxa:
```html
<img src="..." alt="..." data-no-lightbox>
```

## Weryfikacja live
Po wklejeniu do panelu:
```javascript
// DevTools console:
document.querySelectorAll('img').forEach(img => {
  if (img.style.cursor === 'zoom-in') console.log('✓ clickable:', img.src.slice(-50));
  else if (!img.closest('header, footer, .menu-wrapper, a[href]:not([href="#"])'))
    console.log('✗ MISSING LIGHTBOX:', img);
});
```

Przeklik test:
1. Hero → kliknij zdjęcie → lightbox otwiera
2. /galeria → każde zdjęcie → lightbox otwiera
3. /lokalizacja → kliknij każde zdjęcie atrakcji → lightbox otwiera (nowe!)
4. /blog-post → kliknij zdjęcie wpisu → lightbox otwiera
5. Karta apartamentu na homepage → klik przenosi do /offer (NIE lightbox)
6. Logo → brak zmiany cursor, brak lightbox

## Historia changelog (apartamenty-parkowe)

### v1 (stan do 2026-04-21)
Whitelist: `.ap-gallery__item, .ap-about__img, .ap-location__img,
.ap-banner-image img, .ap-zoomable`. Nowe komponenty (np. attraction-card)
wymagały pamiętać dodać do whitelisty — często zapomniane.

### v2 (2026-04-21) — KAŻDY img
Blacklist — skanuje `document.querySelectorAll('img')` i filtruje
EXCLUDE_ANCESTORS + link wrapping + min size. Nowe komponenty działają
out-of-the-box, bez aktualizacji whitelisty.

## Kiedy to stosować
- **Zawsze** przy budowaniu nowej strony
- **Audyt** istniejącej strony: sprawdź czy każda `<img>` ma `cursor: zoom-in`
- **Nowy komponent z obrazem**: nie dodawaj do whitelisty — blacklist to
  załatwi automatycznie
- **Gdy klient zgłasza**: "nie mogę kliknąć tego zdjęcia" → prawie zawsze
  to jest to

## Referencja
- Client: apartamenty-parkowe (client58154)
- User feedback 2026-04-21: "w podstornie lokalizacja, zdjecia powinny
  byc klikalne i ogolnie KAZDA zdjecie powinno byc klikalne!!!
  i zapamietaj to na zawsze do jarvisa"
- Implementation: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html` §14
- Replaces: CLAUDE.md trap #7 (upgrade z whitelist do blacklist)
