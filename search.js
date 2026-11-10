/**
 * SpareFoodCalculator - Search & Matching Module
 * ================================================
 * One matching engine for the recipe page, the ingredient generator and the
 * search worker. No DOM access in this file, so the worker can importScripts it.
 *
 * Pipeline per ingredient pair: fold (umlauts, accents) -> tokens -> stems ->
 * exact / synonym / compound-head / generic group -> typo distance (OSA).
 */

// ==================== WORD LISTS ====================

// Same ingredient, different word: counts as a full match.
const SYNONYM_GROUPS = [
  ['ei', 'eier'], ['huhn', 'hähnchen', 'hendl', 'hühnchen', 'poulet'], ['karotte', 'möhre', 'gelbe rübe'],
  ['kartoffel', 'erdäpfel', 'erdapfel'], ['tomate', 'paradeiser'], ['lauch', 'porree'], ['sahne', 'obers', 'schlagobers', 'schlagsahne'],
  ['quark', 'topfen'], ['hackfleisch', 'faschiertes', 'hack', 'rinderhack', 'schweinehack', 'schweinefaschiertes'],
  ['rind', 'rindfleisch'], ['schwein', 'schweinefleisch'], ['chili', 'chiliflocken', 'chilipulver'],
  ['zitrone', 'zitronensaft'], ['limette', 'limettensaft'], ['puderzucker', 'staubzucker'], ['paniermehl', 'semmelbrösel', 'brösel'],
  ['brötchen', 'semmel'], ['sojasauce', 'sojasoße'], ['pilze', 'schwammerl'], ['pfifferlinge', 'eierschwammerl'], ['blumenkohl', 'karfiol'],
  ['aprikosen', 'marillen'], ['weißkohl', 'weißkraut'], ['hefe', 'germ'], ['mais', 'kukuruz'], ['meerrettich', 'kren'],
  ['aubergine', 'melanzani'], ['feldsalat', 'vogerlsalat'], ['grüne bohnen', 'fisolen'], ['johannisbeeren', 'ribisel'],
  ['speisestärke', 'maisstärke', 'stärke'], ['saure sahne', 'sauerrahm'], ['koriander', 'koriandergrün', 'korianderkraut'],
  ['curry', 'currypulver'], ['vanille', 'vanilleschote', 'vanilleextrakt'], ['zimt', 'zimtstange'], ['muskat', 'muskatnuss'],
  ['brühe', 'fond', 'bouillon'], ['nudeln', 'pasta'], ['pflaumen', 'zwetschgen'], ['paprikapulver', 'rosenpaprika'],
  ['fünf gewürze', 'fünf-gewürze-pulver']
];

// Generic word <-> specific members. Members never match each other (Rind is not Schwein).
const GENERIC_GROUPS = {
  fisch: ['lachs', 'lachsfilet', 'forelle', 'kabeljau', 'zander', 'hering', 'aal', 'seelachs', 'dorsch'],
  fleisch: ['rind', 'schwein', 'lamm', 'kalb', 'hähnchen', 'ente', 'pute'],
  kräuter: ['petersilie', 'schnittlauch', 'basilikum', 'dill', 'thymian', 'rosmarin', 'oregano', 'salbei', 'majoran', 'kerbel', 'minze', 'koriander'],
  käse: ['parmesan', 'mozzarella', 'gouda', 'feta', 'emmentaler', 'cheddar', 'gruyere', 'camembert', 'pecorino'],
  nudeln: ['spaghetti', 'penne', 'fusilli', 'bucatini'],
  pilze: ['champignons', 'shiitake', 'pfifferlinge', 'steinpilze'],
  reis: ['basmati', 'arborio'],
  ei: ['eigelb', 'eiweiß'],
  eier: ['eigelb', 'eiweiß']
};

// Animal words: "Rind" covers the cuts ("Rinderbrust"), but never broth, lard or offal.
const ANIMAL_ROOTS = [['rind'], ['schwein'], ['kalb'], ['lamm'], ['hahn', 'huhn', 'hendl', 'poulet'], ['lachs'], ['ente'], ['pute']];
const GENERIC_WITH_CUTS = new Set(['fisch', 'fleisch']);
const NOT_MEAT_PATTERN = /(bruhe|fond|schmalz|leber|lunge|wurst|wurste|schinken|knochen)$/;

