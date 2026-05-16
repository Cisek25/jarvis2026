# Sprint D — Decyzja architektury Blog/Baza wiedzy

**Data**: 2026-05-15
**Status**: BLOCKED na decyzji klienta
**Drafter**: Damian Cisowski (IAI) — analiza trade-off + rekomendacja
**Klient**: Agnieszka Barańska (Fair Rentals)

---

## Cel sekcji "Blog / Baza wiedzy"

Z poprzednich rozmów + analizy strony:

### Treści które klient chce publikować (3 segmenty):
- **Dla Gości** — przewodniki po Wrocławiu, "co zwiedzić", "gdzie zjeść", FAQ rezerwacji, sezonowe oferty
- **Dla Właścicieli** — case studies, modele współpracy (8%/10%), "ile zarobisz na najmie", testimonials
- **Dla Firm** — najem korporacyjny, długoterminowy, dokumenty rozliczeniowe, dlaczego Fair Rentals

### Cele biznesowe:
1. **SEO long-tail**: kierowanie ruchu organicznego z fraz typu "co zwiedzić we Wrocławiu z dziećmi", "najem korporacyjny Wrocław koszty"
2. **Lead nurturing**: budowanie zaufania zanim gość/właściciel zarezerwuje
3. **Brand authority**: pozycjonowanie Fair Rentals jako eksperta od wynajmu krótkoterminowego we Wrocławiu

### Skala startowa (założenia):
- 3-5 artykułów na start (do 3 miesięcy)
- 1-2 nowe artykuły miesięcznie (Agnieszka = solo, ograniczony czas)
- Docelowo: 20-30 artykułów w ciągu 1.5 roku

---

## OPCJA A — Custom JS + podstrony IdoBooking

### Jak to działa
- Każdy artykuł = osobna podstrona w panelu IdoBooking (`/txt/300`, `/txt/301`, ...)
- Lista artykułów (kategorie, tagi) generowana **client-side** przez JS
- JS odpytuje API `/txt/*` lub czyta zhardcodowany manifest JSON
- Karta artykułu = standardowy nasz komponent (hero + content)

### Architektura techniczna
```
client58360.idobooking.com/
├── /pl/blog                     ← strona-lista (custom JS rendering)
│   └── pobiera JSON manifest:
│       /pl/blog-manifest.json   ← lista postów + meta
├── /pl/txt/300/post-tytul-1     ← konkretny post (CMS IdoBooking)
├── /pl/txt/301/post-tytul-2
└── ...
```

### Plusy ✅
1. **Jeden system** — wszystko w panelu IdoBooking (jedno logowanie, jeden backup)
2. **Brak dodatkowych kosztów** — używamy istniejącej infry (0 zł/miesiąc)
3. **SEO autorytet** — wszystkie artykuły dziedziczą domain authority client58360.idobooking.com (lub własna domena fairrentals.pl jeśli kiedyś podłączymy)
4. **Bez nowego frameworka** — wykorzystujemy istniejący CSS + JS stack (Fair Rentals brand identity zachowana)
5. **Szybka implementacja** — ~7 dni roboczych (CSS + JS + 3 pierwsze szablony)
6. **Bez DNS/SSL gymnastiki** — zostaje na obecnej domenie

### Minusy ❌
1. **CMS IdoBooking jest ograniczony do blog use case**:
   - ❌ Brak natywnych kategorii/tagów (tylko numeryczne `/txt/300`)
   - ❌ Brak natywnego autora (nie ma profilu Agnieszki Schema.org Person)
   - ❌ Brak natywnej daty publikacji w meta
   - ❌ Brak natywnego "related posts"
   - ❌ Brak natywnego RSS
   - ❌ Brak natywnego sitemap.xml dla blog posts (Google musi dyskaverować przez wewnętrzne linki)
   - ❌ Brak natywnego featured image API (hack przez HTML)
