---
name: auto-blog-listing
description: Blog na stronach IdoBooking działa AUTOMATYCZNIE — klient dodaje wpisy w panelu "Aktualności", JS czyta .news-item i renderuje styled karty. Nigdy nie wklejaj wpisów ręcznie do CMS podstrony!
type: instinct
scope: all-clients
trigger: klient prosi o blog / sekcję aktualności / "dodać artykuły"
added: 2026-04-21
source_clients:
  - WCA (client{XXX}) — wzorzec źródłowy (wca-emails.js §5 + wca-blog-listing__body_top.html)
  - apartamenty-parkowe (client58154) — drugi klient z wdrożeniem
---

# Instynkt: Blog = systemowe Aktualności + JS auto-listing

## Idea
IdoSell/IdoBooking ma wbudowaną funkcję "Aktualności" (news).
W panelu każdy wpis dodaje się jako rekord z polami:
- Nagłówek (title)
- Treść HTML (content)
- Zdjęcie (optional)
- Data publikacji
- Status (aktywny/nieaktywny)

System renderuje te wpisy jako `.news-item` elementy — domyślnie na
stronie głównej (w bocznej sekcji news) i jako pełne artykuły pod
URL `/news/{id}/slug`.

**Wykorzystujemy to:**
- Dajemy klientowi pustą podstronę `/blog` z sekcją-hero i pustym gridem
- JS czyta `.news-item` i renderuje własne karty zgodne z brandem
- Klient dodaje nowe wpisy w panelu → karta pojawia się automatycznie

## Workflow dla klienta
1. Panel → **Wygląd i treści → Aktualności → Dodaj aktualność**
2. Wpisuje tytuł + treść HTML + zdjęcie + datę
3. Zapisuje → wpis pojawia się na /blog (i /en/blog) jako karta

**Klient NIGDY nie edytuje samej podstrony /blog** — ta ma być pusty
szablon, treść jest dynamiczna.

## Implementacja (3 pliki)

### 1. Podstrona Blog listing — body_top (PL + EN)
```html
<section class="ap-pagehero">
  <div class="ap-pagehero__inner">
    <span class="ap-pagehero__kicker">BLOG · {NAZWA KLIENTA}</span>
    <h1 class="ap-pagehero__title">Inspiracje <em>i ciekawostki</em></h1>
    <p class="ap-pagehero__subtitle">...</p>
  </div>
</section>

<section class="ap-blog-section">
  <div class="ap-blog">
    <div class="ap-blog__hero">
      <span class="ap-kicker">NAJNOWSZE WPISY</span>
      <h2 class="ap-blog__title">Czytaj nasz <em>blog</em></h2>
      <span class="ap-blog__line"></span>
    </div>
    <div class="ap-blog__grid">
      <div class="ap-blog__empty">
        <p>Wkrótce pojawią się tu pierwsze artykuły.</p>
      </div>
    </div>
  </div>
</section>
```

### 2. JS (koniec body)
```javascript
function initBlogListing() {
  var grid = document.querySelector('.ap-blog__grid');
  if (!grid) return;

  // Ukryj systemowy H1 na stronie podstrony
  var h1 = document.querySelector('h1.big-label');
  if (h1 && h1.closest('.container, #pageContent')) h1.style.display = 'none';

  // 1) news-items lokalnie?
  var localNews = document.querySelectorAll('.news-item');
  if (localNews.length > 0) { buildBlogCards(localNews); return; }

  // 2) Fallback: fetch homepage
  var homeUrl = (location.pathname.indexOf('/en/') === 0) ? '/en/' : '/';
  fetch(homeUrl)
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var items = doc.querySelectorAll('.news-item');
      if (items.length > 0) buildBlogCards(items);
    })
    .catch(function () {});

  function buildBlogCards(items) {
    grid.innerHTML = '';
    items.forEach(function (item) {
      var titleEl = item.querySelector('a:not(.more-news)');
      var dateEl = item.querySelector('.news-date');
      var contentEl = item.querySelector('.news-content');
      var imgEl = item.querySelector('img');
      if (!titleEl) return;

      var title = titleEl.textContent.trim();
      var href = titleEl.getAttribute('href') || '#';
      var date = dateEl ? dateEl.textContent.trim() : '';
      var excerpt = contentEl ? contentEl.textContent.trim().substring(0, 160) : '';
      var imgSrc = imgEl ? (imgEl.getAttribute('src') || imgEl.src) : '';

      var card = document.createElement('a');
      card.href = href;
      card.className = 'ap-blog-card';  // ← prefix klienta!
      var imgPart = imgSrc
        ? '<img src="' + imgSrc + '" alt="' + title.replace(/"/g, '&quot;') + '" loading="lazy">'
        : '<div class="ap-blog-card__img--placeholder">A</div>';
      card.innerHTML =
        '<div class="ap-blog-card__img">' + imgPart + '</div>' +
        '<div class="ap-blog-card__body">' +
        (date ? '<span class="ap-blog-card__date">' + date + '</span>' : '') +
        '<h3 class="ap-blog-card__title">' + title + '</h3>' +
        '<p class="ap-blog-card__excerpt">' + excerpt + (excerpt.length >= 160 ? '…' : '') + '</p>' +
        '<span class="ap-blog-card__cta">' + (location.pathname.indexOf('/en/') === 0 ? 'Read more →' : 'Czytaj więcej →') + '</span>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  var nc = document.querySelector('.news-container');
  if (nc) nc.style.display = 'none';
}
```

