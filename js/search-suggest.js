/**
 * SpareFoodCalculator - Search Suggestions
 * =========================================
 * Did-you-mean and autocomplete for the recipe page.
 * Needs search.js (matching engine) to be loaded first.
 */

// ==================== SUGGESTIONS (did-you-mean, autocomplete) ====================

/** Words worth suggesting: every recipe ingredient plus catalog words that lead to at least one recipe. */
function getSuggestionPool() {
  const tables = getTables();
  if (tables.pool) return tables.pool;
  const pool = new Map();
  tables.recipeIngredients.forEach((name, key) => pool.set(key, name));
  const recipeEntries = Array.from(tables.recipeIngredients.values()).map(buildEntry);
  if (typeof Ingredients !== 'undefined' && Array.isArray(Ingredients.allIngredients)) {
    Ingredients.allIngredients.forEach(word => {
      const entry = buildEntry(word);
      if (!pool.has(entry.key) && recipeEntries.some(recipeEntry => scoreEntries(entry, recipeEntry, tables) >= MATCH_THRESHOLD)) pool.set(entry.key, word);
    });
  }
  tables.pool = Array.from(pool.values());
  return tables.pool;
}

/** Display text of a suggestion in the active language. */
function localizeSuggestion(word) {
  const lang = typeof getLang === 'function' ? getLang() : 'de';
  return (lang === 'en' && typeof translateIngredient === 'function') ? translateIngredient(word, 'en') : word;
}

/**
 * Suggests the closest known ingredient for an unknown word.
 * @param {string} input Word as typed.
 * @returns {{suggestion: string, distance: number}|null} Null when the word is known or nothing is close.
 */
function findDidYouMean(input) {
  if (!input || foldText(input).length < 4 || buildQuery(input).known) return null;
  const typed = applyPhoneticNormalization(foldText(input));
  const allowed = Math.min(2, getMaxAllowedErrors(typed.length));
  let best = null;
  getSuggestionPool().forEach(word => {
    const candidate = applyPhoneticNormalization(foldText(word));
    const distance = calculateDamerauLevenshtein(typed, candidate, allowed);
    if (distance > allowed || typed[0] !== candidate[0]) return;
    if (!best || distance < best.distance || (distance === best.distance && word.length < best.suggestion.length)) best = { suggestion: word, distance };
  });
  return best && { suggestion: localizeSuggestion(best.suggestion), distance: best.distance };
}

/**
 * Top suggestions while typing: word start, then part of a word, then typo.
 * @param {string} input Text typed so far.
 * @param {number} [maxResults] Number of suggestions, default 3.
 * @returns {{text: string, distance: number}[]} Suggestions, best first.
 */
function getAutocompleteSuggestions(input, maxResults) {
  const typed = foldText(input);
  if (typed.length < 2) return [];
  const scored = [];
  getSuggestionPool().forEach(word => {
    const text = localizeSuggestion(word);
    const candidate = foldText(text);
    if (candidate === typed) return;
    let score = 0;
    let distance = 0;
    if (candidate.startsWith(typed)) score = 100 - candidate.length;
    else if (candidate.includes(' ' + typed)) score = 70 - candidate.length;
    else if (typed.length >= 3 && candidate.includes(typed)) score = 50 - candidate.length;
    else if (typed.length >= 4) {
      distance = calculateDamerauLevenshtein(applyPhoneticNormalization(typed), applyPhoneticNormalization(candidate), 2);
      if (distance <= 2 && typed[0] === candidate[0]) score = 30 - distance * 10; else distance = 0;
    }
    if (score > 0) scored.push({ text, score, distance });
  });
  scored.sort((a, b) => (b.score - a.score) || a.text.localeCompare(b.text, 'de'));
  return scored.slice(0, maxResults || 3).map(item => ({ text: item.text, distance: item.distance }));
}