// Looks like "X + head word" but is a different food: never match by word ending.
const OPAQUE_COMPOUNDS = [
  ['schwein', 'wein'], ['knoblauch', 'lauch'], ['schnittlauch', 'lauch'], ['barlauch', 'lauch'], ['kokosmilch', 'milch'],
  ['buttermilch', 'milch'], ['paniermehl', 'mehl'], ['erdnussbutter', 'butter'], ['kreuzkummel', 'kummel'],
  ['susskartoffel', 'kartoffel'], ['kichererbs', 'erbs'], ['blumenkohl', 'kohl'], ['rosenkohl', 'kohl'], ['muskatnuss', 'nuss'],
  ['leberkas', 'kas'], ['kirschwasser', 'wasser'], ['tomatenmark', 'mark'], ['erdapfel', 'apfel'], ['rosenpaprika', 'paprika'],
  ['gewurzgurk', 'gurk'], ['sauresahne', 'sahne']
];

// Multi-word names that are one thing (otherwise "saure sahne" would match "sahne").
const FIXED_PHRASES = ['saure sahne', 'creme fraiche', 'fleur de sel', 'pak choi', 'garam masala', 'sambal olek', 'kecap manis',
  'urad dal', 'rote beete', 'teriyaki sauce', 'funf gewurze', 'funf gewurze pulver', 'shaoxing wein', 'szechuan pfeffer'];

const STOPWORDS = new Set(['und', 'mit', 'oder', 'der', 'die', 'das', 'ein', 'eine', 'in', 'auf', 'fur', 'von', 'zu', 'als', 'aus', 'dem', 'den']);
const ADJECTIVE_PATTERN = /^(rot|gelb|grun|schwarz|weiss|frisch|getrocknet|gemahlen|gehackt|gerieben|klein|gross)(e|er|es|en|em)?$/;
// Reason: the stemmer would turn "kräuter" into "kraut" (cabbage) and "eier" must stay apart from "ei".
const STEM_EXCEPTIONS = new Set(['krauter', 'eier']);
// Things almost everyone has at home: missing them should not push a recipe down.
const PANTRY_STAPLE_WORDS = ['salz', 'pfeffer', 'wasser', 'öl', 'zucker'];
const MATCH_THRESHOLD = 0.5;

// ==================== NORMALIZATION ====================

/**
 * Folds text for comparison: lower case, ß -> ss, umlauts and accents to base
 * letters, typed ae/oe/ue to a/o/u. "Käse", "Kaese" and "Kase" become equal.
 * @param {string} text Raw text.
 * @returns {string} Folded text with single spaces.
 */
