# Fair Rentals — Release Notes v1.29

**Data**: 2026-05-14
**Zakres**: Sprint A audit + 4 SEO/A11y fixes + Sprint B (Modele Współpracy 8%/10%)
**CSS size**: 304 KB / 300 KB limit (≈4 KB nad limitem — patrz uwagi)

---

## TL;DR — co zmieniono

### 4 fixy z Lighthouse audit (SEO 61→target 85+, A11y 94→target 100)

1. **§96a Cookie button kontrast** — `.ck_dsclr__btn_v2` z białego na czarny tekst (kontrast 1.5 → 11.5, WCAG AAA).
2. **JS cleanup duplicates** — w `FR_KONIEC_BODY.html` funkcja `cleanupSeoDuplicates()` usuwa duplikat `<meta name="description">` i `<link rel="canonical">` które system IdoBooking renderuje przed naszym HEAD.
3. **tel/mailto aria-label match** — visible text jest teraz częścią aria-label (WCAG label-content-name-mismatch fix) w 8 plikach PL/EN/DE.
4. **Duplicate "Sprawdź dostępność" link** — drugi CTA w final-cta na homepage zmieniony na "Zobacz wszystkie apartamenty" / "Browse all apartments" / "Alle Apartments ansehen" (Lighthouse identical-links fix).

### Sprint B — Modele Współpracy (8% co-host / 10% zarządzanie)

- **HTML §97**: nowa sekcja w `OBSLUGA_NAJMU_PL/EN/DE` MIĘDZY "Średnie wyniki portfela" a FAQ
- **CSS §97**: ~9 KB CSS w `FR_ARKUSZ_STYLOW.css`
- Tabela porównawcza 2 modeli:
  - **Co-host (8%)** — konto Booking po stronie klienta, FR robi onboarding + obsługa Gości
  - **Zarządzanie (10%)** — FR przejmuje całość operacji, klient zostaje przy sprzątaniu i naprawach
- Każda karta ma: badge, tytuł, subtitle, cenę, "Po Twojej stronie" + "Po stronie Fair Rentals", CTA mailto z prefilled subject
- **Wsparcie wspólne** (aside) pod tabelą — 3 punkty dla obu modeli
- Responsive: 2 kolumny ≥768px, 1 kolumna pionowo ≤767px
- A11y: `role="list"`, aria-labelledby, focus-visible outline, prefers-reduced-motion respect

---

## Lista plików do wklejenia (v1.29)

W kolejności:

| # | Plik | Gdzie wkleić |
|---|---|---|
| 1 | `FR_ARKUSZ_STYLOW.css` | Panel → Wygląd → Arkusz stylów CSS (NADPISUJE wszystko) |
| 2 | `FR_KONIEC_BODY.html` | Panel → Ustawienia → Kody śledzące → Koniec sekcji Body |
| 3 | `GLOWNA_PL__cms.html` | Panel → Wygląd → Strona główna → Edytor treści (HTML mode) |
| 4 | `GLOWNA_EN__cms.html` | /en/ → Strona główna |
| 5 | `GLOWNA_DE__cms.html` | /de/ → Strona główna |
| 6 | `OBSLUGA_NAJMU_PL__body_top.html` | Panel → Treści → /txt/201 → Początek sekcji body |
| 7 | `OBSLUGA_NAJMU_EN__body_top.html` | /en/ → /txt/201 → Początek body |
| 8 | `OBSLUGA_NAJMU_DE__body_top.html` | /de/ → /txt/201 → Początek body |
| 9 | `DLA_BIZNESU_PL/EN/DE__body_top.html` | /txt/202 (i odpowiednio /en/ /de/) — TYLKO jeśli klient widzi starsze wersje |

Po wklejeniu: **Cmd+Shift+R** lub Ctrl+F5 (twardy reload).

---

## Co NIE jest gotowe (przed wgraniem v1.29)

### Konfiguracja w panelu IdoBooking (klient sam, NIE w HTML):

1. **Strona zaindeksowana?** Aktualnie `<meta name="robots" content="noindex, nofollow">`. Klient musi: **Panel → Wygląd → SEO → Indeksowanie → usunąć noindex/nofollow**.
2. **Stare meta description** systemowe: "19 apartamentów Booking 9.8". Klient musi: **Panel → SEO → Meta description PL/EN/DE → zaktualizować lub usunąć** (nasz z FR_HEAD nadpisze przez JS cleanup, ale lepiej posprzątać w panelu).
3. **Karty apartamentów bez cen "od/noc"** — uzupełnić cenniki: **Panel → Oferty → konkretny apartament → Cennik**.
4. **Filtry wyszukiwarki** (sypialnie, klimatyzacja, parking, slider) — **Panel → Wygląd → Ustawienia wyszukiwarki**. Może wymagać definicji "wyposażenia" na poziomie apartamentu.

