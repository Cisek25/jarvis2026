# Instinct 003: Sprawdź żywą stronę PO wklejeniu do panelu

**Type:** Post-deploy verification
**Confidence:** 90%
**Occurrences:** multiple (footer gap, broken images — widoczne dopiero na live)

## Action
Po wklejeniu plików do panelu IdoBooking:
1. Otwórz stronę w przeglądarce
2. Sprawdź Network tab — 0 failed requests
3. Sprawdź Console — 0 JS errors
4. Sprawdź mobile view (375px) — brak horizontal scroll
5. Sprawdź footer — brak luk/pasków
6. Kliknij obrazy — lightbox działa

## Evidence
- Footer gap widoczny dopiero na live (CSS w walidatorze OK, ale system dodaje .gallery-lightbox)
- Wikimedia 429 widoczny dopiero na live (w kodzie URL wygląda OK)

## Trigger
Zawsze po komunikacie "wklejone do panelu — sprawdźmy".