2. **Edytor treści ograniczony** — IdoBooking CMS WYSIWYG ma podstawowe formatowanie, brak Markdown, brak komponentów typu "highlight box", "callout"
3. **Brak draftów / scheduling** — artykuł publikuje się od razu
4. **Client-side rendering listy** = JavaScript dependency
   - Google indeksuje JS-rendered content ale z opóźnieniem (3-7 dni do crawl)
   - Slower TTFB niż SSR
5. **Manualne tworzenie każdej podstrony** — Agnieszka musi pamiętać: stwórz `/txt/X` → wklej HTML → dodaj do JSON manifest
6. **Brak komentarzy / social sharing** — wymaga osobnego custom code
7. **Skalowanie problematyczne** — przy 30+ artykułach panel IdoBooking staje się zagracony, brak filtrowania w admin

### Effort & koszty
| Pozycja | Czas | Koszt |
|---|---|---|
| CSS komponenty (lista, karta, post hero) | 8h | — |
| JS manifest reader + filtering | 6h | — |
| 3 początkowe artykuły (templates + treść) | 8h | — |
| Onboarding Agnieszki (jak dodać post) | 2h | — |
| Dokumentacja procesu publikacji | 2h | — |
| **Razem startowo** | **~26h** | 0 zł |
| Maintenance miesięcznie | 1-2h/miesiąc | 0 zł |

---

## OPCJA B — WordPress na subdomenie blog.fairrentals.pl

### Jak to działa
- WordPress instalacja na `blog.fairrentals.pl` (subdomena DNS CNAME do hostingu)
- Custom theme dopasowany do Fair Rentals brand identity (gold, ciepłe wnętrza, DM Serif Display + Inter)
- Header/footer matching główną stronę (cross-linking)
- 1 link "Blog" w głównym menu IdoBooking → wychodzi na subdomenę

### Architektura techniczna
```
fairrentals.pl (lub client58360.idobooking.com)
│
└── menu "Blog" → linkuje do:
    └── blog.fairrentals.pl
        ├── /                     ← lista (paginated, kategoryzowana)
        ├── /kategoria/dla-gosci  ← native taxonomy
        ├── /kategoria/dla-wlascicieli
        ├── /kategoria/dla-firm
        ├── /2026/05/tytul-postu  ← native permalink
        └── /author/agnieszka-baranska  ← native author profile
```

### Plusy ✅
1. **Standard branżowy** — najpopularniejsza platforma do blogowania (40%+ webu)
2. **Natywne features blogowe**:
   - ✅ Kategorie + tagi
   - ✅ Autorzy z profilami (Schema.org Person markup)
   - ✅ Daty publikacji + ostatniej modyfikacji
   - ✅ Featured images (responsive srcset + lazy loading natywne)
   - ✅ Related posts (plugin)
   - ✅ RSS feed natywny
   - ✅ Sitemap.xml automatyczny (Yoast/RankMath)
   - ✅ Schema.org BlogPosting markup
   - ✅ Drafts + scheduled publishing
   - ✅ Revisions (historia zmian)
3. **Edytor Gutenberg** — bloki, embedy YouTube/Maps, callouts, kolumny
4. **SEO ekosystem**:
   - Yoast / RankMath = automatyczne meta + struktura
   - Server-side rendering = optymalny crawl
   - WP Rocket / W3 Total Cache = perfomance
5. **Łatwe skalowanie** — 100+ artykułów bez problemu
6. **Plugin ecosystem** — komentarze (Disqus / native), AMP, social sharing, newsletter (Mailchimp), analytics
7. **Cross-linking** z głównym sajtem przez menu/footer = wzmocnienie domain authority obu stron

### Minusy ❌
1. **Subdomena vs główna domena** — SEO authority partially split
   - Subdomeny są traktowane przez Google jako osobne site'y (kontrowersyjne, Google twierdzi że nie ale empirycznie tak)
   - Workaround: konsekwentny cross-linking + spójna marka
   - Alternatywa: `fairrentals.pl/blog` jako subdirectory (lepiej SEO) ale wymaga proxy/reverse proxy lub innego CMSa
2. **Dwa systemy do zarządzania** — WordPress admin + IdoBooking panel
   - Dwa loginy, dwa hasła do zarządzania
   - Dwa backupy, dwa cykle aktualizacji
   - Dwa różne UX/UI dla Agnieszki
