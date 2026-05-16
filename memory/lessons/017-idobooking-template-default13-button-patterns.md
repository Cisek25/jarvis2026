# Lesson 017 — IdoBooking default13 ma min. 3 różne button patterny — sprawdzaj DOM!

**Data**: 2026-05-15 (sesja 9-12, Fair Rentals v1.40-v1.43)
**Klient**: Fair Rentals (client58360)
**Symptom**: Klient wielokrotnie zgłaszał problem z buttonem "Zarezerwuj teraz" w różnych lokalizacjach. Moje fixy targetowały JEDEN wzorzec, nie wszystkie 3.

---

## 3 różne button patterny dla "Zarezerwuj teraz" w default13

### Pattern 1: Sidebar button (`/offer/X` prawa kolumna)

```html
<div class="offer-right offer-right-top">
  <div class="room_rez">
    <a class="accommodation-reservation" onclick="generateWidgetIdoSellBooking(this)">
      <span class="btn button accommodation-leftbutton">ZAREZERWUJ TERAZ</span>
    </a>
  </div>
</div>
```

Wewnątrz prawej kolumny `.col-lg-3.offer-right-wrapper`. Często duplicate w `.offer-right-bottom` (mobile only).

**Selector**: `.accommodation-reservation` (outer `<a>`) + `.btn.button.accommodation-leftbutton` (inner `<span>`)

### Pattern 2: Cennik bottom button (tabela cennika na dole `/offer/X`)

```html
<table>
  <tr class="season-cell_main">
    <td>
      <div class="room_rez">
        <a onclick="generateWidgetIdoSellBooking(this)">
          <span class="btn btn-reverse">ZAREZERWUJ TERAZ</span>
        </a>
      </div>
    </td>
  </tr>
</table>
```

**Selector**: `tr.season-cell_main .btn.btn-reverse` (`<a>` BEZ klasy, span z `.btn.btn-reverse` NIE `.accommodation-leftbutton`)

### Pattern 3: SZUKAJ button na home (search bar)

```html
<form class="fr-cmd-bar__form">
  <button type="submit" class="fr-cmd-bar__submit">Szukaj <svg>...</svg></button>
</form>
```

**Selector**: `.fr-cmd-bar__submit` lub `.fr-cmd-bar button[type="submit"]`

## Dlaczego to ważne

**Każdy pattern ma:**
- Inną strukturę HTML (a/span vs button vs a/span różne klasy)
- Inne systemowe style (różne specificity / source order)
- Inną semantykę (reservation widget click vs price table button vs search submit)

**Próba ujednolicenia 1 selectorem NIE działa** — patrz:
- v1.39 `.accommodation-reservation` matched tylko Pattern 1
- Klient zgłosił że cennik bottom button też niewyśrodkowany
- v1.40 dodał §107g dla Pattern 2 (`.btn.btn-reverse`)

## Lesson

**Przy każdym CTA/button issue na IdoBooking:**

1. **Live audit przez chrome-devtools** — znajdź WSZYSTKIE elementy z danym tekstem ("Zarezerwuj teraz"):
```js
Array.from(document.querySelectorAll('a, button, span, div'))
  .filter(el => el.children.length === 0 && /zarezerwuj teraz/i.test(el.textContent))
  .map(el => ({
    tag: el.tagName,
    classes: el.className,
    parentClasses: el.parentElement?.className,
    ancestors: [...] // walk up 3 levels
  }));
```

2. **Sprawdź unikalne klasy** dla każdego pattern (np. `.accommodation-leftbutton` vs `.btn-reverse`)

3. **CSS na każdy pattern osobno** — nie próbuj 1 selectorem łapać wszystkich

## Sprawdzona lista button klas na default13

| Lokalizacja | Outer | Inner | Trigger |
|---|---|---|---|
| Sidebar (offer page) | `a.accommodation-reservation` | `span.btn.button.accommodation-leftbutton` | onclick widget |
| Cennik bottom (offer page) | `a` (no class) | `span.btn.btn-reverse` | onclick widget |
| Search submit (home) | `button.fr-cmd-bar__submit` | direct text + svg | form submit |
| CTA pill (`.fr-final-cta`) | `a.fr-btn.fr-btn--primary` | direct text | href link |
| Compare model footer | `a.fr-btn.fr-btn--primary` | direct text | href link |
| Outline button | `a.fr-btn.fr-btn--outline` | direct text | href link |
| Filter button (offers) | `button.btn.btn-default` | `span.filter-bar__icon` + text | form submit |
| Map "Zobacz na mapie" | `a.btn.btn-reverse` | direct text | href link |

## Powiązane

- Memory: lesson 015 (same specificity rules conflict)
- Memory: instinct 005 (filters_submit brand styling)
- Klient: Fair Rentals v1.40-v1.45 (2026-05-15)
- Pliki CSS: §107d (accommodation-reservation), §107g (btn-reverse cennik), §107i (SZUKAJ), §107h (btn-reverse map), §108c (fr-btn--primary)
