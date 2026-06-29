'use strict';
/**
 * JARVIS — single source of truth for brief parsing, file classification,
 * the fact→trap contract mapping, and the linter rules.
 *
 * Used by scripts/jarvis.js (contract / lint / lint-hook).
 * Zero dependencies (Node built-ins only).
 */

// ---------------------------------------------------------------------------
// Minimal YAML reader — supports the brief.yaml subset only:
//   key: scalar | "quoted" | [inline, list] | { inline: map }
//   key:
//     - block
//     - list
//   key:
//     subkey: value          (one level of block map)
// Comments (#) and blank lines ignored.
// ---------------------------------------------------------------------------
function parseScalar(raw) {
  let s = String(raw).trim();
  // strip trailing inline comment when not inside quotes
  if (!/^["'[{]/.test(s)) {
    const h = s.indexOf(' #');
    if (h > -1) s = s.slice(0, h).trim();
  }
  if (s === '' ) return '';
  if (/^".*"$/.test(s)) return s.slice(1, -1);
  if (/^'.*'$/.test(s)) return s.slice(1, -1);
  if (/^\[.*\]$/.test(s)) {
    return s.slice(1, -1).split(',').map(x => parseScalar(x)).filter(x => x !== '');
  }
  if (/^\{.*\}$/.test(s)) {
    const o = {};
    s.slice(1, -1).split(',').forEach(p => {
      const i = p.indexOf(':');
      if (i > -1) o[p.slice(0, i).trim()] = parseScalar(p.slice(i + 1));
    });
    return o;
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  return s;
}

function indentOf(line) { return line.length - line.replace(/^ +/, '').length; }

function parseBrief(text) {
  const root = {};
  const lines = text.split(/\r?\n/);
  // pre-filter: drop blank & full-comment lines, keep indices irrelevant
  const rows = lines
    .map(l => l.replace(/\t/g, '  '))
    .filter(l => l.trim() !== '' && !/^\s*#/.test(l));

  for (let i = 0; i < rows.length; i++) {
    const line = rows[i];
    if (indentOf(line) !== 0) continue; // handled by look-ahead below
    const m = line.match(/^([A-Za-z0-9_]+):(.*)$/);
    if (!m) continue;
    const key = m[1];
    const rest = m[2].trim();
    if (rest !== '') { root[key] = parseScalar(rest); continue; }

    // block structure: collect indented children
    const children = [];
    let j = i + 1;
    while (j < rows.length && indentOf(rows[j]) > 0) { children.push(rows[j]); j++; }
    i = j - 1;
    if (children.length === 0) { root[key] = ''; continue; }
    if (children.every(c => /^\s*-\s+/.test(c))) {
      root[key] = children.map(c => parseScalar(c.replace(/^\s*-\s+/, '')));
    } else {
      const obj = {};
      children.forEach(c => {
        const cm = c.trim().match(/^([A-Za-z0-9_]+):(.*)$/);
        if (cm) obj[cm[1]] = parseScalar(cm[2]);
      });
      root[key] = obj;
    }
  }
  return root;
}

// ---------------------------------------------------------------------------
// File classification — by name pattern (names differ across clients).
// ---------------------------------------------------------------------------
function classifyFile(name) {
  const n = name.toLowerCase();
  if (n.endsWith('.css')) return 'css';
  if (n.includes('body_top')) return 'body_top';
  if (n.includes('koniec_body') || n.includes('body_bottom')) return 'body_bottom';
  if (n.includes('head')) return 'head';
  return 'doc'; // .md .txt etc — NOT pasted into panel, skip WAF checks
}
const PANEL = new Set(['css', 'body_top', 'body_bottom', 'head']);

// ---------------------------------------------------------------------------
// CONTRACT — fact → applicable traps (also drives conditional lint signatures).
// ---------------------------------------------------------------------------
const contractRules = [
  {
    id: 'always',
    when: () => true,
    label: 'Uniwersalne (każdy klient)',
    traps: [
      { code: 'B1', title: 'NO emoji w plikach panelu', ref: 'feedback_no_emoji_client_code.md' },
      { code: 'B2', title: 'Podmień wszystkie placeholdery generatora', ref: 'feedback_css_generator_placeholders_unsubstituted.md' },
      { code: 'B3', title: 'Prefiks --xx-/.xx- → --<prefix>-', ref: 'pattern_baseline_v2.md' },
      { code: 'B8', title: 'Powered by IdoBooking widoczne (filter:none, opacity ≥0.85)', ref: 'feedback_powered_by_idobooking_visible.md' },
    ],
  },
  {
    id: 'default13',
    when: b => str(b.theme).includes('default13'),
    label: 'default13 baseline',
    traps: [
      { code: 'TRAP-01', title: 'default13 baseline selectors matched (3× !important)', ref: 'feedback_idobooking_default13_baseline_selectors.md' },
      { code: 'TRAP-09', title: 'Ken Burns zoom kill — scale(1) ×4 selektory', ref: 'feedback_idobooking_default13_hero_ken_burns_zoom.md' },
      { code: 'root10', title: 'html root 10px → konwertuj rem→px', ref: 'feedback_idobooking_default13_root_10px_rem.md' },
    ],
  },
  {
    id: 'fullpage',
    when: b => truthy(b.fullpage),
    label: 'fullpage.js home',
    traps: [
      { code: 'TRAP-07', title: 'Litepicker --static centering', ref: 'feedback_idobooking_litepicker_static_centering.md' },
      { code: 'scrim', title: 'Hero scrim .fp-tableCell::before multi-def', ref: 'feedback_idobooking_hero_scrim_fp_tablecell_multidef.md' },
      { code: 'subwrap', title: 'body_top owinięty w .section_sub.container → full-bleed fix', ref: 'feedback_idobooking_bodytop_section_sub_container_fullbleed.md' },
    ],
  },
  {
    id: 'hotspot',
    when: b => truthy(b.hotspot),
    label: 'Wyróżnione oferty (hotspot)',
    traps: [
      { code: 'TRAP-02', title: 'killHotspotDuplicates() + .container-hotspot{display:none}', ref: 'feedback_offers_page_defaults.md' },
    ],
  },
  {
    id: 'offer',
    when: b => truthy(b.has_offer),
    label: 'Podstrona /offer/N',
    traps: [
      { code: 'chip', title: 'Offer price chip = prostokąt h64 r12 (NIE pill)', ref: 'feedback_offer_price_chip_layout.md' },
      { code: 'pwsvg', title: 'Powered-by SVG variant zgodny z tłem stopki', ref: 'feedback_powered_by_svg_variant_mismatch.md' },
      { code: 'defaults', title: '/offers + /offer/N — 18-punktowy starter', ref: 'feedback_offers_page_defaults.md' },
    ],
  },
  {
    id: 'i18n',
    when: b => langs(b).length > 1,
    label: 'Wielojęzyczność',
    traps: [
      { code: 'i18n', title: 'System button text — translateLabel per html[lang]', ref: 'feedback_system_button_text_i18n.md' },
      { code: 'hreflang', title: 'hreflang tags w HEAD per podstrona', ref: 'reference_idobooking_seo_audit.md' },
      { code: 'enroute', title: 'EN routing /en/ + weryfikacja statusu slugów', ref: 'feedback_idobooking_en_routing_and_slug_verify.md' },
    ],
  },
  {
    id: 'shared',
    when: b => truthy(b.shared_engine),
    label: 'Shared engine (multi-property)',
    traps: [
      { code: 'neutral', title: 'Brand-neutral mode na /offer/N', ref: 'feedback_offers_page_defaults.md' },
    ],
  },
  {
    id: 'mobilenav',
    when: () => true,
    label: 'Mobilna nawigacja (zawsze testuj 375 i 768)',
    traps: [
      { code: 'navdrawer', title: 'Hamburger POZA off-screen drawerem; fallback initNavFallback', ref: 'feedback_idobooking_home_bxslider_breaks_mobile_menu.md' },
      { code: 'backdrop', title: 'Backdrop z-index < header', ref: 'feedback_idobooking_mobile_drawer_backdrop_zindex_above_header.md' },
    ],
  },
];

// ---------------------------------------------------------------------------
// LINT RULES
//   level: 'block' | 'warn'
//   scope: file category the rule applies to ('any' = any panel file)
//   when:  optional (brief)=>bool gate for conditional rules
//   For presence rules use `requirePresent: true` + `targetScope`.
// ---------------------------------------------------------------------------
const lintRules = [
  // --- universal blockers (per-file content) ---
  { id: 'B1-emoji', level: 'block', scope: 'any',
    re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F0FF}\u{FE00}-\u{FE0F}]/u,
    msg: 'Emoji — WAF IdoSell odrzuci zapis', ref: 'feedback_no_emoji_client_code.md' },

  { id: 'B2-placeholder', level: 'block', scope: 'any',
    re: /\[HARDCODED_|\{\{\s*\w|\{prefix\}|<NUMER>|<PREFIX>|XXXXX/,
    msg: 'Niepodmieniony placeholder generatora', ref: 'feedback_css_generator_placeholders_unsubstituted.md' },

  { id: 'B3-prefix', level: 'block', scope: 'css',
    re: /(^|[^A-Za-z])(--xx-|\.xx-)/m,
    msg: 'Prefiks xx- nie podmieniony na docelowy', ref: 'pattern_baseline_v2.md' },

  { id: 'B4-secret', level: 'block', scope: 'any',
    re: /AIza[0-9A-Za-z_\-]{35}|sk_live_[0-9a-zA-Z]+|gh[pousr]_[0-9a-zA-Z]{20,}|Bearer\s+[A-Za-z0-9._\-]{20,}/,
    msg: 'Możliwy sekret/API key — NIE wklejać', ref: 'idosell-deploy-cr' },

  { id: 'B6-bodytop-script', level: 'block', scope: 'body_top',
    re: /<script\b|<style\b|style\s*=\s*["'][^"']*url\s*\(/i,
    msg: 'body_top: <script>/<style>/inline url() — sanitizer wytnie', ref: 'feedback_idobooking_body_top_inline_style_stripped.md' },

  { id: 'B7-polish-selector', level: 'block', scope: 'css',
    re: /[.#][A-Za-z0-9_-]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/,
    msg: 'Polski znak w selektorze class/id', ref: 'feedback_polish_diacritics_visible_text.md' },

  // --- universal warnings ---
  { id: 'W-svg-hash', level: 'warn', scope: 'css',
    re: /url\(["']?data:image\/svg\+xml[^)]*#[0-9A-Fa-f]{3,6}/,
    msg: 'SVG data-URI: użyj %23 zamiast # dla koloru', ref: 'pattern_baseline_v2.md' },

  { id: 'W-pii', level: 'warn', scope: 'body_bottom',
    // email, lub telefon PL: opcjonalny +48 i 9-12 cyfr w grupach (NIE łapie współrzędnych SVG typu "0 0 24 24" — wymaga ≥9 cyfr)
    re: /["'][\w.\-]+@[\w\-]+\.[a-z]{2,}["']|["']\s*(?:\+?48[\s.\-]?)?(?:\d[\s.\-]?){9,12}["']/i,
    msg: 'Możliwy e-mail/telefon w JS — RODO; trzymaj w polach panelu/HTML', ref: 'feedback_polish_diacritics_visible_text.md' },

  // --- size (whole file) ---
  { id: 'B5-bodybottom-size', level: 'block', scope: 'body_bottom', sizeMax: 63488,
    msg: 'body_bottom > 62KB — panel ucina po cichu; minify', ref: 'feedback_idobooking_body_bottom_size_limit.md' },

  // --- universal presence (require signature somewhere) ---
  { id: 'W-powered-by', level: 'warn', requirePresent: true, targetScope: 'css',
    re: /powered[\s_-]?by[\s\S]{0,400}?(filter\s*:\s*none|opacity)/i,
    msg: 'Brak reguły widoczności Powered-by IdoBooking (filter:none/opacity) — wymóg licencyjny', ref: 'feedback_powered_by_idobooking_visible.md' },

  // --- conditional presence (gated by brief) ---
  { id: 'C-hotspot-js', level: 'block', requirePresent: true, targetScope: 'body_bottom',
    when: b => truthy(b.hotspot), re: /killHotspot|container-hotspot/i,
    msg: 'hotspot:true ale body_bottom nie odwołuje się do .container-hotspot (czyta/ukrywa hotspot)', ref: 'feedback_offers_page_defaults.md' },

  { id: 'C-hotspot-css', level: 'block', requirePresent: true, targetScope: 'css',
    when: b => truthy(b.hotspot), re: /container-hotspot[\s\S]{0,120}?display\s*:\s*none/i,
    msg: 'hotspot:true ale brak .container-hotspot{display:none} w CSS', ref: 'feedback_offers_page_defaults.md' },

  { id: 'C-hreflang', level: 'warn', requirePresent: true, targetScope: 'head',
    when: b => langs(b).length > 1, re: /hreflang/i,
    msg: 'Wielojęzyczność ale brak hreflang w HEAD', ref: 'reference_idobooking_seo_audit.md' },

  { id: 'C-kenburns', level: 'warn', requirePresent: true, targetScope: 'css',
    when: b => str(b.theme).includes('default13'), re: /scale\(1\)\s*!important/,
    msg: 'default13 ale brak Ken-Burns kill (scale(1)!important)', ref: 'feedback_idobooking_default13_hero_ken_burns_zoom.md' },
];

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function str(v) { return (v == null ? '' : String(v)).toLowerCase(); }
function truthy(v) { return v === true || str(v) === 'true' || str(v) === 'yes' || str(v) === 'tak'; }
function langs(b) {
  const j = b.jezyki || b.languages || b.langs;
  if (Array.isArray(j)) return j;
  if (typeof j === 'string' && j) return j.split(/[,\s]+/).filter(Boolean);
  return ['pl'];
}

function contractFor(brief) {
  const out = [];
  for (const r of contractRules) {
    try { if (r.when(brief)) out.push({ id: r.id, label: r.label, traps: r.traps }); }
    catch (_) { /* ignore rule error */ }
  }
  return out;
}

module.exports = { parseBrief, classifyFile, PANEL, contractRules, lintRules, contractFor, langs, truthy, str };
