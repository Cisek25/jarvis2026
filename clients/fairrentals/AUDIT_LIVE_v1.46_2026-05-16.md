# Fair Rentals — Audyt LIVE v1.46 (2026-05-16)

**URL audytowane**: https://client58360.idobooking.com/ (PL/EN/DE + /contact + /news + /txt/205/Blog + /offers + /txt/204/O-nas)
**Wersja deploy**: v1.46 (wgrana w pełni — potwierdzone)
**Metoda**: Playwright MCP (browser_navigate + evaluate + screenshot, viewport 1280 + 1100 + 375)
**Audytor**: Claude Code (sesja 2026-05-16)
**Status**: ✅ Audyt zakończony — 6 fixów zaimplementowanych w [RELEASE_NOTES_v1.47.md](RELEASE_NOTES_v1.47.md)

---

## ⚠️ Update 2026-05-16 (po feedback Damian)

**Skreślone z TODO klienta**:
- ~~/contact title puste 3 jęz + description "Nazwę hotelu zmienisz w ADMINISTRACJA..."~~ — **limitacja systemowa IdoBooking (akceptujemy, nie ma sposobu nadpisać metę dla strony /contact)**

**Dodatkowe znaleziska z drugiego audytu**:
- 🔴 **DE Title homepage**: klient próbował poprawić ale wpisał bez pierwszej litery "A" → aktualnie `"partments in Breslau mieten | Fair Rentals"` (kod znaku 1: "p" = 112, nie "A" = 65). Poprawić na "**A**partments in Breslau mieten | Fair Rentals"
- 🔴 **Mapa /contact**: jest na top: 4497px (klient nie widzi bo nie scrolla tak nisko) → fix §109a v1.47
- 🔴 **/offers mobile filtry**: bug systemowy IdoBooking (`.filter_header` cursor:pointer ale brak data-toggle/onclick + jQuery.collapse nie załadowany) → fix §109b v1.47
- 🟡 **/offers "Zastosuj filtry" button**: napis niewyśrodkowany, asymetryczny padding → fix §109c v1.47
- 🟡 **O nas hero**: `.fr-page-hero` bg transparent → szary systemowy widoczny → fix §109d v1.47 (cream gradient)
- 🟡 **DE menuOverflow popup**: białe tło systemowe (`rgba(255,255,255,0.98)`) → fix §109e v1.47 (dark brand bg)
- 🟢 **Mobile grid `.fr-apt-grid`**: hardcoded 320px → fix §109f v1.47 (minmax 280px, 1fr)
- 🟢 **tel: URI ze spacją**: klient wpisał "+48 575092755" → fix §109g v1.47 (JS sanitizeTelLinks)

---

---

## TL;DR — 1 minuta

✅ **Co działa po v1.46** (deploy zakończony powodzeniem):
- Cudzysłów dekoracyjny `„` z cytatu magazine usunięty (v1.46 fix)
- Hero kicker biały na transparent (czytelny na obrazie hero)
- Powered by IdoBooking widoczny w stopce (opacity 0.85, link → idosell.com)
- Leaflet map na /contact: 1105×420, **21 markerów** (wszystkie apartamenty), 10 tiles załadowane
- Featured offer cards (6 sztuk): zdjęcia, ceny od X zł/noc, m², osoby, **href poprawne do /offer/XX/...** (cała karta to anchor)
- Blog scraper na /txt/205/Blog: hero (Baza wiedzy) + grid renderowany + 1 karta klikalna
- Mobile 375px: 0 elementów wystających za viewport
- Konsola: 0 błędów z naszego JS (jedyny error to systemowy bxSlider)

🔴 **Blokery klienta** (8 akcji niezrobionych w panelu):
1. **P0 indeksacja** — `noindex, nofollow` **podwójnie** (meta + X-Robots-Tag) na 6/6 URLs → Google jej nie zaindeksuje
2. **DE Title homepage** = polski placeholder "Wypełnij to pole tytułem twojej strony wizytówki" (Google by to wyświetlił)
3. **DE og:title + og:desc** = polskie placeholdery z panelu (Facebook by to wyświetlił)
4. **/contact title** = puste dla wszystkich 3 języków
5. **/contact og:title** = puste dla 3 języków
6. **/contact description** = polski help text z panelu ("Nazwę hotelu zmienisz w ADMINISTRACJA Dane Twojej firmy")
7. **og:description PL/EN homepage** = **STARE** "19 apartamentów / Booking 9.8" (powinno być 21 / 9.6)
8. **og:image** wszędzie `http://` (mixed content na FB/LinkedIn share)
9. **Menu EN**: Contact na **pozycji 1** (powinno 6)
10. **Menu DE**: Kontakt na **pozycji 4** (powinno 6)
11. **Tel: link**: `tel:+48 575092755` zawiera spację (RFC 3966 niezgodne — niektóre urządzenia mogą nie zadzwonić)

