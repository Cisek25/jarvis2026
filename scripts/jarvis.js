#!/usr/bin/env node
'use strict';
/**
 * JARVIS CLI — enforce known traps on client deliverables.
 *
 *   node scripts/jarvis.js contract <klient>      → write BUILD_CONTRACT.md
 *   node scripts/jarvis.js lint <klient> [--warn-only] [--quiet]
 *   node scripts/jarvis.js lint-hook <path...>    → used by PostToolUse hook
 *
 * <klient> = folder name under clients/ (must contain brief.yaml).
 * Exit code: 0 = OK (no blockers), 1 = blockers found, 2 = usage/IO error.
 */
const fs = require('fs');
const path = require('path');
const R = require('./jarvis-rules');

const ROOT = path.resolve(__dirname, '..');
const CLIENTS = path.join(ROOT, 'clients');

function die(msg, code = 2) { process.stderr.write(msg + '\n'); process.exit(code); }
function readBrief(clientDir) {
  const p = path.join(clientDir, 'brief.yaml');
  if (!fs.existsSync(p)) return null;
  return R.parseBrief(fs.readFileSync(p, 'utf8'));
}
function deliveryDir(clientDir) {
  for (const d of ['DO_WKLEJENIA', 'DO_WKLEJENIA/']) {
    const p = path.join(clientDir, d);
    if (fs.existsSync(p)) return p;
  }
  return path.join(clientDir, 'DO_WKLEJENIA');
}
function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
}

// ---------------------------------------------------------------- contract
function cmdContract(client) {
  const clientDir = path.join(CLIENTS, client);
  const brief = readBrief(clientDir);
  if (!brief) die(`Brak clients/${client}/brief.yaml — najpierw wypełnij (templates/brief.template.yaml).`);
  const groups = R.contractFor(brief);
  const langs = R.langs(brief);

  let md = `# BUILD CONTRACT — ${brief.nazwa || client}\n\n`;
  md += `> AUTO-generowany przez \`node scripts/jarvis.js contract ${client}\`. NIE edytuj ręcznie.\n`;
  md += `> Źródło faktów: \`clients/${client}/brief.yaml\`.\n\n`;
  md += `**Engine:** ${brief.engine_id || '?'} · **Prefix:** \`${brief.prefix || '?'}-\` · `;
  md += `**Theme:** ${brief.theme || '?'} · **Języki:** ${langs.join('+')} · **Vibe:** ${brief.vibe || '?'}\n\n`;
  md += `Fakty bramkujące: fullpage=${!!R.truthy(brief.fullpage)} · hotspot=${!!R.truthy(brief.hotspot)} · `;
  md += `has_offer=${!!R.truthy(brief.has_offer)} · shared_engine=${!!R.truthy(brief.shared_engine)}\n\n`;
  md += `---\n\n## MUST-APPLY trapy (wg faktów tego klienta)\n\n`;

  let n = 0;
  for (const g of groups) {
    md += `### ${g.label}\n\n`;
    for (const t of g.traps) {
      n++;
      md += `- [ ] **${t.code}** — ${t.title}  \n  ↳ \`memory/${t.ref}\`\n`;
    }
    md += `\n`;
  }
  md += `---\n\n_${n} trapów do zastosowania. Po zbudowaniu plików: \`node scripts/jarvis.js lint ${client}\` MUSI być zielony._\n`;

  const out = path.join(clientDir, 'BUILD_CONTRACT.md');
  fs.writeFileSync(out, md);
  process.stdout.write(`✓ Zapisano ${path.relative(ROOT, out)} (${n} trapów, ${groups.length} grup)\n`);
}

// -------------------------------------------------------------------- lint
// opts.presence=false → skip requirePresent/conditional-completeness rules
// (used by the per-write hook so incomplete packages don't false-alarm).
function lintFiles(brief, files, dir, opts = {}) {
  const checkPresence = opts.presence !== false;
  const findings = [];
  const present = {}; // ruleId -> bool (for requirePresent across scope)

  // pre-mark presence rules as "not yet found"
  if (checkPresence) for (const rule of R.lintRules) {
    if (rule.requirePresent && (!rule.when || rule.when(brief))) present[rule.id] = false;
  }

  for (const fname of files) {
    const cat = R.classifyFile(fname);
    const full = path.join(dir, fname);
    let text;
    try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
    const lines = text.split(/\r?\n/);
    const bytes = Buffer.byteLength(text, 'utf8');

    for (const rule of R.lintRules) {
      if (rule.when && !rule.when(brief)) continue;
      const scopeOK = rule.requirePresent
        ? cat === rule.targetScope
        : (rule.scope === 'any' ? R.PANEL.has(cat) : rule.scope === cat);
      if (!scopeOK) continue;

      // size rule
      if (rule.sizeMax != null) {
        if (bytes > rule.sizeMax) findings.push({ level: rule.level, file: fname, line: 0,
          id: rule.id, msg: `${rule.msg} (${(bytes / 1024).toFixed(1)}KB)`, ref: rule.ref });
        continue;
      }

      if (rule.requirePresent) {
        if (checkPresence && rule.re.test(text)) present[rule.id] = true;
        continue;
      }

      // content match → report first hit per file with line number
      if (rule.re) {
        for (let i = 0; i < lines.length; i++) {
          if (rule.re.test(lines[i])) {
            findings.push({ level: rule.level, file: fname, line: i + 1,
              id: rule.id, msg: rule.msg, ref: rule.ref });
            break; // one hit per rule per file is enough signal
          }
        }
      }
    }
  }

  // presence rules: if still false → finding
  if (checkPresence) for (const rule of R.lintRules) {
    if (rule.requirePresent && (!rule.when || rule.when(brief)) && present[rule.id] === false) {
      findings.push({ level: rule.level, file: `(${rule.targetScope})`, line: 0,
        id: rule.id, msg: rule.msg, ref: rule.ref });
    }
  }
  return findings;
}

