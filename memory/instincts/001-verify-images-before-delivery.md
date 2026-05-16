# Instinct 001: Zweryfikuj KAŻDY obraz przed oddaniem

**Type:** Pre-delivery check
**Confidence:** 95%
**Occurrences:** 3 (Piekary 1-3 Wikimedia, Piekary pierniki, Piekary kamienice)

## Action
Przed oddaniem plików klientowi, sprawdź KAŻDY URL obrazu:
1. Otwórz URL w przeglądarce (lub curl -sI)
2. Potwierdź HTTP 200
3. Potwierdź że obraz wygląda sensownie (nie placeholder, nie broken)

## Evidence
- Wikimedia URLs zwracały 429 — klient widział puste miejsca
- Unsplash URL z wymyślonym ID zwracał 404
- Pexels starsze ID mają inny format filename

## Trigger
Zawsze gdy: generujesz HTML z zewnętrznymi obrazami, zmieniasz URL-e obrazów,
dodajesz nowe sekcje z wizualami.
