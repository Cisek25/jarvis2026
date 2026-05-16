# Fair Rentals — Release v1.40 (3 fixy które v1.39 nie naprawiło)

**Data**: 2026-05-15 (sesja 9 — klient feedback "realnie nie poprawiłeś nic")
**Stan przed**: v1.39 (5 UX fixy + OG image)
**Stan po**: v1.40 (3 root cause fixy które v1.39 nie domknęło)

---

## Klient zgłosił 3 problemy które nadal istnieją po wgraniu v1.39

### 1. Zarezerwuj button w sidebar — tekst nadal "krzywo"
### 2. Sticky tabs po scrollu — nadal luka między tabs a header
### 3. Cennik bottom button — nierówny tekst

Audit chrome-devtools wykrył **root causes**:

---

## Root cause #1: Stara reguła §100b nadpisywała moją §107d

**Live audit pokazał** że w `customStyles/.../custom.css?v=1778842729` ŻYWE są DWIE konfliktujące reguły:

```css
/* §100b (stara, z v1.31 Sprint F MEDIUM) - linia 11188 mojego pliku */
html body.page-offer .col-lg-3 .btn,
html body.page-offer .col-lg-3 button,
... {
  display: block !important;
  width: 100% !important;
  background: var(--fr-primary) !important;
  ...
}

/* §107d (z v1.39) - linia 12700+ */
html body .accommodation-reservation .btn.button,
... {
  display: inline !important;
  width: auto !important;
  background: transparent !important;
  ...
}
```

**Problem**: Oba selektory mają specificity **(0, 3, 2)**. §107d jest later w source order → powinno wygrać. ALE inner span (`<span class="btn button accommodation-leftbutton">`) ma klasę `.btn` — i `.col-lg-3 .btn` z §100b matchuje gold bg + display:block + width:100% → tekst "ZAREZERWUJ TERAZ" się łamie na 2 linie w wąskim sidebarze (208px).

**Fix v1.40**:
1. **USUNIĘTA** cała stara reguła §100b dla `.col-lg-3 .btn` (linie 11188-11216) — to ona powodowała konflikt
2. **WZMOCNIONA** §107d z trzema chained classami `(.btn.button.accommodation-leftbutton)` dla wyższej specificity (0, 4, 3) — wygrywa zawsze
3. **DODANE** parametry buttona: `white-space: nowrap`, `padding: 14px 14px` (mniej z prawej/lewej), `font-size: 13px` (z 14px), `letter-spacing: 0.04em` (z 0.08em) — żeby "ZAREZERWUJ TERAZ" zmieściło się w 1 linii bez wrap

**Live verified**:
```javascript
// Before v1.40: btn height 78px (tekst wraps na 2 linie)
// After v1.40:  btn height 48px (1 linia) ✓
```

---

## Root cause #2: Sticky tabs §107e użyło wrong selectora

**Live audit pokazał** że po scrollu system Idosell:
- Dodaje klasę `--fixed` do `.tabs` (BEM modifier, NIE inline style)
- Klasa kompletna: `class="tabs --fixed"`
- CSS rule `.tabs.--fixed { top: 95px }` aplikuje top

Moje §107e w v1.39 używało selectora:
```css
.tabs[style*="position: fixed"]  ← NIE matchował (system nie używa inline style)
```

Plus znalazłem w pliku **DWIE STARE REGUŁY** z §47 i §54 które ustawiały:
- Linia 3395: `html body .tabs.--fixed { top: 88px }`
- Linia 5197: `html body .tabs.--fixed { top: 95px }` ← wygrywa (later in file)

**Fix v1.40**:
1. **Linia 3397**: `top: 88px` → `top: 65px`
2. **Linia 5202**: `top: 95px` → `top: 65px`
3. **Dodano media query** dla mobile: `@media (max-width: 991.98px)` → `top: 56px`
4. **§107e**: USUNIĘTA (niepotrzebna po fix oryginalnych reguł)

**Live verified**:
```javascript
// Before v1.40: position:fixed, top: 95px (30px luka nad header 65px)
// After v1.40:  position:fixed, top: 65px ✓ (sklejone z header bottom)
```

---

## Root cause #3: Cennik bottom button to NIE jest .accommodation-reservation

**Live audit pokazał** że button w sekcji Cennik (na dole offer page) to **inny element**:

```html
<tr class="season-cell_main">
  <td>
    <div class="room_rez">
      <a>
        <span class="btn btn-reverse">ZAREZERWUJ TERAZ</span>  ← NIE accommodation-reservation
      </a>
    </div>
  </td>
</tr>
```

