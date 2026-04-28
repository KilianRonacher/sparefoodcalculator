/**
 * SUSTAINABILITY - Berechnungslogik v2
 * =====================================
 * Berechnet CO2-Einsparung, Wasser-Fussabdruck und Geldwert pro Rezept.
 * Verwaltet den persoenlichen Gesamt-Counter via localStorage.
 * Nutzt resolveSynonyms() aus ingredients.js fuer AT/DE-Synonyme.
 */

var SustainabilityCalc = (function() {
  'use strict';

  var STORAGE_KEY = 'sfc_balance';
  var MAX_RECIPES = 10000;

  // CO2-Vergleichskonstanten
  var CO2_PER_KM_AUTO = 0.12; // kg CO2 pro km PKW (UBA 2024)
  var WATER_PER_SHOWER = 60;   // Liter pro Dusche (Durchschnitt)

  // ==================== SYNONYM-AUFLOESUNG ====================

  /**
   * Loest einen Zutatennamen ueber Synonyme auf und gibt die
   * sustainability-Daten zurueck. Gibt null zurueck wenn weder
   * unter dem Originalnamen noch unter Synonymen Daten existieren.
   * @param {string} name - Zutatname (lowercase, trimmed)
   * @returns {{ data: object, resolvedName: string } | null}
   */
  function resolveIngredientData(name) {
    // Direkt-Lookup
    if (sustainabilityData[name]) {
      return { data: sustainabilityData[name], resolvedName: name };
    }

    // Synonym-Aufloesung wenn verfuegbar
    if (typeof resolveSynonyms === 'function') {
      var synonyms = resolveSynonyms(name);
      for (var i = 0; i < synonyms.length; i++) {
        if (sustainabilityData[synonyms[i]]) {
          return { data: sustainabilityData[synonyms[i]], resolvedName: synonyms[i] };
        }
      }
    }

    return null;
  }

  // ==================== REZEPT-IMPACT ====================

  /**
   * Berechnet CO2, Wasser und Geldwert fuer ein Rezept.
   * @param {string[]} ingredients
   * @returns {{ co2: number, water: number, money: number, details: Array, noDataIngredients: string[] }}
   */
  function calculateRecipeImpact(ingredients) {
    if (!ingredients || !Array.isArray(ingredients)) {
      return { co2: 0, water: 0, money: 0, details: [], noDataIngredients: [] };
    }

    var totalCO2 = 0;
    var totalWater = 0;
    var totalMoney = 0;
    var details = [];
    var noDataIngredients = [];

    for (var i = 0; i < ingredients.length; i++) {
      var name = ingredients[i].toLowerCase().trim();
      var grams = getEstimatedGrams(name);
      var resolved = resolveIngredientData(name);

      if (resolved) {
        var kg = grams / 1000;
        var co2 = resolved.data.co2 * kg;
        var water = (resolved.data.water || 0) * kg;
        var money = resolved.data.price * kg;

        totalCO2 += co2;
        totalWater += water;
        totalMoney += money;

        details.push({
          name: name,
          resolvedName: resolved.resolvedName,
          grams: grams,
          co2: co2,
          water: water,
          money: money,
          source_co2: resolved.data.source_co2,
          source_water: resolved.data.source_water
        });
      } else {
        // KEIN Fallback mit 0 - transparent kennzeichnen
        noDataIngredients.push(name);
        details.push({
          name: name,
          resolvedName: null,
          grams: grams,
          co2: null,
          water: null,
          money: null,
          noData: true
        });
      }
    }

    return {
      co2: Math.round(totalCO2 * 100) / 100,
      water: Math.round(totalWater * 100) / 100,
      money: Math.round(totalMoney * 100) / 100,
      details: details,
      noDataIngredients: noDataIngredients
    };
  }

  // ==================== VERGLEICHSWERTE ====================

  /**
   * CO2 in km Autofahrt umrechnen (UBA 2024: 0.12 kg CO2/km)
   * @param {number} co2Kg
   * @returns {number} km
   */
  function co2ToKmAuto(co2Kg) {
    return Math.round(co2Kg / CO2_PER_KM_AUTO * 10) / 10;
  }

  /**
   * Wasser in Duschen umrechnen (1 Dusche = 60 L)
   * @param {number} waterLiters
   * @returns {number} Anzahl Duschen
   */
  function waterToShowers(waterLiters) {
    return Math.round(waterLiters / WATER_PER_SHOWER * 10) / 10;
  }

  /**
   * Uebersetzt kg CO2 in greifbare Vergleiche
   * @param {number} co2Kg
   * @returns {string}
   */
  function getCO2Comparison(co2Kg) {
    var lang = 'de';
    try { lang = getLang(); } catch(e) { /* fallback */ }

    var km = co2ToKmAuto(co2Kg);

    if (co2Kg < 0.5) {
      var minutes = Math.round(co2Kg * 180);
      return lang === 'de'
        ? minutes + ' Min. Fernsehen'
        : minutes + ' min. watching TV';
    }
    if (co2Kg < 5) {
      return lang === 'de'
        ? km + ' km Autofahrt'
        : km + ' km car ride';
    }
    if (co2Kg < 50) {
      var flights = Math.round(co2Kg / 10 * 10) / 10;
      return lang === 'de'
        ? flights + 'x Flug Wien–Salzburg'
        : flights + 'x flight Vienna–Salzburg';
    }
    var longFlights = Math.round(co2Kg / 250 * 10) / 10;
    return lang === 'de'
      ? longFlights + 'x Flug Wien–London'
      : longFlights + 'x flight Vienna–London';
  }

  /**
   * Wasser-Vergleichstext
   * @param {number} waterLiters
   * @returns {string}
   */
  function getWaterComparison(waterLiters) {
    var lang = 'de';
    try { lang = getLang(); } catch(e) {}

    var showers = waterToShowers(waterLiters);
    return lang === 'de'
      ? showers + ' Duschen'
      : showers + ' showers';
  }

  // ==================== LOCALSTORAGE PERSISTENZ ====================

  function getUserBalance() {
    var defaultBalance = {
      co2_kg: 0,
      water_l: 0,
      money_eur: 0,
      recipes_cooked: 0,
      last_updated: ''
    };

    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultBalance;

      var parsed = JSON.parse(raw);

      var co2 = parseFloat(parsed.co2_kg);
      var water = parseFloat(parsed.water_l) || 0;
      var money = parseFloat(parsed.money_eur);
      var count = parseInt(parsed.recipes_cooked, 10);

      if (isNaN(co2) || isNaN(money) || isNaN(count)) {
        return defaultBalance;
      }

      if (count > MAX_RECIPES) count = MAX_RECIPES;
      if (co2 > 100000) co2 = 100000;
      if (water > 10000000) water = 10000000;
      if (money > 500000) money = 500000;

      return {
        co2_kg: Math.round(co2 * 100) / 100,
        water_l: Math.round(water * 100) / 100,
        money_eur: Math.round(money * 100) / 100,
        recipes_cooked: count,
        last_updated: parsed.last_updated || ''
      };
    } catch(e) {
      return defaultBalance;
    }
  }

  function addToBalance(co2, money, water) {
    var current = getUserBalance();
    if (current.recipes_cooked >= MAX_RECIPES) return current;

    var updated = {
      co2_kg: Math.round((current.co2_kg + co2) * 100) / 100,
      water_l: Math.round((current.water_l + (water || 0)) * 100) / 100,
      money_eur: Math.round((current.money_eur + money) * 100) / 100,
      recipes_cooked: current.recipes_cooked + 1,
      last_updated: new Date().toISOString().split('T')[0]
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch(e) {}

    return updated;
  }

  function resetBalance() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch(e) {}
  }

  // ==================== PUBLIC API ====================

  return {
    resolveIngredientData: resolveIngredientData,
    calculateRecipeImpact: calculateRecipeImpact,
    getCO2Comparison: getCO2Comparison,
    getWaterComparison: getWaterComparison,
    co2ToKmAuto: co2ToKmAuto,
    waterToShowers: waterToShowers,
    getUserBalance: getUserBalance,
    addToBalance: addToBalance,
    resetBalance: resetBalance,
    CO2_PER_KM_AUTO: CO2_PER_KM_AUTO,
    WATER_PER_SHOWER: WATER_PER_SHOWER
  };

})();


