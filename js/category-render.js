/**
 * SpareFoodCalculator — Category Page Renderer
 * Extracted from old recipes.js (was lines ~1941-2023).
 * Reads `window.recipes` (async-populated) and waits for
 * `recipesLoaded` event before initial render.
 */
(function () {
  'use strict';

  var _sfcCategoryLangHandler = null;

  /**
   * Loads and renders recipe cards for a given category.
   * Called by each category page (rind.html, salat.html, etc.).
   */
  function loadCategoryRecipes(categoryName) {
    var container = document.getElementById('category-recipes');
    if (!container) return;

    var lang = typeof getLang === 'function' ? getLang() : 'de';

    // Reason: old recipes say "suppen"/"vorspeisen", the daily routine writes "suppe"/"vorspeise".
    var aliases = { suppen: ['suppen', 'suppe'], vorspeisen: ['vorspeisen', 'vorspeise'], fruehstueck: ['frühstück'] };
    var wanted = aliases[categoryName] || [categoryName];
    var matched = (window.recipes || []).filter(function (r) {
      return wanted.indexOf(r.category) !== -1;
    });
    var translate = function (key, fallback) {
      return (typeof i18n !== 'undefined' && i18n[lang] && i18n[lang][key]) || fallback;
    };

    if (matched.length === 0) {
      container.textContent = '';
      var noRecipesMsg = document.createElement('p');
      noRecipesMsg.style.cssText = 'color:var(--color-text-muted);text-align:center;padding:2rem;';
      noRecipesMsg.textContent = translate('category_empty', 'Keine Rezepte gefunden.');
      container.appendChild(noRecipesMsg);
      return;
    }

    container.textContent = '';

    matched.forEach(function (recipe) {
      var card = document.createElement('div');
      card.className = 'recipe-card';

      var title = (lang === 'en' && recipe.title_en) ? recipe.title_en : recipe.title;

      var diff = recipe.difficulty || '';
      var diffColor = diff === 'einfach' ? '#4ecdc4' : diff === 'mittel' ? '#ffd166' : '#ff6b6b';

      var cardH3 = document.createElement('h3');
      cardH3.textContent = title;
      card.appendChild(cardH3);

      if (diff) {
        var diffP = document.createElement('p');
        diffP.className = 'recipe-difficulty';
        diffP.style.cssText = 'color:' + diffColor + ';font-weight:600;';
        diffP.textContent = translate('difficulty_' + diff, diff);
        card.appendChild(diffP);
      }

      var countP = document.createElement('p');
      countP.className = 'recipe-ingredients-count';
      countP.textContent = lang === 'en'
        ? recipe.ingredients.length + ' ingredients'
        : recipe.ingredients.length + ' Zutaten';
      card.appendChild(countP);

      var detailsBtn = document.createElement('button');
      detailsBtn.className = 'recipe-details-btn';
      detailsBtn.textContent = lang === 'en' ? 'View Recipe' : 'Rezept ansehen';
      card.appendChild(detailsBtn);

      detailsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof displayRecipeDetails === 'function') displayRecipeDetails(recipe);
      });

      card.addEventListener('click', function () {
        if (typeof displayRecipeDetails === 'function') displayRecipeDetails(recipe);
      });

      container.appendChild(card);
    });

    // Re-render when language changes (replace previous listener to avoid stacking)
    if (_sfcCategoryLangHandler) {
      window.removeEventListener('languageChanged', _sfcCategoryLangHandler);
    }
    _sfcCategoryLangHandler = function () {
      loadCategoryRecipes(categoryName);
    };
    window.addEventListener('languageChanged', _sfcCategoryLangHandler);
  }

  // Expose globally so app.js initCategoryPage() can call it.
  window.loadCategoryRecipes = loadCategoryRecipes;

  // Auto-init on category pages: data-category attribute on <body>.
  function _init() {
    var cat = document.body && document.body.getAttribute('data-category');
    if (cat) loadCategoryRecipes(cat);
  }

  if (Array.isArray(window.recipes) && window.recipes.length > 0) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _init);
    } else {
      _init();
    }
  } else {
    window.addEventListener('recipesLoaded', function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _init);
      } else {
        _init();
      }
    }, { once: true });
  }
})();
