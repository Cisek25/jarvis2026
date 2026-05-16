# Fair Rentals — Release v1.33 (Sprint E)

**Data**: 2026-05-15
**Sprint**: E — UX PDF MEDIUM/LOW + SEO/perf cleanup
**Stan przed**: v1.32 (Sprint C O nas + menu overflow + stopka fixes)
**Stan po**: v1.33 (perf attrs na imgach + hreflang DE + OG locale + instrukcja zdjeć)

---

## Zakres prac

### 1. SEO — hreflang DE (BLOCKER fix)

**Problem**: `FR_HEAD_PL.html` i `FR_HEAD_EN.html` miały tylko `hreflang="pl"`, `"en"`, `"x-default"`. Brakowało `hreflang="de"` mimo że strona ma wersję DE (`/de/`). To powodowało:
- Google indeksował tylko PL/EN — nie kierował niemieckich użytkowników na DE
- Brak crawl rozszerzonego sitemap link relations
- AUDIT_UX P17 / IDOBOOKING_TICKETS — częściowe rozwiązanie po naszej stronie

**Fix**: Dodane do FR_HEAD_PL i FR_HEAD_EN:
```html
<link rel="alternate" hreflang="de" href="https://client58360.idobooking.com/de/">
```

FR_HEAD_DE już miał komplet (pl/en/de/x-default) — bez zmian.

**Pliki**: [FR_HEAD_PL.html](DO_WKLEJENIA/FR_HEAD_PL.html), [FR_HEAD_EN.html](DO_WKLEJENIA/FR_HEAD_EN.html)

---

### 2. Open Graph — locale alternate de_DE

**Problem**: `og:locale:alternate` w HEAD_PL miał tylko `en_GB`. W HEAD_EN tylko `pl_PL`. Facebook/LinkedIn share preview nie wiedział o wersji niemieckiej.

**Fix**: Dodane:
- HEAD_PL: `<meta property="og:locale:alternate" content="de_DE">`
- HEAD_EN: `<meta property="og:locale:alternate" content="de_DE">`

HEAD_DE już miał komplet (pl_PL + en_GB) — bez zmian.

---

### 3. Image performance — loading/decoding/width/height na 12 imgach

**Problem**: 12 produkcyjnych `<img>` w plikach body_top miało braki:
- `loading="lazy"` — brak na 12 imgach (nie odraczały się ładowania below-fold)
- `decoding="async"` — brak na 6 imgach Unsplash (3 lang × 2 imgi DLA_BIZNESU + 3 imgi z GLOWNA)
- `width` + `height` — brak na wszystkich 12 (CLS shift)

To bezpośrednio wpływało na Core Web Vitals (CLS) i Lighthouse Performance.

**Fix**: Dla każdego img dodane:
```
loading="lazy"      → odracza ładowanie below-fold
decoding="async"    → nie blokuje main thread
width="1400"        → szerokość deklarowana
height="933"        → wysokość deklarowana (aspect 3:2)
```

Aspect 3:2 zgodny z Unsplash w=1400&q=80 (najczęstszy format landscape). CSS `object-fit: cover` w komponentach `.fr-narrative__media` zapewnia poprawne kadrowanie nawet jeśli rzeczywiste proporcje się różnią — różnica idzie na obcięcie, nie na distortion.

**Pliki zmienione (9)**:
- [DLA_BIZNESU_PL__body_top.html](DO_WKLEJENIA/DLA_BIZNESU_PL__body_top.html) — 2 imgi
- [DLA_BIZNESU_EN__body_top.html](DO_WKLEJENIA/DLA_BIZNESU_EN__body_top.html) — 2 imgi
- [DLA_BIZNESU_DE__body_top.html](DO_WKLEJENIA/DLA_BIZNESU_DE__body_top.html) — 2 imgi
- [OBSLUGA_NAJMU_PL__body_top.html](DO_WKLEJENIA/OBSLUGA_NAJMU_PL__body_top.html) — 3 imgi (2 IdoBooking + 1 Unsplash)
- [OBSLUGA_NAJMU_EN__body_top.html](DO_WKLEJENIA/OBSLUGA_NAJMU_EN__body_top.html) — 3 imgi
- [OBSLUGA_NAJMU_DE__body_top.html](DO_WKLEJENIA/OBSLUGA_NAJMU_DE__body_top.html) — 3 imgi
- [GLOWNA_PL__cms.html](DO_WKLEJENIA/GLOWNA_PL__cms.html) — 1 img
- [GLOWNA_EN__cms.html](DO_WKLEJENIA/GLOWNA_EN__cms.html) — 1 img
- [GLOWNA_DE__cms.html](DO_WKLEJENIA/GLOWNA_DE__cms.html) — 1 img

