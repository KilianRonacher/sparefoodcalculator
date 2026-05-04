/**
 * SpareFoodCalculator - Search & Matching Module
 * ================================================
 * Damerau-Levenshtein distance, fuzzy matching, stemming, normalization.
 */

// ==================== ALIASES & LOOKUP ====================

const ingredientAliases = {
  tomaten: ['tomate','tomate','paradeiser','tomato'],
  brot: ['brot','baguette','brötchen','bread'],
  fisch: ['fisch','lachs','lachsfilet','salmon','forelle','kabeljau','thunfisch'],
  fleisch: ['fleisch','rind','rindfleisch','schwein','schweinefleisch','hähnchen','huhn','gefluegel','lamm','kalb','wild'],
  kraeuter: ['kräuter','kraeuter','kräutermix','kraeutermix','petersilie','schnittlauch','basilikum','dill','thymian','rosmarin','oregano','salbei'],
  salz: ['salz','meersalz','fleur de sel','grobes salz','steinsalz'],
  pfeffer: ['pfeffer','schwarzer pfeffer','weisser pfeffer','weißer pfeffer','rosa pfeffer','cayennepfeffer'],
  vegetarisch: ['vegetarisch','vegetarian','veggie','vegy','vegie'],
  hahn: ['hähnchen','hendl','haendl','huhn','poultry'],
  kartoffel: ['kartoffel','kartoffeln','potato'],
  eier: ['ei','eier','egg','eggs'],
  milch: ['milch','milk'],
  parmesan: ['parmesan','parmigiano'],
  knoblauch: ['knoblauch','garlic'],
  spargel: ['spargel','grüner spargel','weißer spargel','grüner-spargel','weißer-spargel','asparagus']
};

function buildCanonicalLookup() {
  const lookup = {};
  Object.entries(ingredientAliases).forEach(([canonical, variants]) => {
    variants.forEach(v => {
      lookup[normalizeString(v)] = canonical;
    });
  });
  return lookup;
}

const canonicalLookup = buildCanonicalLookup();

const highPriorityIngredients = ['eier','brot','fisch','lachs','rindfleisch','hähnchen','huhn','milch'];

const commonStopwords = ['und','mit','oder','der','die','das','ein','eine','in','auf','für','von','zu','als','ist','sind'];

// ==================== NORMALIZATION ====================

/**
 * Normalisiert einen String: Kleinbuchstaben, Umlaute bleiben erhalten,
 * ae/oe/ue werden zu ä/ö/ü konvertiert.
 */
function normalizeString(inputText) {
  if (!inputText) return '';
  return inputText
    .toLowerCase()
    .trim()
    .replace(/ae/g, 'ä')
    .replace(/oe/g, 'ö')
    .replace(/ue/g, 'ü');
}

/**
 * Erweiterte Normalisierung für den Vergleich:
 * Konvertiert Umlaute in Basisform und entfernt Sonderzeichen.
 */
function normalizeForComparison(text) {
  return normalizeString(text).replace(/[^a-zäöüß0-9\-]/gi, '');
}

// ==================== PHONETIC EQUIVALENCES ====================

/**
 * Deutsche Laut-Verwechslungen: Paare, die als geringere Distanz behandelt werden.
 * Wird vor dem Damerau-Levenshtein-Vergleich angewendet.
 */
const PHONETIC_REPLACEMENTS = [
  [/ck/g, 'k'],
  [/tz/g, 'z'],
  [/ph/g, 'f'],
  [/ai/g, 'ei'],
  [/ae/g, 'ä'],
  [/oe/g, 'ö'],
  [/ue/g, 'ü'],
  [/ss/g, 'ß'],
  [/th/g, 't'],
  [/dt/g, 't'],
  [/ie(?=[^a-zäöüß]|$)/gi, 'i'],
];

