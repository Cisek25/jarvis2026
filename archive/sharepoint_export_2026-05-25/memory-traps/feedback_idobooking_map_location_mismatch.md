---
name: IdoBooking system map — location ID mismatch + interceptor pattern
description: System mapy IdoBooking ma dwa różne mapowania ID (data-location na markerze vs location w book-now widget). Linki popupów mogą prowadzić na złe oferty. Fix przez event delegation capture-phase.
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Problem

System IdoBooking (`/offers` ma Leaflet map z markerami apartamentów) generuje popup:

```html
<a onclick="generateWidgetIdoSellBooking(this)"
   data-currency="1" data-language="1" data-location="N">
  Zobacz ofertę
</a>
```

Po kliknięciu `book-now/index.php?location=N` ALE — system ma DWA OSOBNE mapowania ID:
- `data-location` na markerze (z modułu lokalizacji adresów)
- `location` w book-now widget (z modułu rezerwacji)

Te ID **nie zawsze pasują**. Np. Fair Rentals: marker Czysta 4 = data-location=19, ale book-now/?location=19 pokazywało "Sleep and Fly" (offer 28). Lokalizacja=30 prowadziła na "Brak ofert".

# Detection

Audytuj live: kliknij marker → sprawdź URL → porównaj z `/offer/N/<slug>` pages. Jeśli `book-now?location=N` pokazuje inny apartament niż `/offer/N` — masz ten bug.

# Fix — event delegation interceptor

W body_bottom JS dodaj capture-phase click handler na document, który przejmuje klik PRZED system handler:

```javascript
function interceptMapPopupClicks() {
  if (document.__frMapClickHooked) return;
  document.__frMapClickHooked = true;
  document.addEventListener('click', function(e) {
    var a = e.target && e.target.closest && e.target.closest('a[data-location]');
    if (!a) return;
    var oc = a.getAttribute('onclick') || '';
    if (oc.indexOf('generateWidgetIdoSellBooking') === -1) return;
    var lid = a.getAttribute('data-location');
    if (!lid) return;
    // Build slug map from /offer/N/ links in DOM
    var slugMap = {};
    var anchors = document.querySelectorAll('a[href*="/offer/"]');
    for (var i = 0; i < anchors.length; i++) {
      var mm = anchors[i].href.match(/\/offer\/(\d+)\/[^?#]+/);
      if (mm && !slugMap[mm[1]]) slugMap[mm[1]] = anchors[i].href;
    }
    if (!slugMap[lid]) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    window.location.href = slugMap[lid];
  }, true);  // CAPTURE PHASE
}
```

# Dlaczego event delegation a nie rewrite popup HTML

- Popup może być re-tworzony przez Leaflet po pan/zoom — rewrite zniknie
- Capture phase runs PRZED system handler — niezawodne
- Slug map budowany on-demand z DOM — działa też dla EN/DE (każda wersja ma swoje slugi)

# Reference: Fair Rentals v1.50

Pierwszy raz wdrożone: `_source/FR_KONIEC_BODY_ZRODLO.html` funkcja `interceptMapPopupClicks()`. Klient: Czysta 4 z mapy prowadziła na Sleep and Fly. Fix v1.50.
