---
name: subpage-full-width
description: Podstrony /txt/* MUSZĄ być rozciągnięte edge-to-edge — override systemowego Bootstrap .container (max-width 1170px). NIE dotyczy /contact ani /offer!
type: instinct
scope: all-clients
trigger: new-client / every-subpage-build / /txt/* ONLY
added: 2026-04-21
updated: 2026-04-21 (scope restricted to page-txt only)
source_client: apartamenty-parkowe (client58154) — user feedback 2026-04-21 "czemu podstrona /txt/200/O-nas nie jest rozciągnięta na całą szerokość?" + "/contact dziwnie rozjechana" (v2 fix)
---

## ⚠️ ZAKRES — CZYTAJ PRZED ZASTOSOWANIEM

| Podstrona | Apply fix? | Dlaczego |
|-----------|-----------|----------|
| `/txt/*` (O nas, Galeria, Lokalizacja, Regulamin...) | ✅ TAK | Nasze custom body_top, sekcje chcą full-width |
| `/contact` | ❌ NIE | System Bootstrap grid `col-md-6 + col-md-5` — override zepsuje |
| `/offer/*` (detail) | ❌ NIE | Sidebar layout z filtrami — potrzebuje gutterów |
| `/offers` (lista) | ❌ NIE | Filter sidebar — natywny Bootstrap grid |

Jeśli klient ma więcej podstron (np. `/faq`, `/blog`) — sprawdź body class
i rodzaj zawartości przed override.

# Instynkt: Podstrony zawsze full-width

## Problem (root cause)
System IdoBooking (default13) **renderuje zawartość `body_top` dla
podstron `/txt/*`, `/offer/*`, `/contact` wewnątrz Bootstrap'owego
kontenera**:

```
<main id="pageContent" class="page">
  <div class="container">           ← max-width: 1170px !!!
    <div class="row">
      <div class="col-12">
        <div class="txt-text">
          [NASZE BODY_TOP HTML]
        </div>
      </div>
    </div>
  </div>
</main>
```

Efekt: sekcje z prefixem `{ap,md,nj,pk}-*` (np. `.ap-narrative`,
`.ap-page-hero`, `.ap-split`) są **ograniczone do 1170px** nawet jeśli
zaprojektowane jako pełnej szerokości. Na viewport 1334px pojawiają się
**białe marginesy 74.5px po bokach** — strona wygląda jak "karta na
środku" zamiast edge-to-edge.

Na homepage problemu nie ma bo fullpage.js robi własny layout.

## Reguła
**ZAWSZE przy nowym kliencie dodawaj do custom CSS override dla
systemowego `.container` — ale TYLKO na podstronach `/txt/*`
(`body.page-txt`). NIE stosuj do `/contact` ani `/offer/*`:**

```css
body.page-txt main .container,
body.page-txt #pageContent .container,
body.page-txt #pageContent > .container,
body.page-txt main .container-fluid {
  max-width: 100% !important;
  width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

body.page-txt main .container > .row,
body.page-txt #pageContent .container > .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

body.page-txt main .container > .row > [class^="col"],
body.page-txt main .container > .row > [class*=" col"] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

body.page-txt .txt-text {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* NIE stosuj do /contact ani /offer — zostaw systemowy Bootstrap grid */
```

### Co NIE robić (znany bug v1.1 → v1.2)
❌ Nie dawaj `body.page-contact main .container { padding: 0 }` — na
`/contact` system renderuje dwie kolumny (`col-md-6` "Dane kontaktowe" +
`col-md-5 contact__payments` "Płatności"). Usunięcie paddingu sprawia, że
pierwszy column startuje w x=0, drugi w x=769 — wygląda jakby strona się
rozpadła na dwie strony (user zgłosił "/contact dziwnie rozjechana").

❌ Nie dawaj `body.page-offer main .container { padding: 0 }` — analogicznie,
/offers ma sidebar filter (col-md-3) i main content (col-md-9).

## Dlaczego NIE wystarczy dać `.ap-narrative { max-width: 100% }`
Bo **rodzic** (.container) ma `max-width: 1170px` — dziecko nie przebije
się ponad szerokość rodzica. Musisz override samego `.container`.

## Jak mają wyglądać nasze sekcje body_top
Każda sekcja deklaruje WŁASNY inner wrapper z centrowaniem:

```html
<section class="ap-narrative">           <!-- full-width bg/padding -->
  <div class="ap-narrative__inner">      <!-- max-width: 1200px, margin: 0 auto -->
    [content]
  </div>
</section>
```

```css
.ap-narrative {
  width: 100%;
  padding: 96px 24px;
  background: var(--ido-light);
}
.ap-narrative__inner {
  max-width: 1200px;
  margin: 0 auto;
}
```

Tak sekcja może mieć full-width **tło** (kolor, gradient, obraz
parallax), a treść wewnątrz jest ograniczona do 1200px — klasyczny
wzorzec "hero full-bleed, content centered".

## Jak weryfikować na live
```js
const cont = document.querySelector('main .container');
console.log(cont.getBoundingClientRect().width, window.innerWidth);
// Oczekiwane: równe (oba np. 1334), NIE 1170 vs 1334
```

Lub screenshot `/txt/200/O-nas` i sprawdź czy sekcja rozciąga się do
samych krawędzi viewportu.

## Referencja
- Client: apartamenty-parkowe (client58154)
- User feedback: 2026-04-21 "czemu /txt/200/O-nas nie jest rozciągnięta na całą szerokość"
- CSS patch: `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css`
  sekcja PATCH 2026-04-21 → "3. SUBPAGES FULL-WIDTH"
- Dotyczy WSZYSTKICH klientów korzystających z /txt subpages — dodaj do
  template CSS w `library/css/layer1-traps.css` jako universal trap
