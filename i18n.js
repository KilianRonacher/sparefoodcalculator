/**
 * Multi-language internationalization layer
 * Supports Deutsche and English translations
 * Stores language preference in browser localStorage
 */

const i18n = {};

/**
 * Update the theme toggle button text based on current theme and language
 */
function updateThemeButton() {
  const themeToggleButton = document.getElementById('theme-toggle-btn');
  if (!themeToggleButton) return;
  
  const isDarkMode = document.body.classList.contains('dark-mode');
  let currentLang = 'de'; // default
  try {
    currentLang = getLang();
  } catch(e) {
    // getLang not yet defined, use default
  }
  
  // On narrow screens show only the emoji to prevent header overflow
  const isMobileScreen = window.matchMedia('(max-width: 560px)').matches;
  let text;
  if (isDarkMode) {
    text = isMobileScreen ? '☀️' : ((currentLang === 'de') ? '☀️ Hell-Modus' : '☀️ Light Mode');
  } else {
    text = isMobileScreen ? '🌙' : ((currentLang === 'de') ? '🌙 Dunkel-Modus' : '🌙 Dark Mode');
  }
  themeToggleButton.textContent = text;
}

// German language dictionary
i18n['de'] = {
  'theme-toggle': '🌙 Dunkel-Modus',
  'lang-toggle': 'English',
  'startseite': 'Startseite',
  'salat': 'Salat',
  'suppen': 'Suppen',
  'vorspeisen': 'Vorspeisen',
  'rind': 'Rind',
  'schwein': 'Schwein',
  'haendl': 'Händl',
  'fisch': 'Fisch',
  'dessert': 'Dessert',
  'kuchen': 'Kuchen',
  'calculator': 'Calculator',
  'kontakt': 'Kontakt',
  'impressum': 'Impressum',
  'admin': 'Admin',
  'rezepte_aus_dem': 'Rezepte aus dem, was du im Kühlschrank hast',
  'einfach_hausgemacht': 'Einfach. Hausgemacht. Ein bisschen gehoben — für alle, die Neues probieren wollen.',
  'jetzt_zutaten': 'Jetzt Zutaten eingeben',
  'salate_entdecken': 'Salate entdecken',
  'kategorien': 'Kategorien',
  'so_funktioniert': 'So funktioniert der Calculator',
  'gib_zutaten_ein': 'Gib die Zutaten ein, die du hast (z. B. Tomate, Brot, Salat).',
  'generator_schlaegt_vor': 'Der Generator schlägt passende Rezepte vor — sortiert nach Übereinstimmung.',
  'klicke_rezept': 'Klicke ein Rezept an, um Details und Einkaufsempfehlungen zu sehen.',
  'copyright': '© 2025 Kilian Ronacher — SpareFoodCalculator',
  'salat_desc': 'Einfache, frische Salate und kreative Dressings.',
  'suppen_desc': 'Wärmend und clever: Suppen & Eintöpfe aus Resten.',
  'vorspeisen_desc': 'Kleine Gerichte, die aus wenig viel machen.',
  'rind_desc': 'Herzhafte Ideen für Rindfleischreste und Cuts.',
  'schwein_desc': 'Saftige und würzige Gerichte aus Schweinefleisch und Resten.',
  'haendl_desc': 'Geflügelrezepte: schnell, würzig und vielseitig.',
  'fisch_desc': 'Leichte Fischgerichte und kreative Resteverwertung.',
  'dessert_kuchen_desc': 'Süße Ideen aus Resten: Desserts und kleine Kuchen.',
  'anschauen': 'Anschauen',
  'zutaten_generator': 'Zutaten-Generator',
  'gib_zutaten_ein_desc': 'Gib die Zutaten ein, die du vorrätig hast (Komma-separiert). Der Generator schlägt Rezepte vor.',
  'zutaten_label': 'Zutaten',
  'zutaten_placeholder': 'Tomate, Brot, Salat',
  'rezepte_finden': 'Rezepte Finden',

  // Search & Compose
  'search_compose_title': 'Generator',
  'search_compose_desc': 'Zutaten eingeben und Rezepte generieren lassen — oder neue Gerichte aus gefundenen Rezepten zusammenstellen.',
  'search_button': 'Suche',
  'no_results': 'Keine Treffer gefunden.',
  'select_min_one': 'Bitte mindestens ein Rezept auswählen.',
  'compose_selected': 'Kombinieren',
  'view': 'Ansehen',
  'preview_title_prefix': 'Vorschau:',
  'save_recipe': 'Als Rezept speichern',
  'cancel': 'Abbrechen',
  'edit_compose': 'Komposition bearbeiten',
  'ingredients_label': 'Zutaten (Komma-separiert)',
  'steps_label': 'Schritte (eine pro Zeile)',
  'title_label': 'Titel',
  'category_label': 'Kategorie',
  'save_local_ok': 'Rezept lokal gespeichert.',
  'save_server_ok': 'Rezept an Server gesendet.',
  'save_error': 'Fehler beim Speichern.',

  // Accessibility labels
  'theme-toggle-aria': 'Dunkel-/Hell-Modus umschalten',
  'lang-toggle-aria': 'Sprache umschalten',
  'nav-toggle-aria': 'Navigationsmenü öffnen',
  'modal-close-aria': 'Dialog schließen',
  'categories-btn-aria': 'Kategorien anzeigen',

  // Recipes admin
  'recipe_input_title': 'Rezept-Eingabe (Einzeln)',
  'recipe_input_desc': 'Füge hier einzelne Rezepte hinzu. Speicherung erfolgt lokal unter sfc_recipes. Wenn ein Server erreichbar ist, versucht die Seite den Import.',
  'local_list_title': 'Lokale Rezepte',

  // Ingredients Generator
  'ing_generator_title': 'Zutaten-Generator',
  'ing_generator_desc': 'Wähle deine Zutaten aus und erhalte passende Vorschläge!',
  'ing_suggestions_title': 'Vorgeschlagene Zutaten',
  'ing_suggestions_hint': 'Basierend auf deiner Auswahl empfehlen wir:',
  'ing_all_title': 'Alle Zutaten',
  'ing_all_hint': 'Klicke auf eine Zutat, um sie auszuwählen',
  'ing_warenkorb_title': 'Warenkorb-Übersicht',
  'ing_selected_title': 'Ausgewählte Zutaten',
  'ing_clear_btn': 'Alle löschen',
  'ing_empty_suggestions': 'Wähle zuerst Zutaten aus, um Vorschläge zu erhalten',
  'ing_empty_selected': 'Noch keine Zutaten ausgewählt',
  'ing_no_suggestions': 'Keine weiteren Vorschläge verfügbar',
  'ing_results_title': '🍽️ Passende Rezepte',
  'ing_found_label': 'Gefunden',
  'ing_match_word': 'Übereinstimmung',
  'ing_ingredients_short': 'Zutaten',
  'ing_prep_steps': 'Zubereitungsschritte',
  'ing_no_recipe_match': 'Keine passenden Rezepte gefunden. Versuche andere Zutaten!',
  'ing_select_first': 'Bitte wähle zuerst Zutaten aus!',
  'ing_not_for_recipe': 'Nicht für dieses Rezept gedacht',
  'ing_find_recipes_btn': 'Rezepte Finden',

  // Recipe Generator
  'recipe_generator_title': 'Rezept-Generator',
  'recipe_generator_desc': 'Gib deine Zutaten ein und der Generator erstellt dir passende Rezepte!',
  'my_ingredients': 'Meine Zutaten',
  'add_ingredient': '+ Hinzufügen',
  'ingredient_placeholder': 'z.B. Tomate, Salat, Öl...',
  'vegetarian_mode': 'Vegetarisch',
  'vegetarian_subtitle': 'Nur vegetarische Rezepte anzeigen',
  'vegetarian_on': 'Veggie an',
  'no_ingredients_added': 'Keine Zutaten hinzugefügt. Füge welche ein, um zu beginnen!',
  'no_recipes_found': 'Keine passenden Rezepte gefunden!',
  'recipes_for_you': 'Rezepte für dich',
  'recipe': 'Rezept',
  'recipes': 'Rezepte',
  'perfect_matches': 'Perfekte Übereinstimmungen',
  'more_suggestions': 'Weitere Vorschläge',
  'ingredients_colon': 'Zutaten:',
  'perfect_badge': 'Perfekt',
  'partial_badge': 'Teilweise',

  // Did-you-mean & Autocomplete
  'did_you_mean_prefix': 'Du hast',
  'did_you_mean_typed': 'eingegeben',
  'did_you_mean_suggest': 'meintest du',
  'did_you_mean_accept': 'Ja, übernehmen',

  // Sustainability Tracking
  'sust_panel_title': 'Mit diesem Rezept rettest du:',
  'sust_equals': 'entspricht',
  'sust_food_value': 'an Lebensmittelwert',
  'sust_cooked': 'Habe ich gekocht',
  'sust_already_cooked': 'Bereits gekocht',
  'sust_your_balance': 'Deine Bilanz',
  'sust_saved': 'gespart',
  'sust_recipes_cooked': 'Rezepte gekocht',
  'sust_reset': 'Bilanz zurücksetzen',
  'sust_reset_confirm': 'Bilanz wirklich zurücksetzen? Alle gespeicherten Werte gehen verloren.',
  'sust_water': 'Wasser-Fussabdruck',
  'sust_water_showers': 'Duschen',
  'sust_co2_km': 'km Autofahrt',
  'sust_source': 'Quelle',
  'sust_no_data': 'keine Daten verfügbar',
  'sust_season_green': 'Alle Zutaten haben Saison',
  'sust_season_yellow': 'Teilweise saisonal',
  'sust_season_red': 'Wenige Zutaten haben Saison',
  'sust_better_in': 'Besser im',
  'sust_seasonal': 'Saisonalität'
};