🆕 **Nowe znaleziska** (nie były w handoff):
- Blog post **"10 atrakcji Wroclawia, ktore musisz zobaczyc"** dodany przez klienta (2026-05-15) — **BEZ polskich znaków** w title + lead ("Wroclawiu", "ktore", "zobaczyc", "Gosci", "Wlascicieli")
- **/txt/205/Blog**: duplikacja sekcji "Baza wiedzy" — raz z naszego BLOG_LIST_PL__body_top (z polskimi znakami), raz z panelu IdoBooking (bez polskich znaków)
- **PL homepage tel format**: dwa formaty równolegle w body (`+48 575 092 755` i `+48 575092755`)
- **tel: links na PL home**: dwa różne — `tel:+48575092755` (z naszego body_top, bez spacji) i `tel:+48 575092755` (z panelu, ze spacją) — niespójność

🟡 **Otwarte (czeka na klienta)**:
- Decyzja o Małgorzacie Banaś (handoff sekcja 1) — link "O nas — Agnieszka i Małgorzata" wciąż w menu wszystkich 3 języków

---

## Szczegółowy audyt

### 1. SEO meta tags

#### PL homepage `/`
```yaml
title: "Apartamenty Wrocław na wynajem | Fair Rentals"          # OK ✅
description: "Rodzinna firma. 21 apartamentów we Wrocławiu...    # OK ✅ (21/9.6)
              Booking 9.6, Google 4.7. Zarezerwuj online."
robots: "noindex, nofollow"                                       # P0 ❌
canonical: "https://client58360.idobooking.com"                   # OK ✅
htmlLang: "pl"                                                    # OK ✅
hreflang: pl/en/de/x-default                                      # OK ✅
og:title: "Apartamenty Wrocław na wynajem | Fair Rentals"         # OK ✅
og:description: "Rodzinna firma, 19 apartamentów... Booking 9.8"  # STARE ❌
og:image: "http://client58360.idobooking.com/.../0/0/5.jpg"       # http:// ❌
og:locale: pl_PL + alt: en_GB, de_DE                              # OK ✅
twitter:image: "https://.../0/0/8.jpg"                            # OK ✅ (https + Bulwary Odry)
```

#### EN homepage `/en`
```yaml
title: "Apartments for rent in Wrocław | Fair Rentals"            # OK ✅
description: "Family-run company. 21 short-term apartments..."    # OK ✅ (21/9.6)
robots: "noindex, nofollow"                                       # P0 ❌
htmlLang: "en"                                                    # OK ✅
canonical: "https://client58360.idobooking.com/en/"               # OK ✅
og:description: "Family-run, 19 apartments... Booking 9.8"        # STARE ❌
og:image: "http://..."                                            # http:// ❌
```

#### DE homepage `/de` 🚨
```yaml
title: "Wypełnij to pole tytułem twojej strony wizytówki"         # ❌ POLSKI PLACEHOLDER
description: "Familienunternehmen. 21 Apartments in Breslau..."   # OK ✅ (21/9.6)
robots: "noindex, nofollow"                                       # P0 ❌
htmlLang: "de"                                                    # OK ✅
canonical: "https://client58360.idobooking.com/de/"               # OK ✅
og:title: "Wypełnij to pole tytułem twojej strony wizytówki"      # ❌ POLSKI PLACEHOLDER
og:description: "To pole wypełnij krótkim opisem..."              # ❌ POLSKI PLACEHOLDER
og:image: "http://..."                                            # http:// ❌
og:locale: de_DE                                                  # OK ✅
```

#### /contact (3 jęz) 🟢 AKCEPTUJEMY (limitacja IdoBooking)
```yaml
PL/EN/DE wszystkie:
  title: ""                                                       # ~~PUSTE~~ — system nie pozwala
  description: "Nazwę hotelu zmienisz w ADMINISTRACJA..."         # ~~POLSKI HELP~~ — system nie pozwala
  ogTitle: ""                                                     # ~~PUSTE~~ — system nie pozwala
  ogImage: "http://..."                                           # http:// — to dziedziczy z homepage OG
  telLink: "tel:+48 575092755"                                    # spacja → naprawiamy JS w v1.47
```
**Decyzja zespołu**: IdoBooking nie udostępnia edycji meta tagów dla strony /contact.
Akceptujemy ten stan we wszystkich projektach IdoBooking (nie tylko Fair Rentals).

