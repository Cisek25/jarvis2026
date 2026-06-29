# BUILD CONTRACT — EcoCamping Spytkowice

> AUTO-generowany przez `node scripts/jarvis.js contract ecocamping`. NIE edytuj ręcznie.
> Źródło faktów: `clients/ecocamping/brief.yaml`.

**Engine:** 57820 · **Prefix:** `ec-` · **Theme:** default13 · **Języki:** pl+en · **Vibe:** eco-glamping

Fakty bramkujące: fullpage=false · hotspot=true · has_offer=true · shared_engine=false

---

## MUST-APPLY trapy (wg faktów tego klienta)

### Uniwersalne (każdy klient)

- [ ] **B1** — NO emoji w plikach panelu  
  ↳ `memory/feedback_no_emoji_client_code.md`
- [ ] **B2** — Podmień wszystkie placeholdery generatora  
  ↳ `memory/feedback_css_generator_placeholders_unsubstituted.md`
- [ ] **B3** — Prefiks --xx-/.xx- → --<prefix>-  
  ↳ `memory/pattern_baseline_v2.md`
- [ ] **B8** — Powered by IdoBooking widoczne (filter:none, opacity ≥0.85)  
  ↳ `memory/feedback_powered_by_idobooking_visible.md`

### default13 baseline

- [ ] **TRAP-01** — default13 baseline selectors matched (3× !important)  
  ↳ `memory/feedback_idobooking_default13_baseline_selectors.md`
- [ ] **TRAP-09** — Ken Burns zoom kill — scale(1) ×4 selektory  
  ↳ `memory/feedback_idobooking_default13_hero_ken_burns_zoom.md`
- [ ] **root10** — html root 10px → konwertuj rem→px  
  ↳ `memory/feedback_idobooking_default13_root_10px_rem.md`

### Wyróżnione oferty (hotspot)

- [ ] **TRAP-02** — killHotspotDuplicates() + .container-hotspot{display:none}  
  ↳ `memory/feedback_offers_page_defaults.md`

### Podstrona /offer/N

- [ ] **chip** — Offer price chip = prostokąt h64 r12 (NIE pill)  
  ↳ `memory/feedback_offer_price_chip_layout.md`
- [ ] **pwsvg** — Powered-by SVG variant zgodny z tłem stopki  
  ↳ `memory/feedback_powered_by_svg_variant_mismatch.md`
- [ ] **defaults** — /offers + /offer/N — 18-punktowy starter  
  ↳ `memory/feedback_offers_page_defaults.md`

### Wielojęzyczność

- [ ] **i18n** — System button text — translateLabel per html[lang]  
  ↳ `memory/feedback_system_button_text_i18n.md`
- [ ] **hreflang** — hreflang tags w HEAD per podstrona  
  ↳ `memory/reference_idobooking_seo_audit.md`
- [ ] **enroute** — EN routing /en/ + weryfikacja statusu slugów  
  ↳ `memory/feedback_idobooking_en_routing_and_slug_verify.md`

### Mobilna nawigacja (zawsze testuj 375 i 768)

- [ ] **navdrawer** — Hamburger POZA off-screen drawerem; fallback initNavFallback  
  ↳ `memory/feedback_idobooking_home_bxslider_breaks_mobile_menu.md`
- [ ] **backdrop** — Backdrop z-index < header  
  ↳ `memory/feedback_idobooking_mobile_drawer_backdrop_zindex_above_header.md`

---

_16 trapów do zastosowania. Po zbudowaniu plików: `node scripts/jarvis.js lint ecocamping` MUSI być zielony._
