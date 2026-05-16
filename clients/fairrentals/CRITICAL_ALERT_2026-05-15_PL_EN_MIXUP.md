# 🚨 CRITICAL ALERT — Fair Rentals 2026-05-15

**Status**: URGENT — wymaga interwencji klienta w panelu IdoBooking
**Wykryte przez**: live curl audit po wgraniu v1.33
**Drafter**: Damian Cisowski (IAI)

---

## Co poszło źle

Klient wgrał **plikami z wersji EN** do **polskiej zakładki panelu IdoBooking**:
- `FR_HEAD_EN.html` wgrane jako HEAD dla PL (zamiast `FR_HEAD_PL.html`)
- `GLOWNA_EN__cms.html` wgrane jako CMS strony głównej PL (zamiast `GLOWNA_PL__cms.html`)

W efekcie polska wersja strony **wyświetla treści po angielsku**.

### Dowody z live (curl test)

**`https://client58360.idobooking.com/pl`**:
- `<html lang="en">` ❌ (powinno być `lang="pl"`)
- Title: "Fair Rentals Wrocław — short-term apartment rentals in Poland" ❌ (powinno być "apartamenty na wynajem krótkoterminowy")
- Description: "Family-run company. 21 short-term apartments..." ❌ (powinno być "Rodzinna firma. 21 apartamentów...")
- Cytat Karoliny Banaś: "We rarely say 'it can't be done'..." ❌ (powinno być "Bardzo rzadko mówimy 'nie da się'...")

### Co jest poprawnie wgrane

- **`/en`** — EN HEAD + EN CMS — OK ✓
- **`/de`** — DE HEAD + DE CMS — OK ✓

Tylko **`/pl`** ma swap (EN treść).

---

## Co musi zrobić Agnieszka / klient (krok po kroku)

### KROK 1 — wgrać poprawne pliki do polskiej zakładki

**Panel IdoBooking → Konfiguracja → SEO → Język PL**
1. Otwórz pole "HEAD" / "Dodatkowe znaczniki HTML"
2. **Usuń obecną treść** (to obecnie HEAD EN)
3. Wklej zawartość pliku: **`/Users/user/Desktop/jarvis/clients/fairrentals/DO_WKLEJENIA/FR_HEAD_PL.html`**
4. Zapisz

**Panel IdoBooking → Treści → Strona główna → Język PL**
1. Otwórz edytor CMS strony głównej (PL)
2. **Usuń obecną treść** (to obecnie CMS EN)
3. Wklej zawartość pliku: **`/Users/user/Desktop/jarvis/clients/fairrentals/DO_WKLEJENIA/GLOWNA_PL__cms.html`**
4. Zapisz

### KROK 2 — weryfikacja po wgraniu

Po wgraniu, w przeglądarce wpisz:
```
https://client58360.idobooking.com/pl
```
Naciśnij `Cmd+Shift+R` (force reload, omija cache).

**Co powinno się pojawić**:
- Tytuł karty przeglądarki: "Fair Rentals Wrocław — apartamenty na wynajem krótkoterminowy"
- Cytat na stronie głównej: "Bardzo rzadko mówimy 'nie da się'..."
- Cała strona po polsku, włącznie z opisami sekcji

### KROK 3 — sprawdzić pozostałe podstrony PL

Wszystkie podstrony polskie były zapewne wgrane poprawnie (bo to osobne pola w panelu), ale dla pewności sprawdź każdą:
- `/pl/offers` — lista ofert
- `/pl/contact` — kontakt
- `/pl/txt/200` — atrakcje Wrocławia (powinno mieć ATRAKCJE_WROCLAWIA_PL__body_top.html)
- `/pl/txt/202` — dla biznesu (DLA_BIZNESU_PL__body_top.html)
- `/pl/txt/203` — obsługa najmu (OBSLUGA_NAJMU_PL__body_top.html)
- `/pl/txt/204` — o nas (O_NAS_PL__body_top.html)

