---
name: Preserve client-added CSS block (§FR-CLIENT pattern)
description: When client adds their own CSS rules to project CSS file, preserve as-is in every future version under a marked section
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
When a client edits their CSS directly (adds custom rules) and asks us to "include this in every version" — wrap it in a clearly-marked section banner at the end of the CSS file:

```
/* ============================================================
   §XX-CLIENT. Styles by <ClientName> (klient — nie modyfikowac)
   Dodane przez klienta, zachowujemy w kazdej wersji CSS.
   Last sync: YYYY-MM-DD (vX.YY)
   ============================================================ */
... client's rules ...
/* END §XX-CLIENT */
```

**Why:** Client iterates on small visual tweaks themselves between our releases. If we overwrite without preserving, we destroy their work and they have to re-paste every time. Damian: "klient sama to dodała, traktujemy, że ma być i tyle."

**How to apply:**
- Always put at END of CSS file (lowest priority for cascade, but uses !important so wins anyway)
- NEVER modify the client section — even if rules look redundant or could be simplified
- When client sends update, REPLACE the whole §XX-CLIENT block, don't merge
- Update "Last sync" comment with current date + version
- Use prefix matching client/project (e.g. §FR-CLIENT for Fair Rentals)
- If client's rules use CSS variables, verify the vars exist in :root — don't refactor, just verify
- First time seeing this pattern: Fair Rentals v1.49 (2026-05-18)
