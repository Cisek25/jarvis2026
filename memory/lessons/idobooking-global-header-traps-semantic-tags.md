---
name: idobooking-global-header-traps-semantic-tags
description: System Idosell template default13 ma globalny `header { position: fixed; top: 0; z-index: 1010 }` BEZ żadnej klasy w selektorze. Łapie **WSZYSTKIE** `<header>` w DOM, w tym semantyczne `<header>` wewnątrz kart/sekcji w naszym body_top. Skutek — komponent renderuje się jako fixed top:0 i zasłania całą stronę.
type: lesson
scope: idobooking-clients
severity: critical
trigger: nasze HTML body_top używa semantic `<header>` w karcie/sekcji / klient zgłasza "lata jakiś element na górze strony"
added: 2026-05-15
source_client: fairrentals — sesja Sprint B v1.29, bug "lata element na górze /Obsluga-najmu"
related: trap #43 (default13 semantic conflicts), instinct 045 (chained class fix)
---

# Lekcja: `<header>` w karcie/sekcji = fixed top:0 katastrofa

## Symptom

Klient zgłasza: "**Na podstronie obsługa najmu jest coś totalnie nie tak, zobacz na górze lata jakiś element**"

Widać 2 elementy z napisami "Co-host", "Zarządzanie", "8%", "10%" przy LEWYM górnym rogu, przykrywając header + hero + część strony.

## Root cause

System Idosell template `default13` w `app.css.gz` ma globalną regułę:

```css
header {
  width: 100%;
  max-width: 100vw;
  position: fixed;
  z-index: 1010;
  left: 0;
  right: 0;
  top: 0;
  margin-top: 0;
  height: auto;
}
```

**Selektor `header` (bez klasy!)** — łapie **WSZYSTKIE** `<header>` elementy w DOM. Nie tylko `<header class="default13">` (page top nav), ale również:
- `<header>` wewnątrz `<article class="fr-compare-model">` (karty Sprint B Modele Współpracy)
- `<header>` wewnątrz `<section>` (page-hero subpages)
- `<header>` wewnątrz `<card>` lub `<aside>` w body_top

## Skutek w fairrentals

Nasza karta Sprint B:
```html
<article class="fr-compare-model">
  <header class="fr-compare-model__header">  <!-- semantyczny header karty -->
    <span class="fr-compare-model__badge">Co-host</span>
    <h3>Model co-host</h3>
    <div class="fr-compare-model__price">8%</div>
  </header>
  <div class="fr-compare-model__body">...</div>
</article>
```

System CSS `header { position: fixed; top: 0 }` zastosowała się do `<header class="fr-compare-model__header">`. Karta header renderowała się jako **fixed top:0, width:1425, height:259** — przykrywała całą górę strony.

## Fix (§99p w fairrentals/FR_ARKUSZ_STYLOW.css)

```css
/* Override system header rule TYLKO dla NIE-page-header elementów */
html body article header,
html body section header,
html body main header:not(.default13):not([class^="default"]),
html body header.fr-compare-model__header,
html body header[class*="fr-compare-model__"],
html body header[class*="fr-card__"],
html body header[class*="fr-section__"] {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  width: auto !important;
  max-width: 100% !important;
  z-index: auto !important;
  height: auto !important;
}

/* Footer dziedziczy podobnie */
html body article footer,
html body section footer,
html body footer[class*="fr-compare-model__"] {
  position: relative !important;
  top: auto !important;
  z-index: auto !important;
}
```

**Kluczowe**: `header:not(.default13):not([class^="default"])` — wykluczamy systemowy page-header (który MA być fixed) ale resetujemy wszystkie inne semantic header.

## Prevention (instinct na przyszłość)

**Opcja 1 — Używaj `<div>` zamiast `<header>` w komponentach wewnętrznych**:
```html
<article class="fr-compare-model">
  <div class="fr-compare-model__header">  <!-- div zamiast header -->
    <h3>Model co-host</h3>
  </div>
</article>
```

Plus: nie wymaga override CSS. Minus: tracimy semantic landmark dla screen readers.

**Opcja 2 — Zawsze dodaj override CSS przy starcie projektu**:
W bazowym CSS template default13 (warstwa 2) dla KAŻDEGO klienta dodaj §99p z override system header rule. Zapobiega problemowi prewencyjnie.

**Rekomendacja**: **Opcja 1** dla nowych klientów (lepiej semantic ALE NIE `<header>` w komponentach wewnętrznych — używaj `<div>` z `role="banner"` jeśli potrzebna semantyka). **Opcja 2** dla istniejących projektów gdzie nie ruszamy HTML.

## Dlaczego to wymknęło się testom

Bug nie pojawił się w **DevTools inject testach** podczas developmentu Sprintu B (sesja 12). Inject CSS w runtime NIE wymusza zastosowania systemu app.css w pełnej cascade — bo system CSS jest już loaded, a my dodajemy `<style>` LATER. Specificity równa → cascade order → mój inject wygrywał.

ALE po wgraniu CSS przez klienta do panelu, **plik custom.css** ma `?v=...` URL z cache CDN. Idosell może serwować STARSZĄ wersję custom.css z opóźnieniem → moja nowa rule NIE w cascade na live. System rule wciąż wygrywa.

**Lekcja**: Sprint B/C/D testować bezpośrednio na live URL **po wgraniu** (Cmd+Shift+R), nie tylko przez DevTools inject. Inject ma inną cascade order niż file-from-server.

## Inne semantic elements do uważania

W template default13 sprawdzić czy są też global rules dla:
- `footer { position: fixed }` — nie wykryte (raczej OK)
- `nav { display: flex }` — może łapać `<nav>` wewnątrz kart
- `aside { float: right }` — historic CSS, może łapać sidebary
- `main { padding: 0 }` — łapie wszystkie `<main>` (zazwyczaj 1 na stronę)

## Referencje

- Source client: fairrentals — Sprint B v1.29, fix §99p w sesji 12 (2026-05-14)
- Live verified: card header.fr-compare-model__header → position relative (was fixed), y=5177 (was y=0)
- Related lessons: live-verification-before-delivery, never-replace-working-pipeline
- Related instincts: 045 (chained class boost), 042 (specificity escalation)
