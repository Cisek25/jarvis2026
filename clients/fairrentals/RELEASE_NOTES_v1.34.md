# Fair Rentals — Release v1.34 (Blog + JS workarounds)

**Data**: 2026-05-15 (sesja 2, po klientowskim wgraniu v1.33)
**Stan przed**: v1.33 (perf attrs + hreflang DE)
**Stan po**: v1.34 (blog module + JS workarounds dla template bugów + critical alert PL/EN mixup)

---

## Zakres prac (3 obszary równolegle)

### 1. CRITICAL: PL/EN mixup wykryty + alert dla klienta

Po wgraniu v1.33 przez klienta, audit live (curl) pokazał, że klient wgrał **pliki EN do polskiej zakładki panelu IdoBooking**:
- `FR_HEAD_EN.html` wgrane jako HEAD dla `/pl`
- `GLOWNA_EN__cms.html` wgrane jako CMS strony głównej PL

W efekcie polska wersja strony pokazuje treści po angielsku:
- `<html lang="en">` zamiast `lang="pl"`
- Title: "Fair Rentals Wrocław — short-term apartment rentals in Poland"
- Cytat Karoliny: "We rarely say 'it can't be done'..." (zamiast "Bardzo rzadko mówimy 'nie da się'...")
- Description: "Family-run company. 21 short-term apartments..." (zamiast "Rodzinna firma. 21 apartamentów...")

**EN i DE** wgrane poprawnie. Tylko PL ma swap.

Dokument: [CRITICAL_ALERT_2026-05-15_PL_EN_MIXUP.md](CRITICAL_ALERT_2026-05-15_PL_EN_MIXUP.md) — krok po kroku jak Agnieszka ma naprawić w panelu.

---

### 2. JS workarounds w FR_KONIEC_BODY (3 nowe funkcje)

Aby częściowo niwelować bugi template default13 zanim PD/SA je naprawi:

#### `fixCanonicalToPage()`
Po renderze JS nadpisuje `<link rel="canonical">` na bieżący URL (zamiast homepage z template). Fix workaround dla PD/SA Ticket 1.

Dodatkowo aktualizuje `og:url` żeby spójne z canonical.

#### `fixTargetBlankTypo()`
Skanuje DOM po `a[target="blank"]` (literówka template) i zamienia na `target="_blank"` + dodaje `rel="noopener noreferrer"` (security). Fix workaround dla PD/SA Ticket 2.

#### `fixHtmlLangFromUrl()`
Wykrywa język z URL path (`/pl/`, `/en/`, `/de/`) i ustawia `<html lang>`. Workaround dla PD/SA Ticket 4 + bezpieczeństwo na wypadek client mixupu (np. obecny PL/EN swap).

Wszystkie 3 funkcje są wywoływane w `boot()`. Plik: [FR_KONIEC_BODY.html](DO_WKLEJENIA/FR_KONIEC_BODY.html).

---

### 3. Blog module (Opcja A) — IdoBooking subpages + JS manifest

Zgodnie z [SPRINT_D_BLOG_DECISION.md](SPRINT_D_BLOG_DECISION.md), wdrażamy Opcję A (Hybrid start). Blog wpada do osobnej podstrony `/pl/txt/300/blog` — **NIE pojawia się na stronie głównej**.

#### Co utworzono w JARVIS library (do reuse w przyszłości):

```
library/templates/blog/
├── blog-styles.css              (parametryzowane {PREFIX})
├── blog-reader.js               (JS module)
├── blog-list__body_top.html
├── blog-post__body_top.html
├── blog-manifest.example.json
└── INSTRUKCJA_BLOG.md           (8-krokowy deployment guide)
```

#### Co utworzono dla Fair Rentals:

**Kod**:
- §105 w [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css) — wszystkie style blog (lista hero, filtry, karty, post hero, featured img, post body, CTA box, related posts, mobile)
- `initBlog()` + `renderBlogList()` + `enhanceBlogPost()` w [FR_KONIEC_BODY.html](DO_WKLEJENIA/FR_KONIEC_BODY.html) (~200 linii JS)