Każda powinna być po polsku, nie po angielsku.

---

## Dodatkowo: 8 akcji panelu nadal nie wykonanych

(Z [AUDIT_UX_2026-05-15.md](AUDIT_UX_2026-05-15.md) — przypomnienie)

**🔴 P0 critical**: Odblokować indeksację (`noindex, nofollow` nadal aktywny — Google nie widzi strony)
- Panel → Konfiguracja → SEO → "Strona w wersji deweloperskiej" → odznacz

**🔴 Title strony wizytówki PL — pusty/placeholder**:
- Panel → Konfiguracja → Strona wizytówki → Język PL → Title
- Wpisz: `Apartamenty na wynajem Wrocław | Fair Rentals`

**🔴 Title strony wizytówki DE — placeholder "Wypełnij to pole..."**:
- Panel → Konfiguracja → Strona wizytówki → Język DE → Title
- Wpisz: `Apartments zur Miete in Breslau | Fair Rentals`
- Description: `Familienunternehmen. 21 Apartments in Breslau — Altstadt, Zentrum, Kępa Mieszczańska. Booking 9.6, Google 4.7. Direkt buchen.`

**🟡 Title /contact (puste)**:
- Panel → Treści → Strony tekstowe → Kontakt (PL/EN/DE) → Title
- PL: `Kontakt | Fair Rentals — Wrocław`
- EN: `Contact | Fair Rentals — Wrocław`
- DE: `Kontakt | Fair Rentals — Breslau`

**🟡 Menu EN — dodać ATTRACTIONS**:
- Panel → Wygląd → Menu → Język EN
- Dodaj pozycję "ATTRACTIONS" → `/en/txt/200`

**🟡 Menu DE — "CONTACT" → "KONTAKT" + dodać "VERMIETUNGSVERWALTUNG"**:
- Panel → Wygląd → Menu → Język DE
- Edytuj "CONTACT" → "KONTAKT"
- Dodaj pozycję "VERMIETUNGSVERWALTUNG" → `/de/txt/203`

**🟡 OG image http:// → https://**:
- Panel → Konfiguracja → SEO → Open Graph
- OG image: zmienić http:// na https://

**🟡 Stara meta description (systemowa) "19 apartments, 9.8"**:
- Panel → Konfiguracja → SEO → Język PL/EN/DE → "Meta description strony wizytówki"
- Aktualizować na "21 apartamentów, Booking 9.6"
- (UWAGA: te systemowe meta pokazują się w SERP jeśli nasze custom HEAD nie nadpisuje — bezpieczniej zaktualizować obie wersje)

---

## Co JA (Damian) zrobię tymczasem w v1.34

Skoro klient ma problem z poprawnym wgraniem + 4 ticketów PD/SA nie naprawi szybko, dodam **JS workaroundy** do `FR_KONIEC_BODY.html`:

1. **Canonical fix** — JS który nadpisuje canonical na bieżący URL podstrony (workaround ticket 1)
2. **target="blank" fix** — JS który zamienia `target="blank"` na `target="_blank"` na footer links (workaround ticket 2)
3. **html lang fix** — JS który ustawia `<html lang>` na podstawie URL `/pl/`, `/en/`, `/de/` (workaround ticket 4 + mitigation błędnego wgrania)

To powinno częściowo niwelować bug klienta + bugi template'a aż do prawdziwego fixu.

---

## Pilność

**KLIENT MUSI POPRAWIĆ DZIŚ** — strona polska wygląda jak angielska, klient traci wiarygodność wobec polskich gości którzy widzą "We rarely say..." po polskim URL.

Po naprawie: dać znać, zrobię ponowny live audit + Lighthouse re-run.

---

**Plik wygenerowany**: 2026-05-15, JARVIS v1.33 post-deploy audit
**Następne**: Damian → wysyła to do Agnieszki/klienta → klient w panelu naprawia → re-audit
