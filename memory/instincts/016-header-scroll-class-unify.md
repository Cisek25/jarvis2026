---
name: header-scroll-class-unify
description: Klasa headera na scroll musi być WSZĘDZIE ta sama — `.{prefix}-header--scrolled` (double-dash) w JS i CSS. Threshold scrollY musi być 1 (instant bg-swap), nie 10/50.
type: instinct
scope: all-clients
trigger: header nie zmienia tła na scroll / class name mismatch bug / budowa header JS
added: 2026-04-21
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "nawet jak zjedziemy milimatr w dol na stronie, to menu powinno juz nie być TRANSPRENTNE, tylko od razu mieć tło białe, a nie ma"
---

# Instynkt: Class name unify + threshold 1

## Bug (AP v1.0-v1.7)
**Niema synchronizacji nazw klas między JS a CSS:**
- `initScrollHandler()` ustawiał `ap-header-scrolled` (pojedynczy `-`)
- `initHeaderShrink()` ustawiał `ap-header--scrolled` (podwójny `--`)
- CSS targetował `.ap-header--scrolled` (podwójny)

Rezultat: jeden handler działał (na homepage fullpage), drugi nie
(na subpages). Użytkownik: "header nie bieli się gdy scrolluję" —
bo threshold=10 + class mismatch.

Plus stary threshold=10 nie pasował do UX oczekiwań ("1 milimetr
w dół = biały header").

## Reguła

### Class name — UNIFIED
Wszędzie w JS i CSS używaj **podwójnego myślnika**:
```
.{prefix}-header--scrolled
```

To BEM convention: block__element--modifier. Modyfikator ma podwójny
myślnik. Blok `{prefix}-header`, modyfikator `scrolled`.

NIE:
- ❌ `ap-header-scrolled`
- ❌ `apHeaderScrolled`
- ❌ `header.scrolled` (za ogólne, konflikt)

### Threshold = 1 (instant)
```javascript
var threshold = 1;  // instant white bg after 1px scroll
```

User wants bg-swap natychmiast przy najmniejszym scrollu. Threshold 1
nie 10 nie 50 — INSTANT.

### Transition = 0s
CSS ma `transition: background 0s !important`. Fade-in/out nie ma
— instant snap. User AP: "za pozno robilo sie biale tlo. Zamiast 0.15s
fade → natychmiastowy snap".

## Template JS (dwie funkcje, dwa konteksty)

### `initScrollHandler()` — dla subpages (regular scroll)
```javascript
function initScrollHandler() {
  var header = document.querySelector('header.default13, .defaultsb');
  var ticking = false;
  var headerThreshold = 1;  // instant!

  function onScroll() {
    if (!header) return;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > headerThreshold) {
      header.classList.add('{prefix}-header--scrolled');  // double-dash!
    } else {
      header.classList.remove('{prefix}-header--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();
}
```

### `initHeaderShrink()` — dla homepage (fullpage.js)
```javascript
function initHeaderShrink() {
  var header = document.querySelector('header.default13');
  if (!header) return;

  function applyState(scrolled) {
    header.classList.toggle('{prefix}-header--scrolled', scrolled);
  }

  function checkFullpage() {
    var match = document.body.className.match(/fp-viewing-(\d+)/);
    if (match) {
      applyState(parseInt(match[1], 10) > 1);  // sekcja > hero
      return true;
    }
    return false;
  }

  var isFp = checkFullpage();
  var observer = new MutationObserver(checkFullpage);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Subpages fallback
  if (!isFp) {
    var threshold = 1;
    window.addEventListener('scroll', function () {
      applyState(window.scrollY > threshold);
    }, { passive: true });
  }
}
```

## Template CSS

```css
/* Default: transparent (hero) */
body header.default13,
body header.default13 .menu-wrapper {
  background: transparent !important;
  transition: background 0s, background-color 0s, box-shadow 0s !important;
}

/* Scrolled state */
body header.default13.{prefix}-header--scrolled,
body header.default13.{prefix}-header--scrolled .menu-wrapper {
  background: #ffffff !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
}

/* Menu text color — na scrolled = czarny, na hero = biały z shadow */
body.page-index header.default13:not(.{prefix}-header--scrolled) a[href]:not(.logo):not([class*="btn"]) {
  color: #ffffff !important;
  text-shadow: /* heavy shadow dla kontrastu z hero image */ ...;
}
body.page-index header.default13.{prefix}-header--scrolled a[href]:not(.logo):not([class*="btn"]) {
  color: var(--ap-dark) !important;
  text-shadow: none !important;
}
```

## Debugging class mismatch

Gdy user zgłasza "header nie zmienia się na scroll":

```javascript
// DevTools console:
var hdr = document.querySelector('header.default13');
window.scrollTo(0, 100);
setTimeout(() => {
  console.log('classes after scroll:', hdr.className);
  console.log('bg:', getComputedStyle(hdr).backgroundColor);
  // Expected: classes zawiera "ap-header--scrolled"
  //           bg = rgb(255, 255, 255)
}, 100);
```

Jeśli classes zawiera `ap-header-scrolled` (bez `--`) → bug w JS,
fix do `ap-header--scrolled`.

## Historia AP
- **v1.0**: `initScrollHandler` → `ap-header-scrolled` (jeden `-`)
- **v1.0**: `initHeaderShrink` → `ap-header--scrolled` (dwa `--`)
- **v1.0-v1.7**: CSS targetuje `.ap-header--scrolled` → subpages działały
  tylko przez `initHeaderShrink` fallback, homepage tylko przez fp detection
- **v1.8 (2026-04-21)**: oba handlery → `ap-header--scrolled`, threshold=1

## Referencja
- Client: apartamenty-parkowe (client58154)
- JS: `AP_KONIEC_BODY.html` §09 initScrollHandler + §12 initHeaderShrink
- CSS: `AP_CSS_EDYTOR.css` §13 PATCH 2026-04-21 v3
- User feedback: "nawet jak zjedziemy milimatr w dol to menu powinno
  juz mieć tło białe, a nie ma"
