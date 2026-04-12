# Post-mortem: [BRAND] ([PREFIX]-)

**Data:** [YYYY-MM-DD]
**Client ID:** [ID]
**Sesje:** [ile]

## Czas i zakres

| Etap | Czas (szacunek) | Uwagi |
|---|---|---|
| Recon + config | | |
| Generacja (generate.py) | | |
| Customizacja homepage | | |
| Podstrony | | |
| Testowanie live (Chrome) | | |
| Poprawki po feedbacku klienta | | |
| EN / inne jezyki | | |
| **TOTAL** | | |

## Co bylo custom (poza generatorem)

- [ ] Sekcje homepage (jakie):
- [ ] Podstrony specjalne:
- [ ] Dodatkowy CSS (ile linii):
- [ ] Dodatkowy JS:
- [ ] Nietypowe zdjecia/media:

## Nowe trapy systemowe

<!-- Jesli pojawil sie nowy trap — opisz dokladnie -->

| Trap | Selektor | Fix | Ile klientow dotknietych |
|---|---|---|---|
| | | | |

**Czy dodac do CSS_BASE.css?** (tak jesli >= 2 klientow)

## Problemy i rozwiazania

| Problem | Rozwiazanie | Czas stracony |
|---|---|---|
| | | |

## Co zadzialo dobrze

-

## Co mozna poprawic w generatorze

-

## Metryki

- **Linie CSS wygenerowane:** ~423 (generator)
- **Linie CSS custom:** [ILE]
- **Linie JS wygenerowane:** ~171 (generator)
- **Linie JS custom:** [ILE]
- **% z generatora:** [PROCENT]
- **Feedback klienta (rund):** [ILE]

## Aktualizacje do systemu

<!-- Po wypelnieniu — Claude automatycznie aktualizuje: -->
- [ ] `templates/CSS_BASE.css` — nowe trapy (jesli >= 2 klientow)
- [ ] `cross-project-patterns.md` — nowe wzorce
- [ ] `idosell-clients-db.md` — status klienta
- [ ] Memory per-klient (`[brand].md`)
