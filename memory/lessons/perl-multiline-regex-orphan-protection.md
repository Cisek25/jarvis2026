# Lesson — Perl regex do wstawiania `&nbsp;` (non-breaking space) wymaga `-0777` (slurp mode)

## Kontekst odkrycia
2026-04-22/23, EcoCamping — automatyczna ochrona przed sierotami (orphans) w polskich tekstach.

## Problem
Polskie sieroty ("w", "z", "i", "o", "a", "u") na końcu linii HTML wymagają zamiany spacji PO nich na `&nbsp;` (U+00A0). Dla bulk update w plikach HTML/PHP/JSON próbowałem:

```bash
perl -i -pe 's/\b([wzioauWZIOAU])\s+/$1\&nbsp;/g' plik.html
```

**Nie zadziałało** — `perl -pe` (tryb line-by-line) matchował tylko wtedy gdy sierota i słowo następujące były w tej samej linii. Jeśli HTML był sformatowany z breakami typu:
```html
<p>
  Jesteśmy w
  sercu lasu.
</p>
```
regex nie łapał `w\n  sercu`.

## Fix — `-0777` (slurp mode)
```bash
perl -i -0777 -pe 's/\b([wzioauWZIOAU])\s+/$1\&nbsp;/g' plik.html
```

`-0777` wczytuje CAŁY plik jako jeden string → `\s+` matchuje też `\n`.

## Zastosowanie (EcoCamping)
```bash
for f in clients/ecocamping/DO_WKLEJENIA/*.html; do
  perl -i -0777 -pe 's/(?<=[\s>])([wzioauWZIOAU])\s+/\1\&nbsp;/g' "$f"
done
```

Rezultat: 105 → 206 `&nbsp;` across 8 plików (po PL + EN + footer + CSS-edytor).

## Caveaty

### 1. Look-behind `(?<=[\s>])`
Bez tego regex może zamienić `worek` → `w&nbsp;orek` (litera "w" w środku słowa). Look-behind zawęża do sytuacji "po spacji lub `>`".

### 2. Uwaga na atrybuty HTML
Nie używaj na plikach z `class="w"` lub `id="w"` — może uszkodzić. Safer: regex tylko w obrębie text nodes, nie atrybutów:
```bash
perl -i -0777 -pe 's/>([^<]*)</my $t=$1; $t =~ s| \b([wzioauWZIOAU]) +|\&nbsp;$1\&nbsp;|g; ">$t<"/ge' plik.html
```

Ale dla typowych body_top (gdzie atrybuty to `class="ec-..."`) prosty wariant wystarczy.

### 3. JSON i encoding
Dla JSON (np. `treści_klienta.json`) używaj `\u00A0` zamiast `&nbsp;`:
```bash
perl -i -0777 -pe 's/\b([wzioauWZIOAU])\s+/\1\x{00A0}/g' dane.json
```

## Regex — które litery osierocone po polsku
| Litera | Status | Uwaga |
|--------|--------|-------|
| w, z, i, o, a, u | ZAWSZE | Spójniki/przyimki jednoliterowe |
| ale | OPCJONALNIE | Spójnik 3-literowy — nie zawsze |
| to, że, bo | OPCJONALNIE | Zależy od kontekstu |

Dla B&B stron wystarczy 1-literowe: `wzioauWZIOAU` (wielkie i małe).

## Referencja
- `memory/lessons/never-reduce-working-css.md` — ogólnie o bulk edits z Perl/sed