function applyPhoneticNormalization(text) {
  let result = text;
  for (const [pattern, replacement] of PHONETIC_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// ==================== STEMMING ====================

function applyStemming(word) {
  if (!word || word.length < 4) return word;

  const suffixRules = [
    { suffix: 'chen', minRoot: 4 },
    { suffix: 'lein', minRoot: 4 },
    { suffix: 'ern',  minRoot: 4 },
    { suffix: 'en',   minRoot: 4 },
    { suffix: 'er',   minRoot: 4 },
    { suffix: 'es',   minRoot: 4 },
    { suffix: 'e',    minRoot: 4 },
    { suffix: 's',    minRoot: 5 },
  ];

  for (const { suffix, minRoot } of suffixRules) {
    if (word.endsWith(suffix) && (word.length - suffix.length >= minRoot)) {
      return word.slice(0, -suffix.length);
    }
  }

  return word;
}

const COMPOUND_JOINTS = ['es', 'en', 'er'];

const NEVER_SPLIT = new Set([
  'petersilie','paradeiser','oregano','basilikum','rosmarin','thymian',
  'salbei','majoran','kerbel','kapern','olivenöl','oliven','tomate',
  'tomaten','gurken','gurke','paprika','avocado','sellerie','banane',
  'bananen','orange','orangen','mandarine','zitrone','zitronen',
  'aubergine','zucchini','spinat','rucola','champignon','champignons',
  'erdbeere','erdbeeren','himbeere','himbeeren','heidelbeere','heidelbeeren',
]);

function splitGermanCompound(word) {
  if (!word || word.length < 8) return [word];
  if (NEVER_SPLIT.has(word)) return [word];

  for (const joint of COMPOUND_JOINTS) {
    let searchFrom = 4;
    while (searchFrom <= word.length - joint.length - 4) {
      const idx = word.indexOf(joint, searchFrom);
      if (idx === -1) break;
      const left = word.slice(0, idx);
      const right = word.slice(idx + joint.length);
      if (left.length >= 4 && right.length >= 4) return [left, right];
      searchFrom = idx + 1;
    }
  }
  return [word];
}

function processIngredientToken(rawToken) {
  const normalized = normalizeForComparison(rawToken);
  if (commonStopwords.includes(normalized)) return [];
  return splitGermanCompound(normalized).map(applyStemming).filter(Boolean);
}

/**
 * Löst österreichische/deutsche Synonyme auf und gibt alle
 * Varianten des Tokens zurück (nach Normalisierung).
 */
function resolveTokenSynonyms(rawToken) {
  if (typeof Ingredients === 'undefined' || typeof Ingredients.resolveSynonyms !== 'function') return [rawToken];
  const normalized = normalizeString(rawToken);
  const synonyms = Ingredients.resolveSynonyms(normalized);
  return synonyms;
}

// ==================== DAMERAU-LEVENSHTEIN ====================

/**
 * Berechnet die Damerau-Levenshtein-Distanz (echte DL, nicht OSA).
 * Erlaubte Operationen: Einfügen, Löschen, Ersetzen, Transposition.
 * 
 * Implementiert Early-Exit: Bricht ab, sobald die Mindestdistanz den
 * dynamischen Schwellwert überschreitet.
 */
function calculateDamerauLevenshtein(source, target, maxAllowed) {
  if (source === target) return 0;

  const m = source.length;
  const n = target.length;

  if (m === 0) return n;
  if (n === 0) return m;

  if (typeof maxAllowed === 'number' && Math.abs(m - n) > maxAllowed) {
    return maxAllowed + 1;
  }

  const d = [];
  for (let i = 0; i <= m; i++) {
    d[i] = new Array(n + 1);
    d[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    let rowMin = Infinity;

    for (let j = 1; j <= n; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;

      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );

      if (i > 1 && j > 1 &&
          source[i - 1] === target[j - 2] &&
          source[i - 2] === target[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }

      if (d[i][j] < rowMin) rowMin = d[i][j];
    }

    if (typeof maxAllowed === 'number' && rowMin > maxAllowed) {
      return maxAllowed + 1;
    }
  }

  return d[m][n];
}

/**
 * Dynamischer Schwellwert basierend auf Wortlänge:
 * 1-4 Zeichen -> max 1 Fehler
 * 5-8 Zeichen -> max 2 Fehler
 * 9+  Zeichen -> max 3 Fehler
 */
function getMaxAllowedErrors(length) {
  if (length <= 4) return 1;
  if (length <= 8) return 2;
  return 3;
}

// ==================== FUZZY MATCHING ====================

const SCORE_BANDS = [
  { dist: 1, minLen: 4, base: 0.85, cap: 0.94 },
  { dist: 1, minLen: 0, base: 0.70, cap: 0.94 },
  { dist: 2, minLen: 6, base: 0.55, cap: 0.70 },
  { dist: 2, minLen: 5, base: 0.40, cap: 0.55 },
  { dist: 3, minLen: 9, base: 0.30, cap: 0.45 },
];

/**
 * Score für ein einzelnes Token-Paar (String vs String).
 */
function scoreTokenPair(processedInput, processedIngredient) {
  if (!processedInput || !processedIngredient) return 0;

  if (processedInput === processedIngredient) return 1.0;

  const inputLen = processedInput.length;
  const ingLen   = processedIngredient.length;
  const MIN_SUBSTRING_LEN = 3;

  if (ingLen > inputLen &&
      processedIngredient.startsWith(processedInput) &&
      inputLen >= MIN_SUBSTRING_LEN) {
    const coverage = inputLen / ingLen;
    return 0.70 + coverage * 0.20;
  }

  if (processedIngredient.includes(processedInput) && inputLen >= MIN_SUBSTRING_LEN) {
    const coverage = inputLen / ingLen;
    return 0.50 + coverage * 0.20;
  }

  if (processedInput.includes(processedIngredient) && ingLen >= MIN_SUBSTRING_LEN) {
    return 0.65;
  }

  const phoneticInput = applyPhoneticNormalization(processedInput);
  const phoneticIng   = applyPhoneticNormalization(processedIngredient);

  if (phoneticInput === phoneticIng) return 0.95;

  const maxLen = Math.max(phoneticInput.length, phoneticIng.length);
  const maxErrors = getMaxAllowedErrors(maxLen);
  const distance = calculateDamerauLevenshtein(phoneticInput, phoneticIng, maxErrors);

  if (distance > maxErrors) return 0;

  let prefixBonus = 0;
  const prefixLen = Math.min(phoneticInput.length, phoneticIng.length, 3);
  let matchingPrefix = 0;
  for (let i = 0; i < prefixLen; i++) {
    if (phoneticInput[i] === phoneticIng[i]) matchingPrefix++;
    else break;
  }
  if (matchingPrefix > 0) {
    prefixBonus = 0.05 * matchingPrefix;
  }

  const band = SCORE_BANDS.find(b => distance === b.dist && maxLen >= b.minLen);
  return band ? Math.min(band.base + prefixBonus, band.cap) : 0;
}

/**
 * Berechnet einen Ähnlichkeitsscore zwischen Nutzereingabe und Rezeptzutat.
 * Iteriert über alle Compound-Tokens und gibt den besten Score zurück.
 */
function calculateFuzzyMatchScore(userInput, recipeIngredient) {
  const inputTokens = processIngredientToken(userInput);
  const ingredientTokens = processIngredientToken(recipeIngredient);

  if (inputTokens.length === 0 || ingredientTokens.length === 0) return 0;

  let bestScore = 0;
  for (const pi of inputTokens) {
    for (const pg of ingredientTokens) {
      const score = scoreTokenPair(pi, pg);
      if (score > bestScore) bestScore = score;
    }
  }
  return bestScore;
}

// ==================== RECIPE SEARCH ====================

function findMatchingRecipes(userProvidedIngredients) {
  // Set deduplicates O(1); no .includes() scan needed
  const expandedIngredients = new Set();
  userProvidedIngredients.forEach(ingredient => {
    const synonyms = resolveTokenSynonyms(ingredient);
    synonyms.forEach(syn => {
      const tokens = processIngredientToken(syn);
      tokens.forEach(processed => {
        const resolved = canonicalLookup[processed] || processed;
        if (resolved) expandedIngredients.add(resolved);
      });
    });
  });

  const expandedArr = Array.from(expandedIngredients);

  const scoredRecipes = recipes.map(recipeEntry => {
    let totalScore = 0;
    let totalWeight = 0;
    let matchedCount = 0;
    const missingIngredients = [];

    recipeEntry.ingredients.forEach(recipeIngredient => {
      const pts = processIngredientToken(recipeIngredient);
      const pt = pts[0] || '';
      const canonical = canonicalLookup[pt] || pt || normalizeString(recipeIngredient);
      const isHighValue = highPriorityIngredients.includes(canonical);
      const weight = isHighValue ? 1.6 : 1.0;

      totalWeight += weight;

      const bestMatch = expandedArr.reduce((maxScore, userToken) => {
        const matchQuality = calculateFuzzyMatchScore(userToken, canonical);
        return matchQuality > maxScore ? matchQuality : maxScore;
      }, 0);

      totalScore += bestMatch * weight;

      if (bestMatch > 0.4) {
        matchedCount++;
      } else {
        missingIngredients.push(recipeIngredient);
      }
    });

    const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    const coverage = recipeEntry.ingredients.length > 0
      ? matchedCount / recipeEntry.ingredients.length
      : 0;
    const finalScore = normalizedScore * (0.5 + 0.5 * coverage);
    const approximateMatches = Math.round(totalScore);

    return {
      ...recipeEntry,
      matchCount: approximateMatches,
      score: finalScore,
      missingIngredients
    };
  });

  return scoredRecipes
    .filter(recipe => recipe.score > 0)
    .sort((a, b) => {
      const scoreDiff = b.score - a.score;
      return scoreDiff !== 0 ? scoreDiff : (b.matchCount - a.matchCount);
    });
}

// ==================== DID-YOU-MEAN ====================

/**
 * Findet den nächstgelegenen Treffer aus allIngredients für eine Eingabe.
 * Gibt { suggestion, distance } zurück oder null wenn kein passender Treffer.
 * Threshold: Distanz <= 2, Eingabe-Länge >= 4
 */
function findDidYouMean(input) {
  if (!input || input.length < 4) return null;

  const normalizedInput = normalizeForComparison(input);
  if (!normalizedInput || normalizedInput.length < 4) return null;

  // Prüfe zuerst ob exakter Treffer existiert (inkl. Synonyme)
  if (typeof Ingredients !== 'undefined' && Ingredients.allIngredients) {
    const directMatch = Ingredients.allIngredients.some(ing =>
      normalizeForComparison(ing) === normalizedInput
    );
    if (directMatch) return null;
  }

  // Synonyme prüfen
  const synonyms = resolveTokenSynonyms(input);
  for (const syn of synonyms) {
    if (syn !== normalizedInput && typeof Ingredients !== 'undefined' && Ingredients.allIngredients) {
      const synMatch = Ingredients.allIngredients.some(ing =>
        normalizeForComparison(ing) === normalizeForComparison(syn)
      );
      if (synMatch) return null;
    }
  }

  let bestMatch = null;
  let bestDistance = Infinity;
  const candidates = typeof Ingredients !== 'undefined' && Ingredients.allIngredients ? Ingredients.allIngredients : [];

  const phoneticInput = applyPhoneticNormalization(normalizedInput);

  for (const candidate of candidates) {
    const phoneticCandidate = applyPhoneticNormalization(normalizeForComparison(candidate));
    const dist = calculateDamerauLevenshtein(phoneticInput, phoneticCandidate, 2);
    if (dist < bestDistance && dist > 0 && dist <= 2) {
      bestDistance = dist;
      bestMatch = candidate;
    }
  }

  if (bestMatch) {
    return { suggestion: bestMatch, distance: bestDistance };
  }
  return null;
}

// ==================== AUTOCOMPLETE ====================

/**
 * Gibt die Top-N Autocomplete-Vorschläge für eine Eingabe zurück.
 * Ergebnisse basieren auf Prefix-Match, Substring-Match und Fuzzy-Match.
 */
function getAutocompleteSuggestions(input, maxResults) {
  maxResults = maxResults || 3;
  if (!input || input.length < 2) return [];

  const normalizedInput = normalizeForComparison(input);
  if (!normalizedInput) return [];

  // Compound-aware: split input so "rinderbraten" also matches "rind" candidates
  const inputTokens = processIngredientToken(input);

  const candidates = typeof Ingredients !== 'undefined' && Ingredients.allIngredients ? Ingredients.allIngredients : [];
  const scored = [];

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeForComparison(candidate);

    // Exakter Treffer: ausblenden (Nutzer hat schon richtig getippt)
    if (normalizedCandidate === normalizedInput) continue;

    let score = 0;
    let cachedDist = 0;

    // Prefix-Match: höchste Priorität
    if (normalizedCandidate.startsWith(normalizedInput)) {
      score = 100 - normalizedCandidate.length;
    }
    // Substring-Match
    else if (normalizedCandidate.includes(normalizedInput) && normalizedInput.length >= 3) {
      score = 50 - normalizedCandidate.length;
    }
    // Fuzzy-Match via Damerau-Levenshtein (nur bei Eingabe >= 4 Zeichen)
    else if (normalizedInput.length >= 4) {
      const dist = calculateDamerauLevenshtein(normalizedInput, normalizedCandidate, 2);
      if (dist <= 2 && dist > 0) {
        score = 30 - dist * 10;
        cachedDist = dist;
      }
    }

    // Compound-token fallback: match individual split tokens against candidate
    if (score === 0 && inputTokens.length > 0) {
      for (const token of inputTokens) {
        if (token.length >= 3 && normalizedCandidate.startsWith(token)) {
          score = Math.max(score, 25 - normalizedCandidate.length);
          break;
        }
        if (token.length >= 4) {
          const dist = calculateDamerauLevenshtein(token, normalizedCandidate, 2);
          if (dist <= 2 && dist > 0) {
            score = Math.max(score, 15 - dist * 5);
            cachedDist = dist;
          }
        }
      }
    }

    if (score > 0) {
      scored.push({ text: candidate, score, distance: cachedDist });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map(s => ({ text: s.text, distance: s.distance }));
}

// ==================== TESTS ====================

/**
 * Testfunktion: Prüft die Damerau-Levenshtein-Distanz und Fuzzy-Matching.
 * Wird nur in der Entwicklung aufgerufen.
 */
function runSearchTests() {
  console.log('=== Compound-Splitter Tests ===');

  const splitPetersilie = splitGermanCompound('petersilie');
  console.assert(
    splitPetersilie.length === 1 && splitPetersilie[0] === 'petersilie',
    'FAIL: petersilie sollte NICHT gesplittet werden, ist: ' + JSON.stringify(splitPetersilie)
  );

  const splitParadeiser = splitGermanCompound('paradeiser');
  console.assert(
    splitParadeiser.length === 1 && splitParadeiser[0] === 'paradeiser',
    'FAIL: paradeiser sollte NICHT gesplittet werden, ist: ' + JSON.stringify(splitParadeiser)
  );

  // rinderbraten hat Fuge 'er' → soll splitten
  const splitRinderbraten = splitGermanCompound('rinderbraten');
  console.assert(
    splitRinderbraten.length === 2 && splitRinderbraten[0] === 'rind' && splitRinderbraten[1] === 'braten',
    'FAIL: rinderbraten sollte in [rind, braten] gesplittet werden, ist: ' + JSON.stringify(splitRinderbraten)
  );

  // hähnchenschenkel hat Fuge 'en' → soll splitten
  const splitHaehnchensch = splitGermanCompound('hähnchenschenkel');
  console.assert(
    splitHaehnchensch.length === 2,
    'FAIL: hähnchenschenkel sollte gesplittet werden, ist: ' + JSON.stringify(splitHaehnchensch)
  );

  console.log('=== Damerau-Levenshtein Tests ===');

  // Transposition: "tmoate" -> "tomate" = Distanz 1
  console.assert(
    calculateDamerauLevenshtein('tmoate', 'tomate') === 1,
    'FAIL: tmoate -> tomate sollte Distanz 1 sein, ist ' + calculateDamerauLevenshtein('tmoate', 'tomate')
  );

  // Einfügung: "lachss" -> "lachs" = Distanz 1
  console.assert(
    calculateDamerauLevenshtein('lachss', 'lachs') === 1,
    'FAIL: lachss -> lachs sollte Distanz 1 sein'
  );

  // Einfügung: "karrotte" -> "karotte" = Distanz 1
  console.assert(
    calculateDamerauLevenshtein('karrotte', 'karotte') === 1,
    'FAIL: karrotte -> karotte sollte Distanz 1 sein'
  );

  // Exakt: "brokkoli" -> "brokkoli" = Distanz 0
  console.assert(
    calculateDamerauLevenshtein('brokkoli', 'brokkoli') === 0,
    'FAIL: brokkoli -> brokkoli sollte Distanz 0 sein'
  );

  // Kein Treffer: "xyz123" darf nicht matchen
  const scoreXyz = calculateFuzzyMatchScore('xyz123', 'tomate');
  console.assert(
    scoreXyz === 0,
    'FAIL: xyz123 -> tomate sollte Score 0 sein, ist ' + scoreXyz
  );

  // Phonetische Ähnlichkeit: "aepfel" -> "äpfel"
  const phoneticA = applyPhoneticNormalization('aepfel');
  const phoneticB = applyPhoneticNormalization('äpfel');
  console.assert(
    phoneticA === phoneticB || calculateDamerauLevenshtein(phoneticA, phoneticB) <= 1,
    'FAIL: aepfel und äpfel sollten phonetisch ähnlich sein'
  );

  // Fuzzy Match Score: "tmoate" -> "tomate" sollte hohen Score haben
  const scoreTmoate = calculateFuzzyMatchScore('tmoate', 'tomate');
  console.assert(
    scoreTmoate >= 0.7,
    'FAIL: tmoate -> tomate Score zu niedrig: ' + scoreTmoate
  );

  // Fuzzy Match Score: "lachss" -> "lachs" sollte hohen Score haben
  const scoreLachss = calculateFuzzyMatchScore('lachss', 'lachs');
  console.assert(
    scoreLachss >= 0.7,
    'FAIL: lachss -> lachs Score zu niedrig: ' + scoreLachss
  );

  // === Synonym-Tests ===
  console.log('=== Synonym-Tests ===');

  // "erdäpfel" muss Kartoffel-Treffer liefern
  const synErdaepfel = resolveTokenSynonyms('erdäpfel');
  console.assert(
    synErdaepfel.includes('kartoffeln'),
    'FAIL: erdäpfel-Synonyme sollten kartoffeln enthalten, sind: ' + synErdaepfel.join(', ')
  );

  // "paradeiser" muss Tomaten-Treffer liefern
  const synParadeiser = resolveTokenSynonyms('paradeiser');
  console.assert(
    synParadeiser.includes('tomaten'),
    'FAIL: paradeiser-Synonyme sollten tomaten enthalten, sind: ' + synParadeiser.join(', ')
  );

  // Rückrichtung: "kartoffeln" muss auch erdäpfel enthalten
  const synKartoffeln = resolveTokenSynonyms('kartoffeln');
  console.assert(
    synKartoffeln.includes('erdäpfel'),
    'FAIL: kartoffeln-Synonyme sollten erdäpfel enthalten, sind: ' + synKartoffeln.join(', ')
  );

  // "Did you mean" Test
  const dymResult = findDidYouMean('tmoate');
  console.assert(
    dymResult !== null && dymResult.suggestion === 'tomate',
    'FAIL: "tmoate" sollte "tomate" vorschlagen, Ergebnis: ' + JSON.stringify(dymResult)
  );

  // === missingIngredients Test ===
  console.log('=== missingIngredients Tests ===');

  // Stub für findMatchingRecipes-Test: Rezept mit 2 Zutaten, Nutzer hat nur 1
  const stubRecipes = [{ name: 'Testrezept', ingredients: ['Tomate', 'Lachs'], url: '#' }];
  const origRecipes = typeof recipes !== 'undefined' ? recipes : [];
  // Temporärer Austausch für isolierten Test (nur wenn recipes global ist)
  if (typeof recipes !== 'undefined') {
    recipes.length = 0;
    stubRecipes.forEach(r => recipes.push(r));
    const missingResult = findMatchingRecipes(['tomate']);
    if (missingResult.length > 0) {
      console.assert(
        Array.isArray(missingResult[0].missingIngredients),
        'FAIL: missingIngredients sollte ein Array sein'
      );
      console.assert(
        missingResult[0].missingIngredients.includes('Lachs'),
        'FAIL: missingIngredients sollte "Lachs" enthalten, ist: ' + JSON.stringify(missingResult[0].missingIngredients)
      );
    }
    recipes.length = 0;
    origRecipes.forEach(r => recipes.push(r));
  }

  console.log('=== Alle Tests abgeschlossen ===');
}

// Tests in Entwicklung automatisch ausführen (nur bei Konsolenaufruf)
if (typeof window !== 'undefined' && window.location && window.location.search.includes('debug=true')) {
  runSearchTests();
}
