// tests/xss-regression.test.js
// Run with: node --test tests/xss-regression.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// Pattern: innerHTML with template-literal interpolation → XSS vector
const DANGEROUS_PATTERN = /\.innerHTML\s*=\s*`[^`]*\$\{[^}]+\}[^`]*`/g;

const FILES_TO_CHECK = [
  'pages/search.html',
  'pages/ingredients-generator.html',
  'pages/ingredients-catalog.html',
];

test('no innerHTML with template-literal interpolation in user-facing pages', () => {
  const offenders = [];
  for (const file of FILES_TO_CHECK) {
    const content = read(file);
    const matches = content.match(DANGEROUS_PATTERN);
    if (matches) offenders.push({ file, matches });
  }
  assert.deepStrictEqual(offenders, [],
    'Found innerHTML with ${...} interpolation:\n' + JSON.stringify(offenders, null, 2));
});

test('safe-dom.js is included before i18n.js in all modified pages', () => {
  for (const file of FILES_TO_CHECK) {
    const content = read(file);
    const safeDomIdx = content.indexOf('safe-dom.js');
    const i18nIdx = content.indexOf('i18n.js');
    assert.ok(safeDomIdx > -1, file + ' must include safe-dom.js');
    assert.ok(safeDomIdx < i18nIdx, file + ': safe-dom.js must come before i18n.js');
  }
});

test('CACHE_VERSION bumped to at least sfc-v3', () => {
  const sw = read('sw.js');
  const m = sw.match(/CACHE_VERSION\s*=\s*['"]sfc-v(\d+)['"]/);
  assert.ok(m, 'CACHE_VERSION not found in sw.js');
  assert.ok(parseInt(m[1], 10) >= 3, 'CACHE_VERSION should be >= sfc-v3, got sfc-v' + m[1]);
});

test('no document.body.innerHTML overwrites in pages', () => {
  for (const file of FILES_TO_CHECK) {
    const content = read(file);
    assert.ok(
      !content.includes('document.body.innerHTML'),
      file + ' must not overwrite document.body.innerHTML'
    );
  }
});
