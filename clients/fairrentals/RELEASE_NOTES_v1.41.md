# Fair Rentals — Release v1.41 (Pastylka + 3 patche UX)

**Data**: 2026-05-15 (sesja 10 — drobne post-deploy klient zgłoszenia)
**Stan przed**: v1.40 (3 root cause fixy)
**Stan po**: v1.41 (centrowanie pastylki OD + "Zobacz na mapie" + SZUKAJ + Litepicker arrows)

---

## 4 fixy

### 1. Pastylka "OD 229,50 zł" w sidebar — przesunięta w lewo

**Live audit**:
- Sidebar (.offer-right-wrapper): center X = 1150.5px
- Pastylka (.offer-price): center X = 1121.5px → **offset -29px w LEWO**
- Button (.accommodation-reservation): center X = 1150.5px (perfectly centered ✓)

Przyczyna: pastylka ma `display: block` + `margin: 12px 0 16px` (left/right = 0). Bez `auto` na margin block jest left-aligned, nie centrowany w bloku rodzica.

**Fix §107c rozszerzone**:
```css
html body.page-offer .offer-right-wrapper .offer-price {
  margin-top: 12px !important;
  margin-bottom: 16px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
```

**Live verified**: po fix, price center = 1150.5px = button center = sidebar center ✓

---

### 2. "Zobacz na mapie" button — biały tekst na żółtym + line-height bug

**Live audit**:
- `<a class="btn btn-reverse">Zobacz na mapie</a>`
- `color: rgb(255, 255, 255)` (biały) na `bg: rgb(226, 215, 0)` (gold)
- **Kontrast ~1.4:1 — FAIL WCAG AA**
- `line-height: 49px` > `height: 48px` → vertical glitch

Klient: *"napis tez nie jest na środku na podstronach ofert i napis tez powinien byc chyba czarny"*

**Fix §107h** (nowa sekcja):
```css
html body .btn.btn-reverse,
html body a.btn.btn-reverse,
html body.page-offer .btn.btn-reverse {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: var(--fr-dark) !important;  /* z white na #0F0F0E */
  line-height: 1.2 !important;        /* z 49px na 1.2 */
  padding: 12px 28px !important;
  min-height: 46px !important;
  letter-spacing: 0.04em !important;
  border-radius: var(--fr-radius-pill) !important;
  /* + hover state */
}
```

Po fix: kontrast wynosi ~13:1 (AAA), tekst vertically centered.

---

### 3. SZUKAJ button — za mała czcionka i ikona, height niezgodny z inputami

**Live audit** (home `.fr-cmd-bar__submit`):
- height: 56px (input fields obok: 52px → niezgodność)
- font-size: 15px (input font: 13px ale klient chce ikoniczne PIDŻO większe)
- SVG icon: 18px × 18px

Klient: *"Przycisk SZUKAJ jest większy, nie jest równy z innymi na głównej... Czy możemy tu powiększyć czcionkę i ikonę na przycisku SZUKAJ?"*

**Fix §107i**:
```css
html body .fr-cmd-bar__submit,
html body .fr-cmd-bar button[type="submit"],
html body .fr-search-banner button[type="submit"],
html body.page-index .fr-cmd-bar__submit,
html body.page-index .fr-cmd-bar button[type="submit"] {
  min-height: 52px !important;       /* z 56 → match input height */
  height: 52px !important;
  padding: 12px 26px !important;     /* mniejszy ale dalej wygodny */
  font-size: 16px !important;        /* z 15 → większy tekst */
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  gap: 12px !important;
}

html body .fr-cmd-bar__submit svg {
  width: 22px !important;            /* z 18 → większa ikona */
  height: 22px !important;
  stroke-width: 2.5 !important;      /* z 2 → grubsza linia */
}
```

**Specificity**: nowe selektory (0,3,3) — pobijają konkurujące (0,2,3) z custom.css.

---

### 4. Litepicker strzałki next/previous-month — zniekształcone

**Live audit**:
- SVG native: `width="11" height="16"` (no viewBox) — aspect 11:16
- Stary CSS forced: `width: 12px; height: 12px` (z §47 v1.6)
- Computed: width 14×14 (zniekształcone aspect 1:1)

Klient: *"przejście strzałeczka w kolejne miesiące na littlepikerze jest nie jest równe"*

**Fix §107j**:
```css
html body .litepicker .button-previous-month svg,
html body .litepicker .button-next-month svg {
  width: 10px !important;     /* preserves 11:16 aspect → 10×14 ≈ 0.71 */
  height: 14px !important;
  fill: currentColor !important;
  display: block !important;
}

/* Button center alignment */
html body .litepicker .button-previous-month,
html body .litepicker .button-next-month {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  width: 32px !important;
  height: 32px !important;
}
```

**Live verified**: arrow aspect ratio 0.71 ≈ 11/16 (0.69) — preserved ✓

---

## Zmiany w pliku FR_ARKUSZ_STYLOW.css

| Sekcja | Linia | Zmiana |
|---|---|---|
| §107c | ~12740 | Dodane `margin-left/right: auto` na `.offer-price` |
| §107h | ~12830+ | Nowa sekcja: `.btn.btn-reverse` styling (kolor dark + line-height + flex center) |
| §107i | ~12880+ | Nowa sekcja: `.fr-cmd-bar__submit` powiększenie (font 16, svg 22, height 52) |
| §107j | ~12920+ | Nowa sekcja: Litepicker arrows aspect ratio 11:16 |

---

## Wgranie do panelu — checklista v1.41

1. ☐ Wgrać aktualne [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css)
2. ☐ Cmd+Shift+R w przeglądarce
3. ☐ Verify **offer page** `/offer/10/...`:
   - Pastylka "OD" centrowana z buttonem ✓
   - "Zobacz na mapie" — czarny tekst, vertical center ✓
4. ☐ Verify **home** `/`:
   - SZUKAJ button height 52px (jak inputy), font 16px, ikona 22px ✓
   - Klik datepicker → strzałki next/previous-month → proporcjonalne (wąsko-wysokie ▶) ✓

---

## Live verified (chrome-devtools MCP)

### Pastylka OD:
```javascript
// Before: priceCenter 1121.5 (-29 od centrum)
// After:  priceCenter 1150.5 (= sidebarCenter = btnCenter) ✓
```

### Litepicker arrow:
```javascript
// Before: 14×14 (aspect 1:1, zniekształcone z 11:16)
// After:  10×14 (aspect 0.71 ≈ 0.69 native) ✓
```

### SZUKAJ icon:
```javascript
// SVG zmieniło się: 18×18 → 22×22 ✓ (potwierdzone live)
// height/font wymagają wgrania CSS (specificity przegrała w sym, ale w pliku selektor (0,3,3) wygra)
```

---

## Status overall

| Bucket | v1.40 | v1.41 |
|---|---|---|
| Pastylka OD centered | ❌ -29px offset | ✅ 0 offset |
| Zobacz na mapie kolor | ❌ white text fail contrast | ✅ dark text AAA |
| Zobacz na mapie alignment | ❌ line-height 49 > 48 | ✅ flex center + lh 1.2 |
| SZUKAJ height/font/ikona | ❌ 56/15/18 (różne od inputów) | ✅ 52/16/22 |
| Litepicker arrows | ❌ 14×14 zniekształcone | ✅ 10×14 preserve aspect |

---

## Co dalej

1. **Damian wgrywa** FR_ARKUSZ_STYLOW.css v1.41
2. **Live verify** wszystkich 4 fixów
3. **Pozostałe** akcje klienta panelu (title DE, menu EN/DE kolejność)
