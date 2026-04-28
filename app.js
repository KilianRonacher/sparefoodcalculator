/**
 * SpareFoodCalculator - Main Application
 * ========================================
 * Modular frontend application for recipe search from leftover ingredients.
 *
 * Module loading order (in HTML):
 *   1. i18n.js         — Internationalization & language toggle
 *   2. ingredients.js  — Ingredient database
 *   3. search.js       — Damerau-Levenshtein, fuzzy matching, stemming
 *   4. recipes.js      — Recipe data, display, translation
 *   5. ui.js           — Mobile nav, modal handlers
 *   6. app.js          — This file (initialization)
 *
 * All modules expose functions on the global scope (no bundler).
 */

// ==================== SERVICE WORKER ====================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .catch(function(err) { console.warn('SW registration failed', err); });
  });
}

// ==================== PWA INSTALL PROMPT ====================

(function() {
  var deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button after 30 seconds of usage
    setTimeout(function() {
      if (!deferredPrompt) return;
      var btn = document.createElement('button');
      btn.textContent = '\u{1F4F1} App installieren';
      btn.className = 'btn primary';
      btn.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.2);padding:0.75rem 1.25rem;font-size:0.95rem;border-radius:14px;';
      btn.id = 'pwa-install-btn';
      document.body.appendChild(btn);

      btn.addEventListener('click', function() {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function() {
          deferredPrompt = null;
          btn.remove();
        });
      });
    }, 30000);
  });

  window.addEventListener('appinstalled', function() {
    deferredPrompt = null;
    var btn = document.getElementById('pwa-install-btn');
    if (btn) btn.remove();
  });
})();

// ==================== RECIPE STRUCTURED DATA (JSON-LD) ====================

/**
 * Inject schema.org/Recipe JSON-LD into <head> when a recipe modal opens.
 * Removed again by removeRecipeSchema() when the modal closes.
 */
function injectRecipeSchema(recipe) {
  removeRecipeSchema(); // clean up any previous script tag

  var lang = typeof getLang === 'function' ? getLang() : 'de';
  var title = (lang === 'en' && recipe.title_en) ? recipe.title_en : recipe.title;
  var steps  = (lang === 'en' && recipe.steps_en)  ? recipe.steps_en  : recipe.steps;

  var schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    'name': title,
    'recipeIngredient': recipe.ingredients.map(function(ing) {
      return (lang === 'en' && typeof translateIngredient === 'function')
        ? translateIngredient(ing, 'en')
        : ing;
    }),
    'recipeInstructions': steps.map(function(step, idx) {
      return { '@type': 'HowToStep', 'position': idx + 1, 'text': step };
    })
  };

  if (recipe.category) {
    schema.recipeCategory = recipe.category;
  }

  // Map known categories to schema.org diet types
  var vegetarianCategories = ['salat', 'dessert', 'kuchen', 'vorspeisen'];
  if (vegetarianCategories.indexOf(recipe.category) !== -1) {
    // Only mark as vegetarian if no meat/fish ingredients
    var meatKeywords = ['fleisch','rind','schwein','hähnchen','haehnchen','huhn','lamm','kalb','speck','schinken','fisch','lachs','thunfisch','garnelen'];
    var hasMeat = recipe.ingredients.some(function(ing) {
      var low = ing.toLowerCase();
      return meatKeywords.some(function(k) { return low.indexOf(k) !== -1; });
    });
    if (!hasMeat) {
      schema.suitableForDiet = 'https://schema.org/VegetarianDiet';
    }
  }

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'recipe-schema-jsonld';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Remove previously injected Recipe JSON-LD from <head>.
 */
function removeRecipeSchema() {
  var existing = document.getElementById('recipe-schema-jsonld');
  if (existing) existing.remove();
}

// ==================== CATEGORY PAGE TEMPLATE ====================

/**
 * Auto-initialize category pages.
 * Each category page sets data-category on <body>.
 * This function reads that attribute and calls loadCategoryRecipes().
 */
(function initCategoryPage() {
  var cat = document.body.getAttribute('data-category');
  if (!cat) return;

  document.addEventListener('DOMContentLoaded', function() {
    if (typeof loadCategoryRecipes === 'function') {
      loadCategoryRecipes(cat);
    }
  });
})();

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
  // Search form handler (on search.html)
  var searchForm = document.getElementById('search-form');
  var searchInput = document.getElementById('ingredient-input');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var rawInput = searchInput.value.trim();
      if (!rawInput) return;

      var ingredients = rawInput.split(/[,;\n]+/).map(function(s) { return s.trim(); }).filter(Boolean);
      var results = findMatchingRecipes(ingredients);
      displaySearchResults(results);
    });
  }
});
