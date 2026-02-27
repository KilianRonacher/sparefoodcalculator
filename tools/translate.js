#!/usr/bin/env node
/**
 * RECIPE TRANSLATION TOOL
 * =======================
 * Consolidated translation tool for all recipe translation needs
 * 
 * Features:
 * - Translate recipe titles (German → English)
 * - Translate recipe steps (German → English)
 * - Translate ingredients (German → English)
 * - Generate bilingual recipe structure (title/title_en, steps/steps_en)
 * 
 * Usage: 
 *   node tools/translate.js                    # Interactive mode
 *   node tools/translate.js --file app.js      # Translate specific file
 *   node tools/translate.js --recipe-id 5      # Translate single recipe
 */

const fs = require('fs');
const path = require('path');

// ==================== TRANSLATION DICTIONARIES ====================

const titleTranslations = {
  // Common recipe title words
  'Salat': 'Salad', 'Suppe': 'Soup', 'Pasta': 'Pasta',
  'mit': 'with', 'und': 'and', 'vom': 'from the', 'im': 'in', 'aus': 'from',
  'Reste-': 'Leftover ', 'Cremige': 'Creamy', 'Warmer': 'Warm',
  'Feines': 'Fine', 'Herzhafte': 'Hearty', 'Klassisch': 'Classic',
  'Gegrillte': 'Grilled', 'Gebratener': 'Fried', 'Gebraten': 'Fried',
  
  // Ingredients in titles
  'Knoblauch': 'Garlic', 'Zitrone': 'Lemon', 'Tomate': 'Tomato', 'Tomaten': 'Tomatoes',
  'Hähnchen': 'Chicken', 'Haehnchen': 'Chicken', 'Schwein': 'Pork',
  'Schweineschnitzel': 'Pork Schnitzel', 'Schweinefilet': 'Pork Tenderloin',
  'Schweinefleisch': 'Pork', 'Rind': 'Beef', 'Rindfleisch': 'Beef',
  'Rindersteak': 'Beef Steak', 'Fisch': 'Fish', 'Lachs': 'Salmon',
  'Lachsfilet': 'Salmon Fillet', 'Forelle': 'Trout', 'Kabeljau': 'Cod',
  'Thunfisch': 'Tuna', 'Pilze': 'Mushrooms', 'Pilz': 'Mushroom',
  'Kartoffel': 'Potato', 'Kartoffeln': 'Potatoes', 'Brokkoli': 'Broccoli',
  'Spinat': 'Spinach', 'Paprika': 'Bell Pepper', 'Zwiebel': 'Onion',
  'Zwiebeln': 'Onions', 'Kräuter': 'Herbs', 'Kräutern': 'Herbs',
  'Kraeutern': 'Herbs', 'Kraeuter': 'Herbs', 'Reis': 'Rice',
  'Curry': 'Curry', 'Pfanne': 'Pan', 'Auflauf': 'Casserole',
  'Eintopf': 'Stew', 'Ragout': 'Ragout', 'Gulasch': 'Goulash',
  'Bolognese': 'Bolognese', 'Risotto': 'Risotto', 'Gnocchi': 'Gnocchi',
  'Frittata': 'Frittata', 'Omelette': 'Omelette', 'Omelett': 'Omelet',
  'Mousse': 'Mousse', 'Kuchen': 'Cake', 'Apfelkuchen': 'Apple Cake',
  'Zitronenkuchen': 'Lemon Cake', 'Puffer': 'Fritters', 'Burger': 'Burger',
  'Pizza': 'Pizza', 'Bruschetta': 'Bruschetta', 'Caprese': 'Caprese',
  'Brot': 'Bread', 'Basilikum': 'Basil', 'Petersilie': 'Parsley',
  'Rosmarin': 'Rosemary', 'Thymian': 'Thyme', 'Oregano': 'Oregano',
  'Dill': 'Dill', 'Sahne': 'Cream', 'Käse': 'Cheese', 'Kaese': 'Cheese',
  'Parmesan': 'Parmesan', 'Mozzarella': 'Mozzarella', 'Feta': 'Feta',
  'Butter': 'Butter', 'Olivenöl': 'Olive Oil', 'Olivenoel': 'Olive Oil',
  'Essig': 'Vinegar', 'Senf': 'Mustard', 'Honig': 'Honey',
  'Sojasauce': 'Soy Sauce', 'Kokosmilch': 'Coconut Milk', 'Limette': 'Lime',
  'Zucchini': 'Zucchini', 'Aubergine': 'Eggplant', 'Auberginen': 'Eggplant',
  'Karotte': 'Carrot', 'Karotten': 'Carrots', 'Gurke': 'Cucumber',
  'Bohnen': 'Beans', 'Linsen': 'Lentils', 'Kichererbsen': 'Chickpeas',
  'Tofu': 'Tofu', 'Gemüse': 'Vegetable', 'Gemuese': 'Vegetable',
  'Quinoa': 'Quinoa', 'Couscous': 'Couscous', 'Spargel': 'Asparagus',
  'Schinken': 'Ham', 'Mais': 'Corn', 'Sellerie': 'Celery',
  'Lauch': 'Leek', 'Kraut': 'Cabbage', 'Weißkraut': 'White Cabbage',
  'Walnüsse': 'Walnuts', 'Mandeln': 'Almonds', 'Pinienkerne': 'Pine Nuts',
  'Sesam': 'Sesame', 'Ingwer': 'Ginger', 'Chili': 'Chili',
  'Pfeffer': 'Pepper', 'Salz': 'Salt', 'Zucker': 'Sugar',
  'Mehl': 'Flour', 'Eier': 'Eggs', 'Ei': 'Egg',
  'Erdbeeren': 'Strawberries', 'Beeren': 'Berries', 'Apfel': 'Apple',
  'Kürbis': 'Pumpkin', 'Kuerbis': 'Pumpkin', 'Schokolade': 'Chocolate',
  'Vanille': 'Vanilla', 'Zimt': 'Cinnamon', 'Muskatnuss': 'Nutmeg',
  'Kompott': 'Compote', 'Pannacotta': 'Panna Cotta', 'Dessert': 'Dessert',
  'Vorspeise': 'Appetizer', 'Vorspeisen': 'Appetizers',
  'Hauptgericht': 'Main Course', 'Beilage': 'Side Dish'
};

