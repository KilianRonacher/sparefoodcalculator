'use strict';
const assert = require('assert');
const { validateRecipe } = require('../tools/recipe-schema');

const VALID = {
  title: 'Wiener Schnitzel mit Erdäpfelsalat',
  title_en: 'Viennese Schnitzel with Potato Salad',
  category: 'hauptgericht',
  difficulty: 'mittel',
  ingredients: ['kalbsschnitzel','mehl','eier','semmelbrösel','butterschmalz'],
  quantities: {
    'kalbsschnitzel': { amount: 600, unit: 'g' },
    'mehl':          { amount: 100, unit: 'g' },
    'eier':          { amount: 3,   unit: 'piece' },
    'semmelbrösel':  { amount: 200, unit: 'g' },
    'butterschmalz': { amount: 200, unit: 'g' }
  },
  steps: ['Schnitzel klopfen', 'Panieren', 'In Butterschmalz schwimmend backen'],
  steps_en: ['Pound the schnitzel', 'Bread it', 'Fry in clarified butter']
};

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (e) { console.error(`  ✗ ${name}: ${e.message}`); failed++; }
}

console.log('\nrecipe-schema.test.js');

test('accepts a fully valid recipe', () => {
  const r = validateRecipe(VALID);
  assert.strictEqual(r.ok, true, `errors: ${r.errors.join(', ')}`);
});

test('rejects missing title_en', () => {
  const bad = { ...VALID }; delete bad.title_en;
  const r = validateRecipe(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.join().includes('title_en'));
});

test('rejects steps/steps_en length mismatch', () => {
  const r = validateRecipe({ ...VALID, steps_en: ['only one'] });
  assert.strictEqual(r.ok, false);
});

test('rejects ingredient missing from quantities', () => {
  const r = validateRecipe({ ...VALID, ingredients: [...VALID.ingredients, 'salz'] });
  assert.strictEqual(r.ok, false);
});

test('rejects mojibake in title', () => {
  const r = validateRecipe({ ...VALID, title: 'KÃ¤sespÃ¤tzle' });
  assert.strictEqual(r.ok, false);
});

test('rejects invalid category', () => {
  const r = validateRecipe({ ...VALID, category: 'unknown' });
  assert.strictEqual(r.ok, false);
});

test('rejects invalid unit', () => {
  const bad = { ...VALID, quantities: { ...VALID.quantities, 'kalbsschnitzel': { amount: 600, unit: 'pounds' } } };
  const r = validateRecipe(bad);
  assert.strictEqual(r.ok, false);
});

test('allows null amount (taste)', () => {
  const with_salt = {
    ...VALID,
    ingredients: [...VALID.ingredients, 'salz'],
    quantities: { ...VALID.quantities, 'salz': { amount: null, unit: 'taste' } }
  };
  const r = validateRecipe(with_salt);
  assert.strictEqual(r.ok, true, `errors: ${r.errors.join(', ')}`);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
