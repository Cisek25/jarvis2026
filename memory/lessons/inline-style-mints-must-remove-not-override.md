---
name: Inline `style="color:#XXX"` w body_top — usuwaj inline, nie nadpisuj CSS
description: Gdy klient zgłasza "2 odcienie zielonego/koloru X mimo CSS override" — sprawdź inline styles w HTML body_top. Specyficzność inline > zewnętrzny CSS, nawet z !important w wielu wypadkach
type: lesson
---

## Co się stało

AP v1.8.9-1.8.15 (2026-04-23) — 4 patch'e z rzędu próbowały ujednolicić "2 odcienie zielonego" przez CSS override.

CSS override: `body header .ap-pagehero__title em { color: #fff !important }` (specyficzność 0,0,2,1).

**Klient zgłaszał ten sam problem 4 razy** w odstępach kilku dni: "Nadal są 2 kolory zielonego."

Po 4 iteracjach dopiero sprawdziłem **HTML body_top** subpages (ONAS_PL, GALERIA_PL, LOKALIZACJA_PL) i zobaczyłem inline:

```html
<span class="ap-kicker" style="color:#A8E6B8;">REZERWACJA</span>
<h2>... <em style="font-style:italic;color:#A8E6B8;">Gnieźnie</em></h2>
<span class="ap-heading-rule" style="background:#A8E6B8;"></span>
<a href="/offers" class="ap-hero__cta" style="margin-top:32px;background:#A8E6B8;color:var(--ap-dark);">
```

**Inline `style="color:#A8E6B8"` ma specyficzność 1,0,0,0** — przebija każde `body html .ap-kicker { color:#fff !important }` (max 0,0,3,1).

## Why nie wykryłem od razu

1. CSS specyficzność intuicyjnie: `!important` wygrywa zawsze. **Wrong.** `!important` w inline > `!important` w stylesheet.
2. Inline styles nieidexowane przez JARVIS validator.
3. v1.8.9 dodawał reguły CSS, nie usuwał inline mints. Każdy kolejny patch zwiększał specyficzność CSS, ale inline stale wygrywał.
4. Live testing w playwright pokazywał computed style = #A8E6B8 (z inline). Naiwnie myślałem "user nie wkleił nowego CSS" zamiast "może inline w HTML wygrywa".

## Fix v1.9.0

```html
<!-- PRZED (wygrywa inline mint) -->
<span class="ap-kicker" style="color:#A8E6B8;">REZERWACJA</span>

<!-- PO (CSS wygrywa, klasa kicker bierze kolor z .ap-final-cta scope) -->
<span class="ap-kicker">REZERWACJA</span>
```

**Usunięto WSZYSTKIE inline `style="color:#A8E6B8"` (i `background:#A8E6B8`) z 6 plików:**
- ONAS_PL/EN final-cta (kicker + em + heading-rule + cta-bg)
- GALERIA_PL/EN final-cta (analogicznie)
- LOKALIZACJA_PL/EN final-cta (analogicznie)

CSS v1.9.0 §(8) UNIFIED GREEN ujednolica final-cta (kicker, em, rule, cta) na biały — po usunięciu inline mints, CSS wygrywa.

## Lekcja na przyszłość

### Specyficzność CSS — kolejność
1. **Inline `!important`** > stylesheet `!important`
2. **Inline (bez !important)** > stylesheet (bez !important) — bo specyficzność 1,0,0,0
3. Stylesheet `!important` może przebić inline (bez !important) — ale tylko z PEŁNĄ specyficznością `html body header.foo .bar.baz` (5+ klas)

### Pierwsze pytanie przy "2 odcienie" / "kolor X nie zmienił się":
**Sprawdź inline `style="..."` w HTML body_top tej strony**. To prościej niż dodawać kolejny CSS override.

### Live diagnostyka
W playwright/devtools sprawdź:
```js
getComputedStyle(el).color
// → jeśli #A8E6B8 a CSS twierdzi że #fff — INLINE WYGRYWA
// → jeśli #fff — CSS wygrywa, problem gdzie indziej
```

Sprawdź też w devtools panel "Styles":
- Stylesheet rule = przekreślona = inline ją bije
- "element.style { ... }" sekcja na górze = inline jest

### Domyślnie w body_top: ZERO inline styles
Wszystkie style w `AP_CSS_EDYTOR.css`. Inline tylko gdy:
- Atomic helper (`style="margin-top:32px"`) — bezpieczny, nie kolor
- Layout-only (`style="max-width:600px"`) — bezpieczny
- **NIGDY kolor / background / display** — to do CSS

### Audit checklist nowego klienta (przed deploy):
```bash
grep -rn "style=\"color:" clients/{klient}/DO_WKLEJENIA/*.html
grep -rn "style=\"background:#" clients/{klient}/DO_WKLEJENIA/*.html
```
Wynik powinien być pusty albo bardzo krótki (legit edge cases).

## Referencja

Bug: AP v1.8.9-1.8.15 (4 iteracje próbowały override CSS, nie działało).
Fix: AP v1.9.0 (2026-05-04) — usunięcie inline z 6 plików + CSS unify.
Memory: `clients/apartamenty-parkowe.json` history v1.9.0 → fixes.6 + fixes.9.
