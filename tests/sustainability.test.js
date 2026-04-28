/**
 * SUSTAINABILITY TESTS
 * Node.js-Tests fuer sustainability v2.
 * Ausfuehren: node tests/sustainability.test.js
 */

// Module laden
var ingredients = require('../ingredients.js');
var resolveSynonyms = ingredients.resolveSynonyms;

global.resolveSynonyms = resolveSynonyms;
global.findCategoryForIngredient = ingredients.findCategoryForIngredient;

var sustData = require('../data/sustainability.js');
global.sustainabilityData = sustData.sustainabilityData;
global.sustainabilitySources = sustData.sustainabilitySources;
global.isInSeason = sustData.isInSeason;
global.getSeasonalityScore = sustData.getSeasonalityScore;
global.getBestMonth = sustData.getBestMonth;
global.getSourceForValue = sustData.getSourceForValue;
global.getEstimatedGrams = sustData.getEstimatedGrams;
global.monthNames = sustData.monthNames;

global.getLang = function() { return 'de'; };

var storage = {};
global.localStorage = {
  getItem: function(k) { return storage[k] || null; },
  setItem: function(k, v) { storage[k] = v; },
  removeItem: function(k) { delete storage[k]; }
};

var SustainabilityCalc = require('../js/sustainability.js');

var passed = 0;
var failed = 0;
var total = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    passed++;
    console.log('  PASS: ' + msg);
  } else {
    failed++;
    console.log('  FAIL: ' + msg);
  }
}

console.log('=== Sustainability v2 Tests ===');
console.log('');

console.log('--- Bestehende Tests ---');
var r1 = SustainabilityCalc.calculateRecipeImpact(['tomate', 'rindfleisch']);
assert(r1.co2 > 0, 'T1: CO2 Tomate+Rind > 0');
assert(r1.money > 0, 'T2: Geldwert > 0');
assert(r1.details.length === 2, 'T3: 2 Details');

var r2 = SustainabilityCalc.calculateRecipeImpact([]);
assert(r2.co2 === 0, 'T4: Leere Liste CO2=0');

var r3 = SustainabilityCalc.calculateRecipeImpact(null);
assert(r3.co2 === 0, 'T5: null CO2=0');

var b = SustainabilityCalc.getUserBalance();
assert(b.co2_kg >= 0, 'T6: Balance CO2>=0');
assert(b.recipes_cooked >= 0, 'T7: Balance Rezepte>=0');

var c = SustainabilityCalc.getCO2Comparison(1.0);
assert(typeof c === 'string' && c.length > 0, 'T8: CO2-Vergleich String');

storage = {};
var u = SustainabilityCalc.addToBalance(1.5, 5.0, 200);
assert(u.co2_kg === 1.5, 'T9: addToBalance CO2');
assert(u.recipes_cooked === 1, 'T10: addToBalance count');

console.log('');
console.log('--- Synonym-Aufloesung ---');
var s1 = SustainabilityCalc.resolveIngredientData('erdaepfel');
// erdaepfel vs erdäpfel - testen wir mit Umlaut
var s1b = SustainabilityCalc.resolveIngredientData('äpfel'.replace('äpfel', 'erdäpfel'));
assert(s1b !== null && s1b.resolvedName === 'kartoffeln', 'T11: erdaepfel->kartoffeln');

var s2 = SustainabilityCalc.resolveIngredientData('paradeiser');
assert(s2 !== null && s2.resolvedName === 'tomaten', 'T12: paradeiser->tomaten');

var s3 = SustainabilityCalc.resolveIngredientData('obers');
assert(s3 !== null && s3.resolvedName === 'sahne', 'T13: obers->sahne');

var sr = SustainabilityCalc.calculateRecipeImpact(['paradeiser']);
assert(sr.co2 > 0, 'T14: Synonym in Impact CO2>0');
assert(sr.noDataIngredients.length === 0, 'T14b: Keine fehlenden Daten');

