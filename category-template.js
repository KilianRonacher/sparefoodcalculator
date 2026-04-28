/**
 * SpareFoodCalculator — Category Page Shell
 * ==========================================
 * Injiziert die vollständige Seitenstruktur (Header, Main, Footer, Modal,
 * Nav-Overlay und alle Skript-Tags) synchron via document.write während
 * des initialen HTML-Parsens.
 *
 * Jede Kategorie-Seite enthält nur noch den SEO-Head und einen
 * einzigen <script src="../category-template.js"></script> im Body.
 *
 * data-category auf <body> bestimmt die angezeigte Kategorie.
 */
(function () {
  'use strict';

  var cat = document.body.getAttribute('data-category') || '';

  // Deutsche Standardtitel (werden durch i18n.js auf DOMContentLoaded aktualisiert)
  var titles = {
    kuchen:     'Kuchen Rezepte',
    dessert:    'Dessert Rezepte',
    salat:      'Salat Rezepte',
    suppen:     'Suppen Rezepte',
    vorspeisen: 'Vorspeisen',
    schwein:    'Schwein Rezepte',
    haendl:     'Hähnchen Rezepte',
    fisch:      'Fisch Rezepte',
    rind:       'Rind Rezepte'
  };

  var h2Text  = titles[cat] || cat;
  var i18nKey = cat + '_rezepte';

  var html =
    '<a href="#main" class="skip-link">Zum Hauptinhalt springen</a>\n' +
    '<header class="site-header">\n' +
    '  <div class="container header-inner">\n' +
    '    <h1 class="logo"><a href="../index.html">SpareFoodCalculator</a></h1>\n' +
    '    <div class="nav-wrap">\n' +
    '      <button id="nav-toggle" class="nav-toggle" aria-expanded="false" aria-label="Menü">&#9776;</button>\n' +
    '      <nav class="main-nav mobile-hidden" id="main-nav" aria-label="Hauptnavigation">\n' +
    '        <button id="categories-btn" class="nav-btn" data-i18n="kategorien" aria-label="Kategorien anzeigen">Kategorien</button>\n' +
    '        <a href="../index.html" data-i18n="startseite">Startseite</a>\n' +
    '        <a href="search.html" data-i18n="calculator">Rezept-Generator</a>\n' +
    '        <a href="contact.html" data-i18n="kontakt">Kontakt</a>\n' +
    '        <a href="ingredients-generator.html" data-i18n="zutaten_generator">Zutaten-Generator</a>\n' +
    '        <a href="impressum.html" data-i18n="impressum">Impressum</a>\n' +
    '      </nav>\n' +
    '    </div>\n' +
    '    <div class="theme-lang-controls">\n' +
    '      <button id="theme-toggle-btn" aria-label="Dunkel-/Hell-Modus umschalten">&#127769;</button>\n' +
    '      <button id="lang-toggle-btn" aria-label="Sprache umschalten">English</button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</header>\n' +
    '<main id="main" class="container">\n' +
    '  <section class="category-intro">\n' +
    '    <h2 data-i18n="' + i18nKey + '">' + h2Text + '</h2>\n' +
    '  </section>\n' +
    '  <section id="category-recipes" class="recipes-grid" aria-live="polite"></section>\n' +
    '</main>\n' +
    '<footer class="site-footer">\n' +
    '  <div class="container">\n' +
    '    <nav aria-label="Footer-Navigation">\n' +
    '      <a href="../index.html" data-i18n="startseite">Startseite</a> •\n' +
    '      <a href="contact.html" data-i18n="kontakt">Kontakt</a> •\n' +
    '      <a href="impressum.html" data-i18n="impressum">Impressum</a>\n' +
    '    </nav>\n' +
    '    <p data-i18n="copyright">© 2025 Kilian Ronacher — SpareFoodCalculator</p>\n' +
    '  </div>\n' +
    '</footer>\n' +
    '<div id="modal" class="modal hidden" role="dialog" aria-modal="true" aria-hidden="true">\n' +
    '  <div class="modal-panel">\n' +
    '    <button id="modal-close" class="modal-close" aria-label="Dialog schließen">&#x2715;</button>\n' +
    '    <div id="modal-content"></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="nav-overlay" id="nav-overlay" aria-hidden="true"></div>\n';

  var scriptSrcs = [
    '../i18n.js',
    '../data/sustainability.js',
    '../js/sustainability.js',
    '../ingredients.js',
    '../search.js',
    '../recipes.js',
    '../app.js',
    '../ui.js',
    '../js/sustainability-ui.js'
  ];

  var scriptTags = scriptSrcs.map(function (src) {
    return '<scr' + 'ipt src="' + src + '"><\/scr' + 'ipt>';
  }).join('\n');

  // document.write ist während des initialen Parsens unbedenklich:
  // Der Parser pausiert beim synchronen <script>-Tag, führt diesen Code aus,
  // und fügt den geschriebenen Inhalt an aktueller Parse-Position ein.
  document.write(html + scriptTags);
})();
