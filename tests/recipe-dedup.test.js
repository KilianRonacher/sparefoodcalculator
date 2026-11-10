'use strict';
const assert = require('assert');
const { recipeKey, findDuplicate } = require('../tools/recipe-dedup');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); failed++; }
}

const A     = { title: 'Wiener Schnitzel', title_en: 'Viennese Schnitzel', ingredients: ['kalbsschnitzel','mehl','eier','semmelbrösel'] };
const ASame = { title: 'Wiener  schnitzel ', title_en: 'viennese schnitzel', ingredients: ['mehl','eier','kalbsschnitzel','semmelbrösel'] };
const B     = { title: 'Gulasch', title_en: 'Goulash', ingredients: ['rindfleisch','zwiebel','paprikapulver'] };

console.log('\nrecipe-dedup.test.js');

test('recipeKey is case- and whitespace-insensitive', () => {
  assert.strictEqual(recipeKey(A), recipeKey(ASame));
});

test('recipeKey is ingredient-order-insensitive', () => {
  const A2 = { ...A, ingredients: ['semmelbrösel','kalbsschnitzel','eier','mehl'] };
  assert.strictEqual(recipeKey(A), recipeKey(A2));
});

test('different recipes get different keys', () => {
  assert.notStrictEqual(recipeKey(A), recipeKey(B));
});

test('findDuplicate detects match against existing list', () => {
  assert.deepStrictEqual(findDuplicate(ASame, [A]), A);
});

test('findDuplicate returns null when no match', () => {
  assert.strictEqual(findDuplicate(B, [A]), null);
});

test('findDuplicate returns null for empty list', () => {
  assert.strictEqual(findDuplicate(A, []), null);
});

test('diacritics are stripped for comparison', () => {
  const withUmlauts    = { title: 'Käsespätzle', ingredients: ['käse','mehl'] };
  const withoutUmlauts = { title: 'Kasespatzle', ingredients: ['kase','mehl'] };
  assert.strictEqual(recipeKey(withUmlauts), recipeKey(withoutUmlauts));
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