function foldText(text) {
  if (!text) return '';
  return String(text).toLowerCase().replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Kept for older callers: lower case and typed ae/oe/ue to umlauts. */
function normalizeString(inputText) {
  if (!inputText) return '';
  return inputText.toLowerCase().trim().replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü');
}

const PHONETIC_REPLACEMENTS = [[/ck/g, 'k'], [/tz/g, 'z'], [/ph/g, 'f'], [/ai/g, 'ei'], [/th/g, 't'], [/dt/g, 't'], [/ie/g, 'i'], [/y/g, 'i']];

/** Removes common German sound confusions before the typo comparison. */
function applyPhoneticNormalization(text) {
  return PHONETIC_REPLACEMENTS.reduce((result, pair) => result.replace(pair[0], pair[1]), text);
}

/**
 * Light German stemmer: strips plural and case endings from a folded word.
 * @param {string} word Folded single word.
 * @returns {string} Word stem.
 */
function applyStemming(word) {
  if (!word || word.length < 4 || STEM_EXCEPTIONS.has(word)) return word;
  const rules = [['chen', 4], ['lein', 4], ['ern', 4], ['en', 4], ['er', 4], ['es', 4], ['e', 4], ['s', 5]];
  for (const [suffix, minRoot] of rules) {
    if (word.endsWith(suffix) && word.length - suffix.length >= minRoot) return word.slice(0, -suffix.length);
  }
  // Reason: plurals like "zwiebeln", "nudeln", "kapern" only add an "n".
  if (/[lr]n$/.test(word) && word.length - 1 >= 4) return word.slice(0, -1);
  return word;
}

const _entryCache = new Map();

/**
 * Turns an ingredient name into its comparable form.
 * @param {string} phrase Ingredient name as typed or stored.
 * @returns {{folded: string, tokens: string[], stems: string[], key: string}} Comparable entry.
 */
function buildEntry(phrase) {
  const cached = _entryCache.get(phrase);
  if (cached) return cached;
  const folded = foldText(phrase);
  let tokens;
  if (FIXED_PHRASES.includes(folded)) {
    tokens = [folded.replace(/ /g, '')];
  } else {
    const words = folded.split(' ').filter(word => word && !STOPWORDS.has(word));
    const content = words.filter(word => !ADJECTIVE_PATTERN.test(word));
    tokens = content.length ? content : words;
  }
  const stems = tokens.map(applyStemming);
  const entry = { folded, tokens, stems, key: stems.join(' ') };
  _entryCache.set(phrase, entry);
  return entry;
}

const PANTRY_STAPLES = new Set(PANTRY_STAPLE_WORDS.map(word => buildEntry(word).key));

/**
 * Finds the animal a word belongs to.
 * @param {string} token Folded word.
 * @param {string} stem Its stem.
 * @returns {{id: number, bare: boolean}|null} bare is true for "rind" or "rindfleisch", false for a cut like "rinderbrust".
 */
function getAnimalInfo(token, stem) {
  for (let id = 0; id < ANIMAL_ROOTS.length; id++) {
    for (const root of ANIMAL_ROOTS[id]) {
      if (stem === root || (token.startsWith(root) && token.endsWith('fleisch'))) return { id, bare: true };
      if (token.startsWith(root) && token.length > root.length + 2 && !NOT_MEAT_PATTERN.test(token)) return { id, bare: false };
    }
  }
  return null;
}

// ==================== LOOKUP TABLES (built on first use) ====================

let _tables = null;

/** @returns {Array} Loaded recipes or an empty list (page and worker safe). */
function getLoadedRecipes() {
  return (typeof recipes !== 'undefined' && Array.isArray(recipes)) ? recipes : [];
}

/**
 * Builds synonym, generic, English and vocabulary lookups. Rebuilt when the
 * recipe count changes, because recipes arrive asynchronously.
 * @returns {object} Lookup tables.
 */
function getTables() {
  const recipeList = getLoadedRecipes();
  if (_tables && _tables.recipeCount === recipeList.length) return _tables;

  const synonymIds = new Map();
  const groups = SYNONYM_GROUPS.slice();
  if (typeof Ingredients !== 'undefined' && Ingredients.ingredientSynonyms) {
    Object.entries(Ingredients.ingredientSynonyms).forEach(pair => groups.push(pair));
  }
  groups.forEach((group, index) => group.forEach(word => {
    const key = buildEntry(word).key;
    // Reason: a word that is already in a group keeps its first group, so chains stay stable.
    if (!synonymIds.has(key)) synonymIds.set(key, synonymIds.get(buildEntry(group[0]).key) || 'g' + index);
  }));

  const genericMembers = new Map();
  Object.entries(GENERIC_GROUPS).forEach(([generic, members]) => {
    genericMembers.set(buildEntry(generic).key, members.map(member => buildEntry(member).key));
  });

  const englishToGerman = new Map();
  if (typeof ingredientTranslations !== 'undefined' && ingredientTranslations) {
    Object.entries(ingredientTranslations).forEach(([german, english]) => {
      const foldedEnglish = foldText(english);
      if (foldedEnglish && foldedEnglish !== foldText(german) && !englishToGerman.has(foldedEnglish)) englishToGerman.set(foldedEnglish, german);
    });
  }

  const recipeIngredients = new Map();
  recipeList.forEach(recipe => (recipe.ingredients || []).forEach(name => {
    const entry = buildEntry(name);
    if (!recipeIngredients.has(entry.key)) recipeIngredients.set(entry.key, String(name).toLowerCase());
  }));

  const vocabulary = new Set();
  const addWords = phrase => buildEntry(phrase).stems.forEach(stem => vocabulary.add(stem));
  recipeIngredients.forEach(name => addWords(name));
  if (typeof Ingredients !== 'undefined' && Array.isArray(Ingredients.allIngredients)) Ingredients.allIngredients.forEach(addWords);
  groups.forEach(group => group.forEach(addWords));
  Object.entries(GENERIC_GROUPS).forEach(([generic, members]) => { addWords(generic); members.forEach(addWords); });

  _tables = { recipeCount: recipeList.length, synonymIds, genericMembers, englishToGerman, recipeIngredients, vocabulary, pool: null };
  return _tables;
}

// ==================== TYPO DISTANCE ====================

let _distanceBuffer = new Int32Array(1024);

/**
 * Edit distance with insert, delete, replace and swap of neighbours
 * (Damerau-Levenshtein in the "optimal string alignment" variant).
 * Stops early once every value in a row is above maxAllowed.
 * @param {string} source First word.
 * @param {string} target Second word.
 * @param {number} [maxAllowed] Threshold for the early exit.
 * @returns {number} Distance, or maxAllowed + 1 when it is above the threshold.
 */
function calculateDamerauLevenshtein(source, target, maxAllowed) {
  if (source === target) return 0;
  const m = source.length;
  const n = target.length;
  if (m === 0) return n;
  if (n === 0) return m;
  if (typeof maxAllowed === 'number' && Math.abs(m - n) > maxAllowed) return maxAllowed + 1;

  const stride = n + 1;
  const size = (m + 1) * stride;
  if (_distanceBuffer.length < size) _distanceBuffer = new Int32Array(Math.max(size, _distanceBuffer.length * 2));
  const d = _distanceBuffer;
  for (let i = 0; i <= m; i++) d[i * stride] = i;
  for (let j = 0; j <= n; j++) d[j] = j;

  for (let i = 1; i <= m; i++) {
    const row = i * stride;
    const previousRow = row - stride;
    const sourceChar = source.charCodeAt(i - 1);
    let rowMin = 0x7fffffff;
    for (let j = 1; j <= n; j++) {
      const cost = sourceChar === target.charCodeAt(j - 1) ? 0 : 1;
      let value = Math.min(d[previousRow + j] + 1, d[row + j - 1] + 1, d[previousRow + j - 1] + cost);
      if (i > 1 && j > 1 && sourceChar === target.charCodeAt(j - 2) && source.charCodeAt(i - 2) === target.charCodeAt(j - 1)) {
        value = Math.min(value, d[(i - 2) * stride + (j - 2)] + 1);
      }
      d[row + j] = value;
      if (value < rowMin) rowMin = value;
    }
    if (typeof maxAllowed === 'number' && rowMin > maxAllowed) return maxAllowed + 1;
  }
  return d[m * stride + n];
}

/** Allowed typos by word length: up to 4 letters 1, up to 8 letters 2, longer 3. */
function getMaxAllowedErrors(length) {
  if (length <= 4) return 1;
  return length <= 8 ? 2 : 3;
}

// ==================== MATCHING ====================

/** True when "longWord ends with shortWord" is only a coincidence (Knoblauch is no Lauch). */
function isOpaqueCompound(longWord, shortWord) {
  return OPAQUE_COMPOUNDS.some(pair => longWord.startsWith(pair[0]) && shortWord.startsWith(pair[1]));
}

/** Score for two single words: same stem, synonym, or compound head ("Olivenöl" is an "Öl"). */
function scoreWordPair(tokenA, stemA, tokenB, stemB, tables) {
  if (stemA === stemB) return 1;
  const idA = tables.synonymIds.get(stemA);
  if (idA && idA === tables.synonymIds.get(stemB)) return 1;
  const aIsLong = tokenA.length >= tokenB.length;
  const longToken = aIsLong ? tokenA : tokenB;
  const shortToken = aIsLong ? tokenB : tokenA;
  const longStem = aIsLong ? stemA : stemB;
  const shortStem = aIsLong ? stemB : stemA;
  const headIsLongEnough = shortToken.length >= 3 || shortToken === 'ol';
  if (headIsLongEnough && longToken.length - shortToken.length >= 3 &&
      (longToken.endsWith(shortToken) || longStem.endsWith(shortStem)) && !isOpaqueCompound(longToken, shortToken)) return 0.85;
  const animalA = getAnimalInfo(tokenA, stemA);
  const animalB = animalA && getAnimalInfo(tokenB, stemB);
  // Reason: "Rind" covers "Rinderbrust", but two different cuts are not the same thing.
  if (animalB && animalA.id === animalB.id && (animalA.bare || animalB.bare)) return 0.8;
  return 0;
}

/**
 * Score for two ingredient names without typo tolerance.
 * @param {object} userEntry Entry of the user's ingredient.
 * @param {object} recipeEntry Entry of the recipe ingredient.
 * @param {object} tables Lookup tables.
 * @returns {number} 0 (different) to 1 (same ingredient).
 */
function scoreEntries(userEntry, recipeEntry, tables) {
  if (!userEntry.key || !recipeEntry.key) return 0;
  if (userEntry.key === recipeEntry.key) return 1;
  const userId = tables.synonymIds.get(userEntry.key);
  if (userId && userId === tables.synonymIds.get(recipeEntry.key)) return 1;

  const userIsShort = userEntry.stems.length <= recipeEntry.stems.length;
  const shortEntry = userIsShort ? userEntry : recipeEntry;
  const longEntry = userIsShort ? recipeEntry : userEntry;
  let weakest = 1;
  for (let i = 0; i < shortEntry.stems.length && weakest > 0; i++) {
    let best = 0;
    for (let j = 0; j < longEntry.stems.length; j++) {
      best = Math.max(best, scoreWordPair(shortEntry.tokens[i], shortEntry.stems[i], longEntry.tokens[j], longEntry.stems[j], tables));
    }
    weakest = Math.min(weakest, best);
  }
  if (weakest > 0) return weakest * (shortEntry.stems.length === longEntry.stems.length ? 1 : 0.92);

  // Reason: only animals have cuts ("Lachsfilet" is fish); "Koriandersamen" is not a herb.
  const isMember = (genericEntry, specificEntry) => (tables.genericMembers.get(genericEntry.key) || [])
    .some(memberKey => specificEntry.stems.some((stem, index) => stem === memberKey ||
      (GENERIC_WITH_CUTS.has(genericEntry.key) && stem.startsWith(memberKey) && !NOT_MEAT_PATTERN.test(specificEntry.tokens[index]))));
  if (isMember(userEntry, recipeEntry)) return 0.75;
  if (isMember(recipeEntry, userEntry)) return 0.8;
  return 0;
}

/**
 * Prepares one user ingredient: German reading, English reading, known or not.
 * @param {string} rawInput Ingredient as typed.
 * @returns {{raw: string, entries: object[], known: boolean}} Query object.
 */
function buildQuery(rawInput) {
  const tables = getTables();
  const entry = buildEntry(rawInput);
  const entries = [entry];
  // Reason: accept "egg" for "eggs" and "tomatoes" for "tomato".
  const english = [entry.folded, entry.folded.replace(/e?s$/, ''), entry.folded + 's', entry.folded + 'es']
    .map(form => tables.englishToGerman.get(form)).find(Boolean);
  if (english) entries.push(buildEntry(english));
  const known = Boolean(english) || tables.synonymIds.has(entry.key) || tables.genericMembers.has(entry.key) ||
    (entry.stems.length > 0 && entry.stems.every(stem => tables.vocabulary.has(stem)));
  return { raw: rawInput, entries, known };
}

/** Typo and "still typing" score. Only used for words the app does not know. */
function scoreTypo(userEntry, recipeEntry) {
  if (userEntry.stems.length !== 1 || userEntry.folded.length < 4) return 0;
  const typed = applyPhoneticNormalization(userEntry.stems[0]);
  let best = 0;
  recipeEntry.stems.forEach((stem, index) => {
    if (recipeEntry.tokens[index].startsWith(userEntry.tokens[0])) { best = Math.max(best, 0.8); return; }
    const candidate = applyPhoneticNormalization(stem);
    if (typed === candidate) { best = Math.max(best, 0.95); return; }
    const maxLength = Math.max(typed.length, candidate.length);
    const allowed = getMaxAllowedErrors(maxLength);
    const distance = calculateDamerauLevenshtein(typed, candidate, allowed);
    // Reason: short words need a matching first letter, otherwise "mehl" would turn into "mohn".
    if (distance > allowed || (maxLength <= 5 && typed[0] !== candidate[0])) return;
    best = Math.max(best, distance === 1 ? 0.88 : distance === 2 ? 0.68 : 0.52);
  });
  return best;
}

/**
 * How well does one user ingredient cover one recipe ingredient?
 * @param {string|object} userIngredient Typed name or a prepared query.
 * @param {string} recipeIngredient Ingredient name from a recipe.
 * @returns {number} 0 to 1, a match from MATCH_THRESHOLD upwards.
 */
function calculateFuzzyMatchScore(userIngredient, recipeIngredient) {
  const tables = getTables();
  const query = typeof userIngredient === 'string' ? buildQuery(userIngredient) : userIngredient;
  const recipeEntry = buildEntry(recipeIngredient);
  let best = 0;
  query.entries.forEach(entry => { best = Math.max(best, scoreEntries(entry, recipeEntry, tables)); });
  if (best === 0 && !query.known) best = scoreTypo(query.entries[0], recipeEntry);
  return best;
}

/** True when the user's ingredient counts as the recipe ingredient. */
function ingredientsMatch(userIngredient, recipeIngredient) {
  return calculateFuzzyMatchScore(userIngredient, recipeIngredient) >= MATCH_THRESHOLD;
}

// ==================== VEGETARIAN CHECK ====================

// Reason: animal words need a word start, otherwise "rind" would hit "Zitronenrinde".
const MEAT_ANYWHERE = 'fleisch|schwein|fisch|lachs|kabeljau|forelle|zander|hering|sardell|anchov|garnel|shrimp|muschel|krabb|speck|schinken|' +
  'wurst|salami|kassler|guanciale|leberkas|faschiert|gelatine|auster|dashi|katsuobushi|knochen';
const NON_VEGETARIAN_PATTERN = new RegExp(MEAT_ANYWHERE + '|(^| )(rind|hahn|huhn|hendl|lamm|kalb|ente|pute|gans|hack)|(^| )(aal|wild)( |$)');

/**
 * True when no ingredient is meat, fish or made from them (broth, gelatine).
 * @param {{ingredients: string[]}} recipe Recipe to check.
 * @returns {boolean} Vegetarian or not.
 */
function isVegetarianRecipe(recipe) {
  return !((recipe && recipe.ingredients) || []).some(name => NON_VEGETARIAN_PATTERN.test(foldText(name)));
}

// ==================== RECIPE SEARCH ====================

/**
 * Ranks all recipes for the user's ingredients.
 * @param {string[]} userIngredients Ingredients the user has.
 * @param {{light?: boolean}} [options] light: return only ids and match data (for the worker).
 * @returns {object[]} Recipes with at least one hit: complete matches first, then by score.
 *   Fields: id, title, score, matchCount, isExact, haveIngredients, missingIngredients, unmatchedUserIngredients.
 */
function findMatchingRecipes(userIngredients, options) {
  if (!Array.isArray(userIngredients) || userIngredients.length === 0) return [];
  const queries = userIngredients.filter(Boolean).map(buildQuery);
  const pairCache = new Map();
  const scorePair = (queryIndex, ingredient) => {
    const cacheKey = queryIndex + '|' + ingredient;
    if (!pairCache.has(cacheKey)) pairCache.set(cacheKey, calculateFuzzyMatchScore(queries[queryIndex], ingredient));
    return pairCache.get(cacheKey);
  };

  const results = [];
  getLoadedRecipes().forEach(recipe => {
    const bestPerQuery = queries.map(() => 0);
    const haveIngredients = [];
    const missingIngredients = [];
    let coveredWeight = 0;
    let totalWeight = 0;
    (recipe.ingredients || []).forEach(ingredient => {
      let best = 0;
      queries.forEach((query, index) => {
        const score = scorePair(index, ingredient);
        if (score > best) best = score;
        if (score > bestPerQuery[index]) bestPerQuery[index] = score;
      });
      const weight = PANTRY_STAPLES.has(buildEntry(ingredient).key) ? 0.25 : 1;
      totalWeight += weight;
      if (best >= MATCH_THRESHOLD) { haveIngredients.push(ingredient); coveredWeight += weight; } else missingIngredients.push(ingredient);
    });

    const matchedScores = bestPerQuery.filter(score => score >= MATCH_THRESHOLD);
    if (matchedScores.length === 0) return;
    const quality = matchedScores.reduce((sum, score) => sum + score, 0) / matchedScores.length;
    const userCoverage = matchedScores.length / queries.length;
    const recipeCoverage = totalWeight > 0 ? coveredWeight / totalWeight : 0;
    const analysis = {
      id: recipe.id, title: recipe.title,
      score: quality * (0.55 * userCoverage + 0.45 * recipeCoverage),
      matchCount: matchedScores.length, isExact: matchedScores.length === queries.length,
      haveIngredients, missingIngredients,
      unmatchedUserIngredients: queries.filter((query, index) => bestPerQuery[index] < MATCH_THRESHOLD).map(query => query.raw)
    };
    results.push(options && options.light ? analysis : Object.assign({}, recipe, analysis));
  });

  return results.sort((a, b) => (Number(b.isExact) - Number(a.isExact)) || (b.score - a.score) ||
    (a.missingIngredients.length - b.missingIngredients.length) || (a.id - b.id));
}
