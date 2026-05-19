# PR: River Premium Apartments v0.1 — design + Phase 1 (HOMEPAGE PL ready)

## Tytuł PR (skopiuj do pola "Title")

```
River Premium Apartments v0.1 — design + Phase 1 (HOMEPAGE PL ready)
```

## Body PR (skopiuj do pola "Leave a comment")

```markdown
## Summary
- Migracja **riverpremiumapartments.pl** (Profitroom → IdoBooking default13) dla klienta Andrzej Kowalski Fundacja Rodzinna
- Phase 0 + Phase 1 (foundation): Layer 3 theme CSS + HOMEPAGE PL gotowe do testu w panelu
- Pozostało: Phase 2-5 (HOMEPAGE EN, POKOJE, OFERTY, ATRAKCJE, RESTAURACJA, GALERIA, KONTAKT) — ~3-4 dni roboczych

## Commits (5)
- `e0d98d9` design doc + source recon (screenshots, brand tokens, sekcje)
- `063ec43` implementation plan (5 faz, 17 tasks, 30 deliverables)
- `167a1c2` Phase 0 setup (folder + memory metadata)
- `49c2ea0` Phase 1-A: Layer 3 CSS 6 modułów + ARKUSZ_STYLOW.css (2312 linii)
- `2945016` Phase 1-B: HOMEPAGE_PL head + body_top 8 sekcji + body_bottom (fullpage + featured offers MADERA pattern)

## Architektura
- **A — bazowe komponenty JARVIS** + 2 custom (`riv-amenities` 6 ikon, `riv-offer-card` MADERA pattern)
- Brand: granat `#051B3D` + złoto-brąz `#978C71`, Bodoni Moda + DM Sans
- 7 stron PL+EN docelowo (HOME ✓, pozostałe 6 do zrobienia)

## Test plan
- [ ] Wklej ARKUSZ_STYLOW.css do "Arkusz stylów CSS" panelu IdoBooking testowego
- [ ] Wklej HOMEPAGE_PL__head.html do HEAD strony głównej PL
- [ ] Wklej HOMEPAGE_PL__body_top.html do body_top strony głównej PL
- [ ] Wklej HOMEPAGE__body_bottom.html do body_bottom (shared PL+EN)
- [ ] Verify w chrome-devtools: header transparent na fp-viewing-1, normalny od fp-viewing-2
- [ ] Verify featured offers fallback widoczny (4 karty A-D + 3 oferty cenowe) gdy panel bez ofert
- [ ] Lighthouse mobile + desktop ≥ 85/95/90/95
- [ ] WCAG AA kontrast verify (axe DevTools 0 violations)

## Known limitations
- **Logo placeholder** — czekamy na SVG/PNG hi-res od klienta
- **Apartament D — brak URL obrazu** w recon source (3/4 mają thumb, D nie). Placeholder URL zwróci 404 do czasu re-reconu /pokoje lub dostarczenia przez klienta
- **CTA `href="#"`** — klient skonfiguruje target booking widget w panelu IdoBooking
- **Treści Restauracji** — czekamy na nazwę/menu/godziny/zdjęcia od klienta (Phase 4)
- **EN translation** — Phase 2, tłumaczenie z recon source

## Dla operatora
Pełna dokumentacja w:
- `docs/plans/2026-05-19-river-premium-apartments-migration-design.md`
- `docs/plans/2026-05-19-river-premium-apartments-implementation.md`
- `memory/clients_data/river-premium-apartments.json`
- `clients/river-premium-apartments/_recon/source-data.json`
```

---

## Instrukcja stworzenia PR

1. Otwórz w przeglądarce: **https://github.com/Cisek25/jarvis2026/pull/new/claude/sad-almeida-23de31**
2. Tytuł: skopiuj z sekcji wyżej
3. Body: skopiuj cały blok markdown (między ``` a ```)
4. Base branch: `main`
5. Compare: `claude/sad-almeida-23de31` (powinien już być wybrany)
6. **Create pull request**

Albo (jeśli chcesz fix gh CLI):
```
gh auth login -h github.com
# wpisz token z https://github.com/settings/tokens
# potem powtórz:
gh pr create --base main --head claude/sad-almeida-23de31 ...
```
