# Instinct 055 — JARVIS SEO konwencja: 5 pól IdoBooking, NIE keywords

**Pochodzenie:** piekary13, sesja 2026-05-08 — klient RL skorygował.

## Problem

W SEO_PIEKARY.md pierwotnie używałem 4 pól + "Słowa kluczowe":
- Tytuł strony (`<title>`)
- Opis dla wyszukiwarek (meta description)
- Słowa kluczowe (meta keywords)
- H1

Klient skorygował: **JARVIS używa 5 pól specyficznych dla panelu IdoBooking, NIE keywords.**

## Poprawna konwencja (5 pól per podstrona)

W panelu IdoBooking → Treść → Podstrony → SEO są DOKŁADNIE te pola:

1. **Nazwa** — wyświetlana w menu, breadcrumbach, na liście podstron
2. **Podpis pod nazwą** — krótki podtytuł (kontekst pod nazwą)
3. **Tytuł** — główny nagłówek na samej stronie (system renderuje jako H1)
4. **Tytuł meta** — `<title>` w `<head>` HTML (browser tab, Google SERP), ≤ 60 znaków
5. **Opis meta** — `<meta description>` widoczny pod tytułem w Google, ≤ 155 znaków

## Co POMIJAMY

- **Słowa kluczowe** — Google ignoruje `<meta keywords>` od 2009 roku
- **H1** w SEO file — to content-level (siedzi w body_top albo system z pola "Tytuł"), nie pole panelowe
- **Slug** — osobny temat, w INSTRUKCJA.txt
- **Open Graph image / favicon** — opcjonalne post-launch
- **Search Console / sitemap** — sprawy administracyjne, nie per-podstrona

## Różnica między "Tytuł" a "Tytuł meta"

| Pole | Co | Gdzie widoczne |
|---|---|---|
| **Tytuł** | Główny nagłówek na stronie | System renderuje jako H1 nad treścią body_top |
| **Tytuł meta** | `<title>` w `<head>` HTML | Zakładka przeglądarki + wyniki Google |

Często będą podobne, ale **Tytuł meta zawiera brand sufiks** (np. "· Toruńskie Apartamenty"), a Tytuł na stronie jest krótszy.

## Template SEO_{CLIENT}.md

```markdown
## 1. Podstrona Główna

Nazwa: [Krótka nazwa do menu]

Podpis pod nazwą: [Kontekst — krótki podtytuł]

Tytuł: [Główny nagłówek na stronie]

Tytuł meta: [Pełny <title> ≤ 60 znaków, z brand sufiksem]

Opis meta: [<meta description> ≤ 155 znaków]
```

## Krytyczne ostrzeżenie

Strona główna IdoBooking domyślnie ma w polu Tytuł meta placeholder **„Wypełnij to pole tytułem strony…"** — to widać w wynikach Google i zakładce przeglądarki. **MUSI być zmieniony przed startem.**
