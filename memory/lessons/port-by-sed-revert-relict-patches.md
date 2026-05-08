# Port-by-sed: zawsze REVERT relikt patches z innego klienta

## Sytuacja (Fair Rentals v1.24 → v1.25)

Damian poprosił dodać language toggler (PL/EN/DE) — feature dla FR z 3 językami.

**v1.24** dodałem CSS §90 z brand styling dla `.page-top__language` button + dropdown. Wszystko wyglądało OK w pliku.

Damian wkleił, hard refresh — **"nie widzę wyboru wersji językowych"**.

## Diagnoza (playwright)

```javascript
const btn = document.querySelector('.language__toggler');
console.log({
  display: getComputedStyle(btn).display,
  inlineStyle: btn.getAttribute('style')
});
// { display: "none", inlineStyle: null }
```

CSS `display: none` mimo mojego v1.24 `display: inline-flex !important` (specyficzność 0,4,3 = 43).

## Source — relikt z portu

W CSS na line 196-213 znaleziono:

```css
/* PATCH v1.6.4: Hide language toggler everywhere — site is PL-only */
html body .language__toggler,
html body .language__toggler.language__toggler,
html body header.default13 .language__toggler,
html body header.default13 .language__toggler.language__toggler,
html body.page-index header.default13:not(.fr-header--scrolled) .language__toggler {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  ...
}
```

Komentarz mówi `"site is PL-only"` — to wymóg **Solidne Apartamenty**. FR ma 3 języki — patch nie powinien być portowany.

Specyficzność `.language__toggler.language__toggler` = (0,2,0) = 20. Hmm — niższa niż mój v1.24 (0,4,3 = 43). Powinno wygrać.

ALE W CSS, mój §90 v1.24 jest **dopisany NA KOŃCU** pliku (line 5800+). Patch v1.6.4 jest **wcześniej** (line 196-213). Cascade order = później wygrywa **przy tej samej specyficzności**, ALE specyficzność wygra zawsze.

Wait — sprawdziłem ponownie. Mój v1.24 w §90:
```css
html body header.default13 .page-top__language .language__toggler { display: inline-flex !important }
```

Specyficzność: `html`(1) + `body`(1) + `header.default13`(11) + `.page-top__language`(10) + `.language__toggler`(10) = 33. Plus `!important`.

Patch v1.6.4: `html body .language__toggler.language__toggler` = 1+1+10+10 = 22. Plus `!important`.

**Mój 33 > ich 22**, mój wygrywa. Ale **rect w: 0, h: 0** — element NIE pokazuje się.

Sprawdziłem playwright `getMatchedCSSRules` — okazało się że v1.6.4 patch ma jeszcze:
- `width: 0 !important`
- `height: 0 !important`

Mój §90 ma tylko `display: inline-flex !important` ale NIE override width/height. Więc display zadziałał (block) ALE element ma 0×0.

## Fix v1.25

**Lepsza droga niż override**: po prostu **usunąć** patch v1.6.4 z portowanego CSS.

```css
/* v1.25 — PATCH v1.6.4 USUNIĘTY (relikt SA port): hide .language__toggler.
   FR ma 3 języki PL/EN/DE — system widget w v1.24 §90 odkryty + ostylowany. */
```

Plus dodano JS `forceShowLanguageToggler()` w body_bottom (defense in depth) z `setProperty('display', 'inline-flex', 'important')` — inline + !important = highest specificity.

## Lekcja

**Po port-by-sed z innego klienta, zawsze:**
1. `grep -nE "PATCH v[0-9]" CSS.css` — znajdź wszystkie patch markers
2. Per patch: read komentarz, zweryfikuj czy mówi o "client-specific" (np. "site is PL-only", "no sauna in this client", "client name X")
3. Jeśli client-specific i nie pasuje do nowego klienta → **REVERT** (delete blok)
4. Jeśli system-fix (uniwersalny) → **zachowaj**

## Dlaczego override nie wystarczyło

Patch v1.6.4 miał **6 properties** (display, visibility, width, height, opacity, padding):
```css
display: none !important;
visibility: hidden !important;
width: 0 !important;
height: 0 !important;
margin: 0 !important;
padding: 0 !important;
```

Mój v1.24 §90 override miał tylko 2-3 (display, visibility). Width/height zostały 0 → element niewidoczny mimo display: block.

**Lekcja typu CSS**: gdy element jest ukryty multiple ways (`display + visibility + width + height + opacity + clip + position`), override musi pokryć **WSZYSTKIE** te properties. Częściej safer to **usunąć** ukrywający blok niż próbować przepisać 11 override'ów.

## Anti-pattern (do uniknięcia w przyszłości)

❌ **Nie**: Dodać `width: auto !important; height: auto !important; min-width: 64px !important; min-height: 32px !important; opacity: 1 !important; clip: auto !important; ...` na element po porcie który ma stary patch hide.

✅ **Tak**: Usunąć stary patch hide block (delete linijki) + dodać nowy clean styling.

## Powiązane

- instinct 048-MASTER-port-by-sed-revert-client-specific-patches
- instinct 026 (port-by-sed master)

## Date
2026-05-08 — Fair Rentals v1.24 → v1.25 debug cycle
