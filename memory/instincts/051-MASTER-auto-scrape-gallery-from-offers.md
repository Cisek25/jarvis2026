# 051 — MASTER Auto-scrape galerii z systemowych /offers (8+ apartamentów × 9-17 zdjęć każdy)

## Kiedy stosować

Klient ma kilka apartamentów w panelu IdoBooking ale jego strona galerii ma:
- Placeholdery (`VILLA_V1`, `OKOLICA_V20`) — nieuzupełnione
- Tylko parę zdjęć z 1 apartamentu — inne pominięte
- Stare/zdublowane URL-e

**Insight kliencki**: "wszystkie apartamenty są w `/offers`, każdy ma swoje zdjęcia, możesz to scrapować i wstawić do galerii?"

**Tak — playwright + dedup po katalogu = 100+ zdjęć w 8 kategoriach automatycznie**.

## Pipeline (5 kroków)

### Krok 1 — Scrape listy ofert z `/offers`

```javascript
() => {
  const offers = Array.from(document.querySelectorAll('.offers-container, [class*="offer"]'))
    .filter(el => el.querySelector('h2, h3'))
    .map(el => {
      const link = el.querySelector('a[href*="/offer/"], a.object-icon');
      const titleEl = el.querySelector('h2 a, h3 a, h2, h3');
      const img = el.querySelector('img');
      return {
        title: titleEl?.textContent.trim(),
        url: link?.href,
        firstImg: img?.src || img?.getAttribute('data-src')
      };
    })
    .filter(o => o.url);
  return Array.from(new Map(offers.map(o => [o.url, o])).values());
}
```

Zwraca listę ofert z URL-ami `/pl/offer/{id}/{slug}` i pierwszym img (wskazówka katalogu).

### Krok 2 — Iteracja: nawiguj do każdej oferty + scrape zdjęć z dedykowanego katalogu

```javascript
// Per offer
() => {
  const allImgs = Array.from(document.querySelectorAll('img'))
    .map(i => i.getAttribute('src') || i.getAttribute('data-src') || '')
    .filter(s => s && s.includes('/images/objects/pictures/large/'));
  // Find dominant directory (każda oferta ma swój /X/Y/)
  const dirCounts = {};
  allImgs.forEach(s => {
    const m = s.match(/\/large\/(\d+\/\d+)\//);
    if (m) dirCounts[m[1]] = (dirCounts[m[1]] || 0) + 1;
  });
  const mainDir = Object.entries(dirCounts).sort((a,b) => b[1]-a[1])[0]?.[0];
  // Filter only this offer's images
  const offerImgs = [...new Set(allImgs.filter(s => s.includes(`/large/${mainDir}/`)))]
    .map(u => u.startsWith('http') ? new URL(u).pathname : u);
  return { mainDir, count: offerImgs.length, imgs: offerImgs };
}
```

**Kluczowe**: na podstronie oferty wyświetlają się też zdjęcia z **related/similar offers** (cross-sell). Filtrowanie po `mainDir` (najczęściej występujący katalog `X/Y`) odzielena tylko zdjęcia tej oferty.

### Krok 3 — Zbuduj JSON z mappingiem

```json
{
  "offers": [
    {
      "id": "batumi-view-1",     // slug do data-category w galerii
      "dir": "/6/1",             // katalog systemowy
      "tabPL": "Batumi View 1",  // nazwa tabu PL
      "tabEN": "Batumi View 1",
      "tabRU": "Batumi View 1",
      "fullPL": "Batumi View nad samym morzem",  // do alt
      "fullEN": "Batumi View by the sea",
      "fullRU": "Batumi View у самого моря",
      "imgs": [173, 172, 59, 62, 63, 64, 65, 66, 67]  // numery .jpg
    }
  ]
}
```

### Krok 4 — Generator Python (template-driven)

