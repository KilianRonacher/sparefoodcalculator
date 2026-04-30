/**
 * SUSTAINABILITY UI v2
 * ====================
 * DOM-Rendering fuer:
 *   1) Rezept-Impact-Panel (CO2 + Wasser + Saisonalitaet)
 *   2) Quellen-Info-Icons
 *   3) Persoenlicher Gesamt-Counter
 *   4) "Habe ich gekocht" Button
 */

var SustainabilityUI = (function() {
  'use strict';

  // ==================== HELPER ====================

  function t(key) {
    var lang = 'de';
    try { lang = getLang(); } catch(e) {}
    if (typeof i18n !== 'undefined' && i18n[lang] && i18n[lang][key]) {
      return i18n[lang][key];
    }
    if (typeof i18n !== 'undefined' && i18n['de'] && i18n['de'][key]) {
      return i18n['de'][key];
    }
    return key;
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  /**
   * Erzeugt ein Info-Icon (i) das beim Click/Hover die Quelle zeigt
   */
  function createSourceIcon(ingredientName, field) {
    if (typeof getSourceForValue !== 'function') return null;

    var source = getSourceForValue(ingredientName, field);
    if (!source) return null;

    var icon = document.createElement('span');
    icon.className = 'sustainability-source-icon';
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('aria-label', t('sust_source'));
    setText(icon, 'ⓘ');

    var tooltip = document.createElement('span');
    tooltip.className = 'sustainability-source-tooltip';
    var tooltipText = source.authors + ' (' + source.year + '). ' + source.title;
    if (source.journal) tooltipText += '. ' + source.journal;
    setText(tooltip, tooltipText);

    icon.appendChild(tooltip);

    icon.addEventListener('click', function(e) {
      e.stopPropagation();
      tooltip.classList.toggle('sustainability-source-tooltip-visible');
    });

    return icon;
  }

  // ==================== SAISONALITAETS-ANZEIGE ====================

  /**
   * Erzeugt die Saisonalitaets-Anzeige (gruener/gelber/roter Punkt)
   */
  function createSeasonalityDisplay(ingredients) {
    if (typeof getSeasonalityScore !== 'function') return null;

    var currentMonth = new Date().getMonth() + 1;
    var seasonality = getSeasonalityScore(ingredients, currentMonth);

    var container = document.createElement('div');
    container.className = 'sustainability-season';

    // Punkt
    var dot = document.createElement('span');
    dot.className = 'sustainability-season-dot sustainability-season-' + seasonality.status;
    container.appendChild(dot);

    // Text
    var label = document.createElement('span');
    label.className = 'sustainability-season-label';
    var statusText = t('sust_season_' + seasonality.status);
    setText(label, statusText + ' (' + seasonality.inSeason + '/' + seasonality.total + ')');
    container.appendChild(label);

    // Hinweis bei komplett unsaisonal
    if (seasonality.status === 'red' && typeof getBestMonth === 'function') {
      var bestMonth = getBestMonth(ingredients);
      var lang = 'de';
      try { lang = getLang(); } catch(e) {}
      var monthName = (typeof monthNames !== 'undefined' && monthNames[lang])
        ? monthNames[lang][bestMonth]
        : bestMonth;

      var hint = document.createElement('div');
      hint.className = 'sustainability-season-hint';
      setText(hint, t('sust_better_in') + ' ' + monthName);
      container.appendChild(hint);
    }

    return container;
  }

  // ==================== REZEPT-IMPACT PANEL ====================

  function createRecipeImpactPanel(ingredients, recipeId) {
    var impact = SustainabilityCalc.calculateRecipeImpact(ingredients);
    var comparison = SustainabilityCalc.getCO2Comparison(impact.co2);

    var panel = document.createElement('div');
    panel.className = 'sustainability-panel';

    // Header
    var header = document.createElement('div');
    header.className = 'sustainability-panel-header';
    var headerIcon = document.createElement('span');
    headerIcon.className = 'sustainability-icon';
    setText(headerIcon, '🌱');
    header.appendChild(headerIcon);
    var headerText = document.createElement('span');
    setText(headerText, t('sust_panel_title'));
    header.appendChild(headerText);
    panel.appendChild(header);

    // Saisonalitaets-Anzeige
    var seasonDisplay = createSeasonalityDisplay(ingredients);
    if (seasonDisplay) {
      panel.appendChild(seasonDisplay);
    }

    // CO2 Zeile
    var co2Row = document.createElement('div');
    co2Row.className = 'sustainability-row';

    var co2Label = document.createElement('span');
    co2Label.className = 'sustainability-label';
    setText(co2Label, '💨 ' + impact.co2.toFixed(2) + ' kg CO₂');
    co2Row.appendChild(co2Label);

    // CO2 Source-Icon
    var co2Source = createSourceIcon('tomate', 'co2');
    if (co2Source) co2Row.appendChild(co2Source);

    var co2Comp = document.createElement('span');
    co2Comp.className = 'sustainability-comparison';
    var kmAuto = SustainabilityCalc.co2ToKmAuto(impact.co2);
    setText(co2Comp, '(' + t('sust_equals') + ' ' + kmAuto + ' ' + t('sust_co2_km') + ')');
    co2Row.appendChild(co2Comp);

    panel.appendChild(co2Row);

    // Wasser Zeile
    var waterRow = document.createElement('div');
    waterRow.className = 'sustainability-row';

    var waterLabel = document.createElement('span');
    waterLabel.className = 'sustainability-label';
    setText(waterLabel, '💧 ' + impact.water.toFixed(0) + ' L ' + t('sust_water'));
    waterRow.appendChild(waterLabel);

    // Water Source-Icon
    var waterSource = createSourceIcon('tomate', 'water');
    if (waterSource) waterRow.appendChild(waterSource);

    var waterComp = document.createElement('span');
    waterComp.className = 'sustainability-comparison';
    var showers = SustainabilityCalc.waterToShowers(impact.water);
    setText(waterComp, '(' + t('sust_equals') + ' ' + showers + ' ' + t('sust_water_showers') + ')');
    waterRow.appendChild(waterComp);

    panel.appendChild(waterRow);

    // Geldwert Zeile
    var moneyRow = document.createElement('div');
    moneyRow.className = 'sustainability-row';
    var moneyLabel = document.createElement('span');
    moneyLabel.className = 'sustainability-label';
    setText(moneyLabel, '💶 ' + impact.money.toFixed(2) + ' € ' + t('sust_food_value'));
    moneyRow.appendChild(moneyLabel);
    panel.appendChild(moneyRow);

    // Hinweis fuer Zutaten ohne Daten
    if (impact.noDataIngredients.length > 0) {
      var noDataRow = document.createElement('div');
      noDataRow.className = 'sustainability-no-data';
      setText(noDataRow, t('sust_no_data') + ': ' + impact.noDataIngredients.join(', '));
      panel.appendChild(noDataRow);
    }

    // "Habe ich gekocht" Button
    var cookedBtn = document.createElement('button');
    cookedBtn.className = 'sustainability-cooked-btn';
    cookedBtn.type = 'button';
    setText(cookedBtn, '✓ ' + t('sust_cooked'));

    var cookedKey = 'sfc_cooked_' + recipeId;
    var alreadyCooked = false;
    try { alreadyCooked = sessionStorage.getItem(cookedKey) === '1'; } catch(e) {}

    if (alreadyCooked) {
      cookedBtn.disabled = true;
      cookedBtn.classList.add('sustainability-cooked-done');
      setText(cookedBtn, '✓ ' + t('sust_already_cooked'));
    }

    cookedBtn.addEventListener('click', function() {
      if (cookedBtn.disabled) return;

      SustainabilityCalc.addToBalance(impact.co2, impact.money, impact.water);
      cookedBtn.disabled = true;
      cookedBtn.classList.add('sustainability-cooked-done');
      setText(cookedBtn, '✓ ' + t('sust_already_cooked'));

      try { sessionStorage.setItem(cookedKey, '1'); } catch(e) {}
    });

    panel.appendChild(cookedBtn);

    return panel;
  }

  // ==================== INIT ====================

  function init() {
    // Sustainability UI is consumed via createRecipeImpactPanel() on demand.
    // Side-stats boxes on generator pages are wired separately in js/side-stats.js.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    createRecipeImpactPanel: createRecipeImpactPanel,
    init: init
  };

})();