// English language dictionary
i18n['en'] = {
  'theme-toggle': '🌙 Dark',
  'lang-toggle': 'Deutsch',
  'startseite': 'Home',
  'salat': 'Salad',
  'suppen': 'Soups',
  'vorspeisen': 'Starters',
  'rind': 'Beef',
  'schwein': 'Pork',
  'haendl': 'Poultry',
  'fisch': 'Fish',
  'dessert': 'Dessert',
  'kuchen': 'Cake',
  'calculator': 'Calculator',
  'kontakt': 'Contact',
  'impressum': 'Imprint',
  'admin': 'Admin',
  'rezepte_aus_dem': 'Recipes from what you have in your fridge',
  'einfach_hausgemacht': 'Simple. Homemade. A bit fancy — for everyone who wants to try something new.',
  'jetzt_zutaten': 'Enter ingredients now',
  'salate_entdecken': 'Discover salads',
  'kategorien': 'Categories',
  'so_funktioniert': 'How the Calculator works',
  'gib_zutaten_ein': 'Enter the ingredients you have: tomato, bread, salad.',
  'generator_schlaegt_vor': 'The generator suggests matching recipes — sorted by relevance.',
  'klicke_rezept': 'Click a recipe to see details and shopping suggestions.',
  'copyright': '© 2025 Kilian Ronacher — SpareFoodCalculator',
  'salat_desc': 'Simple, fresh salads and creative dressings.',
  'suppen_desc': 'Warm and clever: soups & stews from leftovers.',
  'vorspeisen_desc': 'Small dishes that make a lot from a little.',
  'rind_desc': 'Hearty ideas for beef scraps and cuts.',
  'schwein_desc': 'Juicy and spicy dishes from pork and leftovers.',
  'haendl_desc': 'Poultry recipes: quick, spicy and versatile.',
  'fisch_desc': 'Light fish dishes and creative leftover recipes.',
  'dessert_kuchen_desc': 'Sweet ideas from leftovers: desserts and small cakes.',
  'anschauen': 'View',
  'zutaten_generator': 'Ingredient Generator',
  'gib_zutaten_ein_desc': 'Enter the ingredients you have on hand (comma-separated). The generator will suggest recipes.',
  'zutaten_label': 'Ingredients',
  'zutaten_placeholder': 'tomato, bread, salad',
  'rezepte_finden': 'Find Recipes',

  // Search & Compose
  'search_compose_title': 'Generator',
  'search_compose_desc': 'Enter ingredients and generate recipes — or compose new dishes from found recipes.',
  'search_button': 'Search',
  'no_results': 'No results found.',
  'select_min_one': 'Please select at least one recipe.',
  'compose_selected': 'Combine',
  'view': 'View',
  'preview_title_prefix': 'Preview:',
  'save_recipe': 'Save recipe',
  'cancel': 'Cancel',
  'edit_compose': 'Edit composition',
  'ingredients_label': 'Ingredients (comma-separated)',
  'steps_label': 'Steps (one per line)',
  'title_label': 'Title',
  'category_label': 'Category',
  'save_local_ok': 'Recipe saved locally.',
  'save_server_ok': 'Recipe sent to server.',
  'save_error': 'Error saving recipe.',

  // Accessibility labels
  'theme-toggle-aria': 'Toggle dark/light mode',
  'lang-toggle-aria': 'Toggle language',
  'nav-toggle-aria': 'Open navigation menu',
  'modal-close-aria': 'Close dialog',
  'categories-btn-aria': 'Show categories',

  // Recipes admin
  'recipe_input_title': 'Recipe Input (single)',
  'recipe_input_desc': 'Add single recipes here. They are stored locally under sfc_recipes. If a server is available the page will try to import them.',
  'local_list_title': 'Local Recipes',

  // Ingredients Generator
  'ing_generator_title': 'Ingredient Generator',
  'ing_generator_desc': 'Select your ingredients and get matching suggestions!',
  'ing_suggestions_title': 'Suggested Ingredients',
  'ing_suggestions_hint': 'Based on your selection we recommend:',
  'ing_all_title': 'All Ingredients',
  'ing_all_hint': 'Click an ingredient to select it',
  'ing_warenkorb_title': 'Shopping Cart Overview',
  'ing_selected_title': 'Selected Ingredients',
  'ing_clear_btn': 'Clear all',
  'ing_empty_suggestions': 'Select ingredients first to get suggestions',
  'ing_empty_selected': 'No ingredients selected yet',
  'ing_no_suggestions': 'No more suggestions available',
  'ing_results_title': '🍽️ Matching Recipes',
  'ing_found_label': 'Found',
  'ing_match_word': 'match',
  'ing_ingredients_short': 'ingredients',
  'ing_prep_steps': 'preparation steps',
  'ing_no_recipe_match': 'No matching recipes found. Try different ingredients!',
  'ing_select_first': 'Please select ingredients first!',
  'ing_not_for_recipe': 'Not intended for this recipe',
  'ing_find_recipes_btn': 'Find Recipes',

  // Recipe Generator
  'recipe_generator_title': 'Recipe Generator',
  'recipe_generator_desc': 'Enter your ingredients and the generator creates matching recipes!',
  'my_ingredients': 'My Ingredients',
  'add_ingredient': '+ Add',
  'ingredient_placeholder': 'e.g. tomato, salad, oil...',
  'vegetarian_mode': 'Vegetarian',
  'vegetarian_subtitle': 'Show only vegetarian recipes',
  'vegetarian_on': 'Veggie on',
  'no_ingredients_added': 'No ingredients added. Add some to get started!',
  'no_recipes_found': 'No matching recipes found!',
  'recipes_for_you': 'recipes for you',
  'recipe': 'Recipe',
  'recipes': 'Recipes',
  'perfect_matches': 'Perfect Matches',
  'more_suggestions': 'More Suggestions',
  'ingredients_colon': 'Ingredients:',
  'perfect_badge': 'Perfect',
  'partial_badge': 'Partial',

  // Did-you-mean & Autocomplete
  'did_you_mean_prefix': 'You typed',
  'did_you_mean_typed': '',
  'did_you_mean_suggest': 'did you mean',
  'did_you_mean_accept': 'Yes, apply',

  // Sustainability Tracking
  'sust_panel_title': 'By cooking this recipe you save:',
  'sust_equals': 'equals',
  'sust_food_value': 'in food value',
  'sust_cooked': 'I cooked this',
  'sust_already_cooked': 'Already cooked',
  'sust_your_balance': 'Your balance',
  'sust_saved': 'saved',
  'sust_recipes_cooked': 'recipes cooked',
  'sust_reset': 'Reset balance',
  'sust_reset_confirm': 'Really reset your balance? All saved values will be lost.',
  'sust_water': 'Water footprint',
  'sust_water_showers': 'showers',
  'sust_co2_km': 'km by car',
  'sust_source': 'Source',
  'sust_no_data': 'no data available',
  'sust_season_green': 'All ingredients in season',
  'sust_season_yellow': 'Partially seasonal',
  'sust_season_red': 'Few ingredients in season',
  'sust_better_in': 'Better in',
  'sust_seasonal': 'Seasonality'
};

