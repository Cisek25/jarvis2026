# JARVIS — UX Quality Gate System

## Filozofia

Każda strona budowana w JARVIS przechodzi przez **3 fazy kontroli UX**.
Nie jest to oddzielny krok "na końcu" — to system wbudowany w cały pipeline.

## Fazy

### FAZA 1: BUILD (w trakcie pisania kodu)

Claude (lub operator) stosuje reguły **podczas generowania** HTML/CSS/JS.
Te reguły są zakodowane w `library/qa/ux-checklist.json` (prefix UX-0xx) i stanowią
**hard requirements** — kod nie powinien nawet powstać z ich naruszeniem.

**Kluczowe reguły BUILD:**

| ID | Kategoria | Reguła |
|---|---|---|
| UX-001 | images | Każda sekcja MUSI mieć element wizualny |
| UX-002 | images | Każdy img MUSI mieć sensowny alt |
| UX-003 | images | Nigdy Wikimedia jako CDN |
| UX-010 | typography | H1 → H2 → H3 bez przeskoków |
| UX-020 | contrast | Kontrast ≥ 4.5:1 (WCAG AA) |
| UX-030 | cta | CTA 'Rezerwuj' na każdej stronie |
| UX-031 | cta | Touch target ≥ 44x44px |
| UX-040 | mobile | Breakpoint 680px obowiązkowy |
| UX-050 | icons | SVG outline, nie fill/emoji |
| UX-080 | lightbox | Każdy obraz ma lightbox |
| UX-090 | footer | ::before/::after override |
| UX-091 | footer | Subpage gap fix |

### FAZA 2: REVIEW (po złożeniu strony, przed wklejeniem)

Uruchom walidator automatyczny:

```bash
cd JARVIS
node library/qa/ux-validator.js clients/KLIENT/DO_WKLEJENIA
```

Walidator:
- Skanuje WSZYSTKIE pliki HTML i CSS w folderze
- Sprawdza 16+ reguł automatycznie
- Generuje raport: PASS / WARNINGS / CRITICAL
- Zapisuje `UX_REPORT.json` w folderze klienta
- Exit code 1 jeśli są critical issues (blokuje deploy)

**Reguła:** Nie wklejaj do panelu IdoBooking, dopóki `critical = 0`.

### FAZA 3: DEPLOY (na żywej stronie)

Po wklejeniu do panelu, sprawdź na żywej stronie:

1. **Network tab** — 0 failed requests (szczególnie obrazy 404/429)
2. **Mobile 375px** — brak horizontal scroll, tekst czytelny
3. **Console** — 0 JS errors
4. **fullpage.js** — header zmienia styl po scroll do sekcji 2
5. **Lightbox** — klik na obraz otwiera powiększenie
6. **Footer** — brak luk, brak granatowych pasków

## Jak Claude korzysta z tego systemu

### Przy budowaniu nowej strony:

1. **PRZED** pisaniem kodu: Claude czyta `library/qa/ux-checklist.json`
2. **W TRAKCIE**: stosuje reguły BUILD (UX-0xx) automatycznie
3. **PO złożeniu**: uruchamia `node library/qa/ux-validator.js`
4. **Jeśli CRITICAL > 0**: naprawia, uruchamia ponownie
5. **Jeśli PASS**: podaje pliki do wklejenia

### Przy poprawkach istniejącej strony:

1. Uruchamia walidator na aktualnych plikach → widzi stan wyjściowy
2. Robi poprawki
3. Uruchamia walidator ponownie → potwierdza, że nie pogorszył

## Dodawanie nowych reguł

1. Dodaj do `library/qa/ux-checklist.json` (kolejne ID)
2. Jeśli autoCheck=true: zaimplementuj w `library/qa/ux-validator.js`
3. Dodaj opis do tej dokumentacji

## Severity levels

- **critical**: BLOKUJE wdrożenie. Musi być naprawione.
- **warning**: Do poprawy. Nie blokuje, ale obniża jakość.
