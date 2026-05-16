# RELEASE NOTES — Visit Baltic v1.0

**Data:** 2026-05-16
**Sesja:** brainstorm + build (initial scaffold)
**Branch:** `feature/visitbaltic-v1.0`
**Status:** szkielet gotowy, czeka na deploy + v1.1

---

## 🎯 CEL v1.0

Stworzyć fundamenty techniczne dla strony głównej Visit Baltic (PL). Wszystko co dziedziczy się przez wszystkie podstrony i języki: brand tokens CSS, theme miodowy, fonty, meta SEO, skrypty JS, fixes obecnych bugów.

## ✅ CO DOSTARCZONE

### Pliki w `DO_WKLEJENIA/`
- `VB_ARKUSZ_STYLOW.css` — **~1100 linii L3** (theme + 12 sekcji komponentów + responsive + WCAG + print)
- `VB_HEAD_PL.html` — pełen HEAD z fonts, meta, schema.org LodgingBusiness, GTM/GA
- `VB_KONIEC_BODY.html` — **9 modułów JS** (iai_location, Botsonic, hero teleport, featured offers builder, auto-galeria, auto-lista dzielnic, sticky header, smooth scroll, lazy images)
- `INSTRUKCJA_WDROZENIA.md` — krok po kroku deploy + sanity check + troubleshooting

### Wpis w `data/clients.json`
- Pełen entry klienta `visitbaltic` z prefix `vb`, palette "Honey Baltic", config tracking, kontakt, planowane features, critical traps

### Foldery
- `clients/visitbaltic/zdjecia/{hero,atrakcje,lifestyle,blog}` — gotowe na assety od klientki

## 🐛 NAPRAWIONE BUGI W EXISTING CODE

1. **GA tag duplikat** — w obecnym HEAD klientki tag `G-SB57T7EBJZ` był 2× (raz w bloku, raz inline). Zmergowane w jeden config.
2. **Botsonic urwany `</script>`** — IIFE nie miał zamykającego tagu. Naprawione.
3. **iai_location CSS hack** — przeniesiony z HEAD do CSS edytora (§4 VB_ARKUSZ_STYLOW.css). Lepsza separacja concerns.

## 📊 BADANIE PRZED IMPLEMENTACJĄ

### Brand color confirmed
- Primary miodowy `#ECAF09` (rgb 236,175,9) — widoczny w logo, CTA, focus
- Wszystkie pozostałe tokeny derywowane: `--vb-primary-hover #C9920A`, `--vb-primary-light #FFF4D1`, `--vb-navy #3E475E`

### Stack potwierdzony
- IdoBooking engine `engine16580.idobooking.com`
- Template `default13` (ten sam co Mountain Prestige)
- fullpage.js aktywne → CRITICAL-AA teleport hero
- **Litepicker** (nie Flatpickr!) → klasy `day-item is-locked halfBegin halfEnd is-today`
- Font systemowy panelu: Montserrat → zastąpiony przez Fraunces (display) + Inter (body) + Manrope (UI)

### Skala biznesu
- **100+ obiektów** w panelu (apartamenty, domy, wille) — największy klient JARVIS portfolio
- **100+ lokalizacji** z dokładnymi adresami
- **32 unikalne dzielnice** Świnoujścia (Centrum Miasta = 10 obiektów, Rezydencja Sienkiewicza, Posejdon, Platan, Bryza...)
- 3 języki: PL/EN/DE — już ma EN/DE w systemie
- 13 walut (multi-currency)

## 🗺️ ARCHITEKTONICZNE DECYZJE

| Decyzja | Co wybrane | Dlaczego |
|---|---|---|
| Date picker | Litepicker reskin (§7 CSS) | System IdoBooking go używa, ma ukośne daty (halfBegin/halfEnd), nie warto walczyć |
| Featured offers | Pattern MADERA/NAJMAR (vb-offer-card) | Sprawdzony wzorzec z CLAUDE.md, działa z `.container-hotspot` |
| Auto-galeria | Fetch `/strony/galeria` + parsuj DOM | Klientka wgrywa w panel, JS automatycznie podpina — zero pracy klientki |
| Mapa Airbnb | Leaflet + OSM (v1.10+) | Free, no API key, custom price markers — odłożone na późniejszy sprint |
| Fonts | Fraunces + Inter + Manrope | Fraunces = ciepły premium serif, Inter = czytelność, Manrope = UI accent |
| CSS architecture | L1+L2+L3 single textarea | Standardowy wzorzec JARVIS, działa w IdoBooking |

## ❌ DEFEROWANE NA PÓŹNIEJ

- `GLOWNA_PL__cms.html` — sekcje CMS strony głównej → **v1.1** (next session)
- Adobe Stock photos hero rotation → **v1.2**
- Litepicker live tuning po deploy → **v1.3**
- O Nas / Atrakcje / FAQ / Kontakt / Blog → **v1.4–v1.8**
- EN translation → **v1.9**
- DE translation + Mapa Airbnb → **v1.10**
- Mobile audit → **v1.11**
- WCAG audit → **v1.12**
- SEO audit + sitemap → **v1.13**
- Performance pass → **v1.14**

## 💡 LEARNINGS / INSIGHTS Z TEJ SESJI

1. **Chrome MCP rozszerzenie działa** (Chrome BETA) — można czytać Twój panel IdoBooking, nawigować, executować JS. Nieocenione przy zbieraniu danych z paneli klientów.

2. **Litepicker > Flatpickr** dla IdoBooking — system natywnie używa Litepicker z dokładnie tymi stanami które klient chciał (halfBegin/halfEnd). Nie ma sensu budować custom od zera.

3. **`.container-hotspot` pattern** jest uniwersalny — działał dla MADERA, NAJMAR, działa dla VisitBaltic. Wzorzec z CLAUDE.md §"Wyróżnione oferty" trzymamy jako sacred.

4. **Bug-spotting przy zbieraniu kontekstu** — sprawdzanie istniejącego HEAD/BODY ZAWSZE ujawnia bugi. Tutaj: zdublowany GA + urwany Botsonic. To natychmiast naprawiamy bo i tak przepisujemy plik.

5. **32 dzielnice = killer feature SEO** — każda dzielnica = potencjalna landing page (`/apartamenty/centrum-miasta`, `/apartamenty/sienkiewicza`...). Long-tail SEO mining w v1.13+.

6. **Skala 100+ obiektów = wymaga mapy** — listowanie wszystkich na homepage to za dużo. Mapa Airbnb-style z filtrami to MUST dla tej skali (v1.10+ priorytet wysoki).

## 📂 LICZBY

- 1 nowy klient dodany do `data/clients.json`
- 3 pliki DO_WKLEJENIA gotowe (CSS 1100L + HEAD 110L + BODY 350L)
- 2 pliki dokumentacji (INSTRUKCJA + RELEASE_NOTES)
- 4 podfoldery `zdjecia/` przygotowane
- 9 modułów JS w body_bottom
- 12 sekcji CSS
- 0 deploy (czeka na klientkę / dalsze v1.1)

## 🚦 NEXT SESSION

Priorytety v1.1 (~2-3h pracy):
1. `GLOWNA_PL__cms.html` — sekcje CMS strony głównej (hero, USP, featured offers wrapper, gallery, districts pills, CTA banner)
2. Lista 10 atrakcji Świnoujścia + briefy SEO (przygotowanie do v1.5)
3. Brand voice draft (do v1.4 O Nas)
4. Test deploy v1.0 (klientka → ja screenshotami → fixes ad-hoc)

---

🦭 **visit baltic — apartamenty Świnoujście** · v1.0 (initial scaffold)
