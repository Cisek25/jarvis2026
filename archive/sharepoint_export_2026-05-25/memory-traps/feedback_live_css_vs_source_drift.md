---
name: Live CSS vs local source drift
description: Klientka deployed niepełną/starą wersję CSS — live ≠ local source. Sprawdzaj zawsze przed edytowaniem.
type: feedback
originSessionId: 25c3c84c-4be9-4f6b-a50a-131306fde9b0
---
# Live CSS ≠ Local Source — Always Curl-Verify First

## Rule
Przed jakimkolwiek CSS fix dla istniejącego klienta, **pobierz live CSS** i porównaj z lokalnym source.
Nie zakładaj że klientka wkleiła to co dałeś.

**Why:** Fair Rentals v1.70 audit (2026-05-20). Klientka miała "v1.69 deployed" wg release notes,
ale live `custom.css` był 475 KB / 14582 linii vs local source 401 KB / 12034 linii.
Klientka wkleiła starszą wersję lub edytowała w panelu manualnie. Dwa kluczowe fixy v1.69
(hamburger min-height 40px, padding 6x12) NIE BYŁY na live — live miało stary kod
48px+12x16 → hamburger 57px wystawał z headeru 65px o 4-5px.
Diagnoza 30 min błądzenia po pliku source zanim curl wykazał drift.

**How to apply:**
1. **Pierwsza akcja w sesji debug** dla istniejącego klienta:
   ```bash
   curl -s "https://clientNNNNN.idobooking.com/customStyles/default13/custom1/custom.css?v=..." \
     -o /tmp/claude/live.css
   wc -c /tmp/claude/live.css clients/X/DO_WKLEJENIA/X_ARKUSZ_STYLOW.css
   ```
2. Jeśli różnica > 5%, **flag drift** i nie edytuj local "vX.Y" — zamiast tego:
   - PATCH approach: napisz mini-patch (na koniec custom.css), nie zamieniaj całości
   - Albo: pobierz live → diff key sections → sync §FR-CLIENT block do local → wymień
3. Live curl `last-modified` header pokazuje też czy klientka edytuje aktywnie w trakcie sesji:
   ```bash
   curl -sI ".../custom.css" | grep -i "last-modified\|content-length"
   ```
   Jeśli czas modyfikacji ostatnich minut → ostrzeż klientkę przed wklejaniem patcha.

## Detection patterns
- Source ma reguły v1.X ale computed pokazuje wartości z v1.X-1 (lub wcześniejsze)
- `getMatchedCSSRules`-equivalent pokazuje regułę z **innym** cssText niż local source
- Live size > local size = klientka ma własne §FR-CLIENT extension nieobecne w local
- Live size < local size = klientka usunęła/zastąpiła część source

## Fix strategy (per scenario)
- **Live ma więcej niż local**: PATCH approach (mini-fix na koniec)
- **Live ma mniej**: pobierz live + diff → klientka coś usunęła; sync local → re-deploy
- **Live ma starszą wersję**: PATCH lub asystuj klientce przy re-paste pełnej wersji
- **Live = recent timestamp**: poczekaj/synchronizuj — klientka pracuje teraz

## Reference
- Fair Rentals v1.70 audit: `clients/fairrentals/v1.70-audit/RAPORT_PHASE1_2026-05-20.md`
- Specificity war side-effect: `feedback_cascade_race_after_multi_version_patching.md`
- §FR-CLIENT preservation: `feedback_preserve_client_css_block.md`
