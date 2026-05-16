# Fair Rentals — Release v1.35 (Blog v2 — native panel fields)

**Data**: 2026-05-15 (sesja 4 — po wgraniu v1.34 + naprawie PL/EN mixup przez klienta)
**Stan przed**: v1.34 (blog v1 — custom body_top z `data-*` markerami)
**Stan po**: v1.35 (blog v2 — używa natywnych pól panelu IdoBooking, auto-detect URL)

---

## Dlaczego v2 — diagnoza problemu z v1

**Klient pokazał screenshot panelu IdoBooking** dla tworzonej strony "Blog". Standardowy formularz panelu ma 5 natywnych pól:
- **Tytuł** (proste pole tekstowe)
- **Skrót** (TinyMCE WYSIWYG)
- **Treść** (TinyMCE WYSIWYG z opcją "HTML" mode)
- **Meta Tytuł**
- **Meta Opis** (limit ~150 znaków)

W v1.34 zaprojektowałem custom body_top dla każdego posta (BLOG_POST_30X_PL__body_top.html) ze złożoną strukturą HTML + `data-blog-post="slug"` markerami. To wymagało:
- Klient wklejał całość do pola "Treść" w trybie HTML
- TinyMCE może czyścić niektóre `data-*` atrybuty
- Trudne dla klienta — wkleja zewnętrzny HTML zamiast pisać przez wizualny edytor

**Live audit (chrome-devtools MCP)** pokazał:
- `/pl/txt/300/blog` redirectuje na home → klient nie utworzył podstrony
- Klient zaczął tworzyć w panelu ale prawdopodobnie był confused architekturą

**Rozwiązanie v2**: Wykorzystać natywne pola panelu w pełni. Klient pisze posty jak zwykłe strony tekstowe. JS auto-detect URL pattern + wzbogaca stronę po renderze.

---

## v2 Architektura

### Posty blogu = naturalne strony tekstowe IdoBooking

Klient w panelu dla każdego posta wypełnia 5 natywnych pól:

| Pole panelu | Co wpisuje klient | Gdzie idzie |
|---|---|---|
| Tytuł | "10 atrakcji Wrocławia..." | `<h1 class="big-label">` (systemowo) |
| Skrót | 2 zdania excerpt | `<meta description>` + użyty w listach |
| Treść | Pełna treść artykułu | `<main.page > .container>` — TinyMCE WYSIWYG |
| Meta Tytuł | SEO title (60 znaków) | `<title>` |
| Meta Opis | SEO description (150 znaków) | `<meta name="description">` |

**Bez wklejania custom HTML.** Klient korzysta z wizualnego edytora TinyMCE — formatuje tekst, wstawia obrazki, dodaje linki, listy, blockquote.

### Strona-lista = jedna linijka HTML

Klient w panelu tworzy jedną podstronę (np. /pl/txt/300/blog):
- **Tytuł**: "Blog"
- **Skrót**: 1-2 zdania
- **Treść**: w trybie HTML wkleja **dokładnie jedną linię**: `<div class="fr-blog-list-mount"></div>`
- **Meta Tytuł / Meta Opis**: SEO

JS znajduje mount point i wyrenderuje całą listę.

### JS auto-detect (FR_KONIEC_BODY.html)

`initBlog()` v2:
1. **List mode**: szuka `.fr-blog-list-mount` w DOM (klasa zamiast `data-*` — kompatybilna z TinyMCE)
2. **Post mode**: auto-detect URL pattern `/(pl|en|de)/txt/(3\d\d)/...` → zna numer posta z URL
3. Znajduje post w `blog-manifest.json` po URL match
4. Wstrzykuje:
   - **Schema.org BlogPosting** JSON-LD (SEO)
   - **Meta bar** pod systemowym `<h1>` (kategoria · data · autor · czas czytania)
   - **Featured image** (jeśli klient nie ma obrazka w treści)
   - **Sekcja "Czytaj również"** na końcu (2-3 powiązane posty z tej samej kategorii)
   - Klasa `fr-is-blog-post` na `<body>` dla lepszej typografii post-page

