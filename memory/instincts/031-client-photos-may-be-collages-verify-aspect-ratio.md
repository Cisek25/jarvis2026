# Instinct 031 — Zdjęcia od klienta mogą być gotowymi kolażami → weryfikuj przed cropowaniem

## Kontekst odkrycia
2026-04-23, SORS (Eagle Tower Benidorm).
User: "ale te zdjęcia już teraz są mocno pionowe i ty je po prostu jakoś ucinasz... to są już kolaże".

## Co się stało
Klient (Monika) dostarczyła pliki 720×1080 (aspect 2:3). Założyłem, że to pojedyncze foto pionowe i dałem im kontener `aspect-ratio: 3/4` z `object-fit: cover` — przez co mniejsza krawędź (ok. 90px z dołu) była przycinana.

**User wyjaśnił że 720×1080 to już gotowy kolaż** — zestaw kilku zdjęć sklejonych w jedną grafikę 2:3. Cięcie `object-fit: cover` obcina CZĘŚĆ kolażu, a nie jedno z jego zdjęć → widać uciętą fotkę.

## Zasada
**Jeśli klient wysyła zdjęcie w nietypowym aspect-ratio (typowo: 2:3, 3:4, 16:9 landscape dla sekcji), ZAWSZE zapytaj lub sprawdź:**
1. Czy to pojedyncze foto (można cropować)?
2. Czy to gotowy kolaż/grafika (NIE WOLNO cropować)?

## Workflow

### Gdy podejrzewasz kolaż
```bash
# Pobranie + sprawdzenie metadata
curl -s "{URL}" -o /tmp/check.jpg
sips -g pixelWidth -g pixelHeight /tmp/check.jpg
# Lub ImageMagick: identify -format "%wx%h" /tmp/check.jpg
```

Jeśli:
- **720×1080, 600×900, 800×1200** — może być kolaż 2:3 (spytaj)
- **1200×800, 1600×900, 1920×1080** — raczej landscape single photo
- **Nieokrągłe wymiary typu 1247×1891** — single photo z aparatu

### Gdy klient potwierdza kolaż
**Kontener CSS musi matchować DOKŁADNIE aspect zdjęcia** — zero crop:
```css
.{prefix}-about__img img {
    aspect-ratio: 2 / 3;    /* MATCH 720x1080 exactly */
    object-fit: cover;       /* cover nie szkodzi bo kontener == image */
    width: 100%;
    height: auto;
}
```

**NIE używaj** `aspect-ratio: 3/4` ani `16/9` dla kolażu 2:3 — każdy inny ratio obcina kolaż.

### Gdy potrzebujesz innego layoutu (np. landscape hero)
Poproś klienta o:
- Osobne pliki landscape (np. 1200×800) zamiast kolaży
- LUB gotowe kolaże w potrzebnym ratio (np. 16:9 kolaż)

**Nie sugeruj "niech pani przygotuje landscape"** jeśli klient JUŻ przygotował kolaże i nie chce zmieniać — dostosuj kontenery.

## Checklist przed sekcją z fotkami
- [ ] Znam aspect ratio pliku klienta (`sips -g pixelWidth -g pixelHeight`)
- [ ] Wiem czy to single photo czy kolaż
- [ ] Kontener CSS `aspect-ratio` == aspect zdjęcia (zero crop)
- [ ] Mobile media query też matchuje (nie zmniejszaj ratio nieadekwatnie)
- [ ] Test live: sprawdź czy nic się nie ucina na desktop i mobile

## Powiązane trapy
- Trap #9 (każda sekcja musi mieć zdjęcie — ale MATCHING aspect)
- Instinct 022 (Pexels visual verify — zanim użyjesz, zobacz co jest na foto)

## Referencja
- SORS `00_CUSTOM_CSS_v3.css` po poprawce:
  - `.et-about__img img` → `aspect-ratio: 2/3` (zmienione z 3/4)
  - `.et-location__img img` → `aspect-ratio: 2/3`
  - `.et-media-row__img img` → `aspect-ratio: 2/3`
  - Komentarz inline: "KOLAZ 720x1080 od klientki = gotowa grafika; kontener 2/3 matchuje idealnie, zero crop, caly kolaz widoczny"
