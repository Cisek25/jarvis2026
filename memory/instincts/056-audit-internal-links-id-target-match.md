# Instinct 056 — Audit linków wewnętrznych: ID musi match target page

**Pochodzenie:** piekary13, sesja 2026-05-11 v7. Wykryte przez Playwright MCP audit.

## Problem

IdoBooking ma "miłą" cechę: `/txt/{ID}/{dowolny-slug}` → redirektuje do correct slug. Czyli `/txt/202/O-nas` i `/txt/202/cokolwiek` oba prowadzą do podstrony z ID 202.

**ALE:** jeśli ID jest złe (np. linkujesz `/txt/204/Atrakcje` ale /txt/204/ to Lokalizacja) — gość trafia na **ZŁĄ podstronę bez błędu 404**. Cicha porażka.

## Realny przypadek (piekary13)

W GLOWNA_PL miałem:
- "Nasza historia" → `/txt/202/O-nas` ✓ ID 202 = O nas, slug nieaktualny ale redirect załatwia
- "Odkryj Toruń" → `/txt/204/Atrakcje` ✗ ID 204 = **Lokalizacja**, gość klika → trafia na Lokalizację zamiast Atrakcji

Klient zgłosił "Odkryj Toruń nie posiada linkowania" — bo wizualnie szedł nie tam gdzie sugerował tekst przycisku.

## Reguła JARVIS

**Każdy link wewnętrzny `/txt/{ID}/` MUSI być zweryfikowany że ID odpowiada docelowej podstronie.**

## Workflow weryfikacji

1. Po wgraniu HTML w panel — otwórz home przez Playwright MCP
2. Wyekstraktuj wszystkie linki `/txt/`:
   ```js
   Array.from(document.querySelectorAll('a[href^="/txt/"]')).map(a => ({
     text: a.textContent.trim(),
     href: a.getAttribute('href'),
   }))
   ```
3. Dla każdego linku, navigate na live URL i sprawdź:
   - Page title — czy zgodny z tekstem linku?
   - H1 — czy mówi o tym co link sugeruje?
4. Jeśli niezgodność — wymień ID na poprawne

## Skąd wziąć poprawne IDs

Najprostsze: pobierz live home i wyekstraktuj WSZYSTKIE wewnętrzne linki z menu. Każdy ma odpowiednie ID dla nazwy menu:
```js
Array.from(document.querySelectorAll('a[href*="/txt/"]')).map(a => ({
  text: a.textContent.trim(),
  href: a.getAttribute('href'),
}))
```

To pokaże mapping `tekst menu → /txt/ID/`. Używaj tych IDs w body_top.

## Symptom z perspektywy klienta

"Przycisk X nie linkuje" / "Klikam Y a trafiam na Z" / "Link prowadzi gdzieś indziej".

## Powiązane

- Lesson `live-verification-before-delivery.md`
- Instinct `004-verify-urls-on-live-site.md`
- Instinct nowy: 057 (audit przez Playwright MCP — pattern)