```python
def gen_gallery(lang_code, file_suffix):
    # Build tabs HTML
    tabs_html = f'<button class="gs-gallery-tab active" data-filter="all">{cfg["tab_all"]}</button>\n'
    for o in offers:
        tabs_html += f'<button class="gs-gallery-tab" data-filter="{o["id"]}">{o[tab_field]}</button>\n'

    # Build grid items
    grid_items = []
    for o in offers:
        for idx, img_num in enumerate(o['imgs'], 1):
            url = f'/images/objects/pictures/large{o["dir"]}/{img_num}.jpg'
            alt = f'{o[full_field]} — {cfg["photo"]} {idx}'
            grid_items.append(f'<div class="gs-gallery-item" data-category="{o["id"]}">\n  <img src="{url}" alt="{alt}" loading="lazy">\n</div>')

    # Wstaw do template HTML z header + lightbox
    template.render(tabs=tabs_html, grid='\n'.join(grid_items))
```

3 wywołania (PL/EN/RU) generują 3 pliki galerii bez duplikacji kodu.

### Krok 5 — Verify HEAD na próbce

```bash
for url in /6/1/173.jpg /0/1/204.jpg /1/1/84.jpg /2/1/123.jpg /3/1/199.jpg /8/1/178.jpg /9/1/192.jpg /1/2/228.jpg; do
  code=$(curl -sI -A "Mozilla/5.0" -o /dev/null -w "%{http_code}" "https://geostay.ge/images/objects/pictures/large${url}")
  echo "[$code] ${url}"
done
```

Wszystkie 8 sample (po 1 z każdej oferty) muszą zwrócić 200.

## CSS — taby zawijają na mobile

```css
.gs-gallery-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.gs-gallery-tab {
  padding: 8px 16px;
  border: 1px solid var(--brand-border);
  background: transparent;
  border-radius: 24px;
  cursor: pointer;
  font-size: 13px;
}
.gs-gallery-tab.active { background: var(--brand-primary); color: white; }
.gs-hidden { display: none !important; }
```

## JS galerii (1 plik dla 3 języków)

JS jest **language-independent** (logika filtrów + lightbox tylko z DOM):
```javascript
// Filtr per kategoria
tabs.forEach(tab => tab.addEventListener('click', function() {
  const filter = this.dataset.filter;
  tabs.forEach(t => t.classList.remove('active'));
  this.classList.add('active');
  items.forEach(item => {
    item.classList.toggle('gs-hidden', filter !== 'all' && item.dataset.category !== filter);
  });
}));
```

1 plik `01_GALERIA_JS.html` używany dla PL/EN/RU (ten sam kod, tylko komentarze różnią się). Patrz instinct 028 (one shared JS file per page).

## Klient: GeoStay (grzybek), 2026-05-08

- 8 apartamentów scrapowane z `/pl/offers`
- 114 zdjęć łącznie (range: 9-17 per apartament)
- 9 tabów filtrów (Wszystkie + 8 apartamentów)
- 3 pliki PL/EN/RU wygenerowane przez Python script
- Live verify: 8/8 sample URLs HTTP 200, 114 zdjęć w DOM

## Common mistakes

- ❌ Brak filtra `mainDir` → łapiesz zdjęcia z related/cross-sell offers
- ❌ Brak filtra `large/` (zostaje też `small/`) → duplikaty (małe + duże)
- ❌ Hardkoduj zdjęcia bez weryfikacji HEAD → klient widzi broken images jeśli URL nieaktualny
- ❌ Nie deduplikuj `[...new Set(...)]` → te same zdjęcia 2× w galerii
- ❌ Generuj 3 osobne JS files (PL/EN/RU) → nadmiarowość, łam DRY (instinct 028)
- ❌ Pomieszać `data-category` slugs w EN/PL/RU → filtry przestają działać. Slugi MUSZĄ być te same we wszystkich językach.

## Reusable assets

- `/tmp/claude/scraped_offers.json` — schemat JSON dla mappingu
- `/tmp/claude/gen_gallery.py` — generator script (PL/EN/RU jednym wywołaniem)
- Workflow zapisany — następny klient o podobnym układzie ofert (Madera, EcoCamping, Stay Old Town?) → 30 min zamiast 4h ręcznej pracy
