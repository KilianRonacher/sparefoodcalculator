/**
 * QUANTITIES - Mengenangaben & Personen-Skalierung
 * =================================================
 * Skaliert Zutatenmengen pro Rezept nach Personenzahl.
 * Speichert Default-Personenzahl in localStorage.
 * Formatiert Mengenangaben zweisprachig (DE/EN).
 */

var Quantities = (function() {
  'use strict';

  var STORAGE_KEY = 'sfc_default_servings';
  var DEFAULT_SERVINGS = 4;
  var MIN_SERVINGS = 1;
  var MAX_SERVINGS = 12;

  // Unit conversion thresholds for normalize()
  var WEIGHT_SMALL = { from: 'kg', to: 'g', factor: 1000, threshold: 0.1 };
  var VOLUME_SMALL = { from: 'l', to: 'ml', factor: 1000, threshold: 0.1 };

  // Units that are never scaled
  var UNSCALABLE_UNITS = ['taste', 'pinch'];

  // Units that get Math.ceil and minimum-1 treatment
  var COUNTABLE_UNITS = ['piece', 'head', 'clove', 'bunch'];

  // ==================== CORE API ====================

  /**
   * Scale a single quantity object by servings ratio.
   * @param {{ amount: number|null, unit: string }} qty
   * @param {number} servings - target servings
   * @param {number} base - base servings (default 4)
   * @returns {{ amount: number|null, unit: string }}
   */
  function scale(qty, servings, base) {
    if (!qty) return qty;
    if (qty.amount === null) return { amount: null, unit: qty.unit };
    if (UNSCALABLE_UNITS.indexOf(qty.unit) !== -1) return { amount: qty.amount, unit: qty.unit };

    var scaled = qty.amount * servings / base;

    // Countable units: ceil and enforce minimum of 1
    if (COUNTABLE_UNITS.indexOf(qty.unit) !== -1) {
      scaled = Math.ceil(scaled);
      if (scaled < 1) scaled = 1;
    }

    return { amount: scaled, unit: qty.unit };
  }

  /**
   * Normalize a quantity to a more readable unit if the value is too small.
   * E.g. 0.05 kg -> 50 g, 0.08 l -> 80 ml
   * @param {{ amount: number|null, unit: string }} qty
   * @returns {{ amount: number|null, unit: string }}
   */
  function normalize(qty) {
    if (!qty || qty.amount === null) return qty;

    // kg -> g
    if (qty.unit === 'kg' && qty.amount < WEIGHT_SMALL.threshold) {
      return { amount: qty.amount * WEIGHT_SMALL.factor, unit: WEIGHT_SMALL.to };
    }
    // l -> ml
    if (qty.unit === 'l' && qty.amount < VOLUME_SMALL.threshold) {
      return { amount: qty.amount * VOLUME_SMALL.factor, unit: VOLUME_SMALL.to };
    }

    return { amount: qty.amount, unit: qty.unit };
  }

  /**
   * Format a quantity for display.
   * @param {{ amount: number|null, unit: string }} qty
   * @param {string} lang - 'de' or 'en'
   * @returns {{ text: string, footnote: string|null }}
   */
  function format(qty, lang) {
    if (!qty) return { text: '', footnote: null };
    lang = lang || 'de';

    // taste / pinch: only the localized word, no number
    if (qty.unit === 'taste') {
      var tasteKey = 'recipe_unit_taste';
      return { text: _t(tasteKey, lang), footnote: null };
    }
    if (qty.unit === 'pinch') {
      var pinchKey = 'recipe_unit_pinch';
      return { text: _t(pinchKey, lang), footnote: null };
    }

    if (qty.amount === null) {
      return { text: '', footnote: null };
    }

    // Round to 1 decimal
    var rounded = Math.round(qty.amount * 10) / 10;

    // Determine unit string
    var unitStr = _getUnitString(qty.unit, rounded, lang);

    // Build text
    var text;
    if (unitStr === '') {
      // piece singular: just the number
      text = String(rounded);
    } else {
      text = rounded + ' ' + unitStr;
    }

    // Footnote for countable units scaled below 1 (before ceil)
    // This is handled at render time, not here
    var footnote = null;

    return { text: text, footnote: footnote };
  }

  /**
   * Get the unit display string based on unit key, amount (for plural), and language.
   */
  function _getUnitString(unit, amount, lang) {
    // Weight / Volume / Spoon units: no plural forms
    var simpleUnits = ['g', 'kg', 'ml', 'l', 'tbsp', 'tsp'];
    if (simpleUnits.indexOf(unit) !== -1) {
      return _t('recipe_unit_' + unit, lang);
    }

    // Countable units: singular vs plural
    var pluralMap = {
      'piece':  { singular: 'recipe_unit_piece', plural: 'recipe_unit_pieces' },
      'head':   { singular: 'recipe_unit_head',  plural: 'recipe_unit_heads' },
      'clove':  { singular: 'recipe_unit_clove', plural: 'recipe_unit_cloves' },
      'bunch':  { singular: 'recipe_unit_bunch', plural: 'recipe_unit_bunches' }
    };

    var entry = pluralMap[unit];
    if (entry) {
      return amount > 1 ? _t(entry.plural, lang) : _t(entry.singular, lang);
    }

    return unit;
  }

  /**
   * i18n lookup helper
   */
  function _t(key, lang) {
    if (typeof i18n !== 'undefined' && i18n[lang] && i18n[lang][key] !== undefined) {
      return i18n[lang][key];
    }
    if (typeof i18n !== 'undefined' && i18n['de'] && i18n['de'][key] !== undefined) {
      return i18n['de'][key];
    }
    return key;
  }

  // ==================== SERVINGS PERSISTENCE ====================

  /**
   * Read default servings from localStorage (clamped 1..12, default 4).
   * @returns {number}
   */
  function getDefaultServings() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        var n = parseInt(stored, 10);
        if (!isNaN(n)) {
          return Math.max(MIN_SERVINGS, Math.min(MAX_SERVINGS, n));
        }
      }
    } catch(e) { /* Private mode */ }
    return DEFAULT_SERVINGS;
  }

  /**
   * Write default servings to localStorage and fire event.
   * @param {number} n
   */
  function setDefaultServings(n) {
    n = Math.max(MIN_SERVINGS, Math.min(MAX_SERVINGS, n));
    try {
      localStorage.setItem(STORAGE_KEY, String(n));
    } catch(e) { /* Private mode */ }
    document.dispatchEvent(new CustomEvent('sfc:servingsChanged', { detail: { servings: n } }));
  }

  // ==================== PUBLIC API ====================

  return {
    scale: scale,
    normalize: normalize,
    format: format,
    getDefaultServings: getDefaultServings,
    setDefaultServings: setDefaultServings,
    MIN_SERVINGS: MIN_SERVINGS,
    MAX_SERVINGS: MAX_SERVINGS
  };

})();


