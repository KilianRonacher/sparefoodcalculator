'use strict';
const assert = require('assert');
const fs     = require('fs');
const path   = require('path');
const os     = require('os');
const {
  loadIngredientSet,
  appendIngredientToCategory,
  runUpdateIngredients
} = require('../tools/update-ingredients');

const ROOT             = path.join(__dirname, '..');
const INGREDIENTS_PATH = path.join(ROOT, 'ingredients.js');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); failed++; }
}

console.log('\nupdate-ingredients.test.js');

// ─── loadIngredientSet ───────────────────────────────────────────────────────

test('loadIngredientSet returns Set with known ingredients', () => {
  const set = loadIngredientSet(INGREDIENTS_PATH);
  assert.ok(set instanceof Set, 'not a Set');
  assert.ok(set.size > 100, `expected > 100, got ${set.size}`);
  assert.ok(set.has('tomate'),      'missing "tomate"');
  assert.ok(set.has('olivenöl'),    'missing "olivenöl"');
  assert.ok(set.has('lachs'),       'missing "lachs"');
});

test('loadIngredientSet is case-insensitive (lowercase keys)', () => {
  const set = loadIngredientSet(INGREDIENTS_PATH);
  assert.ok(set.has('champignons'));
  assert.ok(!set.has('Champignons'), 'Set keys must be lowercase');
});

// ─── appendIngredientToCategory ─────────────────────────────────────────────

test('appendIngredientToCategory inserts into gemüse', () => {
  const src = [
    "var ingredientsDatabase = {",
    "  gemüse: [",
    "    'tomate', 'gurke'",
    "  ],",
    "  fleisch: [",
    "    'rind'",
    "  ]",
    "};",
  ].join('\n');

  const result = appendIngredientToCategory(src, 'gemüse', 'kohlrabi-test');
  assert.ok(result.includes("'kohlrabi-test'"), 'new item not found');
  // Must appear before the "]," of gemüse, not inside fleisch
  const gemüseCloseIdx  = result.indexOf("  ],");
  const newItemIdx      = result.indexOf("'kohlrabi-test'");
  assert.ok(newItemIdx < gemüseCloseIdx, 'item inserted in wrong place');
});

test('appendIngredientToCategory adds comma when last item lacks one', () => {
  const src = [
    "var ingredientsDatabase = {",
    "  öle: [",
    "    'olivenöl'",
    "  ]",
    "};",
  ].join('\n');

  const result = appendIngredientToCategory(src, 'öle', 'kokosöl-test');
  // olivenöl must be followed by a comma
  assert.ok(result.includes("'olivenöl',"), 'missing comma after last existing item');
});

test('appendIngredientToCategory returns null for unknown category', () => {
  const src = "var ingredientsDatabase = {\n  gemüse: [\n    'tomate'\n  ]\n};";
  const result = appendIngredientToCategory(src, 'unbekannt', 'xxx');
  assert.strictEqual(result, null);
});

// ─── runUpdateIngredients ────────────────────────────────────────────────────

test('runUpdateIngredients dry-run does not write', () => {
  const tmpPath = path.join(os.tmpdir(), `ing-${Date.now()}.js`);
  fs.copyFileSync(INGREDIENTS_PATH, tmpPath);

  const result = runUpdateIngredients({
    ingredientsPath: tmpPath,
    newIngredients: [{ de: 'zauberpilz-test', category: 'gemüse' }],
    dryRun: true
  });

  assert.strictEqual(result.added, 1);
  const content = fs.readFileSync(tmpPath, 'utf8');
  assert.ok(!content.includes('zauberpilz-test'), 'dry-run must not write');
  fs.unlinkSync(tmpPath);
});

test('runUpdateIngredients skips existing ingredient', () => {
  const tmpPath = path.join(os.tmpdir(), `ing-${Date.now()}.js`);
  fs.copyFileSync(INGREDIENTS_PATH, tmpPath);

  const result = runUpdateIngredients({
    ingredientsPath: tmpPath,
    newIngredients: [{ de: 'tomate', category: 'gemüse' }],
    dryRun: true
  });

  assert.strictEqual(result.added, 0);
  assert.strictEqual(result.skipped, 1);
  fs.unlinkSync(tmpPath);
});

test('runUpdateIngredients writes new ingredient and file re-parses', () => {
  const tmpPath = path.join(os.tmpdir(), `ing-${Date.now()}.js`);
  fs.copyFileSync(INGREDIENTS_PATH, tmpPath);

  runUpdateIngredients({
    ingredientsPath: tmpPath,
    newIngredients: [{ de: 'mondgemüse-test', category: 'gemüse' }]
  });

  const updated = fs.readFileSync(tmpPath, 'utf8');
  assert.ok(updated.includes("'mondgemüse-test'"), 'new ingredient not found in file');

  // Verify the file is still syntactically correct by re-loading the set
  const tmpIngPath = tmpPath;
  const set = loadIngredientSet(tmpIngPath);
  assert.ok(set.has('mondgemüse-test'), 'new ingredient not in re-loaded set');
  fs.unlinkSync(tmpPath);
});

test('runUpdateIngredients prevents intra-batch duplicate', () => {
  const result = runUpdateIngredients({
    ingredientsPath: INGREDIENTS_PATH,
    newIngredients: [
      { de: 'duplikat-xxx', category: 'gemüse' },
      { de: 'duplikat-xxx', category: 'gemüse' }
    ],
    dryRun: true
  });
  assert.strictEqual(result.added, 1, 'intra-batch duplicate must be suppressed');
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