**Pliki body_top do panelu**:
- [BLOG_LIST_PL__body_top.html](DO_WKLEJENIA/BLOG_LIST_PL__body_top.html)
- [BLOG_LIST_EN__body_top.html](DO_WKLEJENIA/BLOG_LIST_EN__body_top.html)
- [BLOG_LIST_DE__body_top.html](DO_WKLEJENIA/BLOG_LIST_DE__body_top.html)
- [BLOG_POST_301_PL__body_top.html](DO_WKLEJENIA/BLOG_POST_301_PL__body_top.html) — "10 atrakcji Wrocławia"
- [BLOG_POST_302_PL__body_top.html](DO_WKLEJENIA/BLOG_POST_302_PL__body_top.html) — "Ile zarabia właściciel"
- [BLOG_POST_303_PL__body_top.html](DO_WKLEJENIA/BLOG_POST_303_PL__body_top.html) — "Najem korporacyjny"

**Manifest centralny**:
- [blog-manifest.json](DO_WKLEJENIA/blog-manifest.json) — 3 pilotowe wpisy (każdy w innej kategorii: Dla Gości / Dla Właścicieli / Dla Firm)

**Instrukcja wdrożenia**:
- [INSTRUKCJA_BLOG_FAIRRENTALS.txt](DO_WKLEJENIA/INSTRUKCJA_BLOG_FAIRRENTALS.txt) — 9 kroków: wgranie CSS/JS, manifest, podstrona 300, menu, 3 posty, weryfikacja, routine dodawania nowych

#### Architektura
- Lista artykułów: `/pl/txt/300/blog` (osobna podstrona w panelu, NIE na home)
- Każdy post: `/pl/txt/30X/slug` (osobna podstrona)
- Manifest JSON: jeden plik centralny pobierany przez JS, hostowany pod `/customStyles/default13/custom2/blog-manifest.json`
- Filtry per kategoria — wstrzykiwane przez JS na podstawie manifestu
- Schema.org BlogPosting — wstrzykiwane przez JS dla każdego posta
- Related posts (same kategoria) — automatycznie 3 ostatnie

#### Outline'y postów

Trzy posty mają **strukturę gotową** (H1, H2, kategoria, meta, featured img, CTA, related) z **placeholderami treści `<em>(...)</em>`**. Agnieszka uzupełnia placeholdery własną treścią — szacowany czas: 1-2h per post (3-6h razem).

---

## Co weryfikowane live (curl)

| Element | Stan | Akcja |
|---|---|---|
| hreflang DE w HEAD PL/EN | ✓ wgrane | OK |
| og:locale:alternate de_DE | ✓ wgrane | OK |
| Loading/decoding/width/height na imgach | ✓ wgrane (12 imgów) | OK |
| Cytat Karoliny po polsku na /pl/ | ❌ EN (PL/EN mixup) | Klient: naprawić panel |
| `<html lang="pl">` na /pl/ | ❌ "en" (PL/EN mixup + template bug) | v1.34 JS fix częściowy |
| robots noindex,nofollow | ❌ nadal aktywne | Klient: włączyć indeksację |
| Description "19 apartments, 9.8" (systemowy) | ❌ nadal stara | Klient: zaktualizować w panelu |
| og:image http:// | ❌ nadal mixed content | Klient: zmienić na https w panelu |
| target="blank" w footerze (REGULAMIN/POLITYKA) | ❌ template bug | v1.34 JS fix |
| Canonical na podstronach wskazuje home | ❌ template bug | v1.34 JS fix |
| Container-hotspot (wyróżnione oferty) | ✓ system generuje + nasz JS obsługuje | OK |

---

## Co MUSI zrobić klient (zaktualizowana lista akcji panelu)

### 🔴 URGENT (P0)
1. **Naprawić PL/EN mixup w panelu**: usunąć HEAD_EN z polskiej zakładki, wkleić HEAD_PL. To samo dla CMS strony głównej PL.
2. **Włączyć indeksację**: Panel → Konfiguracja → SEO → odznaczyć "Strona w wersji deweloperskiej".

