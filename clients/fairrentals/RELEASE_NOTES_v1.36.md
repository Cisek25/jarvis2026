# Fair Rentals — Release v1.36 (Blog v3 — inline manifest)

**Data**: 2026-05-15 (sesja 5 — naprawa blogu po feedback klienta)
**Stan przed**: v1.35 (blog v2 native panel fields, fetch external manifest.json)
**Stan po**: v1.36 (manifest inline w JS, flexible URL matching, backward compat z v1.34)

---

## Trzy zmiany kluczowe

### 1. Manifest INLINE w FR_KONIEC_BODY (nie osobny plik)

**Problem v1.34/v1.35**: JS robił `fetch('/customStyles/default13/custom2/blog-manifest.json')`. Klient nigdy nie wgrał manifestu (lub nie udało się — IdoBooking panel nie pozwala upload custom JSON). Wszystkie 4 testowane URL-e dawały 404.

**Rozwiązanie v1.36**: Manifest jako JS object `var FR_BLOG_MANIFEST = {...}` zdefiniowany inline w FR_KONIEC_BODY.html.

**Korzyści**:
- Klient wgrywa 1 plik (FR_KONIEC_BODY) zamiast 2
- Brak fetch — brak 404, brak CORS, brak latency
- Renderowanie synchroniczne (szybsze)
- Update manifestu = edycja JS sekcji + re-upload FR_KONIEC_BODY

**Trade-off**: Damian edytuje JS po każdym nowym poście (15-30 sek pracy). Akceptowalne dla 1-2 postów miesięcznie.

### 2. Flexible URL matching (nie tylko /3XX/)

**Problem**: v1.35 JS używał sztywnego regex `/^\/(pl|en|de)?\/?txt\/(3\d\d)/` — łapał TYLKO numery /300-399/. Klient utworzył listę pod **/txt/205/Blog** — nasz JS by tego nie rozpoznał gdyby to było post.

**Rozwiązanie v1.36**: Auto-detect przez **match `location.pathname` vs `manifest.posts[].url`** — działa dla dowolnego numeru.

Dodatkowo: **normalizacja URL** strip-uje `/pl/`, `/en/`, `/de/` prefix przed porównaniem — działa zarówno gdy klient otwiera `/pl/txt/X/...` (z prefix) jak i `/txt/X/...` (bez prefix, default lang).

Przetestowane na żywo (chrome-devtools), wszystkie test cases passing:

| URL otwarty | Wykrycie |
|---|---|
| `/txt/206/10-atrakcji-wroclawia` | ✓ match PL |
| `/pl/txt/206/10-atrakcji-wroclawia` | ✓ match PL |
| `/pl/txt/206/10-atrakcji-wroclawia/` | ✓ match PL (trailing slash) |
| `/en/txt/206/10-attractions` | ✓ match EN |
| `/txt/205/Blog` | ✗ no post match (poprawnie — to lista) |
| `/txt/999/random` | ✗ no match (nie ma w manifescie) |

### 3. Backward compat z v1.34

JS szuka **OBA** markery dla strony listy:
- `.fr-blog-list-mount` (v1.35+ — 1 linijka mount point)
- `[data-blog-list]` (v1.34 — pełna struktura body_top)

Co to oznacza: **klient nie musi zmieniać tego co już wkleił**. Jeśli ma v1.34 body_top wgrane w panelu (z `<section data-blog-list>...`), v1.36 JS to wykryje i wyrenderuje karty.

Potwierdzone live na `/pl/txt/205/Blog`:
```
listMountFound: true
listMountSelector: [data-blog-list] (v1.34 compat)
wouldRender: YES - blog mode active
```

---

## Dlaczego blog v1.34/v1.35 nie działał — pełna diagnoza

Z chrome-devtools auditu `/pl/txt/205/Blog`:

```javascript
{
  url: "https://client58360.idobooking.com/txt/205/Blog",
  pathname: "/txt/205/Blog",         // bez /pl/ prefix
  title: "Blog Fair Rentals — Wrocław i podróże",
  lang: "pl",                         // klient naprawił PL/EN mixup ✓
  h1: "Wrocław, podróże i porady dla Gości",
  dataBlogList: true,                 // v1.34 body_top wgrane ✓
  dataBlogGrid: true,
  frBlogListMount: false,             // v1.35 mount NIE wgrany
  frBlogGrid: true,                   // struktura z v1.34
  frBlogEmpty: "Ładowanie wpisów..."  // placeholder — manifest nie załadowany
}
```

**4 testowane URL-e manifestu wszystkie 404**:
- `/customStyles/default13/custom2/blog-manifest.json` → 404
- `/blog-manifest.json` → 404
- `/customStyles/blog-manifest.json` → 404
- `/images/owner/blog-manifest.json` → 404
- `/customStyles/default13/blog-manifest.json` → 404

**Wniosek**: IdoBooking nie pozwala upload `.json` przez panel — stąd 404 wszędzie. Inline w JS to rozwiązanie ostateczne.

---

## Zmiany w plikach

