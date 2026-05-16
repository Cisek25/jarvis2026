# Fair Rentals — RELEASE NOTES v1.48 (2026-05-16)

**Bazuje na**: v1.47 (post-deploy feedback klienta tego samego dnia)
**Wynika z**: 2 problemy po pierwszym deploy v1.47:
1. Mapa Leaflet po przesunięciu nie pokazuje tiles (recovery z v1.47 nie zadziałał)
2. **REGRESJA z v1.47**: menu czarny pasek bez tekstu (§109e złe selektory)

**Pliki zmienione**: 2
- `DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css` — fix §109e + nowa §109h (Google Maps)
- `DO_WKLEJENIA/FR_KONIEC_BODY.html` — nowa funkcja `injectGoogleMap()` + wywołanie w boot()

---

## Fix 1 — Menu czarny pasek (REGRESJA z v1.47)

### Diagnoza
Screenshot klienta pokazał **czarny prostokąt w nawigacji** zamiast 3 kropek toggle. MCP audit:

```
LI.menuOverflow.nav-item:
  width: 200, height: 32
  bg: rgba(15, 15, 14, 0.96)   ← MOJE §109e popup style!
  text: "...pokaż więcej menuBlogKontak..."
```

**Root cause**: w v1.47 §109e selektory `html body .menuOverflow` łapały:
- ✅ `UL.menuOverflow.sub-navi` (popup pod 3 kropkami — chciałem)
- ❌ `LI.menuOverflow.nav-item` (inline LI wrapper w nav listy — NIE chciałem)

LI dostawał dark bg z `rgba(15,15,14,0.96)` i wyglądał jak czarny prostokąt w środku menu.

### Fix (§109e v2)

**Reset LI wrapper** + **scope dark bg tylko do UL.sub-navi**:

```css
/* RESET — LI item wrapper transparent */
html body li.menuOverflow,
html body li.menuOverflow.nav-item {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  backdrop-filter: none !important;
}

/* ONLY popup UL (.sub-navi) */
html body ul.menuOverflow.sub-navi,
html body .menuOverflow > ul.sub-navi {
  background: rgba(15, 15, 14, 0.96) !important;
  ... (jak wcześniej)
}
```

---

## Fix 2 — Leaflet → Google Maps iframe

### Diagnoza
Klient po wgraniu v1.47 zgłosił: *"jak przesuniesz mape to nie widac…może z google jakos się da lepiej nie wiem :/ dziwnie"*.

**Re-audit MCP** potwierdził:
- `mapPane.offsetHeight: 2px` (nieuleczalne — recovery z 4 metod + fitBounds nie pomógł)
- Tiles renderują się w "fragmencie viewport" Leaflet
- Pan/zoom rozsypuje tiles — Leaflet nie wie jakie ma wymiary
- 2 instancje LMap w `window` (system + nasz tile layer collide?)

**Decyzja**: rezygnacja z fightowania Leaflet, zamiana na **Google Maps embed iframe**.

### Implementacja

**CSS §109h** — hide systemowy Leaflet + styl wrappera iframe:

```css
html body.contact-page .leaflet-container,
html body .contact-page #map_container {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
}

html body .fr-google-map-wrap {
  order: -1 !important;             /* NAD treścią dzięki flex § 109a */
  border-radius: 16px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 16px rgba(15,15,14,0.08) !important;
}

html body .fr-google-map-wrap iframe {
  width: 100% !important;
  height: 420px !important;
  border: 0 !important;
}

@media (max-width: 767px) {
  .fr-google-map-wrap iframe { height: 320px !important; }
}
```

**JS `injectGoogleMap()`** w FR_KONIEC_BODY:

