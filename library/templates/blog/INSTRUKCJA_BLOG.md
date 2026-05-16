# JARVIS Blog Module — Instrukcja wdrożenia (Opcja A)

**Architektura**: IdoBooking podstrony (`/lang/txt/30X`) + manifest JSON + JS reader
**Wymagania klienta**: 0 zł hosting dodatkowy, 0 zewnętrznych systemów
**Skala docelowa**: do ~30 artykułów (powyżej → migracja do WordPress)

---

## Filozofia

- **Blog NIE pojawia się na stronie głównej**. Tylko link w menu prowadzi do listy.
- **Każdy artykuł = osobna podstrona w panelu IdoBooking** (`/{lang}/txt/30X/slug`).
- **Lista artykułów generowana JS-em** z manifest JSON (jeden centralny plik).
- **Filter po kategorii** (Dla Gości / Dla Właścicieli / Dla Firm — konfigurowalne per klient).
- **Schema.org BlogPosting** wstrzykiwane przez JS dla każdego posta (SEO).

---

## Pliki w module

```
library/templates/blog/
├── blog-styles.css              ← CSS (lista + post + related) — kopiuj do FR_ARKUSZ_STYLOW.css
├── blog-reader.js               ← JS module — kopiuj do FR_KONIEC_BODY.html
├── blog-list__body_top.html     ← szablon strony-listy /pl/txt/300
├── blog-post__body_top.html     ← szablon pojedynczego artykułu /pl/txt/30X
├── blog-manifest.example.json   ← przykład manifestu (struktura + 3 posty)
└── INSTRUKCJA_BLOG.md           ← TEN PLIK
```

---

## Wdrożenie dla nowego klienta — 8 kroków

### KROK 1 — Skopiuj pliki do klienta

```bash
cp library/templates/blog/blog-styles.css     clients/{KLIENT}/DO_WKLEJENIA/
cp library/templates/blog/blog-reader.js      clients/{KLIENT}/DO_WKLEJENIA/
cp library/templates/blog/blog-list__body_top.html clients/{KLIENT}/DO_WKLEJENIA/
cp library/templates/blog/blog-post__body_top.html clients/{KLIENT}/DO_WKLEJENIA/
cp library/templates/blog/blog-manifest.example.json clients/{KLIENT}/DO_WKLEJENIA/blog-manifest.json
```

### KROK 2 — Find/replace placeholders

W każdym z 5 skopiowanych plików zamień:
- `{PREFIX}` → prefix klienta (np. `fr`, `md`, `nj`)
- `{BRAND_KICKER}` → np. `BAZA WIEDZY` lub `BLOG`
- `{LIST_TITLE}` → tytuł H1 strony-listy
- `{LIST_LEAD}` → 1-2 zdania opisu nad gridem
- `{MANIFEST_URL}` → np. `/customStyles/default13/custom2/blog-manifest.json` (lub absolutny URL)

W `blog-manifest.json` zaktualizuj:
- `brand`, `brandLogo`, `defaultAuthor`
- `categories` (klucze + etykiety per język)
- `posts[]` — usuń przykładowe, wstaw realne

### KROK 3 — Dodaj CSS do arkusza klienta

Wklej całość `blog-styles.css` na końcu `{KLIENT}_ARKUSZ_STYLOW.css` jako nowa sekcja (np. `§105. Blog`).

Po wklejeniu wykonaj find/replace na CAŁEJ sekcji — `{PREFIX}` → `fr` (lub odpowiedni prefix).

### KROK 4 — Dodaj JS do FR_KONIEC_BODY

W `FR_KONIEC_BODY.html`, wewnątrz IIFE (przed `function boot()`):

1. Wklej zawartość `blog-reader.js`
2. Zamień `{PREFIX}` na prefix klienta
3. W `function boot()` dodaj wywołanie:
```js
initBlog();
```

### KROK 5 — Hostuj manifest.json

**Opcja A (preferowana)**: panel IdoBooking → Wygląd → Pliki → upload `blog-manifest.json`.
URL: `https://{klient}.idobooking.com/customStyles/default13/custom2/blog-manifest.json`

**Opcja B (jeśli A niemożliwa)**: hostuj manifest pod własną domeną klienta (CORS muszą pozwalać).

W `blog-list__body_top.html` zaktualizuj atrybut `data-manifest-url` jeśli URL inny niż default.

### KROK 6 — Stwórz podstronę-LISTĘ w panelu IdoBooking

Panel → Treści → Strony tekstowe → Dodaj nową
- **Numer**: 300 (lub kolejny wolny ≥300; trzymaj się konwencji 30X dla blog)
- **Slug PL**: `blog` (URL będzie `/pl/txt/300/blog`)
- **Slug EN**: `blog`
- **Slug DE**: `blog`
- **Title PL**: `Blog | {Brand}` lub `Baza wiedzy | {Brand}`
- **Title EN**: `Blog | {Brand}`
- **Title DE**: `Blog | {Brand}`
- **Meta description PL/EN/DE**: 1 zdanie opisu blog (każdy język)
- **Body_top PL**: wklej zawartość `blog-list__body_top.html` (po replace placeholderów PL)
- **Body_top EN**: wklej tę samą strukturę z tłumaczeniami EN (skopiuj plik i przetłumacz)
- **Body_top DE**: analogicznie DE

