// tests/safe-dom.test.js
// Run with: node --test tests/safe-dom.test.js
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;

const SafeDom = require('../js/safe-dom.js');

test('el() creates element with text child', () => {
  const node = SafeDom.el('span', {}, 'Hello');
  assert.strictEqual(node.tagName, 'SPAN');
  assert.strictEqual(node.textContent, 'Hello');
  assert.strictEqual(node.children.length, 0);
});

test('el() escapes injected text — no HTML parsing', () => {
  const node = SafeDom.el('div', {}, '<img src=x onerror=alert(1)>');
  assert.strictEqual(node.children.length, 0);
  assert.strictEqual(node.textContent, '<img src=x onerror=alert(1)>');
});

test('el() applies className and dataset', () => {
  const node = SafeDom.el('button', { className: 'btn primary', dataset: { idx: '3' } }, 'Click');
  assert.strictEqual(node.className, 'btn primary');
  assert.strictEqual(node.dataset.idx, '3');
});

test('el() nests element children', () => {
  const inner = SafeDom.el('strong', {}, 'bold');
  const outer = SafeDom.el('p', {}, 'text ', inner);
  assert.strictEqual(outer.children.length, 1);
  assert.strictEqual(outer.textContent, 'text bold');
});

test('clearChildren() removes all children', () => {
  const parent = document.createElement('div');
  parent.appendChild(document.createElement('span'));
  parent.appendChild(document.createElement('p'));
  SafeDom.clearChildren(parent);
  assert.strictEqual(parent.children.length, 0);
});

test('el() attaches click handler via onClick', () => {
  let clicked = false;
  const btn = SafeDom.el('button', { onClick: () => { clicked = true; } }, 'Go');
  btn.click();
  assert.strictEqual(clicked, true);
});
