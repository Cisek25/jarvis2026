# 059 — Powered by IdoBooking MUSI BYĆ DOBRZE WIDOCZNY

## Kiedy stosować

**ZAWSZE na starcie edycji ISTNIEJĄCEGO projektu IdoBooking** — przed rozpoczęciem właściwej pracy zrób audit `.powered_by` w CSS klienta. To pierwszy element do sprawdzenia, nie ostatni.

Również: przy każdym NOWYM projekcie — pattern z `library/css/layer1-traps.css` linia ~419 musi zostać w CSS_EDYTOR.css bez modyfikacji w stronę ukrycia/dimowania.

## Symptom (co user widzi)

- **"jezu strasznie to małe to powered by idobooking"** — badge w stopce ~80×16px, ledwo widoczny
- **"a czemu logo jest białe? powinno być z kolorami idobooking"** — filter brightness/invert pomalował logo na biało zamiast natywnych brand colors
- Footer wygląda jak gdyby vendor attribution był wcześniej, ale nie ma go widać

## Root cause

W naszych starych CSS-ach (Layer 1 trap, CRITICAL-SS) była reguła:
```css
.powered_by img {
  max-width: 80px !important;
  max-height: 18px !important;
  filter: brightness(0) invert(1) !important;
  opacity: 0.35 !important;
}
```

Powód historyczny: native badge IdoBooking jest SVG/PNG ~120×24px z brand colors (navy + light blue text). Designer projektu chciał "subtle attribution" więc dimował i skalował w dół. **To narusza wymóg licencyjny IAI**: Powered by IdoBooking musi być DOBRZE WIDOCZNY w stopce.

## Pattern (skopiuj do CSS_EDYTOR.css każdego klienta)

```css
/* Powered by IdoBooking — wymóg licencyjny IAI, MUSI BYĆ WIDOCZNY */
.powered_by,
.powered_by_logo,
.powered-by,
footer .powered_by,
footer .powered_by_logo {
  display: inline-block !important;
  vertical-align: middle !important;
  visibility: visible !important;
  opacity: 1 !important;
  margin: 0 0 0 8px !important;
  padding: 0 !important;
  background: transparent !important;
}
.powered_by img,
.powered_by_logo img,
.powered-by img,
footer .powered_by img,
footer .powered_by_logo img {
  filter: none !important;         /* NIE brightness/invert — brand colors zostają */
  width: auto !important;
  height: 40px !important;         /* 2× natywnego ~20px */
  max-width: none !important;
  max-height: none !important;
  opacity: 1 !important;
  display: inline-block !important;
  vertical-align: middle !important;
}
```

Dla silnika rezerwacji (ENGINE_CSS.css) ten sam pattern + dodać `.iai-logo` do listy selektorów.

## 4 krytyczne zasady

1. **NIE filtruj kolorów** — `filter: brightness(0) invert(1)` = białe logo, zniekształca brand
2. **NIE ukrywaj** — `display:none`, `visibility:hidden`, `opacity:0`, `width:0` to naruszenie TOS
3. **NIE skaluj w dół poniżej czytelności** — `max-width:80px` z natywnym 120px = nieczytelny badge
4. **Pozycja inline w systemowym footer row jest OK** — nie wyrzucaj badge na własny rząd centered (klient preferuje inline, system to dobrze układa)

## Audit workflow przy starcie nowego projektu

```bash
# 1. Sprawdź czy klient ma w CSS rules ukrywające/dimujące
grep -B1 -A5 "powered_by\|powered-by\|iai-logo" clients/{KLIENT}/DO_WKLEJENIA/*.css

# 2. Jeśli widzisz:
#    - display: none
#    - visibility: hidden
#    - opacity < 0.85
#    - max-width < 120px
#    - max-height < 32px
#    - filter: brightness(0) invert
#    → wymień na pattern z library/css/layer1-traps.css linia ~419

# 3. Live verify po wklejeniu:
#    DevTools → footer → znajdź .powered_by img → 
#    naturalWidth ~120, computed width ~200 (height:40 forces 2× scale)
```

## Lessons learned (Piekary 1-3, 2026-05-14)

Wziąłem 4 iteracje żeby znaleźć właściwy pattern:
- v1: `max-width:160px` — wciąż za mały (system renderuje natywny ~80px)
- v2: `240×56 + flex-basis:100% + order:99` — własny rząd, za dużo zmian layoutu
- v3: `height:40px inline + filter:brightness(0) invert(1)` — białe logo, błąd kolorów
- **v4 FINAL: height:40px inline + filter:none** — zachowane brand colors, 2× scale, inline

Lessons:
- Native size IdoBooking powered_by: ~120×24px PNG/SVG
- `height:40px + width:auto` skaluje 2× zachowując aspect-ratio
- `max-width:none + max-height:none` MUSZĄ być explicit — bez tego stary trap-SS wraca
- Brand colors działają na dark burgundy bez filtra (designed dla różnych tł)

## Files referencyjne

- `library/css/layer1-traps.css` linia ~419 — template do skopiowania
- `library/css/layer1-traps.css` ~1972 — komentarz bug-3 (zaktualizowany)
- `clients/piekary13/CSS_EDYTOR.css` sekcja 2 + sekcja 36 — wzorzec implementacji
- `clients/piekary13/ENGINE_CSS.css` §8b — wzorzec dla silnika
- `memory/feedback_powered_by_idobooking_visible.md` (auto-memory) — historia iteracji
- `lessons/worktree-vs-main-repo-stale-paste.md` — pokrewny problem z plikami

## NIE myl z

- `lessons/never-reduce-working-css.md` — różny problem (nie redukować, ale tu chodzi o STARE rules do usunięcia)
- `instincts/013-logo-chip-background.md` — to o logo klienta w nav, nie o powered_by
