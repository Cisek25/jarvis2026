# Instinct 002: Uruchom UX validator ZAWSZE przed oddaniem plików

**Type:** Quality gate
**Confidence:** 100%
**Occurrences:** standard practice (od 2026-04-16)

## Action
Po złożeniu/edycji plików klienta, ZAWSZE uruchom:
```
node library/qa/ux-validator.js clients/KLIENT/DO_WKLEJENIA
```
Jeśli `critical > 0` → napraw → uruchom ponownie → powtarzaj do PASS.

## Evidence
- Walidator łapie brak CTA, złe alt texty, Wikimedia URL-e, brak breakpointów
- Stayoldtown: złapał brak CTA na O Nas — dodaliśmy przycisk

## Trigger
Zawsze przed komunikatem "pliki gotowe do wklejenia".
