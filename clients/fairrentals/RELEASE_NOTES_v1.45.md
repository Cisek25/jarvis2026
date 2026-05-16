# Fair Rentals — Release v1.45 (5 issues post-deploy)

**Data**: 2026-05-15 (sesja 14)
**Stan przed**: v1.44 (kontrast lead na hero subpages)
**Stan po**: v1.45 (zdjęcie obsługa, compare footer, Dla Biznesu kicker+btn, mapa kontakt; +pytanie o Małgorzatę)

---

## 5 issues zgłoszonych przez klienta

### Issue 1 — Brakuje zdjęcia w Obsłudze najmu

**Live audit**: `<img src="https://images.unsplash.com/photo-1551776235...">` w sekcji "Średnie wyniki portfela" miał `naturalWidth: 0, complete: false` — **Unsplash URL nie ładuje się**.

Klient prosi: zastąpić `https://client58360.idobooking.com/images/frontpageGallery/pictures/large/3/0/17.jpg`

**Fix**: zamiana URL w 3 plikach:
- `OBSLUGA_NAJMU_PL__body_top.html` — alt "Zaufanie Gości — wnętrze apartamentu Fair Rentals we Wrocławiu"
- `OBSLUGA_NAJMU_EN__body_top.html` — alt EN
- `OBSLUGA_NAJMU_DE__body_top.html` — alt DE

Zachowane `loading="lazy"`, `decoding="async"`, `width/height`.

---

### Issue 2 — Czarne otoczki na przyciskach Wybieram CO-HOST/ZARZĄDZANIE

**Live audit**: `.fr-compare-model__footer` ma `background-color: rgb(10, 10, 9)` (dark deep). Pill button gold w środku **prostokątnego ciemnego footera** → klient widzi to jako "czarne otoczki" za zaokrąglonymi krawędziami.

**Fix §108a**: footer transparent + cienki border-top, button zachowuje subtle shadow.

```css
html body .fr-compare-model .fr-compare-model__footer {
  background: transparent !important;
  padding: 24px !important;
  border-top: 1px solid var(--fr-border-light) !important;
}
```

---

### Issue 3a — Hero kicker "Dla Biznesu" słabo widoczny

**Live audit**: `.fr-page-hero__kicker` color `rgb(15, 15, 14)` (dark) na bg `rgba(226, 215, 0, 0.18)` (yellow 18% transparent) — na hero z **dark overlay**. Dark text na yellow-18% na dark = niski kontrast.

**Fix §108b**: solid yellow bg + drop shadow + grubszy padding.

```css
html body.page-txt .fr-page-hero__kicker {
  background: var(--fr-primary) !important;  /* solid gold */
  color: var(--fr-dark) !important;
  font-weight: 700 !important;
  padding: 8px 18px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
  letter-spacing: 0.12em !important;
}
```

---

### Issue 3b — "Zapytaj o ofertę" button: niewyśrodkowany + dziwny żółty

**Live audit**:
- padding: `16px 32px 1px` — **asymmetric** (top 16, bottom 1!) → tekst opada do dołu
- color: `rgb(240, 234, 224)` (cream) na `rgb(226, 215, 0)` (gold) → **poor contrast**
- boxShadow: `rgba(226, 215, 0, 0.32) 0px 6px 18px` — strong yellow glow (klient: "świecący")

**Fix §108c**:
```css
html body .fr-final-cta .fr-btn--primary,
html body a.fr-btn--primary {
  padding: 14px 32px !important;             /* symmetric vertical */
  color: var(--fr-dark) !important;          /* z cream na dark */
  background: var(--fr-primary) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1.2 !important;
  min-height: 52px !important;
  box-shadow: 0 4px 14px rgba(226, 215, 0, 0.35) !important;  /* subtler */
}
```

---

### Issue 4 — Kontakt: mapa Leaflet pusta

**Live audit**: `#map_container` (klasa `.leaflet-container`) MA tiles (14 załadowanych) i markery (21) — ALE **dopiero po scrollnięciu do mapy**. Przy initial load mapa pokazuje pusty szary box z tylko +/- kontrolkami (przed scroll).

Typowy Leaflet bug: container miał unstable dimensions przy init → tiles nie ładują się dopóki `invalidateSize()` nie zostanie wywołane.

**Fix v1.45**:

**CSS §108d**: stabilne wymiary dla map containera:
```css
html body #map_container,
html body .leaflet-container {
  min-height: 420px !important;
  height: 420px !important;
  width: 100% !important;
  background: var(--fr-bg) !important;
}
```

**JS `fixSystemicLeafletMap()` w FR_KONIEC_BODY**:
- IntersectionObserver na `.leaflet-container`
- Gdy mapa wchodzi w viewport (rootMargin: 100px), trigger `window.dispatchEvent(new Event('resize'))` + ewentualnie `window.mymap.invalidateSize()` / `window.map.invalidateSize()`
- Plus dwukrotny retry przez setTimeout (800ms, 2500ms) na wypadek opóźnionej inicjalizacji