### Manifest.json — rozszerzony

Dodane pola per język w v2:

```json
"listLabels": {
  "pl": { "kicker": "BAZA WIEDZY", "lead": "..." },
  "en": { "kicker": "KNOWLEDGE BASE", "lead": "..." },
  "de": { "kicker": "WISSENSBASIS", "lead": "..." }
},
"relatedLabels": {
  "pl": { "title": "Czytaj również" },
  "en": { "title": "Read also" },
  "de": { "title": "Lesen Sie auch" }
}
```

JS używa tych labelów do lokalizacji list-hero + related-section.

---

## Zmiany w plikach

### FR_ARKUSZ_STYLOW.css (+250 linii)

Nowe sekcje:
- **§105e** `.fr-blog-list-intro` (header nad gridem listy, dodawany przez JS do mount pointa)
- **§105f** `.fr-blog-post-meta` (meta bar pod h1: kategoria/data/autor/czas)
- **§105g** `.fr-blog-post-featured` (auto-injected featured image)
- **§105h** Post-page typography upgrade (`body.fr-is-blog-post` overrides)
- **§105i** `.fr-blog-related` (auto-injected related section po cms-content)
- **§105j** Mobile post-page adjustments

Stare sekcje §105a-d (list hero, cards, post hero, blog post body) — pozostają (używane na liście).

### FR_KONIEC_BODY.html

`initBlog()` całkowicie przepisana:
- Wykrywanie po klasie `.fr-blog-list-mount` (TinyMCE-safe)
- Auto-detect post URL pattern `/(pl|en|de)/txt/(3\d\d)/`
- Match z manifestem po URL containment (`indexOf('/txt/' + txtNum + '/')`)
- Wstrzykiwanie meta bar / featured img / related po renderze

`renderBlogList()` — wstawia cały UI listy do mount pointa (header z kicker+lead, filtry, grid).

`enhanceBlogPost()` — zamiast `data-blog-post` slug, używa numeru `/txt/3XX/`. Wzbogaca naturalną IdoBooking stronę.

Nowy helper `cardHtml()` — wspólny dla list cards + related cards.

### blog-manifest.json

- Dodane `listLabels` per język
- Dodane `relatedLabels` per język
- URL-e bez zmian (`/pl/txt/301/slug` format)

### BLOG_LIST_PL/EN/DE__body_top.html

**Uproszczone z 17 linii do 1**:
```html
<div class="fr-blog-list-mount"></div>
```

(plus komentarz dla klienta opisujący gdzie wklejać)

### BLOG_POST_301/302/303_PL__body_top.html

**Przeniesione do** `DO_WKLEJENIA/_BLOG_OUTLINES_REFERENCE/POST_30X_outline.html` — używane tylko jako reference structure dla Agnieszki (kopiuje teksty do panelu).

### INSTRUKCJA_BLOG_FAIRRENTALS.txt — całkowicie przepisana

Nowa instrukcja v2 zawiera:
- Wyjaśnienie zmian vs v1
- 8 kroków wdrożenia (CSS/JS, manifest, lista, menu, posty, manifest update, JS auto-features, weryfikacja)
- Routine dodawania nowych postów (Agnieszka 30-60 min + Damian 2 min update manifest)
- Troubleshooting (lista pusta, 404 na klik, brak meta bar, TinyMCE issues)

---

## Korzyści v2 vs v1

| Aspekt | v1 | v2 |
|---|---|---|
| Sposób pisania postów | Klient wkleja custom HTML do "Treść" | Klient pisze przez wizualny TinyMCE |
| Co klient widzi w panelu | 5 pól + duży HTML do wklejenia | 5 standardowych pól (jak każda strona) |
| Risk TinyMCE strip data-* | Tak (krytyczne) | Nie (klasy + URL pattern) |
| Sposób strukturyzowania | Sztywne placeholdery `<em>(...)</em>` | Naturalna struktura przez TinyMCE buttons |
| Obrazki w treści | Hardcoded w body_top | Klient dodaje przez ikonę obrazka w TinyMCE |
| SEO meta | Część w body_top | Wszystko w natywnych polach Meta Tytuł/Opis |
| Onboarding klienta | 60+ min (nauka custom HTML) | 15 min (klient już zna panel) |

