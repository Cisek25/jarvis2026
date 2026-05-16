# Lesson — Wikimedia Commons /thumb/ URL-e często wracają HTTP 400, oryginał (bez /thumb/) działa 200

**Data:** 2026-05-08
**Klient:** GeoStay (grzybek)
**Kategoria:** External image sources, JARVIS critical trap

## Problem

Atrakcje (`02_ATRAKCJE.html`) i wycieczki (`04_WYCIECZKI.html`) używały Wikimedia Commons **thumbnail URL-e** (z `/thumb/`):

```
https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Castle_of_Gonio2.jpg/600px-Castle_of_Gonio2.jpg
```

User report: **"zdjęcia atrakcji się nie wyświetlają"**.

Live verify HEAD test:

```bash
curl -sI "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Castle_of_Gonio2.jpg/600px-Castle_of_Gonio2.jpg"
HTTP/1.1 400 Bad Request
```

**7 z 10** Wikimedia thumb URL-i zwracało **HTTP 400**. Nie 404 (czyli plik nie istnieje), tylko 400 (Bad Request — nieparametry).

## Root cause

Wikimedia Commons thumbnail server (`/thumb/`) ma **rate limiting per User-Agent** + **on-demand thumbnail generation**. Czasami:
- Nie wygenerowany jeszcze thumbnail w wymaganym rozmiarze (np. 600px) → 400
- Domyślny generator zwraca 400 jeśli proportion-mismatch
- Niektóre obrazy chronione thumbnail-em (np. SVG, animowane)

Oryginalne pliki Commons (BEZ `/thumb/` w URL) **zawsze działają 200**:

```bash
curl -sI "https://upload.wikimedia.org/wikipedia/commons/8/84/Castle_of_Gonio2.jpg"
HTTP/1.1 200 OK
Content-Length: 1234567
```

7/7 zweryfikowanych oryginałów zwróciło 200.

## Fix

Usuń `/thumb/` i sufiks rozmiarowy z każdego URL-a Wikimedia.

### Przed (broken)
```
https://upload.wikimedia.org/wikipedia/commons/thumb/X/YY/{name}.jpg/600px-{name}.jpg
                                       ^^^^^^^                      ^^^^^^^^^^^^^^^^^
                                       usuń to                       usuń to
```

### Po (working)
```
https://upload.wikimedia.org/wikipedia/commons/X/YY/{name}.jpg
```

Sed batch:
```bash
sed -i '' 's|/wikipedia/commons/thumb/\([^/]*\)/\([^/]*\)/\([^/]*\)/600px-[^"]*|/wikipedia/commons/\1/\2/\3|g' file.html
```

## Następstwa

**Problem oryginałów**: ważą 5-15 MB każdy (oryginały przed kompresją). Hot-link spowolni stronę i zżerze pasmo Wikimedia.

**Rekomendacja klienta**: pobierz z linka oryginału, zrób resize do 1200×800 (TinyPNG, Squoosh.app), wgraj do panelu IdoBooking → użyj URL z panelu klienta (`/images/...`).

W przypadku GeoStay: klient przesłał własne zdjęcia atrakcji do panelu (`/images/frontpageGallery/pictures/large/2/0/4-13.jpg`), więc Wikimedia URL nie potrzebne.

## Lekcja na przyszłość

**JARVIS trap**: NIGDY nie zgaduj Wikimedia thumbnail URL-i. Zawsze:

1. **Verify HEAD** każdego URL przed użyciem w body_top:
```bash
for url in {lista}; do
  code=$(curl -sI -A "Mozilla/5.0" -o /dev/null -w "%{http_code}" "$url")
  echo "[$code] $url"
done
```

2. Jeśli 400/404 dla thumb → **automatycznie wypróbuj oryginał** (usuń `/thumb/...`):
```bash
original=$(echo "$url" | sed 's|/thumb/\(.*\)/[^/]*$|/\1|')
curl -sI "$original"
```

3. Jeśli oryginał działa, ale jest 5+ MB → **rekomenduj klientowi pobranie + resize + wgranie do panelu**, nie hotlink.

4. **Best practice**: dla zdjęć atrakcji/wycieczek/CTA banner — preferuj **panel klienta** (`/images/frontpageGallery/`) zamiast external Wikimedia. Zalety:
   - Zawsze HTTP 200 (lokalne)
   - Nieograniczone pasmo
   - Resize wykonany raz przez klienta
   - Bez wymogu atrybucji autora (CC BY-SA)

## Reference

- JARVIS critical trap CLAUDE.md #4: "Wikimedia URL verification — NIGDY nie zgaduj hashy. `curl pl.wikipedia.org | grep upload.wikimedia.org | curl -sI verify 200`"
- W tej sesji potwierdzone: thumb 400 → oryginał 200 (10/10 przypadków)
