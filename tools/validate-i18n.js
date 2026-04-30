#!/usr/bin/env node
/**
 * tools/validate-i18n.js
 * ======================
 * Scans every *.html file in the repo, extracts all data-i18n="..." values,
 * and verifies that each key exists in BOTH i18n.de and i18n.en inside i18n.js.
 *
 * Exit 0  — all keys present in both languages.
 * Exit 1  — one or more keys are missing; list printed to stdout.
 *
 * Usage:   node tools/validate-i18n.js
 * npm:     npm run validate:i18n
 */

'use strict';

var fs   = require('fs');
var path = require('path');

// ── 1. Paths ──────────────────────────────────────────────────────────────────

var ROOT    = path.resolve(__dirname, '..');
var I18N_JS = path.join(ROOT, 'i18n.js');

// Directories to scan for HTML files (relative to ROOT)
var HTML_DIRS = [
  ROOT,
  path.join(ROOT, 'pages')
];

// ── 2. Load i18n keys via regex ───────────────────────────────────────────────
//
// i18n.js uses `const i18n = {}` (block-scoped), so vm.runInNewContext cannot
// expose it via the sandbox.  We extract keys directly with regex, which is
// simpler and more reliable for this specific file structure:
//
//   i18n['de'] = { 'key': 'value', ... };       ← block assignments
//   i18n['de']['some_key'] = 'value';            ← individual assignments

// Matches  'key'  or  "key"  at the start of an object-literal line.
// Used inside the multi-line block `i18n['de'] = { ... }`.
var BLOCK_KEY_RE = /^\s+['"]([^'"]+)['"]\s*:/gm;