// New category translations
i18n['de']['saucen'] = 'Saucen';
i18n['en']['saucen'] = 'Sauces';
i18n['de']['saucen_desc'] = 'Aromen, Dressings und Saucen zur Verfeinerung deiner Gerichte.';
i18n['en']['saucen_desc'] = 'Sauces, dressings and flavor bases to enhance your dishes.';

i18n['de']['oele'] = 'Öle';
i18n['en']['oele'] = 'Oils';
i18n['de']['oele_desc'] = 'Speiseöle und Fette — Tipps zur Verwendung und Haltbarkeit.';
i18n['en']['oele_desc'] = 'Culinary oils and fats — usage tips and shelf life.';

i18n['de']['gewuerze'] = 'Gewürze';
i18n['en']['gewuerze'] = 'Spices';
i18n['de']['gewuerze_desc'] = 'Salze, Kräuter und Gewürzmischungen — Ideen zur Verwendung von Resten.';
i18n['en']['gewuerze_desc'] = 'Salts, herbs and spice blends — ideas to use leftovers.';

// Additional keys
i18n['de']['hero_art_alt'] = 'Bunte Teller mit Zutaten (Platzhalter)';
i18n['en']['hero_art_alt'] = 'Colorful plates with ingredients (placeholder)';


// Additional page link translations
i18n['de']['alle_seiten'] = 'Alle Seiten';
i18n['en']['alle_seiten'] = 'All pages';

// Category page headings (DE/EN)
i18n['de']['rind_rezepte']      = 'Rind Rezepte';
i18n['en']['rind_rezepte']      = 'Beef Recipes';
i18n['de']['fisch_rezepte']     = 'Fisch Rezepte';
i18n['en']['fisch_rezepte']     = 'Fish Recipes';
i18n['de']['schwein_rezepte']   = 'Schwein Rezepte';
i18n['en']['schwein_rezepte']   = 'Pork Recipes';
i18n['de']['haendl_rezepte']    = 'Hähnchen Rezepte';
i18n['en']['haendl_rezepte']    = 'Poultry Recipes';
i18n['de']['salat_rezepte']     = 'Salat Rezepte';
i18n['en']['salat_rezepte']     = 'Salad Recipes';
i18n['de']['suppen_rezepte']    = 'Suppen Rezepte';
i18n['en']['suppen_rezepte']    = 'Soup Recipes';
i18n['de']['dessert_rezepte']   = 'Dessert Rezepte';
i18n['en']['dessert_rezepte']   = 'Dessert Recipes';
i18n['de']['kuchen_rezepte']    = 'Kuchen Rezepte';
i18n['en']['kuchen_rezepte']    = 'Cake Recipes';
i18n['de']['vorspeisen_rezepte'] = 'Vorspeisen';
i18n['en']['vorspeisen_rezepte'] = 'Starters';

// ==================== SIDE STATS BOXES (search.html) ====================
i18n['de']['sfc_box_money_title']             = '💶 Geld gespart';
i18n['en']['sfc_box_money_title']             = '💶 Money saved';
i18n['de']['sfc_box_money_sub']               = 'Geschätzter Wert der eingesparten Reste';
i18n['en']['sfc_box_money_sub']               = 'Estimated value of leftovers saved';
i18n['de']['sfc_box_eco_title']               = '🌱 Ökologischer Fußabdruck';
i18n['en']['sfc_box_eco_title']               = '🌱 Ecological footprint';
i18n['de']['sfc_box_eco_co2_sub']             = 'CO₂ gespart';
i18n['en']['sfc_box_eco_co2_sub']             = 'CO₂ saved';
i18n['de']['sfc_box_eco_water_sub']           = 'Wasser gespart';
i18n['en']['sfc_box_eco_water_sub']           = 'water saved';
i18n['de']['sfc_box_eco_context_unit']        = 'km Autofahrt';
i18n['en']['sfc_box_eco_context_unit']        = 'km of driving';
i18n['de']['sfc_box_recipes_cooked_singular'] = 'Rezept gekocht';
i18n['en']['sfc_box_recipes_cooked_singular'] = 'recipe cooked';
i18n['de']['sfc_box_recipes_cooked_plural']   = 'Rezepte gekocht';
i18n['en']['sfc_box_recipes_cooked_plural']   = 'recipes cooked';

