# CRITICAL LESSON — IdoBooking default13 template CSS variables

**Data odkrycia:** 2026-04-20
**Template:** `default13` (IdoBooking v13)

## Problem

IdoBooking w template `default13` używa **WŁASNEGO design systemu z CSS vars**. Żeby zmienić kolory strony, trzeba **NADPISYWAĆ TE ZMIENNE**, a NIE dodawać własne. Dodawanie własnych `.ap-*` reguł ze swoimi `--ap-forest` NIE zmieni koloru menu, booking engine, przycisków, formularza — bo system używa swoich `--maincolor1`, `--supportcolor1` itd.

## Lista IdoBooking CSS vars (default13)

Sprawdzone na produkcji `client58154.idobooking.com`, 2026-04-20:

| Zmienna | Default | Co steruje |
|---------|---------|-----------|
| `--maincolor1` | `#0f172a` | Główny kolor brand (text, accents, hero) |
| `--maincolor2` | `#2e3a52` | Drugi kolor brand (hover, secondary) |
| `--maincolor1_rgba` | `46,58,82` | RGBA version dla rgba() — **WAŻNE: to numeric, nie hex!** |
| `--supportcolor1` | `#ff7218` | Kolor akcentu (buttony rezerwacji, highlights) |
| `--supportcolor2` | `#e5e5e5` | Drugi akcent (borders, tła subtelne) |
| `--bgcolor1` | `#fff` | Główne tło strony (body) |
| `--bgcolor2` | `#f1f1f1` | Drugie tło (sekcje alternatywne) |
| `--bgcolor3` | `#fff` | Trzecie tło (cards, modals) |
| `--hovercolor1` | `#fff` | Kolor tekstu przy hover |
| `--hovercolor2` | `#fff` | Drugi hover |
| `--widget_header` | `#b0b2b1` | Header widget rezerwacji |
| `--btn_large` | `#0f172a` | Główny button (Rezerwuj duży) |
| `--btn_medium` | `#0f172a` | Średni button |
| `--bgaside` | `#fff` | Tło sidebarów, date pickers |

## Jak override (kolejność ma znaczenie!)

```css
:root, html {
  /* MUST use !important — domyślne IdoBooking ma specificity wyżej */
  --maincolor1: #2F4A3A !important;
  --maincolor2: #5D7A55 !important;
  --maincolor1_rgba: 47, 74, 58 !important; /* odpowiednik #2F4A3A */
  --supportcolor1: #C07B5E !important;
  --supportcolor2: #E8D4C4 !important;
  --bgcolor1: #FAF7F2 !important;
  --bgcolor2: #F2ECE0 !important;
  --bgcolor3: #FFFDF8 !important;
  --hovercolor1: #FFFDF8 !important;
  --hovercolor2: #FFFDF8 !important;
  --widget_header: #FAF7F2 !important;
  --btn_large: #2F4A3A !important;
  --btn_medium: #2F4A3A !important;
  --bgaside: #FFFDF8 !important;
}
```

## Jak znaleźć wszystkie IdoBooking vars dla danego klienta

```js
// W DevTools Console na live site klienta
const rs = getComputedStyle(document.documentElement);
const idoVars = {};
[...document.styleSheets].forEach(s => {
  try {
    [...s.cssRules].forEach(r => {
      if (r.selectorText === ':root') {
        const txt = r.cssText;
        const matches = txt.match(/--[\w-]+:\s*[^;]+/g) || [];
        matches.forEach(m => {
          const [name, val] = m.split(':').map(x => x.trim());
          idoVars[name] = val;
        });
      }
    });
  } catch(e) {}
});
console.table(idoVars);
```

## Jak to wpływa na design proces

1. **Przed kodowaniem**: sprawdź która wersja template'u (default11, default13). W konsoli: `document.querySelector('header').className`.
2. **Check aktualne vars**: odpali skrypt wyżej, zapisz domyślne wartości.
3. **Zaplanuj override**: dla KAŻDEJ zmiennej z listy wyżej ustaw odpowiednik w nowej palecie.
4. **Zweryfikuj**: po wklejeniu, sprawdź w DevTools `getPropertyValue('--maincolor1')` czy wartość zmieniła się.

## Trap pokrewny

Jeśli `--maincolor1_rgba` nie jest zaktualizowane razem z `--maincolor1`, **przezroczyste overlay'e zachowają stary kolor**. System używa `rgba(var(--maincolor1_rgba), 0.5)` w wielu miejscach — jeśli zmienisz `--maincolor1` ale nie `--maincolor1_rgba`, kolory nie będą spójne.

## Related traps

- Trap #3 CLAUDE.md: `.menu-wrapper.bgd-color-light` — teraz wiemy że background tej klasy jest sterowany przez IdoBooking `--bgcolor1` lub `--bgcolor3`
- Trap #6 CLAUDE.md: `.footer-contact-baner::before` — używa `--maincolor1`, więc override `--maincolor1` rozwiązuje problem

## TL;DR

W IdoBooking default13: **NADPISUJ `--maincolor1, --supportcolor1, --btn_large, --bgcolor1, --widget_header` w :root z !important**, a nie dodawaj własne `--ap-forest` które system ignoruje.
