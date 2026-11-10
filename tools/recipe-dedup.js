'use strict';

/**
 * Normalise a string for comparison: strip diacritics, lowercase, collapse whitespace.
 * @param {string} s
 * @returns {string}
 */
function norm(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build a stable deduplication key from title + sorted ingredient list.
 * Order-insensitive on ingredients so "tomate, salz" and "salz, tomate" collide.
 * @param {{ title: string, ingredients: string[] }} r
 * @returns {string}
 */
function recipeKey(r) {
  const title = norm(r.title);
  const ings  = (r.ingredients || []).map(norm).sort().join('|');
  return `${title}::${ings}`;
}

/**
 * Returns the first existing recipe that matches the candidate, or null.
 * @param {{ title: string, ingredients: string[] }} candidate
 * @param {Array<{ title: string, ingredients: string[] }>} existingList
 * @returns {object|null}
 */
function findDuplicate(candidate, existingList) {
  const key = recipeKey(candidate);
  for (const r of existingList) {
    if (recipeKey(r) === key) return r;
  }
  return null;
}

module.exports = { recipeKey, findDuplicate, norm };