---

## Wgranie do panelu — checklista v1.35

1. ☐ Wgrać zaktualizowany [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css) (zawiera §105e-j blog v2)
2. ☐ Wgrać zaktualizowany [FR_KONIEC_BODY.html](DO_WKLEJENIA/FR_KONIEC_BODY.html) (initBlog v2)
3. ☐ Wgrać zaktualizowany [blog-manifest.json](DO_WKLEJENIA/blog-manifest.json) (z listLabels + relatedLabels)
4. ☐ Stworzyć podstronę /pl/txt/300/blog (Tytuł="Blog", Treść=`<div class="fr-blog-list-mount"></div>` w HTML mode, Meta)
5. ☐ Powtórzyć dla /en + /de (zakładki "angielski" + "niemiecki")
6. ☐ Dodać "Blog" do menu PL/EN/DE → /lang/txt/300/blog
7. ☐ Agnieszka tworzy 3 pierwsze posty /pl/txt/301-303 (naturalnie przez TinyMCE — Tytuł/Skrót/Treść/Meta)
8. ☐ Damian aktualizuje blog-manifest.json z URL-ami nowych postów + re-uploaduje
9. ☐ Cmd+Shift+R i weryfikacja na live: `/pl/txt/300/blog` + dowolny post

---

## Live state po wgraniu v1.34 (audit chrome-devtools MCP)

✅ **PL/EN mixup naprawiony przez klienta**:
- `/pl` ma teraz `lang="pl"`, title PL, h1 PL, opis PL
- (Wcześniej curl pokazywał EN — klient zapisał poprawnie, cache się odświeżył)

✅ **JS workarounds z v1.34 działają**:
- Canonical przepisywany na bieżący URL
- target="blank" → target="_blank" (footer linki)
- `<html lang>` ustawiane z URL (fallback dla template bugu)

❌ **Blog niewdrożony** — klient nie utworzył podstrony /pl/txt/300 (sitemap.xml + curl test pokazują brak). To powód dlaczego "wpisy blogowe nie działają automatycznie" — bo nie ma stron w panelu, więc JS nie ma czego renderować.

❌ **noindex,nofollow** w `<meta name="robots">` — klient nadal nie odznaczył "Strona w wersji deweloperskiej" w panelu SEO.

---

## Status overall

| Bucket | Wersja | Status |
|---|---|---|
| PL/EN mixup | v1.34 | ✅ Klient naprawił |
| JS workarounds (canonical/target/lang) | v1.34 | ✅ Działają |
| Blog v1 (custom body_top) | v1.34 | ❌ Niewdrożony przez klienta (zbyt skomplikowane) |
| **Blog v2 (native panel fields)** | **v1.35** | ✅ Gotowy do wdrożenia |
| Pozostałe akcje klienta panelu | — | ❌ 8-14 nadal nieukończonych (noindex, title PL, etc.) |
| PD/SA tickets | v1.33 | 📝 Drafts gotowe, Damian wyśle |

---

## Co dalej (v1.36+)

1. **Klient wdraża v1.35 blog** (15 min: lista + 3 posty)
2. **Agnieszka uzupełnia treść** 3 postów przez TinyMCE (3-6h)
3. **Lighthouse re-run** po pełnym wdrożeniu (blog page powinien dawać 90+ Performance/SEO)
4. **Pozostałe akcje klienta**: noindex, OG image, menu EN/DE → traction SEO
5. **Wersje EN/DE postów**: tłumaczenie + dodanie do manifest

Pełna lista akcji + troubleshooting: [INSTRUKCJA_BLOG_FAIRRENTALS.txt](DO_WKLEJENIA/INSTRUKCJA_BLOG_FAIRRENTALS.txt).
