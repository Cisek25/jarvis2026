---
name: IdoBooking Litepicker --static — przesunięty kalendarz na /offer/N
description: System renderuje litepicker --static z inline styles + CSS rules które push kalendarz w prawo. Fix CSS reset position.
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Problem

Na `/offer/N` w zakładce "Kalendarz dostępności" Litepicker `--static` ma:
- Inline style: `position: absolute; top: 1966px; left: 0px`
- System CSS: `left: 569px !important; transform: translate(-403, 0) !important`

Net result: kalendarz przesunięty ~166px w prawo. Lewa strona pusta (klient: "brakuje miesięcy" — bo widzi 2 miesiące po prawej z empty space lewej).

# Detection

MCP chrome-devtools:
```js
const lp = document.querySelector('.litepicker.--static');
const cs = getComputedStyle(lp);
// cs.left: "569px"  ← problem
// cs.transform: "matrix(1, 0, 0, 1, -403, 0)"  ← problem
```

Visual: parent `.calendar-data` ma flex `justify-content: center`, ale kalendarz dziecko z fixed left+transform nie centruje się.

# Fix CSS

```css
html body .calendar-data .litepicker,
html body .litepicker.--static,
html body.page-offer .litepicker.--static {
  position: relative !important;
  left: 0 !important;
  top: 0 !important;
  transform: none !important;
  margin: 0 auto !important;
}
```

Po fixie: parent flex center centruje kalendarz horizontally. Oba miesiące widoczne.

# Reference: Fair Rentals v1.51 §109z

Plik: `DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css` sekcja §109z. Klient zgłosił w PDF Uwagi_2 #1.
