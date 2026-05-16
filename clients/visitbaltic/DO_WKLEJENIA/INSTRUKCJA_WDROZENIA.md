# Visit Baltic — Instrukcja wdrożenia v1.0

**Data:** 2026-05-16
**Wersja:** v1.0 (szkielet)
**Klient:** visit baltic Beata Barkas, Świnoujście
**Engine IdoBooking:** `engine16580.idobooking.com`
**Domena:** `visitbaltic.pl`

---

## 🎯 CO ZAWIERA v1.0

Szkielet techniczny dla strony głównej (PL) — fundamenty, na których budujemy kolejne podstrony i języki.

### Pliki w tej wersji
| Plik | Zawartość | Status |
|---|---|---|
| `VB_ARKUSZ_STYLOW.css` | Theme miodowy (~1100 linii L3) | ✅ gotowy |
| `VB_HEAD_PL.html` | Meta + fonts + GTM/GA + schema | ✅ gotowy |
| `VB_KONIEC_BODY.html` | 9 modułów JS | ✅ gotowy |

### Czego JESZCZE NIE MA (na przyszłe iteracje)
- `GLOWNA_PL__cms.html` — sekcje CMS strony głównej (v1.1)
- `VB_HEAD_EN.html`, `VB_HEAD_DE.html` — tłumaczenia (v1.9, v1.10)
- Podstrony: O Nas, FAQ, Atrakcje, Blog, Kontakt, Dla Biznesu (v1.4–v1.8)
- Adobe Stock zdjęcia hero + atrakcje (v1.1)
- Mapa Airbnb-style z Leaflet (v1.10+)
- Litepicker test live (v1.3 — wymaga deploy żeby zobaczyć)

---

## 📋 KOLEJNOŚĆ WKLEJANIA (~15 min)

### Krok 1 — CSS edytor (najpierw L1 + L2, potem L3)

Panel: **Wygląd → Edytor CSS**

**Wklej w tej kolejności w JEDEN textarea** (kaskada CSS = ostatni wygrywa):

1. Zawartość `jarvis2026/library/css/layer1-traps.css` (2122 linii — bug-fixy IdoBooking)
2. Zawartość `jarvis2026/library/css/layer2-components.css` (961 linii — komponenty ido-*)
3. Zawartość `VB_ARKUSZ_STYLOW.css` (~1100 linii — theme miodowy)

**Łącznie:** ~4180 linii CSS w panelu.

> Alternatywnie: użyj skryptu mergera (TBD w v1.1) który zrobi jeden plik VB_FINAL.css

### Krok 2 — HEAD PL

Panel: **Ustawienia → HEAD** (wersja **Polski**)

1. **WYCZYŚĆ** obecną zawartość HEAD (skopiuj sobie backup do notatki na wszelki wypadek)
2. Wklej całą zawartość `VB_HEAD_PL.html`
3. Zapisz

**⚠️ Co zostało naprawione vs. obecny HEAD:**
- Zdublowany tag GA `G-SB57T7EBJZ` (był 2× — usunięty duplikat)
- CSS hack dla `iai_location` przeniesiony do `VB_ARKUSZ_STYLOW.css §4` (już nie trzeba go w HEAD)

**⚠️ Co zostało zachowane:**
- GTM `AW-16616472794` (Google Ads conversion)
- GA `G-SB57T7EBJZ` (Analytics) — teraz pojedynczo

**Co dodaliśmy nowego:**
- Google Fonts: Fraunces + Inter + Manrope
- Litepicker CSS (CDN)
- Leaflet CSS (preload na v1.10 — mapa)
- Pełne meta (description, keywords, geo, hreflang, OG, Twitter, schema.org LodgingBusiness)
- Favicon (fallback do logo)

### Krok 3 — KONIEC BODY

Panel: **Ustawienia → Koniec BODY**

1. **WYCZYŚĆ** obecną zawartość Koniec BODY
2. Wklej całą zawartość `VB_KONIEC_BODY.html`
3. Zapisz

