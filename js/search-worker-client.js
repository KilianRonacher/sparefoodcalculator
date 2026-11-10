/**
 * SpareFoodCalculator - Search Worker Client
 * ===========================================
 * Page-side wrapper around js/workers/search-worker.js.
 * Usage: SearchWorker.findMatchingRecipes(['tomate']).then(results => ...)
 * Every call may reject (no worker support, timeout, crash). Callers then
 * fall back to findMatchingRecipes() from search.js on the page.
 */
var SearchWorker = (function () {
  'use strict';

  var worker = null;
  var initialized = false;
  var broken = false;
  var pending = {};
  var nextId = 1;
  var initPromise = null;

  /** Resolves the worker file next to this script, so it works from / and from /pages/. */
  function getWorkerUrl() {
    var scriptEl = document.querySelector('script[src*="search-worker-client.js"]');
    return scriptEl && scriptEl.src ? new URL('workers/search-worker.js', scriptEl.src).href : 'js/workers/search-worker.js';
  }

  function isSupported() {
    return typeof Worker !== 'undefined' && !broken;
  }

  function settle(id, method, value) {
    var entry = pending[id];
    if (!entry) return;
    delete pending[id];
    clearTimeout(entry.timeout);
    entry[method](value);
  }

  function failAll(reason) {
    Object.keys(pending).forEach(function (id) { settle(id, 'reject', new Error(reason)); });
  }

  function init() {
    if (!isSupported()) return Promise.reject(new Error('Workers not supported'));
    if (initPromise) return initPromise;

    initPromise = new Promise(function (resolve, reject) {
      try {
        worker = new Worker(getWorkerUrl());
      } catch (err) {
        broken = true;
        reject(err);
        return;
      }
      var initTimeout = setTimeout(function () {
        if (!initialized) { broken = true; reject(new Error('Worker init timeout')); }
      }, 5000);

      worker.onmessage = function (event) {
        var msg = event.data || {};
        if (msg.type === 'initialized') { initialized = true; clearTimeout(initTimeout); resolve(true); }
        else if (msg.type === 'results') settle(msg.id, 'resolve', msg.results);
        else if (msg.type === 'error') settle(msg.id, 'reject', new Error(msg.error || 'Worker error'));
      };
      worker.onerror = function (err) {
        console.error('[SearchWorker] worker error', err);
        broken = true;
        clearTimeout(initTimeout);
        reject(err);
        failAll('Worker crashed');
      };

      var loaded = (typeof recipes !== 'undefined' && Array.isArray(recipes)) ? recipes : [];
      worker.postMessage({
        type: 'init',
        // Reason: the worker only needs id, title and ingredients; sending whole recipes would copy megabytes.
        recipes: loaded.map(function (recipe) {
          return { id: recipe.id, title: recipe.title, ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [] };
        }),
        translations: (typeof ingredientTranslations !== 'undefined') ? ingredientTranslations : {}
      });
    });
    return initPromise;
  }

  /**
   * Ranks recipes in the worker.
   * @param {string[]} userIngredients Ingredients the user has.
   * @returns {Promise<object[]>} Light match data (id, score, isExact, haveIngredients, missingIngredients).
   */
  function findMatchingRecipes(userIngredients) {
    return init().then(function () {
      return new Promise(function (resolve, reject) {
        var id = nextId++;
        var timeout = setTimeout(function () { settle(id, 'reject', new Error('Search timeout')); }, 8000);
        pending[id] = { resolve: resolve, reject: reject, timeout: timeout };
        worker.postMessage({ type: 'search', id: id, ingredients: userIngredients });
      });
    });
  }

  /** Stops the worker. The next search starts a fresh one with the current recipes. */
  function terminate() {
    if (worker) { worker.terminate(); worker = null; }
    initialized = false;
    broken = false;
    initPromise = null;
    failAll('Terminated');
  }

  return { isSupported: isSupported, findMatchingRecipes: findMatchingRecipes, terminate: terminate };
}());

// Reason: recipes load asynchronously. A worker started before they arrived
// holds an empty list, so it is restarted once the real data is there.
window.addEventListener('recipesLoaded', function () { SearchWorker.terminate(); });
