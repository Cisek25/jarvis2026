# Instinct 061 — Leaflet w IdoBooking default13 = bug nieuleczalny → Google Maps iframe

**Discovered**: 2026-05-16 (Fair Rentals v1.47 deploy)
**Severity**: 🔴 CRITICAL — mapa nie wyświetla się na /contact

## Problem

Systemowa mapa Leaflet w template **default13** ma bug nieuleczalny:

```js
window.mymap.getSize()   // → {x: 1105, y: 420}  ✅ Leaflet WIE wymiary
document.querySelector('.leaflet-map-pane').offsetHeight  // → 2  ❌ DOM 2 piksele
document.querySelector('.leaflet-tile-pane').offsetWidth  // → 0  ❌
```

Tiles są fizycznie pobrane (10/10 `complete: true, naturalWidth: 256`), ale renderują się
clipped do **2px wysokości**. Klient widzi pustą mapę z samymi +/- zoom buttons.

## Recovery próby — NIE pomagają

Testowane (wszystkie BEZ efektu):
1. `mymap.invalidateSize({animate: false, pan: false})`
2. `mymap._onResize()` (internal Leaflet method)
3. `mymap.setView(center, zoom, {reset: true})`
4. `window.dispatchEvent(new Event('resize'))`
5. `mymap.fitBounds(allMarkers, {padding: [40, 40]})`
6. CSS `.leaflet-map-pane { width:100%; height:100% !important }` (overridden przez Leaflet inline transform)
7. IntersectionObserver z 3× retry (0ms / 300ms / 1000ms)

**Powód**: 2 instancje LMap w `window` (system + nasz layer collide?). Leaflet init przy
container width=0/height=0 (przed CSS), tiles ładują się ze złym viewport, mapPane
pozostaje 2px nawet po późniejszym CSS sizing.

## Rozwiązanie — REZYGNACJA z Leaflet

Zamień na **Google Maps iframe embed** (bez API key, free, niezawodny):

**CSS** (hide systemowy + style iframe):
```css
html body.contact-page .leaflet-container,
html body .contact-page #map_container {
  display: none !important;
  height: 0 !important;
  margin: 0 !important;
}
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
```

**JS** (inject iframe na /contact):
```js
function injectGoogleMap() {
  if (!document.body.classList.contains('contact-page') &&
      !/\/contact\/?$/i.test(location.pathname)) return;
  if (document.querySelector('.fr-google-map-wrap')) return;

  var lang = (document.documentElement.lang || 'pl').substring(0,2).toLowerCase();
  if (lang !== 'pl' && lang !== 'en' && lang !== 'de') {
    var p = location.pathname;
    lang = p.indexOf('/en') === 0 ? 'en' : p.indexOf('/de') === 0 ? 'de' : 'pl';
  }
  var addr = encodeURIComponent('Białowieska 69/11, 54-234 Wrocław');
  var url = 'https://maps.google.com/maps?q=' + addr +
            '&hl=' + lang + '&z=15&output=embed';

  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '420');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('title', 'Map');

  var wrap = document.createElement('div');
  wrap.className = 'fr-google-map-wrap';
  wrap.appendChild(iframe);

  var contact = document.querySelector('.contact-page > .contact, .contact-page .contact');
  if (contact) contact.insertBefore(wrap, contact.firstChild);
}
```

## Pattern URL Google Maps embed (bez API key)

```
https://maps.google.com/maps?q=ADDRESS_ENCODED&hl=LANG&z=ZOOM&output=embed
```

- `q=` adres URL-encoded (przez `encodeURIComponent`)
- `hl=` lang (`pl`, `en`, `de` — UI Google Maps)
- `z=` zoom level (10=region, 14=city, 17=street)
- `output=embed` — wymusza embedded mode

Free, bez API key, działa od ~10 lat, niezawodny.

## Trade-offs

| Aspekt | Leaflet (poprzednio) | Google Maps iframe |
|--------|---------------------|---------------------|
| Działa po pan/zoom | ❌ tiles znikają | ✅ |
| N markerów apartamentów | ✅ (21) | ❌ tylko 1 (adres firmy) |
| API key | nie | nie |
| Reliability | bug nieuleczalny | 99.9% |

**Werdykt**: dla strony /contact (1 adres firmy) — Google Maps wystarcza. Dla galerii
wszystkich apartamentów (multi-marker) — rozważ Mapbox Static (free do 50k req/mies).

## Related

- Lesson: `lessons/leaflet-default13-mappane-2px-incurable.md`
- Instinct 052 (MASTER idobooking-parallax-slider-zindex-fix)
