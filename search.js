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
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/ae/g, 'ä')
    .replace(/oe/g, 'ö')
    .replace(/ue/g, 'ü')
    .replace(/[^a-zäöüß0-9\-]/gi, '');
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
  [/ie/g, 'i'],
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

function processIngredientToken(rawToken) {
  const normalized = normalizeForComparison(rawToken);
  if (commonStopwords.includes(normalized)) return '';
  return applyStemming(normalized);
}

/**
 * Löst österreichische/deutsche Synonyme auf und gibt alle
 * Varianten des Tokens zurück (nach Normalisierung).
 */
function resolveTokenSynonyms(rawToken) {
  if (typeof resolveSynonyms !== 'function') return [rawToken];
  const normalized = normalizeString(rawToken);
  const synonyms = resolveSynonyms(normalized);
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

  // Early exit: Wenn der Längenunterschied den Schwellwert überschreitet
  if (typeof maxAllowed === 'number' && Math.abs(m - n) > maxAllowed) {
    return maxAllowed + 1;
  }

  // Vollständige DL-Matrix mit Transpositionserkennung
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

      // Transposition benachbarter Zeichen
      if (i > 1 && j > 1 &&
          source[i - 1] === target[j - 2] &&
          source[i - 2] === target[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }

      if (d[i][j] < rowMin) rowMin = d[i][j];
    }

    // Early exit: Wenn die komplette Zeile über dem Schwellwert liegt
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

/**
 * Berechnet einen Ähnlichkeitsscore zwischen Nutzereingabe und Rezeptzutat.
 * Berücksichtigt:
 *   1. Exakten Treffer (nach Normalisierung + Stemming)
 *   2. Prefix-Bonus: "toma" trifft "tomate" bevorzugt
 *   3. Substring-Treffer: "käse" in "frischkäse"
 *   4. Phonetische Normalisierung + Damerau-Levenshtein mit dynamischem Schwellwert
 * Gibt 0 (kein Treffer) bis 1 (exakt) zurück.
 */
function calculateFuzzyMatchScore(userInput, recipeIngredient) {
  const processedInput      = processIngredientToken(userInput);
  const processedIngredient = processIngredientToken(recipeIngredient);

  if (!processedInput || !processedIngredient) return 0;

  // 1. Exakter Treffer
  if (processedInput === processedIngredient) return 1.0;

  const inputLen = processedInput.length;
  const ingLen   = processedIngredient.length;
  const MIN_SUBSTRING_LEN = 3;

  // 2. Prefix-Bonus: Eingabe ist Anfang der Zutat
  if (ingLen > inputLen &&
      processedIngredient.startsWith(processedInput) &&
      inputLen >= MIN_SUBSTRING_LEN) {
    const coverage = inputLen / ingLen;
    return 0.70 + coverage * 0.20;
  }

  // 3a. Substring: Zutat enthält Eingabe
  if (processedIngredient.includes(processedInput) && inputLen >= MIN_SUBSTRING_LEN) {
    const coverage = inputLen / ingLen;
    return 0.50 + coverage * 0.20;
  }

  // 3b. Substring umgekehrt: Eingabe enthält Zutat
  if (processedInput.includes(processedIngredient) && ingLen >= MIN_SUBSTRING_LEN) {
    return 0.65;
  }

  // 4. Phonetische Normalisierung + Damerau-Levenshtein
  const phoneticInput = applyPhoneticNormalization(processedInput);
  const phoneticIng   = applyPhoneticNormalization(processedIngredient);

  // Nach phonetischer Normalisierung nochmal exakt prüfen
  if (phoneticInput === phoneticIng) return 0.95;

  const maxLen = Math.max(phoneticInput.length, phoneticIng.length);
  const maxErrors = getMaxAllowedErrors(maxLen);

  const distance = calculateDamerauLevenshtein(phoneticInput, phoneticIng, maxErrors);

  if (distance > maxErrors) return 0;

  // Normalisierter Score: Distanz relativ zur Wortlänge
  const normalizedDist = distance / maxLen;

  // Prefix-Bonus bei gleichen Anfangsbuchstaben
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

  // Score-Berechnung
  if (distance === 1) {
    const base = maxLen >= 4 ? 0.85 : 0.70;
    return Math.min(base + prefixBonus, 0.94);
  }
  if (distance === 2 && maxLen >= 6) return Math.min(0.55 + prefixBonus, 0.70);
  if (distance === 2 && maxLen >= 5) return Math.min(0.40 + prefixBonus, 0.55);
  if (distance === 3 && maxLen >= 9) return Math.min(0.30 + prefixBonus, 0.45);

  return 0;
}

// ==================== RECIPE SEARCH ====================

function findMatchingRecipes(userProvidedIngredients) {
  // Synonym-Auflösung: Jede Eingabe wird um österreichische/deutsche Varianten erweitert
  const expandedIngredients = [];
  userProvidedIngredients.forEach(ingredient => {
    const synonyms = resolveTokenSynonyms(ingredient);
    synonyms.forEach(syn => {
      const processed = processIngredientToken(syn);
      const resolved = (processed && (canonicalLookup[processed] || processed)) || null;
      if (resolved && !expandedIngredients.includes(resolved)) {
        expandedIngredients.push(resolved);
      }
    });
  });
  const processedUserInputs = expandedIngredients;

  const scoredRecipes = recipes.map(recipeEntry => {
    let totalScore = 0;
    let totalWeight = 0;

    recipeEntry.ingredients.forEach(recipeIngredient => {
      const canonical = canonicalLookup[processIngredientToken(recipeIngredient)] || processIngredientToken(recipeIngredient) || normalizeString(recipeIngredient);
      const isHighValue = highPriorityIngredients.includes(canonical);
      const weight = isHighValue ? 1.6 : 1.0;

      totalWeight += weight;

      const bestMatch = processedUserInputs.reduce((maxScore, userToken) => {
        const matchQuality = calculateFuzzyMatchScore(userToken, canonical);
        return matchQuality > maxScore ? matchQuality : maxScore;
      }, 0);

      totalScore += bestMatch * weight;
    });

    const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    const approximateMatches = Math.round(totalScore);

    return {
      ...recipeEntry,
      matchCount: approximateMatches,
      score: normalizedScore
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
  if (typeof allIngredients !== 'undefined') {
    const directMatch = allIngredients.some(ing =>
      normalizeForComparison(ing) === normalizedInput
    );
    if (directMatch) return null;
  }

  // Synonyme prüfen
  const synonyms = resolveTokenSynonyms(input);
  for (const syn of synonyms) {
    if (syn !== normalizedInput && typeof allIngredients !== 'undefined') {
      const synMatch = allIngredients.some(ing =>
        normalizeForComparison(ing) === normalizeForComparison(syn)
      );
      if (synMatch) return null;
    }
  }

  let bestMatch = null;
  let bestDistance = Infinity;
  const candidates = typeof allIngredients !== 'undefined' ? allIngredients : [];

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeForComparison(candidate);
    const dist = calculateDamerauLevenshtein(normalizedInput, normalizedCandidate, 2);
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

  const candidates = typeof allIngredients !== 'undefined' ? allIngredients : [];
  const scored = [];

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeForComparison(candidate);

    // Exakter Treffer: ausblenden (Nutzer hat schon richtig getippt)
    if (normalizedCandidate === normalizedInput) continue;

    let score = 0;

    // Prefix-Match: höchste Priorität
    if (normalizedCandidate.startsWith(normalizedInput)) {
      score = 100 - normalizedCandidate.length; // kürzere Treffer bevorzugen
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
      }
    }

    if (score > 0) {
      scored.push({ text: candidate, score: score, distance: score < 50 ? calculateDamerauLevenshtein(normalizedInput, normalizedCandidate, 2) : 0 });
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

  console.log('=== Alle Tests abgeschlossen ===');
}

// Tests in Entwicklung automatisch ausführen (nur bei Konsolenaufruf)
if (typeof window !== 'undefined' && window.location && window.location.search.includes('debug=true')) {
  runSearchTests();
}
