# GoldenApartments — Lista zmian do wprowadzenia w panelu
Data: 2026-03-30

---

## KONWENCJA PLIKÓW
Każdy plik = KOMPLETNA zawartość do Ctrl+A → Ctrl+V. Nigdy fragmenty.

| Plik | Gdzie w panelu | Sposób |
|------|---------------|--------|
| `GOLDEN_CSS.css` | Edytor stylu (editorstyle) | Ctrl+A → Ctrl+V |
| `GOLDEN_KONIEC_BODY.html` | Edytor szablonu → Koniec body | Ctrl+A → Ctrl+V |
| `GLOWNA_HEAD.html` | Strona główna → Początek head | Ctrl+A → Ctrl+V |
| `GLOWNA_CMS.html` | Strona główna → Edytor treści HTML | Ctrl+A → Ctrl+V |
| `WSPOLPRACA_CMS.html` | Strony CMS → /txt/205/ → Treść | Ctrl+A → Ctrl+V |
| `REGULAMIN_ZMIANY.html` | IdoBooking → Ustawienia → Regulamin | Ręczne zmiany (patrz plik) |

---

## 1. CSS — `GOLDEN_CSS.css`
**Gdzie**: Panel IdoSell → Edytor stylu (editorstyle)
**Co zawiera**: Cały arkusz stylów (§1-21 + §SEARCH + §SYS + responsive)
- System overrides (font-size, z-index, orange traps)
- Wyszukiwarka glassmorphism pill-bar
- Nav fix (11px, flex-wrap: nowrap)
- /offers filtry rozwinięte
- Wszystkie podstrony (offer page, współpraca, backTop)

## 2. JS — `GOLDEN_KONIEC_BODY.html`
**Gdzie**: Panel IdoSell → Edytor szablonu → Koniec body
**Co zawiera**: Cały JS (globalny, wszystkie strony)
- Phone space fix
- Search widget enhancer
- Schema.org (LodgingBusiness + FAQPage)
- Twitter Card meta tags
- Scroll animations, FAQ accordion, reveal effects

## 3. HEAD — `GLOWNA_HEAD.html`
**Gdzie**: Panel IdoSell → Strona główna → Początek head
**Co zawiera**:
- Preconnect dla Google Fonts
- theme-color (brand dark)
- Preload hero image (szybszy LCP)
- Komentarze z instrukcją co zmienić w ustawieniach SEO panelu

## 4. TREŚĆ STRONY GŁÓWNEJ — `GLOWNA_CMS.html`
**Gdzie**: Panel IdoSell → Strona główna → Edytor treści HTML
**Co zawiera**: Kompletna treść strony głównej
- Intro, kafelki (z poprawionymi linkami), apartamenty
- Dlaczego my, O nas, Lokalizacja
- Atrakcje Gdańska, Historia, Opinie, FAQ, CTA

## 5. PODSTRONA WSPÓŁPRACA — `WSPOLPRACA_CMS.html`
**Gdzie**: Panel IdoSell → Strony CMS → /txt/205/Wspolpraca → Treść
**Co zawiera**: Kompletna treść strony Współpraca (B2B landing)
**Tytuł strony** (w panelu): "Współpraca — Zarządzanie apartamentami | Golden Apartments"

## 6. REGULAMIN — `REGULAMIN_ZMIANY.html`
**Gdzie**: Panel IdoBooking → Ustawienia → Regulamin
**Co**: Ręczne zmiany (NIE Ctrl+A):
  - Punkt 1: USUŃ numer telefonu 5851483159
  - Dodaj sekcję "ODPOWIEDZIALNOŚĆ GOŚCIA" z pliku

## 7. USTAWIENIA SEO W PANELU (ręcznie)
**Gdzie**: Panel IdoSell → ADMINISTRACJA → SEO / Meta tagi
- **Tytuł**: "Golden Apartments — Wynajem Apartamentów w Gdańsku | Krótko- i długoterminowo"
- **Meta description**: "Komfortowe apartamenty w Gdańsku na wynajem krótko- i długoterminowy. Bezpłatny parking, transfer z lotniska, lokalizacja w centrum. Od 2011 roku. Rezerwuj online!"

## 8. DANE KONTAKTOWE — ✅ JUŻ POPRAWNE
Zweryfikowane 2026-03-30:
  - Adres: Gdyńskich Kosynierów 3/1A, 80-866 Gdańsk ✅
  - Email: rezerwacje@goldenapartments.com.pl ✅
  - Telefon: +48 518 843 405 ✅

**Drobne uwagi**:
  - Na /contact jest pusty link `tel:` — usunąć w szablonie kontaktowej
  - "Dane do przelewów" — uzupełnij w ADMINISTRACJA → Konfiguracja płatności

---

## KOLEJNOŚĆ WKLEJANIA
1. `GOLDEN_CSS.css` → Edytor stylu → Ctrl+A → Ctrl+V → Zapisz
2. `GOLDEN_KONIEC_BODY.html` → Koniec body → Ctrl+A → Ctrl+V → Zapisz
3. `GLOWNA_HEAD.html` → Strona główna → Początek head → Ctrl+A → Ctrl+V → Zapisz
4. Odśwież stronę (Ctrl+Shift+R) i sprawdź:
   - Wyszukiwarka wycentrowana, pill-bar z efektem szkła ✓
   - Menu — 7 pozycji w jednej linii ✓
   - Kafelki — wszystkie ze zdjęciami i poprawnymi linkami ✓
5. `GLOWNA_CMS.html` → Strona główna → Treść HTML → Ctrl+A → Ctrl+V → Zapisz
6. `WSPOLPRACA_CMS.html` → /txt/205/ → Treść → Ctrl+A → Ctrl+V → Zapisz
7. SEO (punkt 7) — ręcznie w panelu
8. Regulamin (punkt 6) — w IdoBooking