### FR_KONIEC_BODY.html
- Nowa sekcja: `var FR_BLOG_MANIFEST = {...}` (60 linii — inline manifest z labelami PL/EN/DE)
- `initBlog()` — przepisana:
  - Synchroniczne renderowanie (brak fetch)
  - Backward compat `.fr-blog-list-mount` OR `[data-blog-list]`
  - Flexible URL matching przez normalizację
- `enhanceBlogPost(post, manifest, lang)` — podpis zmieniony, przyjmuje `post` zamiast `txtNum`

### INSTRUKCJA_BLOG_FAIRRENTALS.txt — przepisana pod v3
- Numer strony /txt/205 (nie 300)
- 6 kroków: wgranie CSS+JS, opis pól strony LISTY, menu, posty, update manifestu w JS, weryfikacja
- Sekcja "Dlaczego manifest inline" — wytłumaczenie
- Troubleshooting z konkretnymi DevTools commands (`typeof FR_BLOG_MANIFEST`, `FR_BLOG_MANIFEST.posts.length`, etc.)

### Przeniesione do `_BLOG_OUTLINES_REFERENCE/`
- `blog-manifest.json` → `_BLOG_OUTLINES_REFERENCE/blog-manifest.example.json` (już niepotrzebny jako external file, zostaje jako reference dla struktury)

---

## Wgranie do panelu — checklista v1.36

1. ☐ Wgrać zaktualizowany [FR_KONIEC_BODY.html](DO_WKLEJENIA/FR_KONIEC_BODY.html) → Konfiguracja → Kod JavaScript → koniec body
2. ☐ NIE trzeba ruszać body_top w panelu /txt/205/Blog — JS backward-compatible z v1.34
3. ☐ Cmd+Shift+R w przeglądarce — sprawdź `/pl/txt/205/Blog`
4. ☐ DevTools Console → `typeof FR_BLOG_MANIFEST` → powinno być `'object'`
5. ☐ DevTools Console → `FR_BLOG_MANIFEST.posts.length` → 0 (jeszcze brak postów w manifeście)

**Stan początkowy**: lista pokaże "Brak wpisów w tej kategorii" lub komunikat o ładowaniu — to OK. Pojawi się gdy:
- Agnieszka utworzy pierwszy post w panelu (np. /txt/206)
- Damian doda wpis do `FR_BLOG_MANIFEST.posts[]` w FR_KONIEC_BODY i wgra ponownie

---

## Workflow dodawania nowego posta (po wdrożeniu v1.36)

### Agnieszka (~70 min)
1. Pisze treść artykułu (50 min)
2. Wgrywa zdjęcie featured do Galerii w panelu (5 min)
3. Tworzy stronę /txt/X w panelu (10 min) — wypełnia 5 pól: Tytuł, Skrót, Treść (TinyMCE), Meta Tytuł, Meta Opis (150 znaków)
4. Mailuje Damianowi 4 info: URL strony + URL zdjęcia + kategoria + czas czytania (2 min)

### Damian (~5 min)
1. Otwiera FR_KONIEC_BODY.html
2. Znajduje `var FR_BLOG_MANIFEST = {...}`
3. Dodaje wpis w `posts: [...]`:
```js
{
  slug: 'praga-wroclawska-przewodnik',
  lang: 'pl',
  title: 'Tytuł posta',
  excerpt: 'Skrót...',
  category: 'dla-gosci',
  publishedAt: '2026-06-10',
  author: 'Agnieszka Baranska',
  featuredImage: 'https://client58360.idobooking.com/images/...',
  readTime: '6 min',
  url: '/pl/txt/210/praga-wroclawska-przewodnik',
  published: true
}
```
4. Wgrywa FR_KONIEC_BODY do panelu
5. Cmd+Shift+R weryfikacja na live

---

## Status overall

| Bucket | Wersja | Status |
|---|---|---|
| PL/EN mixup | v1.34 | ✅ Klient naprawił |
| Klient utworzył podstronę 205 dla listy | v1.36 | ✅ Wykryte na żywo |
| Klient wgrał v1.34 body_top | v1.34 | ✅ Backward compat działa w v1.36 |
| **Manifest inline JS** | **v1.36** | ✅ Gotowy, zweryfikowany logicznie |
| Klient wgrywa v1.36 JS | — | ⏳ Damian → wgranie FR_KONIEC_BODY |
| Agnieszka tworzy pierwszy post | — | 📋 Po wgraniu JS przez Damiana |
| **Pozostałe akcje klienta panelu** | — | ❌ 8 nadal nieukończonych (noindex, title, menu, OG) |

---

## Co dalej

1. **Damian wgrywa v1.36 FR_KONIEC_BODY** (5 min)
2. **Live verify** — lista powinna pokazać "Brak wpisów" (manifest pusty) lub "Ładowanie..." → "Brak"
3. **Agnieszka tworzy pierwszy post** w panelu (Tytuł/Skrót/Treść/Meta) — naturalnie, bez wklejania HTML
4. **Damian dodaje wpis do FR_BLOG_MANIFEST.posts[]** + re-upload JS
5. **Pierwszy post pojawia się** na liście blogu

Po 3-6 postach: ocena czy blog generuje traffic. Jeśli >15 postów → migracja do WordPress (Opcja B).