// ==================== CONTACT PAGE ====================
i18n['de']['contact_heading']             = 'Kontakt';
i18n['en']['contact_heading']             = 'Contact';
i18n['de']['contact_intro']               = 'Du kannst mich per E-Mail oder Telefon erreichen.';
i18n['en']['contact_intro']               = 'You can reach me by email or phone.';
i18n['de']['contact_email_label']         = 'E-Mail';
i18n['en']['contact_email_label']         = 'Email';
i18n['de']['contact_phone_label']         = 'Telefon';
i18n['en']['contact_phone_label']         = 'Phone';
i18n['de']['contact_form_heading']        = 'Feedback / Anfragen';
i18n['en']['contact_form_heading']        = 'Feedback / Inquiries';
i18n['de']['contact_form_intro']          = 'Schreibe uns direkt — die Nachricht geht ueber unseren Server an mich. Kein externes E-Mail-Programm noetig.';
i18n['en']['contact_form_intro']          = 'Write to us directly — the message is delivered through our server. No external email client required.';
i18n['de']['contact_name_label']          = 'Name';
i18n['en']['contact_name_label']          = 'Name';
i18n['de']['contact_message_label']       = 'Nachricht';
i18n['en']['contact_message_label']       = 'Message';
i18n['de']['contact_name_placeholder']    = 'Dein Name';
i18n['en']['contact_name_placeholder']    = 'Your name';
i18n['de']['contact_email_placeholder']   = 'Deine E-Mail';
i18n['en']['contact_email_placeholder']   = 'Your email';
i18n['de']['contact_message_placeholder'] = 'Nachricht';
i18n['en']['contact_message_placeholder'] = 'Message';
i18n['de']['contact_submit']              = 'Nachricht senden';
i18n['en']['contact_submit']              = 'Send message';
i18n['de']['contact_sending']             = 'Nachricht wird gesendet ...';
i18n['en']['contact_sending']             = 'Sending message ...';
i18n['de']['contact_success']             = 'Danke! Deine Nachricht wurde gesendet. Ich melde mich bald zurueck.';
i18n['en']['contact_success']             = 'Thank you! Your message was sent. I will get back to you soon.';
i18n['de']['contact_endpoint_missing']    = 'Das Kontaktformular ist noch nicht aktiviert. Bitte schreibe vorerst direkt an kilianfelbertal@gmail.com.';
i18n['en']['contact_endpoint_missing']    = 'The contact form is not yet activated. Please email kilianfelbertal@gmail.com directly for now.';
i18n['de']['contact_err_missing']         = 'Bitte fuelle alle Felder aus.';
i18n['en']['contact_err_missing']         = 'Please fill in all fields.';
i18n['de']['contact_err_invalid_email']   = 'Bitte eine gueltige E-Mail-Adresse eingeben.';
i18n['en']['contact_err_invalid_email']   = 'Please enter a valid email address.';
i18n['de']['contact_err_field_too_long']  = 'Eines der Felder ist zu lang.';
i18n['en']['contact_err_field_too_long']  = 'One of the fields is too long.';
i18n['de']['contact_err_mail_delivery_failed'] = 'Mail-Zustellung fehlgeschlagen. Bitte spaeter erneut versuchen.';
i18n['en']['contact_err_mail_delivery_failed'] = 'Mail delivery failed. Please try again later.';
i18n['de']['contact_err_network']         = 'Netzwerkfehler — bitte Internetverbindung pruefen und nochmal versuchen.';
i18n['en']['contact_err_network']         = 'Network error — please check your connection and try again.';
i18n['de']['contact_err_generic']         = 'Senden fehlgeschlagen. Bitte spaeter erneut versuchen oder direkt an kilianfelbertal@gmail.com schreiben.';
i18n['en']['contact_err_generic']         = 'Sending failed. Please try again later or email kilianfelbertal@gmail.com directly.';

