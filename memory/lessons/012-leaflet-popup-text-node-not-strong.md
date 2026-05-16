# 012 — Leaflet popup content: TEXT NODE not `<strong>`, CSS won't hide

## Problem (Apartamenty Parkowe v1.9.2 — user feedback 2026-05-13)

User reported: "napis Studio nadal wyświetla się na mapie w dziale kontakt".

Initial CSS attempt v1.9.2 §10b:
```css
body.page-contact .leaflet-popup-content strong { display: none !important; }
```

Live verification: `popupStrong: null, hasStrong: false` — wyglądało jakby działało.
Ale user wciąż widział "Studio". Dlaczego?

## Root cause

Leaflet popup faktyczna struktura HTML (po programatic click + verify):
```html
<div class="leaflet-popup-content" style="width: 133px;">
  Studio<br>                <!-- TEXT NODE, NIE <strong>! -->
  Kościuszki 1<br>
  62-200 Gniezno, Polska<br>
  <a>Zobacz ofertę</a>
</div>
```

"Studio" jest TEXT NODE bezpośrednio w `.leaflet-popup-content`. CSS selector
`strong` szuka elementu, ale nie ma żadnego — selector nie matchuje nic.
Dlatego mój test wcześniej dał `hasStrong: false` — myliłem to z "ukryte"
(strong nigdy tu nie istniał).

## Fix — JavaScript Node.removeChild

CSS NIE MOŻE selektora text nodes. Trzeba JS:

```javascript
function removeLocationNameFromLeafletPopup() {
  if (!document.body.classList.contains('page-contact')) return;
  document.querySelectorAll('.leaflet-popup-content').forEach(popup => {
    if (popup.dataset.apLocationRemoved === '1') return;
    const firstNode = popup.firstChild;
    if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
      const txt = firstNode.textContent.trim();
      // Match: krótki tekst (apartament name), capital letter, no digits
      if (txt.length > 0 && txt.length <= 20 && !/\d/.test(txt) && !/^[a-z]/.test(txt)) {
        firstNode.remove();
        const nextEl = popup.firstChild;
        if (nextEl && nextEl.tagName === 'BR') nextEl.remove();
        popup.dataset.apLocationRemoved = '1';
      }
    }
  });
}
```

## Hooks dla dynamic popups

Leaflet popup tworzony dynamicznie (po kliknięciu marker). Trzy mechanizmy:

```javascript
// 1. MutationObserver na map container — łapie popup creation
const mapContainer = document.querySelector('.leaflet-container');
const obs = new MutationObserver(removeLocationNameFromLeafletPopup);
obs.observe(mapContainer || document.body, { childList: true, subtree: true });

// 2. Click handler na marker — popup renderuje ~100ms później
document.addEventListener('click', e => {
  if (e.target.closest('.leaflet-marker-icon, .leaflet-container')) {
    setTimeout(removeLocationNameFromLeafletPopup, 100);
    setTimeout(removeLocationNameFromLeafletPopup, 400);
  }
}, true);

// 3. Initial run (gdy popup już otwarty np. po reload)
removeLocationNameFromLeafletPopup();
```

## Generalizacja — TRAP #32

**Każdy CSS selector wymaga ELEMENTU**. Text nodes nie są elementami.

Sygnały że to ten bug:
1. CSS `display: none` zaaplikowany ale tekst widoczny
2. Test `getComputedStyle()` mówi `display: none` ale `textContent` zawiera tekst
3. `querySelector(...)` nie znajduje elementu chociaż tekst jest w DOM

Inne miejsca gdzie ten trap się pojawia:
- Leaflet popups (`.leaflet-popup-content` text nodes)
- Niektóre Bootstrap tooltips
- Generated content przez JS gdzie autor zapomniał elementu wrapping
- Systemowe IdoBooking elementy z mieszanym tekstem + tagami

## Test methodology

```javascript
// Sprawdź czy "tekst" w elemencie to ELEMENT czy TEXT NODE
const el = document.querySelector('.X');
Array.from(el.childNodes).forEach(node => {
  console.log({
    nodeType: node.nodeType,  // 1 = Element, 3 = Text
    tagName: node.tagName,
    text: node.textContent.trim().slice(0,30)
  });
});
```

Jeśli `nodeType: 3` (Text) z target tekstem — CSS NIE POMOŻE. JS only.

## Plik referencyjny

`clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html` v1.9.3
`docs/CLIENT-LESSONS-apartamenty-parkowe.md` TRAP #32.

## Related

- instinct 058: specificity war w custom.css (CSS approach pierwszy, JS gdy CSS niemożliwy)
- lesson 011: mobile hero absolute overflow (też mobile UX/a11y)