### KROK 7 — Dodaj link "Blog" do menu

Panel → Wygląd → Menu → każdy język:
- Dodaj pozycję "Blog" (lub "Baza wiedzy" / "Knowledge base" / "Wissensbasis")
- Link do `/pl/txt/300/blog` (lub odpowiednio dla EN/DE)
- Pozycja: zazwyczaj między "Atrakcje" a "O nas"

### KROK 8 — Stwórz pierwszy artykuł

Panel → Treści → Strony tekstowe → Dodaj nową
- **Numer**: 301 (potem 302, 303...)
- **Slug PL**: np. `10-atrakcji-wroclawia`
- **Title**: pełny tytuł SEO
- **Meta description**: 150 znaków opisu
- **Body_top**: wklej `blog-post__body_top.html` z wypełnionymi placeholderami
  - **WAŻNE**: atrybut `data-blog-post="{SLUG}"` musi matchować `slug` w manifest.json
- Skopiuj+przetłumacz dla EN/DE (numer 301 ten sam, tylko inne body_top per język)

Po dodaniu posta — **zaktualizuj manifest.json** (dodaj wpis w `posts[]`) i re-uploaduj.

---

## Sposób pracy klienta (po wdrożeniu)

### Dodanie nowego artykułu (5 minut):

1. **Napisz treść** w Word/Google Docs (HTML lub Markdown formatting)
2. **Zrób featured image** (1600×900 px, JPG, optymalizuj na tinypng.com)
3. **W panelu**: Treści → Strony tekstowe → Dodaj nową /txt/30X
4. **Wklej body_top** (skopiuj `blog-post__body_top.html`, podmień placeholdery, wklej treść)
5. **Wyślij Damianowi** featured image + dane do dodania w manifest.json
6. Damian aktualizuje manifest → uploaduje do panelu → post pojawia się na liście

### Dodanie nowej kategorii (jednorazowo):

1. W `manifest.json` dodaj klucz w `categories`, np. `"sezonowe": "Sezonowe oferty"`
2. Oznacz nowe posty kluczem `"category": "sezonowe"`
3. Filter chip pojawi się automatycznie

---

## SEO checklist per artykuł

- [ ] Unikalny title (max 60 znaków, z keyword)
- [ ] Unikalny description (140-160 znaków, z keyword + CTA)
- [ ] Featured image z descriptive alt
- [ ] H1 = tytuł posta (tylko jeden H1)
- [ ] H2/H3 zorganizowane logicznie (max 6-8 H2)
- [ ] Wewnętrzne linki (min 2 do innych podstron klienta)
- [ ] CTA box na końcu (Sprawdź oferty / Skontaktuj się)
- [ ] Schema.org BlogPosting (auto przez JS — sprawdź w Rich Results Test)
- [ ] Slug = keyword-friendly URL (bez stop words, dash separator)
- [ ] Data publikacji aktualizowana w manifest (przy edycji ustaw `updatedAt`)

---

## Konwencje numerowania /txt/X

- **/txt/200-299** — strony statyczne (atrakcje, kontakt, regulamin)
- **/txt/300** — blog list (zawsze ten numer)
- **/txt/301-399** — artykuły blog
- **/txt/400-499** — landing pages marketing (jeśli kiedyś)

---

## Edge cases & troubleshooting

### Manifest nie ładuje się

1. Sprawdź w DevTools Network — czy URL `blog-manifest.json` zwraca 200?
2. Sprawdź CORS headers (musi być same-origin lub `Access-Control-Allow-Origin: *`)
3. Sprawdź czy JSON jest poprawny (jsonlint.com)

### Karty nie wyświetlają się

1. Sprawdź console — czy `initBlog()` faktycznie się wywołuje?
2. Sprawdź czy `<div data-blog-list>` jest w DOM (może body_top nie wgrany)
3. Sprawdź czy posts w manifeście mają `published: true` i `lang` zgodny z URL

### Schema.org JSON-LD nie pojawia się

1. Otwórz post w przeglądarce → View Source → szukaj `application/ld+json`
2. Jeśli brak — sprawdź czy `data-blog-post="..."` slug match z manifest

### Featured image nie ma fetchpriority

- Default `width="1600" height="900"` (16:9). Jeśli rzeczywiste proporcje inne — edytuj w szablonie

---

## Limity Opcji A — kiedy migrować do B (WordPress)

Migrate triggers (jeśli ≥2 z poniższych):

- [ ] Blog ma >15 aktywnie utrzymywanych artykułów (panel zagracony)
- [ ] Klient chce drafty, scheduling, revisions (IdoBooking CMS nie wspiera)
- [ ] SEO traffic z bloga >30% całkowitego (uzasadnia inwestycję WP)
- [ ] Klient chce komentarze, newsletter integration, social plugins
- [ ] Klient chce content team (więcej niż 1 osoba pisze)
- [ ] Manifest.json osiąga >100 wpisów (loading time issue)

---

## Wersja modulu

**v1.0** (2026-05-15) — initial release, opracowany na potrzeby Fair Rentals jako pilot.

Następne planowane:
- v1.1: RSS feed generator (statyczny XML)
- v1.2: Search w blogu (client-side fuzzy match w manifescie)
- v2.0: migracja do statycznego SSG (Astro/Eleventy) dla klientów chcących pełną kontrolę
