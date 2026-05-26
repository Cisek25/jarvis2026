---
name: Orphan CSS rules audit — sekcje "USUNIETE w komentarzu" ale code zostaje
description: Gdy oznaczasz sekcję jako USUNIETE w komentarzu CSS, FAKTYCZNY CSS code rośnie z czasem i orphan rules zostają w innych miejscach pliku. Periodically grep całe pliku za conflicting rules.
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
# Problem

W trakcie iteracji nad CSS często komentuję starsze sekcje jako "USUNIETE":

```css
/* ─── §99g v1.51 — USUNIETE v1.54 (klient: flagi inline zamiast dropdown) ───
   Stary block dropdown styling — przeniesiony do §90 v2.
   Konflikt z nowym podejsciem (inline flags) — caly block wycieto. */
```

ALE — to tylko KOMENTARZ. Stary code może być nadal aktywny gdzie indziej w pliku (orphan rules pozostałe z innych sekcji).

Fair Rentals v1.60: mobile widget języka miał `min-width: 160px` zamiast 104px (3 flagi). Spent investigating orphan rule line 11490 z dropdown era:

```css
/* Dropdown container — pionowo, ze stałą szerokością */
html body .page-top__language .flags,
html body .page-top__language_menu .flags,
html body header .language_menu {
  display: flex !important;
  flex-direction: column !important;  /* DROPDOWN style */
  min-width: 160px !important;        /* PROBLEM */
  padding: 6px !important;
  ...
}
```

To rule było z §99g+ ery (dropdown), ale code nadal w pliku — narzucało column flex direction + min-width 160px na nowy mobile inline design.

# Detection

Po każdej dużej zmianie w CSS section — grep CAŁEGO pliku za conflicting rules:

```bash
# Sprawdź wszystkie wystąpienia kluczowych właściwości na danym selektorze
grep -n "\.flags\b" FR_ARKUSZ_STYLOW.css | head -30
grep -n "min-width: 160" FR_ARKUSZ_STYLOW.css
grep -n "flex-direction" FR_ARKUSZ_STYLOW.css | head -20
```

Sprawdź TEŻ live computed style w MCP chrome-devtools:

```js
// Iterate przez wszystkie matched rules dla elementu
const matches = [];
for (const sheet of Array.from(document.styleSheets)) {
  try {
    for (const rule of Array.from(sheet.cssRules || [])) {
      if (!rule.selectorText) continue;
      try {
        if (element.matches(rule.selectorText) && rule.style?.minWidth) {
          matches.push({
            selector: rule.selectorText,
            minWidth: rule.style.minWidth,
            important: rule.cssText.includes('!important')
          });
        }
      } catch(e) {}
    }
  } catch(e) {}
}
```

To pokaże WSZYSTKIE rules wpływające na property (nie tylko zwycięską) — łatwo znajdziesz orphan.

# Fix pattern

Kiedy znajdziesz orphan rule:

1. **Nie zostawiaj kodu** — usuń lub zastąp komentarzem
2. **Update §section markings** — dodaj note że kod usunięty z §X jest też USUNIETY in other places

```css
/* USUNIETE v1.60 — stara dropdown rule z fixed min-width 160px konfliktowala
   z mobile inline flags (3 flagi tylko ~104px). Patrz §90 v3/v4 dla nowego stylu. */
```

# Periodic full-file audit

Co kilka większych refactorów, robić full-file audit:

1. Wyciągnij wszystkie unique selectors:
   ```bash
   grep -oE "^\s*html body[^,{]+" FR_ARKUSZ_STYLOW.css | sort -u
   ```

2. Sprawdź czy są DUPLIKATY selektorów w różnych sekcjach (potencjalny konflikt)

3. Dla każdej "USUNIETE" sekcji w komentarzu — grep czy są inne rules dla TYCH SAMYCH selektorów

# Lesson

CSS code TIME-BASED ROT — co kilka projektów refactoring, ale orphan rules zostają. Periodic audit pozwala unikać "dziwnych" bugów typu "ustawiam X ale Y nie reaguje" — często to orphan rule wygrywa specificity.

# Reference: Fair Rentals v1.60

Orphan rule line 11490 `.flags { min-width: 160px; flex-direction: column }` z dropdown era (§99g+). Zostało stamtąd że §90 v3 (compact dropdown) i §90 v4 (mobile inline) były tworzone PO §99g+, ale §99g+ nie został usunięty fizycznie — tylko skomentowany jako "USUNIETE" bez zaznaczania że ta konkretna `.flags` rule była w innym miejscu pliku (line 11490).
