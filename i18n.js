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
  
  let text;
  if (isDarkMode) {
    text = (currentLang === 'de') ? 'Hell-Modus' : 'Light Mode';
    themeToggleButton.textContent = '☀️ ' + text;
  } else {
    text = (currentLang === 'de') ? 'Dunkel-Modus' : 'Dark Mode';
    themeToggleButton.textContent = '🌙 ' + text;
  }
  console.log('Theme button updated:', themeToggleButton.textContent);
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
  'rezepte_finden': 'Rezepte finden',

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
  'ing_find_recipes_btn': '🍳 Rezepte finden',

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
  'partial_badge': 'Teilweise'
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
  'rezepte_finden': 'Find recipes',

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
  'ing_find_recipes_btn': '🍳 Find Recipes',

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
  'partial_badge': 'Partial'
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
  'quark': 'quark/topfen',
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
  'apfel': 'apple',
  'zitrone': 'lemon',
  'limette': 'lime',
  'erdbeeren': 'strawberries',
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
  'limettensaft': 'lime juice'
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
  const storedLanguage = localStorage.getItem('sfc_lang');
  return storedLanguage ? storedLanguage : 'de';
}

/**
 * Activate a specified language
 * Updates all DOM elements with translations
 * Persists selection to localStorage
 */
function setLang(targetLanguage) {
  localStorage.setItem('sfc_lang', targetLanguage);
  
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
  const currentTheme = localStorage.getItem('theme') || 'light';
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
  
  // Setup theme toggle button event listener - simple direct approach
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeButton();
      return false;
    };
  }
});