const cookingTerms = {
  // Verbs - Preparation
  'schneiden': 'cut', 'würfeln': 'dice', 'hacken': 'chop',
  'reiben': 'grate', 'hobeln': 'slice thinly', 'schälen': 'peel',
  'waschen': 'wash', 'putzen': 'clean', 'trocknen': 'dry',
  'tupfen': 'pat', 'abtropfen': 'drain', 'abgießen': 'drain',
  'pressen': 'press', 'zerreißen': 'tear', 'zerkleinern': 'chop finely',
  
  // Verbs - Cooking methods
  'braten': 'fry', 'anbraten': 'sear', 'frittieren': 'deep-fry',
  'backen': 'bake', 'kochen': 'boil', 'köcheln': 'simmer',
  'dämpfen': 'steam', 'dünsten': 'braise', 'andünsten': 'sauté',
  'anschwitzen': 'sauté', 'schmoren': 'braise', 'grillen': 'grill',
  'rösten': 'roast', 'gratinieren': 'gratinate', 'garen': 'cook',
  'aufkochen': 'bring to boil', 'einkochen': 'reduce',
  'ablöschen': 'deglaze', 'blanchieren': 'blanch', 'schwenken': 'toss',
  
  // Verbs - Mixing
  'mischen': 'mix', 'vermischen': 'mix', 'vermengen': 'combine',
  'durchmischen': 'mix thoroughly', 'rühren': 'stir',
  'einrühren': 'stir in', 'unterrühren': 'fold in', 'unterheben': 'fold in',
  'verrühren': 'stir', 'verquirlen': 'whisk', 'schlagen': 'beat',
  'aufschlagen': 'whip', 'kneten': 'knead', 'formen': 'form',
  
  // Verbs - Seasoning & Finishing
  'würzen': 'season', 'abschmecken': 'taste and adjust seasoning',
  'salzen': 'salt', 'pfeffern': 'pepper', 'garnieren': 'garnish',
  'servieren': 'serve', 'anrichten': 'plate',
  
  // Verbs - Other
  'zugeben': 'add', 'hinzufügen': 'add', 'hinzugeben': 'add',
  'aufgießen': 'pour in', 'eingießen': 'pour in',
  'beträufeln': 'drizzle', 'bestreichen': 'brush',
  'marinieren': 'marinate', 'einlegen': 'marinate',
  'ziehen lassen': 'let stand', 'ruhen lassen': 'let rest',
  'abkühlen': 'cool down', 'erhitzen': 'heat', 'erwärmen': 'warm up',
  'aufheizen': 'heat up', 'schmelzen': 'melt', 'pürieren': 'purée',
  'passieren': 'strain', 'abseihen': 'strain', 'wenden': 'turn',
  'umrühren': 'stir', 'bedecken': 'cover', 'zudecken': 'cover',
  'verteilen': 'distribute', 'auslegen': 'lay out', 'ausrollen': 'roll out',
  'einstreichen': 'spread',
  
  // Common instructions
  'in ca.': 'in approx.', 'ca.': 'approx.', 'etwa': 'about',
  'Minuten': 'minutes', 'Minute': 'minute', 'Stunden': 'hours',
  'Stunde': 'hour', 'Sekunden': 'seconds', 'Sekunde': 'second',
  'bis': 'until', 'wenn': 'when', 'damit': 'so that',
  'falls': 'if', 'optional': 'optional', 'nach Geschmack': 'to taste',
  'nach Belieben': 'as desired', 'je nach': 'depending on',
  'pro': 'per', 'während': 'while', 'danach': 'afterwards',
  'dann': 'then', 'zuerst': 'first', 'zuletzt': 'finally',
  'am Ende': 'at the end', 'zum Schluss': 'at the end',
  
  // Measurements & states
  'goldbraun': 'golden brown', 'dunkelbraun': 'dark brown',
  'hellbraun': 'light brown', 'glasig': 'translucent',
  'weich': 'soft', 'zart': 'tender', 'gar': 'done',
  'durchgegart': 'cooked through', 'al dente': 'al dente',
  'cremig': 'creamy', 'knusprig': 'crispy', 'flockig': 'flaky',
  'undurchsichtig': 'opaque', 'rosa': 'pink', 'heiß': 'hot',
  'warm': 'warm', 'kalt': 'cold', 'klein': 'small',
  'groß': 'large', 'fein': 'fine', 'grob': 'coarse',
  'dünn': 'thin', 'dick': 'thick',
  
  // Kitchen equipment
  'Pfanne': 'pan', 'Topf': 'pot', 'Wok': 'wok',
  'Ofen': 'oven', 'Grill': 'grill', 'Backblech': 'baking sheet',
  'Auflaufform': 'baking dish', 'Schüssel': 'bowl', 'Teller': 'plate',
  'Mixer': 'blender', 'Stabmixer': 'immersion blender',
  'Fleischklopfer': 'meat mallet', 'Messer': 'knife',
  'Löffel': 'spoon', 'Gabel': 'fork', 'Schneebesen': 'whisk',
  'Sieb': 'strainer', 'Reibe': 'grater',
  
  // Prepositions & common words
  'bei': 'at', 'auf': 'on', 'in': 'in', 'mit': 'with',
  'ohne': 'without', 'von': 'from', 'zu': 'to', 'für': 'for',
  'als': 'as', 'oder': 'or', 'über': 'over', 'unter': 'under',
  'zwischen': 'between'
};

