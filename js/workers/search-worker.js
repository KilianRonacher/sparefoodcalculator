/**
 * SpareFoodCalculator - Search Worker
 * ====================================
 * Runs the recipe search off the main thread. It loads the SAME engine as
 * the page (search.js) instead of carrying a copy, so both always agree.
 *
 * Messages in:  { type: 'init', recipes, translations }
 *               { type: 'search', id, ingredients }
 *               { type: 'ping' }
 * Messages out: { type: 'initialized' } | { type: 'results', id, results }
 *               { type: 'error', id, error } | { type: 'pong' }
 */

// Globals that search.js reads. They are filled by the 'init' message.
var recipes = [];
var ingredientTranslations = {};
var INITIALIZED = false;

importScripts('../../ingredients.js', '../../search.js');

self.onmessage = function (event) {
  var msg = event.data || {};
  try {
    if (msg.type === 'ping') {
      self.postMessage({ type: 'pong' });
      return;
    }
    if (msg.type === 'init') {
      recipes = Array.isArray(msg.recipes) ? msg.recipes : [];
      ingredientTranslations = (msg.translations && typeof msg.translations === 'object') ? msg.translations : {};
      INITIALIZED = true;
      self.postMessage({ type: 'initialized' });
      return;
    }
    if (msg.type === 'search') {
      if (!INITIALIZED) {
        self.postMessage({ type: 'error', id: msg.id, error: 'Worker not initialized' });
        return;
      }
      var results = findMatchingRecipes(Array.isArray(msg.ingredients) ? msg.ingredients : [], { light: true });
      self.postMessage({ type: 'results', id: msg.id, results: results });
      return;
    }
    self.postMessage({ type: 'error', id: msg.id, error: 'Unknown message type: ' + msg.type });
  } catch (err) {
    self.postMessage({ type: 'error', id: msg.id, error: (err && err.message) || String(err) });
  }
};
