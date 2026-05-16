# Instinct 060 — IdoBooking panel "Koniec body" hard limit ~60-65 KB

**Discovered**: 2026-05-16 (Fair Rentals v1.48 deploy crisis)
**Severity**: 🔴 CRITICAL — strona staje się BIAŁA przy przekroczeniu

## Problem

Panel IdoBooking → **Skrypty → Koniec body** ma niedokumentowany hard limit ~60-65 KB
na wkład tekstowy w polu. Większy plik jest **ucinany** w miejscu losowym (przeważnie
w środku funkcji), a system automatycznie dolacza systemowe HTML/JS na końcu pola.

Efekt:
- Nasz JS bez zamknięcia `})();` (IIFE close — ucięte)
- W to miejsce panel dodaje `<p>cookie disclaimer</p><script>var isOpera...</script>`
- Browser parser hits `<p>` w środku script context → **`SyntaxError: Unexpected token '<'`**
- Cały `boot()` przerwany → wszystkie nasze funkcje (teleportHero, initFeaturedOffers,
  initBlog, fixCanonicalToPage, etc.) NIE wykonują się
- Strona renderuje surowy DOM bez naszych ulepszeń = wygląda jakby "wszystko zniknęło"

## Diagnostyka

W konsoli klienta: `Unexpected token '<'` jako pierwszy error → 99% to ten problem.

MCP check:
```js
const ours = Array.from(document.querySelectorAll('script')).find(s =>
  !s.src && s.innerHTML.indexOf("PREFIX = 'fr-'") !== -1
);
// Sprawdź czy ma `})();` na końcu:
ours.innerHTML.indexOf('})();') === -1  // BUG — kod ucięty
```

## Rozwiązanie — MINIFY

Recipe (Python):
```python
import re
s = open('FR_KONIEC_BODY.html').read()
# 1. Usuń block comments
s = re.sub(r"/\*[\s\S]*?\*/", "", s)
# 2. Usuń line-start // comments (TYLKO te z początku linii — chroni regex)
s = re.sub(r"^[ \t]*//[^\n]*\n", "\n", s, flags=re.MULTILINE)
# 3. Collapse blank lines
s = re.sub(r"\n[ \t]*\n[ \t]*\n+", "\n\n", s)
# 4. Trim trailing whitespace
s = re.sub(r"[ \t]+\n", "\n", s)
# 5. Reduce 4-space indent to 2-space
s = re.sub(r"^(    )+", lambda m: "  " * (len(m.group(0)) // 4), s, flags=re.MULTILINE)
open('FR_KONIEC_BODY.min.html', 'w').write(s.rstrip() + '\n')
```

Oszczędność: **22-27%**. Przykład Fair Rentals: 65 KB → 48 KB ✅.

**ZAWSZE testuj syntax** po minify:
```bash
node --check extracted_script.js  # MUST pass
```

## Triggery — kiedy minify

- Plik FR_KONIEC_BODY.html (lub odpowiednik) > **50 KB**
- Klient zgłasza "biała strona" / "rzeczy zniknęły" po deploy
- Console error: `Unexpected token '<'` (lub `>`)

## Master pattern

```
1. Pisz JS z komentarzami /* */ i // (czytelność dla devs)
2. Save jako .html (oryginał — dla nas, dla code review)
3. Minify Python script → .min2.html (-25%)
4. Wgrywaj DO PANELU TYLKO .min2.html
5. Sprawdź końcówkę w panelu: ostatnia linia MUSI być </script>
```

## Related

- Lesson: `lessons/idobooking-panel-truncates-koniec-body.md`
- Instinct 028 (one shared JS file per page all languages)
- Instinct 014 (custom.css size discipline — panel CSS pole też ma limit ~300 KB)