// ==================== IMPRESSUM / LEGAL ====================
i18n['de']['impressum_heading']           = 'Impressum';
i18n['en']['impressum_heading']           = 'Legal Notice';
i18n['de']['imp_provider']                = 'Diensteanbieter';
i18n['en']['imp_provider']                = 'Service Provider';
i18n['de']['imp_contact']                 = 'Kontakt';
i18n['en']['imp_contact']                 = 'Contact';
i18n['de']['imp_phone']                   = 'Telefonnummer';
i18n['en']['imp_phone']                   = 'Phone number';
i18n['de']['imp_responsible']             = 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV';
i18n['en']['imp_responsible']             = 'Responsible for content according to § 18 (2) MStV';
i18n['de']['imp_copyright']               = 'Urheberrecht';
i18n['en']['imp_copyright']               = 'Copyright';
i18n['de']['imp_copyright_text']          = 'Die Inhalte dieser Website unterliegen dem oesterreichischen Urheberrecht. Die Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der schriftlichen Zustimmung des Erstellers. Downloads und Kopien dieser Seite sind nur fuer den privaten, nicht kommerziellen Gebrauch gestattet.';
i18n['en']['imp_copyright_text']          = 'The content of this website is subject to Austrian copyright law. Reproduction, editing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the author. Downloads and copies of this site are only permitted for private, non-commercial use.';
i18n['de']['imp_eu_dispute']              = 'Hinweis auf EU-Streitschlichtung';
i18n['en']['imp_eu_dispute']              = 'EU Online Dispute Resolution';
i18n['de']['imp_eu_dispute_text']         = 'Die Europaeische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Sie finden diese unter';
i18n['en']['imp_eu_dispute_text']         = 'The European Commission provides a platform for online dispute resolution. You can find it at';
i18n['de']['imp_disclaimer']              = 'Haftungsausschluss';
i18n['en']['imp_disclaimer']              = 'Disclaimer';
i18n['de']['imp_disclaimer_text']         = 'Diese Website enthaelt Verknuepfungen zu Websites Dritter. Diese Websites unterliegen der Haftung der jeweiligen Betreiber. Der Anbieter hat bei der erstmaligen Verknuepfung der externen Links die fremden Inhalte auf etwaige Rechtsverstoesse ueberprueft. Zu dem Zeitpunkt waren keine Rechtsverstoesse ersichtlich. Der Anbieter hat keinen Einfluss auf die aktuelle und zukuenftige Gestaltung dieser Seiten.';
i18n['en']['imp_disclaimer_text']         = 'This website contains links to third-party websites. These websites are the responsibility of their respective operators. At the time the external links were first added, the third-party content was checked for potential legal violations. None were apparent at that time. The provider has no influence on the current or future design of these pages.';
i18n['de']['imp_privacy_heading']         = 'Datenschutzerklaerung fuer SpareFoodCalculator';
i18n['en']['imp_privacy_heading']         = 'Privacy Policy for SpareFoodCalculator';
i18n['de']['imp_privacy_responsible']     = 'Verantwortliche Stelle';
i18n['en']['imp_privacy_responsible']     = 'Responsible party';
i18n['de']['imp_privacy_general']         = 'Allgemeines';
i18n['en']['imp_privacy_general']         = 'General';
i18n['de']['imp_privacy_general_text']    = 'Diese Erklaerung informiert Sie ueber die Art, den Umfang und den Zweck der Erhebung persoenlicher Daten auf dieser Website. Der Schutz Ihrer Daten hat Prioritaet.';
i18n['en']['imp_privacy_general_text']    = 'This statement informs you about the nature, scope, and purpose of the collection of personal data on this website. Protecting your data is a priority.';
i18n['de']['imp_privacy_logs']            = 'Datenerfassung beim Besuch der Website';
i18n['en']['imp_privacy_logs']            = 'Data collection when visiting the website';
i18n['de']['imp_privacy_logs_intro']      = 'Der Webserver speichert automatisch Informationen in Log-Files:';
i18n['en']['imp_privacy_logs_intro']      = 'The web server automatically stores information in log files:';
i18n['de']['imp_privacy_log_ip']          = 'IP-Adresse';
i18n['en']['imp_privacy_log_ip']          = 'IP address';
i18n['de']['imp_privacy_log_browser']     = 'Browsertyp und Browserversion';
i18n['en']['imp_privacy_log_browser']     = 'Browser type and version';
i18n['de']['imp_privacy_log_os']          = 'Betriebssystem';
i18n['en']['imp_privacy_log_os']          = 'Operating system';
i18n['de']['imp_privacy_log_referrer']    = 'Referrer-URL';
i18n['en']['imp_privacy_log_referrer']    = 'Referrer URL';
i18n['de']['imp_privacy_log_timestamp']   = 'Zeitstempel der Serveranfrage';
i18n['en']['imp_privacy_log_timestamp']   = 'Timestamp of the server request';
i18n['de']['imp_privacy_logs_purpose']    = 'Diese Daten dienen der technischen Stabilitaet und Sicherheit. Eine Zusammenfuehrung mit anderen Datenquellen erfolgt nicht.';
i18n['en']['imp_privacy_logs_purpose']    = 'This data is used for technical stability and security. It is not combined with other data sources.';
i18n['de']['imp_privacy_contact']         = 'Kontaktaufnahme';
i18n['en']['imp_privacy_contact']         = 'Contact';
i18n['de']['imp_privacy_contact_text']    = 'Wenn Sie mich per E-Mail kontaktieren, speichere ich Ihre Angaben zur Bearbeitung der Anfrage. Diese Daten gebe ich nicht ohne Ihre Einwilligung weiter.';
i18n['en']['imp_privacy_contact_text']    = 'If you contact me by email, I store your details to process the inquiry. I do not pass on this data without your consent.';
i18n['de']['imp_privacy_rights']          = 'Ihre Rechte';
i18n['en']['imp_privacy_rights']          = 'Your rights';
i18n['de']['imp_privacy_rights_text']     = 'Sie haben das Recht auf unentgeltliche Auskunft ueber Ihre gespeicherten personenbezogenen Daten. Sie koennen die Berichtigung, Sperrung oder Loeschung dieser Daten verlangen. Wenden Sie sich hierzu an die oben genannte Adresse.';
i18n['en']['imp_privacy_rights_text']     = 'You have the right to free information about your stored personal data. You may request correction, blocking or deletion of this data. Please contact the address listed above.';
i18n['de']['imp_privacy_complaint']       = 'Beschwerderecht';
i18n['en']['imp_privacy_complaint']       = 'Right to complain';
i18n['de']['imp_privacy_complaint_text']  = 'Sie koennen sich bei der zustaendigen Aufsichtsbehoerde fuer den Datenschutz beschweren. Die Zustaendigkeit richtet sich nach Ihrem Wohnsitz.';
i18n['en']['imp_privacy_complaint_text']  = 'You can lodge a complaint with the responsible data protection supervisory authority. Jurisdiction depends on your place of residence.';
i18n['de']['imp_privacy_cookies']         = 'Cookies';
i18n['en']['imp_privacy_cookies']         = 'Cookies';
i18n['de']['imp_privacy_cookies_text']    = 'Diese Website verzichtet auf Tracking-Cookies. Technische Cookies dienen ausschliesslich der Funktionsfaehigkeit der Anwendung.';
i18n['en']['imp_privacy_cookies_text']    = 'This website does not use tracking cookies. Technical cookies are used solely for the functionality of the application.';
i18n['de']['imp_terms_heading']           = 'Nutzungsbedingungen';
i18n['en']['imp_terms_heading']           = 'Terms of Use';
i18n['de']['imp_terms_scope']             = 'Geltungsbereich';
i18n['en']['imp_terms_scope']             = 'Scope';
i18n['de']['imp_terms_scope_text']        = 'Diese Bedingungen regeln die Nutzung der Anwendung SpareFoodCalculator.';
i18n['en']['imp_terms_scope_text']        = 'These terms govern the use of the SpareFoodCalculator application.';
i18n['de']['imp_terms_disclaimer']        = 'Haftungsausschluss';
i18n['en']['imp_terms_disclaimer']        = 'Disclaimer';
i18n['de']['imp_terms_disclaimer_text']   = 'Die Bereitstellung der Berechnungsfunktionen erfolgt unentgeltlich. Ich uebernehme keine Gewaehr fuer die Richtigkeit der Ergebnisse. Eine Haftung fuer Schaeden aus der Nutzung der Anwendung schliesse ich aus.';
i18n['en']['imp_terms_disclaimer_text']   = 'The calculation functions are provided free of charge. I make no warranty as to the accuracy of the results. I exclude liability for damages arising from use of the application.';
i18n['de']['imp_terms_license']           = 'Nutzungsrecht';
i18n['en']['imp_terms_license']           = 'License';
i18n['de']['imp_terms_license_text']      = 'Ich raeume Ihnen ein einfaches, nicht uebertragbares Recht zur Nutzung der Anwendung fuer private Zwecke ein. Die kommerzielle Auswertung der Daten ist untersagt.';
i18n['en']['imp_terms_license_text']      = 'I grant you a simple, non-transferable right to use the application for private purposes. Commercial use of the data is prohibited.';
i18n['de']['imp_terms_jurisdiction']      = 'Gerichtsstand';
i18n['en']['imp_terms_jurisdiction']      = 'Jurisdiction';
i18n['de']['imp_terms_jurisdiction_text'] = 'Es gilt oesterreichisches Recht. Als Gerichtsstand vereinbaren wir das sachlich zustaendige Gericht an meinem Wohnsitz.';
i18n['en']['imp_terms_jurisdiction_text'] = 'Austrian law applies. The agreed place of jurisdiction is the court with subject-matter jurisdiction at my place of residence.';

