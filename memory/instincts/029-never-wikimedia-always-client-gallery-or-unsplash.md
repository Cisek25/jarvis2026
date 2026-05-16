# INSTYNKT 029: Nigdy Wikimedia w src img — zawsze galeria klienta lub Pexels/Unsplash

## Regula
W `<img src="...">` NIGDY nie uzywaj `upload.wikimedia.org`. Wikimedia rate-limituje hotlinking
z zewnetrznych domen i po chwili zwraca HTTP 429 Too Many Requests (tzw. "ref blocking").

Zdjecia ladowaly sie przez 10-30 min po dostawie i potem ZACZYNALY znikac — klient widzi
szare prostokaty z alt texem.

## Zrodla dopuszczalne (w kolejnosci preferencji)

### 1. Galeria klienta IdoSell (ZAWSZE gdy mozliwe)
Path: `/images/frontpageGallery/pictures/large/{A}/{B}/{N}.{ext}` (gdzie `.ext` = jpg/webp/png)
Wgrywasz: Panel → Administracja → Tresc → Multimedia → Galeria zdjec → Dodaj
- Uzywaj RELATYWNEGO URL-a (bez `https://clientXXXXX.idobooking.com/`) — dziala w panelu
  i na custom domenie (np. `madera.com.pl`) bez mixed-content issues
- Zdjecia klienta = autentyczne, pasuja do branding, nie znikaja

### 2. Pexels (free, CC0, unlimited hotlinking)
Format: `https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=1920`
Dziala jako CDN dla produkcji. Sprawdzone: EcoCamping, Grzybek.

### 3. Unsplash (free, license allows hotlinking)
Format: `https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=1920`
Dziala jako CDN. Sprawdzone: Katowice landmarks (Spodek, Stadion Slaski dostepne).

## Czego NIGDY nie uzywac
- `upload.wikimedia.org/*` (429 po chwili)
- `commons.wikimedia.org/wiki/File:...` (to HTML strony, nie obrazek)
- Linki z Google Images (zwracaja redirect przez google.com)
- Alamy / Getty Images / Shutterstock (platne)

## Workflow gdy klient chce atrakcji turystyczne
1. Sprawdz Unsplash/Pexels dla nazwy obiektu (WebFetch `unsplash.com/s/photos/{nazwa}`)
2. Jesli brak → powiedz klientowi "pobierz z Wikipedia te 4 linki, wgraj do galerii"
3. Daj klientowi 4 linki Wikimedia (w wersji /thumb/.../1200px-)
4. Klient wgrywa do galerii IdoSell
5. Dostajesz `/images/frontpageGallery/...` URL-e
6. Wklepujesz w HTML

## Weryfikacja przed oddaniem
```bash
grep -r "upload.wikimedia.org" clients/{klient}/DO_WKLEJENIA/
# MUSI zwrocic 0 wynikow
```

## Historia
- Madera 2026-04-22: 8 linkow Wikimedia dla Park Slaski / Stadion / Spodek / NOSPR przestaly
  dzialac po ~10 dniach. Klient zglosil "szare prostokaty w sekcji Katowice".
  Fix: klient wgral 4 zdjecia do galerii IdoSell, zamienilem wszystkie src-y na
  `/images/frontpageGallery/pictures/large/2/0/{44-47}.{jpg|webp}`.
- Trap #13 w CLAUDE.md — zdokumentowane od wczesniej, ale zdarzylo sie ponownie.
  Ten instinct wzmacnia: NIE tylko "avoid" ale "nigdy w nowych stronach".

Related: CLAUDE.md trap #13, instinct 022-pexels-photo-visual-verify.md.