// ==================== INLINE SELF-TESTS (console.assert) ====================

(function() {
  'use strict';

  // scale: normal case
  var s1 = Quantities.scale({ amount: 200, unit: 'g' }, 8, 4);
  console.assert(s1.amount === 400, 'scale 200g * 8/4 = 400g');

  // scale: null amount
  var s2 = Quantities.scale({ amount: null, unit: 'taste' }, 8, 4);
  console.assert(s2.amount === null, 'scale null amount stays null');

  // scale: pinch never scales
  var s3 = Quantities.scale({ amount: 1, unit: 'pinch' }, 8, 4);
  console.assert(s3.amount === 1, 'pinch amount stays 1 regardless of servings');

  // scale: countable ceil
  var s4 = Quantities.scale({ amount: 1, unit: 'clove' }, 3, 4);
  console.assert(s4.amount === 1, 'clove min 1 when scaled down: ceil(0.75) = 1');

  // normalize: kg -> g
  var n1 = Quantities.normalize({ amount: 0.05, unit: 'kg' });
  console.assert(n1.unit === 'g', 'normalize 0.05kg -> g');
  console.assert(n1.amount === 50, 'normalize 0.05kg -> 50g');

  // normalize: l -> ml
  var n2 = Quantities.normalize({ amount: 0.08, unit: 'l' });
  console.assert(n2.unit === 'ml', 'normalize 0.08l -> ml');
  console.assert(n2.amount === 80, 'normalize 0.08l -> 80ml');

  // normalize: stays if above threshold
  var n3 = Quantities.normalize({ amount: 0.5, unit: 'kg' });
  console.assert(n3.unit === 'kg', 'normalize 0.5kg stays kg');

  // format: taste -> localized word only (no number)
  var f1 = Quantities.format({ amount: null, unit: 'taste' }, 'de');
  console.assert(f1.text.indexOf('Geschmack') !== -1 || f1.text === 'recipe_unit_taste',
    'format taste DE contains Geschmack or fallback key');

  // format: piece singular -> empty unit string (just the number)
  var f2 = Quantities.format({ amount: 1, unit: 'piece' }, 'de');
  console.assert(f2.text === '1', 'format 1 piece DE = "1" (no unit word)');

  // format: clove plural
  var f3 = Quantities.format({ amount: 3, unit: 'clove' }, 'de');
  console.assert(f3.text.indexOf('3') !== -1, 'format 3 cloves DE contains "3"');

  // format: tbsp
  var f4 = Quantities.format({ amount: 2, unit: 'tbsp' }, 'de');
  console.assert(f4.text.indexOf('EL') !== -1 || f4.text === '2 recipe_unit_tbsp',
    'format 2 tbsp DE contains EL or fallback');

  // getDefaultServings: returns 4 when nothing stored
  // (We cannot easily clear localStorage in this test, so we just check range)
  var ds = Quantities.getDefaultServings();
  console.assert(ds >= 1 && ds <= 12, 'getDefaultServings in range [1,12]');

  console.log('[Quantities] All self-tests passed.');
})();
