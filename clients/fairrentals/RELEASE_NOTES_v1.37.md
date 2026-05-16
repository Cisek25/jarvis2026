# Fair Rentals — Release v1.37 (Blog v4 — systemic /news scraper)

**Data**: 2026-05-15 (sesja 6 — zero-config blog wzorowany na Apartamenty Parkowe)
**Stan przed**: v1.36 (blog v3 inline manifest, wymagał update'u JS po każdym poście)
**Stan po**: v1.37 (auto-scrape systemowego `/news`, zero edycji kodu)

---

## Klucz: wzorzec Apartamenty Parkowe

Klient wskazał działający blog na **client58154 (Apartamenty Parkowe)** — `https://client58154.idobooking.com/txt/203/Blog`. Audit chrome-devtools pokazał że używają **natywnego modułu Aktualności IdoBooking**:

- **Klient pisze posty w**: Panel → Wygląd → **Aktualności**
- **System auto-generuje**: 
  - `/news/X/slug` — strony pojedynczych postów
  - `/news` — listing wszystkich aktualności (HTML z `.news-item` × N)
- **Brak custom HTML** — klient korzysta z natywnego edytora TinyMCE
- **Skala**: 3 posty u Apartamenty Parkowe wszystkie działają out-of-the-box

To **eliminuje wszystkie problemy v1.34-v1.36**:
- ❌ v1.34 wymagała custom body_top z `data-*` markerami
- ❌ v1.35 wymagała 1-linijki HTML w trybie HTML w TinyMCE
- ❌ v1.36 wymagała inline manifestu w JS — **Damian musiał edytować kod po każdym poście**
- ✅ **v1.37**: klient pisze w panelu jak natywną aktualność, **NIC więcej nie potrzeba**

---

## v1.37 Architektura

### Klient ma 2 ścieżki dostępu do blogu

**Ścieżka A — link "Blog" w menu → `/news`** (zalecana, najprostsza):
- Wyświetla systemową listę aktualności IdoBooking
- Stylizowana naszym CSS §105k — wygląda jak nasz brand Fair Rentals
- Schema.org markup systemowy
- Bezpośredni URL, krótkie i SEO-friendly

**Ścieżka B — link "Blog" w menu → `/txt/205/Blog`** (z hero):
- Klient otwiera podstronę tekstową /txt/205 którą już utworzył
- W polu "Treść" jest `<div class="fr-blog-list-mount"></div>` (lub kompatybilny v1.34 marker)
- JS pobiera `/news` (same-origin fetch), parsuje `.news-item`, renderuje karty fr-blog-card w naszym hero+grid
- Można dodać custom hero + intro w naszym stylu

### Pojedynczy post `/news/X/slug` — auto-enhanced

Gdy użytkownik wchodzi na `/news/X/...`:
- JS wykrywa `body.page-news` + URL pattern `/news/\d+/`
- Dodaje klasę `fr-is-blog-post` do body — typography upgrade z CSS §105h
- Wstrzykuje **Schema.org BlogPosting** JSON-LD (z tytułu, opisu, daty, obrazu, autora=Agnieszka)
- Dodaje "← Wróć do listy" link na końcu treści
- Reszta stylowana przez CSS §105k (h1, data, treść, blockquote, links)

---

## Zmiany w plikach

### FR_KONIEC_BODY.html

**Usunięte** (~300 linii):
- `var FR_BLOG_MANIFEST = {...}` — manifest inline z v1.36
- `cardHtml(p, manifest, lang, headingTag)` — helper renderowania z manifestu
- Cała logika matching post URLs vs manifest.posts[]

**Nowe**:
- `var FR_BLOG_CONFIG` — minimalna konfiguracja (labelki PL/EN/DE, brand info)
- `renderBlogList(mount, lang)` — fetch `/news`, parse `.news-item` × N, build fr-blog-card grid
- `enhanceNewsPost(lang)` — dla URL `/news/X/...`: Schema.org JSON-LD + body class + back link

**Zachowane** (helpers):
- `escHtml`, `escAttr`, `fmtDate`

### FR_ARKUSZ_STYLOW.css

**Dodane** (§105k):
- `body.page-news .news-wrapper.row` → grid 2 kolumny
- `body.page-news .news-item` → karta z hover effect, rounded, shadow
- `body.page-news .news-date/.news-content/.more-news` → typography fair-rentals
- `body.page-news main.page .container article` → single news post layout
- `body.page-news main.page .container article h1.big-label` → display heading
- `.fr-blog-back-to-list` → pill button "← Wróć do listy"

CSS overrides systemowych klas Bootstrap (`.col-md-6`, `.col-12`) żeby grid działał poprawnie.

### INSTRUKCJA_BLOG_FAIRRENTALS.txt — całkowicie przepisana

Sekcje:
1. Jak to działa (3 zdania)
2. Krok 1: włączyć moduł Aktualności w panelu IdoBooking
3. Krok 2: dodać pierwszą aktualność (panel field-by-field)
4. Krok 3: strona listy `/txt/205/Blog` (już utworzona, JS już skonfigurowany)
5. Krok 4: menu — link do `/news` (Opcja A) lub `/txt/205/Blog` (Opcja B)
6. Krok 5: weryfikacja
7. Routine dodawania nowych — **bez udziału Damiana**
8. Troubleshooting
9. SEO tips

---

## Workflow dla klienta (Agnieszka)

**Dodanie nowego posta** (~50 min):
1. Pisze treść w Word/Google Docs (40 min)
2. Wchodzi w Panel → Wygląd → Aktualności → "Dodaj nową" (1 min)
3. Wypełnia: Tytuł, Skrót, Treść (TinyMCE — wkleja z Word), Zdjęcie (5 min)
4. Zapisz (1 min)
5. Refresh `/news` lub `/txt/205/Blog` — **post jest widoczny**

**Brak udziału Damiana**. Brak edycji kodu. Brak update manifestów.

---

## Live verified na Apartamenty Parkowe (chrome-devtools MCP)

Test scrapera na `/news` Apartamenty Parkowe:

```javascript
{
  itemsFound: 3,
  cards: [
    {
      href: "/news/1/Gniezno-na-weekend-co-zobaczyc-w-2-dni",
      imgSrc: "https://images.pexels.com/...",
      date: "2026-04-21",
      title: "Gniezno na weekend — co zobaczyć w 2 dni",
      excerpt: "..." (extracted from .news-content)
    },
    { href: "/news/2/...", ... },
    { href: "/news/3/...", ... }
  ]
}
```

Selectors działają na rzeczywistym systemowym `/news` markupie IdoBooking. Patch: jeśli excerpt < 10 znaków alfanumerycznych (np. tylko `?`), nie renderujemy.

---

## Wymagania klienta

### Krytyczne (BLOCKER):
- ☐ **Włączenie modułu Aktualności w panelu IdoBooking** (Wygląd → ...)
- Test: `https://client58360.idobooking.com/news` powinno zwrócić 200 z listą (nie 302 redirect na home)

### Po włączeniu modułu:
- ☐ Wgrać aktualne [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css) (zawiera §105k)
- ☐ Wgrać aktualne [FR_KONIEC_BODY.html](DO_WKLEJENIA/FR_KONIEC_BODY.html) (zawiera v4 scraper)
- ☐ Dodać "Blog" do menu PL/EN/DE → link do `/news`
- ☐ (Opcjonalnie) Strona `/txt/205/Blog` — body_top może zostać (backward compat)
- ☐ Agnieszka dodaje pierwszą aktualność w panelu

---

## Status overall

| Bucket | Wersja | Status |
|---|---|---|
| Wzorzec źródłowy (Apartamenty Parkowe) | — | ✅ Działa na live, mechanizm zweryfikowany |
| Auto-scraper JS systemowego /news | v1.37 | ✅ Logika zweryfikowana na realnych danych |
| CSS dla systemowych /news + /news/X | v1.37 | ✅ §105k dodany |
| FR_BLOG_MANIFEST inline (v1.36) | — | ❌ Usunięty (niepotrzebny) |
| INSTRUKCJA | v1.37 | ✅ Przepisana, zero edycji kodu |
| **Włączenie modułu Aktualności (klient)** | — | ⏳ Wymaga akcji w panelu IdoBooking |
| Pozostałe akcje klienta panelu | — | ❌ 8 nadal nieukończonych (głównie SEO) |

---

## Korzyści v1.37 vs poprzednie

| Aspekt | v1.34-v1.36 | **v1.37** |
|---|---|---|
| Edycja kodu po nowym poście | TAK | **NIE** |
| Custom HTML w panelu | TAK (body_top) | **NIE** (klient pisze w "Aktualności") |
| URL postu | /pl/txt/30X/slug | **/news/X/slug** (krócej, SEO) |
| Mechanizm listy | Manualny manifest | **Auto-scrape /news** |
| Onboarding klienta | 15-60 min | **5 min** (klient już zna panel) |
| Skalowanie do 50+ postów | Trudne | **Łatwe** (panel ma listing) |
| Risk TinyMCE strip data-* | Tak | **Brak** (zero custom HTML) |

---

## Co dalej (v1.38+)

1. **Klient włącza moduł Aktualności w panelu** (jeśli niezalogowany — Damian asystuje)
2. **Damian wgrywa CSS + JS** (zaktualizowane FR_ARKUSZ_STYLOW.css + FR_KONIEC_BODY.html)
3. **Damian aktualizuje menu** Blog → /news
4. **Agnieszka dodaje pierwszą aktualność**
5. **Verify na live** przez chrome-devtools
6. **Lighthouse re-run** na `/news` + `/news/X/slug`

Pozostałe 8 akcji panelu klienta (noindex, title PL/DE, menu EN/DE, OG image) — nadal czeka na klienta.
