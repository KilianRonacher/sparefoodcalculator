/**
 * Site integrity tests: everything the pages and the service worker point to
 * must exist, and nothing may depend on an absolute path or the old domain.
 * Run: node --test tests/site-integrity.test.js
 *
 * Reason: the site is served from a sub-path on GitHub Pages
 * (/sparefoodcalculator/). A single "/sw.js" or a missing cache asset
 * silently breaks offline mode and the app install.
 */
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const pages = ['index.html'].concat(fs.readdirSync(path.join(ROOT, 'pages')).filter(name => name.endsWith('.html')).map(name => 'pages/' + name));
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

/** Collects src/href values of local scripts, styles and the manifest in an HTML file. */
function localReferences(html) {
  const refs = [];
  const pattern = /<(?:script|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g;
  let match;
  while ((match = pattern.exec(html))) {
    if (!/^(https?:)?\/\//.test(match[1])) refs.push(match[1]);
  }
  return refs;
}

test('pages: every local script and stylesheet exists', () => {
  pages.forEach(page => {
    localReferences(read(page)).forEach(ref => {
      const target = path.join(ROOT, path.dirname(page), ref.split('?')[0]);
      assert.ok(fs.existsSync(target), page + ' -> ' + ref);
    });
  });
});

test('pages: no absolute paths, they break under /sparefoodcalculator/', () => {
  pages.forEach(page => {
    localReferences(read(page)).forEach(ref => assert.ok(!ref.startsWith('/'), page + ' -> ' + ref));
  });
  assert.ok(!/register\(\s*['"]\//.test(read('app.js')), 'service worker must be registered with a relative path');
  assert.ok(!/"start_url"\s*:\s*"\//.test(read('manifest.json')), 'manifest start_url must be relative');
});

test('category pages: scripts injected by the template exist', () => {
  const template = read('category-template.js');
  const sources = template.match(/'\.\.\/[^']+\.js'/g) || [];
  assert.ok(sources.length > 5);
  sources.forEach(source => {
    const file = source.slice(1, -1);
    assert.ok(fs.existsSync(path.join(ROOT, 'pages', file)), file);
  });
});

test('service worker: every cached asset exists, none is listed twice', () => {
  const worker = read('sw.js');
  // Reason: only the ASSETS list counts; the offline fallback further down names index.html again on purpose.
  const assetList = worker.slice(worker.indexOf('const ASSETS = ['), worker.indexOf('];'));
  const assets = (assetList.match(/BASE \+ '([^']+)'/g) || []).map(entry => decodeURIComponent(entry.slice(8, -1)));
  assert.ok(assets.length > 30);
  assets.forEach(asset => assert.ok(fs.existsSync(path.join(ROOT, asset)), 'missing: ' + asset));
  assert.strictEqual(new Set(assets).size, assets.length, 'duplicate asset in sw.js');
  ['search.js', 'js/search-suggest.js', 'js/search-worker-client.js', 'js/workers/search-worker.js', 'data/recipes.json'].forEach(needed => {
    assert.ok(assets.includes(needed), 'not cached: ' + needed);
  });
});

test('no leftovers of the expired domain', () => {
  pages.concat(['sitemap.xml', 'robots.txt', 'sw.js', 'app.js', 'manifest.json']).forEach(file => {
    assert.ok(!/sparefoodcalculator\.com/.test(read(file)), file);
  });
});

test('recipe data: unique ids, lower-case ingredients, a quantity for every ingredient', () => {
  const recipes = JSON.parse(read('data/recipes.json'));
  assert.ok(recipes.length >= 587);
  assert.strictEqual(new Set(recipes.map(recipe => recipe.id)).size, recipes.length);
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(name => {
      assert.strictEqual(name, name.toLowerCase(), recipe.id + ': ' + name);
      assert.ok(recipe.quantities && recipe.quantities[name], recipe.id + ': no quantity for ' + name);
    });
    assert.strictEqual(Object.keys(recipe.quantities).length, recipe.ingredients.length, 'extra quantity in ' + recipe.id);
  });
});

test('worker loads the shared engine instead of a copy', () => {
  const worker = read('js/workers/search-worker.js');
  assert.ok(/importScripts\([^)]*search\.js/.test(worker));
  assert.ok(!/function calculateDamerauLevenshtein/.test(worker), 'the worker must not carry its own distance function');
});