// Ingredient translations (DE -> EN)
const ingredientTranslations = {
  // Meat
  'rindfleisch': 'beef',
  'schweinefleisch': 'pork',
  'schweineschnitzel': 'pork schnitzel',
  'schweinefilet': 'pork fillet',
  'schweinefaschiertes': 'ground pork',
  'hähnchen': 'chicken',
  'haehnchen': 'chicken',
  'hahnchen': 'chicken',
  'hähnchenbrust': 'chicken breast',
  'haehnchenbrust': 'chicken breast',
  'hahnchenbrust': 'chicken breast',
  'lamm': 'lamb',
  'kalb': 'veal',
  'speck': 'bacon',
  'schinken': 'ham',
  'fleischbällchen': 'meatballs',
  'fleischballchen': 'meatballs',
  
  // Fish
  'fisch': 'fish',
  'lachs': 'salmon',
  'lachsfilet': 'salmon fillet',
  'forelle': 'trout',
  'kabeljau': 'cod',
  'thunfisch': 'tuna',
  'shrimps': 'shrimps',
  
  // Vegetables
  'tomate': 'tomato',
  'tomaten': 'tomatoes',
  'zwiebel': 'onion',
  'paprika': 'bell pepper',
  'rote paprika': 'red bell pepper',
  'gelbe paprika': 'yellow bell pepper',
  'karotte': 'carrot',
  'karotten': 'carrots',
  'zucchini': 'zucchini',
  'aubergine': 'eggplant',
  'brokkoli': 'broccoli',
  'blumenkohl': 'cauliflower',
  'spinat': 'spinach',
  'salat': 'lettuce',
  'gurke': 'cucumber',
  'sellerie': 'celery',
  'staudensellerie': 'celery',
  'rote beete': 'beetroot',
  'kürbis': 'pumpkin',
  'kurbis': 'pumpkin',
  'mais': 'corn',
  'erbsen': 'peas',
  'bohnen': 'beans',
  'kidneybohnen': 'kidney beans',
  'lauch': 'leek',
  'porree': 'leek',
  'fenchel': 'fennel',
  'champignons': 'mushrooms',
  'pilze': 'mushrooms',
  'pilz': 'mushroom',
  'weißkraut': 'white cabbage',
  'weisskraut': 'white cabbage',
  'gemüse': 'vegetables',
  'gemuse': 'vegetables',
  
  // Potatoes & Grains
  'kartoffel': 'potato',
  'kartoffeln': 'potatoes',
  'reis': 'rice',
  'risottoreis': 'risotto rice',
  'pasta': 'pasta',
  'nudeln': 'noodles',
  'spaghetti': 'spaghetti',
  'penne': 'penne',
  'fusilli': 'fusilli',
  'ravioli': 'ravioli',
  'haferflocken': 'oats',
  
  // Flour & Bread
  'mehl': 'flour',
  'brot': 'bread',
  'paniermehl': 'breadcrumbs',
  
  // Dairy & Eggs
  'milch': 'milk',
  'sahne': 'cream',
  'schmand': 'sour cream',
  'joghurt': 'yogurt',
  'quark': 'quark',
  'topfen': 'quark',
  'käse': 'cheese',
  'kase': 'cheese',
  'parmesan': 'parmesan',
  'mozzarella': 'mozzarella',
  'gouda': 'gouda',
  'feta': 'feta',
  'ricotta': 'ricotta',
  'cheddar': 'cheddar',
  'roquefort käse': 'roquefort cheese',
  'roquefort kase': 'roquefort cheese',
  'frischkäse': 'cream cheese',
  'frischkase': 'cream cheese',
  'butter': 'butter',
  'ei': 'egg',
  'eier': 'eggs',
  'eigelb': 'egg yolk',
  'eiweiß': 'egg white',
  'eiweis': 'egg white',
  
  // Legumes
  'linsen': 'lentils',
  'kichererbsen': 'chickpeas',
  'tofu': 'tofu',
  
  // Nuts
  'mandeln': 'almonds',
  'walnüsse': 'walnuts',
  'walnusse': 'walnuts',
  'pinienkerne': 'pine nuts',
  
  // Fruits
  'apfel': 'apple',
  'äpfel': 'apples',
  'apfle': 'apple',
  'zitrone': 'lemon',
  'limette': 'lime',
  'erdbeere': 'strawberry',
  'erdbeeren': 'strawberries',
  'himbeeren': 'raspberries',
  'blaubeeren': 'blueberries',
  'kirschen': 'cherries',
  'birne': 'pear',
  'birnen': 'pears',
  'mango': 'mango',
  'banane': 'banana',
  'bananen': 'bananas',
  'orange': 'orange',
  'orangen': 'oranges',
  'spargel': 'asparagus',
  'grüner spargel': 'green asparagus',
  'grüner-spargel': 'green asparagus',
  'weißer spargel': 'white asparagus',
  'weißer-spargel': 'white asparagus',
  
  // Herbs & Spices
  'kräuter': 'herbs',
  'krauter': 'herbs',
  'kraeuter': 'herbs',
  'basilikum': 'basil',
  'petersilie': 'parsley',
  'schnittlauch': 'chives',
  'dill': 'dill',
  'oregano': 'oregano',
  'thymian': 'thyme',
  'rosmarin': 'rosemary',
  'salz': 'salt',
  'pfeffer': 'pepper',
  'schwarzer pfeffer': 'black pepper',
  'roter pfeffer': 'red pepper',
  'paprikapulver': 'paprika powder',
  'curry': 'curry',
  'currypulver': 'curry powder',
  'chili': 'chili',
  'ingwer': 'ginger',
  'muskatnuss': 'nutmeg',
  'kümmel': 'caraway',
  'kummel': 'caraway',
  'kreuzkümmel': 'cumin',
  'kreuzkummel': 'cumin',
  'fleur de sel': 'fleur de sel',
  
  // Oils & Vinegar
  'olivenöl': 'olive oil',
  'olivenol': 'olive oil',
  'öl': 'oil',
  'ol': 'oil',
  'sesamöl': 'sesame oil',
  'sesamol': 'sesame oil',
  'essig': 'vinegar',
  
  // Sauces & Condiments
  'sojasauce': 'soy sauce',
  'senf': 'mustard',
  'tomatenmark': 'tomato paste',
  'teriyaki sauce': 'teriyaki sauce',
  
  // Stock & Liquids
  'fond': 'stock',
  'brühe': 'broth',
  'bruhe': 'broth',
  'rinderbrühe': 'beef broth',
  'rinderbru': 'beef broth',
  'rotwein': 'red wine',
  'weißwein': 'white wine',
  'weisswein': 'white wine',
  'kokosmilch': 'coconut milk',
  
  // Other
  'knoblauch': 'garlic',
  'honig': 'honey',
  'zucker': 'sugar',
  'puderzucker': 'powdered sugar',
  'schokolade': 'chocolate',
  'vanille': 'vanilla',
  'backpulver': 'baking powder',
  'gelatine': 'gelatin',
  'sesam': 'sesame',
  'oliven': 'olives',
  'kapern': 'capers',
  'zitronensaft': 'lemon juice',
  'limettensaft': 'lime juice',

  // Zusätzliche häufige Zutaten (ergänzt 2026-04-22)
  'zwiebeln': 'onions',
  'knoblauchzehe': 'garlic clove',
  'knoblauchzehen': 'garlic cloves',
  'hühnerbrühe': 'chicken broth',
  'huhnerbruhe': 'chicken broth',
  'gemüsebrühe': 'vegetable broth',
  'gemüsebruhe': 'vegetable broth',
  'gemusebruhe': 'vegetable broth',
  'tomatensoße': 'tomato sauce',
  'tomatensauce': 'tomato sauce',
  'paprikapulver scharf': 'hot paprika powder',
  'paprikapulver edelsüß': 'sweet paprika powder',
  'paprikapulver edelsuss': 'sweet paprika powder',
  'schlagsahne': 'whipping cream',
  'crème fraîche': 'crème fraîche',
  'creme fraiche': 'crème fraîche',
  'speisestärke': 'cornstarch',
  'speisestarke': 'cornstarch',
  'pflanzenöl': 'vegetable oil',
  'pflanzenol': 'vegetable oil',
  'sonnenblumenöl': 'sunflower oil',
  'sonnenblumenol': 'sunflower oil',
  'rapsöl': 'rapeseed oil',
  'rapsol': 'rapeseed oil',
  'balsamicoessig': 'balsamic vinegar',
  'balsamico': 'balsamic vinegar',
  'weinessig': 'wine vinegar',
  'apfelessig': 'apple cider vinegar',
  'worcestersauce': 'worcestershire sauce',
  'tabasco': 'tabasco',
  'ketchup': 'ketchup',
  'mayonnaise': 'mayonnaise',
  'mayo': 'mayo',
  'hefepulver': 'dry yeast',
  'trockenhefe': 'dry yeast',
  'frischhefe': 'fresh yeast',
  'zimt': 'cinnamon',
  'kardamom': 'cardamom',
  'nelken': 'cloves',
  'lorbeerblatt': 'bay leaf',
  'lorbeerblätter': 'bay leaves',
  'lorbeerblatter': 'bay leaves',
  'wacholderbeeren': 'juniper berries',
  'meersalz': 'sea salt',
  'jodsalz': 'iodized salt',
  'vollmilch': 'whole milk',
  'buttermilch': 'buttermilk',
  'kondensmilch': 'condensed milk',
  'hafermilch': 'oat milk',
  'mandelmilch': 'almond milk',
  'sojamilch': 'soy milk',
  'naturjoghurt': 'plain yogurt',
  'griechischer joghurt': 'greek yogurt',
  'mascarpone': 'mascarpone',
  'emmentaler': 'emmental',
  'gruyere': 'gruyère',
  'gruyère': 'gruyère',
  'manchego': 'manchego',
  'burrata': 'burrata',
  'hüttenkäse': 'cottage cheese',
  'huttenkase': 'cottage cheese',
  'paniermehl': 'breadcrumbs',
  'semmelbrösel': 'breadcrumbs',
  'semmelbrosel': 'breadcrumbs',
  'weißbrot': 'white bread',
  'vollkornbrot': 'wholegrain bread',
  'toastbrot': 'toast bread',
  'brötchen': 'bread roll',
  'croissant': 'croissant',
  'tortilla': 'tortilla',
  'fladenbrot': 'flatbread',
  'couscous': 'couscous',
  'quinoa': 'quinoa',
  'linsenrot': 'red lentils',
  'rote linsen': 'red lentils',
  'grüne linsen': 'green lentils',
  'belugalinsen': 'beluga lentils',
  'kichererbsendose': 'canned chickpeas',
  'kidneybohnendose': 'canned kidney beans',
  'weißbohnen': 'white beans',
  'edamame': 'edamame',
  'sojasprossen': 'bean sprouts',
  'pak choi': 'bok choy',
  'mangold': 'chard',
  'rosenkohl': 'brussels sprouts',
  'kohlrabi': 'kohlrabi',
  'wirsing': 'savoy cabbage',
  'rotkohl': 'red cabbage',
  'spitzkohl': 'pointed cabbage',
  'chinakohl': 'napa cabbage',
  'rucola': 'arugula',
  'feldsalat': 'lamb\'s lettuce',
  'eisbergsalat': 'iceberg lettuce',
  'kopfsalat': 'head lettuce',
  'radicchio': 'radicchio',
  'chicorée': 'chicory',
  'chicoree': 'chicory',
  'artischocke': 'artichoke',
  'artischocken': 'artichokes',
  'süßkartoffel': 'sweet potato',
  'susskartoffel': 'sweet potato',
  'süßkartoffeln': 'sweet potatoes',
  'susskartoffeln': 'sweet potatoes',
  'pastinake': 'parsnip',
  'pastinaken': 'parsnips',
  'petersilienwurzel': 'parsley root',
  'schwarzwurzel': 'salsify',
  'meerrettich': 'horseradish',
  'ingwerwurzel': 'ginger root',
  'frischer ingwer': 'fresh ginger',
  'kurkuma': 'turmeric',
  'koriander': 'coriander',
  'korianderblätter': 'coriander leaves',
  'korianderblatter': 'coriander leaves',
  'minze': 'mint',
  'salbei': 'sage',
  'estragon': 'tarragon',
  'liebstöckel': 'lovage',
  'liebstockel': 'lovage',
  'zitronenmelisse': 'lemon balm',
  'bärlauch': 'wild garlic',
  'barlauch': 'wild garlic',
  'kapuzinerkresse': 'nasturtium',
  'walnussöl': 'walnut oil',
  'haselnussöl': 'hazelnut oil',
  'haselnusse': 'hazelnuts',
  'haselnüsse': 'hazelnuts',
  'cashews': 'cashews',
  'pistazien': 'pistachios',
  'macadamia': 'macadamia',
  'kokosnuss': 'coconut',
  'kokosraspeln': 'desiccated coconut',
  'kokosöl': 'coconut oil',
  'kokosol': 'coconut oil',
  'tahini': 'tahini',
  'hummus': 'hummus',
  'pesto': 'pesto',
  'tapenade': 'tapenade',
  'ajvar': 'ajvar',
  'harissa': 'harissa',
  'sambal oelek': 'sambal oelek',
  'miso': 'miso',
  'fischsauce': 'fish sauce',
  'austernsoße': 'oyster sauce',
  'austernsauce': 'oyster sauce',
  'hoisinsauce': 'hoisin sauce',
  'sriracha': 'sriracha',
  'tabascosauce': 'tabasco sauce',
  'worcestershire': 'worcestershire',
  'zucchini gelb': 'yellow zucchini',
  'kirschtomaten': 'cherry tomatoes',
  'cherrytomaten': 'cherry tomatoes',
  'flaschentomaten': 'plum tomatoes',
  'dosentomaten': 'canned tomatoes',
  'getrocknete tomaten': 'sun-dried tomatoes',
  'tomatendose': 'canned tomatoes',
  'schinkenwürfel': 'diced ham',
  'speckwürfel': 'diced bacon',
  'räucherlachs': 'smoked salmon',
  'garnelen': 'prawns',
  'tintenfisch': 'squid',
  'calamari': 'calamari',
  'miesmuscheln': 'mussels',
  'jakobsmuscheln': 'scallops',
  'sardellen': 'anchovies',
  'hering': 'herring',
  'makrele': 'mackerel',
  'dorsch': 'cod',
  'seelachs': 'pollock',
  'tilapia': 'tilapia',
  'pangasius': 'pangasius',
  'amaretto': 'amaretto',
  'avocado': 'avocado',
  'bohnensprossen': 'bean sprouts',
  'butterschmalz': 'clarified butter',
  'chiliflocken': 'chili flakes',
  'espresso': 'espresso',
  'gewürzgurken': 'pickled gherkins',
  'grieß': 'semolina',
  'hackfleisch': 'ground meat',
  'hefe': 'yeast',
  'johannisbeeren': 'currants',
  'kakaopulver': 'cocoa powder',
  'kirschwasser': 'kirsch',
  'lasagne': 'lasagna',
  'lasagneplatten': 'lasagna sheets',
  'lorbeer': 'bay leaf',
  'löffelbiskuits': 'ladyfingers',
  'majoran': 'marjoram',
  'marmelade': 'jam',
  'mohn': 'poppy seeds',
  'muskat': 'nutmeg',
  'natron': 'baking soda',
  'pizza': 'pizza',
  'rinderhack': 'ground beef',
  'rinderleber': 'beef liver',
  'rosinen': 'raisins',
  'rotweinessig': 'red wine vinegar',
  'sauerkraut': 'sauerkraut',
  'spätzle': 'spaetzle',
  'strudelteig': 'strudel dough',
  'zartbitterschokolade': 'dark chocolate',
  'zuckerschoten': 'sugar snap peas',
  'zwetschgen': 'plums'
};