```js
function injectGoogleMap() {
  // Only on /contact pages
  if (!document.body.classList.contains('contact-page') &&
      !/\/contact\/?$/i.test(location.pathname)) return;
  if (document.querySelector('.fr-google-map-wrap')) return;  // skip if already

  // Lang detection (pl/en/de from htmlLang or URL path)
  var lang = (document.documentElement.lang || '').substring(0,2).toLowerCase();
  if (lang !== 'pl' && lang !== 'en' && lang !== 'de') {
    var p = location.pathname;
    lang = p.indexOf('/en') === 0 ? 'en' : p.indexOf('/de') === 0 ? 'de' : 'pl';
  }

  // Build URL — Google Maps embed (no API key needed)
  var addr = encodeURIComponent('Białowieska 69/11, 54-234 Wrocław');
  var url = 'https://maps.google.com/maps?q=' + addr +
            '&hl=' + lang + '&z=15&output=embed';

  // Caption per language
  var caption = {
    pl: 'Fair Rentals · Białowieska 69/11, Wrocław',
    en: 'Fair Rentals · Białowieska 69/11, Wrocław',
    de: 'Fair Rentals · Białowieska 69/11, Breslau'
  }[lang];

  // iframe + wrapper
  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '420');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('title', caption);

  var captionEl = document.createElement('div');
  captionEl.className = 'fr-google-map-wrap__caption';
  captionEl.textContent = caption;

  var wrap = document.createElement('div');
  wrap.className = 'fr-google-map-wrap';
  wrap.appendChild(iframe);
  wrap.appendChild(captionEl);

  // Insert NAD .contact
  var contact = document.querySelector('.contact-page > .contact') ||
                document.querySelector('.contact-page .contact');
  if (contact) contact.insertBefore(wrap, contact.firstChild);
}
```

Wywołanie w `boot()` (po DOMContentLoaded).

### Trade-offs

| Aspekt | Leaflet (był) | Google Maps iframe (jest) |
|--------|---------------|---------------------------|
| Działa po pan/zoom | ❌ tiles znikają | ✅ pełna funkcjonalność |
| 21 markerów apartamentów | ✅ tak | ❌ tylko 1 (adres firmy) |
| Wymagany API key | ❌ nie | ❌ nie (free embed) |
| Performance | OK (10 tiles) | OK (lazy load) |
| Lokalizacja firmy widoczna | ✅ z 21 markerami | ✅ z pinem |
| Klient może szukać okolic | ❌ | ✅ (Google UI) |
| Branded styling | ✅ (CSS) | 🟡 (Google design) |
| Niezawodność | ❌ bug systemowy | ✅ 99.9% |

**Decyzja**: korzyść funkcjonalności > strata 21 markerów. Klient i tak ma listę apartamentów w sekcji `Apartamenty`. Mapa kontaktowa to **lokalizacja biura**, nie galeria oferty.

### Opcja na przyszłość

Jeśli klient chce 21 markerów apartamentów:
- **Mapbox Static API** z markerami (wymaga key, free do 50k requests/mies)
- **Google Maps Custom Embed Iframe Generator** (free, multiple pins)
- **Re-build Leaflet od zera** (`mymap.remove()` + nowa instancja z naszą konfiguracją)

Najprostsze: jak klient chce pokazać 21 lokalizacji, możemy **dodać LISTĘ apartamentów pod mapą** z hardcoded coords + link do Google Maps "Pokaż w Google Maps" (bez markerów na mapie, ale lista z adresami).

---

## Wymagana akcja Damian

1. Otworzyć panel IdoBooking Fair Rentals
2. **CSS** zakładka — wkleić nowy `FR_ARKUSZ_STYLOW.css` (zamiast v1.47)
3. **Skrypty → Koniec body** — wkleić nowy `FR_KONIEC_BODY.html`
4. Test live:
   - https://client58360.idobooking.com/ — sprawdzić **menu (NIE powinno być czarnego paska)** + 3 kropki popup (dark bg działa tylko po kliknięciu na "...")
   - https://client58360.idobooking.com/contact — Google Maps iframe z pinem na Białowieska 69/11
   - https://client58360.idobooking.com/en/contact — iframe z hl=en
   - https://client58360.idobooking.com/de/contact — iframe z hl=de + caption "Breslau"

---

## Versioning

- v1.46 → v1.47: 6 fixów (mapa CSS, /offers, O nas, menu popup, mobile grid, tel cleanup)
- **v1.47 → v1.48**: regresja menu fix + Leaflet → Google Maps iframe
- v1.49: czeka na klienta (P0 indeksacja, DE Title "A", OG, decyzja Małgorzata)