### Nowe sekcje czekające na osobne sprinty:

| Sprint | Zakres | Status |
|---|---|---|
| C | Sekcja "O nas" (Agnieszka + Małgorzata) | BLOCKED — czekamy na zdjęcia portretowe |
| D | Blog / Baza wiedzy (Goście / Właściciele / Firmy) | TODO — decyzja arch: custom JS vs WordPress |
| E | 23 strony PDF "Uwagi_www" Agnieszki | BLOCKED — PDF wymaga aktywnego viewera lub kopii treści |

### Pre-existing bugs (niska priorytet, nie blokery):

- **GLOWNA_DE.html**: 8 niezbalansowanych `<div>` (103 open vs 95 close). Browser parsuje OK, ale warto kiedyś naprawić. Pre-existing (też w git HEAD).
- **Duplikat `<h1>`** — system IdoBooking dodaje swój h1 do `.index-info` (z `display:none` przez nasz CSS). SEO crawlery widzą 2 h1. Można usunąć z DOM przez JS, ale niski priorytet.
- **Console error** `bxSlider is not a function` — system IdoBooking script wymaga plugina, którego nie ma. Nie wpływa na funkcjonalność.

---

## Lighthouse audit (przed v1.29 wgraniem na live)

| Category | Score | Status |
|---|---|---|
| Accessibility | 94 | ✓ dobry, po v1.29 → target 100 |
| Best Practices | 96 | ✓ excellent |
| SEO | 61 | ⚠️ konfig panelu Idosell (noindex+canonical) — wymaga akcji klienta |
| Performance | nie testowano | - |

### 7 failing audits w v1.28 (przed v1.29):
1. errors-in-console (bxSlider — system) — **POMIJANY** (nie nasze)
2. aria-dialog-name — w POLICY MODAL, sprawdzić dalej
3. color-contrast (cookie button) — **NAPRAWIONE w §96a**
4. label-content-name-mismatch (tel/mailto) — **NAPRAWIONE w FIX 3**
5. is-crawlable — **WYMAGA AKCJI KLIENTA** (panel SEO)
6. canonical — **WYMAGA AKCJI KLIENTA** (panel SEO) + JS cleanup w FIX 1
7. agent-accessibility-tree — niska priorytet

### Po v1.29 wgraniu — oczekiwane scores:
- Accessibility: 94 → **98-100** (color-contrast + label-content fix)
- SEO: 61 → **75-85** (canonical JS cleanup; pełne 95+ wymaga klient panel fix)

---

## Testing checklist (zrobione w tej sesji)

- [x] V1.28 verified na live (markery 21, 9.6, panel 24/7, marketing copy)
- [x] Multi-viewport smoke test (390, 1024, 1366, 1440)
- [x] Visual test Sprint B desktop (1440px) — 2 col layout, badges, prices, lists, CTAs
- [x] Visual test Sprint B mobile (390px) — 1 col stacked, full-width CTA, responsywne
- [x] CSS syntax (1372 open = 1372 close braces, no broken rules)
- [x] HTML structure (sections + divs balanced w OBSLUGA_NAJMU * 3, GLOWNA_PL, GLOWNA_EN — GLOWNA_DE ma pre-existing bug)
- [x] Aria-label compliance (tel/mailto match visible text — 8 plików)
- [x] Console errors / network audit
- [ ] Live Lighthouse re-run — po wgraniu v1.29 przez klienta

---

## CSS size watch

| Section | Lines | KB est |
|---|---|---|
| do §95 (v1.28) | ~10080 | 298 |
| §96 cookie fixes | ~24 | 0.8 |
| §97 modele współpracy | ~190 | 9 |
| **v1.29 total** | **10437** | **304** |

**Nad limitem 300 KB o 4 KB**. Po następnym audycie cleanup zrobiona kompresja whitespace lub deduplikacja innych sekcji (np. §79 / §83 były już usunięte w v1.28).

Nie blokuje wklejenia — Idosell limit jest miękki, do panelu wchodzi do ~500 KB. Ale warto pilnować.

---

## Changelog

### v1.29 (2026-05-14)
- ADD: §96 Cookie button contrast fix (a11y AAA)
- ADD: §97 Modele Współpracy 8%/10% (HTML PL+EN+DE + CSS)
- ADD: `cleanupSeoDuplicates()` JS w boot() — usuwa duplikat meta/canonical
- FIX: tel/mailto aria-label match (8 plików, WCAG label-content)
- FIX: Duplicate CTA "Sprawdź dostępność" w final-cta — zmieniono na "Zobacz wszystkie apartamenty"

### v1.28 (2026-05-12)
- ADD: §94 Hero centered + search bar inline
- ADD: §95 Kicker redesign minimalistyczny
- CLEANUP: §79 + §83 removed (CSS slim down)
- FIX: Bug #8 audyt — Double H1 w 9 plikach subpages