// Expose for other scripts that expect global access
window.ingredientTranslations = ingredientTranslations;

/**
 * Translate ingredient from German to English
 */
function translateIngredient(ingredient, targetLang) {
  if (targetLang === 'de' || !targetLang) return ingredient;
  const normalized = ingredient.toLowerCase().trim();
  return ingredientTranslations[normalized] || ingredient;
}

/**
 * Translate category names
 */
const categoryTranslations = {
  'fleisch': 'Meat',
  'fisch': 'Fish',
  'gemüse': 'Vegetables',
  'kartoffeln': 'Potatoes',
  'getreide': 'Grains',
  'mehl': 'Flour',
  'brot': 'Bread',
  'milchprodukte': 'Dairy',
  'eier': 'Eggs',
  'hülsenfrüchte': 'Legumes',
  'nüsse': 'Nuts',
  'obst': 'Fruit',
  'kräuter': 'Herbs',
  'gewürze': 'Spices',
  'öl': 'Oil',
  'essig': 'Vinegar',
  'soßen': 'Sauces',
  'fond': 'Stock',
  'wein': 'Wine',
  'sonstiges': 'Other'
};

function translateCategory(category, targetLang) {
  if (targetLang === 'de' || !targetLang) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  return categoryTranslations[category.toLowerCase()] || category;
}