const ingredientTranslations = {
  // Fish & Seafood
  'fisch': 'fish', 'lachs': 'salmon', 'forelle': 'trout',
  'kabeljau': 'cod', 'lachsfilet': 'salmon fillet', 'thunfisch': 'tuna',
  'garnelen': 'shrimp', 'scampi': 'scampi', 'muscheln': 'mussels',
  
  // Meat
  'rindfleisch': 'beef', 'schweinefleisch': 'pork', 'hähnchen': 'chicken',
  'haehnchen': 'chicken', 'schwein': 'pork', 'rind': 'beef',
  'lamm': 'lamb', 'kalb': 'veal', 'schweinefilet': 'pork fillet',
  'schweineschnitzel': 'pork cutlet', 'hähnchenbrust': 'chicken breast',
  'speck': 'bacon', 'schinken': 'ham',
  
  // Vegetables
  'paprika': 'bell pepper', 'tomate': 'tomato', 'zwiebel': 'onion',
  'knoblauch': 'garlic', 'zucchini': 'zucchini', 'karotte': 'carrot',
  'salat': 'salad', 'spinat': 'spinach', 'brokkoli': 'broccoli',
  'bohnen': 'beans', 'erbsen': 'peas', 'mais': 'corn',
  'kichererbsen': 'chickpeas', 'linsen': 'lentils', 'aubergine': 'eggplant',
  'lauch': 'leek', 'kraut': 'cabbage', 'sellerie': 'celery',
  'spargel': 'asparagus', 'gurke': 'cucumber', 'kürbis': 'pumpkin',
  'pilze': 'mushrooms', 'champignons': 'mushrooms',
  
  // Dairy & Eggs
  'butter': 'butter', 'sahne': 'cream', 'käse': 'cheese',
  'parmesan': 'parmesan', 'ricotta': 'ricotta', 'mozzarella': 'mozzarella',
  'feta': 'feta', 'frischkäse': 'cream cheese', 'milch': 'milk',
  'joghurt': 'yogurt', 'eier': 'eggs', 'eigelb': 'egg yolk',
  
  // Pantry & Seasonings
  'salz': 'salt', 'pfeffer': 'pepper', 'olivenöl': 'olive oil',
  'olivenoel': 'olive oil', 'oel': 'oil', 'öl': 'oil',
  'sesamöl': 'sesame oil', 'sojasauce': 'soy sauce', 'essig': 'vinegar',
  'honig': 'honey', 'senf': 'mustard', 'zitrone': 'lemon',
  'limette': 'lime', 'zitronensaft': 'lemon juice',
  
  // Herbs & Spices
  'basilikum': 'basil', 'oregano': 'oregano', 'thymian': 'thyme',
  'rosmarin': 'rosemary', 'petersilie': 'parsley', 'dill': 'dill',
  'schnittlauch': 'chives', 'koriander': 'cilantro', 'minze': 'mint',
  'salbei': 'sage', 'curry': 'curry', 'paprikapulver': 'paprika powder',
  'chili': 'chili', 'cayenne': 'cayenne', 'kurkuma': 'turmeric',
  'kreuzkümmel': 'cumin', 'zimt': 'cinnamon', 'muskat': 'nutmeg',
  'ingwer': 'ginger', 'vanille': 'vanilla',
  
  // Carbs & Grains
  'brot': 'bread', 'reis': 'rice', 'pasta': 'pasta', 'nudeln': 'pasta',
  'kartoffeln': 'potatoes', 'kartoffel': 'potato', 'mehl': 'flour',
  'couscous': 'couscous', 'quinoa': 'quinoa', 'bulgur': 'bulgur',
  'polenta': 'polenta', 'gnocchi': 'gnocchi',
  
  // Other
  'wasser': 'water', 'brühe': 'broth', 'wein': 'wine',
  'zucker': 'sugar', 'schokolade': 'chocolate', 'nüsse': 'nuts',
  'mandeln': 'almonds', 'walnüsse': 'walnuts', 'pinienkerne': 'pine nuts',
  'tomatenmark': 'tomato paste', 'kokosmilch': 'coconut milk'
};