console.log('');
console.log('--- isInSeason ---');
assert(sustData.isInSeason('tomate', 8) === true, 'T15: Tomate Saison Aug');
assert(sustData.isInSeason('tomate', 1) === false, 'T16: Tomate keine Saison Jan');
assert(sustData.isInSeason('rosenkohl', 12) === true, 'T17a: Rosenkohl Saison Dez');
assert(sustData.isInSeason('rosenkohl', 6) === false, 'T17b: Rosenkohl keine Saison Jun');
assert(sustData.isInSeason('reis', 1) === true, 'T18a: Reis ganzjaehrig Jan');
assert(sustData.isInSeason('reis', 7) === true, 'T18b: Reis ganzjaehrig Jul');
assert(sustData.isInSeason('fantasiezutat999', 5) === true, 'T19: Unbekannt=true');

console.log('');
console.log('--- Wasser-Aggregation ---');
var wr = SustainabilityCalc.calculateRecipeImpact(['rindfleisch', 'kartoffeln']);
assert(wr.water > 0, 'T21: Wasser>0 Rind+Kartoffel');
var rd = wr.details.find(function(d) { return d.name === 'rindfleisch'; });
assert(rd && rd.water > 0, 'T22: Rind-Detail Wasser>0');
var sh = SustainabilityCalc.waterToShowers(600);
assert(sh === 10, 'T23: 600L = 10 Duschen');
var wc = SustainabilityCalc.getWaterComparison(600);
assert(typeof wc === 'string' && wc.indexOf('10') !== -1, 'T24: Wassertext 10');

console.log('');
console.log('--- Keine-Daten-Pfad ---');
var nd = SustainabilityCalc.calculateRecipeImpact(['fantasiezutat123']);
assert(nd.noDataIngredients.length === 1, 'T25a: noData 1');
assert(nd.details[0].noData === true, 'T25b: noData=true');
assert(nd.details[0].co2 === null, 'T25c: co2=null');
assert(nd.details[0].water === null, 'T25d: water=null');

var mx = SustainabilityCalc.calculateRecipeImpact(['tomate', 'fantasiezutat123']);
assert(mx.co2 > 0, 'T26a: Mix CO2>0');
assert(mx.noDataIngredients.length === 1, 'T26b: Mix 1 noData');

console.log('');
console.log('--- CO2-Vergleichsanker ---');
var km = SustainabilityCalc.co2ToKmAuto(1.2);
assert(km === 10, 'T27: 1.2kg = 10km');
assert(SustainabilityCalc.CO2_PER_KM_AUTO === 0.12, 'T28: Konstante 0.12');

console.log('');
console.log('--- Saisonalitaets-Score ---');
var ss1 = sustData.getSeasonalityScore(['tomate', 'paprika', 'zucchini'], 8);
assert(ss1.status === 'green', 'T29: Aug green');
var ss2 = sustData.getSeasonalityScore(['tomate', 'paprika', 'zucchini'], 1);
assert(ss2.status === 'red', 'T30: Jan red');
var ss3 = sustData.getSeasonalityScore(['tomate', 'reis'], 8);
assert(ss3.status === 'green', 'T31: Tomate+Reis Aug green');

console.log('');
console.log('--- Quellen ---');
var src1 = sustData.getSourceForValue('tomate', 'co2');
assert(src1 !== null && src1.authors.indexOf('Poore') !== -1, 'T32: Tomate CO2 Poore');
var src2 = sustData.getSourceForValue('tomate', 'water');
assert(src2 !== null && src2.authors.indexOf('Mekonnen') !== -1, 'T33: Tomate Water Mekonnen');
var src3 = sustData.getSourceForValue('fantasie', 'co2');
assert(src3 === null, 'T34: Unbekannt null');

console.log('');
console.log('--- Balance Wasser ---');
storage = {};
var b1 = SustainabilityCalc.addToBalance(1.0, 3.0, 500);
assert(b1.water_l === 500, 'T35: Balance water=500');
var b2 = SustainabilityCalc.getUserBalance();
assert(b2.water_l === 500, 'T36: getBalance water=500');

console.log('');
console.log('=== Ergebnis: ' + passed + '/' + total + ' bestanden ===');
if (failed > 0) {
  console.log('FEHLER: ' + failed + ' fehlgeschlagen');
  process.exitCode = 1;
} else {
  console.log('Alle Tests bestanden.');
}
