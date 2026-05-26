# MASTER instinct 034 — Kontakt + /offers + /offer/N są AUTOMATYCZNE w IdoBooking default13

**Data**: 2026-05-26
**Wykrycie**: River Premium Apartments v2.0 (commit 058b8ee — pomyłka, stworzyłem niepotrzebne OFERTY_PL + KONTAKT_PL body_top)
**User feedback**: "rozmawialismy o tym w jarvisie 10 razy, mial byc wyjsciowy duzy css, który poprawia mankamenty /offers"

## CO NIE TWORZYMY (nigdy, dla każdego klienta IdoBooking default13):

### 1. `/oferty` / `/oferty-i-promocje` — automatyczne
System IdoBooking generuje stronę listings ofert (`body.page-offers`) z:
- Filtry kategorii (Typ obiektu, Udogodnienia, Cena, etc.)
- Karty obiektów (`.offer-card` / `.offer-tile`)
- Sortowanie, paginacja
- Booking widget per karta

**Nasza praca**: TYLKO CSS overrides dla `body.page-offers` — kolory, layout, fix filtry collapsed (TRAP CRITICAL-CC), button styling.

### 2. `/offer/{id}/{slug}` — automatyczne single offer page
System renderuje single offer (`body.page-offer`):
- Galeria fotografii obiektu
- Opis, udogodnienia, kalendarz dostępności
- Booking widget (datepicker + price)
- Mapa lokalizacji
- Tabs (Opis / Udogodnienia / Mapa / Polityka)
- Cena (`.offer-price`)

**Nasza praca**: TYLKO CSS overrides dla `body.page-offer` — TRAP CRITICAL-EE (tabs --fixed), TRAP CRITICAL-FF (price padding), kolory marki.

### 3. `/kontakt` — automatyczne (CMS native lub system)
System renderuje formularz kontaktowy + dane firmy z panelu IdoBooking.

**Nasza praca**: TYLKO CSS overrides dla `body.page-contact` lub `body.page-kontakt` — kolory, typography, layout dwukolumnowy.

## KIEDY MIMO TO TWORZYMY własną stronę?

**Rzadko**, tylko jeśli:
- Klient ma SPECYFICZNĄ stronę kontaktu z bonusem (np. dodatkowy team section)
- System CMS pages dla customowych strony własnych (np. /atrakcje, /restauracja, /galeria) — TE ROBIMY

## CO ROBIMY własnymi CMS pages (zostawiamy):
- `/atrakcje` lub `/wybierz-atrakcje` — content marketing
- `/restauracja` — feature page jeśli klient ma własną restaurację
- `/galeria` — TYLKO jeśli klient chce custom layout; inaczej system generuje galerię w /offer/N
- `/o-nas`, `/regulamin`, `/polityka-prywatnosci` — text-only CMS pages
- Strona główna `/` (homepage) — w "Strona główna" w panelu

## Pattern overrides dla page-offers + page-offer (fairrentals)

```css
/* /offers (listing) — karty obiektów */
body.page-offers .offer,
body.page-offers .offers-list .offer-card,
body.page-offers .offer-card {
  background: var(--brand-white) !important;
  border-radius: var(--radius-lg) !important;
}

/* /offer/N (single) — TRAP CRITICAL-EE tabs --fixed */
body.page-offer .tabs.--fixed { width: 100vw !important; ... }

/* /offer/N — TRAP CRITICAL-FF price circle asymmetric padding */
body.page-offer .offer-price small,
body.page-offer .offer-price span { padding: ... !important; }

/* /offers — TRAP CRITICAL-CC filters open default */
body.page-offers .filter_content.collapse:not(.show) {
  display: none !important;
}

/* Buttons override (fairrentals pattern) */
body.page-offers .btn,
body.page-offer .btn {
  background: var(--brand-primary) !important;
  border-radius: var(--radius-pill) !important;
  /* etc. */
}

/* Body font on system pages */
body.page-offers,
body.page-offer,
body.page-contact {
  font-size: 16px !important;
}
```

## Apply do każdego nowego klienta IdoBooking default13

W ARKUSZ_STYLOW.css (Layer 3 theme) **MUSI BYĆ**:
1. `body.page-offers` overrides (cards bg, filter collapsed, btn colors)
2. `body.page-offer` overrides (tabs --fixed, price padding, gallery, mapy)
3. `body.page-contact` lub `body.page-kontakt` overrides (jeśli klient ma kontakt z systemu)

## Pattern dla apartamenty section na stronie głównej (apartamenty-parkowe)

Apartamenty section na home używa NATIVE IdoBooking featured offers (cmshotspot):
- HTML: pusty wrapper grid `<div class="riv-apartments-grid">`
- JS: reader z `.container-hotspot` → buduje karty
- BEZ filtrowania (filter UI jest na /offers, nie na home)

## Rekomendacja dla README/CLAUDE.md JARVIS

Dodać do `clients/CLAUDE.md`:
> **NIGDY nie twórz CMS page dla /oferty ani /kontakt** — IdoBooking generuje je automatycznie. Tworzymy WYŁĄCZNIE CSS overrides na `body.page-offers/page-offer/page-contact` w głównym ARKUSZ_STYLOW.css.