### 3. CSS (w custom.css klienta)
Klasy: `.{prefix}-blog`, `.{prefix}-blog__hero`, `.{prefix}-blog__grid`,
`.{prefix}-blog-card`, `.{prefix}-blog-card__img`, `.{prefix}-blog-card__body`,
`.{prefix}-blog-card__date`, `.{prefix}-blog-card__title`,
`.{prefix}-blog-card__excerpt`, `.{prefix}-blog-card__cta`.

Responsive grid (320/1fr), hover → lift + image scale, placeholder
image z gradientem brand colour.

## Gotowe wpisy (do katalogu BLOG_WPISY/)
Dla każdego klienta przygotuj **minimum 5 gotowych wpisów** — klient
wklei je od razu przy starcie. Każdy wpis w osobnym pliku z polami:
- TYTUŁ
- META OPIS (do SEO wpisu)
- OBRAZEK (Pexels URL hotlink, opcjonalnie)
- HTML (treść wpisu)

Temat wpisów **dopasowany do branży klienta**:
- Apartamenty krótkoterminowe → plan weekendu, atrakcje okolicy, historia miasta, co zjeść, z dziećmi
- Kempingi → co zabrać, sąsiednie atrakcje, jak karawaning, dzieci
- Hotele → restauracje, konferencje, pakiety, sezony

## Pułapki (do ominięcia)
❌ **Nie wklejaj wpisów jako podstrony** — klient nie będzie w stanie
   dodawać nowych, bo musiałby edytować HTML
❌ **Nie rób własnego CMS** — to strata czasu i kod, który się zepsuje.
   System IdoBooking ma już "Aktualności", używamy ich
❌ **Nie zapomnij ukryć systemowej sekcji news na homepage** — jeśli
   klient ma wpisy, system domyślnie pokazuje je jako boczną listę
   na stronie głównej. Ukrywamy `.news-container` CSS-em na page-index
❌ **Nie zapomnij ukryć systemowego H1 "Aktualności"** na stronie bloga
   — mamy własny page-hero

## Referencja
- WCA (pierwszy klient):
  - `clients/WCA/DO_WKLEJENIA/wca-blog-listing__body_top.html`
  - `clients/WCA/DO_WKLEJENIA/wca-emails.js` §5
  - `clients/WCA/DO_WKLEJENIA/wca-styles.css` §8
- apartamenty-parkowe (drugi klient):
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/BLOG_PL__body_top.html`
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/BLOG_EN__body_top.html`
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_KONIEC_BODY.html` §15
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/AP_CSS_EDYTOR.css` §7
  - `clients/apartamenty-parkowe/DO_WKLEJENIA/BLOG_WPISY/*.html` (5 gotowych wpisów)

## Kiedy stosować
- **Zawsze** gdy klient prosi o blog/aktualności/artykuły
- Przy nowym kliencie domyślnie **oferuj** podstronę /blog w briefie
  (nawet jeśli klient nie pytał) — to darmowa funkcja z systemu,
  wzmacnia SEO i daje klientowi kanał komunikacji z gośćmi