**Razem**: 18 imgów (12 zaktualizowane + 6 z ATRAKCJE które już miały attrs).

---

### 4. INSTRUKCJA_ZDJECIA_LOKALNIE.txt — plan migracji P26/P29 + P27 logo

**Problem (P26 UX, P29 UX)**: Strona używa 7 zdjęć stockowych z `images.unsplash.com`:
- Brak unikalności (SEO)
- Zewnętrzna zależność (perf)
- Klient nie ma kontroli nad licencją na przyszłość

**Problem (P27)**: Brak audytu rozmiaru/formatu logo. Nie kontrolujemy `<img>` (generowane przez IdoBooking template).

**Fix**: Stworzono [INSTRUKCJA_ZDJECIA_LOKALNIE.txt](DO_WKLEJENIA/INSTRUKCJA_ZDJECIA_LOKALNIE.txt) zawierającą:
- Lista 7 zdjęć z opisem czego potrzeba (apartament, panorama, biurko, spotkanie, klucze, room-ready, OG)
- Rekomendowane wymiary + aspect ratios dla każdego
- Krok-po-kroku jak wgrać przez Panel → Galeria
- Pośrednie rozwiązanie: pobrać Unsplash → wgrać do panelu (eliminuje external dependency bez konieczności fotograficznej sesji)
- Sekcja P27: audyt logo (SVG vs PNG vs JPG, rozmiar pliku, sprawdzenie via Network panel)

**Status**: BLOCKED na materiałach klienta (dla podmiany URL-i).

---

## Już naprawione przed v1.33 (weryfikacja Sprint E)

| Punkt | Co | Status | Gdzie |
|---|---|---|---|
| P5 (PDF LOW) | Brakujący cudzysłów w cytacie Karoliny | ✓ DONE | PL: `&bdquo;...&rdquo;`, EN: `&ldquo;...&rdquo;`, DE: `&bdquo;...&ldquo;` |
| P10b (PDF LOW) | Tło stopki `.footer-contact-baner` ucięte | ✓ DONE | §1755-1769 CSS — `position: static`, `width: auto`, `max-width: none` |
| P26 (PDF LOW) | Back-to-top button off-screen po prawej | ✓ DONE | §99l v1.30 — `position: fixed`, `right: 16px`, `bottom: 16px`, mobile 44×44 px |
| P28 (UX) | Empty alt na hero images | ✓ DONE | 40 img tagów × 0 z `alt=""` × 0 bez `alt` |

---

## CSS bez zmian

`FR_ARKUSZ_STYLOW.css` (368 KB, 1583 braces) — **bez modyfikacji** w v1.33.
Wszystkie zmiany v1.33 są w plikach HTML (HEAD + body_top + cms + nowa instrukcja).

---

## Akcje klienta (panel IdoBooking) — bez zmian od v1.32

Lista 8 akcji w panelu pozostaje aktywna:
1. Włączyć indeksację (noindex → index)
2. Title DE homepage
3. Title /contact (pl/en/de)
4. Menu EN "ATTRACTIONS"
5. Menu DE "KONTAKT" + "VERMIETUNGSVERWALTUNG"
6. Tel: bez spacji
7. Meta description per oferta
8. OG image https + "21 apartamentów"

Szczegóły: [AUDIT_UX_2026-05-15.md](AUDIT_UX_2026-05-15.md).

---

