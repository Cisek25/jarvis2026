# Workflow: New Client Kickoff

Step-by-step procedure dla **kolejnego klienta** IdoSell/IdoBooking. Zapewnia że nic nie ginie i że strona od startu jest budowana wg best practices z 11 ukończonych projektów.

**Last updated**: 2026-05-20 (after Fair Rentals v1.69 + RPA v2.0)

---

## 📋 Faza 0 — Intake (30-60 min, przed pisaniem kodu)

### Step 0.1 — Otrzymaj brief od klienta
Wymagane od klienta:
- [ ] **Panel URL** (np. `https://clientXXXXX.idobooking.com/` lub `.idosell.com`)
- [ ] **Brand name** + skrócona nazwa (do logo/nagłówków)
- [ ] **NIP** (do impressum/regulamin)
- [ ] **Adres siedziby** (do footer + structured data)
- [ ] **Telefon + email** (oba widoczne w stopce)
- [ ] **Profil**: apartamenty / camping / hotel / kombinacja
- [ ] **Lokalizacja**: miasto, dzielnica, blisko czego (do SEO)
- [ ] **Języki**: PL only / + EN / + DE / + RU / + ES
- [ ] **Kolory marki (HEX)**: primary, accent, dark, light
- [ ] **Fonty preferowane**: jeśli nie wiesz → proponuj
- [ ] **Tonalność**: formalna / swobodna / luksusowa / przyjazna
- [ ] **Inspiracje**: 3 strony które klient lubi + 2 których NIE lubi
- [ ] **Targety**: krajowi / zagraniczni / biznesowi / pary / rodziny
- [ ] **Liczba apartamentów/obiektów** do prezentacji
- [ ] **Termin idealny + akceptowalny**
- [ ] **Must-have features** (lista) + nice-to-have

Wzorzec: `/Users/user/Desktop/jarvis/templates/BRIEF_KLIENTA.docx`

### Step 0.2 — Wyślij FAQ wspolpracy + Brief klientowi
Pliki gotowe w `/Users/user/Desktop/jarvis/templates/`:
- `BRIEF_KLIENTA.docx` (formularz do wypełnienia)
- `FAQ_WSPOLPRACA.docx` (zasady: 60 dni gwarancji, SLA, grupowanie uwag, błędy vs zmiany)

Klient wypełnia BRIEF i odsyła. PRZED tym nie zaczynaj!

### Step 0.3 — Reserved przed otrzymaniem briefa
- Otwórz konkurencję klienta (jeśli wymieniona w briefie)
- Sprawdź ich stack (DevTools → Network → CSS files)
- Note inspiracje

---

## 🔍 Faza 1 — RECON (60-120 min, gdy brief otrzymany)

### Step 1.1 — Eksploracja panelu
```bash
# Open panel in browser:
open "https://client<ID>.idobooking.com/"
```

Sprawdź:
- [ ] Header class (`.default13`, `.default10`, `.default9`?) → measure padding-top
- [ ] Slider images count (0/0/1.jpg, 0/0/2.jpg... do jakiego numeru?)
- [ ] Offers count (`/offers` URL → list)
- [ ] Body classes na każdym page type (`.page-index`, `.page-txt`, `.page-offers`, `.page-offer`, `.page-contact`)

### Step 1.2 — Scrape oferty z systemu
Per `/offer/<N>/<slug>`:
- Nazwa apartamentu
- Cena od (zł/noc)
- Liczba osób + powierzchnia (m²)
- 1 hero photo (preferuj landscape)
- Co wyróżnia (sauna, parking, taras)

### Step 1.3 — Scrape kontakt
Z `/contact` lub footer:
- Adres dokładny
- Telefon (sformatuj 3-3-3 spacje)
- Email
- WhatsApp (jeśli)
- Social links (Facebook, Instagram)

### Step 1.4 — Sprawdź /images/frontpageGallery/
```bash
for n in $(seq 1 30); do
  curl -sI -o /dev/null -w "image $n: %{http_code}\n" \
    "https://client<ID>.idobooking.com/images/frontpageGallery/pictures/large/0/0/$n.jpg"
done
```
Zostaw listę: które numery existują = co użyć w hero/atrakcjach.

### Step 1.5 — Zapisz w `client_<name>.md`
Stwórz plik w `/Users/user/.claude/projects/-Users-user-Desktop-jarvis/memory/client_<name>.md` zgodnie z formatem (patrz `client_najmar.md` jako wzorzec).