function reportAndExit(findings, { warnOnly, quiet, label }) {
  const blockers = findings.filter(f => f.level === 'block');
  const warns = findings.filter(f => f.level === 'warn');
  const out = process.stdout;

  if (!quiet) {
    if (findings.length === 0) { out.write(`✅ ${label}: czysto — 0 znalezisk.\n`); }
    else {
      out.write(`\nJARVIS lint — ${label}\n`);
      for (const f of findings) {
        const tag = f.level === 'block' ? '🔴 BLOKER' : '🟡 WARN ';
        const loc = f.line ? `${f.file}:${f.line}` : f.file;
        out.write(`  ${tag} [${f.id}] ${loc}\n           ${f.msg}  ↳ ${f.ref}\n`);
      }
      out.write(`\n  ${blockers.length} blokerów · ${warns.length} ostrzeżeń\n`);
    }
  }
  if (blockers.length > 0 && !warnOnly) process.exit(1);
  process.exit(0);
}

function cmdLint(client, opts) {
  const clientDir = path.join(CLIENTS, client);
  if (!fs.existsSync(clientDir)) die(`Brak katalogu clients/${client}`);
  const brief = readBrief(clientDir) || {};
  const dir = deliveryDir(clientDir);
  const files = listFiles(dir);
  if (files.length === 0) die(`Brak plików w ${path.relative(ROOT, dir)}`, 0);
  const findings = lintFiles(brief, files, dir);
  reportAndExit(findings, { ...opts, label: `${client} (${files.length} plików)` });
}

// --------------------------------------------------------------- lint-hook
// PostToolUse hook entry. Reads edited file paths from argv OR from the hook
// JSON payload on stdin (.tool_input.file_path). Only acts on files inside
// clients/<x>/DO_WKLEJENIA/. Content rules only (presence:false) so a half-built
// package doesn't false-alarm. Exit 2 on blockers → stderr is fed back to Claude.
function collectHookPaths(argPaths, cb) {
  if (argPaths.length) return cb(argPaths);
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', d => { raw += d; });
  process.stdin.on('end', () => {
    const paths = [];
    try {
      const j = JSON.parse(raw);
      const ti = j.tool_input || {};
      if (ti.file_path) paths.push(ti.file_path);
      if (Array.isArray(ti.file_paths)) paths.push(...ti.file_paths);
    } catch (_) { /* no/invalid stdin → nothing to lint */ }
    cb(paths);
  });
  // guard: if stdin never ends (no pipe), don't hang
  setTimeout(() => cb([]), 1500).unref?.();
}

function cmdLintHook(argPaths) {
  collectHookPaths(argPaths, (paths) => {
    const clients = new Set();
    for (const p of paths) {
      const m = path.resolve(p).match(/[/\\]clients[/\\]([^/\\]+)[/\\]DO_WKLEJENIA[/\\]/);
      if (m) clients.add(m[1]);
    }
    if (clients.size === 0) process.exit(0);
    let blockTotal = 0;
    for (const client of clients) {
      const clientDir = path.join(CLIENTS, client);
      const brief = readBrief(clientDir) || {};
      const dir = deliveryDir(clientDir);
      const findings = lintFiles(brief, listFiles(dir), dir, { presence: false });
      const blockers = findings.filter(f => f.level === 'block');
      blockTotal += blockers.length;
      if (findings.length) {
        process.stderr.write(`\nJARVIS lint (${client}): ${blockers.length} blokerów, ${findings.length - blockers.length} ostrzeżeń:\n`);
        for (const f of findings) {
          const tag = f.level === 'block' ? 'BLOKER' : 'warn';
          const loc = f.line ? `${f.file}:${f.line}` : f.file;
          process.stderr.write(`  [${tag}] ${loc} — ${f.msg} (${f.ref})\n`);
        }
        process.stderr.write(`  (pełna bramka: node scripts/jarvis.js lint ${client})\n`);
      }
    }
    process.exit(blockTotal > 0 ? 2 : 0);
  });
}

// -------------------------------------------------------------------- main
function main() {
  const [, , cmd, ...rest] = process.argv;
  const flags = new Set(rest.filter(a => a.startsWith('--')));
  const args = rest.filter(a => !a.startsWith('--'));
  const opts = { warnOnly: flags.has('--warn-only'), quiet: flags.has('--quiet') };

  switch (cmd) {
    case 'contract': if (!args[0]) die('Użycie: jarvis.js contract <klient>'); return cmdContract(args[0]);
    case 'lint': if (!args[0]) die('Użycie: jarvis.js lint <klient> [--warn-only] [--quiet]'); return cmdLint(args[0], opts);
    case 'lint-hook': return cmdLintHook(args);
    default:
      die('JARVIS CLI\n  contract <klient>   — generuj BUILD_CONTRACT.md z brief.yaml\n  lint <klient>       — sprawdź DO_WKLEJENIA/ (exit 1 = blokery)\n  lint-hook <path...> — tryb hooka (advisory)');
  }
}
main();