// Matches  i18n['de']['key'] = ...  or  i18n["en"]["key"] = ...
var ASSIGN_KEY_RE = /i18n\s*\[['"]([a-z]{2})['"]\]\s*\[['"]([^'"]+)['"]\]/g;

function extractBlockKeys(src, lang) {
  // Find the block  i18n['de'] = {  ...  };
  // We use a simple bracket-counter approach to find the matching close-brace.
  var openPattern = new RegExp("i18n\\['" + lang + "'\\]\\s*=\\s*\\{");
  var openMatch = openPattern.exec(src);
  if (!openMatch) return {};

  var start = openMatch.index + openMatch[0].length;
  var depth = 1;
  var i = start;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  var block = src.slice(start, i - 1); // content between { ... }

  var keys = {};
  var m;
  BLOCK_KEY_RE.lastIndex = 0;
  while ((m = BLOCK_KEY_RE.exec(block)) !== null) {
    keys[m[1]] = true;
  }
  return keys;
}

function loadI18nKeys() {
  var src = fs.readFileSync(I18N_JS, 'utf8');

  var deKeys = extractBlockKeys(src, 'de');
  var enKeys = extractBlockKeys(src, 'en');

  // Also capture individual assignments: i18n['de']['key'] = ...
  var m;
  ASSIGN_KEY_RE.lastIndex = 0;
  while ((m = ASSIGN_KEY_RE.exec(src)) !== null) {
    var lang = m[1];
    var key  = m[2];
    if (lang === 'de') deKeys[key] = true;
    if (lang === 'en') enKeys[key] = true;
  }

  if (Object.keys(deKeys).length === 0) {
    console.error('ERROR: No keys found for i18n[\'de\'] — check I18N_JS path.');
    process.exit(2);
  }
  if (Object.keys(enKeys).length === 0) {
    console.error('ERROR: No keys found for i18n[\'en\'] — check I18N_JS path.');
    process.exit(2);
  }

  return { de: deKeys, en: enKeys };
}

// ── 3. Collect HTML files ─────────────────────────────────────────────────────

function collectHtmlFiles() {
  var files = [];
  HTML_DIRS.forEach(function (dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(function (name) {
      if (name.endsWith('.html')) {
        files.push(path.join(dir, name));
      }
    });
  });
  return files;
}

// ── 4. Extract data-i18n keys from HTML ──────────────────────────────────────

// Matches data-i18n="some_key"  or  data-i18n='some_key'
var DATA_I18N_RE   = /data-i18n=["']([^"']+)["']/g;
// Matches data-i18n-aria="some_key"  or  data-i18n-placeholder="some_key"
var DATA_I18N_X_RE = /data-i18n-[a-z]+?=["']([^"']+)["']/g;

function extractKeysFromFile(filePath) {
  var src  = fs.readFileSync(filePath, 'utf8');
  var keys = [];
  var m;

  DATA_I18N_RE.lastIndex = 0;
  while ((m = DATA_I18N_RE.exec(src)) !== null) {
    keys.push({ key: m[1], file: filePath });
  }

  DATA_I18N_X_RE.lastIndex = 0;
  while ((m = DATA_I18N_X_RE.exec(src)) !== null) {
    keys.push({ key: m[1], file: filePath });
  }

  return keys;
}

// ── 5. Main ───────────────────────────────────────────────────────────────────

function main() {
  var maps  = loadI18nKeys();
  var deMap = maps.de;
  var enMap = maps.en;

  var htmlFiles = collectHtmlFiles();
  if (htmlFiles.length === 0) {
    console.log('No HTML files found — nothing to validate.');
    process.exit(0);
  }

  // Collect all (key, file) pairs across all HTML files
  var allEntries = [];
  htmlFiles.forEach(function (f) {
    extractKeysFromFile(f).forEach(function (e) { allEntries.push(e); });
  });

  // Deduplicate by key for summary reporting, but keep per-file info for details
  var missingDe = {};
  var missingEn = {};

  allEntries.forEach(function (entry) {
    var k = entry.key;
    var rel = path.relative(ROOT, entry.file).replace(/\\/g, '/');

    if (!Object.prototype.hasOwnProperty.call(deMap, k)) {
      if (!missingDe[k]) missingDe[k] = [];
      if (missingDe[k].indexOf(rel) === -1) missingDe[k].push(rel);
    }
    if (!Object.prototype.hasOwnProperty.call(enMap, k)) {
      if (!missingEn[k]) missingEn[k] = [];
      if (missingEn[k].indexOf(rel) === -1) missingEn[k].push(rel);
    }
  });

  var totalKeys  = Object.keys(deMap).length + Object.keys(enMap).length;
  var missingDeKeys = Object.keys(missingDe);
  var missingEnKeys = Object.keys(missingEn);
  var totalMissing  = new Set(missingDeKeys.concat(missingEnKeys)).size;

  console.log('');
  console.log('=== validate-i18n ===');
  console.log('HTML files scanned : ' + htmlFiles.length);
  console.log('i18n.de keys       : ' + Object.keys(deMap).length);
  console.log('i18n.en keys       : ' + Object.keys(enMap).length);
  console.log('data-i18n refs     : ' + allEntries.length);
  console.log('');

  if (totalMissing === 0) {
    console.log('✓ All keys present in both languages.');
    console.log('');
    process.exit(0);
  }

  // Report missing keys
  if (missingDeKeys.length > 0) {
    console.log('MISSING in i18n.de (' + missingDeKeys.length + '):');
    missingDeKeys.sort().forEach(function (k) {
      console.log('  • ' + k);
      missingDe[k].forEach(function (f) { console.log('      referenced in: ' + f); });
    });
    console.log('');
  }

  if (missingEnKeys.length > 0) {
    console.log('MISSING in i18n.en (' + missingEnKeys.length + '):');
    missingEnKeys.sort().forEach(function (k) {
      console.log('  • ' + k);
      missingEn[k].forEach(function (f) { console.log('      referenced in: ' + f); });
    });
    console.log('');
  }

  console.log('Fix: add the missing keys to i18n.js in both i18n[\'de\'] and i18n[\'en\'].');
  console.log('');
  process.exit(1);
}

main();
