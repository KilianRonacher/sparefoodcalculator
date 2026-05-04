#!/usr/bin/env node
/**
 * extract-quantities.js
 * =====================
 * Pass 1 der automatisierten Mengen-Extraktion.
 * Laedt recipes.js in einer vm-Sandbox und versucht pro Rezept/Zutat
 * Mengenangaben aus den deutschen Zubereitungsschritten zu extrahieren.
 *
 * Aufruf: node tools/extract-quantities.js
 * Ergebnis: tools/quantities-draft.json
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Pfade
const RECIPES_PATH = path.join(__dirname, '..', 'recipes.js');
const OUTPUT_PATH = path.join(__dirname, 'quantities-draft.json');

// recipes.js in Sandbox laden
const recipesCode = fs.readFileSync(RECIPES_PATH, 'utf-8');

// Minimale Sandbox: braucht einige Globals die recipes.js erwartet
const sandbox = {
  console: console,
  window: {},
  document: { dispatchEvent: function() {}, addEventListener: function() {} },
  localStorage: { getItem: function() { return null; }, setItem: function() {} },
  CustomEvent: function(name, opts) { this.name = name; this.detail = opts ? opts.detail : null; },
  setTimeout: function() {},
  recipes: [],
  ingredientTranslations: {},
  translateIngredient: function(x) { return x; },
  categoryTranslations: {},
  translateCategory: function(x) { return x; },
  getLang: function() { return 'de'; },
  setLang: function() {},
  i18n: { de: {}, en: {} },
  SustainabilityUI: undefined,
  SustainabilityCalc: undefined,
  sustainabilityData: {},
  Quantities: { getDefaultServings: function() { return 4; }, setDefaultServings: function() {} },
  Ingredients: { resolveSynonyms: function(x) { return []; } }
};

try {
  vm.runInNewContext(recipesCode, sandbox, { filename: 'recipes.js', timeout: 10000 });
} catch(e) {
  // Manche Funktionen sind nicht definiert in der Sandbox, ignorieren
  if (!sandbox.recipes || sandbox.recipes.length === 0) {
    console.error('Konnte recipes-Array nicht extrahieren:', e.message);
    process.exit(1);
  }
}

var allRecipes = sandbox.recipes;
console.log('Geladene Rezepte:', allRecipes.length);

// Einheiten-Mapping (deutsch -> kanonisch)
var unitMap = {
  'g': 'g', 'kg': 'kg', 'ml': 'ml', 'l': 'l',
  'el': 'tbsp', 'tl': 'tsp',
  'prise': 'pinch', 'prisen': 'pinch',
  'stk': 'piece', 'stk.': 'piece', 'stück': 'piece'
};

// Regex: Zahl + optionales Leerzeichen + Einheit
var qtyRegex = /(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|EL|TL|Prise|Prisen|Stk\.?|Stück)\b/gi;

var results = {};
var hitCount = 0;
var missCount = 0;

allRecipes.forEach(function(recipe) {
  if (recipe.quantities) {
    // Rezept hat schon quantities, ueberspringen
    return;
  }

  var quantities = {};
  var stepsText = (recipe.steps || []).join(' ');

  recipe.ingredients.forEach(function(ing) {
    var ingLower = ing.toLowerCase();
    // Suche im Umkreis von 50 Zeichen um den Zutatennamen
    var escapedIng = ingLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var contextRegex = new RegExp('.{0,30}' + escapedIng + '.{0,30}', 'gi');
    var matches = stepsText.match(contextRegex);

    var found = false;
    if (matches) {
      for (var i = 0; i < matches.length; i++) {
        var context = matches[i];
        qtyRegex.lastIndex = 0;
        var m = qtyRegex.exec(context);
        if (m) {
          var amount = parseFloat(m[1].replace(',', '.'));
          var rawUnit = m[2].toLowerCase().replace('.', '');
          var canonUnit = unitMap[rawUnit] || rawUnit;
          quantities[ing] = { amount: amount, unit: canonUnit };
          found = true;
          hitCount++;
          break;
        }
      }
    }

    if (!found) {
      // Kein Treffer
      quantities[ing] = { amount: null, unit: 'taste' };
      missCount++;
    }
  });

  results[recipe.id] = {
    title: recipe.title,
    quantities: quantities
  };
});

var total = hitCount + missCount;
console.log('Extrahiert: ' + hitCount + '/' + total + ' (' + Math.round(hitCount / total * 100) + '% Trefferquote)');

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf-8');
console.log('Ergebnis geschrieben nach:', OUTPUT_PATH);
process.exit(0);
