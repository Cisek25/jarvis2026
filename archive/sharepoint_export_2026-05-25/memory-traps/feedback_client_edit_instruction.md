---
name: Client edit instructions — exception, fixed 8-section format
description: Default = NO self-edit instructions for clients. When client requests them, use 8-section defensive format (backup first, text/image rules, footer source, logo warning, undo steps). Pattern saved in repo memory.
type: feedback
originSessionId: 4e20fd18-b78f-4e49-ba4c-78caeeb4d99d
---
Rule: normalnie JARVIS nie pisze instrukcji edycji dla klienta — klient dostaje tylko kod do wklejenia. Instrukcje tylko gdy klient wprost o nie prosi.

**Why:** instrukcje = ryzyko połamanego HTML + ticket na naprawę. Gdy już piszemy, muszą być maksymalnie defensywne.

**How to apply:** użyj 8-sekcyjnego formatu zapisanego w `jarvis/memory/instincts/030-client-content-edit-instruction.md`. Zapisuj plik jako `clients/{klient}/DO_WKLEJENIA/INSTRUKCJA_EDYCJI_KLIENT.md` (nie myl z `INSTRUKCJA.txt` dla operatora wklejającego kod). Pierwszy wzór: Piekary13 (2026-04-23).
