/**
 * SpareFoodCalculator — Recipes Loader
 * =====================================
 * Async loader: fetches data/recipes.json, populates `window.recipes`,
 * dispatches the `recipesLoaded` event when ready.
 *
 * All consumers (app.js, search.js, category-template.js, inline scripts)
 * MUST either:
 *   - check `Array.isArray(window.recipes) && window.recipes.length > 0`, OR
 *   - listen for `window.addEventListener('recipesLoaded', ...)`.
 *
 * Reason: replacing the previous ~2000-line embedded data array with a
 * fetched JSON file keeps page weight low and avoids parser blocking.
 */
(function () {
  'use strict';

  // Path resolution: pages/*.html load this via "../recipes.js" so the
  // relative URL "data/recipes.json" would break for sub-pages.
  // We resolve against the SCRIPT's own URL instead.
  // Note: document.currentScript is null for `defer` scripts; query the DOM
  // instead (deferred scripts always execute after the DOM is fully parsed).
  var scriptEl = document.currentScript ||
    document.querySelector('script[src$="recipes.js"]') ||
    document.querySelector('script[src*="recipes.js"]');
  var jsonURL;
  if (scriptEl && scriptEl.src) {
    jsonURL = new URL('data/recipes.json', scriptEl.src).href;
  } else {
    // Fallback: derive from the page location (works when page is at site root).
    var base = window.location.href.split('/').slice(0, -1).join('/') + '/';
    jsonURL = new URL('data/recipes.json', base).href;
  }

  // Expose an empty array immediately so `recipes.length` checks don't throw.
  // Consumers that need real data must wait for the `recipesLoaded` event.
  window.recipes = [];

  fetch(jsonURL, { credentials: 'same-origin' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' fetching ' + jsonURL);
      return r.json();
    })
    .then(function (arr) {
      if (!Array.isArray(arr)) throw new Error('recipes JSON did not parse as array');
      window.recipes = arr;
      // Keep bare `recipes` identifier in sync for legacy code that doesn't use window.recipes.
      try { recipes = arr; } catch (e) { /* strict-mode environments: no-op */ }
      window.dispatchEvent(new Event('recipesLoaded'));
    })
    .catch(function (err) {
      console.error('[recipes-loader] failed:', err);
      // Dispatch event anyway so dependent UI can render an empty/error state.
      window.dispatchEvent(new Event('recipesLoaded'));
    });
})();

// Compatibility shim: declare a top-level `recipes` var so code that reads
// the bare identifier doesn't throw a ReferenceError before fetch resolves.
// The IIFE above will re-assign it once data is loaded.
var recipes = window.recipes;
