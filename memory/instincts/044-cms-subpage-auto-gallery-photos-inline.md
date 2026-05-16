# Instinct 044 — Gallery upload na podstronie CMS = auto-render `.gallery-lightbox` pod body_top

**Data**: 2026-05-06
**Klient**: SORS (Eagle Tower Benidorm) — sesja Lokalizacja v3
**Powiązane**: trap #34 (IdoSell wycina `<script>`), instinct 015 (featured offers no fallback), instinct 026 (MASTER featured offers)

## Wzorzec

Gdy klient wgra zdjęcia do **galerii podstrony CMS** (`Strony CMS → [strona] → Galeria zdjęć`), IdoBooking **automatycznie** renderuje je jako kafelki pod treścią body_top:

```html
<div class="container">
  <div class="gallery-lightbox row px-3 my-5">
    <div class="gallery-sub col-6 col-md-4 p-1">
      <a href="..."><img src="/images/frontpageGallery/pictures/large/{folder}/0/{ID}.webp"></a>
    </div>
    ...
  </div>
</div>
```

URL zdjęcia: `https://{domain}/images/frontpageGallery/pictures/large/{folder}/0/{ID}.webp`
- `{folder}` = numer kategorii (na SORS Lokalizacja = `4`)
- `{ID}` = sekwencyjny numer (99, 100, 101, 102 dla 4 zdjęć)

Klient WIDZI te zdjęcia od razu na żywo (bez wklejania niczego do body_top).

## Trap

Gdy chcesz użyć tych zdjęć **inline w sekcjach body_top** (zamiast jako kafelki na dole), masz **2 problemy**:

### 1. Duplikacja
Po wklejeniu `<img src=".../99.webp">` do sekcji body_top, zdjęcie pojawia się **dwa razy**:
- Raz w sekcji body_top (gdzie chcesz)
- Raz na dole jako kafelek `.gallery-lightbox` (auto-render IdoBooking)

### 2. Identyfikacja content
IdoBooking **strippuje oryginalne nazwy plików** przy uploadzie — zostają tylko sekwencyjne ID (99, 100, 101, 102).
WebP nie ma metadanych z filename. HEAD response nie zwraca `Content-Disposition`.
**Mapowanie ID → content musi być zrobione wizualnie** (nie po nazwie pliku).

## Workflow

### Krok 1 — Identyfikuj URLe i content (Playwright/Chrome DevTools MCP)

```js
// Na live page:
const imgs = Array.from(document.querySelectorAll('.gallery-lightbox img'));
imgs.map(i => i.src);
// → ['/images/frontpageGallery/pictures/large/4/0/99.webp', '.../100.webp', ...]
```

Następnie **screenshot każdego URL** osobno:
```
mcp__playwright__browser_navigate(url=".../99.webp")
mcp__playwright__browser_take_screenshot(filename="check_99.jpg")
// → wizualnie identyfikuj: lotnisko / plaża / golf / restauracja
```

Mapuj ID → sekcja na podstawie zawartości obrazu, NIE na podstawie kolejności uploadu.

### Krok 2 — Wstaw `<img>` do sekcji body_top

```html
<div class="et-media-row__img">
  <img src="https://{domain}/images/frontpageGallery/pictures/large/4/0/{ID}.webp"
       alt="{opis sekcji}" loading="lazy">
</div>
```

CSS `.et-media-row__img img { width:100%; height:620px; object-fit:cover; }` — już istnieje w `00_CUSTOM_CSS_v3.css`.

### Krok 3 — Ukryj auto-galerię (dwa warianty)

**Wariant A — `<style>` w body_top** (próbuj pierwszy, prosty):
```html
<style>.page-txt .gallery-lightbox{display:none !important;}</style>
```
**Ryzyko**: WAF IdoBooking może wyciąć `<style>` (potwierdzone dla `<script>` — trap #34, możliwe że dla `<style>` też). **Zweryfikuj na live po wklejeniu** — `fetch` HTML i grep `gallery-lightbox{display:none`.

**Wariant B — reguła w `00_CUSTOM_CSS_v3.css`** (fallback gdy WAF blokuje):
```css
/* Hide auto-gallery na konkretnej podstronie — używamy zdjęć inline w sekcjach */
body.page-txt .gallery-lightbox { display: none !important; }
```
**Uwaga**: to ukrywa `.gallery-lightbox` na **wszystkich** stronach `.page-txt`. Jeśli inna podstrona (np. Galeria) używa galerii — potrzebny bardziej selektywny selector. Można dodać marker w body_top:
```html
<div class="et-page-marker et-page-marker--no-gallery"></div>
```
i CSS:
```css
body.page-txt:has(.et-page-marker--no-gallery) .gallery-lightbox { display: none !important; }
```
(`:has()` 90%+ supported).

## Anty-pattern

❌ Hardcode `<img>` URLs na podstawie kolejności uploadu wgranego przez klienta
   (klient mógł wgrać w innej kolejności niż zakłada wzorzec)

❌ Próba odczytania `Content-Disposition` lub EXIF aby zmapować filename → ID
   (IdoBooking wycina filenames, WebP nie ma metadanych)

❌ Pozostawić auto-galerię na dole BEZ ukrycia — daje duplikat zdjęć

## Pro-tip — JS readout pattern (alternatywa do hardcode URL)

Robust workflow inspired by Madera/Najmar Featured Offers (instinct 026):

```html
<script>
(function(){
  const map = {
    100: '.et-img--beach',
    101: '.et-img--golf',
    102: '.et-img--gastro',
    99:  '.et-img--transport'
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery-lightbox img').forEach(img => {
      const m = (img.src || img.getAttribute('data-src') || '').match(/\/(\d+)\.webp/);
      if (!m) return;
      const target = document.querySelector(map[parseInt(m[1])]);
      if (target) target.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
    });
    const g = document.querySelector('.gallery-lightbox');
    if (g) g.style.display = 'none';
  });
})();
</script>
```

**ALE**: trap #34 — `<script>` w body_top jest **wycinany przez WAF**. Skrypt musi iść do `body_bottom` panelu. Dla podstrony CMS może nie być pola `body_bottom` — wtedy trzeba wstawić do globalnego `Wygląd → Koniec BODY`, ale wtedy odpala się na każdej stronie (sprawdzaj `location.pathname` w skrypcie).

## Kiedy stosować

✅ Klient wgra zdjęcia do galerii podstrony CMS i chce ich użyć w sekcjach
✅ Body_top ma puste placeholdery (SVG, ikony, color blocki) gotowe na zdjęcia
✅ Chcesz uniknąć ręcznego uploadu zdjęć przez FTP/JARVIS — niech klient wgrywa sam

## Powiązane

- Trap #34 (CLAUDE.md): IdoSell wycina `<script>` z body_top — może też `<style>`
- Instinct 015: featured offers no fallback (ten sam mechanizm dla `.cmshotspot`)
- Instinct 026 MASTER: featured offers implementation (JS readout + hide pattern)
- Lesson worktree-vs-main-repo-stale-paste: gdy edytujesz pliki w worktree, sync do main repo przed claim "done"
