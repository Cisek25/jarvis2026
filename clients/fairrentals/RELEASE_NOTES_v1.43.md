# Fair Rentals — Release v1.43 (SZUKAJ = INPUT height, nie field)

**Data**: 2026-05-15 (sesja 12 — korekta klienta po v1.42)
**Stan przed**: v1.42 (SZUKAJ stretch do height 76px = field z labelem)
**Stan po**: v1.43 (SZUKAJ height 52px = sam INPUT, align-self: end)

---

## Korekta

Klient w v1.42 dostał SZUKAJ height 76px (= całe field z labelem). **NIE chciał tego**. Klient chce żeby SZUKAJ był wysoki jak **sam input** (52px) — czyli WSZYSTKIE 4 elementy w `.fr-cmd-bar` (Wybierz datę, Wybierz datę 2, 2 osoby, SZUKAJ) miały **identyczną wysokość 52px** wyrównane top i bottom.

Klient: *"WYSOKOSC przycisku i tego POLA ma byc ROWNA, pole Wybierz date i pol goscie i przycisk szukaj MA MIEC TAKA SAMO WYSOKOSC"*

---

## Fix §107i v1.43

Zmiany vs v1.42:
- `align-self: stretch` → **`align-self: end`** (na dole grid row, na linii z inputami)
- `height: auto` → **`height: 52px`** + `max-height: 52px` (lock height = input)
- `font-size: 16px` → **`font-size: 15px`** (klient: "tylko trochę większe niż input 13")
- `padding: 14px 26px` → **`padding: 0 24px`** (height jest fixed, padding tylko poziomy)
- `gap: 12px` → **`gap: 10px`** (mniejszy odstęp tekst-ikona)
- SVG `width: 22px` → **`width: 20px`** (proporcjonalnie do mniejszego buttona)
- `line-height: 1` (zabezpiecza vertical center text)

Specificity zachowany (0,4,4) — chained body+form+button selektory.

---

## Live verified (chrome-devtools MCP)

```javascript
{
  sizes: {
    szukajHeight: 52,    ← = INPUT height 52
    inputHeight: 52,
    fieldHeight: 76.39,  ← field z labelem (label 24 + input 52)
    matches_input: TRUE  ✓
  },
  alignment: {
    szukajBottom: 820,   ← = INPUT bottom 820
    inputBottom: 820,
    szukajTop: 768,      ← = INPUT top 768
    inputTop: 768,
    bottom_aligned: TRUE ✓
    top_aligned: TRUE    ✓
  },
  szukajCS: {
    alignSelf: "end",    ← na dole grid row
    height: "52px",
    fontSize: "15px"     ← trochę większy niż input 13px
  }
}
```

WSZYSTKIE pola + SZUKAJ:
- Identyczna wysokość 52px
- Wyrównane top i bottom (jedna linia)
- Wybierz datę / Wybierz datę / 2 osoby / SZUKAJ → wizualnie spójne

---

## Wgranie

1. Wgraj zaktualizowane [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css)
2. Cmd+Shift+R
3. Verify na `/`:
   - 4 elementy w wyszukiwarce mają identyczną wysokość 52px ✓
   - Wyrównane top/bottom edge ✓
   - SZUKAJ tekst trochę większy niż input (15px vs 13px) ✓
   - Ikona lupy 20×20

---

## Status

| | v1.42 | **v1.43** |
|---|---|---|
| SZUKAJ height | 76px (= field z labelem) | **52px** (= input, klient chciał) |
| SZUKAJ vs input top/bottom | mismatch (SZUKAJ wyższy) | **perfectly aligned** ✓ |
| SZUKAJ font-size | 16px | 15px (trochę większy niż input 13) |
| Litepicker pozycja (z v1.42) | top 20% modal ✓ | bez zmian ✓ |
| Pastylka OD centered (z v1.41) | ✓ | ✓ |