**⚠️ Co zostało zachowane (zmodernizowane):**
- Hack `.iailocation-district` (ukrywanie licznika ofert) — teraz w bezpieczniejszej formie
- Botsonic chatbot — **naprawiony** (był urwany `</script>`)

**Co dodaliśmy:**
- §3 Hero teleport do `.section.parallax` (CRITICAL-O / CRITICAL-AA)
- §4 Builder wyróżnionych ofert (pattern MADERA/NAJMAR)
- §5 Auto-galeria z `/strony/galeria`
- §6 Auto-lista dzielnic (32 dzielnice → pills)
- §7 Sticky header on scroll
- §8 Smooth scroll + ESC dla modali
- §9 Lazy image observer (performance)

### Krok 4 — Test bazowy

Otwórz `https://visitbaltic.pl` w trybie incognito (żeby nie cache'ować).

**Sanity check (5 min):**
- [ ] Strona ładuje się bez błędów konsoli (F12 → Console)
- [ ] Logo + menu widoczne, kolory miodowe (#ECAF09)
- [ ] Font heading = Fraunces (serif), body = Inter (sans)
- [ ] Hero parallax slider działa
- [ ] Search widget — kliknij i otwórz Litepicker
- [ ] Litepicker — sprawdź czy dni mają zielone/czerwone tła + ukośne
- [ ] Wyróżnione oferty — widzisz karty `.vb-offer-card` (zamiast slick carousel)?
- [ ] Footer — granat morski (#3E475E), żółte linki, kompaktowy `powered_by`
- [ ] Botsonic chatbot — pojawia się w prawym dolnym rogu

**Jeśli sekcja wyróżnionych ofert NIE BUDUJE kart:**
Potrzeba sekcji CMS z `<div class="vb-featured__grid"></div>` — to dodamy w v1.1.
Na razie systemowy `.container-hotspot` jest **ukryty CSS-em** (`display: none !important`), więc strona główna może wyglądać uboższa niż przedtem — to oczekiwane.

### Krok 5 — Backup

**Przed kolejną iteracją** (v1.1):
1. Skopiuj zawartość HEAD/BODY/CSS z panelu do plików `BACKUP_v1.0_HEAD.html`, `BACKUP_v1.0_BODY.html`, `BACKUP_v1.0_CSS.css` w folderze klienta
2. Zrób git commit: `feat(visitbaltic): v1.0 — szkielet CSS/HEAD/BODY`

---

## 🐛 ZNANE OGRANICZENIA v1.0

1. **Brak GLOWNA_PL__cms.html** — sekcje CMS strony głównej dodajemy w v1.1. Obecnie sekcje CMS klientki (np. "Strona O nas" z panelu) zostają takie jak są.

2. **Wyróżnione oferty wymagają fallback HTML** — w v1.1 dodamy do `GLOWNA_PL__cms.html` element `<div class="vb-featured__grid"></div>`. Bez tego JS nie ma gdzie wstawić kart.

3. **Galeria wymaga zdjęć w panelu** — klientka musi wgrać zdjęcia do "Galerie → Galeria na stronie głównej". JS pobiera je z `/strony/galeria` i renderuje.

4. **Tylko polska wersja językowa** — EN/DE dodajemy w v1.9/v1.10.

5. **Brak custom CMS sekcji home** — hero, USP, sekcja "Świnoujście", featured offers, gallery, CTA, footer modules — będą w v1.1.

6. **Litepicker mobile bottom-sheet** — kod CSS gotowy w `§10 RESPONSIVE`, ale wymaga testu na rzeczywistym urządzeniu po deploy v1.0.

7. **Mapa Airbnb-style** — zaplanowana na v1.10+. Wymaga geokodowania 32 dzielnic (one-time setup) + Leaflet init.

---

## 📊 METRYKI v1.0 (do sprawdzenia po deploy)

Po wklejeniu zmierz w PageSpeed Insights ([pagespeed.web.dev](https://pagespeed.web.dev/)):

| Metryka | Cel v1.0 | Cel v1.4 (po optymalizacji) |
|---|---|---|
| Performance (mobile) | ≥ 70 | ≥ 85 |
| Performance (desktop) | ≥ 85 | ≥ 95 |
| Accessibility | ≥ 90 | ≥ 95 |
| Best Practices | ≥ 90 | ≥ 95 |
| SEO | ≥ 90 | 100 |
| LCP | < 2.5s | < 1.8s |
| CLS | < 0.1 | < 0.05 |

---

## 🚦 NASTĘPNE ITERACJE

- **v1.1** — `GLOWNA_PL__cms.html` (hero, USP, featured offers fallback, gallery, districts, CTA)
- **v1.2** — Adobe Stock fotki hero (5 sztuk) + zdjęcia atrakcji (10 sztuk) — czeka na assety od klientki
- **v1.3** — Litepicker live test + tuning
- **v1.4** — `O_NAS_PL__body_top.html` + ścieżka URL
- **v1.5** — `ATRAKCJE_SWINOUJSCIA_PL__body_top.html` (10 atrakcji)
- **v1.6** — `FAQ_PL__body_top.html`
- **v1.7** — `KONTAKT_PL__body_top.html` + Google Maps embed
- **v1.8** — Blog: `BLOG_LIST_PL__body_top.html` + 3 pierwsze posty + 10 outlines
- **v1.9** — EN translation komplet
- **v1.10** — DE translation komplet + mapa Airbnb-style z Leaflet (price markers)
- **v1.11** — Mobile audit (Puppeteer screenshoty na 5 viewportów)
- **v1.12** — WCAG audit + fixes
- **v1.13** — SEO audit + sitemap.xml
- **v1.14** — Performance (WebP konwersja, critical CSS inline) + handoff

---

## 🆘 W RAZIE PROBLEMÓW

**CSS nie działa / strona wygląda jak przed?**
→ Sprawdź czy wkleiłeś wszystkie 3 warstwy CSS (L1+L2+L3) w poprawnej kolejności

**Litepicker bez kolorów?**
→ Plugin Litepicker CSS musi być w HEAD przed VB_ARKUSZ_STYLOW.css — sprawdź `<link href=".../litepicker.css">`

**Brak fontu Fraunces?**
→ Sprawdź czy preconnect do fonts.googleapis.com nie jest blokowany (sieć korporacyjna?)

**Wyróżnione oferty pokazują pustą sekcję?**
→ Brak `.vb-featured__grid` w CMS strony głównej — dodamy w v1.1

**Botsonic nie pojawia się?**
→ Sprawdź czy ad-blocker nie blokuje skryptu `widget.botsonic.com`

**Pytania techniczne / bugi:**
→ Otwórz nową sesję Claude z plikami z tego folderu — ja (lub kolejna sesja) ogarniem

---

## 📁 STRUKTURA FOLDERU

```
clients/visitbaltic/
├── DO_WKLEJENIA/                ← Pliki dla klientki (JEDYNE które idą do panelu)
│   ├── VB_ARKUSZ_STYLOW.css     ← v1.0 ✅
│   ├── VB_HEAD_PL.html          ← v1.0 ✅
│   ├── VB_KONIEC_BODY.html      ← v1.0 ✅
│   ├── INSTRUKCJA_WDROZENIA.md  ← v1.0 ✅
│   └── (kolejne pliki v1.1+...)
├── zdjecia/                      ← Adobe Stock + materiały klientki
│   ├── hero/                     ← 5 zdjęć hero rotation
│   ├── atrakcje/                 ← 10 zdjęć atrakcji
│   ├── lifestyle/                ← Dodatkowe nastrojowe
│   └── blog/                     ← Per artykuł blogowy
└── RELEASE_NOTES_v1.0.md         ← v1.0 ✅
```

---

**Powodzenia z wdrożeniem v1.0!** 🦭🌊