### 🟡 IMPORTANT (P1)
3. **Title strony wizytówki PL** — wpisać polski tytuł (obecnie placeholder/pusty)
4. **Title strony wizytówki DE** — wpisać "Apartments zur Miete in Breslau | Fair Rentals" (obecnie placeholder "Wypełnij to pole...")
5. **Title /contact** — wypełnić dla PL/EN/DE (obecnie puste)
6. **Stara meta description systemowa** — zaktualizować "19/9.8" → "21/9.6" w panelu (mimo że nasz custom HEAD pokazuje 21, systemowy też powinien być spójny)
7. **OG image http:// → https://** — zmienić w panelu OG meta
8. **Menu EN** — dodać "ATTRACTIONS" → /en/txt/200
9. **Menu DE** — "CONTACT" → "KONTAKT", dodać "VERMIETUNGSVERWALTUNG"

### 🟢 OPTIONAL — Sprint E P26/P29
10. Wgrać 7 zdjęć Unsplash → panel Galerii (per [INSTRUKCJA_ZDJECIA_LOKALNIE.txt](DO_WKLEJENIA/INSTRUKCJA_ZDJECIA_LOKALNIE.txt))

### 🆕 NEW (Blog module)
11. Wgrać `blog-manifest.json` do panelu (Wygląd → Pliki)
12. Stworzyć podstronę /pl/txt/300/blog (lista) z BLOG_LIST_PL/EN/DE__body_top.html
13. Stworzyć 3 podstrony /pl/txt/301-303 (posty) z BLOG_POST_30X_PL__body_top.html
14. Dodać "Blog" do menu PL/EN/DE
15. **Agnieszka uzupełnia placeholdery `<em>(...)</em>`** w 3 outline'ach postów

---

## CSS + JS growth

| Wersja | CSS linii | CSS KB | JS funkcji nowych |
|---|---|---|---|
| v1.32 | 12409 | 368 | 0 |
| **v1.34** | **12809** | **~378** | **+4 (canonical, target=blank, lang, initBlog)** |

CSS soft limit IdoBooking 300KB / hard ~500KB → komfortowo w zakresie.

---

## Wgranie do panelu — checklista v1.34

1. ☐ **CRITICAL**: poprawić PL panel (usunąć HEAD_EN z PL, wkleić HEAD_PL; usunąć GLOWNA_EN z PL CMS, wkleić GLOWNA_PL)
2. ☐ Wgrać zaktualizowany [FR_ARKUSZ_STYLOW.css](DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css) (zawiera §105 blog)
3. ☐ Wgrać zaktualizowany [FR_KONIEC_BODY.html](DO_WKLEJENIA/FR_KONIEC_BODY.html) (zawiera 4 nowe funkcje JS)
4. ☐ Wgrać [blog-manifest.json](DO_WKLEJENIA/blog-manifest.json) do panelu (Wygląd → Pliki)
5. ☐ Stworzyć /pl/txt/300/blog + EN + DE (wkleić body_top z BLOG_LIST_*)
6. ☐ Stworzyć /pl/txt/301-303 (3 posty PL — body_top z BLOG_POST_301-303_PL)
7. ☐ Dodać "Blog" do menu PL/EN/DE
8. ☐ Cmd+Shift+R verify (canonical/target=blank/lang fix działa, blog się ładuje)
9. ☐ Agnieszka: uzupełnia treść 3 postów (placeholdery `<em>(...)</em>`)
10. ☐ Po naprawie panelu + uzupełnieniu — Lighthouse re-run

---

## Status overall

| Bucket | Wersja | Status |
|---|---|---|
| Sprint E (UX MEDIUM/LOW) | v1.33 | ✅ DONE |
| Sprint D (Blog architecture) | v1.34 | ✅ Opcja A IMPLEMENTED |
| PD/SA tickets (4) | v1.33 | 📝 Drafts gotowe |
| Klient panel akcje | — | ❌ 15 nadal nieukończonych |
| Klient blog content | — | 📋 3 outlines, czeka Agnieszka |
| Blog metodyka w JARVIS lib | v1.0 | ✅ Reusable dla kolejnych klientów |

---

## Co dalej (v1.35+)

1. **Po naprawie panelu klienta**: re-audit live + Lighthouse
2. **Po uzupełnieniu treści przez Agnieszkę**: weryfikacja blog na żywo
3. **Blog wersje EN/DE postów**: tłumaczenie + dodanie do manifest
4. **Sprint F (opcjonalny)**: monitoring traffic z bloga przez 3-6 miesięcy → decyzja czy migrować do WordPress (Opcja B)