Klasa wewnętrzna to `.btn.btn-reverse` (NIE `.btn.button.accommodation-leftbutton`). Mój §107d nie matchował tego buttona.

System styling:
- `padding: 13px 28px`
- `bg: rgb(226, 215, 0)` (gold)
- `display: inline-block`
- Width 214, height 46

Klient widzi że tekst "nie równo na przycisku" — bo `<a>` rodzic ma natywne styling (text-align brakuje), `<span>` nie jest flex-center.

**Fix v1.40 §107g** — nowy selector targetujący ten konkretny pattern:
```css
html body.page-offer tr.season-cell_main .btn.btn-reverse,
html body.page-offer .price-list .btn.btn-reverse,
... {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 12px 28px !important;
  min-height: 46px !important;
  line-height: 1.2 !important;
  letter-spacing: 0.04em !important;
  border-radius: var(--fr-radius-pill) !important;
  background: var(--fr-primary) !important;
  /* ... + hover state */
}

/* Plus rodzic <a> i <td> alignment */
html body.page-offer tr.season-cell_main td {
  vertical-align: middle !important;
  padding: 12px 16px !important;
}
html body.page-offer tr.season-cell_main td .room_rez {
  display: flex !important;
  justify-content: center !important;
}
```

**Live verified**:
```javascript
// After v1.40: display inline-flex, padding 12x28, height 46, centered ✓
```

---

## Zmiany w pliku FR_ARKUSZ_STYLOW.css

| Linia | Co | Zmiana |
|---|---|---|
| 3397 | `top: 88px` (§47 sticky tabs) | → `top: 65px` |
| 5202 | `top: 95px` (§54 sticky tabs) | → `top: 65px` |
| 5226+ | nowy `@media (max-width: 991.98px)` | → `top: 56px` mobile |
| 11188-11216 | §100b `.col-lg-3 .btn` rule | **USUNIĘTE** (powodowało konflikt) |
| 12700+ | §107d wzmocnione | chained 3 classes + nowrap + font-size 13px + letter-spacing 0.04em |
| 12780+ | §107e | **USUNIĘTE** (nieprzydatne — niewłaściwy selector) |
| 12810+ | §107g (nowe) | cennik `.btn.btn-reverse` styling |

---

## Wgranie do panelu — checklista v1.40

1. ☐ Wgrać aktualne [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css)
2. ☐ Cmd+Shift+R w przeglądarce (force refresh, omija cache)
3. ☐ **Verify offer page** `/offer/10/...`:
   - Sidebar "ZAREZERWUJ TERAZ" — tekst w 1 linii ✓
   - Po scrollu sticky tabs — brak luki nad nimi ✓
   - Cennik bottom button — tekst centrowany, button pill shape ✓

---

## Dlaczego v1.39 nie naprawiło — uczy się na własnych błędach

| v1.39 zakładało | v1.40 wykryło |
|---|---|
| Mój nowy CSS §107d nadpisze stary | ❌ Stara §100b matchowała inner span przez `.col-lg-3 .btn` — TA SAMA specificity, source order = tie, jedna z dwóch |
| Sticky tabs używa inline style position:fixed | ❌ System Idosell używa klasy `--fixed` (BEM) |
| Cennik btn to `.accommodation-reservation` | ❌ Cennik btn to `.btn.btn-reverse` (inny element) |

**Lekcja**: **NIE zakładać struktury HTML** — zawsze sprawdzać DOM przez chrome-devtools przed pisaniem selectora.

---

## Status overall

| Bucket | v1.39 | v1.40 |
|---|---|---|
| Sidebar btn "ZAREZERWUJ TERAZ" tekst | ❌ wrap 2 linie | ✅ 1 linia 48px |
| Sticky tabs luka | ❌ 30px gap | ✅ sklejone top 65px |
| Cennik bottom btn alignment | ❌ pattern niematched | ✅ centered inline-flex |
| Featured price badge (§107a) | ✅ działa | ✅ |
| Outline "Zobacz wszystkie" (§107b) | ✅ działa | ✅ |
| Offer sidebar bg (§107c) | ✅ działa | ✅ |
| OG image (galeria klienta) | ✅ działa | ✅ |

---

## Co dalej

1. **Damian wgrywa** FR_ARKUSZ_STYLOW.css v1.40
2. **Live verify** wszystkich 3 fixów po refresh
3. **Pozostałe** akcje klienta panelu (title DE, menu EN/DE kolejność)
