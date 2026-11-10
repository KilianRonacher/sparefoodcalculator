#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');
const { validateRecipe }            = require('./recipe-schema');
const { findDuplicate, recipeKey }  = require('./recipe-dedup');

// ─────────────────────────────────────────────
// 1. LOAD EXISTING RECIPES (from JSON)
// ─────────────────────────────────────────────

/**
 * Reads recipes from a JSON file (data/recipes.json) and returns the array.
 *
 * @param {string} recipesPath - absolute path to recipes JSON file
 * @returns {object[]}
 */
function loadExistingRecipes(recipesPath) {
  const src = fs.readFileSync(recipesPath, 'utf8');
  const arr = JSON.parse(src);
  if (!Array.isArray(arr)) throw new Error('recipes file did not contain an array: ' + recipesPath);
  return arr;
}

// ─────────────────────────────────────────────
// 2. ID ASSIGNMENT
// ─────────────────────────────────────────────

/**
 * Assigns sequential IDs starting at maxExistingId + 1.
 *
 * @param {object[]} newRecipes
 * @param {number}   maxExistingId
 * @returns {object[]}
 */
function assignIds(newRecipes, maxExistingId) {
  let next = maxExistingId + 1;
  return newRecipes.map(r => ({ ...r, id: next++ }));
}

// ─────────────────────────────────────────────
// 3. HISTORY
// ─────────────────────────────────────────────

function loadHistory(historyPath) {
  try { return JSON.parse(fs.readFileSync(historyPath, 'utf8')); }
  catch { return []; }
}

// ─────────────────────────────────────────────
// 4. MAIN APPEND FUNCTION
// ─────────────────────────────────────────────

/**
 * Validates, deduplicates and appends candidate recipes to recipes JSON file.
 *
 * @param {{
 *   recipesPath: string,
 *   historyPath: string,
 *   candidates:  object[],
 *   dryRun?:     boolean,
 *   logger?:     { log: Function, warn: Function }
 * }} opts
 * @returns {{ added: number, skippedDuplicates: number, invalid: number, ids: number[] }}
 */
function runAppend({ recipesPath, historyPath, candidates, dryRun = false, logger = console }) {
  const existing = loadExistingRecipes(recipesPath);
  const history  = loadHistory(historyPath);

  const historyRecipes = history.map(h => h._snapshot).filter(Boolean);
  const allKnown = existing.concat(historyRecipes);

  let invalid = 0, skippedDuplicates = 0;
  const valid = [];

  for (const c of candidates) {
    const v = validateRecipe({ ...c, id: 1 });
    if (!v.ok) {
      invalid++;
      logger.warn(`[skip invalid] "${c.title}": ${v.errors.join('; ')}`);
      continue;
    }
    if (findDuplicate(c, allKnown) || findDuplicate(c, valid)) {
      skippedDuplicates++;
      logger.log(`[skip duplicate] "${c.title}"`);
      continue;
    }
    valid.push(c);
  }

  const maxId   = existing.reduce((m, r) => Math.max(m, r.id || 0), 0);
  const withIds = assignIds(valid, maxId);

  if (!dryRun && withIds.length > 0) {
    // Backup pre-write file (rollback safety)
    const src = fs.readFileSync(recipesPath, 'utf8');
    fs.writeFileSync(recipesPath + '.bak', src);

    // Write merged JSON array (pretty printed, trailing newline).
    const merged = existing.concat(withIds);
    fs.writeFileSync(recipesPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');

    const newHistory = history.concat(withIds.map(r => ({
      key:       recipeKey(r),
      id:        r.id,
      title:     r.title,
      addedAt:   new Date().toISOString(),
      _snapshot: { title: r.title, title_en: r.title_en, ingredients: r.ingredients }
    })));
    fs.writeFileSync(historyPath, JSON.stringify(newHistory, null, 2), 'utf8');
  }

  return { added: withIds.length, skippedDuplicates, invalid, ids: withIds.map(r => r.id) };
}

module.exports = {
  loadExistingRecipes,
  assignIds,
  runAppend
};

// ─────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────
if (require.main === module) {
  const args   = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const inIdx  = args.indexOf('--input');
  if (inIdx === -1 || !args[inIdx + 1]) {
    console.error('Usage: node tools/append-daily-recipes.js --input <file.json> [--dry-run]');
    process.exit(2);
  }
  const inputFile = args[inIdx + 1];
  const candidates = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const root = path.join(__dirname, '..');

  const result = runAppend({
    recipesPath: path.join(root, 'data', 'recipes.json'),
    historyPath: path.join(root, 'data', 'recipe-history.json'),
    candidates,
    dryRun
  });

  console.log(JSON.stringify(result, null, 2));
  if (result.added === 0 || result.invalid > 0) process.exit(1);
}
