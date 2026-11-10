#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const KNOWN_CATEGORIES = [
  'gemüse','fleisch','fisch','milchprodukte','getreide',
  'öle','gewürze','kräuter','saucen','obst',
  'nüsse','süßes','eier','getränke','fertigprodukte'
];

// ─────────────────────────────────────────────
// 1. LOAD EXISTING INGREDIENT SET
// ─────────────────────────────────────────────

/**
 * Returns a Set of all ingredient strings (lowercased) already in ingredients.js.
 * @param {string} ingredientsPath
 * @returns {Set<string>}
 */
function loadIngredientSet(ingredientsPath) {
  const src = fs.readFileSync(ingredientsPath, 'utf8').replace(/\r\n/g, '\n');
  const start = src.indexOf('var ingredientsDatabase = {');
  const end   = src.indexOf('\n};', start);
  if (start === -1 || end === -1) throw new Error('ingredientsDatabase block not found');
  const section = src.slice(start, end);
  const set = new Set();
  const re = /'([^'\\]*)'/g;
  let m;
  while ((m = re.exec(section)) !== null) set.add(m[1].toLowerCase().trim());
  return set;
}

// ─────────────────────────────────────────────
// 2. SAFE STRING ESCAPE
// ─────────────────────────────────────────────

function escStr(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ─────────────────────────────────────────────
// 3. INSERT INTO CATEGORY ARRAY
// ─────────────────────────────────────────────

/**
 * Appends `ingredient` to the named category array in fileContent.
 * Returns the updated content, or null if the category was not found.
 * @param {string}   fileContent  - Full file text (CRLF already normalised to LF).
 * @param {string}   category
 * @param {string}   ingredient
 * @returns {string|null}
 */
function appendIngredientToCategory(fileContent, category, ingredient) {
  fileContent = fileContent.replace(/\r\n/g, '\n');
  const marker   = `  ${category}: [`;
  const catStart = fileContent.indexOf(marker);
  if (catStart === -1) return null;

  const closeIdx = fileContent.indexOf('\n  ]', catStart);
  if (closeIdx === -1) return null;

  // Add trailing comma to last item if missing, then append new item.
  const before    = fileContent.slice(0, closeIdx);
  const trimmed   = before.trimEnd();
  const comma     = trimmed[trimmed.length - 1] === ',' ? '' : ',';
  const whitespace = before.slice(trimmed.length);

  return (
    trimmed + comma +
    `\n    '${escStr(ingredient)}'` +
    whitespace +
    fileContent.slice(closeIdx)
  );
}

// ─────────────────────────────────────────────
// 4. MAIN UPDATE FUNCTION
// ─────────────────────────────────────────────

/**
 * Adds new ingredients to ingredients.js, skipping duplicates.
 *
 * @param {{
 *   ingredientsPath: string,
 *   newIngredients:  Array<{ de: string, category: string }>,
 *   dryRun?:         boolean,
 *   logger?:         { log: Function, warn: Function }
 * }} opts
 * @returns {{ added: number, skipped: number, items: Array<{ de: string, category: string }> }}
 */
function runUpdateIngredients({ ingredientsPath, newIngredients, dryRun = false, logger = console }) {
  const existing = loadIngredientSet(ingredientsPath);
  let skipped = 0;
  const toAdd = [];

  for (const { de, category } of newIngredients) {
    const norm = (de || '').toLowerCase().trim();
    if (!norm) continue;
    if (existing.has(norm)) { skipped++; logger.log(`[skip existing] "${de}"`); continue; }
    const cat = KNOWN_CATEGORIES.includes(category) ? category : 'fertigprodukte';
    toAdd.push({ de: norm, category: cat });
    existing.add(norm); // prevent intra-batch duplicates
  }

  if (!dryRun && toAdd.length > 0) {
    let src = fs.readFileSync(ingredientsPath, 'utf8');
    fs.writeFileSync(ingredientsPath + '.bak', src);

    for (const { de, category } of toAdd) {
      const updated = appendIngredientToCategory(src, category, de);
      if (updated === null) {
        logger.warn(`[warn] category "${category}" not found in file — skipping "${de}"`);
        continue;
      }
      src = updated;
    }

    fs.writeFileSync(ingredientsPath, src, 'utf8');
  }

  return { added: toAdd.length, skipped, items: toAdd };
}

module.exports = { loadIngredientSet, appendIngredientToCategory, runUpdateIngredients, KNOWN_CATEGORIES };

// ─────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────
if (require.main === module) {
  const args    = process.argv.slice(2);
  const dryRun  = args.includes('--dry-run');
  const inIdx   = args.indexOf('--input');
  if (inIdx === -1 || !args[inIdx + 1]) {
    console.error('Usage: node tools/update-ingredients.js --input <file.json> [--dry-run]');
    process.exit(2);
  }
  const inputFile    = args[inIdx + 1];
  const newIngredients = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const root         = path.join(__dirname, '..');

  const result = runUpdateIngredients({
    ingredientsPath: path.join(root, 'ingredients.js'),
    newIngredients,
    dryRun
  });

  console.log(JSON.stringify(result, null, 2));
}
