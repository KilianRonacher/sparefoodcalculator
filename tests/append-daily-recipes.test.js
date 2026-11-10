'use strict';
const assert = require('assert');
const fs     = require('fs');
const path   = require('path');
const os     = require('os');
const {
  loadExistingRecipes,
  assignIds,
  runAppend
} = require('../tools/append-daily-recipes');

const ROOT         = path.join(__dirname, '..');
const RECIPES_PATH = path.join(ROOT, 'data', 'recipes.json');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); failed++; }
}

const SAMPLE = {
  title:       'Tiroler Gröstl',
  title_en:    'Tyrolean Pan Fry',
  category:    'hauptgericht',
  difficulty:  'einfach',
  ingredients: ['kartoffeln','speck','zwiebel','salz','pfeffer'],
  quantities: {
    'kartoffeln': { amount: 500, unit: 'g' },
    'speck':      { amount: 150, unit: 'g' },
    'zwiebel':    { amount: 1,   unit: 'piece' },
    'salz':       { amount: null, unit: 'taste' },
    'pfeffer':    { amount: null, unit: 'taste' }
  },
  steps:    ['Kartoffeln kochen','Speck anbraten','Alles mischen','Würzen','Servieren'],
  steps_en: ['Boil potatoes','Fry bacon','Mix everything','Season','Serve']
};

console.log('\nappend-daily-recipes.test.js');

test('loadExistingRecipes returns array from real recipes.json', () => {
  const list = loadExistingRecipes(RECIPES_PATH);
  assert.ok(Array.isArray(list), 'not an array');
  assert.ok(list.length > 50, `expected > 50 recipes, got ${list.length}`);
  assert.ok(typeof list[0].id === 'number', 'first recipe has no numeric id');
});

test('assignIds gives sequential IDs after maxExistingId', () => {
  const out = assignIds([{ title: 'A' }, { title: 'B' }, { title: 'C' }], 400);
  assert.deepStrictEqual(out.map(r => r.id), [401, 402, 403]);
});

test('runAppend dry-run reports counts without writing', () => {
  const tmpHistory = path.join(os.tmpdir(), `hist-${Date.now()}.json`);
  const result = runAppend({
    recipesPath: RECIPES_PATH,
    historyPath: tmpHistory,
    candidates:  [SAMPLE],
    dryRun:      true
  });
  assert.strictEqual(result.added, 1, `added=${result.added}`);
  assert.strictEqual(result.invalid, 0);
  assert.ok(!fs.existsSync(tmpHistory), 'history must not be written in dry-run');
});

test('runAppend skips duplicate on second call', () => {
  const tmpRecipes = path.join(os.tmpdir(), `recipes-${Date.now()}.json`);
  const tmpHistory = path.join(os.tmpdir(), `hist-${Date.now()}.json`);
  fs.copyFileSync(RECIPES_PATH, tmpRecipes);

  const r1 = runAppend({ recipesPath: tmpRecipes, historyPath: tmpHistory, candidates: [SAMPLE] });
  assert.strictEqual(r1.added, 1);

  const r2 = runAppend({ recipesPath: tmpRecipes, historyPath: tmpHistory, candidates: [SAMPLE] });
  assert.strictEqual(r2.added, 0);
  assert.strictEqual(r2.skippedDuplicates, 1);
});

test('after real append the file still parses correctly', () => {
  const tmpRecipes = path.join(os.tmpdir(), `recipes-parse-${Date.now()}.json`);
  const tmpHistory = path.join(os.tmpdir(), `hist-parse-${Date.now()}.json`);
  fs.copyFileSync(RECIPES_PATH, tmpRecipes);

  runAppend({ recipesPath: tmpRecipes, historyPath: tmpHistory, candidates: [SAMPLE] });

  const reloaded = loadExistingRecipes(tmpRecipes);
  const last = reloaded[reloaded.length - 1];
  assert.strictEqual(last.title, SAMPLE.title);
  assert.strictEqual(last.title_en, SAMPLE.title_en);
});

test('backup file (.bak) is written before modifying recipes', () => {
  const tmpRecipes = path.join(os.tmpdir(), `recipes-bak-${Date.now()}.json`);
  const tmpHistory = path.join(os.tmpdir(), `hist-bak-${Date.now()}.json`);
  fs.copyFileSync(RECIPES_PATH, tmpRecipes);

  runAppend({ recipesPath: tmpRecipes, historyPath: tmpHistory, candidates: [SAMPLE] });

  const bakPath = tmpRecipes + '.bak';
  assert.ok(fs.existsSync(bakPath), '.bak file must exist after append');

  // .bak must equal the original (pre-append) recipes file
  const bakContent      = fs.readFileSync(bakPath, 'utf8');
  const originalContent = fs.readFileSync(RECIPES_PATH, 'utf8');
  assert.strictEqual(bakContent, originalContent, '.bak must match the pre-append source');
});

test('runAppend writes JSON file (not JS) after appending', () => {
  const tmpRecipes = path.join(os.tmpdir(), `recipes-jsonout-${Date.now()}.json`);
  const tmpHistory = path.join(os.tmpdir(), `hist-jsonout-${Date.now()}.json`);
  fs.copyFileSync(RECIPES_PATH, tmpRecipes);

  runAppend({ recipesPath: tmpRecipes, historyPath: tmpHistory, candidates: [SAMPLE] });

  const content = fs.readFileSync(tmpRecipes, 'utf8');
  const parsed = JSON.parse(content); // must NOT throw
  assert.ok(Array.isArray(parsed), 'output must be a JSON array');
  assert.strictEqual(parsed[parsed.length - 1].title, SAMPLE.title);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
