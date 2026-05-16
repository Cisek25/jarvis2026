---
name: Future content placeholder + auto-pull from panel gallery
description: Gdy klient nie ma jeszcze treści (zdjęć nowego apartamentu, wpisów blogowych, nowej oferty) — placeholder + skanowanie panelu w tle, automatyczna podmiana po dodaniu w panelu
type: feedback
---

## Problem

Klient pyta: "Czy mogę dodać zdjęcia później?" lub "Apartament jest w trakcie realizacji, jeszcze nie mam fotografii."

**Złe rozwiązania:**
- (a) Pominąć sekcję — klient zapomina ją dodać, treść strony niekompletna na zawsze.
- (b) Zostawić placeholder do ręcznej podmiany w HTML — wymaga ingerencji w kod, ticket do nas, opóźnienie.
- (c) Hardcoded fallback w HTML — gdy klient doda treść w panelu, fallback dalej widoczny aż my go usuniemy.

**Dobre rozwiązanie: placeholder z auto-pull JS.** Klient dodaje treść w standardowym miejscu w panelu (galeria obiektu, news/blog, oferta), a JS automatycznie podmienia placeholder na realny content.

## Wzorzec — gallery przykład (AP v1.9.0)

### 1. HTML — placeholder z `data-ap-pull-from` + `data-ap-object-id`

```html
<div class="ap-gallery-mosaic__grid ap-gallery-mosaic__grid--modern"
     data-ap-pull-from="modern"
     data-ap-object-id="3">
  <figure class="ap-gallery-mosaic__item ap-gallery-mosaic__item--large ap-gallery-placeholder">
    <div class="ap-gallery-placeholder__badge">ZDJĘCIA WKRÓTCE</div>
    <div class="ap-gallery-placeholder__icon">
      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    </div>
  </figure>
</div>
```

### 2. CSS — placeholder visualnie wyróżniony (gradient + dashed border)

```css
.ap-gallery-placeholder {
  position: relative;
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--ap-bg-cream, #FAF7F2) 0%, var(--ap-blush, #E8D4C4) 100%) !important;
  min-height: 320px;
  border: 2px dashed rgba(47, 74, 58, 0.25);
  border-radius: 12px;
}
.ap-gallery-placeholder__badge {
  position: absolute;
  top: 18px;
  left: 18px;
  background: var(--ido-primary);
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}
```

**Why dashed border + gradient:** wizualnie sygnalizuje że to "puste miejsce / coming soon", nie błąd. Klient i odwiedzający rozumieją intencję.

### 3. JS — skan ścieżki panelu + auto-podmiana

```js
function initModernGalleryPull() {
  var grid = document.querySelector('.ap-gallery-mosaic__grid[data-ap-pull-from="modern"]');
  if (!grid) return;
  var objectId = grid.getAttribute('data-ap-object-id') || '3';

  var FOUND = [];
  var pending = 150;
  var MAX_SCAN = 150;

  function buildGrid() {
    if (FOUND.length === 0) return; // 0 zdjęć → zachowaj placeholder
    grid.innerHTML = '';
    var sizes = ['large', 'medium', 'small', 'small', 'medium', 'tall'];
    FOUND.sort(function (a, b) { return a.idx - b.idx; }).forEach(function (item, i) {
      var fig = document.createElement('figure');
      fig.className = 'ap-gallery-mosaic__item ap-gallery-mosaic__item--' + sizes[i % sizes.length];
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = 'Modern — zdjęcie ' + (i + 1);
      img.loading = 'lazy';
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  for (var i = 1; i <= MAX_SCAN; i++) {
    (function (idx) {
      var src = '/images/objects/pictures/large/' + objectId + '/0/' + idx + '.jpg';
      var probe = new Image();
      probe.onload = function () {
        if (probe.naturalWidth >= 200) FOUND.push({ idx: idx, src: src });
        if (--pending === 0) buildGrid();
      };
      probe.onerror = function () {
        if (--pending === 0) buildGrid();
      };
      probe.src = src;
    })(i);
  }
}
```

**Kluczowe:**
- **Probe via `new Image()`** — nie fetch (CORS-free, działa też dla zewnętrznych CDN).
- **`naturalWidth >= 200`** — filtruje placeholder 1×1 i 50×50 fallback IdoBooking dla nieistniejących plików.
- **`MAX_SCAN = 150`** — typowy klient ma maks ~50 zdjęć per apartament; 150 to zapas.
- **Sort po idx** — zachowuje kolejność z panelu (klient ma kontrolę).
- **`if (FOUND.length === 0) return`** — zero zdjęć = placeholder zostaje. Nigdy nie czyść griduDOM gdy znalazłeś 0 wyników.

## Inne zastosowania (odlewki tego wzorca)

- **Aktualności/Blog** — placeholder "Pierwszy wpis pojawi się wkrótce" + skan listy news z panelu.
- **Wyróżnione oferty** — `0 ofert wyróżnionych = section.style.display='none'` (już zrobione w `buildOfferCards()`, lessons: `clients/apartamenty-parkowe/CLAUDE.md trap #26`).
- **Galeria z podstrony** — nowy CMS gallery placeholder skanuje `/txt/{ID}` content.
- **Specjalna oferta sezonowa** — placeholder ukryty dopóki w panelu nie pojawi się oferta z tagiem `seasonal`.

## Komunikacja z klientem

> "Apartament Modern: dodałem na stronie sekcję z placeholderem 'ZDJĘCIA WKRÓTCE'. Gdy tylko doda Pani fotografie w panelu (Apartamenty → Modern → Galeria zdjęć), **placeholder automatycznie się chowa** a w jego miejscu pojawia się grid z Pani zdjęciami. Nic w kodzie nie trzeba zmieniać."

**Klient rozumie że robota jest zrobiona** + **klient ma kontrolę** — to jest UX wzorca.

## Referencja

AP v1.9.0 (2026-05-04, 4. apartament Modern):
- HTML: `clients/apartamenty-parkowe/DO_WKLEJENIA/GALERIA_PL__body_top.html` — sekcja "Apartament Modern"
- CSS: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` — patch v1.9.0 §(2)
- JS: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html` — `initModernGalleryPull()`
