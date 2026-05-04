'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

// Minimal i18n stub with real DE/EN unit keys
const i18n = {
  de: {
    recipe_unit_g: 'g', recipe_unit_kg: 'kg', recipe_unit_ml: 'ml', recipe_unit_l: 'l',
    recipe_unit_tbsp: 'EL', recipe_unit_tsp: 'TL',
    recipe_unit_piece: '', recipe_unit_pieces: '',
    recipe_unit_head: 'Kopf', recipe_unit_heads: 'Köpfe',
    recipe_unit_clove: 'Zehe', recipe_unit_cloves: 'Zehen',
    recipe_unit_bunch: 'Bund', recipe_unit_bunches: 'Bund',
    recipe_unit_taste: 'nach Geschmack', recipe_unit_pinch: 'Prise'
  },
  en: {
    recipe_unit_g: 'g', recipe_unit_kg: 'kg', recipe_unit_ml: 'ml', recipe_unit_l: 'l',
    recipe_unit_tbsp: 'tbsp', recipe_unit_tsp: 'tsp',
    recipe_unit_piece: '', recipe_unit_pieces: '',
    recipe_unit_head: 'head', recipe_unit_heads: 'heads',
    recipe_unit_clove: 'clove', recipe_unit_cloves: 'cloves',
    recipe_unit_bunch: 'bunch', recipe_unit_bunches: 'bunches',
    recipe_unit_taste: 'to taste', recipe_unit_pinch: 'pinch'
  }
};

const localStorage = { _store: {}, getItem(k) { return this._store[k] || null; }, setItem(k, v) { this._store[k] = v; } };
const document = { dispatchEvent() {} };
function CustomEvent(name, opts) { this.type = name; this.detail = opts && opts.detail; }

const ctx = vm.createContext({ i18n, localStorage, document, CustomEvent, console });
vm.runInContext(fs.readFileSync(path.resolve(__dirname, '../js/quantities.js'), 'utf8'), ctx);
const Q = ctx.Quantities;

let passed = 0;
function test(desc, fn) {
  try { fn(); console.log('  PASS:', desc); passed++; }
  catch(e) { console.error('  FAIL:', desc, '—', e.message); process.exitCode = 1; }
}

// ===== scale() =====
test('scale: 200g × 8/4 = 400g', () => assert.strictEqual(Q.scale({ amount: 200, unit: 'g' }, 8, 4).amount, 400));
test('scale: null amount stays null', () => assert.strictEqual(Q.scale({ amount: null, unit: 'taste' }, 8, 4).amount, null));
test('scale: pinch is unscalable', () => assert.strictEqual(Q.scale({ amount: 1, unit: 'pinch' }, 8, 4).amount, 1));
test('scale: taste is unscalable', () => assert.strictEqual(Q.scale({ amount: 1, unit: 'taste' }, 2, 4).amount, 1));
test('scale: countable uses ceil (1 clove × 2/4 → still 1)', () => assert.strictEqual(Q.scale({ amount: 1, unit: 'clove' }, 2, 4).amount, 1));
test('scale: countable ceil up (3 × 3/2 = 4.5 → 5)', () => assert.strictEqual(Q.scale({ amount: 3, unit: 'piece' }, 3, 2).amount, 5));

// ===== normalize() =====
test('normalize: 0.05 kg → 50 g', () => {
  const n = Q.normalize({ amount: 0.05, unit: 'kg' });
  assert.strictEqual(n.unit, 'g');
  assert.strictEqual(n.amount, 50);
});
test('normalize: 0.08 l → 80 ml', () => {
  const n = Q.normalize({ amount: 0.08, unit: 'l' });
  assert.strictEqual(n.unit, 'ml');
  assert.strictEqual(n.amount, 80);
});
test('normalize: 200 g unchanged', () => {
  const n = Q.normalize({ amount: 200, unit: 'g' });
  assert.strictEqual(n.unit, 'g');
  assert.strictEqual(n.amount, 200);
});
test('normalize: null amount returns unchanged', () => {
  const n = Q.normalize({ amount: null, unit: 'g' });
  assert.strictEqual(n.amount, null);
});

// ===== format() =====
test('format: taste in DE contains "Geschmack"', () => {
  assert.ok(Q.format({ amount: null, unit: 'taste' }, 'de').text.indexOf('Geschmack') !== -1);
});
test('format: taste in EN contains "taste"', () => {
  assert.ok(Q.format({ amount: null, unit: 'taste' }, 'en').text.indexOf('taste') !== -1);
});
test('format: pinch in DE contains "Prise"', () => {
  assert.ok(Q.format({ amount: 1, unit: 'pinch' }, 'de').text.indexOf('Prise') !== -1);
});
test('format: 200g formatted correctly', () => {
  assert.ok(Q.format({ amount: 200, unit: 'g' }, 'de').text.includes('200'));
});
test('format: null amount returns empty text', () => {
  assert.strictEqual(Q.format({ amount: null, unit: 'g' }, 'de').text, '');
});

// ===== getDefaultServings / setDefaultServings =====
test('getDefaultServings: returns 4 when nothing stored', () => {
  assert.strictEqual(Q.getDefaultServings(), 4);
});
test('setDefaultServings: persists and clamps to MAX', () => {
  Q.setDefaultServings(99);
  assert.strictEqual(Q.getDefaultServings(), Q.MAX_SERVINGS);
});
test('setDefaultServings: clamps to MIN', () => {
  Q.setDefaultServings(-5);
  assert.strictEqual(Q.getDefaultServings(), Q.MIN_SERVINGS);
});
test('setDefaultServings: normal value persisted', () => {
  Q.setDefaultServings(6);
  assert.strictEqual(Q.getDefaultServings(), 6);
});

console.log(`\nquantities.test.js: ${passed} tests passed`);