## Lighthouse — oczekiwana poprawa

| Metric | v1.32 expected | v1.33 expected |
|---|---|---|
| Performance | ~75-80 | **~82-87** (CLS ↓ przez width/height; LCP ↓ przez decoding async) |
| Accessibility | 100 | 100 (bez zmian) |
| Best Practices | 96 | 96 (bez zmian) |
| SEO | 85+ (jeśli klient odblokuje indeksację) | **88+** (po hreflang DE complete) |

CLS dotychczas mógł być >0.15 (poor) — z width/height powinno spaść do <0.1 (good).

---

## Wgranie do panelu — checklista

1. **HEAD PL** → Panel → Konfiguracja → SEO → HEAD (wkleić FR_HEAD_PL.html — całość)
2. **HEAD EN** → wersja EN → wkleić FR_HEAD_EN.html
3. **HEAD DE** → wersja DE → bez zmian (już aktualne)
4. **GLOWNA PL/EN/DE** → Tresci → Strona główna → CMS (wkleić zaktualizowane __cms.html)
5. **OBSLUGA NAJMU PL/EN/DE** → Tresci → Obsługa najmu → body_top (wkleić)
6. **DLA BIZNESU PL/EN/DE** → Tresci → Najem korporacyjny → body_top (wkleić)
7. **Cmd+Shift+R** po wgraniu — verify hreflang DE w View Source
8. **Lighthouse re-run** — sprawdzić CLS poprawę

---

## Status overall

| Bucket | Liczba | Status |
|---|---|---|
| Sprint E HTML fixes | 9 plików, 18 attrs | ✓ DONE |
| Sprint E nowy plik instrukcji | 1 (INSTRUKCJA_ZDJECIA_LOKALNIE) | ✓ DONE |
| Sprint E już naprawione (P5/P10b/P26/P28) | 4 verified | ✓ DONE |
| Sprint E BLOCKED na klienta (P26 UX / P29 UX / P27 logo) | 3 | 📋 INSTRUKCJA wysłana |
| CSS modifications | 0 | bez zmian (CSS nie wymagał) |

---

## Co dalej

### Sprint F (proponowane następne kroki):
1. **Po klientowskiej akceptacji INSTRUKCJA_ZDJECIA_LOKALNIE**:
   - Pobierz URL-e wgranych zdjęć z panelu
   - Podmień Unsplash linki w 5 plikach HTML
   - v1.34 — finalna eliminacja Unsplash dependency
2. **Lighthouse audit re-run** po wgraniu v1.33 (chrome-devtools MCP)
3. **Sprint D — Blog architecture decision** (BLOCKED na decyzji klienta A vs B)
4. **PD/SA tickets** dla 4 bugów template default13

---

## Zmiany w plikach

| Plik | Linie zmienione | Typ |
|---|---|---|
| FR_HEAD_PL.html | +2 (hreflang de + og:locale:alternate de) | SEO |
| FR_HEAD_EN.html | +2 (hreflang de + og:locale:alternate de) | SEO |
| DLA_BIZNESU_PL__body_top.html | 2 img attrs | Perf/CLS |
| DLA_BIZNESU_EN__body_top.html | 2 img attrs | Perf/CLS |
| DLA_BIZNESU_DE__body_top.html | 2 img attrs | Perf/CLS |
| OBSLUGA_NAJMU_PL__body_top.html | 3 img attrs | Perf/CLS |
| OBSLUGA_NAJMU_EN__body_top.html | 3 img attrs | Perf/CLS |
| OBSLUGA_NAJMU_DE__body_top.html | 3 img attrs | Perf/CLS |
| GLOWNA_PL__cms.html | 1 img attrs | Perf/CLS |
| GLOWNA_EN__cms.html | 1 img attrs | Perf/CLS |
| GLOWNA_DE__cms.html | 1 img attrs | Perf/CLS |
| INSTRUKCJA_ZDJECIA_LOKALNIE.txt | nowy plik | Dokumentacja klienta |

**Total**: 12 plików, 20+ zmian, 1 nowy plik dokumentacji.
