/**
 * Tests for search.js (matching engine, typo distance, suggestions).
 * Run: node --test tests/search.test.js
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

/**
 * Loads the browser scripts into a sandbox with a minimal fake DOM.
 * @param {string} lang Active language ('de' or 'en').
 * @returns {object} Sandbox with an `evaluate(code)` helper.
 */
function loadEngine(lang) {
  const noop = () => {};
  const element = () => ({ getAttribute: () => null, setAttribute: noop, addEventListener: noop, classList: { contains: () => false, add: noop, remove: noop, toggle: noop } });
  const sandbox = {
    console,
    localStorage: { getItem: key => (key === 'sfc_lang' ? lang : null), setItem: noop },
    document: { getElementById: () => null, addEventListener: noop, querySelectorAll: () => [], querySelector: () => null, body: element(), documentElement: {} },
    addEventListener: noop, removeEventListener: noop, dispatchEvent: noop, matchMedia: () => ({ matches: false }),
    CustomEvent: function CustomEvent() {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  ['i18n.js', 'ingredients.js', 'search.js', 'js/search-suggest.js'].forEach(file => {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });
  });
  sandbox.recipes = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'recipes.json'), 'utf8'));
  vm.runInContext('var recipes = window.recipes;', sandbox);
  sandbox.evaluate = code => vm.runInContext(code, sandbox);
  return sandbox;
}

const engine = loadEngine('de');
const distance = engine.evaluate('calculateDamerauLevenshtein');
const matches = engine.evaluate('ingredientsMatch');
const find = engine.evaluate('findMatchingRecipes');
const didYouMean = engine.evaluate('findDidYouMean');
const autocomplete = engine.evaluate('getAutocompleteSuggestions');

/** Reference implementation (optimal string alignment) to check the optimised one against. */
function referenceDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i].concat(new Array(b.length).fill(0)));
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

test('distance: known pairs', () => {
  assert.strictEqual(distance('tmoate', 'tomate'), 1); // swap of neighbours
  assert.strictEqual(distance('lachss', 'lachs'), 1);
  assert.strictEqual(distance('karrotte', 'karotte'), 1);
  assert.strictEqual(distance('brokkoli', 'brokkoli'), 0);
});

test('distance: edge cases with empty words', () => {
  assert.strictEqual(distance('', ''), 0);
  assert.strictEqual(distance('', 'abc'), 3);
  assert.strictEqual(distance('abc', ''), 3);
});