3. **Hosting + domena**:
   - Subdomena `blog.fairrentals.pl` wymaga że klient ma własną domenę (nie zaobserwowane na liście — sprawdź)
   - Jeśli klient nie ma — trzeba kupić `fairrentals.pl` ~50 zł/rok
   - Managed WordPress hosting (Cyberfolks/MyDevil/Zenbox): ~30-80 zł/miesiąc
   - SSL: free (Let's Encrypt przez hosting)
4. **WordPress security overhead**:
   - Regularne aktualizacje (~co miesiąc)
   - Plugin updates
   - Backup management
   - Anti-malware (Wordfence plugin)
   - = ~1-2h/miesiąc maintenance albo płatny managed service
5. **Custom theme effort** — żeby blog wyglądał spójnie z Fair Rentals identity:
   - Hero z paletą gold/cream
   - DM Serif Display + Inter
   - Logo Fair Rentals w headerze
   - Stopka identyczna z główną stroną
   - ~15-20h custom theme dev
6. **Onboarding Agnieszki** — uczenie się Gutenberg + admin WP

### Effort & koszty
| Pozycja | Czas | Koszt jednorazowy | Koszt miesięczny |
|---|---|---|---|
| Setup hosting + domena | 2h | 50 zł/rok (domena) | 30-80 zł/m |
| WordPress install + security hardening | 3h | — | — |
| Custom theme dopasowany do Fair Rentals | 15-20h | — | — |
| Plugin config (Yoast, security, performance) | 4h | — | — |
| 3 początkowe artykuły (migracja + setup) | 8h | — | — |
| Onboarding Agnieszki Gutenberg + admin WP | 4h | — | — |
| Dokumentacja procesu publikacji | 2h | — | — |
| **Razem startowo** | **~38-43h** | ~50 zł | **30-80 zł/m** |
| Maintenance miesięcznie | 1-2h/m | — | 30-80 zł/m |

---

## OPCJA C — Hybrid (proposed)

### Jak to działa
- **Start z Opcją A** (custom JS + podstrony IdoBooking) na **pierwsze 3-5 artykułów**
- Obserwuj traffic, engagement, zadowolenie Agnieszki przez **3-6 miesięcy**
- Jeśli któreś z poniższych = TRUE, **migruj do Opcji B**:
  - Blog ma 10+ artykułów aktywnie utrzymywanych
  - Agnieszka chce więcej narzędzi (drafty, scheduling, kategorie)
  - SEO traffic z bloga > 30% całkowitego traffic'u
  - Chcemy dodać newsletter / komentarze / serie artykułów

### Plusy
- **Niskie ryzyko**: zaczynamy tanio, sprawdzamy hipotezę
- **Fast time-to-market**: 7 dni vs 30 dni dla WP
- **Brak vendor lock-in**: artykuły jako HTML są łatwe do migracji do WP później
- **Najlepsze z obu**: A jako MVP, B jako skala

### Minusy
- **Podwójna praca**: jeśli migrujemy, musimy zmigrate treść (manual lub import)
- **Decision delay**: odraczamy decyzję, nie eliminujemy
- **Sunk cost**: 26h startowo + ewentualnie kolejne 40h przy migracji

### Effort & koszty (jeśli migrujemy po 6 miesiącach)
| Faza | Czas | Koszt |
|---|---|---|
| Faza 1 (Opcja A) | 26h | 0 zł |
| Maintenance 6m | 6-12h | 0 zł |
| Faza 2 (migracja do Opcja B) | 35-40h (mniej onboardingu) | 50 zł + 30-80/m |
| **Razem (1.5 roku)** | **~67-78h** | **~390-980 zł rok 1** |

---

## OPCJA D (advanced) — Static site generator

Wymieniam dla kompletności, **NIE rekomendowane dla Fair Rentals** (zbyt techniczne dla Agnieszki).

### Jak to działa
- Astro / Eleventy / Hugo na `blog.fairrentals.pl`
- Markdown content w Git repo
- Deploy z GitHub Actions na Cloudflare Pages / Netlify (free tier)
- Komentarze: Giscus (GitHub Discussions)

### Plusy
- ⚡ Najszybsze (CDN, statyczne HTML, perfect Lighthouse 100/100)
- 💰 0 zł/miesiąc (free hosting)
- 🔒 Najbezpieczniejsze (brak DB, brak admin)
- 📈 Najlepsze SEO

### Minusy
- 🚫 **Agnieszka MUSI używać Git/Markdown** — to nie-developer workflow
- 🚫 Każdy artykuł = commit do repo, PR, deploy
- 🚫 Bez CMSa Agnieszka jest zależna od Damiana przy każdym poście
- 🚫 Nie skaluje się dla content team

**Werdykt**: dyskwalifikuje się dla solo-operatora bez technicznego backgrundu.

---

## Porównanie tabelaryczne

| Kryterium | A (IdoBooking) | B (WordPress) | C (Hybrid) | D (Static) |
|---|---|---|---|---|
| **Effort startowo** | 26h | 38-43h | 26h + 35-40h | 25h |
| **Koszt jednorazowy** | 0 zł | ~50 zł | 0 + 50 zł | 50 zł |
| **Koszt miesięczny** | 0 zł | 30-80 zł | 0→30-80 zł | 0 zł |
| **Time-to-market** | 7 dni | 30 dni | 7 dni | 14 dni |
| **SEO (na start)** | 🟡 średnie (JS rendering, brak schema) | 🟢 doskonałe | 🟡 średnie | 🟢 doskonałe |
| **SEO (długoterminowo)** | 🔴 ograniczone | 🟢 doskonałe | 🟢 doskonałe (po migracji) | 🟢 doskonałe |
| **Łatwość publikacji** | 🟡 manual, brak draftów | 🟢 Gutenberg + scheduling | 🟡→🟢 | 🔴 Git/MD |
| **Skalowanie do 50+ artykułów** | 🔴 panel zagracony | 🟢 native | 🟢 (po migracji) | 🟢 |
| **Maintenance miesięczny** | 1-2h | 1-2h + sec patching | 1-2h | 0h |
| **Vendor lock-in** | 🔴 IdoBooking dependent | 🟡 WP standard | 🟡→🟡 | 🟢 |
| **Ryzyko techniczne** | 🟢 niskie | 🟡 średnie (WP exploits) | 🟢 niskie | 🟢 niskie |
| **Onboarding Agnieszki** | 1h | 4h | 1h→4h | 8h (Git!) |

---

## REKOMENDACJA

### Dla Fair Rentals: **Opcja C (Hybrid) — Start z A, migracja do B opcjonalnie**

**Uzasadnienie**:
1. **Klient nieprzetestowany blog jako kanał** — nie wiemy czy Agnieszka faktycznie będzie pisać. Inwestycja w WP może być wasted effort jeśli po 3 artykułach Agnieszka zrezygnuje.
2. **Operator solo + ograniczony czas** — Agnieszka prowadzi całą firmę. Blog to dodatkowy obowiązek. Lekkie rozwiązanie ma większe szanse na adoption.
3. **MVP-first podejście** — sprawdźmy czy blog generuje ruch i lead-y przy minimalnej inwestycji. Jeśli tak — migracja do WP jest opłacalna. Jeśli nie — uniknęliśmy 30-80 zł/m × 12 = 360-960 zł/rok wydanych na hosting WordPress nieużywany.
4. **Łatwa migracja** — artykuły jako HTML w IdoBooking są łatwo eksportowane do WP (kopiuj-wklej + dodanie meta).
5. **Brak wartości dodanej WP na start** — 3-5 evergreen articles nie potrzebują kategorii, tagów, draftów, scheduling. To overhead bez ROI.

### Plan wdrożenia Opcji C (Faza 1)

**Tydzień 1**: Architektura i komponenty
- CSS: `.fr-blog-list`, `.fr-blog-card`, `.fr-post-hero`, `.fr-post-content`, `.fr-post-meta`, `.fr-post-author`
- JS: manifest reader + filtering by category
- Manifest JSON struct:
```json
{
  "posts": [
    {
      "id": 300,
      "slug": "co-zwiedzic-we-wroclawiu",
      "title": "10 atrakcji Wrocławia, które musisz zobaczyć",
      "excerpt": "Krótki opis 2 zdania...",
      "category": "dla-gosci",
      "tags": ["wroclaw", "atrakcje", "co-zwiedzic"],
      "publishedAt": "2026-05-20",
      "updatedAt": "2026-05-20",
      "author": "Agnieszka Barańska",
      "featuredImage": "https://.../post-300-hero.jpg",
      "readTime": "5 min",
      "url": "/pl/txt/300/10-atrakcji-wroclawia"
    }
  ]
}
```

**Tydzień 2**: 3 pilotażowe artykuły (1 z każdej kategorii):
- "10 atrakcji Wrocławia, które musisz zobaczyć" (Dla Gości)
- "Ile zarabia właściciel apartamentu na wynajmie krótkoterminowym we Wrocławiu?" (Dla Właścicieli)
- "Najem korporacyjny we Wrocławiu — czy się opłaca?" (Dla Firm)

**Onboarding Agnieszki** (1h video call):
- Jak utworzyć /txt/X w panelu
- Jak wkleić HTML treść artykułu
- Jak dodać post do manifest (lub Damian to robi za nią pierwszych 10 razy)
- Praktyki SEO: meta description, h2/h3, internal links

**Po 3-6 miesiącach — review trigger**:
- Ile artykułów Agnieszka faktycznie opublikowała?
- Czy blog generuje organic traffic? (Search Console)
- Czy są lead-y z bloga? (UTM tracking + analytics)
- Czy Agnieszka czuje frustracje z ograniczeń IdoBooking CMS?

Jeśli 3 z 4 odpowiedzi pozytywne → **Faza 2: migracja do WP** (Opcja B).

---

## Pytania do klienta przed startem

Damian → Agnieszka:

1. **Domena fairrentals.pl** — czy klient ją posiada? (sprawdź NIP w whois)
   Jeśli nie — kupić teraz (~50 zł/rok) — przyda się nawet dla samej strony głównej kiedyś (CNAME do IdoBooking)
2. **Częstotliwość publikacji** — realistycznie, ile artykułów Agnieszka napisze/miesiąc?
   - 0-1/miesiąc → zostaw blog, skup się na innych torach
   - 2-3/miesiąc → Opcja C (Hybrid)
   - 5+/miesiąc → bezpośrednio Opcja B (WP)
3. **Kategorie kontentu** — czy 3 segmenty (Goście/Właściciele/Firmy) są ostateczne, czy będzie więcej (np. "Aktualizacje firmy", "Sezonowe oferty")?
4. **Komentarze i social sharing** — wymagane na start? (Opcja A bez tego — można dodać później)
5. **Newsletter integration** — czy klient ma listę mailingową (Mailchimp/MailerLite)? Czy chce ją wbudować w blog?
6. **Multi-language** — czy artykuły będą dublowane PL/EN/DE? Bo to mnoży effort × 3.

---

## Jeśli klient chce skipnąć Opcję C i iść od razu na B

Rezerwa decyzyjna — jeśli Agnieszka zdecyduje "WP od razu":
- Dodaj 4 tygodnie do timeline
- Budżet: ~50 zł domena + ~40 zł/m hosting × 12 = ~530 zł rok 1
- 38-43h od strony Damiana / IAI (custom theme + setup + onboarding)
- Korzyść: brak migracji w przyszłości, full SEO od dnia 1

---

## Status

**Akcja Damian**: Przedstaw ten dokument Agnieszce na najbliższym call'u. Decyzja klienta odblokuje Sprint D.

**Estymowane czasy decyzji**: 1-2 tygodnie (call + reflection time).

**Po decyzji**: Sprint D może wystartować w v1.34 lub v1.35.

---

**Plik wygenerowany**: 2026-05-15, JARVIS v1.33
**Następne**: Damian → konsultacja z Agnieszką → wybór opcji A/B/C → start implementacji.