#### Indeksacja (P0)
Wszystkie 6 sprawdzonych URLs zwracają **podwójną blokadę**:
- Meta `<meta name="robots" content="noindex, nofollow">`
- HTTP header `X-Robots-Tag: noindex, nofollow`

Sprawdzone URLs:
- `/` → 200, noindex
- `/pl/` → 301 → `/`, noindex
- `/en/` → 301 → `/en`, noindex
- `/de/` → 301 → `/de`, noindex
- `/contact` → 200, noindex
- `/news` → 200, noindex (klient uruchomił moduł!)

→ **Klient MUSI** odznaczyć "Strona w wersji deweloperskiej" w Panel → Konfiguracja → SEO. Inaczej Google nigdy nie zaindeksuje.

---

### 2. Menu order (P1)

#### EN menu (powinno być: Apartments, Offer, Corporate, Short-term, Blog, About, Attractions, Contact = poz.8 lub poz.6)
```
Aktualnie (pozycja → link):
1. Contact            ← ❌ powinna być ostatnia
2. Offer
3. Corporate housing
4. Short-term rental management
5. Fair Rentals blog
6. About us — Agnieszka and Małgorzata
7. Wrocław attractions
```

#### DE menu (powinno: Unterkünfte/Offers, Firmen, Sehenswürdigkeiten, Kurzzeit, Blog, Über uns, Kontakt = poz.7)
```
Aktualnie:
1. Unterkünfte (Offer)
2. Firmenapartments
3. Sehenswürdigkeiten
4. Kontakt            ← ❌ powinna być ostatnia
5. Kurzzeit-Mietverwaltung
6. Fair Rentals Blog
7. Über uns — Agnieszka und Małgorzata
```

Klient musi przesunąć Contact/Kontakt w Panel → Wygląd → Menu → drag & drop na pozycję 6-7.

---

### 3. Tel format (P1)

#### Co w panelu (źródło problemu):
Klient wpisał `+48 575092755` (ze spacją po `+48`) jako numer w Dane firmy. To pole zasila zarówno:
- Visible tekst w stopce/contact
- `tel:` link

#### Wynik na stronie:

| Lokalizacja | Format wyświetlany | tel: link |
|------------|---------------------|-----------|
| Stopka PL home | `+48 575 092 755` (3 grupy 3-cyfrowe) | `tel:+48575092755` (bez spacji — nasz body_top) |
| Stopka PL home (drugi tel) | `+48 575092755` (z panelu) | `tel:+48 575092755` (ze spacją — z panelu) |
| /contact | `+48 575092755` | `tel:+48 575092755` (ze spacją) |
| Blog page | `+48 575092755` | `tel:+48 575092755` (ze spacją) |

Trzy problemy:
1. **Niespójność formatów** w body (3 wersje w tym samym pliku)
2. **tel: link ma spację** (`tel:+48 575092755`) — RFC 3966 mówi że tel: URI nie powinien zawierać whitespace
3. **Klient mógł nie zrozumieć** o co chodziło w handoff (visible vs URI)

Sugestia ujednolicenia (do potwierdzenia z klientem):
- Wizualnie: `+48 575 092 755` (3 grupy, czytelne) — wszędzie w body
- tel: URI: `tel:+48575092755` (bez spacji) — RFC compliant
- W panelu Dane firmy: wpisać **bez spacji** `+48575092755`, my w body_top/CSS wyświetlimy z formatowaniem `+48 575 092 755`

---

### 4. v1.46 fixy — weryfikacja live

| Fix | Status | Weryfikacja |
|-----|--------|-------------|
| Magazine cudzysłów `„` usunięty | ✅ | `.fr-magazine__mark` brak w DOM, `.fr-magazine__quote` text bez znaku otwierającego |
| Hero kicker contrast | ✅ | color `rgb(255,255,255)`, font-weight 600, na transparent bg (hero image) |
| Leaflet invalidateSize | ✅ | /contact: 1105×420, 10 tiles loaded, **21 markers** |
| Featured offers (.container-hotspot hidden + custom cards) | ✅ | hotspot `display: none`, 6 fr-apt-card visible z href, cenami, m², osobami |
| Blog scraper (/news → /txt/205/Blog) | ✅ | 1 karta z href `/news/1/...`, klikalna |
| Powered by IdoBooking visible | ✅ | opacity 1.0, display flex, link idosell.com, width 120×22 |
| fixCanonicalToPage | ✅ | canonical clean dla / i /en (DE: `/de/` — z trailing slash, ale URL bez) |
| fixHtmlLangFromUrl | ✅ | htmlLang poprawny dla wszystkich 3 jęz |

