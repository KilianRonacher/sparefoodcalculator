/**
 * Side-Stats Boxes — Geld + Oeko
 * ================================
 * Aktualisiert die zwei Boxen auf den Generator-Seiten (search.html und
 * ingredients-generator.html) mit den Werten aus SustainabilityCalc.
 *
 * Erwartete DOM-Elemente (alle optional — fehlende werden ignoriert):
 *   #sfc-money-value        → "0,00 €"
 *   #sfc-eco-co2            → "0,0 kg CO₂"
 *   #sfc-eco-water          → "0 L 💧"
 *   #sfc-eco-context        → "≈ 0 km Autofahrt"
 *   #sfc-recipes-cooked-text → "0 Rezepte gekocht"
 *
 * Reagiert auf:
 *   - sfc:balanceChanged (custom event aus sustainability.js bei addToBalance/resetBalance)
 *   - storage event (Aenderung aus anderem Tab)
 *   - languageChanged (Zahlenformat + Wort-Singular/Plural)
 */
(function() {
  'use strict';

  function getCurrentLang() {
    try {
      if (typeof getLang === 'function') return getLang();
    } catch(_) {}
    return 'de';
  }

  function fmtNum(n, decimals, lang) {
    var locale = lang === 'en' ? 'en-US' : 'de-DE';
    try {
      return Number(n).toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    } catch(_) {
      return Number(n).toFixed(decimals);
    }
  }

  function tt(key, fallback) {
    var lang = getCurrentLang();
    try {
      if (typeof i18n === 'object' && i18n[lang] && i18n[lang][key]) return i18n[lang][key];
      if (typeof i18n === 'object' && i18n['de'] && i18n['de'][key]) return i18n['de'][key];
    } catch(_) {}
    return fallback;
  }

  function update() {
    if (typeof SustainabilityCalc === 'undefined' ||
        typeof SustainabilityCalc.getUserBalance !== 'function') return;

    var b = SustainabilityCalc.getUserBalance();
    var lang = getCurrentLang();

    var moneyEl   = document.getElementById('sfc-money-value');
    var co2El     = document.getElementById('sfc-eco-co2');
    var waterEl   = document.getElementById('sfc-eco-water');
    var contextEl = document.getElementById('sfc-eco-context');
    var cookedEl  = document.getElementById('sfc-recipes-cooked-text');

    if (moneyEl) moneyEl.textContent = fmtNum(b.money_eur || 0, 2, lang) + ' €';
    if (co2El)   co2El.textContent   = fmtNum(b.co2_kg || 0, 1, lang) + ' kg CO₂';
    if (waterEl) waterEl.textContent = Math.round(b.water_l || 0) + ' L 💧';

    if (contextEl) {
      var km = Math.round((b.co2_kg || 0) / SustainabilityCalc.CO2_PER_KM_AUTO);
      contextEl.textContent = '≈ ' + km + ' ' +
        tt('sfc_box_eco_context_unit', 'km Autofahrt');
    }

    if (cookedEl) {
      var n = b.recipes_cooked || 0;
      var word = (n === 1)
        ? tt('sfc_box_recipes_cooked_singular', 'Rezept gekocht')
        : tt('sfc_box_recipes_cooked_plural', 'Rezepte gekocht');
      cookedEl.textContent = n + ' ' + word;
    }
  }

  function init() {
    // Nur initialisieren wenn auf der Seite tatsaechlich Boxen existieren.
    if (!document.querySelector('.sfc-stage') &&
        !document.getElementById('sfc-money-value') &&
        !document.getElementById('sfc-eco-co2')) return;

    update();
    window.addEventListener('languageChanged', update);
    window.addEventListener('sfc:balanceChanged', update);
    window.addEventListener('storage', function(e) {
      if (!e || !e.key || e.key === 'sfc_balance') update();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