// ==================== TRANSLATION FUNCTIONS ====================

function translateTitle(germanTitle) {
  if (!germanTitle) return '';
  
  let english = germanTitle;
  
  // Apply all title translations
  for (const [german, englishWord] of Object.entries(titleTranslations)) {
    const regex = new RegExp(german, 'gi');
    english = english.replace(regex, englishWord);
  }
  
  return english;
}

function translateStep(germanStep) {
  if (!germanStep) return '';
  
  let english = germanStep;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = Object.entries(cookingTerms)
    .sort((a, b) => b[0].length - a[0].length);
  
  // Apply all cooking term translations
  for (const [german, englishWord] of sortedTerms) {
    const regex = new RegExp(`\\b${german}\\b`, 'gi');
    english = english.replace(regex, englishWord);
  }
  
  return english;
}

function translateSteps(germanSteps) {
  if (!Array.isArray(germanSteps)) return [];
  return germanSteps.map(step => translateStep(step));
}

function translateIngredient(germanIngredient) {
  if (!germanIngredient) return '';
  
  const normalized = germanIngredient.toLowerCase().trim();
  
  // Try exact match first
  if (ingredientTranslations[normalized]) {
    return ingredientTranslations[normalized];
  }
  
  // Try partial matches
  for (const [german, english] of Object.entries(ingredientTranslations)) {
    if (normalized.includes(german)) {
      return english;
    }
  }
  
  // Return original if no translation found
  return germanIngredient;
}

