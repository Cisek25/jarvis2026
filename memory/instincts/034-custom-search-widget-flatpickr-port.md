# Instinct 034 — Custom search widget port (flatpickr pattern AP/MIA)

**Kiedy stosować:** Klient narzeka że kalendarz systemowy IdoBooking jest niewygodny
na mobile (obcięty viewport, brak osobnych pickerów przyjazd/wyjazd, dziwne UX).
Klient prosi "zrób jak w innych obiektach, osobno przyjazd i wyjazd".

## Wzorzec portu (6 kroków)

### Krok 1 — Sprawdź czy klient ma fullpage.js homepage
```bash
grep "section.parallax\|fullpage" clients/KLIENT/DO_WKLEJENIA/*.html
```
Jeśli TAK: body_top widget wyląduje w section 2 (pod hero) → potrzebny JS teleport (krok 6).
Jeśli NIE: body_top widget ląduje na górze naturalnie — teleport niepotrzebny.

### Krok 2 — HEAD: flatpickr CDN (3 linie)
Wklej w HEAD **strony głównej** (per-page w IdoSell panel):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/l10n/pl.js" defer></script>
```

### Krok 3 — body_top: widget HTML na SAMEJ GÓRZE (§0)
Struktura:
```html
<div class="ec-full {prefix}-search-wrap">
  <div class="{prefix}-search-card">
    <div class="{prefix}-search-card__header">
      <span class="{prefix}-search-card__kicker">Rezerwacja</span>
      <h2 class="{prefix}-search-card__title">Sprawdź dostępność</h2>
    </div>
    <form class="{prefix}-search" role="search" action="/offers" method="get">
      <div class="{prefix}-search__field" data-{prefix}-field="date-from">
        <label class="{prefix}-search__label" for="{prefix}-date-from">Przyjazd</label>
        <input type="date" id="{prefix}-date-from" name="date_from">
        <svg class="{prefix}-search__icon">...</svg>
      </div>
      <!-- date-to (analogicznie) -->
      <div class="{prefix}-search__field {prefix}-search__field--select" data-{prefix}-field="guests">
        <label for="{prefix}-guests">Goście</label>
        <select id="{prefix}-guests" name="persons-adult">
          <option value="2" selected>2 osoby</option>
          <!-- ... -->
        </select>
      </div>
      <button type="submit" class="{prefix}-search__submit">Sprawdź dostępność</button>
    </form>
  </div>
</div>
```
**KRYTYCZNE:**
- `name="persons-adult"` NIE "persons" (trap #10)
- `action="/offers"` — fallback submit
- `role="search"` + `aria-label` — WCAG
- Icons `aria-hidden="true"` + `pointer-events: none` (CSS)

### Krok 4 — CSS: widget + flatpickr theme + cross-device
```css
/* 1. Ukryj systemowy widget NA HOMEPAGE (podstrony nietknięte) */
body.page-index .iai-search,
body.page-index #iai_book_form { display: none !important; }

/* 2. Cross-device clickability (KRYTYCZNE) */
.{prefix}-search__field,
.{prefix}-search__submit {
  touch-action: manipulation;           /* iOS 300ms delay gone */
  -webkit-tap-highlight-color: transparent;  /* no grey iOS square */
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  min-height: 44px;                     /* WCAG 2.5.5 */
}

/* 3. Mobile bottom-sheet dla flatpickr (≤768px) */
@media (max-width: 768px) {
  .flatpickr-calendar.open {
    position: fixed !important;
    bottom: 0 !important; left: 0 !important; right: 0 !important;
    width: 100vw !important;
    border-radius: 20px 20px 0 0 !important;
    /* + grip bar ::before, animation slide-up */
  }
  body.{prefix}-fp-open::after {        /* backdrop */
    content: ''; position: fixed; inset: 0;
    background: rgba(0,0,0,0.55); z-index: 10040;
  }
}