// Removed translations for removed admin pages

/**
 * Retrieve the currently active language from browser storage
 * Defaults to German if not set
 */
function getLang() {
  try {
    var storedLanguage = localStorage.getItem('sfc_lang');
    return storedLanguage ? storedLanguage : 'de';
  } catch(e) {
    return 'de';
  }
}

/**
 * Activate a specified language
 * Updates all DOM elements with translations
 * Persists selection to localStorage
 */
function setLang(targetLanguage) {
  try { localStorage.setItem('sfc_lang', targetLanguage); } catch(e) { /* Private mode fallback */ }
  
  // Process all elements with translation keys (except theme-toggle-btn which is handled separately)
  const allTranslatableElements = document.querySelectorAll('[data-i18n]');
  allTranslatableElements.forEach(element => {
    // Skip theme toggle button - it's handled separately below
    if (element.id === 'theme-toggle-btn') return;
    
    const translationKey = element.getAttribute('data-i18n');
    const translation = i18n[targetLanguage] 
      ? (i18n[targetLanguage][translationKey] || i18n['de'][translationKey] || translationKey)
      : (i18n['de'][translationKey] || translationKey);
    
    element.textContent = translation;
  });
  
  // Update placeholder text for input fields
  const allPlaceholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  allPlaceholderElements.forEach(element => {
    const placeholderKey = element.getAttribute('data-i18n-placeholder');
    const placeholderText = i18n[targetLanguage]
      ? (i18n[targetLanguage][placeholderKey] || i18n['de'][placeholderKey] || placeholderKey)
      : (i18n['de'][placeholderKey] || placeholderKey);
    
    element.setAttribute('placeholder', placeholderText);
  });

  // Update alt text for images using data-i18n-alt
  const allAltElements = document.querySelectorAll('[data-i18n-alt]');
  allAltElements.forEach(element => {
    const altKey = element.getAttribute('data-i18n-alt');
    const altText = i18n[targetLanguage]
      ? (i18n[targetLanguage][altKey] || i18n['de'][altKey] || altKey)
      : (i18n['de'][altKey] || altKey);

    element.setAttribute('alt', altText);
  });
  
  // Update aria-labels for accessibility
  var ariaMap = {
    'theme-toggle-btn': 'theme-toggle-aria',
    'theme-toggle': 'theme-toggle-aria',
    'lang-toggle-btn': 'lang-toggle-aria',
    'nav-toggle': 'nav-toggle-aria',
    'modal-close': 'modal-close-aria',
    'categories-btn': 'categories-btn-aria'
  };
  Object.keys(ariaMap).forEach(function(elId) {
    var el = document.getElementById(elId);
    if (el) {
      var key = ariaMap[elId];
      var label = (i18n[targetLanguage] && i18n[targetLanguage][key]) || i18n['de'][key] || '';
      if (label) el.setAttribute('aria-label', label);
    }
  });

  // Refresh theme toggle button with correct text for current mode and language
  updateThemeButton();
  
  // Refresh language toggle button
  const languageToggleButton = document.getElementById('lang-toggle-btn');
  if (languageToggleButton) {
    languageToggleButton.textContent = i18n[targetLanguage]['lang-toggle'];
  }

  // Trigger custom event for dynamic content updates
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: targetLanguage } }));
}

/**
 * Initialize translations when document is ready
 * Applies stored language preference or default
 */
window.addEventListener('DOMContentLoaded', function() {
  // Load and apply stored theme
  var currentTheme = 'light';
  try { currentTheme = localStorage.getItem('theme') || 'light'; } catch(e) { /* Private mode */ }
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  const activeLanguage = getLang();
  // Ensure the language toggle works even if other scripts don't attach handlers
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const next = getLang() === 'de' ? 'en' : 'de';
      setLang(next);
    });
  }
  setLang(activeLanguage);
  
  // Update theme button text after language is set
  updateThemeButton();
  
  // Setup theme toggle button event listener - handles both IDs
  // theme-toggle-btn: search.html, ingredients-generator.html
  // theme-toggle: category pages (rind.html, fisch.html, etc.)
  function handleThemeToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e) { /* Private mode */ }
    updateThemeButton();
    // Update icon-btn style buttons on category pages
    var iconThemeBtn = document.getElementById('theme-toggle');
    if (iconThemeBtn) {
      iconThemeBtn.textContent = isDark ? '☀️' : '🌙';
    }
    return false;
  }

  var themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.onclick = handleThemeToggle;
  }

  // Kategorie-Seiten verwenden id="theme-toggle" statt "theme-toggle-btn"
  var themeToggleIcon = document.getElementById('theme-toggle');
  if (themeToggleIcon) {
    var isDarkOnLoad = document.body.classList.contains('dark-mode');
    themeToggleIcon.textContent = isDarkOnLoad ? '☀️' : '🌙';
    themeToggleIcon.onclick = handleThemeToggle;
  }
});