function translateIngredients(germanIngredients) {
  if (!Array.isArray(germanIngredients)) return [];
  return germanIngredients.map(ing => translateIngredient(ing));
}

// ==================== MAIN FUNCTIONALITY ====================

function translateRecipe(recipe) {
  const translated = { ...recipe };
  
  if (recipe.title && !recipe.title_en) {
    translated.title_en = translateTitle(recipe.title);
  }
  
  if (recipe.steps && !recipe.steps_en) {
    translated.steps_en = translateSteps(recipe.steps);
  }
  
  if (recipe.ingredients && !recipe.ingredients_en) {
    translated.ingredients_en = translateIngredients(recipe.ingredients);
  }
  
  return translated;
}

function processFile(filePath) {
  console.log(`\n📖 Reading file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract recipes array
  const recipesMatch = content.match(/const recipes = \[([\s\S]*?)\];/);
  if (!recipesMatch) {
    console.error('❌ Could not find recipes array in file');
    process.exit(1);
  }
  
  console.log('✅ Found recipes array');
  console.log('⚙️  Parsing recipes...');
  
  // This is a simplified parser - for production use a proper JS parser
  const recipesText = recipesMatch[1];
  const recipes = eval(`[${recipesText}]`);
  
  console.log(`✅ Parsed ${recipes.length} recipes`);
  console.log('🔄 Translating...\n');
  
  let translated = 0;
  const translatedRecipes = recipes.map((recipe, index) => {
    const result = translateRecipe(recipe);
    if (result.title_en || result.steps_en) {
      translated++;
      if (translated <= 5) {
        console.log(`  ${recipe.id}: ${recipe.title}`);
        console.log(`       → ${result.title_en}\n`);
      }
    }
    return result;
  });
  
  console.log(`\n✅ Translation complete!`);
  console.log(`   Recipes processed: ${recipes.length}`);
  console.log(`   New translations: ${translated}`);
  
  // Output to new file
  const outputPath = filePath.replace('.js', '_bilingual.js');
  const output = `const recipes = ${JSON.stringify(translatedRecipes, null, 2)};\n\nmodule.exports = recipes;`;
  fs.writeFileSync(outputPath, output, 'utf8');
  
  console.log(`\n💾 Saved to: ${outputPath}`);
}

// ==================== CLI ====================

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         RECIPE TRANSLATION TOOL                            ║
║         Bilingual Recipe Structure Generator               ║
╚════════════════════════════════════════════════════════════╝

Usage:
  node tools/translate.js --file <path>     Translate file
  node tools/translate.js --help            Show this help

Examples:
  node tools/translate.js --file app.js
  node tools/translate.js --file recipes-Translation.js
    `);
    process.exit(0);
  }
  
  const fileIndex = args.indexOf('--file');
  if (fileIndex !== -1 && args[fileIndex + 1]) {
    const filePath = args[fileIndex + 1];
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    processFile(filePath);
  } else if (args.includes('--help')) {
    console.log('See usage above');
  } else {
    console.error('❌ Invalid arguments. Use --help for usage.');
    process.exit(1);
  }
}

module.exports = {
  translateTitle,
  translateStep,
  translateSteps,
  translateIngredient,
  translateIngredients,
  translateRecipe
};
