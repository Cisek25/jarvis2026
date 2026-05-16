# Instinct 020 — Blog na IdoBooking: scraper systemowego /news (NIE custom HTML/manifest)

**Wzorzec źródłowy**: client58154 Apartamenty Parkowe (`https://client58154.idobooking.com/txt/203/Blog`)
**Wdrożenie**: Fair Rentals v1.37 (2026-05-15, sesja 6)
**Plik referencyjny**: `library/templates/blog/` (6 plików, reusable z prefix replacement)

---

## Reguła

**Gdy klient prosi o blog/bazę wiedzy na IdoBooking** — NIE buduj custom systemu z manifest.json + osobnymi podstronami /txt/X. Wykorzystaj **natywny moduł Aktualności** systemu IdoBooking.

## Dlaczego

IdoBooking ma wbudowany moduł Aktualności (Panel → Wygląd → **Aktualności**) który:
- Per news automatycznie generuje stronę `/news/X/slug` (z `<body class="page-news">`)
- Lista wszystkich newsów dostępna pod `/news` (z `.news-item` × N)
- Klient pisze posty NATURALNIE w panelu (Tytuł / Skrót / Treść w TinyMCE / Zdjęcie)
- Zero custom HTML, zero manifest update po stronie Damiana

## Architektura (v4, finalna)

### Klient w panelu
1. Włącza moduł Aktualności (Konfiguracja → Strony aktywne lub Wygląd)
2. Dodaje aktualność: Tytuł + Skrót + Treść + Zdjęcie
3. **Koniec.** System sam tworzy `/news/X/slug-tytulu`

### My (Damian/JARVIS)
1. **Strona-LISTA** `/txt/205/Blog` (lub `/news` — system natywny):
   - Body_top: jedna linijka `<div class="fr-blog-list-mount"></div>`
   - JS scraper pobiera `/news` (same-origin fetch), parsuje `.news-item`, renderuje karty fr-blog-card
2. **Strona-POST** `/news/X/slug`:
   - JS auto-detect przez `body.page-news` + URL pattern `/news/\d+/`
   - Wstrzykuje Schema.org BlogPosting JSON-LD + "← Wróć do listy" link
   - CSS stylizuje natywne `.news-wrapper.row` (grid karty) + `body.page-news article` (single post)

### CSS (sekcja §105k w arkuszu klienta)
```css
body.page-news .news-wrapper.row { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
body.page-news .news-item { background: white; border-radius: 12px; transition: transform 0.22s; }
body.page-news .news-item:hover { transform: translateY(-4px); box-shadow: ... }
/* Plus typography dla single post `body.page-news main.page .container article` */
```

### JS (FR_KONIEC_BODY.html)
```js
function initBlog() {
  var listMount = document.querySelector('.fr-blog-list-mount, [data-blog-list]');
  if (listMount) renderBlogList(listMount, lang); // fetch /news + parse .news-item
  
  if (document.body.classList.contains('page-news') && 
      location.pathname.match(/\/news\/\d+\//)) {
    enhanceNewsPost(lang); // Schema.org + back link + body.fr-is-blog-post
  }
}
```

## Co PORZUCIĆ z poprzednich podejść

### v1 (NIE rób) — custom body_top per post
- Klient wkleja BLOG_POST_30X_PL__body_top.html z hero/title/meta/CTA
- Trzeba update'ować strony per post
- TinyMCE może czyścić `data-*` atrybuty (low risk, ale...)

### v2 (NIE rób) — manifest.json fetch
- IdoBooking nie pozwala upload .json przez panel → 404 na wszystkich URL-ach (sprawdzone)
- Wymaga external hosting CDN/serwera klienta

### v3 (NIE rób) — inline manifest w JS
- Damian musi edytować JS po każdym poście
- Klient nie ma autonomii

### v4 (RÓB) — systemic /news scraper ✓
- Klient autonomiczny (panel Aktualności)
- Zero edycji kodu po dodaniu posta
- Auto-update listy
- Schema.org SEO automatyczny

## Warunek wstępny: moduł Aktualności WŁĄCZONY

Test:
```bash
curl -I https://{client}.idobooking.com/news
# Oczekiwane: HTTP 200 + HTML "Lista aktualności"
# Jeśli 302 → /frontpage → moduł WYŁĄCZONY w panelu — klient musi włączyć
```

## Reusable JARVIS template

`library/templates/blog/`:
- `blog-styles.css` — z {PREFIX} placeholder
- `blog-reader.js` — z {PREFIX} placeholder
- `blog-list__body_top.html` — minimal mount point
- `INSTRUKCJA_BLOG.md` — 8 kroków wdrożenia

Per nowy klient: find/replace `{PREFIX}` → `fr-` / `md-` / `nj-` itd. + ewentualnie zmień URL `/customStyles/.../blog-manifest.json` (jeśli używasz manifest fallback dla starszych projektów).

## Anti-pattern do unikania

Nie wracaj do hardcoded kart w body_top (jak Apartamenty Parkowe original wzorzec — tam mieli 3 karty wpisane ręcznie). To wymaga ręcznej edycji body_top przy każdym dodaniu posta. Lepiej JS scraper.

## Powiązane

- Memory: lesson 015 (PL/EN swap przy wgraniu)
- Memory: lesson 016 (CSS .col-lg-3 .btn vs accommodation-reservation conflict)
- Klient referencyjny: client58154 (Apartamenty Parkowe)
- Klient wdrożenia: client58360 (Fair Rentals v1.37+)