---

### 5. Blog post (nowe znalezisko)

Klient dodał **1 post** w Panel → Wygląd → Aktualności (2026-05-15):

```yaml
URL: /news/1/10-atrakcji-Wroclawia-ktore-musisz-zobaczyc
Title: "10 atrakcji Wroclawia, ktore musisz zobaczyc"
       (❌ BEZ polskich znaków: "Wroclawia" zamiast "Wrocławia",
                                  "ktore" zamiast "które",
                                  "zobaczyc" zamiast "zobaczyć")
Lead: "Subiektywny przewodnik gospodarza po Wroclawiu.
       Co warto zobaczyc, kiedy najlepiej i jak dotrzec."
       (❌ także "Wroclawiu", "zobaczyc", "dotrzec")
Data: 2026-05-15
Język: PL only (brak wersji EN, DE)
```

**Problemy**:
1. Brak polskich znaków w title (SEO + UX — Google indeksuje "Wroclawia" jako osobne słowo od "Wrocławia")
2. URL slug bez polskich znaków OK (system IdoBooking nie zezwala na ą/ć/ę/ł)
3. Brak wersji EN/DE — przy indeksacji ON Google zobaczy PL-only post w sekcji EN/DE (mixed lang signal)
4. **Duplikacja na /txt/205/Blog**: nasza sekcja "Baza wiedzy" (z polskimi znakami) renderuje się **przed** sekcją z panelu IdoBooking ("BAZA WIEDZY Praktyczna wiedza z prowadzenia 21 apartamentow we Wroclawiu") → dwie sekcje z prawie tym samym tekstem

---

### 6. Mobile 375×667

```yaml
overflow: 0 elementów wystających za viewport ✅
body.scrollWidth: 375
body.clientWidth: 360  (15px różnica — scrollbar)
hero:
  width: 360 ✅
  height: 1203px  (fullpage.js section — duża, OK)
fr-apt-grid:
  grid-template-columns: "320px"  🟡 hardcoded
  → karta 320px na 360px viewport = 20px margin po bokach
  → na iPhone SE (320px) zostanie 0px margin lub wycieknie
mobileBurger: nie znaleziony domyślnymi selektorami
  (może ma własną klasę .menu-toggler? — wymaga sprawdzenia)
```

Screenshot zapisany: `.playwright-mcp/fairrentals-mobile-375.jpeg`

---

### 7. Console errors

PL homepage:
- **10 LOG-ów** systemowych (`mode:all selector:#navbar...` itd. — init template default13)
- **1 WARNING + 1 ERROR**: `$(...).bxSlider is not a function` z `widget/script/loadScriptsForFrontpage/lang/pl/action/index:417`
  - To bug systemu IdoBooking template default13 (próbuje załadować bxSlider plugin który nie istnieje w vendor_app.js)
  - Nie wpływa na funkcjonalność: nasze custom karty (.fr-apt-card) renderują się poprawnie przez Slick (slick działa, bxSlider to alternatywny carousel którego system nie znalazł)
  - **Może wpłynąć na PageSpeed score** (Lighthouse penalizuje console errors)

**Nasz JS — 0 błędów ✅** (fix functions, blog scraper, leaflet fix, canonical fix — wszystko działa cicho)

---

## Pytania do klienta (Agnieszka Banaś)

### 🔴 Krytyczne (blokują SEO/marketing)

1. **Kiedy włączysz indeksację?** (Panel → Konfiguracja → SEO → odznacz "Strona w wersji deweloperskiej")
   - Wszystko inne jest gotowe, ale dopóki tego nie zrobisz, Google nie pokazuje strony

2. **Title strony niemieckiej** ⚠️ **PRAWIE OK** (Panel → Wygląd → Strona wizytówki DE → pole Title)
   - Obecnie: **"partments in Breslau mieten | Fair Rentals"** (BRAK pierwszej litery "A"!)
   - Klient wpisał ale przegapił/uciął pierwszą literę
   - Poprawić na: "**A**partments in Breslau mieten | Fair Rentals"