---

### Issue 5 — Małgorzata Banaś w spółce?

Klient: *"na podstronie o nas, nadal mamy Agnieszke banas i małgorzatę, one są w tej spółce? Może gdzieś znajdziesz przeszukaj neta kto jest w tej spółce czy gdzieś na social media może piszą."*

**Próbowałem zweryfikować** (chrome-devtools + curl):
- Google search — blokuje boty (zwraca puste)
- aleo.com — wymaga JS / login
- rejestr.io / krs-online.com.pl — wymaga JS
- Booking.com listing — listingi nie ujawniają nazwisk wspólników
- Facebook fairrentals.wroclaw — może istnieć ale crawl blocked

**Nie mogę zweryfikować bez bezpośredniego dostępu do KRS API.**

**Aktualna treść O nas** (`/txt/204/O-nas`) zawiera:
- H1: "Rodzinna firma z Wrocławia, 21 apartamentów, 9 lat doświadczenia"
- Lead: "Agnieszka i Małgorzata. 21 apartamentów..."
- Karta 1: Małgorzata Banaś (Współwłaścicielka · Gościnność i Jakość)
- Karta 2: Agnieszka Banaś (Współwłaścicielka · Operacje i Skalowanie)
- Tekst: "Fair Rentals zaczął się od jednego apartamentu... Małgorzata, z piętnastoletnim doświadczeniem w hotelarstwie..."

**Z poprzedniej sesji (handoff)** klient mówił: *"Właściciel: Agnieszka Barańska (1 osoba, NIE 2 — wcześniej błędnie zakładaliśmy 2 założycielki)"*

**3 opcje do wyboru przez klienta**:

**Opcja A** (status quo): zostawić obie + opisać każdą rolę (Małgorzata = jakość/hotelarstwo, Agnieszka = operacje/tech). Jeśli obie są zaangażowane w firmę (nawet jeśli formalnie tylko Agnieszka w KRS), to OK.

**Opcja B**: usunąć Małgorzatę, zostawić tylko Agnieszkę. Wymaga przepisania treści O nas (h1, lead, sekcja "Jak to się zaczęło", 1 karta zamiast 2).

**Opcja C**: zmiana nazwiska Małgorzaty na rolę (np. "Małgorzata — Hospitality Lead") jeśli nie jest formalnym wspólnikiem ale pracuje w firmie. Brand "rodzinna firma" zachowany.

**Akcja**: klient sam decyduje (zna wewnętrzne realia firmy). Damian czeka na odpowiedź.

---

## Zmiany w plikach

| Plik | Zmiana |
|---|---|
| OBSLUGA_NAJMU_PL/EN/DE__body_top.html | Unsplash photo URL → `/images/frontpageGallery/.../3/0/17.jpg` |
| FR_ARKUSZ_STYLOW.css | §108a-d nowe sekcje (~110 linii) |
| FR_KONIEC_BODY.html | `fixSystemicLeafletMap()` + wywołanie w boot() z retry |

---

## Wgranie do panelu — checklista v1.45

1. ☐ Wgrać aktualne `FR_ARKUSZ_STYLOW.css`
2. ☐ Wgrać aktualne `FR_KONIEC_BODY.html`
3. ☐ Wgrać `OBSLUGA_NAJMU_PL/EN/DE__body_top.html` w odpowiednich panel polach
4. ☐ Cmd+Shift+R verify:
   - `/txt/203/Obsluga-najmu` — zdjęcie w "Średnie wyniki portfela" widoczne (z galerii, nie Unsplash) ✓
   - Compare cards — brak "czarnych otoczek" za pill buttonami ✓
   - `/txt/202/Dla-Biznesu` — hero kicker "Dla Biznesu" wyraźny (solid gold) ✓
   - "Zapytaj o ofertę" — tekst wyśrodkowany, gold pill subtle ✓
   - `/contact` — mapa Leaflet ładuje się przy initial scroll w viewport ✓
5. ☐ **Odpowiedź klienta** ws. Małgorzaty (Opcja A/B/C)

---

## Status overall

| Bucket | v1.44 | v1.45 |
|---|---|---|
| Obsługa najmu — zdjęcie | ❌ Unsplash nie ładuje | ✅ /3/0/17.jpg z galerii |
| Compare buttons — czarne otoczki | ❌ dark footer bg | ✅ transparent + border |
| Hero kicker contrast | ❌ dark on yellow-18% on dark overlay | ✅ solid gold + shadow |
| Zapytaj button asymmetric | ❌ padding 16/1, cream on gold | ✅ symmetric + dark text |
| Kontakt mapa | ❌ pusta przed scroll | ✅ invalidateSize via IntersectionObserver |
| Małgorzata w spółce | — | ⏳ czeka na decyzję klienta |
