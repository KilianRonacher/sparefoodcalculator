'use strict';

const ALLOWED_CATEGORIES = [
  // meal-type (used by cron-generated recipes)
  'vorspeise','vorspeisen','hauptgericht','beilage','suppe','suppen',
  'dessert','frühstück','snack','getränk',
  // ingredient-type (used by existing recipes.js data)
  'rind','schwein','haendl','fisch','vegetarisch',
  'salat','kuchen','pasta',
  // cuisine-type (legacy schema entries)
  'asiatisch','mediterran','österreichisch','ungarisch',
  'indisch','japanisch','französisch','italienisch','chinesisch','deutsch'
];
const ALLOWED_DIFFICULTY = ['einfach','mittel','gehoben','schwer'];
const ALLOWED_UNITS = [
  'g','kg','ml','l','piece','head','clove','tbsp','tsp',
  'pinch','taste','bunch','can','cup','slice'
];

// Reason: catches UTF-8-as-Latin-1 mojibake (e.g. "Ã¤" for "ä") that slips
// in when a string is written with wrong encoding.
const MOJIBAKE_RE = /Ã[-¿]/;

const REQUIRED_FIELDS = [
  'title','title_en','category','difficulty',
  'ingredients','quantities','steps','steps_en'
];

/**
 * Validates a recipe object (id is optional — assigned later by append engine).
 *
 * @param {object} r - Recipe candidate.
 * @returns {{ ok: boolean, errors: string[] }}
 */
function validateRecipe(r) {
  const errors = [];
  if (!r || typeof r !== 'object') return { ok: false, errors: ['recipe is not an object'] };

  for (const k of REQUIRED_FIELDS) {
    if (!(k in r)) errors.push(`missing field: ${k}`);
  }
  if (errors.length) return { ok: false, errors };

  if (typeof r.title !== 'string' || r.title.trim().length < 3)
    errors.push('title too short (< 3 chars)');
  if (typeof r.title_en !== 'string' || r.title_en.trim().length < 3)
    errors.push('title_en too short (< 3 chars)');
  if (MOJIBAKE_RE.test(r.title) || MOJIBAKE_RE.test(r.title_en))
    errors.push('mojibake detected in title — check encoding');

  if (!ALLOWED_CATEGORIES.includes(r.category))
    errors.push(`invalid category: "${r.category}"`);
  if (!ALLOWED_DIFFICULTY.includes(r.difficulty))
    errors.push(`invalid difficulty: "${r.difficulty}"`);

  if (!Array.isArray(r.ingredients) || r.ingredients.length < 2)
    errors.push('ingredients must be array with ≥ 2 items');
  if (!Array.isArray(r.steps) || r.steps.length < 3)
    errors.push('steps must have ≥ 3 entries');
  if (!Array.isArray(r.steps_en))
    errors.push('steps_en must be array');
  else if (r.steps_en.length !== (r.steps || []).length)
    errors.push('steps_en length must equal steps length');

  if (!r.quantities || typeof r.quantities !== 'object') {
    errors.push('quantities must be an object');
  } else {
    for (const ing of (r.ingredients || [])) {
      if (!(ing in r.quantities)) {
        errors.push(`quantity missing for ingredient: "${ing}"`);
        continue;
      }
      const q = r.quantities[ing];
      if (!q || typeof q !== 'object') {
        errors.push(`quantity entry invalid for: "${ing}"`);
        continue;
      }
      if (!('amount' in q) || !('unit' in q))
        errors.push(`quantity missing amount/unit for: "${ing}"`);
      if (q.amount !== null && typeof q.amount !== 'number')
        errors.push(`amount must be number or null for: "${ing}"`);
      if (!ALLOWED_UNITS.includes(q.unit))
        errors.push(`invalid unit "${q.unit}" for: "${ing}"`);
    }
  }

  return { ok: errors.length === 0, errors };
}

module.exports = { validateRecipe, ALLOWED_CATEGORIES, ALLOWED_DIFFICULTY, ALLOWED_UNITS };