3. **OG description PL + EN** (Panel → Konfiguracja → SEO → OG Description)
   - Obecnie: "19 apartamentów / Booking 9.8" (stare)
   - Proponowany: zsynchronizować z meta description ("21 apartamentów / Booking 9.6")

4. **OG image https://** (Panel → Konfiguracja → SEO → OG Image)
   - Obecnie: `http://...` (mixed content)
   - Trzeba ponownie wgrać/wybrać → automatycznie idzie https

5. ~~**Title strony /contact (3 jęz)**~~ — **AKCEPTUJEMY** (IdoBooking nie pozwala edytować meta dla /contact)

6. ~~**Description strony /contact**~~ — **AKCEPTUJEMY** (jak wyżej)

### 🟡 Średnie

7. **Menu EN**: przesuń "Contact" z pozycji 1 na 6-7 (Panel → Wygląd → Menu EN)
8. **Menu DE**: przesuń "Kontakt" z pozycji 4 na 6-7 (Panel → Wygląd → Menu DE)
9. **Telefon**: ujednolicić — zmień w panelu Dane firmy z `+48 575092755` (ze spacją) na `+48575092755` (bez spacji). Visible format obsłużymy w body_top/CSS.

### 🟢 Niskie / pomocnicze

10. **Blog post "10 atrakcji"** (Panel → Wygląd → Aktualności → edytuj post #1):
    - Dopisać polskie znaki: "10 atrakcji **Wrocławia, które** musisz **zobaczyć**"
    - Lead też: "Subiektywny przewodnik gospodarza po **Wrocławiu**. Co warto **zobaczyć**, kiedy najlepiej i jak **dotrzeć**."
    - Czy będzie wersja EN i DE postu?

11. **Strona /txt/205/Blog (Panel → Wygląd → Edytor stron)**:
    - Klient wpisał kontent w polu Treść strony (sekcja "BAZA WIEDZY Praktyczna wiedza z prowadzenia 21 apartamentow we Wroclawiu...")
    - Nasz BLOG_LIST_PL__body_top **już zawiera tę sekcję** (z polskimi znakami) → duplikacja
    - Opcje: A) Wyczyścić pole Treść w panelu; B) Zostawić, my usuniemy hero z BLOG_LIST_PL (ale klient ma tekst bez polskich znaków)
    - **Rekomendacja A** (czystsze, polskie znaki)

12. **Małgorzata Banaś** (handoff sekcja 1):
    - Czekam na decyzję A/B/C
    - Link "O nas — Agnieszka i Małgorzata" wciąż w menu wszystkich 3 jęz

---

## Co do tej sesji (ja, Damian)

**Mogę zrobić bez czekania na klienta:**
- ❌ Nic w panelu klienta nie ruszam (nie mam dostępu)
- ✅ Mogę przygotować poprawki dla pliku statycznego:
  - Ujednolicić tel: linki w body_top/JS na `tel:+48575092755` (bez spacji) → wymusi że wszystkie linki na stronie używają poprawnego URI niezależnie od tego co w panelu
  - Zmienić mobile grid z `320px` na `1fr` (lub `minmax(280px, 1fr)`) — fix dla iPhone SE
  - Dodać do JS workaround usuwający duplikatową sekcję "BAZA WIEDZY" na /txt/205/Blog jeśli klient nie wyczyści (defensive)

**Czekam na klienta:**
- Decyzja Małgorzata A/B/C
- Lista 8 akcji w panelu (kiedy zrobi)
- Czy chce wersję EN/DE blog posta

---

## Linki

- Strona live PL: https://client58360.idobooking.com/
- Strona live EN: https://client58360.idobooking.com/en
- Strona live DE: https://client58360.idobooking.com/de
- /contact PL: https://client58360.idobooking.com/contact
- /news (lista): https://client58360.idobooking.com/news
- Post #1: https://client58360.idobooking.com/news/1/10-atrakcji-Wroclawia-ktore-musisz-zobaczyc
- Blog list: https://client58360.idobooking.com/txt/205/Blog

**Handoff source**: [HANDOFF_2026-05-16.md](HANDOFF_2026-05-16.md)
**Tickets PD/SA**: [IDOBOOKING_TICKETS_2026-05-15.md](IDOBOOKING_TICKETS_2026-05-15.md)
**Screenshot mobile**: `.playwright-mcp/fairrentals-mobile-375.jpeg`