// ==================== TESTS (console.assert) ====================

(function runSustainabilityTests() {
  if (typeof sustainabilityData === 'undefined') return;

  // Test 1: CO2 + Wasser fuer bekannte Zutaten
  var result1 = SustainabilityCalc.calculateRecipeImpact(['tomate', 'rindfleisch']);
  console.assert(result1.co2 > 0, 'CO2 fuer Tomate+Rindfleisch muss > 0 sein');
  console.assert(result1.water > 0, 'Wasser fuer Tomate+Rindfleisch muss > 0 sein');
  console.assert(result1.money > 0, 'Geldwert fuer Tomate+Rindfleisch muss > 0 sein');
  console.assert(result1.details.length === 2, 'Details muss 2 Eintraege haben');

  // Test 2: Leere Liste
  var result2 = SustainabilityCalc.calculateRecipeImpact([]);
  console.assert(result2.co2 === 0, 'Leere Zutatenliste: CO2 muss 0 sein');
  console.assert(result2.water === 0, 'Leere Zutatenliste: Wasser muss 0 sein');

  // Test 3: null-Input
  var result3 = SustainabilityCalc.calculateRecipeImpact(null);
  console.assert(result3.co2 === 0, 'null-Input: CO2 muss 0 sein');

  // Test 4: Balance
  var balance = SustainabilityCalc.getUserBalance();
  console.assert(balance.co2_kg >= 0, 'Balance CO2 muss >= 0 sein');
  console.assert(balance.recipes_cooked >= 0, 'Balance Rezepte muss >= 0 sein');

  // Test 5: CO2-Vergleich
  var comp = SustainabilityCalc.getCO2Comparison(1.0);
  console.assert(typeof comp === 'string' && comp.length > 0, 'CO2-Vergleich muss String sein');

  // Test 6: Wasser-Vergleich
  var waterComp = SustainabilityCalc.getWaterComparison(600);
  console.assert(typeof waterComp === 'string' && waterComp.length > 0, 'Wasser-Vergleich muss String sein');

  // Test 7: CO2 zu km Autofahrt
  var km = SustainabilityCalc.co2ToKmAuto(1.2);
  console.assert(km === 10, '1.2 kg CO2 = 10 km Autofahrt');

  // Test 8: Wasser zu Duschen
  var showers = SustainabilityCalc.waterToShowers(600);
  console.assert(showers === 10, '600 L = 10 Duschen');

  // Test 9: Unbekannte Zutat wird als noData markiert
  var result4 = SustainabilityCalc.calculateRecipeImpact(['fantasiezutat123']);
  console.assert(result4.noDataIngredients.length === 1, 'Unbekannte Zutat in noDataIngredients');
  console.assert(result4.details[0].noData === true, 'Detail muss noData=true haben');

  // Test 10: Synonym-Aufloesung (wenn resolveSynonyms verfuegbar)
  if (typeof resolveSynonyms === 'function') {
    var resolved = SustainabilityCalc.resolveIngredientData('erdäpfel');
    console.assert(resolved !== null, 'erdäpfel muss via Synonym aufgeloest werden');
    console.assert(resolved.resolvedName === 'kartoffeln', 'erdäpfel -> kartoffeln');

    var resolved2 = SustainabilityCalc.resolveIngredientData('paradeiser');
    console.assert(resolved2 !== null, 'paradeiser muss via Synonym aufgeloest werden');
    console.assert(resolved2.resolvedName === 'tomaten', 'paradeiser -> tomaten');

    var resolved3 = SustainabilityCalc.resolveIngredientData('obers');
    console.assert(resolved3 !== null, 'obers muss via Synonym aufgeloest werden');
    console.assert(resolved3.resolvedName === 'sahne', 'obers -> sahne');
  }
})();

// Node.js Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SustainabilityCalc;
}