### Step 1.6 — Dodaj do registry
Edytuj `pattern_idosell_clients_db.md` → tabela "Active Clients" → dodaj rząd z statusem "Phase 0 — RECON done".

---

## 🎨 Faza 2 — CSS Design System (~2000-3500 linii)

### Step 2.1 — Setup
```bash
mkdir -p /Users/user/Desktop/jarvis/clients/<name>/{DO_WKLEJENIA,_source,docs,tests}
cd /Users/user/Desktop/jarvis/clients/<name>/DO_WKLEJENIA
```

### Step 2.2 — Stwórz CSS file: `<PREFIX>_ARKUSZ_STYLOW.css`
Skopiuj template z `Fair Rentals/DO_WKLEJENIA/FR_ARKUSZ_STYLOW.css` (~400KB) lub `madera/madera.css` jako referencja.

Sekcje (zachowaj kolejność):
- §0: CSS Variables (`--<prefix>-primary`, `--<prefix>-bg`, fonts, shadows)
- §1: Global resets (`body { font-size: 16px !important; }`)
- §2: Typography
- §3: Header (position: fixed, padding-top measured)
- §4: Hero (.parallax-slider, .index-info z-index 1000, kill ::before overlay)
- §5: Search widget (placeholders via JS, dropdown styles)
- §6: System overrides (#bounce, #backTop, cookie, skip — HARDCODED hex)
- §7: Sections (cards, alternating layouts, CTAs)
- §8-11: Responsive (1200, 1024, 768, 480)
- §12+: Subpage-specific (/offers, /contact, custom subpages)

### Step 2.3 — Apply 44 TRAPS upfront
Skopiuj z `pattern_idosell_websites.md` sekcję "Lessons v1.66-v1.69" (Traps #32-44) + section "IdoSell System Traps (learned from Najmar)" (Traps #1-31).

**Critical traps (must apply do każdego projektu):**
1. Body font 16px (system 22.4px)
2. `.index-info z-index: 1000`
3. `.parallax-slider::before { display: none }`
4. System orange #AD5009 → brand color
5. Header `position: fixed`
6. Powered by widoczne
7. body_top brak `<script>`, inline `style="bg-image"`, emoji
8. `repeat(7, minmax(0, 1fr))` na każdym grid 7-col
9. CSS ≤450KB
10. Logo/hamburger `top: 12px` (NIE 50%)

### Step 2.4 — Mobile-first
Wszystkie media queries:
```css
/* Mobile first */
.foo { ... }

@media (min-width: 720px) {
  .foo { ... desktop }
}
```

NIE odwrotnie (desktop-first + override mobile) — overflow zwykle gorzej traktowany.

---

## 🏗️ Faza 3 — HTML Content (4-6h)

### Step 3.1 — Homepage CMS: `GLOWNA_PL__cms.html`
Sekcje:
1. Hero asym (text + photo, search widget below)
2. Stats (Booking score, Google score, apartamentów, doba hotelowa)
3. Apartamenty (custom cards z m² + osoby + cena od, fed by featured offers z systemu)
4. O nas / dlaczego my
5. Atrakcje teaser (do podstrony)
6. Final CTA

### Step 3.2 — Subpages body_top
Wzorzec: `<PAGE>_<LANG>__body_top.html`
- OBSŁUGA_NAJMU_PL/EN/DE
- DLA_BIZNESU_PL/EN/DE
- O_NAS_PL/EN/DE
- ATRAKCJE_WROCLAWIA_PL/EN/DE (lub <miasta>)
- KONTAKT_PL/EN/DE

**Zero inline styles, zero `<style>` blocks, zero `<script>` tags w body_top!**

### Step 3.3 — HEAD per language
`<PREFIX>_HEAD_PL.html`, `_EN.html`, `_DE.html`
Zawartość:
- OG tags (per lang)
- Schema.org LodgingBusiness
- Google Fonts link
- Meta description (per page jeśli system pozwala)

### Step 3.4 — body_bottom: 1 plik `<PREFIX>_KONIEC_BODY.html`
Moduły (każdy z markerem `/* §X. <name> */`):
- §1 Scroll reveal
- §2 Smooth scroll
- §3 Mobile menu toggle (uwaga: top:12, nie 50%)
- §4 Lazy loading
- §5 Search widget placeholders (Litepicker config — `dropdowns: isDesktop ? {...} : false`)
- §6 Filter collapse (jeśli /offers)
- §7 FAQ accordion (jeśli FAQ)
- §8 Phone/email auto-pull
- §9 Custom cards (featured offers z `.container-hotspot`)
- §10 Boot (per page detection + init)

**Limit: 62KB (system silent truncate)**. Source w `_source/`, minify z `minify_*.py`.

---

## 📦 Faza 4 — Delivery

### Step 4.1 — INSTRUKCJA.txt
Step-by-step paste guide. Per file → konkretne pole w panelu:
```
1. CSS:
   Panel → Wygląd → Arkusz stylów CSS → wklej całą zawartość <PREFIX>_ARKUSZ_STYLOW.css
   
2. HEAD:
   Panel → Ustawienia → Kody śledzące → Sekcja Head → wklej <PREFIX>_HEAD_PL.html
   (powtórz dla EN i DE w odpowiednich językowych wersjach)
   
3. Body bottom (1 dla wszystkich):
   Panel → Treść → Konfiguracja → KONIEC body → wklej <PREFIX>_KONIEC_BODY.html
   
4. body_top per page:
   Per podstrona → Treść → body_top → wklej odpowiedni plik
```

### Step 4.2 — Mandatory pre-deploy check (skill: idosell-deploy-cr)
```
/idosell-deploy-cr
```

5 BLOCKERS + 4 WARNINGS. NIE wklejaj jeśli FAIL.

### Step 4.3 — User wkleja w panel
Daj user listę plików w kolejności:
1. CSS (cały arkusz)
2. HEAD per lang (3x)
3. body_bottom (1x globalnie)
4. body_top per page (5-8x)

### Step 4.4 — Post-deploy verify (skill: idosell-seo-audit + idosell-e2e-test)
```
/idosell-seo-audit
/idosell-e2e-test
```

---

## ✅ Faza 5 — Sign-off

### Step 5.1 — Run skille
- `/idosell-a11y-audit` — WCAG 2.1 AA check
- `/idosell-seo-audit` — Lighthouse final scores
- `/idosell-e2e-test` — wszystkie critical flows PASS

### Step 5.2 — Klient sign-off
Wyślij klientowi:
- Live URL (PL/EN/DE)
- Lighthouse scores screenshot
- Lista 5 quick wins które klient sam zrobi w panelu (jeśli applicable)

### Step 5.3 — Update memory
- `client_<name>.md` → status: LIVE v1.0
- `pattern_idosell_clients_db.md` → status zmień na LIVE
- `MEMORY.md` → upewnij się że klient jest w "Active Clients" list

### Step 5.4 — Setup monitoring (long-term)
- Quarterly: re-run a11y + SEO audits (skill auto-prompt)
- Klient zgłasza issue → `idosell-bug-debug` skill aktywowany

---

## 🔁 Faza 6 — Iteracje (po sign-off, klient zgłasza zmiany)

### Step 6.1 — Receive grouping
Klient wysyła GRUPOWO uwagi (per FAQ_WSPOLPRACA.docx: max 1 zestaw/tydzień).

### Step 6.2 — Triage
Per uwaga: czy to BŁĄD (60 dni gwarancji, free) czy ZMIANA (revision, billable)?

### Step 6.3 — Bug debug
`/idosell-bug-debug` per zgłoszenie. Output: `clients/<name>/BUG_<data>_<short>.md`.

### Step 6.4 — Release notes
Update `clients/<name>/RELEASE_NOTES_vX.Y.md` po każdym fix.

### Step 6.5 — Update client memory
`client_<name>.md` → sekcja "Co już zrobione" + "Aktywne issue / TODO".

---

## 🛠️ Skills do uruchomienia per faza

| Faza | Skill | Trigger |
|------|-------|---------|
| 0 — Intake | (templates docx/pdf) | Wyślij BRIEF + FAQ |
| 1 — Recon | `idosell-website-builder` (Phase 0) | "nowy klient", panel URL |
| 2 — CSS | `idosell-website-builder` (Phase 1) | po recon |
| 3 — HTML | `idosell-website-builder` (Phase 2-4) | po CSS |
| 4 — Pre-deploy | `idosell-deploy-cr` | "wklej w panel" |
| 4 — Post-deploy | `idosell-seo-audit`, `idosell-e2e-test` | po wkleju |
| 5 — Sign-off | `idosell-a11y-audit` | przed sign-off |
| 6 — Iteracje | `idosell-bug-debug` | klient zgłasza bug |
| Maintenance | `idosell-memory-consolidate` | monthly |

---

## ⚡ Quick wins z 11 projektów (apply automatycznie do nowego klienta)

1. Mobile-first CSS architecture (nie desktop-first)
2. Custom apartments cards (system hotspot hidden, custom rendered z m² + osoby + cena)
3. Litepicker `dropdowns: isDesktop ? {...} : false`
4. Map widget event delegation (sanitizer-safe)
5. Schema.org LodgingBusiness w HEAD
6. WCAG kontrast 4.5:1 minimum, touch targets ≥44×44
7. Lazy loading na wszystkich images
8. Brak inline styles w body_top (sanitizer)
9. `<script>` ZAWSZE w body_bottom (nigdy w body_top)
10. Pre-deploy `idosell-deploy-cr` check (zero deploy with secrets)

---

## 📊 Czas budowy (avg z 11 projektów)

| Faza | Czas |
|------|------|
| 0 — Intake | 1-2h (większość czeka na brief od klienta) |
| 1 — Recon | 1-2h |
| 2 — CSS | 4-8h (largest variation) |
| 3 — HTML | 4-6h |
| 4 — Delivery | 1h (jeśli check passed) |
| 5 — Sign-off | 1h (po klient verification) |
| **TOTAL build time** | **11-19h** (PL only) |
| EN/DE addons | +2-4h each |

Cykl iteracji (per sprint): 1-3h.

---

## 🧾 Output deliverables per klient

```
/Users/user/Desktop/jarvis/clients/<name>/
├── BRIEF.md                              # wypełniony przez klienta (lub przez nas z briefa)
├── DO_WKLEJENIA/
│   ├── <PREFIX>_ARKUSZ_STYLOW.css        # ~400KB max
│   ├── <PREFIX>_KONIEC_BODY.html         # ~57KB max
│   ├── <PREFIX>_HEAD_PL.html
│   ├── <PREFIX>_HEAD_EN.html
│   ├── <PREFIX>_HEAD_DE.html
│   ├── GLOWNA_PL__cms.html
│   ├── GLOWNA_EN__cms.html
│   ├── GLOWNA_DE__cms.html
│   ├── ATRAKCJE_PL__body_top.html
│   ├── ATRAKCJE_EN__body_top.html
│   ├── ATRAKCJE_DE__body_top.html
│   ├── OBSLUGA_NAJMU_PL/EN/DE__body_top.html
│   ├── DLA_BIZNESU_PL/EN/DE__body_top.html
│   ├── O_NAS_PL/EN/DE__body_top.html
│   ├── BLOG_LIST_PL/EN/DE__body_top.html
│   └── INSTRUKCJA.txt                    # paste guide for client
├── _source/                              # before minify
│   └── <PREFIX>_KONIEC_BODY_ZRODLO.html
├── docs/
│   ├── RELEASE_NOTES_v1.0.md            # initial release
│   ├── AUDIT_LH_<date>.md               # Lighthouse audits
│   ├── AUDIT_A11Y_<date>.md             # accessibility audit
│   ├── E2E_<date>.md                    # E2E test runs
│   └── BUG_<date>_<short>.md            # bug fixes per issue
└── tests/
    ├── flows.yaml                       # E2E flow definitions
    └── baseline/                        # baseline screenshots
```

---

## 🎯 Success metrics per klient

| Metric | Target | Source |
|--------|--------|--------|
| Lighthouse Performance (mobile) | ≥85 | `idosell-seo-audit` |
| Lighthouse SEO | 100 | `idosell-seo-audit` |
| Lighthouse Accessibility | ≥90 | `idosell-a11y-audit` |
| WCAG 2.1 AA compliance | ≥95% | `idosell-a11y-audit` |
| E2E critical flows PASS | 100% | `idosell-e2e-test` |
| Visual regression alerts | <5% per quarter | `idosell-e2e-test` |
| Bug fix iterations | <2 wersji per issue | `idosell-bug-debug` discipline |
| CSS size | <400KB | `idosell-deploy-cr` |
| body_bottom size | <60KB (z marginesem) | `idosell-deploy-cr` |
| Pre-deploy CR PASS | 100% (every deploy) | `idosell-deploy-cr` |
