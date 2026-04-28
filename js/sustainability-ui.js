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

      var updated = SustainabilityCalc.addToBalance(impact.co2, impact.money, impact.water);
      cookedBtn.disabled = true;
      cookedBtn.classList.add('sustainability-cooked-done');
      setText(cookedBtn, '✓ ' + t('sust_already_cooked'));

      try { sessionStorage.setItem(cookedKey, '1'); } catch(e) {}

      updateCounterDisplay();
    });

    panel.appendChild(cookedBtn);

    return panel;
  }

  // ==================== PERSOENLICHER COUNTER ====================

  function initCounter() {
    if (document.getElementById('sustainability-counter')) return;

    var counter = document.createElement('div');
    counter.id = 'sustainability-counter';
    counter.className = 'sustainability-counter';

    var content = document.createElement('div');
    content.className = 'sustainability-counter-content';
    content.id = 'sustainability-counter-content';
    counter.appendChild(content);

    var resetBtn = document.createElement('button');
    resetBtn.className = 'sustainability-reset-btn';
    resetBtn.type = 'button';
    resetBtn.id = 'sustainability-reset-btn';
    setText(resetBtn, t('sust_reset'));
    resetBtn.addEventListener('click', function() {
      var confirmMsg = t('sust_reset_confirm');
      if (confirm(confirmMsg)) {
        SustainabilityCalc.resetBalance();
        try {
          var keys = Object.keys(sessionStorage);
          for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf('sfc_cooked_') === 0) {
              sessionStorage.removeItem(keys[i]);
            }
          }
        } catch(e) {}
        updateCounterDisplay();
      }
    });
    counter.appendChild(resetBtn);

    var footer = document.querySelector('.site-footer');
    if (footer) {
      footer.parentNode.insertBefore(counter, footer);
    } else {
      document.body.appendChild(counter);
    }

    updateCounterDisplay();
  }

  function updateCounterDisplay() {
    var contentEl = document.getElementById('sustainability-counter-content');
    var resetBtn = document.getElementById('sustainability-reset-btn');
    if (!contentEl) return;

    var balance = SustainabilityCalc.getUserBalance();

    while (contentEl.firstChild) {
      contentEl.removeChild(contentEl.firstChild);
    }

    var globeSpan = document.createElement('span');
    globeSpan.className = 'sustainability-counter-icon';
    setText(globeSpan, '🌍');
    contentEl.appendChild(globeSpan);

    var labelSpan = document.createElement('span');
    labelSpan.className = 'sustainability-counter-label';
    setText(labelSpan, t('sust_your_balance') + ':');
    contentEl.appendChild(labelSpan);

    // CO2
    var co2Span = document.createElement('span');
    co2Span.className = 'sustainability-counter-value';
    setText(co2Span, balance.co2_kg.toFixed(1) + ' kg CO₂ ' + t('sust_saved'));
    contentEl.appendChild(co2Span);

    var sepSpan1 = document.createElement('span');
    sepSpan1.className = 'sustainability-counter-sep';
    setText(sepSpan1, '·');
    contentEl.appendChild(sepSpan1);

    // Wasser
    var waterSpan = document.createElement('span');
    waterSpan.className = 'sustainability-counter-value';
    setText(waterSpan, Math.round(balance.water_l || 0) + ' L 💧 ' + t('sust_saved'));
    contentEl.appendChild(waterSpan);

    var sepSpan2 = document.createElement('span');
    sepSpan2.className = 'sustainability-counter-sep';
    setText(sepSpan2, '·');
    contentEl.appendChild(sepSpan2);

    // Geld
    var moneySpan = document.createElement('span');
    moneySpan.className = 'sustainability-counter-value';
    setText(moneySpan, balance.money_eur.toFixed(2) + ' € ' + t('sust_saved'));
    contentEl.appendChild(moneySpan);

    var sepSpan3 = document.createElement('span');
    sepSpan3.className = 'sustainability-counter-sep';
    setText(sepSpan3, '·');
    contentEl.appendChild(sepSpan3);

    var recipesSpan = document.createElement('span');
    recipesSpan.className = 'sustainability-counter-value';
    setText(recipesSpan, balance.recipes_cooked + ' ' + t('sust_recipes_cooked'));
    contentEl.appendChild(recipesSpan);

    if (resetBtn) {
      setText(resetBtn, t('sust_reset'));
      resetBtn.style.display = balance.recipes_cooked > 0 ? '' : 'none';
    }
  }

  // ==================== INIT ====================

  function init() {
    initCounter();
    window.addEventListener('languageChanged', function() {
      updateCounterDisplay();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    createRecipeImpactPanel: createRecipeImpactPanel,
    updateCounterDisplay: updateCounterDisplay,
    init: init
  };

})();
