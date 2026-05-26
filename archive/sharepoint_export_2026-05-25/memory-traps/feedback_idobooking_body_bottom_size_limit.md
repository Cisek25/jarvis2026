---
name: IdoBooking body_bottom script size limit (~62KB)
description: Critical IdoBooking panel limit — body_bottom JS field truncates files larger than ~62KB silently, causing boot() and tail code to be missing in deployed page
type: feedback
originSessionId: 3112c5e1-b4f4-4176-9b9d-75b486a21cc4
---
**IdoBooking panel "Skrypty → Koniec body" silently truncates content larger than ~62KB.**

The truncation happens DURING SAVE in the panel — no warning shown. The deployed page receives a partial file with:
- Opening `<script>` tag intact
- IIFE start `(function(){ 'use strict'; ...` intact
- Functions defined up to ~62KB mark
- EVERYTHING after that point cut off — including `boot()` definition, `DOMContentLoaded` listener, and IIFE close `})();`
- Because IIFE is unclosed, browser parser absorbs subsequent page HTML as part of the script (looking for next `</script>` tag)
- Result: all functions defined inside the IIFE never execute — page works but custom JS does nothing

**How discovered (Fair Rentals 2026-05-18):**
- v1.49 deploy with 70KB FR_KONIEC_BODY.html appeared to deploy successfully
- Client confirmed deploy, but our map popup fix didn't work live
- MCP chrome-devtools inspection showed deployed script content = 78KB (includes captured HTML pollution)
- Searched deployed script for `function boot()` → NOT FOUND
- Same script in source file at line 1703 → 30KB beyond truncation point
- v1.48 (Google Maps iframe on /contact) also broken in same deploy — `injectGoogleMap()` defined but `boot()` never calls it

**Why:** Likely a database column with VARCHAR(65535) or similar (~64KB). The exact limit appears to be ~62KB after we hit truncation at that approximate size.

**How to apply:**
- **Always keep FR_KONIEC_BODY.html (and equivalent for other clients) under 60KB** as safe target (62KB hard limit)
- After every significant edit, check `wc -c` on the file
- When approaching 60KB, MINIFY: strip block comments `/* */`, strip standalone `// ` line comments
- Use a state-machine-aware minifier that handles strings/regex correctly — naive regex strip can break URL literals like `https://` (the `//` gets confused for line comment if not in string-aware context)
- **NIE trzymaj source w DO_WKLEJENIA/** — user wkleja kilka plików o podobnej nazwie i się myli. Source idzie poza folder DO_WKLEJENIA do `_source/` z jasną nazwą (np. `_ZRODLO.html`)
- Standard pattern:
  - `_source/FILENAME_ZRODLO.html` (annotated, edytowalne źródło)
  - `_source/minify_FILENAME.py` (skrypt regenerujący)
  - `DO_WKLEJENIA/FILENAME.html` (minified, JEDYNY plik z tą nazwą — user wkleja w panelu)
- Reference: Fair Rentals v1.50 — `_source/FR_KONIEC_BODY_ZRODLO.html` + `_source/minify_koniec_body.py` → `DO_WKLEJENIA/FR_KONIEC_BODY.html`
- **Verify deployment**: after panel paste, use chrome-devtools to check `inlineScript.indexOf('function boot') > -1` and `inlineScript.indexOf('})();') > -1`

**Affected clients (potentially):**
- Fair Rentals — confirmed v1.46-v1.49 had truncated boot() (file grew past 62KB)
- Any client with >50KB body_bottom file should be audited for similar issue

**First documented**: Fair Rentals v1.50 hotfix (2026-05-18)
