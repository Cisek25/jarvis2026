# Lesson 010 — Litepicker MUSI być `position: fixed` na stronach z fullpage.js

**Data**: 2026-05-05
**Klient**: solidneapartamenty (regresja v1.6.8 → hotfix v1.6.9)
**Severity**: CRITICAL — picker w ogóle nie wyświetlał się dla usera

## Problem

Na stronach z `body.page-index` używających **fullpage.js** (większość naszych klientów IdoBooking),
zmiana CSS `.litepicker { position: fixed → absolute }` powoduje że picker **w ogóle się nie pokazuje**
po kliku w pole daty.

## Root cause

fullpage.js implementuje "scroll" przez **`transform: translate3d(...)` na inner wrapperze**, NIE
przez natywne scrollowanie body. Konsekwencje:

- `window.scrollY` jest **zawsze 0** (brak scrolla)
- Litepicker JS oblicza `picker.style.top = inputRect.top + window.scrollY` = `inputRect.top + 0`
- Z **`position: absolute`** te koordy są względem `<body>` (offsetParent), nie viewport
- `<body>` jest zawsze "powyżej" widocznego viewport (bo fullPage transform przesuwa wrapper o sekcję)
- Picker fizycznie tworzy się w DOM, ale ląduje **poza widocznym ekranem** (np. ujemne Y)
- User widzi nic.

Z **`position: fixed`** te same koordy są viewport-relative — picker zawsze widoczny.

## Reguła (do zastosowania na wszystkich klientach)

Dla każdego klienta z `body.page-index` + `fullpage.js` (sprawdź: `body.fp-enabled` lub
`html.fp-enabled` w DOM):

```css
/* ZAWSZE position: fixed dla popup-style dropdownów na page-index */
html body .litepicker {
  position: fixed !important;
  z-index: 99999 !important;
}
```

NIE używaj `position: absolute` nawet jeśli wydaje się "bardziej semantyczne".

## Dodatkowo — anchor accuracy

Sam `position: fixed` to nie wszystko. Litepicker `position: 'auto'` może wybierać złe location
(czasem ląduje w środku ekranu). Wymuś **`position: 'bottom-start'`** w JS init + ręczny
`anchorPickerToTrigger` handler na eventach `show`/`click`/`focus` na inputy + `resize`:

```js
litepickerInstance = new Litepicker({
  ...
  position: 'bottom-start',  // explicit, NIE 'auto'
  ...
});

var anchorPickerToTrigger = function(triggerEl) {
  var ui = litepickerInstance.ui || litepickerInstance.picker;
  if (!ui) return;
  var rect = triggerEl.getBoundingClientRect();
  var pickerW = ui.offsetWidth || 360;
  var top = rect.bottom + 8;
  var left = rect.left;
  // Auto-flip horizontal
  if (left + pickerW + 12 > window.innerWidth) {
    left = Math.max(12, window.innerWidth - pickerW - 12);
  }
  // Auto-flip vertical
  var spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow < (ui.offsetHeight || 360) + 20 && rect.top > spaceBelow) {
    top = Math.max(12, rect.top - (ui.offsetHeight || 360) - 8);
  }
  ui.style.position = 'fixed';
  ui.style.top = top + 'px';
  ui.style.left = left + 'px';
};

// Hook into 4 events
litepickerInstance.on('show', function() {
  setTimeout(function() { anchorPickerToTrigger(activeInput); }, 0);
});
[fromInput, toInput].forEach(function(input) {
  input.addEventListener('click', function() {
    setTimeout(function() { anchorPickerToTrigger(input); }, 50);
  });
  input.addEventListener('focus', function() {
    setTimeout(function() { anchorPickerToTrigger(input); }, 50);
  });
});
window.addEventListener('resize', function() {
  if (ui && ui.offsetWidth > 0) anchorPickerToTrigger(activeInput);
});
```

## Detekcja czy klient ma fullpage.js

```bash
# W panelu klienta sprawdź body classy:
# - body.fp-enabled = ma fullPage
# - body.page-index z fullpage init w body_bottom JS = ma fullPage
# - .section.fp-section = ma fullPage
```

Jeśli TAK — stosuj `position: fixed` dla popup-style komponentów (Litepicker, custom dropdowns,
modale anchored to inputów).

## Powiązane

- Trap #1 (CLAUDE.md): fullPage.js detection — `window.scrollY` ZAWSZE 0
- Trap #14 (CLAUDE.md): Litepicker JS init pattern (numberOfMonths, dropdowns)
- Lesson 003: fullpage.js scroll mechanics
