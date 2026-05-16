# CRITICAL LESSON — Bash heredoc + `!important` = parser-killing CSS

**Data odkrycia:** 2026-04-20
**Klient dotknięty:** Apartamenty Parkowe Gniezno (v1.1 CSS)
**Koszt błędu:** 3 tury debugowania, user frustration, błędna diagnoza "limit 220 rules"

## Problem

Dodałem rozbudowanie CSS przez bash heredoc:

```bash
cat >> file.css <<'CSS_PATCH'
.foo {
  display: none !important;
}
CSS_PATCH
```

Po zapisie user wkleił do panelu IdoBooking. **Strona nie działała — kolory/breakout/hero widget nieobecne**.

Diagnoza wstępna: "panel obciął do 219 rules, musi być limit ~220". **BŁĄD** — to nie był limit.

## Prawdziwa przyczyna

Zaciągnąłem raw CSS z panelu klienta:

```bash
fetch('https://client58154.idobooking.com/customStyles/default13/custom1/custom.css')
```

W treści znalazłem:

```css
body.page-index .iai-search {
  display: none \!important;   ← BACKSLASH!
  visibility: hidden \!important;
}
```

**Bash heredoc z kwotacjami `<<'EOF'` (quoted)** zwykle zabezpiecza przed expansion, ALE **w pewnych konfiguracjach shell (zsh, bash w niektórych środowiskach), pattern `!` w tekście heredoc jest escapowany na `\!`** — prawdopodobnie przez history expansion lub context-dependent quoting.

Efekt: **KAŻDY** `!important` w dodawanym CSS został zapisany jako `\!important`.

Parser CSS widząc `display: none \!important;`:
1. Odrzuca regułę jako invalid (nie rozpoznaje `\!`)
2. Próbuje recovery — przeskakuje do następnego `}` lub `;`
3. Jeśli CSS jest obszerny, parser może odrzucić dziesiątki/setki reguł kaskadowo

W naszym przypadku: plik 2177 linii / ~500 reguł → parser zaakceptował tylko 219 pierwszych (z v1.0 L1 traps, które NIE miały problemu — bo były napisane bez heredoc).

## Weryfikacja na live

```js
// W DevTools konsoli klienta
const css = [...document.styleSheets].find(s => s.href?.includes('customStyles'));
fetch(css.href).then(r => r.text()).then(text => {
  const escaped = (text.match(/\\!important/g) || []).length;
  const correct = (text.match(/(?<!\\)!important/g) || []).length;
  console.log({escaped, correct, total_rules_parsed: css.cssRules.length});
});
```

- `escaped > 0` → problem z heredoc → plik wymaga ponownego zapisu bez heredoc
- `escaped === 0` → syntax OK

## Jak uniknąć

### ✅ Bezpieczne metody dodawania CSS:

**1. Write tool** (najbezpieczniejszy):
```
Write(file_path, full_css_content)
```
Literal content, żadnego escape.

**2. Edit tool** (precyzyjny):
```
Edit(file_path, old_string, new_string)
```
Jawne `!important` w JSON → literal.

**3. Jeśli MUSISZ użyć bash, unescape po fakcie**:
```bash
sed -i '' 's/\\!important/!important/g' file.css
```

### ❌ Niebezpieczne:

**bash heredoc z `!important`**:
```bash
cat >> file.css <<'EOF'   # ← nawet quoted heredoc może escapować
.foo { display: none !important; }
EOF
```

## Symptomy do rozpoznania

1. Serwowany CSS ma mniej rules niż lokalny plik
2. Reguły w późniejszej części pliku nie działają na stronie
3. Breakout / layout / override patterns znikają
4. `last_rule` w devtools pokazuje nieskompletną regułę (pustą `{ }`)
5. Klient: "nic nie działa, pusty bg, sekcje białe"

## Related lessons

- `css-custom-panel-limit.md` — poprzednia błędna diagnoza (limit 220). Zachować ale oznaczyć jako WRONG.
- `live-verification-before-delivery.md` — zawsze `fetch` raw CSS zanim powiesz "gotowe"

## TL;DR

**Jeśli używasz bash heredoc dla CSS z `!important`, zaaplikuj `sed 's/\\!important/!important/g'` PO zapisie LUB używaj Write/Edit tool zamiast heredoc.** Problem niewidoczny w lokalnym pliku (grep nie wyłapuje), objawia się dopiero na live gdy parser CSS spotyka `\!`.
