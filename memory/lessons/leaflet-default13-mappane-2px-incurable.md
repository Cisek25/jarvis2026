# Lesson — Leaflet w IdoBooking default13: .leaflet-map-pane height = 2px (bug nieuleczalny)

**Data**: 2026-05-16
**Projekt**: Fair Rentals v1.47 → v1.48 (rezygnacja z Leaflet)
**Severity**: 🚨 BLOCKER — mapa NIE wyświetla się klientom

## Symptom

Klient screenshot: pusta sekcja 1185×420 z samymi +/- zoom buttons w lewym górnym rogu.
Brak tile'ów. Po przesunięciu mapy myszą tile'y nie ładują się.

Klient: *"jak przesuniesz mape to nie widac…może z google jakos się da lepiej nie wiem :/ dziwnie"*

## Diagnoza (MCP)

```js
// Leaflet wie wymiary container
window.mymap.getSize()  // → {x: 1105, y: 420} ✅

// ALE DOM mówi co innego
document.querySelector('.leaflet-container').offsetHeight  // 420 (OK)
document.querySelector('.leaflet-map-pane').offsetHeight   // 2  ❌
document.querySelector('.leaflet-tile-pane').offsetWidth   // 0  ❌
document.querySelector('.leaflet-tile-pane').offsetHeight  // 0  ❌

// Tiles są fizycznie pobrane:
const tiles = document.querySelectorAll('.leaflet-tile');
tiles.length;                       // 10
tiles[0].complete;                  // true
tiles[0].naturalWidth;              // 256
tiles[0].getBoundingClientRect();   // {top: 4538, left: 489, width: 256, height: 256}

// ALE pozycja jest poza viewport mapy
// Map container: top: 4526, height: 420 → bottom: 4946
// Tile top: 4538 → mieści się W container
// JEDNAK mapPane (parent tiles) ma height: 2px → CLIP'uje tiles do 2px

// L globalny i instance dostępna
typeof window.L           // 'object' ✅
typeof window.mymap       // 'object' ✅
window.mymap.invalidateSize  // function ✅
```

## Recovery próby — NIE pomagają

Wszystkie wywołane na `window.mymap`, każda bez efektu:

1. `mymap.invalidateSize({animate: false, pan: false})` — Leaflet's recommended fix
2. `mymap._onResize()` — internal Leaflet resize handler
3. `mymap.setView(mymap.getCenter(), mymap.getZoom(), {animate: false, reset: true})` — force re-render
4. `window.dispatchEvent(new Event('resize'))` — global resize event
5. Wszystkie 4 zarazem z 3× retry przez IntersectionObserver (0ms / 300ms / 1000ms)
6. CSS `.leaflet-map-pane { width:100%; height:100% !important; position: absolute; top:0; left:0 }` — Leaflet używa inline transform `matrix(1,0,0,1,-1,-1)` które ma wyższy specificity
7. `mymap.fitBounds(allMarkers)` — fit to 21 markerów apartamentów

**Powód prawdopodobny**: 2 instancje LMap w `window.L._map` (`LMapInstances: 2`) —
systemowa + nasz overlay layer collide? Lub Leaflet init przed CSS sizing → tiles
load z viewport=0 → mapPane pozostaje 0×2 nawet po resize.

## Decyzja — REZYGNACJA z Leaflet

Zamiana na **Google Maps iframe embed** (free, bez API key):

### CSS
```css
/* Hide systemowy Leaflet */
html body.contact-page .leaflet-container,
html body .contact-page #map_container {
  display: none !important;
  height: 0 !important;
}

/* Google Maps wrapper */
html body .fr-google-map-wrap {
  order: -1 !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 16px rgba(15,15,14,0.08) !important;
}
html body .fr-google-map-wrap iframe {
  width: 100% !important;
  height: 420px !important;
  border: 0 !important;
}
@media (max-width: 767px) {
  .fr-google-map-wrap iframe { height: 320px !important; }
}
```

### JS (`injectGoogleMap()`)
```js
function injectGoogleMap() {
  if (!document.body.classList.contains('contact-page') &&
      !/\/contact\/?$/i.test(location.pathname)) return;
  if (document.querySelector('.fr-google-map-wrap')) return;  // skip if exists

  var lang = (document.documentElement.lang || 'pl').substring(0,2).toLowerCase();
  if (lang !== 'pl' && lang !== 'en' && lang !== 'de') {
    var p = location.pathname;
    lang = p.indexOf('/en') === 0 ? 'en' : p.indexOf('/de') === 0 ? 'de' : 'pl';
  }
  var addr = encodeURIComponent('Białowieska 69/11, 54-234 Wrocław');
  var src  = 'https://maps.google.com/maps?q=' + addr +
             '&hl=' + lang + '&z=15&output=embed';

  var iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '420');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.setAttribute('allowfullscreen', '');

  var wrap = document.createElement('div');
  wrap.className = 'fr-google-map-wrap';
  wrap.appendChild(iframe);

  var contact = document.querySelector('.contact-page > .contact');
  if (contact) contact.insertBefore(wrap, contact.firstChild);
}
```

## Trade-offs

| Aspekt | Leaflet (bug) | Google Maps iframe |
|--------|--------------|---------------------|
| Działa po pan/zoom | ❌ tiles znikają | ✅ |
| 21 markerów apartamentów | ✅ | ❌ tylko 1 pin (adres firmy) |
| API key | nie | nie |
| Reliability | bug nieuleczalny | 99.9% |
| Branded styling | tak (CSS) | ograniczone (Google UI) |

**Werdykt**: dla strony /contact (lokalizacja biura) — Google Maps wystarcza. Dla
wszystkich apartamentów — alternatywa: lista pod mapą + linki "Pokaż na Google Maps".

## Co dalej

- Memo dla wszystkich nowych projektów IdoBooking: **NIE używaj Leaflet na /contact**.
  Standardowy template = Google Maps iframe embed.
- Jeśli klient chce multi-marker → rozważ Mapbox Static API (free do 50k req/mies, wymaga key).

## Related

- Instinct 061 (Leaflet default13 incurable — use Google Maps iframe)
- Lesson: `lessons/010-litepicker-position-fixed-fullpage.md` (analogiczny override systemowy)
