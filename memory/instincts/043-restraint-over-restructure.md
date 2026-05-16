---
name: restraint-over-restructure
description: Gdy klient mówi "popraw / pokoloruj / nie podoba mi się" — minimal coloring approach, NIE restructure DOM. System bootstrap layout zostaje, tylko colors + typography + subtle borders. "Tylko ja pokoloruj" = brak ::before, brak flex remap, brak hide internals.
type: instinct
scope: all-clients (silnik rezerwacji + main page)
trigger: user "pokoloruj" / "to wygląda źle" / niezdefiniowany feedback wizualny / niejasne czy chce restructure
added: 2026-05-06
source_client: piekary13 — sesja 2026-05-06, lekcja po v3 Hotel Concierge failure
related: instinct 041 (MCP audit przed restructure), lesson restructure-failure-piekary
---

# Instynkt: Restraint > maximalism

## Kontekst odkrycia

Sesja piekary13 silnik. User mówi "te wybory dat są fatalne, weź to przemyśl i zrób z głową".

Aktywowałem `frontend-design` skill, zaprojektowałem **Hotel Concierge Card** (radykalna restrukturyzacja: flex 50% kolumny, hero dates Playfair 96px, gold arrow `→` między datami, ::before labels "Przyjazd"/"Wyjazd"/"Goście"/"Filtry", hide system .hd-label, dotted gold hairline separator).

Wkleił. **User screenshot v3**: "te elementy dat, jak najedziesz to jakiś inny kolor biały" — layout się rozsypał. Daty rozjechane (05 i 06 daleko od siebie), ikona kalendarza w prawym rogu, FILTRY duplicate label (mój Filtry + system FILTRY), GOŚCIE+LICZBA OSÓB duplicate (mój Goście + system LICZBA OSÓB).

User: **"weź ty wycofaj PRZESTAWIANIE elementów i zmiany elementów, tylko ja pokoloruj wszystkie"**.

Cofnąłem do v4 — minimal coloring. Od tej pory sesja działała.

## Reguła

Gdy klient daje **niezdefiniowany feedback wizualny** ("popraw", "źle wygląda", "pokoloruj") — domyślne podejście to **minimal coloring**:

✅ **WOLNO**:
- Background colors
- Text colors
- Font family (jeśli logiczne — body Playfair/DM Sans)
- Font size (subtle adjustments, NIE radykalne)
- Border + border-radius (subtle obrys)
- Box-shadow (subtle highlight)
- Hover states (color change, NIE layout change)
- Padding/margin (subtle micro-adjustments)

❌ **NIE WOLNO** (chyba że klient wprost prosi):
- `display: flex/grid` restructure system DOM
- `::before` / `::after` z custom labels (system już ma swoje)
- `display: none` na system internals
- Reposition (top/left/transform) elementów
- Hide systemowych labels + replace via CSS content
- Hero typography 80px+ na elementach które mają być małe
- Decorative elementy (arrows, dots, dividers) wstrzyknięte przez CSS

## Triggers fall-back na minimal

| User feedback | Approach |
|---|---|
| "Popraw" / "Nie podoba mi się" | minimal coloring |
| "Pokoloruj" | TYLKO colors + typography |
| "Wygląda źle" | minimal + zapytaj o szczegół |
| "Rozjechane" | layout fix (defensive, najmniej zmian) |
| "Niespójne" | unifikuj kolory/wymiary |
| "Brzydkie" | zapytaj BOLD direction (frontend-design) — explicit prośba o restructure |
| "Zaprojektuj na nowo" | OK frontend-design, restructure dozwolony |

## Anti-pattern (czego NIE robić)

```css
/* ❌ Hotel Concierge restructure — bez explicit user buy-in */
.calendar-menu {
  display: flex !important;        /* override system bootstrap col-lg-3 */
  flex-direction: column !important;
}
.calendar-menu-from::before {
  content: "Przyjazd";              /* duplicate z system .hd-label POCZĄTEK */
  ...
}
.hd-label { display: none !important; }  /* hide system label */
.calendar-menu-day { display: inline !important; }  /* break system DOM */
```

```css
/* ✅ Minimal coloring — bezpieczne default */
.calendar-menu {
  background: var(--cream) !important;
  border-radius: var(--radius) !important;
  /* layout zostaje */
}
.hd-label {
  color: var(--gold-dark) !important;
  font-size: 11px !important;
  letter-spacing: 0.3em !important;
  /* tekst zostaje, tylko styling */
}
.date_d {
  font-family: var(--font-heading) !important;
  font-size: clamp(32px, 4vw, 48px) !important;
  color: var(--burgundy) !important;
  /* size scaling, nie layout reposition */
}
```

## Workflow

```
1. User feedback otrzymany
2. Czy to JASNE prośba o restructure? ("zaprojektuj nowo", "zmień layout")?
   ✓ TAK → frontend-design skill, BOLD direction OK
   ✗ NIE → minimal coloring approach
3. Implementuj minimal
4. Zapytaj user "OK czy chce więcej?"
5. Eskaluj tylko gdy explicit prośba
```

## Wyjątki — kiedy restructure jest OK

- Klient mówi "zaprojektuj nowo" / "BOLD design" / "kreatywnie"
- Brak system DOM (od zera HTML, nie kodzimy w iframe IdoBooking)
- Custom widget/component bez system constraints
- User mówi "całkowicie inny look"

## Referencje

- Lesson `memory/lessons/engine-styling-iteration-process.md` — pełny proces v1-v13
- Lesson `memory/lessons/restructure-failure-piekary.md` — co się stało v3
- Sesja piekary13 v3-v13 — `clients/piekary13/DO_WKLEJENIA/ENGINE_CSS.css`
- Brainstorming skill: `superpowers:brainstorming` — zawsze przed restructure
