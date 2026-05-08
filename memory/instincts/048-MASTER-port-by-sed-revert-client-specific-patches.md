# 048 MASTER — Port-by-sed musi mieć REVERT phase dla relikt patches

## Problem

Port-by-sed (instinct 026) z istniejącego klienta (np. SA → FR) kopiuje cały CSS w tym **client-specific patches** które miały sens dla tamtego klienta ale **nie dla nowego**.

## Konkretny przypadek (Fair Rentals v1.6.4 relikt)

Port `solidneapartamenty/SA_CSS_EDYTOR.css` → `fairrentals/FR_ARKUSZ_STYLOW.css`. SA miał tylko PL → kod zawiera:

```css
/* PATCH v1.6.4: Hide language toggler everywhere — site is PL-only */
html body .language__toggler,
html body .language__toggler.language__toggler,
... { display: none; visibility: hidden; width: 0; height: 0; ... }
```

To było OK dla SA (1 język), ale FR ma **3 języki** (PL/EN/DE). Patch ukrywał language toggler całkowicie — Damian widział "nie ma wyboru wersji językowych".

**Spowodowało 1 cykl iteracji** (v1.24 dodał lang feature → v1.25 musiał odkryć debugować dlaczego nie działa → znaleziony relikt patch).

## Reguła

**Po port-by-sed sprawdź WSZYSTKIE komentarze `/* PATCH v1.X.Y */` w portowanym CSS i zweryfikuj czy mają zastosowanie dla nowego klienta.**

## Pattern checkout

```bash
# Po porcie z innego klienta — lista wszystkich patch markers
grep -nE "PATCH v[0-9]\.[0-9]" clients/{nowy_klient}/DO_WKLEJENIA/*.css
```

Następnie **per patch** zweryfikuj:
- Czy commit message poprzedniego klienta wskazuje **client-specific** (np. "site is PL-only", "client has only 3 apartments", "client doesn't use sauna")?
- Czy nowy klient ma **inne wymagania** (np. 3 języki, 19 apartamentów, sauna)?
- Czy patch fixuje **systemowy bug IdoBooking** (uniwersalny, OK do zachowania) czy **client-specific behavior** (do REVERT)?

## Lista podejrzanych patch markers (do weryfikacji per client)

Z portu solidneapartamenty:

| Patch | Co | Reuse? |
|---|---|---|
| `v1.6.0` | Boutique elegant feminine direction | Tak — paleta i fonty client zmienia |
| `v1.6.1` | Mobile menu chip | Tak (uniwersalny mobile UX) |
| `v1.6.2` | Mobile dropdown white-on-white fix | Tak (uniwersalny) |
| `v1.6.3` | URL slug fixes /txt/200 etc | NIE — slugi są klient-specific |
| **`v1.6.4`** | **Hide language toggler "site is PL-only"** | **NIE** — tylko jeśli klient ma 1 język |
| `v1.6.5` | Footer 3-col grid + brand name | NIE — stopka custom per client |
| `v1.6.7` | Litepicker style | Tak (uniwersalny widget) |
| `v1.6.8` | Senior Litepicker rebuild | Tak |
| `v1.6.9` | Litepicker position:fixed (fullpage.js fix) | Tak — krytyczny system bug |
| `v1.7.x` | alignMonthItems JS | Tak |

## Workflow port-by-sed v2 (z REVERT phase)

```
1. cp client_old/SA_CSS.css → client_new/CSS.css
2. sed: prefix sa- → fr-, kolory, fonty, miasto, ID
3. grep -nE "PATCH v[0-9]\.[0-9]" CSS.css  ← NOWE
4. PER patch: verify still applies for new client
5. REVERT non-applicable patches (delete blocks)
6. Validate (size, no orphan vars, sanity)
7. Test live + iterate
```

## Sygnały że patch jest "client-specific"

❌ Komentarz mentions specific client name lub property:
- "site is PL-only"
- "client has only X apartments"
- "no sauna in this client"
- "footer brand: Solidne Apartamenty"

❌ CSS targetuje text content:
- `::before { content: "Solidne Apartamenty" }`
- `::after { content: "Boutique Poznan" }`

❌ Selectors używają konkretnych client classes:
- `.sa-specific-thing`
- `[data-client="solidne"]`

✅ Patch jest "client-specific", **REVERT** w port-by-sed.

## Sygnały że patch jest "system-fix" (zachować)

✓ Komentarz mentions IdoBooking system bug:
- "fullpage.js scroll-by-transform"
- "system app.css overrides our specificity"
- "default13 widget hide pattern"

✓ Selectors targetują system classes (nie client-prefix):
- `.iai-search`
- `.section.parallax`
- `.fp-tableCell`
- `.litepicker`

✓ Patch jest "system-fix", **ZACHOWAĆ** po portu.

## Powiązane

- instinct 026 (port-by-sed master)
- lesson `port-by-sed-revert-relict-patches` (Fair Rentals v1.25 case study)

## Date
2026-05-08 — Fair Rentals v1.25 (1-cykl debug po znalezieniu v1.6.4 relikt)