/* 4. Responsive breakpoints */
@media (max-width: 1024px) { grid: 1fr 1fr 1fr; submit spans full }
@media (max-width: 768px)  { grid: 1fr 1fr; guests + submit span full }
@media (max-width: 480px)  { grid: 1fr; all stacked }
```

### Krok 5 — JS: init + submit + teleport (body_bottom)
```javascript
function initSearchWidget() {
  var form = document.querySelector('.{prefix}-search');
  if (!form) return;
  var dateFrom = form.querySelector('#{prefix}-date-from');
  var dateTo = form.querySelector('#{prefix}-date-to');
  var guests = form.querySelector('#{prefix}-guests');

  // Flatpickr init z polskim locale + mobile bottom-sheet hooks
  function initFlatpickr() {
    if (typeof window.flatpickr === 'undefined') return false;
    var fpOpts = {
      dateFormat: 'Y-m-d',
      altFormat: 'd.m.Y',
      altInput: true,
      minDate: 'today',
      locale: window.flatpickr.l10ns.pl || 'default',
      disableMobile: true,              /* flatpickr zamiast native */
      showMonths: 1,
      nextArrow: '<svg>...</svg>',
      prevArrow: '<svg>...</svg>',
      onOpen: function() {
        if (window.matchMedia('(max-width: 768px)').matches) {
          document.body.classList.add('{prefix}-fp-open');
          document.body.style.overflow = 'hidden';
        }
      },
      onClose: function() {
        document.body.classList.remove('{prefix}-fp-open');
        document.body.style.overflow = '';
      }
    };

    if (dateFrom) {
      window.flatpickr(dateFrom, Object.assign({}, fpOpts, {
        onChange: function(selectedDates) {
          if (!selectedDates.length || !dateTo._flatpickr) return;
          var nextDay = new Date(selectedDates[0]);
          nextDay.setDate(nextDay.getDate() + 1);
          dateTo._flatpickr.set('minDate', nextDay);
          /* Auto-otwarcie pickera wyjazdu — lepszy UX */
          setTimeout(function() {
            if (!dateTo._flatpickr.selectedDates.length) dateTo._flatpickr.open();
          }, 250);
        }
      }));
    }
    if (dateTo) window.flatpickr(dateTo, Object.assign({}, fpOpts, { minDate: tomorrow }));

    /* Click w całe pole (nie tylko input) — większy tap target */
    form.querySelectorAll('.{prefix}-search__field').forEach(function(field) {
      var input = field.querySelector('input, select');
      if (!input) return;
      field.addEventListener('click', function(e) {
        if (e.target === input || e.target.tagName === 'OPTION') return;
        if (input._flatpickr) { input._flatpickr.open(); return; }
        if (input.tagName === 'SELECT') { input.focus(); try { input.click(); } catch(_){} return; }
        if (typeof input.showPicker === 'function') {
          try { input.showPicker(); return; } catch(_) {}
        }
        input.focus();
      });
    });
    return true;
  }

  /* Retry aż CDN się załaduje */
  if (!initFlatpickr()) {
    var attempts = 0;
    var retry = setInterval(function() {
      if (initFlatpickr() || ++attempts > 30) clearInterval(retry);
    }, 200);
  }

  /* Submit: Strategy 1 (systemowy form) → Strategy 2 (URL fallback) */
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var values = {
      dateFrom: dateFrom ? dateFrom.value : '',
      dateTo:   dateTo ? dateTo.value : '',
      guests:   guests ? guests.value : ''
    };
    var sysForm = document.querySelector('#iai_book_form');
    if (sysForm) {
      /* Proxy przez systemowy form (engine submit) */
      try {
        var sysFrom = sysForm.querySelector('#iai_booking_date_from, [name="dateFrom"]');
        var sysTo   = sysForm.querySelector('#iai_booking_date_to,   [name="dateTo"]');
        if (sysFrom && values.dateFrom) sysFrom.value = values.dateFrom;
        if (sysTo   && values.dateTo)   sysTo.value   = values.dateTo;
        /* persons-adult (trap #10) */
        var hidden = sysForm.querySelector('input[name="persons-adult"]') || (function() {
          var h = document.createElement('input'); h.type = 'hidden'; h.name = 'persons-adult';
          sysForm.appendChild(h); return h;
        })();
        hidden.value = values.guests;
        sysForm.submit();
        return;
      } catch(err) { /* fall through */ }
    }
    /* Fallback: URL params */
    var params = new URLSearchParams();
    if (values.dateFrom) params.set('dateFrom', values.dateFrom);
    if (values.dateTo)   params.set('dateTo',   values.dateTo);
    if (values.guests)   params.set('persons-adult', values.guests);
    window.location.href = (form.action || '/offers') + '?' + params.toString();
  });
}
```

### Krok 6 — Teleport do hero (fullpage.js clients only)
Jeśli klient ma fullpage.js (section.parallax), dodaj po init:
```javascript
function teleportSearchWidget() {
  var wrap = document.querySelector('.{prefix}-search-wrap');
  var parallax = document.querySelector('.section.parallax');
  if (!wrap || !parallax) return false;
  var target = parallax.querySelector('.fp-tableCell') || parallax;
  if (target.contains(wrap)) return true;
  target.appendChild(wrap);
  wrap.classList.add('{prefix}-search-wrap--teleported');
  return true;
}
teleportSearchWidget();
[50, 150, 300, 600, 1000, 2000, 4000].forEach(function(d) { setTimeout(teleportSearchWidget, d); });
/* + MutationObserver na 15s (re-teleport gdy system re-render) */
```

**CSS support dla teleported state:**
```css
.{prefix}-search-wrap--teleported {
  background: transparent !important;
  padding: 0 24px !important;
}
.{prefix}-search-wrap--teleported .{prefix}-search-card {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(8px);
  box-shadow: 0 24px 80px rgba(0,0,0,0.25);
}
body.page-index .section.parallax,
body.page-index .section.parallax .fp-tableCell {
  min-height: 100vh !important;
}
body.page-index .section.parallax .fp-tableCell {
  display: table-cell !important;
  vertical-align: middle !important;
  padding: 140px 0 60px !important;  /* kompensacja headera */
}
@media (max-width: 768px) { padding: 90px 0 40px !important; }
```

## Referencje
- **Port source**: Apartamenty Parkowe AP_KONIEC_BODY.html §13 + AP_CSS_EDYTOR.css §6
- **Implementacja EcoCamping (2026-04-24)**: clients/ecocamping/DO_WKLEJENIA/
- **Testy TDD**: TEST_PLAN_WIDGET.md + TEST_WIDGET_CLICKABILITY.js

## Red flags (nie rób tego)
- ❌ Zastąpienie systemowego widgetu na WSZYSTKICH stronach (tylko homepage)
- ❌ Brak fallback submit URL (bez /offers klient bez flatpickr nie zarezerwuje)
- ❌ Hardcoded daty bez `minDate: 'today'` (user może wybrać przeszłość)
- ❌ `display: none` na systemowym widgetcie bez `body.page-index` guard (psuje /offers)
- ❌ Submit bez `persons-adult` (trap #10 — system ignoruje `persons`)

## Flatpickr version
- **Pinned**: 4.6.13 (stabilna)
- **Nie upgrade** bez regression test (breaking changes na 5.x)
