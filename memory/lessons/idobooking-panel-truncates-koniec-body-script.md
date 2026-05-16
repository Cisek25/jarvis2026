# Lesson — Panel IdoBooking ucina pole "Koniec body" przy ~65 KB → strona biała

**Data**: 2026-05-16
**Projekt**: Fair Rentals v1.48 deploy
**Severity**: 🚨 CRITICAL incident (klient: "wysadziła się strona główna, połowa rzeczy zniknęła")

## Co się stało

1. Klient wgrał FR_KONIEC_BODY.html (65 KB) do pola **Panel → Skrypty → Koniec body**
2. Panel zapisał — bez ostrzeżenia o limicie
3. Live: strona główna biała, większość sekcji zniknęła
4. Console: `SyntaxError: Unexpected token '<'` jako pierwszy error
5. Wszystkie nasze funkcje (teleportHero, initFeaturedOffers, sanitizeTelLinks etc.) NIE wykonują się

## Diagnoza (MCP browser_evaluate)

```js
const ours = Array.from(document.querySelectorAll('script')).find(s =>
  !s.src && s.innerHTML.indexOf("PREFIX = 'fr-'") !== -1
);
console.log({
  length: ours.innerHTML.length,                        // 78369 (z 65k naszego + ~13k systemowych)
  iifeClose: ours.innerHTML.indexOf('})();'),          // -1 ❌ BRAK zamknięcia IIFE
  endsWith: ours.innerHTML.slice(-200)                 // "...widgetUrl = 'https://...book-now';"
});
```

**Wnioski**:
- Plik klienta 65 KB, ale w stronie 78 KB (naszych+systemowych)
- Brak `})();` w naszym kodzie — ucięte przed nim
- Po naszym (ucięty) kodzie panel doklejił systemowy cookie disclaimer HTML + booking widget JS
- Browser parser hits `<p>...cookie...</p>` w środku script context → syntax error
- `boot()` NIE jest wywołany → wszystkie wcześniej zdefiniowane funkcje są w martwym IIFE scope

## Root cause

**Pole "Skrypty → Koniec body" w panelu IdoBooking ma niedokumentowany hard limit
~60-65 KB.** Większy wkład jest cichu ucinany, a system dolacza systemowe rzeczy
po nim w tym samym `<script>` blocku.

## Fix — MINIFY

Python script (`tools/minify-koniec-body.py`):
```python
import re, sys
src = sys.argv[1]
with open(src) as f: s = f.read()

# 1. Block comments /* ... */
s = re.sub(r"/\*[\s\S]*?\*/", "", s)
# 2. Line-start // comments (NIE w środku regex — bezpieczne)
s = re.sub(r"^[ \t]*//[^\n]*\n", "\n", s, flags=re.MULTILINE)
# 3. Collapse blank lines (max 2)
s = re.sub(r"\n[ \t]*\n[ \t]*\n+", "\n\n", s)
# 4. Trim trailing whitespace
s = re.sub(r"[ \t]+\n", "\n", s)
# 5. Reduce 4-space indent to 2-space
s = re.sub(r"^(    )+", lambda m: "  " * (len(m.group(0)) // 4), s, flags=re.MULTILINE)

dst = src.replace('.html', '.min2.html')
with open(dst, 'w') as f: f.write(s.rstrip() + '\n')
print(f"Minified {src} → {dst}: -{round((1-len(s)/len(open(src).read()))*100)}%")
```

**Oszczędność**: 22-27% (Fair Rentals: 65 KB → 48 KB).

**ZAWSZE testuj syntax po minify**:
```bash
python3 -c "
import re
with open('FR_KONIEC_BODY.min2.html') as f: html = f.read()
m = re.search(r'<script>([\s\S]*?)</script>', html)
open('/tmp/test.js', 'w').write(m.group(1))
" && node --check /tmp/test.js && echo "✅ OK" || echo "❌ FAIL"
```

## ⚠️ FAUL PIERWSZEGO PODEJŚCIA — regex bez ochrony URLs

Pierwsza wersja minify:
```python
s = re.sub(r"//[^\n]*", "", s)  # ❌ Usuwa // też z regex jak /\/news\/\d+/
```

To uszkodziło regex `location.pathname.match(/\/news\/\d+\/(.+)$/)` — usunęło `//` w środku
patternu → SyntaxError przy testowaniu.

**Fix**: tylko line-start `//` comments:
```python
s = re.sub(r"^[ \t]*//[^\n]*\n", "\n", s, flags=re.MULTILINE)
```

Linie z `//` w środku (URLs, regex) zostają nietknięte.

## Prewencja

1. **Workflow defaultowy**:
   - Pisz JS z komentarzami (czytelność)
   - Save jako `.html` (oryginał)
   - Minify Python → `.min2.html`
   - **WGRYWAJ DO PANELU TYLKO `.min2.html`**

2. **W instrukcji klienta** (RELEASE_NOTES) zawsze pisz:
   > Sprawdź końcówkę po wklejeniu w panelu — ostatnia linia MUSI być `</script>`.
   > Jeśli kończy się gdzie indziej, panel ucina — daj znać.

3. **Smoke test po deploy** (MCP):
   ```js
   document.querySelectorAll('script')
     .filter(s => !s.src && s.innerHTML.indexOf("PREFIX = 'fr-'") !== -1)[0]
     .innerHTML.indexOf('})();')  // must be > -1
   ```

## Related

- Instinct 060 (IdoBooking panel "Koniec body" 65 KB limit)
- Instinct 014 (custom.css size discipline)
- Instinct 028 (one shared JS file per page all languages)