test('distance: equals the reference on random words, early exit never lies', () => {
  const alphabet = 'abcde';
  const random = max => Array.from({ length: Math.floor(Math.random() * max) }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  for (let i = 0; i < 20000; i++) {
    const a = random(9);
    const b = random(9);
    const expected = referenceDistance(a, b);
    assert.strictEqual(distance(a, b), expected, a + '/' + b);
    for (const max of [1, 2, 3]) {
      const limited = distance(a, b, max);
      if (expected <= max) assert.strictEqual(limited, expected, a + '/' + b + ' max ' + max);
      else assert.ok(limited > max, a + '/' + b + ' max ' + max);
    }
  }
});

test('matching: same ingredient in different spellings', () => {
  const pairs = [['Tomate', 'tomaten'], ['Kaese', 'käse'], ['Kase', 'käse'], ['Haehnchen', 'hähnchen'], ['Oel', 'öl'], ['Zwiebel', 'zwiebeln'],
    ['Erdäpfel', 'kartoffeln'], ['Paradeiser', 'tomate'], ['Huhn', 'hähnchen'], ['Hendl', 'hähnchenbrust'], ['Ei', 'eier'], ['Topfen', 'quark']];
  pairs.forEach(([user, recipe]) => assert.ok(matches(user, recipe), user + ' should match ' + recipe));
});

test('matching: compound head and multi-word names', () => {
  const pairs = [['Öl', 'olivenöl'], ['Reis', 'risottoreis'], ['Paprika', 'rote paprika'], ['Pfeffer', 'schwarzer pfeffer'],
    ['Thunfisch', 'thunfisch aus der dose'], ['Rind', 'rinderbrust'], ['Fisch', 'lachsfilet'], ['Lachs', 'fisch'], ['Käse', 'parmesan']];
  pairs.forEach(([user, recipe]) => assert.ok(matches(user, recipe), user + ' should match ' + recipe));
});

test('matching: no false hits from letters inside other words', () => {
  const pairs = [['Ei', 'reis'], ['Ei', 'rindfleisch'], ['Eis', 'reis'], ['Wein', 'schweinefleisch'], ['Lauch', 'knoblauch'], ['Lauch', 'schnittlauch'],
    ['Oliven', 'olivenöl'], ['Sesam', 'sesamöl'], ['Zucker', 'zuckerschoten'], ['Erbsen', 'kichererbsen'], ['Paprika', 'paprikapulver'],
    ['Tomate', 'tomatenmark'], ['Mehl', 'paniermehl'], ['Milch', 'kokosmilch'], ['Kümmel', 'kreuzkümmel'], ['Rotwein', 'rotweinessig'],
    ['Rind', 'schweinefleisch'], ['Rind', 'rinderbrühe'], ['Lachs', 'forelle'], ['Kräuter', 'sauerkraut'], ['Sahne', 'saure sahne']];
  pairs.forEach(([user, recipe]) => assert.ok(!matches(user, recipe), user + ' must not match ' + recipe));
});

test('matching: typos only for unknown words', () => {
  assert.ok(matches('Tmoate', 'tomate'));
  assert.ok(matches('Zweibel', 'zwiebel'));
  assert.ok(matches('Kartofel', 'kartoffeln'));
  assert.ok(matches('Nudlen', 'nudeln'));
  // Real words are never "corrected" into other real words.
  assert.ok(!matches('Reis', 'mais'));
  assert.ok(!matches('Lauch', 'lachs'));
  assert.ok(!matches('Salz', 'salat'));
});

test('matching: English input', () => {
  assert.ok(matches('tomato', 'tomate'));
  assert.ok(matches('tomatoes', 'tomaten'));
  assert.ok(matches('chicken', 'hähnchen'));
  assert.ok(matches('onion', 'zwiebel'));
});

test('search: finds recipes despite typo, and hits really contain the ingredient', () => {
  const clean = find(['tomate']);
  const typo = find(['tmoate']);
  assert.ok(clean.length > 50);
  // Reason: a typo is compared word by word, so a few compound hits ("Kirschtomaten") may be missing.
  assert.ok(typo.length >= clean.length * 0.9, typo.length + ' vs ' + clean.length);
  const egg = find(['ei']);
  egg.forEach(recipe => assert.ok(recipe.haveIngredients.some(name => /^(ei|eier|eigelb|eiweiß)$/.test(name)), recipe.title));
});

test('search: have and missing lists cover the recipe, exact flag is consistent', () => {
  const results = find(['rind', 'zwiebel']);
  assert.ok(results.length > 0);
  results.forEach(recipe => {
    assert.strictEqual(recipe.haveIngredients.length + recipe.missingIngredients.length, recipe.ingredients.length);
    assert.strictEqual(recipe.isExact, recipe.unmatchedUserIngredients.length === 0);
  });
  const pork = results.find(recipe => recipe.ingredients.includes('schweinefleisch') && !recipe.ingredients.some(name => /rind/.test(name)));
  if (pork) assert.ok(pork.missingIngredients.includes('schweinefleisch'));
  assert.ok(results[0].isExact, 'complete matches come first');
});

test('search: failure cases return an empty list', () => {
  // Reason: arrays come from another vm context, so compare lengths instead of deepStrictEqual.
  assert.strictEqual(find([]).length, 0);
  assert.strictEqual(find(null).length, 0);
  assert.strictEqual(find(['xyz123qq']).length, 0);
});

test('did-you-mean: silent for correct words, helpful for typos', () => {
  ['fisch', 'fond', 'kalb', 'käse', 'kräuter', 'tofu', 'Kaese', 'tomato', 'huhn'].forEach(word => assert.strictEqual(didYouMean(word), null, word));
  assert.strictEqual(didYouMean('tmoate').suggestion, 'tomate');
  assert.strictEqual(didYouMean('zweibel').suggestion, 'zwiebel');
  assert.strictEqual(didYouMean('xy'), null);
});

test('autocomplete: suggestions always lead to recipes', () => {
  const texts = autocomplete('käs', 5).map(item => item.text);
  assert.ok(texts.includes('käse'), texts.join(','));
  autocomplete('to', 5).concat(autocomplete('pu', 5)).forEach(item => assert.ok(find([item.text]).length > 0, item.text));
  assert.strictEqual(autocomplete('t').length, 0);
});

test('English mode: suggestions are shown in English', () => {
  const english = loadEngine('en');
  const texts = english.evaluate('getAutocompleteSuggestions')('toma', 3).map(item => item.text);
  assert.ok(texts.includes('tomato'), texts.join(','));
});
