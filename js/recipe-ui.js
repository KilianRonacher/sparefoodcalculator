/**
 * SpareFoodCalculator — Recipe UI
 * Extracted from old recipes.js: ingredient matching, modal, display functions.
 */
function ingredientMatches(userSelected, recipeIngredient) {
  if (!userSelected || !recipeIngredient) return false;
  // Reason: the old letter-by-letter fallback made "Lauch" match "Knoblauch".
  // search.js compares whole words, knows synonyms and English names.
  if (typeof ingredientsMatch === 'function') return ingredientsMatch(userSelected, recipeIngredient);
  return userSelected.toLowerCase().trim() === recipeIngredient.toLowerCase().trim();
}
/**
 * Auto-translate German cooking text to English
 */
function autoTranslateGermanText(text) {
  if (!text) return text;
  
  const translations = {
    // === EXACT RECIPE TITLE MATCHES (checked first) ===
    'Feines Pilz-Risotto (inspiriert)': 'Fine Mushroom Risotto (inspired)',
    'Herzhafte Rinderragout': 'Hearty Beef Ragout',
    'Rindersteak mit Fleur de Sel': 'Beef Steak with Fleur de Sel',
    'Rinder-Gulasch': 'Beef Goulash',
    'Lamm mit Knoblauch und Rosmarin': 'Lamb with Garlic and Rosemary',
    'Haehnchen mit Paprika und Oregano': 'Chicken with Bell Pepper and Oregano',
    'Rindfleisch-Eintopf': 'Beef Stew',
    'Schweineschnitzel klassisch': 'Classic Pork Schnitzel',
    'Schweinefilet mit Rosmarin': 'Pork Fillet with Rosemary',
    'Schweinefleisch-Ragout': 'Pork Ragout',
    'Gegrillte Schweinerippen': 'Grilled Pork Ribs',
    'Schweinefaschiertes-Pfanne mit Paprika': 'Ground Pork Pan with Bell Pepper',
    'Knoblauch-hähnchen mit Zitrone': 'Garlic Chicken with Lemon',
    'hähnchen-Curry': 'Chicken Curry',
    'Gegrillte hähnchenkeule': 'Grilled Chicken Leg',
    'hähnchen mit Pilzen': 'Chicken with Mushrooms',
    'hähnchen-Pfanne mit Paprika': 'Chicken Pan with Bell Peppers',
    'hähnchen-Eintopf': 'Chicken Stew',
    'Fisch aus der Pfanne mit kräuterkruste': 'Pan-Fried Fish with Herb Crust',
    'Citrus-Mariniertes Lachsfilet': 'Citrus-Marinated Salmon Fillet',
    'Forelle im Ofen mit Kraeutern': 'Oven-Baked Trout with Herbs',
    'Gebratener Lachs mit Knoblauch': 'Pan-Fried Salmon with Garlic',
    'Fisch im Ofen mit Gemuese': 'Oven-Baked Fish with Vegetables',
    'Lachsfilet mit Basilikum-Pesto': 'Salmon Fillet with Basil Pesto',
    'Forelle mit Mandeln und Zitrone': 'Trout with Almonds and Lemon',
    'Kabeljau mit Sojasauce': 'Cod with Soy Sauce',
    'Tomaten-Pasta': 'Tomato Pasta',
    'Pasta Aglio e Olio': 'Pasta Aglio e Olio',
    
    // === COMPOUND RECIPE NAME PARTS ===
    'Rinderragout': 'beef ragout', 'Rindfleisch-Eintopf': 'beef stew', 'Rinder-Gulasch': 'beef goulash',
    'Schweineschnitzel': 'pork schnitzel', 'Schweinefilet': 'pork fillet', 'Schweinerippen': 'pork ribs',
    'Schweinefleisch-Ragout': 'pork ragout', 'Schweinefaschiertes': 'ground pork',
    'hähnchenkeule': 'chicken leg', 'hähnchen-Curry': 'chicken curry', 'hähnchen-Eintopf': 'chicken stew',
    'hähnchen-Pfanne': 'chicken pan', 'hähnchenfilet': 'chicken fillet',
    'Lachsfilet': 'salmon fillet', 'Kabeljau': 'cod', 'Forelle': 'trout',
    'kräuterkruste': 'herb crust', 'Basilikum-Pesto': 'basil pesto',
    'Pilz-Risotto': 'mushroom risotto', 'Tomaten-Pasta': 'tomato pasta',
    
    // === RECIPE NAME PATTERNS ===
    'aus der Pfanne': 'pan-fried', 'im Ofen': 'oven-baked', 'im Wok': 'wok-fried',
    'mit Kräutern': 'with herbs', 'mit Knoblauch': 'with garlic', 'mit Zitrone': 'with lemon',
    'mit Paprika': 'with bell pepper', 'mit Rosmarin': 'with rosemary', 'mit Oregano': 'with oregano',
    'klassisch': 'classic', 'Gegrillt': 'grilled', 'Gegrillte': 'grilled', 'Mariniert': 'marinated',
    'Mariniertes': 'marinated', 'Gebraten': 'fried', 'Gebratener': 'fried', 'Gebratene': 'fried',
    'Feines': 'fine', 'Herzhafte': 'hearty', 'Herzhaftes': 'hearty',
    
    // === COOKING VERBS & ACTIONS (Professional culinary terms) ===
    'fein gehackte kräuter': 'finely chopped herbs', 'gehackte Zwiebel': 'chopped onion', 
    'gehackten Knoblauch': 'chopped garlic', 'gehackter Knoblauch': 'chopped garlic',
    'gehackte Zwiebeln': 'chopped onions', 'Gehackte Zwiebel': 'Chopped onion',
    'frische kräuter': 'fresh herbs', 'frischer Petersilie': 'fresh parsley', 'frischen Kräutern': 'fresh herbs',
    'frischem Thymian': 'fresh thyme', 'frischen Rosmarin': 'fresh rosemary', 'frische Rosmarinstiele': 'fresh rosemary sprigs',
    'frisch gemahlenem Pfeffer': 'freshly ground pepper', 'frisch gemahlenem Pfeffer': 'freshly ground pepper',
    'portionsweise': 'in batches', 'mundgerechte Stücke': 'bite-sized pieces', 'mundgerechte Würfel': 'bite-sized cubes',
    'mundgerechte, gleichmäßige Stücke': 'bite-sized, even pieces',
    'große Würfel': 'large cubes', 'kleine Würfel': 'small cubes', 'halbe Ringe': 'half rings',
    'dünne Scheiben': 'thin slices', 'dicke Scheiben': 'thick slices', 'breite Ringe': 'wide rings',
    'gleichgroße Würfel': 'evenly sized cubes', 'nicht zu kleine Würfel': 'not too small cubes',
    'trockentupfen': 'pat dry', 'trocken tupfen': 'pat dry', 'putzen': 'clean', 'trockene Oberfläche': 'dry surface',
    'entkernen': 'remove seeds', 'befreien': 'remove', 'auslegen': 'arrange', 'ausnehmen': 'clean out',
    'schneiden und': 'cut and', 'schneiden,': 'cut,', 'schneiden': 'cut', 'Würfeln': 'dice', 
    'hacken': 'chop', 'fein hacken': 'finely chop', 'grob hacken': 'coarsely chop',
    'schälen': 'peel', 'waschen': 'wash', 'trocknen': 'dry', 'tupfen': 'pat', 
    'abtropfen lassen': 'drain', 'abtropfen': 'drain', 'abgießen': 'drain off', 'abschütteln': 'shake off',
    'pressen': 'press', 'reiben': 'grate', 'hobeln': 'shave', 'vermischen': 'mix', 'gut vermischen': 'mix well',
    'vermengen': 'combine', 'verrühren': 'stir', 'verquirlen': 'whisk', 'rühren': 'stir', 
    'mischen': 'mix', 'durchmischen': 'mix thoroughly',
    'anbraten bis': 'sear until', 'anbraten': 'sear', 'braten bis': 'fry until', 'braten': 'fry', 
    'einbraten': 'brown', 'scharf anbraten': 'sear over high heat',
    'braun anbraten': 'brown', 'goldbraun braten': 'fry until golden brown',
    'rösten bis': 'roast until', 'rösten': 'roast', 'mitrösten': 'roast along with', 
    'sanft rösten': 'gently roast', 'kurz rösten': 'briefly roast', 'leicht rösten': 'lightly roast',
    'grillen': 'grill', 'backen': 'bake', 'kochen': 'cook', 
    'köcheln lassen': 'let simmer', 'köcheln': 'simmer', 'einköcheln': 'reduce', 
    'einkochen': 'reduce', 'kräftig einkochen': 'vigorously reduce',
    'sanft köcheln': 'gently simmer', 'leicht köchelnd': 'at a gentle simmer',
    'garen bis': 'cook until', 'garen': 'cook', 'mitgaren': 'cook along with', 'mitdünsten': 'steam along with',
    'indirekt garen': 'cook indirectly', 'durchgaren': 'cook through',
    'dünsten': 'steam', 'andünsten': 'sauté lightly', 'anschwitzen': 'sweat', 'blanchieren': 'blanch',
    'frittieren': 'deep-fry', 'würzen mit': 'season with', 'würzen': 'season', 
    'abschmecken': 'adjust seasoning', 'marinieren': 'marinate', 'marinieren lassen': 'let marinate',
    'ziehen lassen': 'let stand', 'ruhen lassen': 'let rest', 'abkühlen lassen': 'let cool', 
    'abkühlen': 'cool', 'erwürmen': 'warm', 'aufsteigen': 'rise',
    'erhitzen': 'heat', 'vorheizen': 'preheat', 'vorgeheizt': 'preheated', 'vorgeheizten': 'preheated',
    'vorgewürmt': 'prewarmed', 'vorgewärmtem': 'prewarmed',
    'aufheizen': 'heat up', 'schmelzen lassen': 'melt', 'schmelzen': 'melt', 
    'aufkochen': 'bring to a boil', 'zum Kochen bringen': 'bring to a boil',
    'aufgießen bis': 'pour broth until', 'aufgießen': 'pour liquid over', 
    'ablöschen und': 'deglaze and', 'ablöschen': 'deglaze', 
    'einrühren': 'stir in', 'unterrühren': 'stir in', 'unterheben': 'fold in', 
    'zugeben und': 'add and', 'zugeben': 'add', 'dazugeben': 'add',
    'hinzufügen': 'add', 'hinzugeben': 'add', 'zurückgeben': 'return', 'zurück': 'back',
    'verteilen': 'distribute', 'bestreuen': 'sprinkle', 'beträufeln': 'drizzle', 
    'bestreichenen': 'spread', 'bestreichen': 'spread',
    'garnieren': 'garnish', 'servieren': 'serve', 'anrichten': 'plate', 'teilen': 'divide',
    'wenden': 'turn', 'wenden und': 'turn and', 'drehen': 'turn', 'klopfen': 'pound', 'flach klopfen': 'pound flat',
    'durchgegart': 'cooked through', 'durchgegart is': 'is cooked through', 'durchgegart ist': 'is cooked through',
    'herausnehmen': 'remove', 'herausheben': 'remove', 'nehmen': 'take',
    'legen': 'place', 'füllen': 'fill', 'gießen': 'pour', 'ölen': 'oil', 'adhäriert': 'adheres',
    'einreiben': 'rub in', 'eindicken': 'thicken', 'reduzieren': 'reduce',
    'bedeckt': 'covered', 'zugedeckt': 'covered', 'bedeckt ist': 'is covered', 'knapp bedeckt': 'just covered',
    'offen köcheln': 'simmer uncovered', 'Deckel auflegen': 'cover with lid',
    'leicht köchelnd': 'at a gentle simmer', 'bei kaum bewegendem köcheln': 'at barely a simmer',
    'bei leicht köchelnder Hitze': 'at gently simmering heat',
    'einsaugt': 'absorbs', 'freisetzt': 'releases', 'Stärke freisetzt': 'releases starch',
    'aufsteigt': 'rises', 'verbrennt': 'burns', 'bräunt': 'browns',
    'zehen lassen': 'let cook', 'einzieht': 'is absorbed', 'verteilen können': 'can distribute',
    'sich verteilt': 'is distributed', 'sich verbinden': 'combine',
    
    // === TIME, MEASUREMENTS & STATES (Professional culinary terminology) ===
    'ca.': 'approx.', 'etwa': 'about', 'Minuten': 'minutes', 'Minute': 'minute', 'Stunden': 'hours', 'Stunde': 'hour',
    'Sekunden': 'seconds', 'max. 30 Sekunden': 'max. 30 seconds',
    'Mindestens': 'at least', 'mindestens': 'at least', 'maximal': 'maximum', 'max.': 'max.',
    'je nach': 'depending on', 'bis zu': 'up to', 'pro': 'per', 'für': 'for',
    'gegen Ende': 'towards the end', 'am Ende': 'at the end', 'erst am Ende': 'only at the end',
    'zum Schluss': 'at the end', 'final': 'finally',
    'bis goldbraun': 'until golden brown', 'bis dunkelbraun': 'until dark brown', 'bis hellbraun': 'until light brown',
    'bis hellgolden': 'until light golden', 'bis glänzend dunkelbraun': 'until glossy dark brown',
    'bis gar': 'until done', 'bis weich': 'until soft', 'bis zart': 'until tender', 
    'bis sehr zart': 'until very tender', 'bis cremig': 'until creamy', 'bis knusprig': 'until crispy', 
    'bis außen braun': 'until browned on the outside', 'bis die Oberfläche': 'until the surface',
    'anfängt zu bräunen': 'starts to brown', 'gerade anfängt zu bräunen': 'just starts to brown',
    'bis kein Rosa mehr': 'until no pink remains', 'bis ganz durch': 'until cooked through',
    'goldbraun': 'golden brown', 'dunkelbraun': 'dark brown', 'hellbraun': 'light brown', 
    'hellgolden': 'light golden', 'glänzend': 'glossy',
    'glasig': 'translucent', 'weich': 'soft', 'zart': 'tender', 'gar': 'done', 'gar ist': 'is done',
    'al dente': 'al dente', 'cremig': 'creamy', 'knusprig': 'crispy', 'undurchsichtig': 'opaque',
    'ganz weiß': 'completely white', 'ganz durch': 'completely cooked through', 
    'ganz durch ist': 'is completely cooked', 'kein Rosa': 'no pink',
    'sehr zart': 'very tender', 'schön weich': 'nicely soft', 'soft': 'soft',
    '2–3 Minuten': '2-3 minutes', '3–4 Minuten': '3-4 minutes', '4–5 Minuten': '4-5 minutes',
    '3–5 Minuten': '3-5 minutes', '10–12 Minuten': '10-12 minutes', '12–15 Minuten': '12-15 minutes',
    '15–20 Minuten': '15-20 minutes', '18ß20 Minuten': '18-20 minutes', '35–40 Minuten': '35-40 minutes',
    '35ß45 Minuten': '35-45 minutes', '40–50 Minuten': '40-50 minutes', '45–60 Minuten': '45-60 minutes',
    '1–1,5 Stunden': '1-1.5 hours', '1,5–2 Stunden': '1.5-2 hours',
    '3–4 cm': '3-4 cm', '3-4cm': '3-4 cm', '1,5 cm': '1.5 cm', '5 mm': '5 mm',
    '100ml': '100ml', '300g': '300g', '4 Personen': '4 servings',
    '180 Grad C': '180 Grad C (350üf)', '160 Grad C': '160 Grad C (320üf)', '200 Grad C': '200 Grad C (400üf)',
    '160  Grad C': '160 Grad C (320üf)', '180  Grad C': '180 Grad C (350üf)', '200  Grad C': '200 Grad C (400üf)',
    '63–65  Grad C': '63-65 Grad C (145-150üf)',
    'über Nacht': 'overnight', 'währenddem': 'meanwhile', 'währenddem': 'Meanwhile',
    
    // === COMMON COOKING PHRASES (Natural English expressions) ===
    'in heißem öl': 'in hot oil', 'in sehr heißem öl': 'in very hot oil',
    'in Butter': 'in butter', 'in heißer Butter': 'in hot butter', 'mit Butter': 'with butter',
    'in einer Pfanne': 'in a pan', 'in einer Schüssel': 'in a bowl', 'in eine Schüssel': 'into a bowl',
    'im selben Topf': 'in the same pot', 'in der gleichen Pfanne': 'in the same pan',
    'in einem breiten Topf': 'in a wide pot', 'in einer trockenen Pfanne': 'in a dry pan',
    'in ausreichend heißem öl': 'in sufficiently hot oil',
    'bei hoher Hitze': 'over high heat', 'bei mittlerer Hitze': 'over medium heat', 
    'bei niedriger Hitze': 'over low heat', 'bei mittler Hitze': 'over medium heat',
    'auf hoher Hitze': 'on high heat', 'auf mittlerer Höhe': 'at medium height', 
    'auf kleiner Flamme': 'over low flame', 'auf kleine Flamme': 'to low heat',
    'auf niedrige Hitze': 'to low heat', 'auf klein': 'to low', 'auf starke kleine Flamme': 'to low heat',
    'ohne Farbe': 'without browning', 'ohne zu verbrennen': 'without burning',
    'von allen Seiten': 'on all sides', 'von jeder Seite': 'on each side', 'von beiden Seiten': 'on both sides',
    'pro Seite': 'per side', 'je Seite': 'per side',
    'unter rühren': 'while stirring', 'unter ständigem rühren': 'while constantly stirring', 
    'ständig rühren': 'stir constantly', 'dabei ständig rühren': 'stir constantly while doing so',
    'gut rühren': 'stir well', 'sofort rühren': 'stir immediately',
    'mit Salz und Pfeffer': 'with salt and pepper', 'mit Salz': 'with salt', 
    'mit Pfeffer': 'with pepper', 'mit schwarzem Pfeffer': 'with black pepper',
    'nach Geschmack': 'to taste', 'nach Packungsangabe': 'according to package directions', 
    'nach Packung': 'according to package',
    'zum Kochen bringen': 'bring to a boil', 'zuerst': 'first', 'Zuerst': 'First',
    'dann': 'then', 'Dann': 'Then', 'danach': 'afterwards', 'als': 'as',
    'beiseite stellen': 'set aside', 'beiseite legen': 'set aside', 'beiseite': 'aside',
    'im Kühlschrank': 'in the refrigerator', 'Kühlschrank': 'refrigerator', 
    'bei Zimmertemperatur': 'at room temperature', 'Zimmertemperatur': 'room temperature', 
    'lagern': 'store', 'aufbewahren': 'keep',
    'aus dem Kühlschrank nehmen': 'remove from the refrigerator',
    'Fischbauchhöhle': 'fish cavity', 'Oberfläche': 'surface', 'Haut': 'skin', 
    'Haut nach unten': 'skin side down', 'auf die andere Seite': 'to the other side',
    'Scheiben': 'slices', 'Ringe': 'rings', 'Würfel': 'cubes', 'Stücke': 'pieces', 'Portionen': 'portions',
    'Schüssel': 'bowl', 'Teller': 'plate', 'tiefen Teller': 'deep plate', 'anderem Teller': 'another plate',
    'Pfanne': 'pan', 'Topf': 'pot',
    'extrem heiß': 'extremely hot', 'sehr heiß': 'very hot', 'ausreichend': 'sufficient',
    'kräftig': 'vigorously', 'leicht': 'lightly', 'grosszügig': 'generously', 'grosszügig': 'generously',
    'reichlich': 'plenty of', 'etwas': 'some', 'wenig': 'little', 'mehr': 'more',
    'überschüssiges': 'excess', 'überschßssig': 'excess', 'überschüssiges Ei': 'excess egg',
    'damit ': 'so that ', 'falls ': 'if ', 'wenn ': 'when ', 'je nach ': 'depending on ',
    'gleichmäßig': 'evenly', 'gleichmäßiges': 'even', 'gleichmäßig bräunt': 'browns evenly',
    'gut': 'well', 'sofort': 'immediately', 'Sofort': 'Immediately', 'kurz': 'briefly',
    'komplett': 'completely', 'zuerst komplett': 'first completely',
    'vor dem Servieren': 'before serving', 'warm servieren': 'serve warm', 
    'heiß servieren': 'serve hot', 'Warm servieren': 'Serve warm', 'Heiß': 'Hot',
    'warm zu': 'warm with', 'Warm zu': 'Serve warm with',
    '(falls nötig)': '(if necessary)', 'falls nötig': 'if necessary', 'ggf.': 'if necessary',
    'optional': 'optional', 'Optional': 'optional',
    'wichtig für': 'important for', 'ist wichtig': 'is important',
    '(z.B. Schulter)': '(e.g., shoulder)', 'z.B.': 'e.g.,',
    'nicht zu kleine': 'not too small', 'nicht verbrennt': 'doesn\'t burn',
    'ohne Farbe': 'without browning', 'ohne zu verbrennen': 'without burning',
    'von allen Seiten': 'on all sides', 'von jeder Seite': 'on each side', 'von beiden Seiten': 'on both sides',
    'pro Seite': 'per side',
    'unter rühren': 'while stirring', 'unter ständigem rühren': 'while constantly stirring', 'ständig rühren': 'stir constantly',
    'mit Salz und Pfeffer': 'with salt and pepper', 'mit Salz': 'with salt', 'mit Pfeffer': 'with pepper',
    'nach Geschmack': 'to taste', 'nach Packungsangabe': 'according to package instructions', 'nach Packung': 'according to package',
    'zum Kochen bringen': 'bring to boil', 'zum Schluss': 'at the end', 'am Ende': 'at the end', 'zuerst': 'first',
    'dann': 'then', 'danach': 'afterwards', 'währenddem': 'meanwhile', 'beiseite stellen': 'set aside', 'beiseite legen': 'set aside',
    'herausnehmen': 'remove', 'herausheben': 'remove', 'zurückgeben': 'return', 'zurück': 'back',
    'Fischbauchhöhle': 'fish cavity', 'im Kühlschrank': 'in the refrigerator', 'Kühlschrank': 'refrigerator',
    'bei Zimmertemperatur': 'at room temperature', 'Zimmertemperatur': 'room temperature',
    'extrem heiß': 'extremely hot', 'sehr heiß': 'very hot', 'Heiß': 'hot',
    'reichlich': 'plenty of', 'grosszügig': 'generously', 'grosszügig': 'generously',
    'gleichmäßig': 'evenly', 'sofort': 'immediately', 'kurz': 'briefly',
    'vor dem Servieren': 'before serving', 'warm servieren': 'serve warm',
    
    // Fish & Seafood (expanded)
    'Fischfilets': 'fish fillets', 'Fischfilet': 'fish fillet', 'Fisch': 'fish', 'fisch': 'fish',
    'Lachsfilets': 'salmon fillets', 'Lachsfilet': 'salmon fillet', 'Lachs': 'salmon', 'lachs': 'salmon',
    'Forelle': 'trout', 'forelle': 'trout', 'Forellen': 'trout',
    'Dorade': 'sea bream', 'dorade': 'sea bream',
    'Kabeljau': 'cod', 'kabeljau': 'cod', 'Kabeljau-Filets': 'cod fillets',
    'Thunfisch': 'tuna', 'thunfisch': 'tuna',
    'Scholle': 'plaice', 'scholle': 'plaice', 
    'Garnelen': 'shrimp', 'garnelen': 'shrimp',
    'Muscheln': 'mussels', 'muscheln': 'mussels', 
    'Tintenfisch': 'squid', 'tintenfisch': 'squid',
    
    // Meat & Poultry (comprehensive)
    'Rindfleisch': 'beef', 'rindfleisch': 'beef', 'Rindersteak': 'beef steak', 'rindersteak': 'beef steak',
    'Schweinefleisch': 'pork', 'schweinefleisch': 'pork', 'Schweinefilet': 'pork fillet', 'schweinefilet': 'pork fillet',
    'Schweinerippen': 'pork ribs', 'schweinerippen': 'pork ribs', 'Schweinschnitzel': 'pork schnitzel',
    'hähnchen': 'chicken', 'hähnchen': 'chicken', 'Haehnchen': 'chicken', 'haehnchen': 'chicken', 
    'hähnchenfilet': 'chicken fillet', 'hähnchenfilet': 'chicken fillet',
    'hähnchenbrust': 'chicken breast', 'hähnchenbrust': 'chicken breast', 
    'hähnchenstücke': 'chicken pieces', 'hähnchenstücke': 'chicken pieces',
    'hähnchenwürfel': 'chicken cubes', 'hähnchenwürfel': 'chicken cubes',
    'hähnchenkeule': 'chicken leg', 'hähnchenkeule': 'chicken leg',
    'Poulet': 'chicken', 'poulet': 'chicken', 
    'Lamm': 'lamb', 'lamm': 'lamb', 'Lammfleisch': 'lamb meat', 'lammfleisch': 'lamb meat',
    'Ente': 'duck', 'ente': 'duck', 'Gans': 'goose', 'gans': 'goose', 
    'Fleisch': 'meat', 'fleisch': 'meat', 'Fleischsäfte': 'meat juices',
    'Hackfleisch': 'ground meat', 'hackfleisch': 'ground meat', 
    'Rinderhack': 'ground beef', 'rinderhack': 'ground beef',
    'Schweinefaschiertes': 'ground pork', 'schweinefaschiertes': 'ground pork',
    'Faschiertes': 'ground meat', 'faschiertes': 'ground meat',
    'Steak': 'steak', 'steak': 'steak', 'Filet': 'fillet', 'filet': 'fillet',
    'Kotelett': 'cutlet', 'kotelett': 'cutlet', 'Schnitzel': 'schnitzel', 'schnitzel': 'schnitzel',
    
    // Vegetables
    'olivenöl': 'olive oil', 'Butter': 'butter', 'Salz und Pfeffer': 'salt and pepper', 'Salz': 'salt', 'Pfeffer': 'pepper',
    'Knoblauch': 'garlic', 'Zwiebel': 'onion', 'Zwiebeln': 'onions', 'Tomaten': 'tomatoes', 'Tomate': 'tomato',
    'Kartoffeln': 'potatoes', 'Kartoffel': 'potato', 'Karotten': 'carrots', 'Karotte': 'carrot', 'Paprika': 'bell pepper',
    'Zucchini': 'zucchini', 'Brokkoli': 'broccoli', 'Spinat': 'spinach', 'Pilze': 'mushrooms', 'Pilz': 'mushroom',
    'Aubergine': 'eggplant', 'aubergine': 'eggplant', 'Kürbis': 'pumpkin', 'kürbis': 'pumpkin',
    'Sellerie': 'celery', 'sellerie': 'celery', 'Lauch': 'leek', 'lauch': 'leek', 'Erbsen': 'peas', 'erbsen': 'peas',
    'Mais': 'corn', 'mais': 'corn', 'Gurke': 'cucumber', 'gurke': 'cucumber', 'Blumenkohl': 'cauliflower', 'blumenkohl': 'cauliflower',
    'Rosenkohl': 'Brussels sprouts', 'rosenkohl': 'Brussels sprouts', 'Bohnen': 'beans', 'bohnen': 'beans',
    'Spargel': 'asparagus', 'spargel': 'asparagus', 'Champignons': 'mushrooms', 'champignons': 'mushrooms',
    'Rucola': 'arugula', 'rucola': 'arugula', 'Radieschen': 'radishes', 'radieschen': 'radishes',
    'Salat': 'lettuce', 'salat': 'lettuce', 'Kopfsalat': 'lettuce', 'kopfsalat': 'lettuce',
    'Feldsalat': 'lamb\'s lettuce', 'feldsalat': 'lamb\'s lettuce', 'Gemüse': 'vegetables', 'Gemüse': 'vegetables',
    
    // Dairy & Eggs
    'Sahne': 'cream', 'Milch': 'milk', 'Käse': 'cheese', 'Parmesan': 'Parmesan', 'Mozzarella': 'mozzarella',
    'Joghurt': 'yogurt', 'joghurt': 'yogurt', 'Quark': 'quark', 'quark': 'quark', 'Topfen': 'quark', 'topfen': 'quark', 'FrischKäse': 'cream cheese', 'frischKäse': 'cream cheese',
    'Ei': 'egg', 'ei': 'egg', 'Eier': 'eggs', 'eier': 'eggs',
    
    // Fruits & Citrus
    'Zitrone': 'lemon', 'Zitronensaft': 'lemon juice', 'Zitronenscheiben': 'lemon slices',
    'Orange': 'orange', 'orange': 'orange', 'Apfel': 'apple', 'apfel': 'apple', 'Birne': 'pear', 'birne': 'pear',
    'Banane': 'banana', 'banane': 'banana', 'Beeren': 'berries', 'beeren': 'berries',
    'Erdbeeren': 'strawberries', 'erdbeeren': 'strawberries', 'Himbeeren': 'raspberries', 'himbeeren': 'raspberries',
    
    // Herbs & Spices
    'Basilikum': 'basil', 'Petersilie': 'parsley', 'kräuter': 'herbs', 'Thymian': 'thyme', 'thymian': 'thyme',
    'Rosmarin': 'rosemary', 'rosmarin': 'rosemary', 'Oregano': 'oregano', 'oregano': 'oregano',
    'Koriander': 'cilantro', 'koriander': 'cilantro', 'Dill': 'dill', 'dill': 'dill',
    'Paprikapulver': 'paprika', 'paprikapulver': 'paprika', 'Curry': 'curry', 'curry': 'curry',
    'Chili': 'chili', 'chili': 'chili', 'Ingwer': 'ginger', 'ingwer': 'ginger',
    
    // Grains, Pasta & Bread
    'Fond': 'broth', 'Reis': 'rice', 'Pasta': 'pasta', 'Nudeln': 'noodles', 'nudeln': 'noodles',
    'Spaghetti': 'spaghetti', 'spaghetti': 'spaghetti', 'Brot': 'bread', 'brot': 'bread',
    'Paniermehl': 'breadcrumbs', 'paniermehl': 'breadcrumbs', 'Mehl': 'flour', 'mehl': 'flour',
    'Haferflocken': 'oats', 'haferflocken': 'oats', 'Couscous': 'couscous', 'couscous': 'couscous',
    'Nockerl': 'dumplings', 'nockerl': 'dumplings', 'Spätzle': 'Spätzle', 'Spätzle': 'Spätzle',
    
    // Condiments & Liquids
    'Rotwein': 'red wine', 'rotwein': 'red wine', 'Weißwein': 'white wine', 'weißwein': 'white wine',
    'Essig': 'vinegar', 'essig': 'vinegar', 'Essigspritzer': 'splash of vinegar',
    'Balsamico': 'balsamic', 'balsamico': 'balsamic',
    'Sojasauce': 'soy sauce', 'sojasauce': 'soy sauce', 'Honig': 'honey', 'honig': 'honey',
    'Senf': 'mustard', 'senf': 'mustard', 'öl': 'oil', 'öl': 'oil', 'Sesamöl': 'sesame oil', 'sesamöl': 'sesame oil',
    'Wasser': 'water', 'wasser': 'water', 'Kochwasser': 'cooking water',
    'Marinade': 'marinade', 'marinade': 'marinade', 'Sauce': 'sauce', 'sauce': 'sauce',
    'Paste': 'paste', 'paste': 'paste', 'Pesto': 'pesto', 'pesto': 'pesto',
    
    // Equipment & containers
    'Pfanne': 'pan', 'Topf': 'pot', 'Wok': 'wok', 'Grillpfanne': 'grill pan', 'Eisenpfanne': 'cast iron pan',
    'Kräftige Grillpfanne': 'Heavy grill pan', 'Kräftige': 'sturdy',
    'im Ofen': 'in the oven', 'Ofen': 'oven', 'Im Ofen': 'In the oven',
    'Backblech': 'baking sheet', 'Backblechen': 'baking sheets',
    'mit Backpapier belegten Blech': 'parchment-lined baking sheet',
    'Auflaufform': 'baking dish', 'Schüssel': 'bowl', 'Teller': 'plate', 
    'Backpapier': 'parchment paper', 'backpapier': 'parchment paper',
    'Grill': 'grill', 'grill': 'grill', 'Gitterrost': 'wire rack', 'Brett': 'board', 'Holzbrett': 'wooden board',
    'Blech': 'sheet', 'blech': 'sheet', 'Folie': 'foil', 'folie': 'foil', 'Frischhaltefolie': 'plastic wrap',
    'zwei Lagen Frischhaltefolie': 'two layers of plastic wrap',
    'Messer': 'knife', 'messer': 'knife', 'scharfem Messer': 'sharp knife', 'scharfes Messer': 'sharp knife',
    'kleinem Messer': 'small knife', 'Fleischklopfer': 'meat mallet', 'Pinsel': 'brush',
    'Mixer': 'blender', 'mixer': 'blender',
    'Ofenbakschale': 'oven baking dish', 'mittlerer Schiene': 'middle rack',
    'mittlerer Grill-Höhe': 'at medium grill height', 'mittlerer Höhe': 'at medium height',
    'tiefen Teller': 'deep plate', 'anderem Teller': 'another plate',
    'einem breiten Topf': 'a wide pot', 'einer trockenen Pfanne': 'a dry pan',
    
    // Cooking techniques & descriptors
    'Papiertuchern': 'paper towels', 'Papiertu?chern': 'paper towels', 'Haushaltspapier': 'paper towels',
    'Sehnen': 'tendons', 'sehnen': 'tendons', 'anhängenden Sehnen': 'attached tendons',
    'Knochen': 'bones', 'knochen': 'bones',
    'Kerntemperatur': 'core temperature', 'kerntemperatur': 'core temperature',
    'Garegrad': 'doneness', 'garegrad': 'doneness', 'medium': 'medium',
    'Finger-Test': 'finger test', 'Daumen-Zeigefinger': 'thumb to index finger',
    'Daumen-Zeigefinger berühren': 'touch thumb to index finger',
    'berühren': 'touch', 'einen Stich': 'an incision', 'einen Stich in die dickste Stelle': 'an incision in the thickest part',
    'Rauch': 'smoke', 'rauch': 'smoke', 'Hauch': 'hint', 'hauch': 'hint',
    'ein Hauch Rauch aufsteigt': 'a hint of smoke rises',
    'übereinstimmung': 'match', 'Zutaten': 'ingredients',
    'dicke Scheiben': 'thick slices', 'dünne Scheiben': 'thin slices',
    'dicke Scheiben oder Viertel': 'thick slices or quarters', 'Viertel': 'quarters',
    'Einzelrippen': 'individual ribs', 'einzelrippen': 'individual ribs',
    'Gaze-Mischung': 'glaze mixture', 'gaze-mischung': 'glaze mixture',
    'Fingerweerk': 'finger food', 'fingerweerk': 'finger food',
    'Salzstreuer': 'salt shaker', 'salzstreuer': 'salt shaker',
    'Chutneys': 'chutneys', 'chutneys': 'chutneys',
    'Basmati-Reis': 'basmati rice', 'basmati-reis': 'basmati rice',
    'Naan-Brot': 'naan bread', 'naan-brot': 'naan bread',
    'Knoblauch-Aioli': 'garlic aioli', 'knoblauch-aioli': 'garlic aioli',
    'Salzkartoffeln': 'boiled potatoes', 'salzkartoffeln': 'boiled potatoes',
    'Schnittlauch': 'chives', 'schnittlauch': 'chives',
    'Tomatenpüree': 'tomato puree', 'Tomatenpüree': 'tomato puree',
    'TomatenStücke': 'tomato pieces', 'Tomatenwürfel': 'diced tomatoes',
    'Paprikastreifen': 'bell pepper strips', 'paprikastreifen': 'bell pepper strips',
    'Paprikaringe': 'bell pepper rings', 'paprikaringe': 'bell pepper rings',
    'beide Paprikasorten': 'both types of bell peppers',
    'Rosmarinjus': 'rosemary jus', 'rosmarinjus': 'rosemary jus',
    'Jahreszeit': 'season', 'jahreszeit': 'season', 'Gemüse der Jahreszeit': 'seasonal vegetables',
    'Fleischzerleger': 'meat cleaver', 'fleischzerleger': 'meat cleaver',
    'kräuter-Paniermehl': 'herb breadcrumbs', 'kräuter-paniermehl': 'herb breadcrumbs',
    'Pinienkerne': 'pine nuts', 'pinienkerne': 'pine nuts',
    'Mandeln': 'almonds', 'mandeln': 'almonds', 'Geröstete Mandeln': 'Roasted almonds',
    'Kokosmilch': 'coconut milk', 'kokosmilch': 'coconut milk',
    'Curry-Pulver': 'curry powder', 'curry-pulver': 'curry powder',
    'Chili-Flocken': 'chili flakes', 'chili-flocken': 'chili flakes',
    'Pasta-Wasser': 'pasta water', 'pasta-wasser': 'pasta water',
    'Dosen-Tomaten': 'canned tomatoes', 'dosen-tomaten': 'canned tomatoes',
    'geriebenom Parmesan': 'grated Parmesan', 'geriebenen Parmesan': 'grated Parmesan',
    'geriebenom': 'grated', 'geriebenen': 'grated',
    'Knoblauch-öl-Mischung': 'garlic-oil mixture', 'knoblauch-öl-mischung': 'garlic-oil mixture',
    'Sojasauce-Mischung': 'soy sauce mixture', 'sojasauce-mischung': 'soy sauce mixture',
    'rote paprika': 'red bell pepper', 'rote Paprika': 'red bell pepper',
    'gelbe paprika': 'yellow bell pepper', 'gelbe Paprika': 'yellow bell pepper',
    'roter pfeffer': 'red pepper', 'Roten Pfeffer': 'Red pepper',
    'schwarzem Pfeffer': 'black pepper', 'schwarzer pfeffer': 'black pepper',
    'schwarzer Pfeffer': 'black pepper', 'schwarzem pfeffer': 'black pepper',
    'Fleur de Sel': 'Fleur de Sel', 'fleur de sel': 'Fleur de Sel',
    'Rotkohl': 'red cabbage', 'rotkohl': 'red cabbage', 'ausgekühltem Rotkohl': 'cooled red cabbage',
    'breiten Nudeln': 'wide noodles', 'breite Nudeln': 'wide noodles',
    'grünem Salat': 'green salad', 'frischem Salat': 'fresh salad', 'frischem Brot': 'fresh bread',
    'als wärmender Eintopf': 'as a warming stew',
    'Bitterkeit zu vermeiden': 'avoid bitterness', 'um Bitterkeit zu vermeiden': 'to avoid bitterness',
    'um einzudicken': 'to thicken', 'damit Alkohol reduziert': 'so the alcohol reduces',
    'damit Aromen sich verbinden': 'allow flavors to combine', 
    'damit Sauce einzieht': 'allow sauce to be absorbed',
    'damit Fleischsäfte verteilen können': 'allow meat juices to distribute',
    'damit Saft sich verteilt': 'allow juices to distribute', 
    'damit Säfte verteilen': 'allow juices to distribute',
    'Saft muss klar sein': 'juice must run clear', 'klar sein': 'run clear',
    'schwer salzbar': 'season lightly with salt', 'heißes öl': 'hot oil',
    'gebe das Filet': 'add the fillet', 'tun': 'add', 'Die Pasta direkt': 'Add pasta directly',
    'ebenfalls': 'also', 'eventuell': 'possibly', 'eventuell mit': 'optionally with',
    'glätten': 'smooth out', 'glätten falls nötig': 'smooth out if necessary',
    'Aromen': 'flavors', 'Aroma': 'flavor', 'Aroma freisetzt': 'releases flavor',
    'darüber': 'over', 'darüber geben': 'pour over', 'darauf': 'on it',
    'darauf verteilen': 'distribute over', 'darüber verteilen': 'spread over',
    'auftragen': 'apply', 'auftragen bis': 'apply until',
    'übersättigt mit Fond aufgießen': 'gradually add broth',
    'nach und nach immer etwas Fond': 'gradually add broth little by little',
    'adhäriert': 'adheres', 'andrücken damit adhäriert': 'press so it adheres',
    'zwischen': 'between', 'ca. 3–4 cm tief': 'about 3-4 cm deep',
    'Die fertige Kotelett': 'The finished cutlet', 'fertige': 'finished',
    'dünn': 'thin', 'flach': 'flat',
    'verarbeiten': 'process', 'zu Pesto verarbeiten': 'process into pesto',
    'diese Marinade': 'this marinade', 'diese': 'this',
    'Fleischstück-Größe': 'size of meat piece', 'Größe': 'size',
    'dickste Stelle': 'thickest part', 'Stelle': 'spot',
    'Dicke': 'thickness', 'je nach Dicke': 'depending on thickness',
    'Knoblauch-Aioli': 'garlic aioli', 'knoblauch-aioli': 'garlic aioli',
    'Salzkartoffeln': 'boiled potatoes', 'salzkartoffeln': 'boiled potatoes',
    'Schnittlauch': 'chives', 'schnittlauch': 'chives',
    'Tomatenpüree': 'tomato puree', 'Tomatenpüree': 'tomato puree', 'TomatenStücke': 'tomato pieces',
    'Paprikastreifen': 'bell pepper strips', 'paprikastreifen': 'bell pepper strips',
    'Rosmarinjus': 'rosemary jus', 'rosmarinjus': 'rosemary jus',
    'Jahreszeit': 'season', 'jahreszeit': 'season',
    'scharfem Messer': 'sharp knife', 'scharfes Messer': 'sharp knife',
    'Fleischzerleger': 'meat cleaver', 'fleischzerleger': 'meat cleaver',
    'kräuter-Paniermehl': 'herb breadcrumbs', 'kräuter-paniermehl': 'herb breadcrumbs',
    'Ofenbakschale': 'oven baking dish', 'ofenbakschale': 'oven baking dish',
    'Pinienkerne': 'pine nuts', 'pinienkerne': 'pine nuts',
    'Mandeln': 'almonds', 'mandeln': 'almonds',
    'Kokosmilch': 'coconut milk', 'kokosmilch': 'coconut milk',
    'Curry-Pulver': 'curry powder', 'curry-pulver': 'curry powder',
    'Chili-Flocken': 'chili flakes', 'chili-flocken': 'chili flakes',
    'Pasta-Wasser': 'pasta water', 'pasta-wasser': 'pasta water',
    'Dosen-Tomaten': 'canned tomatoes', 'dosen-tomaten': 'canned tomatoes',
    'geriebenom Parmesan': 'grated Parmesan', 'geriebenen Parmesan': 'grated Parmesan',
    'rote paprika': 'red bell pepper', 'gelbe paprika': 'yellow bell pepper',
    'roter pfeffer': 'red pepper', 'schwarzem Pfeffer': 'black pepper', 'schwarzer pfeffer': 'black pepper',
    'frisch gemahlenem Pfeffer': 'freshly ground pepper', 'frisch gemahlenem Pfeffer': 'freshly ground pepper',
    'Fleur de Sel': 'Fleur de Sel', 'fleur de sel': 'Fleur de Sel',
    'Rotkohl': 'red cabbage', 'rotkohl': 'red cabbage',
    'breiten Nudeln': 'wide noodles', 'breite Nudeln': 'wide noodles',
    
    // Prepositions & conjunctions
    ' mit ': ' with ', ' und ': ' and ', ' oder ': ' or ', ' bis ': ' until ', ' für ': ' for ', 
    ' von ': ' from ', ' zu ': ' to ', ' in ': ' in ', ' auf ': ' on ', ' über ': ' over ', 
    ' unter ': ' under ', ' durch ': ' through ', ' bei ': ' at ', ' nach ': ' after ', 
    ' vor ': ' before ', ' während ': ' while ', ' damit ': ' so that ', ' wenn ': ' when ', 
    ' falls ': ' if ', ' als ': ' as ', ' je nach ': ' depending on ', ' pro ': ' per ',
    ' um ': ' to ', ' ohne ': ' without ', ' aus ': ' from ', ' an ': ' at ',
    
    // Articles & common words
    'Die ': 'The ', 'Der ': 'The ', 'Das ': 'The ', 'den ': 'the ', 'die ': 'the ', 'das ': 'the ',
    'einer ': 'a ', 'eine ': 'a ', 'ein ': 'a ', 'einem ': 'a ', 'einen ': 'a ', 'eines ': 'a ',
    'Im ': 'In the ', 'im ': 'in the ', 'In ': 'In ', 'in ': 'in ',
    'Mit ': 'With ', 'mit ': 'with ', 'Auf ': 'On ', 'auf ': 'on ',
    'sehr ': 'very ', 'etwas ': 'some ', 'wenig ': 'little ', 'mehr ': 'more ',
    'ca.': 'approx.', 'bzw.': 'or', 'ggf.': 'if necessary', 'EL': 'tbsp', 'TL': 'tsp',
    'optional': 'optional', 'Optional': 'optional',
    'etwa ': 'about ', 'Etwa ': 'About ', 'alle ': 'every ', 'Alle ': 'Every ',
    'nur': 'only', 'nicht': 'not', 'noch': 'still', 'schon': 'already', 'auch': 'also',
    'Dabei': 'While doing so', 'dabei': 'while doing so',
    'Am Ende': 'At the end', 'am Ende': 'at the end',
    'Zum Schluss': 'At the end', 'zum Schluss': 'at the end',
    'Dann sofort': 'Then immediately', 'dann sofort': 'then immediately',
    'Alle 10 Minuten': 'Every 10 minutes', 'alle 10–15 Minuten': 'every 10-15 minutes',
    'Nach ca.': 'After approx.', 'nach ca.': 'after approx.',
    'Ca.': 'Approx.', 'Weitere': 'Another', 'weitere': 'another',
    'Bei': 'At', 'Sofort nach': 'Immediately after', 'sofort nach': 'immediately after',
    'grosszügig': 'Generously', 'grosszügig': 'generously',
    'Frisches': 'Fresh', 'frisches': 'fresh', 'Frische': 'Fresh', 'frische': 'fresh',
    'innen und außen': 'inside and out', 'Innen und außen': 'Inside and out',
    'von außen': 'on the outside', 'von innen': 'from inside',
    'jeder': 'each', 'beiden': 'both', 'alle': 'all', 'ganzen': 'whole', 'ganz': 'completely',
    'Servieren': 'Serve', 'servieren': 'serve',
  };
  
  // First check if text is an exact recipe title match
  if (translations[text]) {
    return translations[text];
  }
  
  // Phrase-based replacement: longest phrases first
  let translated = text;

  const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);

  for (let [german, english] of sortedTranslations) {
    const escapedGerman = german.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    translated = translated.replace(new RegExp(escapedGerman, 'gi'), english);
  }

  // Fallback: Wenn weniger als 40% der Wörter übersetzt wurden,
  // lieber den deutschen Originaltext behalten als Kauderwelsch liefern.
  var originalWords = text.split(/\s+/).length;
  var translatedWords = translated.split(/\s+/);
  var unchangedCount = 0;
  for (var w = 0; w < translatedWords.length; w++) {
    if (/^[a-zäöüß]/i.test(translatedWords[w]) && text.indexOf(translatedWords[w]) !== -1) {
      unchangedCount++;
    }
  }
  var translationRatio = 1 - (unchangedCount / Math.max(originalWords, 1));
  if (translationRatio < 0.4 && originalWords > 5) {
    return text;
  }

  return translated;
}
// ==================== PROPER ENGLISH RECIPE TRANSLATIONS ====================

/**
 * Database of properly written English recipes (not auto-translated)
 * Returns { title, steps } for recipes that need perfect English
 */
function getProperEnglishRecipe(recipeId) {
  const properTranslations = {
    // Fish recipes
    23: { // Fisch aus der Pfanne mit kräuterkruste
      title: 'Pan-Fried Fish with Herb Crust',
      steps: [
        'Season fish fillets with salt and pepper',
        'Mix breadcrumbs with finely chopped fresh herbs',
        'Coat fillets in the herb breadcrumb mixture, pressing gently',
        'Heat butter in a large skillet over medium-high heat',
        'Pan-fry fillets for 3-4 minutes per side until golden brown and cooked through',
        'Finish with fresh lemon juice and serve'
      ]
    },
    24: { // Citrus-Mariniertes Lachsfilet
      title: 'Citrus-Marinated Salmon Fillet',
      steps: [
        'Mix lemon juice, honey, and soy sauce in a bowl',
        'Place salmon fillets in a baking dish and pour marinade over them',
        'Refrigerate for at least 30 minutes',
        'Preheat oven to 180 Grad C and bake salmon for 12-15 minutes until just cooked',
        'Season with freshly cracked black pepper and serve hot'
      ]
    },
    // Beef recipes
    5: { // Herzhafte Rinderragout
      title: 'Hearty Beef Ragout',
      steps: [
        'Cut beef into 3-4 cm cubes, pat dry, and season with salt and pepper',
        'Working in batches, sear meat on all sides in hot oil until deeply browned (~3 min per batch). Set aside',
        'Chop onions and slice carrots. sauté in the same pot for 3 minutes',
        'Return beef to pot, deglaze with red wine, and simmer for 1 minute to reduce alcohol',
        'Cover meat completely with stock, bring to a boil, then reduce to low heat',
        'Simmer covered for 1.5-2 hours until meat is very tender',
        'Season to taste with salt and pepper. Serve with broccoli or potatoes'
      ]
    },
    6: { // Rindersteak mit Fleur de Sel
      title: 'Beef Steak with Fleur de Sel',
      steps: [
        'Remove steak from refrigerator 20 minutes before cooking for even results',
        'Pat dry and lightly coat with olive oil',
        'Heat a cast iron skillet until it\'s smoking hot',
        'Sear steak for 3-5 minutes per side depending on thickness and desired doneness',
        'Season immediately after cooking with fleur de sel and freshly cracked pepper',
        'Let rest on a wooden board for 5 minutes to redistribute meat juices',
        'Serve with optional herb butter'
      ]
    },
    // Chicken recipes
    17: { // Knoblauch-hähnchen mit Zitrone
      title: 'Garlic Chicken with Lemon',
      steps: [
        'Cut chicken fillets into bite-sized pieces and season with salt and pepper',
        'Mince garlic and combine with olive oil and lemon juice',
        'Marinate chicken for 15-20 minutes in this mixture',
        'Heat oil in a skillet and pan-fry chicken for 3 minutes per side until golden',
        'Transfer to a 180 Grad C oven and bake another 10-12 minutes until fully cooked',
        'Garnish with lemon slices and fresh herbs',
        'Serve hot with salad, rice, or potatoes'
      ]
    },
    18: { // hähnchen-Curry
      title: 'Chicken Curry',
      steps: [
        'sauté chopped onions in hot oil for 2 minutes',
        'Add 2-3 tablespoons curry powder and toast for about 1 minute until fragrant',
        'Add diced chicken and sear for 3 minutes over high heat',
        'Pour in coconut milk and stir well to combine',
        'Add minced garlic, bring to a boil, then reduce heat to low',
        'Simmer gently for about 20 minutes until chicken is cooked through',
        'Adjust seasoning with salt and additional curry powder to taste',
        'Serve over basmati rice with naan bread'
      ]
    },
    21: { // hähnchen-Pfanne mit Paprika
      title: 'Chicken Pan with Bell Peppers',
      steps: [
        'Cut chicken fillet into bite-sized pieces, core both types of bell peppers and cut into wide rings',
        'Chop onion, dice tomatoes',
        'Sear chicken in hot oil for 2 minutes on each side over high heat, then remove',
        'sauté onion and bell pepper rings in the same pan for 2 minutes',
        'Add diced tomatoes and return the chicken',
        'Cook for about 10-12 minutes over medium heat until vegetables are soft and chicken is cooked through',
        'Season with salt and black pepper, serve with rice or wide noodles'
      ]
    },
    384: { // Gemuese-Suppe mit Brokkoli
      title: 'Vegetable Soup with Broccoli',
      steps: [
        'Separate broccoli into small florets, dice carrot and onion',
        'sauté onion in oil for about 1 minute',
        'Add carrot and continue cooking for 2 more minutes',
        'Pour in stock, bring to a boil and add broccoli',
        'Simmer gently for about 12 minutes until vegetables are tender',
        'Optionally puree 2/3 of the soup for a creamier texture',
        'Season with salt and pepper, serve garnished with broccoli florets'
      ]
    },
    // More common recipes
    1: { // Reste-Salat mit Tomate & Brot
      title: 'Leftover Salad with Tomato & Bread',
      steps: [
        'Cut stale bread into 1 cm cubes and fry in hot oil for about 3 minutes until crispy and golden brown',
        'Core tomatoes and dice small, pick out basil leaves',
        'Wash lettuce, spin dry and tear into larger pieces',
        'Whisk together olive oil, vinegar, salt and pepper to make a vinaigrette',
        'Mix the still-warm bread cubes with tomatoes',
        'Just before serving, toss lettuce with vinaigrette and mix in the bread cubes',
        'Serve with fresh basil and optional Parmesan shavings'
      ]
    },
    3: { // Cremige Tomatensuppe (Reste-Edition)
      title: 'Creamy Tomato Soup (Leftover Edition)',
      steps: [
        'Finely chop onion and garlic, sauté in hot oil for about 2 minutes without coloring',
        'Add tomato puree or chopped fresh tomatoes and cook briefly',
        'Cover vegetables with stock and bring to a boil',
        'Simmer gently for about 15 minutes until flavors have melded',
        'Puree to a creamy consistency using an immersion or stand blender',
        'Stir in cream and heat briefly - do not boil',
        'Season with salt and pepper, optionally garnish with fresh basil'
      ]
    },
    31: { // Tomaten-Pasta
      title: 'Tomato Pasta',
      steps: [
        'Bring water with plenty of salt to a boil and cook spaghetti according to package instructions',
        'Meanwhile, dice fresh tomatoes or use canned tomatoes',
        'Press garlic and toast in olive oil for about 1 minute until golden without burning',
        'Add tomatoes and simmer gently for about 10 minutes to blend flavors',
        'Finely chop fresh basil and stir in at the very end',
        'Drain spaghetti al dente and toss with tomato sauce',
        'Serve with salt, pepper and optional grated Parmesan'
      ]
    },
    36: { // Kartoffel-Suppe
      title: 'Potato Soup',
      steps: [
        'Peel and dice potatoes and onions',
        'sauté onion in hot oil for 2 minutes',
        'Add potatoes and cover with stock',
        'Bring to a boil and simmer for about 20 minutes until potatoes are very soft',
        'Puree smooth to a creamy consistency using an immersion blender',
        'Stir in cream and heat without boiling',
        'Season with salt and pepper, optionally garnish with fresh chives'
      ]
    },
    
    // All remaining recipes - Comprehensive translations
    2: { title: 'Warm Bread Salad with Herbs', steps: ['Cut stale bread into medium cubes and set aside', 'Finely chop garlic and slowly brown in olive oil for about 2 minutes', 'Bring lemon juice and salt to a boil in the garlic oil', 'Place bread cubes in a bowl and pour the hot marinade over', 'Add chopped fresh herbs (parsley, chives, optional basil) and mix well', 'Let soak for 10-15 minutes so bread absorbs liquid', 'Season with salt and pepper and serve warm or lukewarm'] },
    4: { title: 'Fine Mushroom Risotto (inspired)', steps: ['Clean mushrooms, halve if necessary and brown in hot oil for 5 minutes, set aside', 'Finely chop onion and sauté in butter until soft for 2 minutes', 'Add rice (about 300g for 4 people) and toast for 2 minutes while stirring', 'Gradually add stock bit by bit as rice absorbs it, about 15 minutes', 'Stir constantly so starch releases for creaminess', 'After about 18-20 minutes total, rice should be al dente with some bite', 'Return mushrooms, stir in butter and Parmesan, season with salt and pepper and serve'] },
    8: { title: 'Greek Salad', steps: ['Peel and dice cucumber into bite-sized pieces.', 'Halve cherry tomatoes and deseed regular tomatoes if using, then cut into chunks.', 'Slice red onion into thin half-rings and separate the layers.', 'Cut bell pepper into strips and remove seeds.', 'Place all vegetables in a large bowl.', 'Crumble feta cheese over the top and add pitted olives.', 'Drizzle generously with olive oil and season with salt, pepper, and dried oregano.', 'Toss gently to combine all ingredients and let rest for 5 minutes before serving.'] },
    9: { title: 'Tomato Soup', steps: ['Peel and finely chop the onion.', 'Heat olive oil in a large pot over medium heat and sauté the onion for about 3-4 minutes until translucent.', 'Add diced canned or fresh tomatoes and stir well.', 'Pour in vegetable broth (about 500ml) and bring to a boil.', 'Reduce heat and simmer for about 15-20 minutes to allow flavors to develop.', 'Use an immersion blender to puree the soup until smooth and creamy.', 'Season with salt, pepper, and a pinch of sugar if needed to balance acidity.', 'Serve hot, garnished with fresh basil leaves or a swirl of cream.'] },
    13: { title: 'Minestrone', steps: ['Peel and dice onion, carrots, and celery into small pieces.','Heat olive oil in a large pot and sauté the diced vegetables for about 5 minutes until softened.','Add diced tomatoes and stir to combine well.','Pour in vegetable broth (about 1 liter) and bring to a boil.','Add uncooked pasta (like small shells or ditalini) and cook for about 8-10 minutes.','Drain canned beans and add them to the pot, stirring gently.','Simmer for an additional 5 minutes until pasta is tender and beans are heated through.','Season with salt, pepper, and dried Italian herbs.','Serve hot with grated Parmesan cheese and crusty bread.'] },
    7: { title: 'Beef Goulash', steps: ['Cut beef into 3 cm cubes and season with salt', 'Cut onions into half rings, slice carrots', 'Brown meat on all sides in hot oil in batches, remove', 'sauté onions in the same pot for 2 minutes until golden', 'Generously distribute paprika powder (about 3-4 tbsp) and stir immediately - max 30 seconds to avoid bitterness', 'Return meat, deglaze with red wine or vinegar and stir well', 'Add stock to cover everything, bring to boil and reduce to low heat', 'Simmer covered for about 1.5-2 hours until meat is very tender, cook uncovered at end to thicken', 'Season finally with salt and vinegar splash and serve with dumplings or potatoes'] },
    10: { title: 'Beef Stew', steps: ['Cut beef into bite-sized cubes, also dice potatoes and carrots', 'Chop onion and briefly sauté in hot oil', 'Add meat and brown for 2-3 minutes at high heat until brown outside', 'Add stock to barely cover everything', 'Add potatoes and carrots, bring to boil', 'Reduce heat to low and simmer covered for about 45-60 minutes until potatoes are tender and meat is done', 'Season with salt and optional pepper before serving'] },
    11: { title: 'Classic Pork Schnitzel', steps: ['Pound pork schnitzel between two layers of plastic wrap with meat mallet until about 5mm thin', 'Beat eggs and pour into deep plate', 'Mix breadcrumbs with 1 tsp salt and pepper in another plate', 'First turn schnitzel completely in egg, shake off excess egg', 'Then immediately turn in breadcrumbs and press lightly to adhere', 'Deep fry in sufficient hot oil (about 3-4 cm deep) for about 3 minutes per side until golden brown', 'Let finished cutlet drain on paper towels', 'Serve with lemon slice and cooled red cabbage or fresh salad'] },
    12: { title: 'Pork Fillet with Rosemary', steps: ['Remove pork fillet from any attached sinews with small knife', 'Season with salt and pepper, rub in fresh rosemary sprigs and chopped garlic', 'Add fillet to hot oil and brown for 2-3 minutes per side until brown outside', 'Place in oven preheated to 160 Grad C on middle rack for about 15-20 minutes until core temperature reaches about 63-65 Grad C', 'Remove fillet to board and let rest for 5 minutes so juice distributes', 'Cut into 1.5 cm thick slices with sharp knife', 'Serve with rosemary jus and seasonal vegetables'] },
    14: { title: 'Pork Ragout', steps: ['Cut pork into 3 cm cubes and pat dry', 'Brown meat in hot oil in batches until dark brown outside, remove', 'sauté chopped onions and garlic in same pot for 2 minutes', 'Return meat, deglaze with red wine and simmer for about 1 minute to reduce alcohol', 'Add stock to cover meat, bring to boil and reduce heat to low', 'Simmer covered for about 1-1.5 hours at barely moving simmer until meat is tender', 'Season finally with black pepper and optional mustard, serve with potatoes or noodles'] },
    15: { title: 'Grilled Pork Ribs', steps: ['Mix paprika powder, honey, vinegar and pinch of salt to paste', 'Generously rub pork ribs with this on both sides', 'Marinate wrapped in foil in refrigerator for at least 4 hours (or overnight)', 'Cook indirectly at medium height on grill or in oven at 180 Grad C for about 40-50 minutes', 'Brush more glaze mixture every 10-15 minutes with brush until shiny dark brown', 'Cut into individual ribs with sharp knife or meat cutter', 'Serve as finger food with salt shaker and fresh parsley'] },
    16: { title: 'Ground Pork Pan with Bell Peppers', steps: ['sauté chopped onion in hot oil for 2 minutes until pale golden', 'Brown ground pork in batches while stirring for about 4-5 minutes until no pink visible', 'Add bell pepper strips and cook for 2 minutes', 'Add tomato pieces or tomato puree and mix well', 'Simmer for about 8-10 minutes at medium heat so flavors blend', 'Season generously with salt and black pepper', 'Serve with pasta, rice or fresh bread'] },
    19: { title: 'Grilled Chicken Drumstick', steps: ['Pat chicken drumstick dry (dry surface is important)', 'Season generously with olive oil, paprika, fresh thyme, salt and pepper on all sides', 'Cook at medium grill height or in oven at 200 Grad C on rack for about 35-45 minutes depending on size', 'Turn every 10 minutes so it browns evenly and doesn\'t burn', 'Make cut with sharp knife into thickest part - juice must run clear when done', 'Let rest for 5 minutes so juices distribute', 'Serve with garlic aioli, boiled potatoes and green salad'] },
    20: { title: 'Chicken with Mushrooms', steps: ['Cut chicken fillet into bite-sized pieces, season with salt and pepper', 'Clean mushrooms and cut into thick slices or quarters, chop onion', 'Brown chicken in hot oil for 3 minutes per side, remove', 'In same pan with butter, brown mushrooms for 3 minutes golden, add onion', 'Stir in cream, return chicken, season with salt and pepper', 'Simmer gently at low heat for about 12-15 minutes so sauce thickens', 'Garnish with fresh parsley or chives, serve with Spätzle or rice'] },
    22: { title: 'Chicken Stew', steps: ['Cut chicken fillet into bite-sized, even pieces', 'Cut potatoes and carrots into not too small cubes, chop onion', 'Briefly brown chicken in hot oil for about 2-3 minutes, remove', 'sauté onion, add potatoes and carrots and steam for 2 minutes', 'Add stock to barely cover vegetables', 'Return chicken, bring to boil and reduce to low heat', 'Simmer covered for about 35-40 minutes until potatoes are soft and chicken is done', 'Season with salt and pepper and serve as warming stew'] },
    25: { title: 'Chicken Caesar Salad', steps: ['Cut chicken breast into thin strips or bite-sized pieces.','Season chicken with salt and pepper.','Heat olive oil in a skillet over medium-high heat.','Sear chicken strips for about 5-6 minutes until golden brown and cooked through (internal temperature 165üf/74 Grad C).','Tear romaine lettuce into bite-sized pieces and place in a large bowl.','Add diced tomatoes and shaved Parmesan cheese.','Drizzle with Caesar dressing and toss gently to coat all ingredients.','Top with cooked chicken strips and serve immediately while chicken is still warm.'] },
    26: { title: 'Fried Salmon with Garlic', steps: ['Finely chop or press garlic', 'Heat olive oil in pan', 'Place salmon fillets skin side down in pan, cook for 4 minutes', 'Turn to other side, add chopped garlic', 'Fry for another 3-4 minutes until salmon is cooked through', 'Season with vinegar, salt and pepper and serve'] },
    27: { title: 'Potato Salad with Herbs', steps: ['Wash and peel potatoes, then cut into 2cm cubes.','Boil potatoes in salted water for about 15-20 minutes until tender but not mushy.','Drain and let cool completely.','Finely chop fresh herbs (parsley, dill, and chives work well).','Peel and finely dice onion.','Mix cooled potatoes with herbs and onion in a large bowl.','Whisk together olive oil, vinegar or lemon juice, salt, and pepper to make dressing.','Pour dressing over potato mixture and toss gently to combine.','Let marinate in the refrigerator for at least 30 minutes before serving to allow flavors to meld.'] },
    28: { title: 'Salmon Fillet with Basil Pesto', steps: ['Process basil, pine nuts, Parmesan and about 100ml olive oil in blender to pesto', 'Season with lemon and salt', 'Place salmon fillets on baking sheets', 'Spread generously with pesto', 'Bake at 180 Grad C for about 12 minutes', 'Serve warm'] },
    29: { title: 'Pasta Salad', steps: ['Cook pasta (penne, fusilli, or farfalle work well) in salted boiling water according to package directions until al dente.','Drain pasta and rinse under cold water to stop cooking, then let cool completely.','Dice bell peppers, removing seeds and white membranes.','Halve cherry tomatoes or dice regular tomatoes.','Drain mozzarella balls (bocconcini) if using, or cube fresh mozzarella.','Combine cooled pasta with all vegetables and cheese in a large bowl.','Drizzle generously with olive oil and add a splash of balsamic vinegar if desired.','Season with salt, pepper, and dried basil or oregano.','Toss everything together thoroughly and refrigerate for at least 15 minutes before serving.'] },
    30: { title: 'Cod with Soy Sauce', steps: ['Mix soy sauce, lemon juice and chopped garlic in bowl', 'Season cod fillets and place in baking dish', 'Spread soy sauce mixture over', 'Bake at 180 Grad C for about 15 minutes until fish becomes opaque', 'Drizzle with sesame oil and serve'] },
    32: { title: 'Pasta Aglio e Olio', steps: ['Bring water with salt to boil, cook spaghetti according to package', 'Finely chop garlic or slice', 'Heat olive oil in wide pot and add garlic - gently toast for about 1-2 minutes', 'Add red pepper or chili flakes to taste', 'Drain spaghetti al dente - save some cooking water', 'Add pasta directly to garlic-oil mixture and mix well', 'Smooth with some pasta water if needed, season with salt and pepper'] },
    33: { title: 'Carbonara Pasta', steps: ['Cut bacon into 1 cm wide strips and fry in dry pan for 3-4 minutes crispy', 'Beat eggs in bowl with chopped Parmesan and pepper', 'Boil water with salt and cook spaghetti according to package', 'Add still hot pasta to pan with bacon - heat off!', 'Immediately add egg-Parmesan mixture and stir quickly so heat cooks eggs', 'Add some pasta cooking water for creamy consistency', 'Season with salt and coarsely ground black pepper and serve'] },
    34: { title: 'Cheese Pasta with Bell Peppers', steps: ['Bring water with salt to boil and cook penne according to package', 'Core bell peppers and cut into wide rings', 'In separate pan melt butter and sauté bell peppers for about 4 minutes', 'Add grated cheese to bell peppers and stir at low heat until creamy melted', 'Drain penne al dente - save some cooking water', 'Add pasta to cheese-bell pepper sauce and mix well', 'Thin with some cooking water if needed, season with pepper'] },
    35: { title: 'Basil Pesto Spaghetti', steps: ['Toast pine nuts in dry pan for about 2 minutes lightly and set aside', 'Wash fresh basil, pluck leaves - remove stems', 'In mortar or food processor, crush garlic + pine nuts + basil + some salt', 'Slowly add olive oil while stirring until thick paste forms', 'Finally finely grate Parmesan and stir in', 'Boil water, cook spaghetti according to package', 'Mix still-hot pasta with pesto - use some cooking water to thin'] },
    37: { title: 'Beef Curry', steps: ['Cut beef into 3-4cm cubes, trimming away excess fat.','Heat oil in a large pot over medium-high heat.','Season beef cubes with salt and sear on all sides for about 5-7 minutes until well browned.','Remove beef and set aside temporarily.','In the same pot, sauté finely chopped onion for about 3 minutes until softened.','Add curry powder (2-3 tablespoons) and cook for 1 minute while stirring to release the aromas.','Pour in coconut milk (400ml) and stir to combine with the curry powder.','Return the beef to the pot and bring to a simmer.','Cover and cook on low heat for about 45-60 minutes, stirring occasionally, until beef is very tender.','Season with salt and serve hot over steamed rice, garnished with fresh cilantro if desired.'] },
    38: { title: 'Wedding Soup', steps: ['Form meatballs according to basic recipe (ground meat+egg+breadcrumbs) and fry in oil for 5 minutes', 'First mix stock with water and bring to boil', 'Add cut vegetables (carrot, zucchini, parsnip)', 'Add meatballs to soup and simmer for about 10 minutes', 'Cook penne in separate water, salt according to package', 'Drain al dente, distribute in soup', 'Garnish with salt, pepper and fresh herbs before serving'] },
    39: { title: 'Carrot-Ginger Soup', steps: ['Peel carrots and cut into about 2 cm pieces', 'Finely chop fresh ginger about 1 tbsp', 'Briefly sauté carrots with ginger in oil for 1 minute', 'Add stock and bring to boil', 'Simmer for about 20 minutes until carrots are very soft', 'Puree completely smooth with immersion blender', 'Stir in coconut milk and heat again', 'Season with lemon juice, salt and optional chili before serving'] },
    40: { title: 'Onion Soup', steps: ['Peel onions and cut thin loops about 2 cm wide', 'Steam in butter at medium heat for about 20 minutes until dark brown and sweet', 'Add stock and bring to boil', 'Simmer for about 15 minutes', 'Toast medium-thick bread pieces until golden', 'Pour soup into oven-safe bowl, distribute bread on top', 'Distribute plenty of grated cheese over and gratinate at 200 Grad C for about 5 minutes until golden'] },
    41: { title: 'Broccoli-Cheese Casserole', steps: ['Wash broccoli and divide into small florets', 'Blanch in boiling salt water for about 4 minutes half-done, then cool in ice water', 'Butter a casserole dish', 'Beat eggs with cream, stir in grated cheese (3/4 of it) with salt and pepper', 'Put broccoli in dish, distribute egg sauce over', 'Distribute remaining cheese on surface', 'Bake in oven preheated to 180 Grad C for about 25-30 minutes until golden brown on top'] },
    42: { title: 'Zucchini Fritters', steps: ['Wash zucchini and grate coarsely on fine grater', 'Sprinkle with salt and let stand for 10 minutes, then squeeze dry in kitchen towel', 'Beat eggs with grated cheese and mix with breadcrumbs', 'Stir in zucchini mixture, season with salt and pepper', 'Fry flat fritters in sufficient hot oil for 3 minutes per side until golden', 'Drain on paper towels', 'Serve with yogurt dip or sour cream'] },
    43: { title: 'Spinach Quark Casserole', steps: ['Thaw fresh or frozen spinach and squeeze out excess liquid', 'Mix quark with eggs and blend with 2/3 of grated cheese', 'Fold in spinach, season with salt, pepper and nutmeg', 'Grease casserole dish with butter', 'Pour in spinach-quark mixture, smooth surface', 'Sprinkle remaining cheese on top', 'Bake in oven preheated to 180 Grad C for about 30-35 minutes until golden'] },
    44: { title: 'Vegetable Frittata', steps: ['Finely dice zucchini and bell peppers, chop onion', 'sauté all vegetables in hot oil for about 4 minutes until starting to soften', 'Beat eggs with milk, add grated cheese, season with salt and pepper', 'Pour egg mixture over vegetables and distribute well', 'Let set at medium to low heat for about 5-6 minutes until underside is firm', 'Loosen with spatula from pan', 'Finish in oven at 180 Grad C for about 5-7 minutes'] },
    45: { title: 'Potato Casserole with Cheese', steps: ['Peel potatoes and slice into about 3mm thin slices', 'Grease casserole dish with butter', 'Layer potato slices', 'Mix cream with salt, pepper and freshly grated nutmeg and pour half over potatoes', 'Distribute finely grated cheese (2/3) over potatoes', 'Pour remaining cream over', 'Sprinkle remaining cheese on top', 'Bake in oven preheated to 180 Grad C for about 45-50 minutes until golden'] },
    46: { title: 'Mushroom Pan with Garlic', steps: ['Clean mushrooms (don\'t wash!) and dice small or quarter depending on size', 'Finely chop garlic', 'Fry mushrooms in hot oil and butter for 4-5 minutes until golden and water evaporates', 'Add chopped garlic and stir for another 1-2 minutes', 'Sprinkle with fresh parsley and drizzle with lemon juice', 'Season with salt and freshly ground pepper'] },
    47: { title: 'Potato Pancakes', steps: ['Peel potatoes and grate them coarsely using a box grater or food processor.','Place grated potatoes in a clean kitchen towel and squeeze firmly to remove as much liquid as possible.','Transfer squeezed potatoes to a mixing bowl.','Add eggs, flour, finely chopped onion, salt, and pepper to the bowl.','Mix everything together thoroughly until well combined into a thick batter.','Heat generous amount of oil in a large skillet over medium-high heat.','Spoon portions of the potato mixture into the hot oil and flatten into pancakes about 1cm thick.','Fry for about 4-5 minutes on each side until golden brown and crispy.','Remove and drain on paper towels to absorb excess oil.','Serve hot with sour cream, applesauce, or your preferred topping.'] },
    48: { title: 'Bell Pepper-Vegetable Pan', steps: ['Core bell peppers and cut into wide rings, slice zucchini', 'Chop onion, dice tomatoes', 'Briefly sauté onion in hot oil for about 1 minute', 'Add bell peppers and zucchini, cook for 3 minutes at medium heat', 'Add tomatoes and simmer for another 5-7 minutes', 'Season with salt and pepper, optional fresh herbs'] },
    49: { title: 'Chicken Soup with Noodles', steps: ['Cut chicken breast into bite-sized cubes.','Peel and dice carrots, celery, and onion into small pieces.','Heat oil in a large pot over medium heat and sauté the diced vegetables for about 5 minutes.','Add chicken cubes and cook for an additional 5 minutes, stirring occasionally.','Pour in chicken broth (about 1.5 liters) and bring to a boil.','Add uncooked noodles (egg noodles work best) and cook according to package directions, usually 8-10 minutes.','Season with salt, pepper, and fresh or dried herbs like parsley or thyme.','Simmer for a few more minutes until noodles are tender and chicken is fully cooked.','Serve hot, garnished with fresh parsley if desired.'] },
    50: { title: 'Coconut Milk Vegetable Curry', steps: ['Peel and finely dice onion', 'Core bell peppers and cut into wide strips', 'Cut zucchini and carrot into about 1 cm cubes', 'Heat oil in sufficiently large pot and steam onion for about 2 minutes', 'Add curry powder generously (about 2 tbsp) and toast for about 1 minute', 'Add all vegetable pieces and briefly stir', 'Pour in coconut milk and bring to boil', 'Simmer for about 15-20 minutes until vegetables are tender', 'Season with salt and lemon juice, serve with rice'] },
    51: { title: 'Salad with Parmesan and Croutons', steps: ['Remove crust from bread slices and cut into 1-2 cm cubes. Toast in pan with olive oil at medium heat for about 5-7 minutes with regular stirring until golden and crispy. Season with salt and drain on paper towels', 'Thoroughly wash fresh lettuce, spin dry and tear into bite-sized pieces. Place in large bowl', 'Whisk olive oil, vinegar, salt and pepper to vinaigrette. Pour over salad and toss well', 'Distribute warm croutons over salad', 'Shave Parmesan over with vegetable peeler', 'Serve immediately so croutons stay crispy'] },
    52: { title: 'Caprese Salad', steps: ['Wash fresh, ripe tomatoes and cut with sharp knife into about 8-10 mm thick slices. Also slice mozzarella evenly', 'Arrange tomato and mozzarella slices alternating on plate or overlapping', 'Place fresh basil leaves between slices or on top. Season with coarse sea salt and freshly ground pepper', 'Drizzle generously with high-quality olive oil', 'Optionally add splash of balsamic vinegar', 'Serve immediately - best at room temperature'] },
    53: { title: 'Potato Salad', steps: ['Wash starchy potatoes and cook in salt water for about 15-20 minutes until done. Drain and cool slightly', 'Peel still warm potatoes and cut into about 5-7 mm thick slices. Place in large bowl', 'Finely chop onion and mix with vinegar, some water, mustard, olive oil, salt and pepper. Pour this marinade over still warm potatoes and carefully mix', 'Let draw for at least 30 minutes at room temperature so flavors meld', 'Season again with salt and pepper before serving', 'Serve lukewarm or cold'] },
    54: { title: 'Beet Salad', steps: ['Thoroughly brush beets under running water to remove dirt. Cook with skin in salt water for about 45-60 minutes until done', 'Let cool, then peel skin with fingers or knife. Wear protective gloves to avoid staining', 'Cut cooked beets into about 5 mm thick slices or dice', 'Finely chop onion and add', 'Whisk olive oil, vinegar, salt and pepper to dressing. Pour over beets and carefully mix', 'Optionally add fresh herbs like dill or parsley', 'Let draw for at least 30 minutes', 'Can be garnished with feta or goat cheese'] },
    55: { title: 'Chicken Salad with Walnuts', steps: ['Cut chicken fillet into about 2-3 cm wide strips. Fry in pan with some olive oil at medium-high heat for about 8-12 minutes until meat is cooked through and yellowish-brown. Season with salt and let cool', 'Thoroughly wash fresh lettuce, spin dry and tear into bite-sized pieces. Peel and slice apples. Coarsely chop walnuts and toast in dry pan until fragrant', 'Crumble Roquefort cheese into small pieces', 'Arrange lettuce, apple slices, cooled chicken, walnuts and cheese on plates', 'Drizzle with olive oil-vinegar dressing', 'Serve immediately'] },
    56: { title: 'Colorful Summer Salad with Cheese', steps: ['Wash fresh lettuce and spin dry. Tear into bite-sized pieces and place in large salad bowl', 'Wash tomatoes, remove core and cut into cubes of about 1-2 cm. Wash cucumber and also dice. Core bell pepper and cut into about 1 cm wide strips. Cut cheese into about 1 cm cubes', 'Add all prepared vegetables and cheese to lettuce', 'Prepare dressing from olive oil, vinegar, salt, pepper and optional herbs. Pour over salad', 'Toss well and serve immediately'] },
    57: { title: 'Fennel Salad', steps: ['Wash fresh fennel bulbs and set aside green fronds for garnish. Slice fennel bulbs very thinly (about 2-3 mm) with very sharp knife or mandoline. Inner tender leaves are especially delicate', 'Halve lemon and squeeze. Mix lemon juice with olive oil, salt and freshly ground pepper to vinaigrette', 'Pour dressing over sliced fennel and carefully toss', 'Let draw for 10-15 minutes at room temperature', 'Garnish with fennel fronds before serving', 'Optionally add shaved Parmesan'] },
    58: { title: 'Coleslaw with Lime', steps: ['Wash white cabbage, cut out core and slice very thinly into threads with very sharp knife or mandoline. Place in large bowl', 'Squeeze limes. Mix vigorously with mustard, olive oil, salt and pepper', 'Pour lime dressing over cabbage and intensively knead and massage with hands for about 5-7 minutes. This breaks down cell structure and cabbage becomes more digestible', 'Let draw in refrigerator for at least 1 hour', 'Season again and serve cold'] },
    59: { title: 'Tuna Salad', steps: ['Drain canned tuna well and fluff piece by piece with fork. Place in bowl', 'Also drain kidney beans and corn. Peel and finely chop onion and add. Mix everything lightly', 'For dressing: Thoroughly mix vinegar and olive oil with salt and pepper and pour over tuna-vegetable mix', 'Carefully toss so everything is combined', 'Let draw in refrigerator for at least 30 minutes', 'Optionally garnish with fresh herbs before serving'] },
    60: { title: 'Shrimp Salad with Lime', steps: ['Fry shrimp in pan with some olive oil at high heat for about 2-3 minutes per side until pink and opaque. Season with salt and let cool', 'Wash fresh lettuce and spin dry. Tear into bite-sized pieces. Core bell pepper and cut into strips. Wash cucumber and slice thinly', 'Arrange all ingredients in bowl', 'Squeeze lime and mix juice with olive oil, salt and pepper to dressing', 'Pour dressing over and toss well', 'Serve immediately while shrimp are still lukewarm'] },
    61: { title: 'Apple-Walnut Salad', steps: ['Wash fresh, crisp lettuce and spin dry. Tear into bite-sized pieces', 'Peel apples with vegetable peeler, quarter and remove core. Slice thinly and drizzle with some vinegar to prevent browning', 'Coarsely chop walnuts and toast in dry pan for about 2-3 minutes until fragrant', 'Cut cheese (e.g. Gouda or Cheddar) into small cubes', 'Arrange lettuce, apple slices, walnuts and cheese in bowl', 'Prepare dressing from olive oil, vinegar, honey, salt and pepper', 'Pour over and serve immediately'] },
    62: { title: 'Beet-Bread Salad', steps: ['Brush beets under water and cook with skin in salt water for about 50-60 minutes until done. Cool in water, then peel and cut into about 1 cm cubes', 'Cut bread slices into about 1-2 cm cubes and toast in pan with some olive oil at medium heat for about 5-7 minutes until golden. Season with salt', 'Crumble or dice feta cheese', 'Mix everything in bowl', 'Prepare dressing from olive oil, vinegar, salt and pepper and pour over', 'Optionally add fresh herbs', 'Serve immediately while bread is still crispy'] },
    63: { title: 'Simple Apple Cake', steps: ['Preheat oven to 180 Grad C and line cake pan with parchment', 'Peel apples, quarter, remove core and slice into about 5mm slices', 'Beat butter and sugar creamy for about 2-3 minutes until light and fluffy', 'Mix in eggs one at a time, making sure each egg is incorporated before next comes', 'Mix flour with baking powder and fold in alternating with some milk', 'Spread 2/3 of batter in pan, arrange apple slices on top', 'Spread remaining batter over apples', 'Bake at 180 Grad C for about 40-45 minutes until golden', 'Let cool slightly and serve warm or cold'] },
    64: { title: 'Lemon Cake', steps: ['Preheat oven to 180 Grad C, grease loaf pan and dust with flour', 'Wash lemon hot, grate to take zest, squeeze to get juice', 'Beat butter and sugar creamy until light, then mix in eggs one at a time', 'Stir in lemon zest + 2-3 tbsp lemon juice, fold in flour and baking powder', 'Pour batter into pan and bake at 180 Grad C for about 35-40 minutes', 'Mix powdered sugar with lemon juice to glaze', 'Pour glaze over still slightly warm cake', 'Let cool completely before slicing'] },
    65: { title: 'Chocolate Mousse', steps: ['Finely chop high-quality chocolate (min. 70%) and place in bowl', 'Separate egg whites from yolks very carefully - no yolk in whites!', 'Beat cream (100ml) stiff and set aside', 'Beat egg whites with 1 tbsp sugar stiff', 'Beat yolks with remaining sugar foamy', 'Pour liquid yolk mixture over liquid chocolate and stir', 'Carefully fold in beaten egg whites', 'Finally fold in whipped cream', 'Fill into glasses and refrigerate for at least 4 hours', 'Serve cold with optional berries'] },
    66: { title: 'Vanilla Pannacotta', steps: ['Let gelatin soak in cold water for 5 minutes according to package', 'Heat cream and milk together with sugar until just steaming', 'Split vanilla pod lengthwise, scrape out seeds and stir into hot cream', 'Add soaked gelatin and dissolve while stirring', 'Carefully strain through sieve into bowl', 'Pour into glasses or molds', 'Refrigerate for at least 4 hours until set', 'Turn out or serve in glasses with berry sauce'] },
    67: { title: 'Strawberry Compote', steps: ['Wash strawberries, remove stems and leave whole or halve if very large', 'Place in pot, sprinkle with sugar about 2-3 tbsp per 500g strawberries', 'Let stand for 5-10 minutes so strawberries release juice', 'Heat slowly until just starting to simmer - then immediately reduce heat', 'Simmer gently for about 3-5 minutes', 'Add lemon juice for seasoning', 'Fill into jars and let cool', 'Serve with vanilla ice cream or whipped cream'] },
    68: { title: 'Garlic-Olive Oil Bread', steps: ['Cut bread into about 1cm thick slices', 'Grate garlic very finely or grate garlic on grater over bread', 'Drizzle generously with good olive oil', 'Sprinkle finely chopped fresh parsley on top', 'Season with salt shaker', 'Toast in oven at 200 Grad C for about 5-8 minutes until lightly golden-crispy', 'Serve still warm - quickly becomes soggy'] },
    69: { title: 'Cheese-Bread Canapßs', steps: ['Cut bread into about 1cm thick slices and halve diagonally to get triangles', 'Briefly toast in oven at 200 Grad C until slightly hard - not dry!', 'Core tomato and dice small, season with pinch of salt', 'Slice cheese (e.g. mozzarella) thinly or dice', 'Layer tomato on still lukewarm bread, place cheese on top', 'Drizzle with fresh basil and olive oil', 'Serve as appetizer or snack'] },
    70: { title: 'Bruschetta with Tomatoes', steps: ['Cut bread into about 1cm thick slices', 'Brush with some olive oil and toast in oven at 200 Grad C for about 5-8 minutes until golden', 'While still hot, rub with halved garlic clove', 'Core tomatoes and dice small, place in bowl', 'Season with vinegar, olive oil, salt and grated basil', 'Marinate for 10-15 minutes so flavors blend', 'Distribute tomato mixture on toasted bread', 'Serve immediately'] },
    71: { title: 'Potato Gnocchi', steps: ['Cook starchy potatoes in salt water for about 20 minutes until done. Drain and press through potato ricer while still warm or peel and mash. Let cool slightly', 'Mix potato mass with flour, eggs and salt and knead to smooth dough for about 2-3 minutes. Dough should not be sticky but not dry', 'Form dough into long rolls and cut into about 2cm pieces', 'Roll each piece over fork to create grooves', 'Cook gnocchi in boiling salt water for about 2-3 minutes until they float', 'Lift out with slotted spoon, drain well', 'Toss in melted butter and serve with sauce'] },
    72: { title: 'Chickpea Curry', steps: ['Peel and finely dice onion. Steam in large pot with 2 tbsp olive oil at medium heat for about 5-7 minutes until translucent. Finely chop garlic, add and fry for about 1 minute', 'Add curry powder and toast under stirring for about 30 seconds until fragrant. Pour in coconut milk and mix well', 'Add chickpeas (from can, drained) or cooked chickpeas', 'Simmer for about 15-20 minutes at low heat', 'Season with salt, pepper and optional lemon juice', 'Serve with rice or naan bread'] },
    73: { title: 'Lentil Stew', steps: ['Peel and dice carrots and onion (about 1 cm). Steam in large pot with some olive oil at medium heat for about 7-10 minutes', 'Finely chop garlic and add, fry for about 1 minute. Add red or brown lentils and briefly stir', 'Pour in broth or water (about 1 liter for 250 g lentils). Bring to boil, then reduce heat', 'Simmer for about 20-30 minutes until lentils are soft', 'Season with salt, cumin and optional chili', 'Serve with fresh bread or rice'] },
    74: { title: 'Beet Soup (Borscht)', steps: ['Thoroughly brush beets under water. Cook with skin in salt water for about 50-60 minutes until done. Remove from water, cool, then peel and dice', 'Peel and dice onion and steam in large pot with some olive oil at medium heat for about 5-7 minutes. Add beet cubes', 'Pour in beef broth and bring to boil. Simmer for about 20-25 minutes', 'Season with vinegar, sugar, salt and pepper', 'Optionally puree part of soup for creamier texture', 'Serve with sour cream dollop and fresh dill'] },
    75: { title: 'Pumpkin Soup', steps: ['Peel Hokkaido or butternut pumpkin (or use with skin) and cut into about 2-3 cm cubes. Peel and dice onion', 'Steam onion in large pot with some butter at medium heat for about 5 minutes. Add pumpkin and briefly stir', 'Pour in broth (about 1 liter) and bring to boil. Simmer gently for about 20-25 minutes until pumpkin is very soft', 'Puree with immersion blender until creamy', 'Stir in cream, season with salt, pepper and nutmeg', 'Optionally garnish with roasted pumpkin seeds', 'Serve hot'] },
    76: { title: 'Asparagus Soup', steps: ['Wash fresh white or green asparagus. Peel lower 3-4 cm. Cut off woody ends about 2 cm. Cut asparagus into about 3-4 cm long pieces. For green asparagus only peel lower third', 'Peel and dice potatoes and cook together with onion and asparagus in plenty of broth at medium heat for about 15-20 minutes until potatoes are very soft', 'Puree with immersion blender until creamy', 'Stir in cream and butter, season with salt, pepper and nutmeg', 'Optionally set aside some asparagus tips and add at end for garnish', 'Serve hot'] },
    77: { title: 'Dill-Potato Stew', steps: ['Peel and dice potatoes (about 2 cm). Peel and dice onion', 'Steam onion in large pot with some butter at medium heat for about 5 minutes. Add potatoes and briefly stir', 'Pour in broth and bring to boil. Simmer for about 15-20 minutes until potatoes are very soft. Add finely chopped fresh dill', 'For creamier texture, puree part of soup or mash with potato masher', 'Stir in cream and season with salt and pepper', 'Serve with fresh dill'] },
    78: { title: 'Quick Minestrone', steps: ['Wash and dice vegetables (zucchini, carrot, bell pepper) (about 1 cm). Peel and chop onion', 'Steam onion in large pot with some olive oil at medium heat for about 5 minutes. Add vegetables and briefly stir', 'Add canned tomatoes, broth, drained beans (e.g. kidney beans or white beans) and pasta. Bring to boil and simmer for about 15-20 minutes until pasta is al dente', 'Season with salt, pepper and Italian herbs', 'Optionally add fresh basil', 'Serve with grated Parmesan'] },
    79: { title: 'Mozzarella-Tomato Risotto', steps: ['Peel and finely dice onion. Steam in large pot with some butter at medium heat for about 5-7 minutes until translucent. Add rice and toast under stirring for about 2-3 minutes (translucent but not brown)', 'Deglaze with white wine and let reduce under stirring for about 2 minutes. Slowly add broth (about 750 ml total) bit by bit', 'Stir constantly and keep adding stock as rice absorbs it for about 18-20 minutes', 'Dice tomatoes and mozzarella, add to risotto at end and stir', 'Season with salt, pepper and fresh basil', 'Serve immediately while still creamy'] },
    80: { title: 'Broccolini with Garlic', steps: ['Wash fresh broccolini and cut off lower 2 cm of stems. Halve stems lengthwise for even cooking', 'Bring large pot of salt water to boil. Blanch broccolini for about 3-4 minutes until bright green and crisp-tender. Drain', 'Heat olive oil in large pan. Finely chop garlic and lightly toast for about 1 minute until fragrant but not brown', 'Add blanched broccolini and toss in garlic oil for about 2 minutes', 'Season with salt, pepper and lemon zest', 'Serve hot as side dish'] },
    81: { title: 'Eggplant Casserole', steps: ['Wash eggplants and slice lengthwise into about 1 cm thick slices. Sprinkle with salt and let stand for about 30 minutes so water comes out. Then pat dry briefly', 'Fry eggplant slices in pan with olive oil at medium-high heat for about 3-4 minutes per side until golden. Layer on paper towels', 'Dice tomatoes and onion, chop garlic. Pit olives', 'sauté onion and garlic in oil until translucent', 'Add tomatoes and simmer for about 10 minutes. Season with salt, pepper and oregano', 'Layer half eggplant in greased casserole dish, spread tomato sauce over, sprinkle with cheese. Repeat', 'Bake in preheated 180 Grad C oven for about 30-35 minutes until golden'] },
    82: { title: 'Celery Soup with Apple', steps: ['Clean and wash celery and cut into about 2 cm segments. Peel and dice onion. Peel, quarter and dice apples', 'Steam onion in large pot with some butter at medium heat for about 5 minutes. Add celery and apples and briefly stir', 'Pour in broth and bring to boil. Simmer for about 20-25 minutes until everything is soft', 'Puree with immersion blender until creamy', 'Stir in cream, season with salt, pepper and optional nutmeg', 'Serve hot, optionally garnish with apple pieces'] },
    83: { title: 'Beef Stir-Fry', steps: ['Cut beef into about 5 mm thick strips against grain. Core bell pepper and cut into wide strips. Peel onion and cut into wide strips. Finely chop garlic and ginger', 'Heat sesame oil in wok or large pan at very high heat. Fry beef in batches for about 2-3 minutes per side until browned. Set aside', 'Add vegetables to same wok and stir-fry for about 3-4 minutes', 'Return beef, add garlic and ginger, drizzle with soy sauce', 'Toss everything for about 1-2 minutes', 'Serve immediately over rice'] },
    84: { title: 'Beef Kebab with Yogurt', steps: ['Cut beef into about 4-5 cm cubes. Peel and dice onion. Squeeze lemon', 'Mix yogurt with lemon juice, cumin, paprika powder, salt and pepper. Add beef and onion to marinade and mix well. Marinate in refrigerator for at least 4 hours or overnight', 'Thread meat and onion onto skewers', 'Grill or fry in hot pan for about 10-12 minutes turning regularly', 'Serve with rice, salad and optional yogurt sauce'] },
    85: { title: 'Pork Asian-Style with Broccoli', steps: ['Cut pork into about 5 mm thick strips against grain. Divide broccoli into small florets. Finely chop garlic and ginger', 'Heat sesame oil in wok or large pan at very high heat. Fry pork in batches for about 2-3 minutes per side until browned. Set aside', 'Add broccoli to same wok and stir-fry for about 3-4 minutes', 'Return pork, add garlic and ginger, drizzle with soy sauce', 'Toss everything for about 2-3 minutes', 'Serve immediately over rice or noodles'] },
    86: { title: 'Pork Fillet Mustard Sauce', steps: ['Season pork fillet with salt and pepper. Fry in pan with some butter and olive oil at medium-high heat for about 4-5 minutes per side until surface is golden and internal temperature about 63 Grad C (pink). Set aside and keep warm', 'Deglaze same pan with some broth or water. Add mustard and stir', 'Add cream and let thicken for about 3-5 minutes', 'Season with salt and pepper', 'Slice pork and arrange on plates', 'Pour mustard sauce over', 'Garnish with fresh parsley'] },
    87: { title: 'Chicken Piccata with Lemon', steps: ['Halve chicken breast lengthwise and pound to about 1 cm thick schnitzels. Season with salt and pepper and lightly dredge in flour, tapping off excess', 'Heat butter and olive oil in pan at medium-high heat. Fry schnitzels for about 3-4 minutes per side until golden and cooked through. Set aside', 'Deglaze same pan with white wine and lemon juice. Add capers', 'Let reduce for about 2-3 minutes', 'Return chicken briefly to sauce', 'Serve with sauce and lemon slices'] },
    88: { title: 'Chicken Teriyaki', steps: ['Cut chicken fillet into about 2 cm wide strips. Finely chop ginger, mince garlic', 'Heat sesame oil in large pan or wok at high heat. Fry chicken for about 3-4 minutes per side until golden. Season with salt and set aside', 'Fry ginger and garlic in same wok for about 1 minute. Add teriyaki sauce and bring to boil', 'Return chicken and toss in sauce for about 2-3 minutes', 'Optionally sprinkle with sesame seeds', 'Serve over rice or noodles'] },
    89: { title: 'Spinach-Ricotta Ravioli', steps: ['Thoroughly wash fresh spinach and simmer in salt water for about 3-4 minutes. Drain and finely chop', 'Mix ricotta with Parmesan, eggs, spinach, salt and pepper until creamy filling forms', 'If ravioli not filled: Roll out dough, distribute filling in small portions on half of dough sheet, brush with water and fold over', 'Press edges firmly and cut out ravioli', 'Cook in boiling salt water for about 3-4 minutes until they float', 'Serve with butter-sage sauce or tomato sauce'] },
    90: { title: 'Pasta with Spicy Tomato Sauce', steps: ['Heat canned tomatoes in pan. Finely chop garlic and fry in olive oil at medium heat for about 2-3 minutes until fragrant but not brown', 'Add tomatoes and bring to boil. Add fresh or dried chili threads. Simmer for about 15-20 minutes to thicken sauce', 'Meanwhile cook pasta in plenty of salt water until al dente according to package', 'Drain pasta and toss with spicy tomato sauce', 'Optionally add fresh basil', 'Serve with grated Parmesan'] },
    92: { title: 'Cod in Tomato-Herb Sauce', steps: ['Finely chop garlic. Fry in pan with olive oil at medium heat for about 1-2 minutes until fragrant but not brown', 'Add canned tomatoes and bring to boil. Finely chop fresh herbs (basil, oregano, parsley) and add. Simmer for about 10-15 minutes', 'Season cod fillets with salt and place on tomato sauce', 'Cover and let cook gently for about 10-12 minutes until fish is opaque', 'Optionally add olives', 'Serve with rice or bread'] },
    93: { title: 'Trout with Butter and Parsley', steps: ['Finely chop fresh parsley. Pat trout dry with paper towels and season inside and outside with salt', 'Heat plenty of butter in large pan until it starts to foam', 'Fry trout for about 4-5 minutes per side until skin is golden and flesh is white (internal temp about 63 Grad C)', 'Sprinkle chopped parsley over fish', 'Drizzle with lemon juice and serve immediately'] },
    96: { title: 'Fish Pan with Onion and Garlic', steps: ['Peel onion and cut into thin rings. Finely chop garlic', 'Heat olive oil in large pan at medium heat. sauté onion for about 5 minutes until translucent. Add garlic and fry for about 1 minute', 'Season fish fillets with salt and pepper and place on onion-garlic mixture. Simmer gently for about 8-12 minutes until fish is done', 'Carefully lift out fish with spatula', 'Serve with onion-garlic mixture as topping'] },
    97: { title: 'Cod with Mustard and Cream', steps: ['Mix mustard and cream in bowl. Season with salt and pepper', 'Heat butter in pan at medium heat. Fry cod fillets for about 3-4 minutes per side until golden. Season with salt', 'Spread mustard-cream sauce over fish. Cover and simmer for about 5-8 minutes at low heat', 'Serve and optionally garnish with fresh dill'] },
    98: { title: 'Salmon Fillet with Honey and Soy Sauce', steps: ['Mix honey, soy sauce and finely chopped garlic. Season with pepper', 'Place salmon fillets on baking sheet with parchment. Spread honey-soy sauce mixture on fish', 'Bake in preheated oven at 180 Grad C for about 12-15 minutes until surface starts to caramelize and fish is cooked through', 'Serve warm with rice and vegetables'] },
    99: { title: 'Trout with Almonds and Lemon', steps: ['Coarsely chop almonds and lightly toast in dry pan', 'Season trout inside and outside with salt', 'Fry in hot butter for about 4-5 minutes per side', 'Distribute toasted almonds over fish', 'Drizzle with lemon juice and cook for another 2 minutes', 'Serve hot on plates'] },
    100: { title: 'Fish Soup with Tomato', steps: ['Peel and finely chop onion and garlic. Steam in large pot with olive oil at medium heat for about 5 minutes', 'Add canned tomatoes and stir well. Pour in fish stock or vegetable stock (about 1 liter). Bring to boil', 'Cut fish fillets into about 3-4 cm pieces and add to boiling soup. Simmer gently for about 8-10 minutes until fish is done', 'Season with salt, pepper and fresh herbs', 'Serve hot with fresh bread'] },
    101: { title: 'Tuna with Beans', steps: ['Peel and finely chop onion. sauté in pan with olive oil at medium heat for about 5 minutes until translucent', 'Add canned tuna (well drained) and fluff with fork. Stir for about 2-3 minutes to heat', 'Add cooked beans (from can, drained) and heat through for another 3-5 minutes at low heat', 'Season with salt and pepper', 'Serve warm with fresh salad'] },
    103: { title: 'Cod with Lemon-Butter', steps: ['Halve lemon and squeeze. Slowly melt butter in pan, not too hot', 'Season cod fillets with salt and pepper. Gently fry in melting butter for about 4-5 minutes per side', 'Stir lemon juice into butter. Continue cooking for about 1 minute until fish is white and flaky', 'Season with fresh pepper and serve immediately'] },
    104: { title: 'Trout in Oven with Herbs', steps: ['Gut trout (if necessary) and pat dry with paper towels', 'Season inside and outside with salt', 'Fill fish belly cavity with fresh herbs and lemon slices', 'Place on baking sheet lined with parchment', 'Drizzle with olive oil', 'Bake at 200 Grad C for about 18-20 minutes until fish is completely white', 'Serve warm'] },
    105: { title: 'Salmon with Broccoli', steps: ['Divide broccoli into small florets and wash thoroughly. Blanch in salt water for about 4-5 minutes until crisp-tender. Drain', 'Place salmon fillets on baking sheet with parchment. Drizzle with olive oil and season with salt', 'Distribute broccoli next to salmon. Bake in preheated oven at 200 Grad C for about 12-15 minutes', 'Drizzle with fresh lemon juice and serve'] },
    106: { title: 'Fish Curry with Coconut Milk', steps: ['Peel and finely dice onion. Steam in large pot with olive oil at medium heat for about 5-7 minutes', 'Add curry powder and toast under stirring for about 30 seconds until fragrant. Pour in coconut milk (about 400 ml) and mix well', 'Cut fish fillets into about 4-5 cm pieces and add to boiling curry sauce. Simmer gently for about 10-12 minutes until fish is done', 'Season with salt and lemon juice', 'Serve with rice and naan bread'] },
    108: { title: 'Salmon in Mustard-Herb Sauce', steps: ['Finely chop fresh herbs (dill, parsley, chives). Mix mustard and cream in bowl and blend with herbs. Season with salt', 'Fry salmon fillets in pan with some butter for about 3-4 minutes per side until browned outside, still slightly pink inside', 'Spread mustard-cream-herb sauce over salmon. Cover and simmer for about 3-5 minutes at low heat', 'Serve with potatoes or rice'] },
    109: { title: 'Tuna Pasta', steps: ['Add canned tomatoes to pot. Finely chop garlic and fry in olive oil at medium heat for about 1-2 minutes', 'Add fried garlic-oil to tomatoes. Season with salt and pepper. Simmer for about 15-20 minutes until sauce forms', 'Meanwhile cook penne in plenty of salt water according to package. Drain in colander', 'Add drained canned tuna (fluffed with fork) to tomato sauce and heat', 'Toss pasta with tuna-tomato sauce', 'Serve with fresh basil and optional Parmesan'] },
    110: { title: 'Trout with Potatoes', steps: ['Peel, wash and dice potatoes (about 1 cm). Cook in salt water for about 15 minutes until done. Drain and keep warm', 'Finely chop fresh parsley. Pat trout dry with paper towels and season inside and outside with salt', 'Heat butter in pan at medium-high heat until foaming. Fry trout for about 4-5 minutes per side until skin is golden and flesh is white', 'Add potatoes to pan and toss in butter', 'Sprinkle with parsley and serve immediately'] },
    111: { title: 'Salmon with Lime and Chili', steps: ['Squeeze lime. Finely chop fresh or dried chili (without seeds for less heat)', 'Place salmon fillets on baking sheet with parchment. Brush with olive oil, season with salt. Sprinkle chili over', 'Bake in preheated oven at 200 Grad C for about 12-15 minutes until surface is lightly browned', 'Drizzle with lime juice and serve immediately'] },
    112: { title: 'Cod in Garlic-Oil', steps: ['Peel garlic and slice thinly. Heat high-quality olive oil in pan at medium heat', 'Add garlic slices to olive oil and gently fry for about 2-3 minutes until golden but not brown', 'Season cod fillets with salt and pepper. Place in garlic-olive oil and fry for about 4-5 minutes per side until fish is opaque', 'Serve with garlic-oil drizzled over'] },
    113: { title: 'Fish in Oven with Vegetables', steps: ['Slice zucchini, bell pepper and tomato thinly', 'Distribute vegetables on baking sheet, drizzle with olive oil and salt', 'Cook for 15 minutes at 200 Grad C', 'Place fish fillet on vegetables, season', 'Bake for another 12-15 minutes until fish is done', 'Serve and optionally garnish with fresh herbs'] },
    114: { title: 'Salmon with Honey-Mustard', steps: ['Mix honey and mustard in bowl. Season with freshly ground pepper', 'Place salmon fillets on baking sheet with parchment. Drizzle with some olive oil and spread honey-mustard mixture on each fillet', 'Bake in preheated oven at 180 Grad C for about 12-15 minutes until surface caramelizes and fish is cooked through', 'Serve warm with vegetables'] },
    116: { title: 'Cod with Tomatoes and Olives', steps: ['Finely chop garlic. Add canned tomatoes to pot. Simmer with garlic-oil at medium heat for about 10 minutes', 'Add olives (pitted) and simmer for another 3-5 minutes. Season with salt and optional sugar', 'Season cod fillets with salt and place on tomato-olive sauce. Cover and simmer gently for about 12-15 minutes until done', 'Garnish with fresh basil and serve'] },
    118: { title: 'Salmon Fillet with Sesame', steps: ['Toast sesame in pan without oil until fragrant', 'Place salmon fillets on baking sheet', 'Brush with soy sauce', 'Sprinkle plenty of toasted sesame on salmon', 'Season with pepper', 'Bake at 180 Grad C for about 12-15 minutes', 'Serve immediately while still warm'] },
    120: { title: 'Cod on Spinach', steps: ['Thoroughly wash fresh spinach. Simmer in large pot with some butter at medium heat for about 3-5 minutes until wilted. Season with salt', 'Distribute cooked spinach in casserole dish. Place cod fillets on top and season with salt', 'Mix cream in bowl with finely chopped garlic. Distribute over cod', 'Bake in preheated oven at 180 Grad C for about 15-18 minutes until fish is opaque', 'Serve hot'] },
    121: { title: 'Salmon with Mashed Potatoes', steps: ['Peel and dice potatoes (about 2 cm), cook in salt water for about 15-20 minutes until done', 'Pat salmon fillet dry and season with salt', 'Melt butter in pan at medium heat', 'Fry salmon fillet for about 4-5 minutes per side until tender pink', 'Remove cooked potatoes from water and set aside for mashing', 'Mash potatoes with warm milk and butter until smooth', 'Serve salmon on mashed potatoes'] },
    122: { title: 'Tuna with Bell Peppers', steps: ['Core bell pepper and cut into thin rings', 'Peel onion and cut into half rings', 'Drain canned tuna and fluff with fork', 'sauté onion in olive oil for about 2-3 minutes until translucent', 'Add bell pepper rings and cook for another 3-4 minutes at medium heat', 'Add tuna and stir briefly', 'Heat through for about 5 minutes', 'Season with salt and pepper and serve'] },
    123: { title: 'Trout with Garlic Butter', steps: ['Peel garlic and slice thinly', 'Melt butter in wide pan at medium heat', 'Pat trout dry with paper towels', 'Season with salt and pepper outside and inside', 'Place in melting butter and fry for about 4-5 minutes per side', 'Add sliced garlic to remaining butter and serve with fish', 'Serve hot'] },
    124: { title: 'Salmon in Lemon-Cream', steps: ['Halve lemon and squeeze, set juice aside', 'Place salmon fillet on baking sheet with parchment', 'Finely chop dill and set aside', 'Mix cream with lemon juice and salt to fine sauce', 'Stir dill into cream mixture', 'Distribute cream-dill sauce over salmon', 'Bake in oven preheated to 180 Grad C for about 12-15 minutes until fish is done', 'Serve warm'] },
    125: { title: 'Cod with Herbs and Rice', steps: ['Pat cod dry with paper towels', 'Cook rice according to package in salt water', 'Finely chop fresh herbs (parsley, dill, chives)', 'Season salmon fillet with salt and pepper', 'Fry in olive oil at medium heat for about 4-5 minutes per side', 'Distribute cooked rice on plates', 'Place fried cod on rice', 'Sprinkle with fresh herbs and serve'] },
    126: { title: 'Fish Pan with Tomato and Zucchini', steps: ['Pat fish fillet dry and season with salt', 'Core tomato and dice small', 'Wash zucchini and slice thinly', 'Distribute vegetables on baking sheet', 'Drizzle with some olive oil and season', 'Place fish on vegetables and also drizzle with oil and season', 'Bake in oven preheated to 200 Grad C for about 12-15 minutes until fish is done', 'Serve hot'] },
    127: { title: 'Salmon with Spinach and Cheese', steps: ['Thoroughly wash spinach and blanch in salt water for about 3 minutes', 'Cool in ice bath and squeeze dry in kitchen towel', 'Pat salmon fillet dry', 'Briefly bring cream to boil and mix with finely grated cheese', 'Distribute spinach on baking sheet', 'Place salmon fillet on top and pour cheese-cream sauce over', 'Garnish with remaining cheese on top', 'Bake in oven preheated to 180 Grad C for about 18-22 minutes', 'Serve hot'] },
    128: { title: 'Tuna with Corn and Beans', steps: ['Drain tuna and fluff', 'Drain corn, drain beans', 'Peel and finely dice onion', 'Place all components in bowl and mix lightly', 'Whisk olive oil with some vinegar to dressing', 'Pour over tuna-vegetable mixture', 'Let draw for about 10 minutes so flavors blend', 'Serve garnished with fresh herbs'] },
    129: { title: 'Cod with Lemon-Pepper', steps: ['Pat cod dry and season with salt', 'Halve lemon and squeeze', 'Heat olive oil in pan at medium heat', 'Fry cod for about 4-5 minutes per side until done', 'Generously grind fresh pepper over', 'Drizzle with lemon juice for seasoning', 'Arrange on plates and serve immediately'] },
    130: { title: 'Trout with Vegetables', steps: ['Cut zucchini and bell pepper into coarse pieces', 'Distribute vegetables on baking sheet, salt lightly', 'Place trout on vegetables, drizzle with olive oil and season', 'Bake at 200 Grad C for about 18 minutes until fish and vegetables are done', 'Serve on plates'] },
    131: { title: 'Salmon with Broccoli and Rice', steps: ['Divide broccoli into small florets and wash thoroughly', 'Blanch in salt water for about 4-5 minutes until crisp-tender', 'Cook rice according to package', 'Place salmon fillet on baking sheet with parchment', 'Drizzle with olive oil and season with salt', 'Distribute broccoli florets next to salmon', 'Bake in oven preheated to 200 Grad C for about 12-15 minutes', 'Serve with lemon'] },
    132: { title: 'Fish with Garlic and Lemon', steps: ['Pat fish fillet dry', 'Finely chop or press garlic', 'Halve lemon and squeeze', 'Heat olive oil in pan at medium heat', 'sauté garlic for about 1 minute until fragrant but not brown', 'Add fish fillet and fry for about 4-5 minutes per side', 'Season with lemon juice and salt', 'Arrange on plates and serve'] },
    133: { title: 'Cod with Tomato-Bell Pepper', steps: ['Pat cod dry and season with salt', 'Core tomato and dice small', 'Core bell pepper and cut into wide strips', 'Peel and chop onion', 'sauté onion in oil for 2 minutes', 'Add bell pepper strips and cook for another 2 minutes', 'Add tomato cubes and mix', 'Place cod fillet on tomato-bell pepper mixture', 'Simmer covered for about 10-12 minutes until done', 'Season and serve hot'] },
    134: { title: 'Salmon with Herb Crust', steps: ['Pat salmon dry', 'Finely chop herbs and mix with breadcrumbs', 'Season salmon with pinch of salt', 'Press herb-breadcrumb mixture onto surface of salmon', 'Melt butter in pan at medium heat', 'Fry salmon crust side down for about 4-5 minutes in butter', 'Carefully turn and fry for another 3-4 minutes', 'Serve with fresh salad'] },
    136: { title: 'Tuna with Rice and Sesame', steps: ['Toast sesame in dry pan without oil until fragrant', 'Cook rice according to package in salt water', 'Drain tuna and fluff', 'Dilute soy sauce with some water', 'Heat tuna in pan with oil for about 2 minutes', 'Season with soy sauce mixture and mix', 'Serve on cooked rice', 'Sprinkle generously with toasted sesame'] },
    137: { title: 'Fish in Cream-Herb Sauce', steps: ['Pat fish fillet dry and season with salt', 'Peel and chop onion', 'Finely chop herbs (parsley, dill, chives)', 'sauté onion in oil for 2 minutes', 'Add cream and briefly bring to boil', 'Stir in chopped herbs and season with salt', 'Place fish in this sauce and simmer covered for about 8-10 minutes until done', 'Garnish with rest of dill and serve'] },
    138: { title: 'Cod with Spinach and Garlic', steps: ['Pat cod dry and season with salt', 'Thoroughly wash spinach and blanch for about 2-3 minutes, squeeze dry', 'Halve lemon and squeeze', 'Arrange spinach with some olive oil on baking sheet', 'Place cod on top and drizzle with lemon juice', 'Bake in oven preheated to 200 Grad C for about 12-15 minutes', 'Season with salt and pepper'] },
    139: { title: 'Salmon with Tomatoes and Basil', steps: ['Pat salmon dry', 'Core tomatoes and dice', 'Wash basil and pluck leaves', 'Place salmon on baking sheet with parchment', 'Drizzle with olive oil and season with salt', 'Distribute tomato cubes around salmon', 'Bake in oven preheated to 200 Grad C for about 12-15 minutes', 'Garnish with fresh basil before serving'] },
    140: { title: 'Trout with Dill and Butter', steps: ['Finely chop fresh dill', 'Heat butter in large pan', 'Season trout with salt and pepper', 'Fry for about 4 minutes per side in butter until golden', 'Sprinkle chopped dill over fish', 'Let draw for another 1-2 minutes and serve'] },
    141: { title: 'Fish-Vegetable Pan', steps: ['Pat fish fillet dry', 'Core bell pepper and cut into wide strips', 'Wash zucchini and slice thinly', 'Peel and chop onion', 'sauté onion in oil for 2 minutes', 'Add bell pepper and zucchini and cook for 3-4 minutes at low heat', 'Place fish on vegetables and simmer covered for 8-10 minutes', 'Season with salt and serve immediately'] },
    142: { title: 'Salmon with Onion and Capers', steps: ['Pat salmon dry', 'Peel and finely dice onion', 'Drain capers', 'Heat olive oil in pan', 'sauté onion for about 2 minutes until translucent', 'Add capers and briefly mix', 'Place salmon in pan and fry for about 4-5 minutes per side', 'Season with salt and serve immediately'] },
    143: { title: 'Cod with Lime', steps: ['Pat cod dry and season with salt', 'Halve lime and squeeze', 'Heat olive oil in pan at medium heat', 'Fry cod for about 4-5 minutes per side', 'Season with lime juice and pepper', 'Arrange on plates and serve immediately'] },
    147: { title: 'Fish with Tomatoes and Garlic', steps: ['Pat fish fillet dry', 'Core tomatoes and dice small', 'Finely chop or press garlic', 'Fry garlic in olive oil for about 1 minute until fragrant', 'Add tomato cubes and simmer for about 5-7 minutes', 'PlaceFish in pan and simmer covered for 8-10 minutes until done', 'Season with salt and pepper before serving'] },
    149: { title: 'Salmon with Sesame and Honey', steps: ['Toast sesame in dry pan until fragrant', 'Mix honey with soy sauce', 'Place salmon on baking sheet with parchment', 'Spread honey-soy sauce mixture on salmon', 'Season with freshly ground pepper', 'Bake in oven preheated to 180 Grad C for about 12-15 minutes', 'Serve garnished with toasted sesame'] },
    152: { title: 'Fish with Broccoli and Garlic', steps: ['Divide broccoli into small florets and wash', 'Blanch in salt water for about 4-5 minutes', 'Finely chop garlic', 'Fry fish fillet in pan with olive oil for about 3-4 minutes per side', 'Add garlic and fry for about 1 minute', 'Add broccoli florets and cook through for about 3-4 minutes', 'Season with salt and lemon and serve'] },
    153: { title: 'Cod with Tomato Salsa', steps: ['Pat cod dry', 'Core tomatoes and dice small', 'Peel and chop onion', 'sauté onion in olive oil for 2 minutes', 'Add tomato cubes and simmer for about 5-7 minutes', 'Season with some salt for flavor base', 'Place cod portions in pan and simmer covered for 8-10 minutes', 'Season again before serving'] },
    155: { title: 'Trout with Herb-Oil', steps: ['Pat trout dry', 'Finely chop herbs', 'Mix olive oil with chopped herbs and season', 'Dry trout with paper towels', 'Place in pan and fry for about 4-5 minutes per side at medium heat', 'Drizzle with herb-oil before serving'] },
    158: { title: 'Cod with Spinach and Lemon', steps: ['Pat cod dry and season with salt', 'Thoroughly wash spinach and blanch for about 2-3 minutes, squeeze dry', 'Halve lemon and squeeze', 'Arrange spinach with some olive oil on baking sheet', 'Place cod on top and drizzle with lemon juice', 'Bake in oven preheated to 200 Grad C for about 12-15 minutes', 'Season with salt and pepper'] },
    165: { title: 'Tuna with Avocado', steps: ['Drain tuna and fluff', 'Halve avocado, remove pit and scoop out flesh with spoon', 'Halve lemon and squeeze', 'Lightly mash avocado with fork with some lemon juice', 'Mix with tuna', 'Stir in olive oil and season with salt and pepper', 'Serve with bread or salad'] },
    166: { title: 'Fish with Bell Pepper and Rice', steps: ['Season fish fillet with salt and pepper and set aside', 'Core bell pepper and cut into wide rings, cut onion into half rings', 'Cook rice according to package or simmer for about 15-20 minutes in lightly salted water', 'sauté bell pepper and onion in hot oil for about 3-4 minutes until golden, add fish fillet', 'Fry fish for about 4-5 minutes per side', 'Season with salt and pepper and serve over rice'] },
    172: { title: 'Cod with Vegetables and Herbs', steps: ['Season cod fillet with salt and pepper', 'Slice zucchini and bell pepper thinly, finely chop herbs', 'sauté vegetables in hot oil for about 2-3 minutes until half-done', 'Place fish fillet on vegetables, sprinkle chopped herbs over', 'Bake in oven preheated to 180 Grad C for about 12-15 minutes until fish is done', 'Season with lemon juice and serve'] },
    174: { title: 'Trout with Butter and Capers', steps: ['Gut trout (if necessary) and pat dry with paper towels', 'Season inside and outside with salt and pepper', 'Melt butter in pan, briefly toast capers', 'Fry trout skin side down for about 5-6 minutes per side in hot butter', 'Squeeze lemon and drizzle over fish', 'Pour butter-caper sauce over fish and serve'] },
    175: { title: 'Tuna with Beans and Lemon', steps: ['Thaw fresh or frozen tuna steaks, pat dry', 'Drain beans or use cooked beans', 'Squeeze lemon, mix with olive oil and salt to vinaigrette', 'Fry tuna in hot pan for about 2-3 minutes per side until lightly browned outside', 'Arrange beans and tuna on plates, drizzle lemon vinaigrette over', 'Serve warm'] },
    178: { title: 'Salmon with Tomatoes and Capers', steps: ['Season salmon fillet with salt and pepper', 'Dice tomatoes, drain capers', 'Fry salmon fillet skin side down in hot olive oil for about 4-5 minutes', 'Add tomatoes and capers, cook gently for another 2-3 minutes', 'Season with lemon juice and fresh herbs', 'Serve warm with rice or potatoes'] },
    180: { title: 'Tuna with Bell Pepper and Corn', steps: ['Season tuna steaks with salt and pepper', 'Core bell pepper and cut into wide strips, chop onion, drain corn', 'sauté vegetables in hot oil for about 3 minutes', 'Add tuna and sear for about 2-3 minutes per side', 'Cook with bell pepper and corn for another 2-3 minutes until fish is slightly pink inside', 'Season with salt and pepper and serve'] },
    185: { title: 'Tuna with Cucumber and Lemon', steps: ['Slice tuna thin or use as steak', 'Peel cucumber and slice thinly or dice', 'Squeeze lemon, mix with olive oil and salt to vinaigrette', 'Sear tuna in hot pan for about 2-3 minutes per side', 'Prepare cucumber raw as cool salad side', 'Arrange warm tuna over cucumber salad, drizzle vinaigrette over', 'Serve immediately'] },
    186: { title: 'Fish with Herbs and Garlic', steps: ['Finely chop fresh herbs, press garlic', 'Season fish fillet with salt and pepper', 'Heat olive oil in pan, toast garlic for about 1 minute without browning', 'Add fish fillet and fry for about 4-5 minutes per side', 'Add chopped herbs shortly before end and let draw', 'Season with lemon juice and serve directly'] },
    187: { title: 'Cod with Lime-Butter', steps: ['Season cod fillet with salt and pepper', 'Squeeze limes and set juice aside', 'Melt butter in pan', 'Fry cod scale side down for about 4-5 minutes in hot butter', 'Add lime juice and some lime zest to fish, cook for another 2-3 minutes', 'Season with fresh herbs and some black pepper and serve'] },
    189: { title: 'Trout with Onion and Herbs', steps: ['Pat trout dry and season inside and outside with salt', 'Cut onion into half rings, finely chop herbs', 'sauté onion in hot olive oil for about 2 minutes', 'Add trout and fry for about 5-6 minutes per side', 'Add chopped herbs at end and cook for about 1 minute', 'Season with lemon juice and serve warm with potatoes'] },
    190: { title: 'Tuna with Tomatoes and Olive Oil', steps: ['Season tuna steaks with salt and pepper', 'Dice tomatoes small or use canned tomatoes', 'Heat olive oil in pan and sear tuna for about 2-3 minutes per side', 'Add tomatoes and simmer gently for about 3-4 minutes so flavors blend', 'Season with some olive oil and salt', 'Serve warm with fresh herbs'] },
   191: { title: 'Beef with Bell Pepper and Onion', steps: ['Cut beef into small cubes, season with salt and pepper', 'Core and dice bell pepper, chop onion', 'Sear meat in hot oil until dark brown outside, remove', 'sauté bell pepper and onion in same pot for about 2 minutes', 'Return meat, mix everything and cook for another 3-4 minutes', 'Season with paprika and salt'] },
    193: { title: 'Beef with Red Wine and Carrot', steps: ['Cut beef into large cubes, season with salt', 'Slice carrot into pieces, chop onion', 'Brown meat in hot oil in batches until dark brown, remove', 'sauté onion and carrot in pot for about 2 minutes', 'Return meat, deglaze with red wine and simmer for about 1 minute', 'Add stock to cover, bring to boil and reduce heat', 'Simmer covered for about 1.5-2 hours until meat is very tender'] },
    194: { title: 'Beef with Broccoli', steps: ['Cut beef into cubes, pat dry','Divide broccoli into small florets', 'Sear meat in hot oil on all sides, remove', 'Briefly sauté broccoli for about 2 minutes, add soy sauce and garlic', 'Return meat and cook for about 5-7 minutes at medium heat', 'Season with salt and pepper and serve'] },
    195: { title: 'Beef Steak with Herb Butter', steps: ['Remove beef steak (about 200g per person) from refrigerator 20 minutes before preparation', 'Pat dry and season with salt and pepper', 'Mix butter with finely chopped herbs and set aside', 'Fry steak in extremely hot pan for about 3-4 minutes per side depending on thickness and doneness', 'Place piece of herb butter on hot steak - will melt immediately', 'Let rest for 5 minutes, serve with remaining butter'] },
    196: { title: 'Beef with Tomatoes and Oregano', steps: ['Cut beef into small cubes, pat dry', 'Dice tomatoes small or use canned tomatoes, press garlic', 'Sear meat in hot oil on all sides brown, remove', 'Briefly sauté garlic, add tomatoes and oregano', 'Return meat, simmer for about 8-10 minutes at medium heat', 'Season with salt and oregano and serve with pasta or potatoes'] },
    197: { title: 'Beef with Potatoes', steps: ['Cut beef into large cubes', 'Dice potatoes not too small, chop onion', 'Brown meat in hot oil until brown, remove', 'sauté onion, add potatoes and fry for 2 minutes', 'Add stock to barely cover everything, return meat, bring to boil', 'Reduce to low heat and simmer covered for about 1-1.5 hours', 'Season with salt and pepper at end'] },
    198: { title: 'Beef with Bell Pepper and Rice', steps: ['Cut beef into cubes, pat dry', 'Cook rice according to package, dice bell pepper, chop onion', 'Sear meat in hot oil, remove', 'sauté bell pepper and onion for about 2 minutes', 'Return meat, add rice and cook everything for about 5-7 minutes mixing', 'Season with salt and pepper and serve'] },
    199: { title: 'Beef with Mustard-Cream', steps: ['Cut beef into cubes, season with salt', 'Finely chop onion or cut into rings', 'Brown meat in hot oil until brown outside, remove', 'sauté onion in pot for 2 minutes', 'Return meat, mix with mustard and stir in cream', 'Simmer gently at low heat for about 15-20 minutes until meat is tender', 'Season with salt and pepper'] },
    200: { title: 'Beef with Beans and Tomatoes', steps: ['Cut beef into cubes, prepare beans and tomatoes', 'Press garlic, chop onion', 'Sear meat in hot oil, remove', 'sauté onion and garlic for about 1-2 minutes', 'Add tomatoes and beans, return meat', 'Simmer gently for about 30-40 minutes until meat is tender', 'Season with salt and serve'] },
    201: { title: 'Beef with Carrots and Celery', steps: ['Cut beef into cubes, cut carrot and celery into pieces', 'Chop onion', 'Brown meat in hot oil in batches, remove', 'sauté onion, add vegetables and fry for 2-3 minutes', 'Return meat, add stock to cover, bring to boil', 'Reduce to low heat, simmer covered for about 1.5 hours', 'Season with salt and pepper at end'] },
    202: { title: 'Beef with Herbs and Lemon', steps: ['Cut beef into cubes, finely chop herbs', 'Squeeze lemon, set juice aside', 'Sear meat in hot olive oil, remove', 'Add lemon juice to pot and heat briefly', 'Return meat, add chopped herbs', 'Cook for about 8-12 minutes depending on meat size, season with salt and pepper', 'Serve warm with fresh herbs as garnish'] },
    203: { title: 'Beef with Onion and Mushrooms', steps: ['Cut beef into cubes, halve mushrooms, chop onion', 'Sear meat in hot oil, remove', 'Toast mushrooms for about 3 minutes until golden, remove', 'sauté onion, return meat and mushrooms', 'Cook for about 10-15 minutes at medium heat', 'Season with salt, pepper and fresh olive oil and serve'] },
    204: { title: 'Beef with Bell Pepper and Garlic', steps: ['Cut beef into small cubes, dice bell pepper', 'Press garlic, chop onion', 'Sear meat in hot oil, remove', 'sauté bell pepper and garlic for about 1 minute and toast', 'Return meat, mix everything well', 'Cook for about 8-10 minutes at medium heat until done', 'Season with salt and pepper at end'] },
    205: { title: 'Beef with Zucchini and Tomato', steps: ['Cut beef into cubes, dice zucchini, dice tomato', 'Sear meat in hot oil, remove', 'sauté zucchini for about 2-3 minutes', 'Add tomato, return meat', 'Cook for about 10-12 minutes until vegetables are soft and meat is done', 'Season with olive oil, salt and pepper and serve'] },
    206: { title: 'Beef with Ginger and Soy Sauce', steps: ['Cut beef into cubes, finely chop ginger, press garlic', 'Sear meat in hot oil, remove', 'Briefly toast ginger and garlic for about 1 minute', 'Add soy sauce, add some water', 'Return meat and simmer for about 15-20 minutes', 'Season with salt and some soy sauce', 'Serve with fresh herbs'] },
    208: { title: 'Beef with Tomatoes and Bell Pepper', steps: ['Cut beef into cubes, pat dry', 'Dice tomatoes or use canned, dice bell pepper', 'Chop onion', 'Sear meat in hot oil, remove', 'sauté onion, add bell pepper and fry for 1 minute', 'Add tomatoes and meat, simmer for about 20-25 minutes', 'Season with salt and pepper and serve'] },
    209: { title: 'Beef with Lemon and Garlic', steps: ['Cut beef into cubes, squeeze lemon, press garlic', 'Sear meat in hot olive oil, remove', 'Briefly sauté garlic for about 1 minute', 'Add lemon juice to pot, return meat', 'Cook for about 10-15 minutes depending on meat size', 'Season with salt and pepper, serve with potatoes or vegetables'] },
    210: { title: 'Beef with Spinach and Cream', steps: ['Cut beef into cubes, prepare spinach', 'Chop onion or cut into fine rings', 'Sear meat in hot oil, remove', 'sauté onion, add spinach and simmer for 2-3 minutes', 'Return meat, stir in cream', 'Simmer for about 15-20 minutes at low heat until meat is tender', 'Season with salt and nutmeg and serve'] },
    212: { title: 'Pork with Mushrooms and Cream', steps: ['Cut pork into cubes, halve or quarter mushrooms', 'Chop onion', 'Sear meat in hot oil, remove', 'Toast mushrooms for about 3-4 minutes until golden, set aside', 'sauté onion, stir in cream, return meat and mushrooms', 'Simmer for about 15-20 minutes at medium heat', 'Season with salt and pepper and serve'] },
    213: { title: 'Pork with Mustard and Herbs', steps: ['Cut pork into cubes or strips', 'Finely chop or grate mustard, finely chop herbs', 'Sear meat in hot olive oil, remove', 'Add mustard and herbs to meat, mix well', 'Cook for about 8-12 minutes depending on meat size', 'Season with salt and pepper and serve directly'] },
    214: { title: 'Pork with Potatoes and Carrot', steps: ['Cut pork into cubes, dice potatoes, dice carrot', 'Chop onion', 'Brown meat in hot oil until brown outside, remove', 'Briefly sauté onion, add potatoes and carrot', 'Return meat, add stock to barely cover everything', 'Simmer covered for about 40-50 minutes until potatoes are soft', 'Season with salt and pepper at end'] },
    216: { title: 'Pork with Zucchini and Bell Pepper', steps: ['Cut pork into cubes, dice zucchini, dice bell pepper', 'Sear meat in hot olive oil, remove', 'sauté zucchini and bell pepper for about 3 minutes', 'Return meat, mix everything well', 'Cook for about 8-10 minutes until vegetables are soft and meat is done', 'Season with salt and pepper and serve'] },
    222: { title: 'Pork with Herbs and Onion', steps: ['Cut pork into cubes, finely chop herbs', 'Chop onion or cut into fine rings', 'Sear meat in hot olive oil, remove', 'sauté onion for about 2 minutes', 'Return meat, add chopped herbs', 'Cook for about 10-15 minutes until meat is fully done', 'Season with salt and pepper and serve'] },
    224: { title: 'Pork with Tomato and Basil', steps: ['Cut pork into cubes, dice or strip tomato', 'Finely chop basil', 'Sear meat in hot olive oil, remove', 'Add tomato and briefly sauté for about 1-2 minutes', 'Return meat, stir in basil', 'Cook for about 8-10 minutes and season with salt and pepper', 'Serve warm with fresh basil'] },
    225: { title: 'Pork with Lemon and Oil', steps: ['Cut pork into cubes or strips', 'Squeeze lemon, set juice aside', 'Sear meat in hot olive oil, remove', 'Add lemon juice to pot and heat briefly', 'Return meat, cook for about 5-8 minutes', 'Season with salt and black pepper and serve'] },
    230: { title: 'Pork with Tomatoes and Onion', steps: ['Cut pork into cubes, dice tomato small', 'Chop onion', 'Sear meat in hot olive oil, remove', 'sauté onion for about 2 minutes', 'Add tomato and simmer gently for 2-3 minutes', 'Return meat, cook for about 10-15 minutes until done', 'Season with salt and pepper and serve'] },
    233: { title: 'Chicken with Broccoli and Rice', steps: ['Cut chicken into bite-sized cubes, divide broccoli into small florets', 'Cook rice according to package or simmer for about 15-20 minutes', 'Mix chicken and broccoli with soy sauce and marinate for about 10 minutes', 'Sear chicken in hot oil for about 5-6 minutes on all sides', 'Add broccoli and cook for another 4-5 minutes', 'Season with soy sauce and salt over cooked rice'] },
    236: { title: 'Chicken with Curry and Coconut Milk', steps: ['Cut chicken into bite-sized pieces, chop onion', 'Sear chicken in hot oil for about 4-5 minutes, remove', 'sauté onion, add curry powder generously (about 2 tbsp) and toast for about 1 minute', 'Pour in coconut milk and mix well', 'Return chicken and simmer for about 20-25 minutes at low heat', 'Season with salt and optional more curry', 'Serve with basmati rice and naan bread'] },
    239: { title: 'Chicken with Rice and Sesame', steps: ['Cut chicken into cubes, cook rice, prepare sesame', 'Marinate chicken with soy sauce for about 10 minutes', 'Toast sesame in pan without oil until fragrant', 'Fry chicken in hot oil for about 5-6 minutes until done', 'Sprinkle toasted sesame generously over chicken', 'Season with soy sauce over cooked rice'] },
    243: { title: 'Chicken with Garlic and Rice', steps: ['Cut chicken into bite-sized pieces, press garlic', 'Cook rice according to package', 'Lightly toast garlic in hot olive oil for about 1 minute without browning', 'Add chicken and sear for about 6-8 minutes on all sides', 'Season with salt and pepper', 'Serve warm with basmati rice and salad'] },
    245: { title: 'Chicken with Bell Pepper and Oregano', steps: ['Cut bell pepper into wide rings and portion chicken fillet into bite-sized pieces', 'Season chicken generously with oregano and marinate for 10 minutes', 'Heat olive oil in pan at high heat', 'Sear chicken pieces for about 4-5 minutes per side until golden', 'Add bell pepper and cook for another 3-4 minutes with chicken', 'Season with salt and pepper and serve'] },
    246: { title: 'Chicken with Lemon and Honey', steps: ['Cut chicken into cubes, halve and squeeze lemon', 'Mix honey with lemon juice', 'Fry chicken in hot olive oil for about 5-6 minutes', 'Pour honey-lemon mixture over chicken and cook for another 3-4 minutes', 'Season with salt and pepper', 'Serve with fresh salad and potatoes'] },
    248: { title: 'Chicken with Mushrooms and Garlic', steps: ['Cut chicken into cubes, halve mushrooms, press garlic', 'Sear chicken in hot oil for about 4-5 minutes, remove', 'Toast mushrooms for about 3-4 minutes until lightly brown, add garlic', 'Stir in cream, return chicken', 'Simmer for about 10-15 minutes at low heat', 'Season with salt and pepper and serve with Spätzle'] },
    249: { title: 'Chicken with Onion and Carrot', steps: ['Cut chicken into cubes, chop onion, slice or piece carrot', 'Sear chicken in hot oil for about 5-6 minutes, remove', 'sauté onion, add carrot and fry for about 2 minutes', 'Return chicken, cook for about 8-10 minutes until carrot is soft and chicken is done', 'Season with salt and pepper', 'Serve warm with potatoes or rice'] },
    250: { title: 'Chicken with Spinach and Tomato', steps: ['Cut chicken into cubes, prepare spinach, dice tomato', 'Sear chicken in hot olive oil for about 5-6 minutes, remove', 'Add spinach and tomato and simmer for about 2-3 minutes', 'Return chicken, mix everything well', 'Cook for about 8-10 minutes until chicken is fully done', 'Season with salt and pepper and serve'] },
    251: { title: 'Lamb with Garlic and Rosemary', steps: ['Cut lamb meat (e.g. shoulder) into 3-4cm cubes', 'Peel and slice garlic, finely chop fresh rosemary', 'Season meat with salt and pepper', 'Sear meat on all sides for 3 minutes in hot oil', 'Add garlic and rosemary and toast for 1 minute', 'Cook in oven preheated to 160 Grad C for about 45-60 minutes depending on meat piece size', 'Garnish with fresh rosemary and serve with potatoes/vegetables'] },
    253: { title: 'Veal with Lemon and Butter', steps: ['Cut veal into thin slices or cubes', 'Squeeze lemon, set juice aside', 'Fry meat in hot butter for about 2-3 minutes per side', 'Pour in lemon juice, heat briefly at high heat for about 1 minute', 'Season with salt and black pepper', 'Serve with lemon slices and fresh herbs'] },
    260: { title: 'Veal with Garlic and Oil', steps: ['Cut veal into cubes, press garlic', 'Sear meat in hot olive oil, remove', 'Briefly sauté garlic for about 1 minute', 'Add some water or stock, return meat', 'Simmer for about 20-25 minutes at lower heat', 'Season with salt and black pepper and serve'] },
    261: { title: 'Beef with Chili and Tomato', steps: ['Cut beef into cubes, finely chop fresh chili', 'Press garlic, chop onion', 'Sear meat in hot oil, remove', 'sauté onion and garlic, add chili and briefly toast', 'Add tomatoes and meat, simmer for about 25-30 minutes', 'Season with salt and chili and serve'] },
    263: { title: 'Beef with Mushrooms and Rice', steps: ['Cut beef into cubes, halve mushrooms, cook rice', 'Sear meat in hot oil, remove', 'Toast mushrooms for about 3-4 minutes until golden, set aside', 'Add stock, return meat', 'Simmer for about 25-30 minutes, add mushrooms at end', 'Season with salt and serve over cooked rice'] },
    265: { title: 'Beef with Herb-Cream', steps: ['Cut beef into cubes, finely chop herbs', 'Chop onion', 'Sear meat in hot oil, remove', 'sauté onion, briefly toast chopped herbs for about 1 minute', 'Stir in cream, return meat', 'Simmer for about 20-25 minutes at low heat', 'Season with salt and pepper and serve'] },
    267: { title: 'Pork with Bell Pepper and Beans', steps: ['Cut pork into cubes, dice bell pepper, chop onion', 'Drain beans', 'Brown meat in hot oil until brown outside, remove', 'sauté bell pepper and onion for about 2-3 minutes', 'Return meat and beans, cook for about 10-15 minutes', 'Season with salt and pepper and serve'] },
    271: { title: 'Chicken with Herbs and Rice', steps: ['Cut chicken into bite-sized pieces, finely chop herbs', 'Cook rice according to package', 'Fry chicken in hot olive oil for about 6-8 minutes and let cook through', 'Add chopped herbs at end and briefly cook for about 1 minute', 'Season with salt and pepper', 'Serve with basmati rice and fresh herbs'] },
    272: { title: 'Chicken with Tomato and Olives', steps: ['Cut chicken into bite-sized pieces, dice tomato, prepare olives', 'Sear chicken in hot olive oil for about 5-6 minutes, remove', 'Briefly sauté tomato for about 1-2 minutes', 'Return chicken, add olives', 'Cook for another 5-7 minutes until chicken is fully done', 'Season with salt and pepper and serve'] },
    275: { title: 'Chicken with Zucchini and Herbs', steps: ['Cut chicken into cubes, dice zucchini, finely chop herbs', 'Sear chicken in hot olive oil for about 5-6 minutes, remove', 'sauté zucchini for about 2-3 minutes', 'Return chicken, add chopped herbs', 'Cook for another 5-7 minutes', 'Season with salt and pepper and serve'] },
    276: { title: 'Chicken with Spinach and Garlic', steps: ['Cut chicken into cubes, prepare spinach, press garlic', 'Sear chicken in hot olive oil for about 5-6 minutes, remove', 'Briefly toast garlic for about 1 minute, add spinach', 'Return chicken, cook everything together for about 5-7 minutes', 'Season with salt and pepper', 'Serve warm with potatoes or rice'] },
    277: { title: 'Chicken with Tomatoes and Garlic', steps: ['Cut chicken into bite-sized pieces, dice tomatoes small, press garlic', 'Sear chicken in hot olive oil for about 5-6 minutes, remove', 'Briefly sauté garlic for about 1 minute', 'Add tomatoes and simmer gently for about 2-3 minutes', 'Return chicken and cook for another 5-7 minutes', 'Season with salt and pepper and serve'] },
    281: { title: 'Beef with Caraway and Onion', steps: ['Cut beef into cubes, chop onion, prepare caraway', 'Sear meat in hot olive oil, remove', 'sauté onion for about 2 minutes', 'Briefly toast caraway for about 1 minute until fragrant', 'Return meat, mix everything well', 'Cook for about 8-12 minutes, season with salt and pepper'] },
    282: { title: 'Pork with Caraway and Potatoes', steps: ['Cut pork into cubes, dice potatoes, chop onion', 'Brown meat in hot oil until brown outside, remove', 'sauté onion, add potatoes', 'Briefly toast caraway for about 1 minute until fragrant', 'Add stock to barely cover everything, return meat', 'Simmer covered for about 40-50 minutes until everything is done', 'Season with salt and pepper at end'] },
    283: { title: 'Chicken with Caraway and Carrot', steps: ['Cut chicken into cubes, dice carrot, chop onion', 'Sear chicken in hot oil for about 5-6 minutes, remove', 'sauté onion, add carrot and fry for about 2 minutes', 'Briefly toast caraway for about 1 minute until fragrant', 'Return chicken and cook for another 5-7 minutes', 'Season with salt and pepper and serve'] },
    284: { title: 'Fish with Caraway and Lemon', steps: ['Season fish fillet with salt and pepper, squeeze lemon', 'Fry fish in hot olive oil for about 4-5 minutes until done', 'Briefly toast caraway in dry pan until fragrant', 'Add lemon juice to fish', 'Sprinkle toasted caraway over fish', 'Serve with fresh herbs and salt'] },
    285: { title: 'Salmon with Caraway and Butter', steps: ['Season salmon fillet with salt and pepper', 'Briefly toast caraway in dry pan until fragrant', 'Melt butter in pan', 'Fry salmon fillet for about 4-5 minutes per side in butter', 'Sprinkle toasted caraway over salmon at end', 'Season with lemon and black pepper and serve'] },
    286: { title: 'Tuna with Caraway and Beans', steps: ['Season tuna steaks with salt and pepper, drain beans', 'Sear tuna in hot oil for about 2-3 minutes per side', 'Mix beans with onion and heat for about 3-4 minutes', 'Briefly toast caraway in dry pan until fragrant', 'Serve warm, garnished with caraway', 'With fresh salad side'] },
    287: { title: 'Salmon with Mustard and Herbs', steps: ['Season salmon fillet with salt and pepper, finely chop herbs', 'Mix mustard with about 1 tbsp water', 'Fry salmon fillet skin side down in hot olive oil for about 4-5 minutes', 'Spread mustard mixture on top and cook for another 2-3 minutes', 'Sprinkle chopped herbs over at end', 'Serve with lemon slices and potatoes'] },
    299: { title: 'Tuna with Spinach', steps: ['Prepare tuna steaks or fillet, thaw spinach if frozen', 'Add olive oil to pan and heat', 'Sear tuna for about 2-3 minutes per side', 'Add spinach to meat and briefly cook for about 2 minutes', 'Season with salt and pepper', 'Serve warm with potatoes or rice'] },
    302: { title: 'Beef with Tomatoes and Beans', steps: ['Cut beef into cubes, dice tomatoes, chop onion', 'Drain beans', 'Sear meat in hot oil, remove', 'sauté onion, add tomatoes and beans', 'Return meat and simmer for about 25-30 minutes', 'Season with salt and pepper and serve'] },
    311: { title: 'Vegetable Pan with Rice', steps: ['Cook rice according to package or simmer for about 15-20 minutes', 'Core and dice bell pepper, dice zucchini, chop onion', 'sauté vegetables in hot oil for about 4-5 minutes, then mix with rice', 'Cook everything together for about 3-4 minutes mixing', 'Season with salt and pepper', 'Serve warm as main dish or side'] },
    312: { title: 'Potato-Vegetable Pan', steps: ['Cut potatoes into not too large cubes', 'Dice bell pepper and zucchini', 'sauté potatoes in hot oil for about 10-12 minutes and partially cook', 'Add bell pepper and zucchini, cook for another 5-7 minutes', 'Season with salt and pepper', 'Serve as warm side or light main dish'] },
    313: { title: 'Tomato-Bean Soup', steps: ['Dice tomatoes small or use canned tomatoes', 'Chop onion', 'sauté onion in hot oil for about 2 minutes', 'Add tomatoes and beans, simmer for about 1 minute', 'Add stock and simmer gently for about 15-20 minutes', 'Season with salt and pepper and serve'] },
    314: { title: 'Vegetable Curry with Coconut Milk', steps: ['Dice bell pepper, dice zucchini, chop onion', 'Prepare curry powder', 'sauté vegetables in hot oil for about 2-3 minutes', 'Add curry powder (about 2 tbsp) and toast for about 1 minute', 'Pour in coconut milk and mix well', 'Simmer gently for about 15-20 minutes until vegetables are tender', 'Season with salt and serve with rice'] },
    315: { title: 'Spinach-Cream Pasta', steps: ['Prepare spinach, press garlic', 'Cook fusilli al dente according to package, drain', 'sauté garlic in butter for about 1-2 minutes', 'Add spinach and simmer for about 2-3 minutes, season with salt', 'Stir in cream and heat briefly', 'Mix with pasta and serve immediately'] },
    316: { title: 'Mushroom Pasta with Herbs', steps: ['Clean mushrooms and cut into thick slices, finely chop herbs', 'Cook spaghetti al dente according to package, drain', 'Toast mushrooms in hot olive oil for about 4-5 minutes golden', 'Add chopped herbs shortly before end', 'Mix with pasta, season with salt and pepper', 'Serve immediately, optional with Parmesan'] },
    317: { title: 'Chickpea-Tomato Pan', steps: ['Drain chickpeas, dice tomatoes, chop onion, press garlic', 'sauté onion and garlic in hot oil for about 1-2 minutes', 'Add chickpeas and tomatoes and mix well', 'Simmer gently for about 8-10 minutes until flavors blend', 'Season with salt and pepper', 'Serve warm with rice or potatoes'] },
    318: { title: 'Rice with Vegetables and Egg', steps: ['Cook rice or use already cooked rice', 'Dice vegetables small, beat eggs', 'Heat oil in wok or large pan', 'Stir-fry vegetables for about 3-4 minutes', 'Pour in beaten eggs and mix, continue stirring until egg sets', 'Add cooked rice, season with soy sauce and mix for about 2-3 minutes', 'Season with salt and serve'] },
    319: { title: 'Vegetable Soup with Leek', steps: ['Cut leek into rings, slice carrot, chop onion', 'sauté onion in hot oil for about 1-2 minutes', 'Add leek and carrot and steam for about 3 minutes', 'Add stock and simmer for about 15-20 minutes', 'Season with salt and pepper', 'Serve with fresh herbs'] },
    320: { title: 'Potato-Leek Soup', steps: ['Dice potatoes, cut leek into rings', 'Briefly sauté potatoes in hot oil', 'Add stock to cover and cook for about 15-20 minutes', 'Add leek and simmer for another 5-10 minutes', 'Puree with immersion blender to creamy consistency', 'Stir in cream, season with salt and pepper, serve'] },
    321: { title: 'Bell Pepper-Rice Pan', steps: ['Core and dice bell pepper, chop onion', 'Cook rice according to package', 'sauté bell pepper and onion in hot oil for about 3-4 minutes', 'Add cooked rice and cook everything together for about 3-4 minutes', 'Season with salt and pepper', 'Serve warm as main dish or side'] },
    322: { title: 'Vegetable Casserole with Cheese', steps: ['Prepare vegetables and cut into equally sized pieces', 'Grease casserole dish with butter', 'Mix cream with cheese and salt/pepper', 'Layer vegetables in dish', 'Pour cream-cheese mixture over', 'Bake in oven preheated to 180 Grad C for about 25-30 minutes until golden on top'] },
    323: { title: 'Tomato-Basil Pasta', steps: ['Cook penne al dente according to package, drain', 'Dice tomatoes small, finely chop basil', 'Simmer tomatoes in hot olive oil for about 8-10 minutes', 'Stir in fresh basil at end', 'Mix with pasta, season with salt', 'Serve, optional with Parmesan'] },
    324: { title: 'Vegetable Soup with Beans', steps: ['Drain beans, dice carrot, chop onion', 'sauté onion in hot oil for about 1-2 minutes', 'Add carrot and steam for about 2-3 minutes', 'Add beans and stock, simmer for about 15-20 minutes', 'Season with salt and pepper', 'Serve with fresh herbs'] },
    325: { title: 'Spinach-Cheese Casserole', steps: ['Prepare spinach, grease casserole dish with butter', 'Mix cream with cheese and salt/pepper', 'Layer spinach in dish', 'Distribute cheese-cream mixture over', 'Top garnish with remaining cheese', 'Bake in oven preheated to 180 Grad C for about 25-30 minutes'] },
    326: { title: 'Potato-Cheese Pan', steps: ['Cut potatoes into small cubes, chop onion', 'Fry potatoes in hot oil for about 8-10 minutes golden', 'Add onion and fry for another 2-3 minutes', 'Add grated cheese and mix well', 'Briefly mix in hot butter', 'Season with salt and pepper, serve'] },
    327: { title: 'Bean Salad with Onion', steps: ['Drain beans, cut onion into fine rings', 'Mix olive oil with vinegar and salt to dressing', 'Mix beans and onion', 'Pour dressing over beans and mix well', 'Let draw for about 15-20 minutes so flavors blend', 'Season again with salt and pepper and serve'] },
    328: { title: 'Tomato-Cucumber Salad', steps: ['Dice tomato, dice cucumber', 'Mix olive oil with vinegar and salt to dressing', 'Mix vegetables with dressing', 'Let draw for about 10-15 minutes', 'Season again with salt and pepper', 'Serve fresh as side'] },
    329: { title: 'Potato Salad with Herbs', steps: ['Cook potatoes until al dente, let cool, then dice', 'Finely chop herbs', 'Mix vinegar and olive oil to dressing with salt', 'Mix potatoes and herbs with dressing', 'Let draw for about 20-30 minutes', 'Season again with salt and pepper and serve'] },
    330: { title: 'Vegetable-Rice Soup', steps: ['Cook rice, dice vegetables small', 'sauté vegetables in hot oil for about 2-3 minutes', 'Add stock and simmer for about 15-20 minutes', 'Add rice and cook everything together for about 3-4 minutes', 'Season with salt', 'Serve as warming soup'] },
    331: { title: 'Zucchini Pasta with Garlic', steps: ['Cook fusilli al dente according to package', 'Cut zucchini into long thin strips or dice', 'Press garlic', 'Lightly fry zucchini in hot olive oil for about 3-4 minutes', 'Briefly toast garlic, mix with pasta', 'Season with salt, pepper and lemon, serve'] },
    332: { title: 'Broccoli-Potato Soup', steps: ['Divide broccoli into small florets, dice potatoes', 'Cook potatoes in hot water until almost done', 'Add broccoli and cook for another 3-4 minutes', 'Drain and add stock', 'Puree with immersion blender to creamy consistency', 'Season with salt and pepper, serve'] },
    333: { title: 'Bell Pepper-Tomato Soup', steps: ['Dice bell pepper, dice tomatoes small or use canned, chop onion', 'sauté onion in hot oil for about 1-2 minutes', 'Add bell pepper and steam for about 2 minutes', 'Add tomatoes and stock, simmer for about 15-20 minutes', 'Season with salt and paprika', 'Serve with fresh herbs'] },
    334: { title: 'Vegetable Pasta with Herbs', steps: ['Cook penne al dente according to package', 'Prepare and dice vegetables small, finely chop herbs', 'sauté vegetables in hot olive oil for about 3-4 minutes', 'Mix with pasta', 'Add chopped herbs and mix well', 'Season with salt and pepper, serve immediately'] },
    335: { title: 'Chickpea Salad', steps: ['Drain chickpeas, dice tomato, chop onion', 'Mix olive oil with vinegar and salt to dressing', 'Mix chickpeas, tomato and onion with dressing', 'Let draw for about 15-20 minutes', 'Season again with salt and pepper', 'Serve fresh as salad'] },
    336: { title: 'Lentil Salad with Lemon', steps: ['Cook lentils until al dente, drain, let cool', 'Squeeze lemon', 'Mix olive oil with lemon juice and salt to dressing', 'Mix lentils with dressing', 'Let draw for about 15-20 minutes', 'Season with salt and pepper and serve'] },
    337: { title: 'Vegetable Omelet', steps: ['Beat eggs with salt and pepper', 'Dice bell pepper and zucchini, chop onion', 'sauté vegetables in hot oil for about 2-3 minutes', 'Pour in beaten eggs and let set at medium heat for about 4-5 minutes', 'Loosen from pan with spatula', 'Finish in oven at 180 Grad C for about 5-7 minutes'] },
    338: { title: 'Rice with Tomato and Basil', steps: ['Cook rice according to package', 'Dice tomato, finely chop basil', 'Mix cooked rice with tomato', 'Season with olive oil and salt', 'Stir in basil at end', 'Serve warm as side or light main dish'] },
    339: { title: 'Potato-Vegetable Soup', steps: ['Dice vegetables small, dice potatoes', 'Partially cook potatoes in hot water briefly, drain', 'Add stock to cover', 'Add remaining vegetables, simmer for about 15-20 minutes', 'Season with salt and pepper', 'Serve as warming soup'] },
    340: { title: 'Pasta with Beans and Tomatoes', steps: ['Cook fusilli al dente according to package', 'Drain beans, dice tomatoes, press garlic', 'Simmer tomatoes and garlic in hot oil for about 5-7 minutes', 'Add beans and cook for another 3-4 minutes', 'Mix with pasta', 'Season with salt and pepper, serve'] },
    406: { title: 'Spinach-Feta Pan', steps: ['Thoroughly wash spinach and blanch in plenty of salt water for about 3 minutes', 'Cool spinach in ice water and then squeeze dry in kitchen towel', 'Finely chop onion and garlic', 'Heat oil in pan and steam onion-garlic mixture for about 2 minutes', 'Add drained spinach and mix, heat for about 3-4 minutes', 'Crumble feta cheese over and stir briefly', 'Serve warm as main or side dish'] },
    91: { title: 'Pasta Al Dente with Tomato', steps: ['Bring large pot of salted water to boil, add pasta and cook according to package until al dente', 'Meanwhile dice tomatoes or use canned tomatoes', 'Finely chop garlic and sauté in olive oil for about 1 minute', 'Add tomatoes and simmer for about 10 minutes at medium heat', 'Drain pasta and combine with tomato sauce', 'Season with salt and black pepper', 'Serve with fresh basil and optional Parmesan'] },
    94: { title: 'Cod with White Wine Sauce', steps: ['Season cod fillets with salt and pepper', 'Heat butter in pan and fry cod for about 3-4 minutes per side', 'Remove fish and keep warm', 'Deglaze pan with white wine and let reduce for about 2 minutes', 'Add cream and simmer for another 2-3 minutes', 'Pour sauce over fish and serve with vegetables'] },
    95: { title: 'Salmon in Mustard Crust', steps: ['Mix mustard with breadcrumbs and chopped herbs', 'Season salmon fillet with salt', 'Press mustard-breadcrumb mixture onto surface of salmon', 'Place on baking sheet with parchment', 'Bake in preheated oven at 180 Grad C for about 12-15 minutes', 'Serve with salad and potatoes'] },
    102: { title: 'Tuna with Lemon and Oil', steps: ['Drain tuna and flake with fork', 'Squeeze lemon and mix with olive oil', 'Season tuna with lemon-oil mixture', 'Add salt and pepper to taste', 'Let marinate for about 10 minutes', 'Serve as salad or sandwich filling'] },
    107: { title: 'Fish with Herb Butter', steps: ['Finely chop herbs and mix with softened butter', 'Season fish fillet with salt and pepper', 'Fry in hot oil for about 4-5 minutes per side', 'Top hot fish with herb butter', 'Let butter melt and serve immediately'] },
    115: { title: 'Salmon on Vegetable Bed', steps: ['Cut vegetables (zucchini, bell pepper, tomato) into pieces', 'Distribute on baking sheet and season with salt', 'Place salmon fillet on vegetables', 'Drizzle with olive oil and season', 'Bake in preheated oven at 200 Grad C for about 12-15 minutes', 'Serve hot'] },
    117: { title: 'Cod with Parsley', steps: ['Finely chop parsley', 'Season cod fillet with salt and pepper', 'Fry in hot butter for about 4-5 minutes per side', 'Sprinkle chopped parsley over fish', 'Drizzle with lemon juice and serve'] },
    119: { title: 'Trout in Oven', steps: ['Gut trout if necessary and pat dry', 'Season inside and outside with salt', 'Place on baking sheet with parchment', 'Drizzle with olive oil', 'Bake at 200 Grad C for about 18-20 minutes', 'Serve warm'] },
    135: { title: 'Tuna with Tomatoes', steps: ['Drain tuna and flake', 'Dice tomatoes small', 'Peel and chop onion', 'sauté onion in oil for 2 minutes', 'Add tomatoes and simmer for 3-4 minutes', 'Add tuna and heat through', 'Season with salt and pepper and serve'] },
    144: { title: 'Salmon with Vegetables', steps: ['Cut vegetables (zucchini, bell pepper) into pieces', 'Distribute on baking sheet', 'Place salmon fillet on vegetables', 'Drizzle with olive oil and season', 'Bake at 200 Grad C for about 12-15 minutes', 'Serve warm'] },
    145: { title: 'Cod with Bell Pepper', steps: ['Core bell pepper and cut into strips', 'Season cod with salt', 'sauté bell pepper in oil for 2 minutes', 'Add cod and cook covered for 8-10 minutes', 'Season with salt and pepper', 'Serve hot'] },
    146: { title: 'Trout with Lemon', steps: ['Pat trout dry and season with salt', 'Squeeze lemon', 'Fry trout in hot butter for 4-5 minutes per side', 'Drizzle with lemon juice', 'Season with pepper and serve'] },
    148: { title: 'Salmon with Dill', steps: ['Finely chop dill', 'Season salmon with salt', 'Fry in hot oil for 4-5 minutes per side', 'Sprinkle dill over salmon', 'Drizzle with lemon juice and serve'] },
    150: { title: 'Cod with Herbs', steps: ['Finely chop herbs', 'Season cod with salt and pepper', 'Fry in hot oil for 4-5 minutes per side', 'Add herbs and cook for 1 minute', 'Serve with lemon'] },
    151: { title: 'Tuna Pan', steps: ['Drain tuna and flake', 'Dice vegetables small', 'sauté vegetables in oil for 3 minutes', 'Add tuna and heat through', 'Season with soy sauce', 'Serve over rice'] },
    154: { title: 'Salmon with Rice', steps: ['Cook rice according to package', 'Season salmon with salt', 'Fry in hot oil for 4-5 minutes per side', 'Serve salmon over rice', 'Garnish with lemon'] },
    156: { title: 'Cod with Tomato', steps: ['Season cod with salt', 'Dice tomatoes', 'sauté tomatoes in oil for 3 minutes', 'Add cod and cook covered for 10 minutes', 'Season with salt and serve'] },
    157: { title: 'Trout with Butter', steps: ['Pat trout dry', 'Season with salt and pepper', 'Fry in hot butter for 4-5 minutes per side', 'Serve with lemon butter'] },
    159: { title: 'Salmon with Bell Pepper', steps: ['Core bell pepper and cut into strips', 'Season salmon with salt', 'sauté bell pepper for 2 minutes', 'Add salmon and cook for 10 minutes', 'Season and serve'] },
    160: { title: 'Cod with Lemon', steps: ['Season cod with salt', 'Squeeze lemon', 'Fry cod in oil for 4-5 minutes per side', 'Drizzle with lemon juice', 'Serve immediately'] },
    161: { title: 'Tuna with Olive Oil', steps: ['Drain tuna', 'Season with salt and pepper', 'Drizzle with olive oil', 'Add lemon juice', 'Serve with bread'] },
    162: { title: 'Salmon Pan', steps: ['Season salmon with salt', 'Cut vegetables into pieces', 'sauté vegetables for 3 minutes', 'Add salmon and cook for 8 minutes', 'Season and serve'] },
    163: { title: 'Cod with Garlic', steps: ['Finely chop garlic', 'Season cod with salt', 'sauté garlic in oil for 1 minute', 'Add cod and fry for 4-5 minutes per side', 'Serve hot'] },
    164: { title: 'Trout with Almonds', steps: ['Chop almonds and toast lightly', 'Season trout with salt', 'Fry in butter for 4-5 minutes per side', 'Sprinkle almonds over', 'Serve with lemon'] },
    167: { title: 'Salmon with Soy Sauce', steps: ['Season salmon with salt', 'Mix soy sauce with water', 'Fry salmon for 4-5 minutes per side', 'Drizzle with soy sauce', 'Serve over rice'] },
    168: { title: 'Cod Pan', steps: ['Season cod with salt', 'Cut vegetables and sauté for 3 minutes', 'Add cod and cook covered for 10 minutes', 'Season with lemon', 'Serve hot'] },
    169: { title: 'Tuna with Bell Pepper', steps: ['Drain tuna and flake', 'Cut bell pepper into strips', 'sauté bell pepper for 3 minutes', 'Add tuna and heat through', 'Season with salt', 'Serve warm'] },
    170: { title: 'Salmon with Zucchini', steps: ['Season salmon with salt', 'Slice zucchini thinly', 'sauté zucchini for 2 minutes', 'Add salmon and cook for 8-10 minutes', 'Season and serve'] },
    171: { title: 'Cod with Olive Oil and Lemon', steps: ['Season cod with salt', 'Squeeze lemon', 'Fry cod in olive oil for 4-5 minutes per side', 'Drizzle with lemon juice', 'Serve immediately'] },
    173: { title: 'Trout Pan', steps: ['Season trout with salt', 'Cut vegetables into pieces', 'sauté vegetables for 3 minutes', 'Add trout and cook for 10 minutes', 'Season and serve'] },
    176: { title: 'Salmon with Potatoes', steps: ['Dice potatoes and cook until tender', 'Season salmon with salt', 'Fry salmon for 4-5 minutes per side', 'Serve with potatoes'] },
    177: { title: 'Cod with Cream', steps: ['Season cod with salt', 'Fry in butter for 4 minutes per side', 'Add cream and simmer for 3 minutes', 'Season with salt', 'Serve hot'] },
    179: { title: 'Tuna with Lemon', steps: ['Drain tuna', 'Squeeze lemon', 'Season tuna with lemon juice', 'Add olive oil', 'Season with salt', 'Serve as salad'] },
    181: { title: 'Salmon with Herbs', steps: ['Finely chop herbs', 'Season salmon with salt', 'Fry for 4-5 minutes per side', 'Sprinkle herbs over', 'Serve with lemon'] },
    182: { title: 'Cod with Rice', steps: ['Cook rice according to package', 'Season cod with salt', 'Fry for 4-5 minutes per side', 'Serve over rice'] },
    183: { title: 'Trout with Garlic', steps: ['Finely chop garlic', 'Season trout with salt', 'sauté garlic for 1 minute', 'Fry trout for 4-5 minutes per side', 'Serve hot'] },
    184: { title: 'Tuna Pan with Vegetables', steps: ['Drain tuna', 'Cut vegetables and sauté for 3 minutes', 'Add tuna and heat through', 'Season with soy sauce', 'Serve over rice'] },
    188: { title: 'Salmon with Cream', steps: ['Season salmon with salt', 'Fry for 4 minutes per side', 'Add cream and simmer for 3 minutes', 'Season with dill', 'Serve hot'] },
    192: { title: 'Beef with Onion', steps: ['Cut beef into cubes', 'Season with salt', 'Sear in hot oil', 'Add diced onions and cook for 2 minutes', 'Simmer for 20 minutes', 'Season and serve'] },
    207: { title: 'Beef with Vegetables', steps: ['Cut beef into cubes', 'Dice vegetables', 'Sear beef in hot oil', 'Add vegetables and cook for 3 minutes', 'Simmer for 25 minutes', 'Season and serve'] },
    211: { title: 'Beef Stew with Herbs', steps: ['Cut beef chuck or stew meat into about 3-4 cm cubes and pat dry with paper towels for better browning', 'Finely chop fresh herbs such as thyme, rosemary, and parsley, keeping some aside for garnish', 'Heat oil in heavy Dutch oven or large pot over high heat until shimmering', 'Sear beef cubes in batches for about 3-4 minutes per side until deeply browned on all sides. Set aside', 'Add chopped herbs and briefly toast in the pot for about 30 seconds until fragrant', 'Return beef to pot and pour in beef stock until meat is almost covered (about 1-1.5 liters)', 'Bring to boil, then reduce heat to very low. Cover and simmer gently for about 1.5-2 hours until beef is fork-tender', 'Season with salt and pepper to taste and garnish with fresh herbs', 'Serve hot with crusty bread or over mashed potatoes'] },
    215: { title: 'Pork with Vegetables', steps: ['Cut pork shoulder or loin into about 2-3 cm cubes and pat dry', 'Dice mixed vegetables such as carrots, bell peppers, and onions into similar-sized pieces', 'Heat oil in large skillet or wok over high heat until very hot', 'Sear pork cubes for about 4-5 minutes until browned on all sides. Remove and set aside', 'Add vegetables to same pan and stir-fry for about 3-4 minutes until crisp-tender', 'Return pork to pan with vegetables and toss together', 'Reduce heat to medium-low, cover, and simmer for about 15-20 minutes until pork is cooked through', 'Season with salt, pepper, and optional herbs', 'Serve hot over rice or with crusty bread'] },
    217: { title: 'Pork with Garlic', steps: ['Cut pork loin or shoulder into about 2 cm cubes and season lightly with salt', 'Peel and press or mince about 4-5 garlic cloves', 'Heat oil in large skillet over high heat until shimmering', 'Sear pork cubes for about 4-5 minutes, turning to brown all sides evenly. Remove and set aside', 'Reduce heat to medium and add minced garlic to the pan. sauté for about 1-2 minutes until fragrant but not burned', 'Return pork to pan and toss with garlic', 'Add a splash of broth or water, reduce heat to low, cover and simmer for about 10-12 minutes until pork is tender', 'Season with pepper and additional salt if needed', 'Serve hot garnished with fresh parsley'] },
    218: { title: 'Pork with Onion', steps: ['Cut pork shoulder into about 2-3 cm cubes and pat dry with paper towels', 'Peel and chop about 2 medium onions into half-moon slices or chunks', 'Heat oil in heavy skillet or Dutch oven over medium-high heat', 'Sear pork cubes for about 5-6 minutes until nicely browned on all sides. Remove and set aside', 'Add chopped onion to same pan and sauté for about 2-3 minutes until softened and starting to caramelize', 'Return pork to pan with onions and toss to combine', 'Add a splash of broth or water, reduce heat to low, cover and simmer for about 15-20 minutes until pork is tender', 'Season with salt and black pepper to taste', 'Serve hot with mashed potatoes or rice'] },
    219: { title: 'Pork with Bell Pepper', steps: ['Cut pork loin or shoulder into about 2 cm cubes and season with salt and pepper', 'Core bell peppers (use red, yellow, or green) and cut into wide strips or chunks', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear pork cubes for about 4-5 minutes until browned on all sides. Remove and set aside', 'Add bell pepper strips to same pan and stir-fry for about 3-4 minutes until slightly softened but still crisp', 'Return pork to pan with peppers and toss together', 'Reduce heat to medium, cover and simmer for about 12-15 minutes until pork is cooked through', 'Season with additional salt, pepper, and optional paprika for extra flavor', 'Serve hot over rice or noodles'] },
    220: { title: 'Pork with Tomatoes', steps: ['Cut pork shoulder or loin into about 2-3 cm cubes and pat dry', 'Dice fresh tomatoes into chunks (or use canned diced tomatoes)', 'Heat oil in large deep skillet or pot over medium-high heat', 'Sear pork cubes for about 5-6 minutes until browned on all sides', 'Add diced tomatoes with their juices to the pan and stir to combine', 'Bring to boil, then reduce heat to low and simmer for about 10-12 minutes until pork is tender', 'Season with salt, black pepper, and optional fresh basil or oregano', 'Serve hot over pasta, rice, or with crusty bread'] },
    221: { title: 'Pork with Cream', steps: ['Cut pork tenderloin or loin into about 2 cm cubes and season generously with salt', 'Heat oil in large skillet over high heat until very hot', 'Sear pork cubes for about 4-5 minutes until golden brown on all sides. Remove and set aside', 'Reduce heat to medium and add heavy cream (about 200-250ml) to the pan. Stir to deglaze', 'Return pork to pan with cream and stir to coat', 'Simmer gently for about 15-20 minutes until cream thickens and pork is tender and cooked through', 'Season with black pepper, and add optional fresh herbs like thyme or rosemary', 'Serve hot with boiled potatoes, mashed potatoes, or over pasta'] },
    223: { title: 'Pork with Garlic and Herbs', steps: ['Cut pork shoulder or loin into about 2-3 cm cubes and pat dry', 'Peel and finely chop or mince about 4-5 garlic cloves. Finely chop fresh herbs such as rosemary, thyme, and parsley', 'Heat oil in large skillet over high heat until shimmering', 'Sear pork cubes for about 5-6 minutes until deeply browned on all sides. Remove and set aside', 'Reduce heat to medium, add garlic and herbs to pan, and sauté for about 1-2 minutes until fragrant', 'Return pork to pan and toss with garlic-herb mixture', 'Add a splash of broth or water, cover, and simmer for about 10-12 minutes until pork is tender', 'Season with salt and pepper to taste', 'Serve hot garnished with additional fresh herbs'] },
    226: { title: 'Pork with Rice', steps: ['Cut pork tenderloin or loin into about 2 cm cubes and season with salt and pepper', 'Cook rice according to package instructions in salted water (about 1 cup rice for 2 servings)', 'Heat oil in large skillet over high heat until shimmering', 'Sear pork cubes for about 8-10 minutes, turning occasionally, until golden brown and cooked through', 'Fluff cooked rice with fork and arrange on serving plates', 'Place seared pork cubes over rice', 'Garnish with fresh chopped herbs like parsley or cilantro', 'Optionally drizzle with pan juices and serve hot'] },
    227: { title: 'Pork with Vegetables and Rice', steps: ['Cut pork loin into about 2 cm cubes and dice mixed vegetables (carrots, bell peppers, onions) into similar-sized pieces', 'Cook rice according to package instructions in salted water', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear pork cubes for about 5-6 minutes until browned. Remove and set aside', 'Add diced vegetables to same pan and stir-fry for about 3-4 minutes until crisp-tender', 'Return pork to pan with vegetables and toss together for another 2 minutes', 'Season with salt, pepper, and optional soy sauce', 'Serve hot over fluffy cooked rice'] },
    228: { title: 'Pork with Soy Sauce', steps: ['Cut pork tenderloin or loin into about 2 cm cubes and season lightly with salt', 'Heat oil in large skillet or wok over high heat until very hot', 'Sear pork cubes for about 5-6 minutes until browned on all sides', 'Add soy sauce (about 3-4 tablespoons) to the pan and toss to coat the pork', 'Cook for about 8-10 minutes, stirring occasionally, until sauce reduces and glazes the meat', 'Taste and adjust seasoning if needed', 'Serve hot over steamed rice, garnished with sesame seeds or sliced green onions'] },
    229: { title: 'Pork with Paprika', steps: ['Cut pork shoulder or loin into about 2-3 cm cubes and pat dry', 'Core and dice bell pepper into chunks', 'Heat oil in large deep skillet or pot over medium-high heat', 'Sear pork cubes for about 5-6 minutes until browned on all sides', 'Add diced bell pepper and sprinkle generously with paprika powder (about 1-2 tablespoons)', 'Stir well to coat everything with paprika, then add a splash of broth or water', 'Reduce heat to low, cover, and simmer for about 15-20 minutes until pork is tender', 'Season with salt and pepper to taste and serve hot'] },
    231: { title: 'Pork Pan with Vegetables', steps: ['Cut pork loin or shoulder into about 2 cm cubes and pat dry', 'Dice mixed vegetables such as zucchini, bell peppers, and onions into bite-sized pieces', 'Heat oil in large skillet or wok over high heat until very hot', 'Sear pork cubes for about 5-6 minutes until nicely browned. Remove and set aside', 'Add diced vegetables to same pan and stir-fry for about 5-6 minutes until tender-crisp', 'Return pork to pan with vegetables and toss together', 'Season with salt, black pepper, and optional garlic powder', 'Serve hot as a complete one-pan meal'] },
    232: { title: 'Pork with Lemon', steps: ['Cut pork tenderloin into about 2 cm cubes and season with salt and pepper', 'Halve and squeeze fresh lemons to get about 3-4 tablespoons of juice', 'Heat oil in large skillet over medium-high heat', 'Sear pork cubes for about 6-7 minutes until browned on all sides', 'Add fresh lemon juice to the pan and toss to coat', 'Cook for about 8-10 minutes, stirring occasionally, until pork is tender and sauce reduces slightly', 'Season with additional salt and pepper if needed', 'Serve hot garnished with lemon wedges and fresh parsley'] },
    234: { title: 'Chicken with Vegetables', steps: ['Cut chicken breast or thighs into about 2-3 cm cubes and season with salt', 'Dice mixed vegetables such as carrots, bell peppers, zucchini, and onions into bite-sized pieces', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear chicken cubes for about 5-6 minutes until golden brown. Remove and set aside', 'Add diced vegetables to same pan and stir-fry for about 5-6 minutes until crisp-tender', 'Return chicken to pan with vegetables and toss together for another 2 minutes', 'Season with salt, pepper, and optional soy sauce or garlic powder', 'Serve hot over steamed rice'] },
    235: { title: 'Chicken with Tomatoes', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season with salt and pepper', 'Dice fresh tomatoes into chunks (or use canned diced tomatoes)', 'Heat oil in large skillet over medium-high heat', 'Sear chicken cubes for about 5-6 minutes until browned on all sides. Remove and set aside', 'Add diced tomatoes with their juices to the pan. Bring to boil and cook for about 3 minutes', 'Return chicken to pan and simmer together for about 8-10 minutes until chicken is cooked through', 'Season with fresh basil leaves, salt, and pepper', 'Serve hot over pasta or rice'] },
    237: { title: 'Chicken with Soy Sauce', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season lightly with salt', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear chicken cubes for about 6-7 minutes, stirring occasionally, until golden brown and almost cooked through', 'Add soy sauce (about 3-4 tablespoons) to the pan and toss to coat', 'Cook for about 3-4 minutes more, stirring frequently, until sauce reduces and glazes the chicken', 'Taste and adjust seasoning if needed', 'Serve hot over steamed rice, garnished with sliced green onions and sesame seeds'] },
    238: { title: 'Chicken with Bell Pepper', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season with salt and pepper', 'Core bell peppers (use mix of colors) and cut into wide strips or chunks', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear chicken cubes for about 5-6 minutes until browned. Remove and set aside', 'Add bell pepper strips to same pan and stir-fry for about 4-5 minutes until slightly softened', 'Return chicken to pan with peppers and toss together for another 2 minutes', 'Season with additional salt and pepper to taste', 'Serve hot over rice or noodles'] },
    240: { title: 'Chicken with Onion', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season with salt', 'Peel and chop about 2 medium onions into half-moon slices or chunks', 'Heat oil in large skillet or wok over medium-high heat', 'Sear chicken cubes for about 5-6 minutes until browned. Remove and set aside', 'Add chopped onion to same pan and sauté for about 3-4 minutes until softened and starting to caramelize', 'Return chicken to pan with onions and toss together for another 2-3 minutes', 'Season with salt and black pepper to taste', 'Serve hot with steamed rice'] },
    241: { title: 'Chicken with Cream', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season generously with salt', 'Heat oil in large skillet over high heat until very hot', 'Sear chicken cubes for about 5-6 minutes until golden brown. Remove and set aside', 'Reduce heat to medium and add heavy cream (about 200ml) to the pan. Stir to deglaze', 'Return chicken to pan with cream and stir to coat', 'Simmer gently for about 10-12 minutes until cream thickens and chicken is cooked through', 'Season with black pepper and optional fresh herbs like thyme or basil', 'Serve hot over pasta or with rice'] },
    242: { title: 'Chicken with Paprika', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season with salt', 'Core and dice bell pepper into chunks', 'Heat oil in large skillet over medium-high heat', 'Sear chicken cubes for about 5-6 minutes until browned', 'Add diced bell pepper and sprinkle generously with paprika powder (about 1-2 tablespoons). Stir well to coat', 'Cook for about 8-10 minutes, stirring occasionally, until chicken is cooked through and peppers are tender', 'Season with additional salt and pepper to taste', 'Serve hot over rice or with crusty bread'] },
    244: { title: 'Chicken with Vegetables and Rice', steps: ['Cut chicken breast or thighs into about 2 cm cubes and dice mixed vegetables (carrots, bell peppers, zucchini) into similar-sized pieces', 'Cook rice according to package instructions in salted water', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear chicken cubes for about 5-6 minutes until golden brown. Remove and set aside', 'Add diced vegetables to same pan and stir-fry for about 5-6 minutes until crisp-tender', 'Return chicken to pan with vegetables and toss together for another 2 minutes', 'Season with salt, pepper, and optional soy sauce', 'Serve hot over fluffy cooked rice'] },
    247: { title: 'Chicken with Zucchini', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season with salt and pepper', 'Wash and dice zucchini into bite-sized chunks', 'Heat oil in large skillet or wok over high heat until very hot', 'Sear chicken cubes for about 5-6 minutes until browned. Remove and set aside', 'Add diced zucchini to same pan and stir-fry for about 4-5 minutes until lightly golden and tender-crisp', 'Return chicken to pan with zucchini and toss together for another 2 minutes', 'Season with additional salt, black pepper, and optional garlic powder', 'Serve hot over rice or with pasta'] },
    252: { title: 'Lamb with Rosemary', steps: ['Cut lamb leg or shoulder into about 3-4 cm cubes and pat dry with paper towels', 'Finely chop fresh rosemary and mince about 3-4 garlic cloves', 'Season lamb cubes generously with salt and pepper', 'Heat oil in large oven-safe Dutch oven or pot over high heat until shimmering', 'Sear lamb cubes in batches for about 4-5 minutes per side until deeply browned on all sides. Remove and set aside', 'Add chopped rosemary and garlic to the pot and sauté for about 1 minute until fragrant', 'Return lamb to pot, add a splash of broth or water, and stir to combine', 'Cover and transfer to preheated oven at 160 Grad C. Braise for about 45-50 minutes until lamb is very tender', 'Serve hot with roasted vegetables and potatoes'] },
    254: { title: 'Veal with Cream', steps: ['Cut veal shoulder or leg into about 2-3 cm cubes and season with salt and pepper', 'Heat oil in large skillet over high heat until very hot', 'Sear veal cubes for about 4-5 minutes until golden brown on all sides. Remove and set aside', 'Reduce heat to medium and add heavy cream (about 250ml) to the pan. Stir to deglaze', 'Return veal to pan with cream and stir to coat', 'Simmer gently for about 15-20 minutes until cream thickens and veal is tender and cooked through', 'Season with black pepper and optional nutmeg or fresh thyme', 'Serve hot with rice, pasta, or boiled potatoes'] },
    255: { title: 'Veal with Vegetables', steps: ['Cut veal shoulder or leg into about 2-3 cm cubes and pat dry', 'Dice mixed vegetables such as carrots, celery, and bell peppers into chunks', 'Heat oil in large deep skillet or Dutch oven over high heat', 'Sear veal cubes for about 5-6 minutes until browned on all sides. Remove and set aside', 'Add diced vegetables to same pot and sauté for about 3-4 minutes until starting to soften', 'Return veal to pot with vegetables, add a splash of broth or water, and stir', 'Reduce heat to low, cover, and simmer for about 20-25 minutes until veal is very tender', 'Season with salt, pepper, and fresh herbs', 'Serve hot as a hearty stew'] },
    256: { title: 'Veal with Mushrooms', steps: ['Cut veal shoulder into about 2 cm cubes and season with salt and pepper', 'Clean and halve or quarter mushrooms (button, cremini, or mixed)', 'Heat oil in large skillet over high heat until very hot', 'Sear veal cubes for about 4-5 minutes until browned on all sides. Remove and set aside', 'Add mushrooms to same pan and cook for about 4-5 minutes until golden and their liquid evaporates', 'Return veal to pan with mushrooms and toss together', 'Add a splash of broth or white wine, reduce heat to low, cover and simmer for about 15-18 minutes until veal is tender', 'Season with salt, pepper, and optional fresh parsley or thyme', 'Serve hot over pasta or with rice'] },
    257: { title: 'Veal with Herbs', steps: ['Cut veal shoulder or leg into about 2 cm cubes and pat dry', 'Finely chop fresh herbs such as parsley, thyme, rosemary, and sage', 'Heat oil in large skillet over high heat until shimmering', 'Sear veal cubes for about 4-5 minutes until browned on all sides. Remove and set aside', 'Reduce heat to medium, add chopped herbs to pan and sauté for about 2 minutes until fragrant', 'Return veal to pan and toss with herb mixture', 'Add a splash of white wine or broth, cover, and simmer for about 15-18 minutes until veal is tender', 'Season with salt and black pepper to taste', 'Serve hot garnished with additional fresh herbs'] },
    258: { title: 'Veal with Onion', steps: ['Cut veal shoulder into about 2-3 cm cubes and pat dry', 'Peel and chop about 2-3 medium onions into half-moon slices or chunks', 'Heat oil in large deep skillet or Dutch oven over medium-high heat', 'Sear veal cubes for about 5-6 minutes until browned on all sides. Remove and set aside', 'Add chopped onion to same pot and sauté for about 2-3 minutes until softened and starting to caramelize', 'Return veal to pot with onions and toss together', 'Add a splash of broth or water, reduce heat to low, cover and simmer for about 20-25 minutes until veal is very tender', 'Season with salt, black pepper, and optional fresh thyme', 'Serve hot with mashed potatoes or rice'] },
    259: { title: 'Veal with Tomatoes', steps: ['Cut veal shoulder or leg into about 2-3 cm cubes and pat dry', 'Dice fresh tomatoes into chunks (or use canned diced tomatoes)', 'Heat oil in large deep skillet or pot over medium-high heat', 'Sear veal cubes for about 5-6 minutes until browned on all sides', 'Add diced tomatoes with their juices to the pan and stir to combine', 'Bring to boil, then reduce heat to low and simmer for about 15-20 minutes until veal is tender', 'Season with fresh basil leaves, salt, and black pepper', 'Serve hot over pasta or with crusty bread'] },
    262: { title: 'Beef with Vegetables and Rice', steps: ['Cut beef chuck or stew meat into about 2-3 cm cubes and pat dry', 'Dice mixed vegetables such as carrots, bell peppers, and onions into chunks', 'Cook rice according to package instructions in salted water', 'Heat oil in large wok or deep skillet over very high heat until shimmering', 'Sear beef cubes for about 3-4 minutes until deeply browned but still medium-rare inside. Remove and set aside', 'Add diced vegetables to same pan and stir-fry for about 5-6 minutes until tender-crisp', 'Return beef to pan with vegetables and toss together for another minute', 'Season with salt, pepper, and optional soy sauce', 'Serve hot over fluffy cooked rice'] },
    264: { title: 'Beef with Cream', steps: ['Cut beef chuck or tenderloin into about 2-3 cm cubes and season generously with salt and pepper', 'Heat oil in large deep skillet or Dutch oven over high heat until very hot', 'Sear beef cubes for about 4-5 minutes until deeply browned on all sides. Remove and set aside', 'Reduce heat to medium and add heavy cream (about 300ml) to the pan. Stir to deglaze and scrape up browned bits', 'Return beef to pan with cream and stir to coat', 'Simmer gently for about 25-30 minutes until cream thickens into rich sauce and beef is very tender', 'Season with black pepper, and optional fresh thyme or rosemary', 'Serve hot over pasta, mashed potatoes, or with crusty bread'] },
    266: { title: 'Beef with Garlic and Herbs', steps: ['Cut beef chuck or stew meat into about 3-4 cm cubes and pat dry', 'Peel and press or mince about 5-6 garlic cloves. Finely chop fresh herbs such as thyme, rosemary, and parsley', 'Heat oil in large Dutch oven or heavy pot over high heat until shimmering', 'Sear beef cubes in batches for about 4-5 minutes per side until deeply browned. Remove and set aside', 'Reduce heat to medium, add garlic and herbs to pan, and sauté for about 1-2 minutes until fragrant', 'Return beef to pot, add enough broth or water to almost cover meat, and stir', 'Bring to boil, then reduce heat to very low. Cover and simmer for about 25-30 minutes until beef is fork-tender', 'Season with salt and black pepper to taste', 'Serve hot garnished with additional fresh herbs'] },
    268: { title: 'Pork with Vegetables and Beans', steps: ['Cut pork shoulder or loin into about 2 cm cubes and pat dry', 'Dice mixed vegetables such as carrots, bell peppers, and onions. Drain canned beans (white or kidney beans)', 'Heat oil in large deep skillet or pot over medium-high heat', 'Sear pork cubes for about 5-6 minutes until browned on all sides. Remove and set aside', 'Add diced vegetables to same pot and sauté for about 3-4 minutes until starting to soften', 'Return pork to pot, add drained beans, and stir to combine', 'Add a splash of broth or water, reduce heat to medium, and cook for about 12-15 minutes until pork is cooked through', 'Season with salt, pepper, and optional paprika or cumin', 'Serve hot as a hearty one-pot meal'] },
    269: { title: 'Pork with Mushrooms', steps: ['Cut pork tenderloin or loin into about 2 cm cubes and season with salt and pepper', 'Clean and halve or quarter mushrooms (button, cremini, or mixed)', 'Heat oil in large skillet over high heat until very hot', 'Sear pork cubes for about 4-5 minutes until browned on all sides. Remove and set aside', 'Add mushrooms to same pan and cook for about 4-5 minutes until golden and their liquid evaporates', 'Return pork to pan with mushrooms and toss together', 'Add a splash of broth or white wine, reduce heat to low, cover and simmer for about 15-18 minutes until pork is tender', 'Season with salt, pepper, and optional fresh parsley or thyme', 'Serve hot over pasta, rice, or with mashed potatoes'] },
    270: { title: 'Chicken with Lemon', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season with salt and pepper', 'Halve and squeeze fresh lemons to get about 4-5 tablespoons of juice', 'Heat oil in large skillet over medium-high heat until shimmering', 'Sear chicken cubes for about 5-6 minutes until golden brown on all sides', 'Add fresh lemon juice to the pan and toss to coat', 'Cook for about 5-6 minutes more, stirring occasionally, until chicken is cooked through and sauce reduces', 'Season with additional salt, pepper, and optional lemon zest', 'Serve hot garnished with lemon wedges and fresh parsley'] },
    273: { title: 'Chicken with Vegetables and Herbs', steps: ['Cut chicken breast or thighs into about 2 cm cubes and dice mixed vegetables (carrots, bell peppers, zucchini)', 'Finely chop fresh herbs such as parsley, thyme, and rosemary', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear chicken cubes for about 5-6 minutes until browned. Remove and set aside', 'Add diced vegetables to same pan and stir-fry for about 5-6 minutes until tender-crisp', 'Return chicken to pan with vegetables, sprinkle chopped herbs over, and toss together', 'Cook for another 1-2 minutes to heat through and allow herbs to infuse', 'Season with salt, pepper, and optional lemon zest', 'Serve hot over rice'] },
    274: { title: 'Chicken with Bell Pepper and Rice', steps: ['Cut chicken breast or thighs into about 2 cm cubes and dice bell peppers (use mix of colors)', 'Cook rice according to package instructions in salted water', 'Heat oil in large wok or skillet over high heat until very hot', 'Sear chicken cubes for about 5-6 minutes until golden brown. Remove and set aside', 'Add diced bell pepper to same pan and stir-fry for about 4-5 minutes until lightly softened but still crisp', 'Return chicken to pan with peppers and toss together for another minute', 'Season with salt, pepper, and optional soy sauce', 'Serve hot over fluffy cooked rice'] },
    278: { title: 'Chicken with Cream and Mushrooms', steps: ['Cut chicken breast or thighs into about 2 cm cubes and season with salt and pepper', 'Clean and halve or quarter mushrooms (button, cremini, or mixed)', 'Heat oil in large skillet over high heat until shimmering', 'Sear chicken cubes for about 5-6 minutes until golden brown. Remove and set aside', 'Add mushrooms to same pan and cook for about 4-5 minutes until golden and their liquid evaporates', 'Return chicken to pan with mushrooms and toss together', 'Pour in heavy cream (about 150-200ml) and stir to combine. Reduce heat to medium', 'Simmer gently for about 8-10 minutes until cream thickens and chicken is cooked through', 'Season with black pepper and optional fresh herbs like thyme or parsley', 'Serve hot over pasta or rice'] },
    279: { title: 'Chicken Pan with Vegetables', steps: ['Cut chicken breast or thighs into about 2 cm cubes and dice mixed vegetables (bell peppers, onions, snap peas)', 'Heat oil in large wok or skillet over very high heat until extremely hot', 'Sear chicken cubes for about 5-6 minutes until golden brown. Remove and set aside', 'Add diced vegetables to same pan and stir-fry vigorously for about 5-6 minutes until crisp-tender', 'Return chicken to pan with vegetables, drizzle with soy sauce (about 2-3 tablespoons), and toss to coat everything', 'Cook for another 1-2 minutes to combine flavors and heat through', 'Taste and adjust seasoning if needed with additional soy sauce or white pepper', 'Serve immediately over steamed rice or egg noodles'] },
    280: { title: 'Beef with Beans', steps: ['Cut beef chuck or stew meat into about 2-3 cm cubes and pat dry', 'Drain canned beans (white, kidney, or cannellini beans) and set aside', 'Heat oil in large deep pot or Dutch oven over high heat until shimmering', 'Sear beef cubes for about 5-6 minutes until deeply browned on all sides. Remove and set aside', 'Add drained beans back to pot along with beef', 'Add enough broth or water to just cover the meat and beans', 'Bring to boil, then reduce heat to very low. Cover and simmer for about 30-35 minutes until beef is very tender', 'Season with salt, black pepper, and optional paprika or fresh herbs', 'Serve hot as a hearty stew with crusty bread'] },
    288: { title: 'Tuna with Vegetables', steps: ['Drain canned tuna thoroughly and break into flakes using a fork', 'Dice fresh vegetables such as bell peppers, onions, tomatoes, and celery into small, uniform pieces', 'Heat oil in large skillet over medium heat', 'sauté diced vegetables for about 3-4 minutes until softened but still slightly crisp', 'Add flaked tuna to the pan and mix gently but thoroughly to combine', 'Heat through for about 3-4 minutes more, stirring gently, until everything is warmed', 'Season with salt, black pepper, and optional fresh herbs like parsley or dill', 'Serve warm as a light salad, over rice, or with crusty bread'] },
    289: { title: 'Salmon with Potatoes and Dill', steps: ['Peel and dice potatoes (about 2-3 cm cubes) and cook in salted boiling water for about 15-20 minutes until tender', 'Cut salmon fillets into portions and season both sides generously with salt and black pepper', 'Heat oil or butter in large skillet over medium-high heat', 'Fry salmon fillets for about 4-5 minutes per side until golden outside and cooked through inside', 'Finely chop fresh dill and sprinkle over the cooked salmon', 'Drain cooked potatoes and arrange on serving plates', 'Place salmon on top of potatoes', 'Serve hot, optionally with a squeeze of fresh lemon juice'] },
    290: { title: 'Cod with Vegetables', steps: ['Season cod fillets with salt on both sides', 'Wash and cut vegetables (such as zucchini, bell peppers, carrots) into bite-sized pieces', 'Heat oil in large oven-safe skillet over medium heat', 'sauté cut vegetables for about 3-4 minutes until starting to soften', 'Place cod fillets on top of vegetables and season with additional salt and pepper', 'Cover the skillet with a lid or aluminum foil', 'Cook in preheated 200 Grad C oven for about 10-12 minutes until fish is opaque and vegetables are tender', 'Season and serve hot directly from the skillet'] },
    291: { title: 'Trout with Vegetables', steps: ['Season whole trout or fillets with salt inside and outside', 'Cut vegetables (zucchini, bell peppers, onions, carrots) into bite-sized pieces', 'Heat oil in large oven-safe skillet over medium heat', 'sauté vegetables for about 3-4 minutes until slightly softened', 'Carefully place trout on top of vegetables and season with additional salt and pepper', 'Cover with a lid or foil', 'Cook in preheated 200 Grad C oven for about 10-12 minutes until fish is cooked through and flesh is opaque', 'Season and serve hot with vegetables'] },
    292: { title: 'Tuna with Rice', steps: ['Drain canned tuna thoroughly and break into flakes using a fork', 'Cook rice according to package instructions in salted water (about 1 cup rice for 2-3 servings)', 'Heat oil in large skillet or wok over medium heat', 'Add flaked tuna to the pan and heat through gently for about 2-3 minutes', 'Drizzle with soy sauce (about 2-3 tablespoons) and mix gently but thoroughly', 'Heat for another minute to combine flavors', 'Fluff cooked rice with fork and arrange on serving plates', 'Top with warm tuna and serve immediately, optionally garnished with sesame seeds or sliced green onions'] },
    293: { title: 'Salmon with Lemon and Herbs', steps: ['Season salmon fillets with salt and black pepper on both sides', 'Finely chop fresh herbs such as dill, parsley, and chives', 'Halve lemons and squeeze to get fresh juice', 'Heat oil or butter in large skillet over medium-high heat', 'Fry salmon fillets for about 4-5 minutes per side until golden outside and cooked through inside', 'Sprinkle chopped fresh herbs over the salmon', 'Drizzle with fresh lemon juice', 'Serve hot, optionally garnished with lemon wedges and additional fresh herbs'] },
    294: { title: 'Cod with Lemon and Butter', steps: ['Season cod fillets with salt and black pepper on both sides', 'Halve fresh lemons and squeeze to get about 3-4 tablespoons of juice', 'Melt butter in large skillet over medium heat', 'Carefully fry cod fillets for about 4-5 minutes per side until golden and cooked through', 'Drizzle with fresh lemon juice', 'Season with additional fresh ground pepper', 'Serve immediately while still hot and aromatic'] },
    295: { title: 'Trout with Herbs', steps: ['Season whole trout or fillets with salt inside and outside', 'Finely chop fresh herbs such as dill, parsley, thyme, and chives', 'Melt butter in large skillet over medium heat', 'Carefully fry trout for about 4-5 minutes per side until skin is golden and flesh is opaque', 'Sprinkle chopped fresh herbs over the trout', 'Serve hot with fresh lemon wedges on the side'] },
    296: { title: 'Tuna with Tomatoes and Beans', steps: ['Drain canned tuna thoroughly and break into flakes', 'Drain canned beans (white or cannellini) and set aside', 'Dice fresh tomatoes or use canned diced tomatoes', 'Heat oil in large skillet over medium heat', 'sauté diced tomatoes for about 3-4 minutes, releasing their juices', 'Add flaked tuna and drained beans to the pan and mix gently', 'Heat through for about 5-6 minutes, stirring occasionally, until everything is warmed', 'Season with salt, black pepper, and optional fresh basil or oregano', 'Serve warm as a salad, over rice, or with crusty bread'] },
    297:{title:'Salmon Pan',steps:['Pat salmon filets dry and season with salt and pepper.','Cut vegetables (zucchini, bell peppers, cherry tomatoes) into bite-sized pieces and set aside.','Heat olive oil in a large oven-safe skillet over medium heat.','sauté vegetables for about 3 minutes until they begin to soften.','Nestle salmon filets among the vegetables.','Cook for about 8 minutes, either on the stovetop or transfer to a preheated 200 Grad C (400üf) oven, until salmon is cooked through.','Squeeze fresh lemon juice over everything.','Serve hot straight from the pan for a beautiful presentation.']},
    298:{title:'Cod with Cream and Herbs',steps:['Pat cod filets dry and season both sides with salt and pepper.','Finely chop fresh herbs (dill, parsley, and chives create a lovely combination).','Heat butter in a skillet over medium heat.','Fry cod for about 4 minutes per side until golden and nearly cooked through.','Pour in heavy cream (about 150ml) and add chopped herbs.','Reduce heat and simmer gently for about 3 minutes until the sauce thickens slightly and the fish is fully cooked.','Taste and adjust seasoning.','Serve hot with the creamy herb sauce spooned over the fish.']},
    300:{title:'Trout with Lemon and Butter',steps:['Pat trout dry with paper towels and season inside and out with salt and pepper.','Halve lemon and squeeze out fresh juice.','Melt generous amount of butter in a large skillet until it begins to foam and smell nutty.','Carefully place trout in the foaming butter and cook for about 4-5 minutes per side until the skin is crispy golden and the flesh is opaque.','Remove from heat and immediately drizzle with fresh lemon juice which will sizzle in the hot butter.','Serve immediately while the butter and lemon create a delicious sauce.']},
    301:{title:'Tuna Salad',steps:['Drain canned tuna thoroughly and break into bite-sized flakes using a fork.','Dice fresh vegetables such as cucumber, tomatoes, bell peppers, and red onion into small, uniform pieces.','In a large bowl, combine the flaked tuna and diced vegetables.','In a small bowl, whisk together olive oil and fresh lemon juice to create a light dressing.','Pour the dressing over the tuna and vegetables and toss gently to coat everything evenly.','Season with salt and freshly ground black pepper.','Let the salad marinate in the refrigerator for about 10-15 minutes to allow the flavors to meld beautifully.','Serve chilled or at room temperature as a refreshing salad, optionally garnished with fresh herbs like parsley or basil.']},
    303:{title:'Beef with Tomatoes and Bell Pepper',steps:['Cut beef into 2-3cm cubes.','Dice fresh tomatoes and bell peppers into chunks, removing seeds.','Heat oil in a heavy pot or Dutch oven over medium-high heat.','Sear beef cubes on all sides for about 5-7 minutes until deeply browned.','Add tomatoes and bell peppers, stirring to combine.','Reduce heat to low, cover and simmer for about 25-30 minutes until beef is fork-tender and vegetables have softened into a rich sauce.','Season with salt, pepper, paprika, and fresh basil.','Serve hot over rice, pasta, or with crusty bread.']},
    304:{title:'Beef Pan',steps:['Cut beef into bite-sized cubes.','Dice mixed vegetables (bell peppers, onions, snap peas) into similar-sized pieces.','Heat oil in a large wok or skillet over very high heat.','Sear beef cubes for about 3 minutes until browned on the outside but still juicy inside.','Add vegetables and stir-fry vigorously for about 5 minutes until crisp-tender.','Season with soy sauce, a dash of sesame oil, and freshly ground black pepper.','Toss everything together for another minute to combine flavors.','Serve immediately over steamed rice or noodles.']},
    305:{title:'Pork with Cream and Herbs',steps:['Cut pork into 2cm cubes.','Finely chop a generous amount of fresh herbs (sage, thyme, and parsley work wonderfully with pork).','Heat oil in a deep skillet over medium-high heat.','Sear pork cubes for about 5 minutes until golden brown on all sides.','Pour in heavy cream (about 200ml) and add chopped herbs.','Stir to combine, then reduce heat to low.','Cover and simmer gently for about 15 minutes until pork is tender and cream has thickened into a luscious sauce.','Season with salt and pepper.','Serve hot over pasta, rice, or with mashed potatoes.']},
    306:{title:'Pork Pan',steps:['Cut pork into bite-sized cubes.','Dice vegetables (bell peppers, zucchini, onions) into chunks.','Heat oil in a large skillet or wok over medium-high heat.','Sear pork cubes for about 5 minutes, stirring occasionally, until browned and nearly cooked through.','Add vegetables and stir-fry for about 5 minutes until tender-crisp.','Season with salt, pepper, and garlic powder.','Toss everything together for another minute.','Serve hot over rice or noodles.']},
    307:{title:'Chicken with Curry',steps:['Cut chicken breast into bite-sized cubes.','Heat oil in a deep skillet or pot over medium-high heat.','Sear chicken cubes for about 5 minutes until golden on all sides.','Sprinkle in curry powder (2-3 tablespoons, adjust to taste) and stir for about 30 seconds to toast the spices.','Pour in coconut milk (400ml) and stir well to combine into a creamy curry sauce.','Bring to a simmer, then reduce heat to low.','Cover and cook gently for about 20 minutes until chicken is fully cooked and tender.','Season with salt to taste.','Serve hot over steamed basmati rice, garnished with fresh cilantro.']},
    308:{title:'Chicken Pan',steps:['Cut chicken and mixed vegetables (broccoli, carrots, snap peas, bell peppers) into bite-sized pieces.','Heat oil in a large wok or skillet over high heat.','Sear chicken pieces for about 5 minutes until golden brown and nearly cooked through.','Add vegetables and stir-fry vigorously for about 5 minutes until crisp-tender.','Drizzle with soy sauce and toss to coat everything evenly.','Continue stir-frying for another 1-2 minutes to meld flavors.','Serve immediately over steamed rice or lo mein noodles.']},
    309:{title:'Lamb with Vegetables',steps:['Cut lamb into 2-3cm cubes, trimming away excess fat.','Dice mixed vegetables (carrots, celery, onions, potatoes) into chunks.','Heat oil in a heavy Dutch oven or large pot over medium-high heat.','Sear lamb cubes on all sides for about 5-7 minutes until richly browned.','Add vegetables and stir for about 3 minutes.','Pour in enough broth or water to almost cover everything.','Bring to a boil, then reduce heat to very low.','Cover and simmer gently for about 40-45 minutes until lamb is fork-tender and vegetables are soft.','Season with salt, pepper, rosemary, and thyme.','Serve hot as a hearty stew.']},
    310:{title:'Veal Pan',steps:['Cut veal into 2cm cubes.','Dice mixed vegetables (zucchini, bell peppers, cherry tomatoes) into bite-sized pieces.','Heat oil in a large skillet over medium-high heat.','Sear veal cubes for about 5 minutes until lightly browned.','Add vegetables and stir-fry for about 3 minutes.','Add a splash of white wine or broth, reduce heat, and cover.','Simmer for about 15 minutes until veal is tender and vegetables are cooked.','Season with salt, pepper, and fresh herbs.','Serve hot over pasta or with crusty bread.']},
  };
  
  return properTranslations[recipeId] || null;
}

// Store these translations for reference but don't use them yet
// to keep functionality stable

function displaySearchResults(matchedRecipes) {
  const resultsContainer = document.getElementById('results');

  if (!resultsContainer) {
    return;
  }

  if (!Array.isArray(matchedRecipes)) {
    resultsContainer.textContent = '';
    var errMsg = document.createElement('p');
    errMsg.textContent = 'Fehler beim Laden der Rezeptdaten.';
    errMsg.style.color = 'red';
    resultsContainer.appendChild(errMsg);
    return;
  }
  
  if (matchedRecipes.length === 0) {
    resultsContainer.textContent = '';
    var emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Keine passenden Rezepte gefunden. Probiere andere Zutaten oder weniger spezifische Begriffe.';
    resultsContainer.appendChild(emptyMsg);
    return;
  }
  
  resultsContainer.textContent = '';
  
  matchedRecipes.forEach(recipe => {
    const resultElement = document.createElement('div');
    resultElement.className = 'result';
    
    const matchPercentage = Math.round(recipe.score * 100);
    const matchesFound = recipe.matchCount;
    const totalIngredients = recipe.ingredients.length;
    
    // Get translated title if in English mode
    const lang = typeof getLang === 'function' ? getLang() : 'de';
    const properTranslation = getProperEnglishRecipe(recipe.id);
    const recipeTitle = lang === 'en' && properTranslation
      ? properTranslation.title
      : lang === 'en' && recipe.title_en 
        ? recipe.title_en 
        : recipe.title;
    
    const matchLabel  = lang === 'en' ? 'Match' : 'Übereinstimmung';
    const hitLabel    = lang === 'en' ? 'Matches' : 'Treffer';
    const detailLabel = lang === 'en' ? 'Details' : 'Details';

    var h4 = document.createElement('h4');
    h4.textContent = recipeTitle + ' ';
    var small = document.createElement('small');
    small.textContent = '(' + recipe.difficulty + ')';
    h4.appendChild(small);

    var p = document.createElement('p');
    p.textContent = matchLabel + ': ' + matchPercentage + '% \u2013 ' + hitLabel + ': ' + matchesFound + ' / ' + totalIngredients;

    var actionsDiv = document.createElement('div');
    actionsDiv.className = 'result-actions';
    var btn = document.createElement('button');
    btn.className = 'btn';
    btn.setAttribute('data-id', recipe.id);
    btn.textContent = detailLabel;
    actionsDiv.appendChild(btn);

    resultElement.appendChild(h4);
    resultElement.appendChild(p);
    resultElement.appendChild(actionsDiv);
    
    resultsContainer.appendChild(resultElement);
  });
  
  // Attach click handlers for detail buttons
  resultsContainer.querySelectorAll('button[data-id]').forEach(button => {
    button.addEventListener('click', function() {
      const recipeId = Number(this.getAttribute('data-id'));
      const selectedRecipe = recipes.find(r => r.id === recipeId);
      
      if (selectedRecipe) {
        displayRecipeDetails(selectedRecipe);
      }
    });
  });
}
function _t(key, lang, fallback) {
  if (typeof i18n !== 'undefined' && i18n[lang] && i18n[lang][key] !== undefined) return i18n[lang][key];
  if (typeof i18n !== 'undefined' && i18n['de'] && i18n['de'][key] !== undefined) return i18n['de'][key];
  return fallback || key;
}

function displayRecipeDetails(selectedRecipe) {
  const lang = typeof getLang === 'function' ? getLang() : 'de';
  
  // Check if we have proper manual translations first
  const properTranslation = getProperEnglishRecipe(selectedRecipe.id);
  
  // Get translated title
  const recipeTitle = lang === 'en' && properTranslation
    ? properTranslation.title
    : lang === 'en' && selectedRecipe.title_en 
      ? selectedRecipe.title_en 
      : selectedRecipe.title;
  
  // Get translated steps
  const steps = lang === 'en' && properTranslation
    ? properTranslation.steps
    : lang === 'en' && selectedRecipe.steps_en 
      ? selectedRecipe.steps_en 
      : selectedRecipe.steps;
  
  const ingredientsList = selectedRecipe.ingredients
    .map(ing => translateIngredient(ing, lang))
    .join(', ');

  const ingredientsLabel = lang === 'en' ? 'Ingredients:' : 'Zutaten:';
  const preparationLabel = lang === 'en' ? 'Preparation:' : 'Zubereitung:';

  // Build DOM fragment instead of HTML string (XSS prevention)
  var frag = document.createDocumentFragment();

  var h3 = document.createElement('h3');
  h3.textContent = recipeTitle;
  frag.appendChild(h3);

  // ===== SERVINGS STEPPER =====
  var currentServings = (typeof Quantities !== 'undefined') ? Quantities.getDefaultServings() : 4;
  var servingsBase = selectedRecipe.servings_base || 4;

  var servingsDiv = document.createElement('div');
  servingsDiv.className = 'sfc-servings';
  servingsDiv.setAttribute('role', 'group');
  servingsDiv.setAttribute('aria-labelledby', 'sfc-servings-label');

  var servingsLabel = document.createElement('span');
  servingsLabel.id = 'sfc-servings-label';
  servingsLabel.setAttribute('data-i18n', 'recipe_servings_label');
  servingsLabel.textContent = _t('recipe_servings_label', lang, 'Personen');
  servingsDiv.appendChild(servingsLabel);

  var decBtn = document.createElement('button');
  decBtn.type = 'button';
  decBtn.className = 'sfc-servings-dec';
  decBtn.setAttribute('aria-label', _t('recipe_servings_dec_aria', lang, 'Eine Person weniger'));
  decBtn.textContent = '\u2212';
  servingsDiv.appendChild(decBtn);

  var countOutput = document.createElement('output');
  countOutput.className = 'sfc-servings-count';
  countOutput.textContent = String(currentServings);
  servingsDiv.appendChild(countOutput);

  var incBtn = document.createElement('button');
  incBtn.type = 'button';
  incBtn.className = 'sfc-servings-inc';
  incBtn.setAttribute('aria-label', _t('recipe_servings_inc_aria', lang, 'Eine Person mehr'));
  incBtn.textContent = '+';
  servingsDiv.appendChild(incBtn);

  var quantitiesListId = 'sfc-quantities-list-' + (selectedRecipe.id || 'x');
  decBtn.setAttribute('aria-controls', quantitiesListId);
  incBtn.setAttribute('aria-controls', quantitiesListId);

  frag.appendChild(servingsDiv);

  // ===== QUANTITIES CONTAINER =====
  var quantitiesContainer = document.createElement('div');
  quantitiesContainer.className = 'sfc-quantities-container';
  quantitiesContainer.id = quantitiesListId;

  function renderQuantities(servings) {
    quantitiesContainer.textContent = '';
    var currentLang = typeof getLang === 'function' ? getLang() : 'de';

    if (selectedRecipe.quantities && typeof Quantities !== 'undefined') {
      // DEV ASSERT
      console.assert(
        Object.keys(selectedRecipe.quantities).every(function(k) { return selectedRecipe.ingredients.includes(k); }),
        'quantities key not in ingredients:', selectedRecipe.id
      );

      var ul = document.createElement('ul');
      ul.className = 'sfc-quantities-list';

      selectedRecipe.ingredients.forEach(function(ing) {
        var qty = selectedRecipe.quantities[ing];
        if (!qty) return;

        var scaled = Quantities.scale(qty, servings, servingsBase);
        var normalized = Quantities.normalize(scaled);
        var formatted = Quantities.format(normalized, currentLang);

        var li = document.createElement('li');
        var ingName = translateIngredient(ing, currentLang);
        ingName = ingName.charAt(0).toUpperCase() + ingName.slice(1);

        if (formatted.text) {
          li.textContent = formatted.text + ' ' + ingName;
        } else {
          li.textContent = ingName;
        }

        // Minimum quantity footnote for countable units scaled below 1
        if (['piece','head','clove','bunch'].indexOf(qty.unit) !== -1 && qty.amount !== null) {
          var rawScaled = qty.amount * servings / servingsBase;
          if (rawScaled < 1) {
            var footnote = document.createElement('small');
            footnote.className = 'sfc-quantities-note';
            footnote.textContent = ' (' + _t('recipe_min_quantity_note', currentLang, 'Mindestmenge') + ')';
            li.appendChild(footnote);
          }
        }

        ul.appendChild(li);
      });

      quantitiesContainer.appendChild(ul);

      var noteP = document.createElement('p');
      noteP.className = 'sfc-quantities-note';
      noteP.textContent = _t('recipe_steps_for_4_note', currentLang, 'Mengen in den Schritten sind f\u00fcr 4 Personen geschrieben');
      quantitiesContainer.appendChild(noteP);

    } else {
      // No quantities: show plain ingredient names + missing hint
      var pIng = document.createElement('p');
      var strongIng = document.createElement('strong');
      strongIng.textContent = (currentLang === 'en' ? 'Ingredients: ' : 'Zutaten: ');
      pIng.appendChild(strongIng);
      pIng.appendChild(document.createTextNode(
        selectedRecipe.ingredients.map(function(ing) { return translateIngredient(ing, currentLang); }).join(', ')
      ));
      quantitiesContainer.appendChild(pIng);

      var missingP = document.createElement('p');
      missingP.className = 'sfc-quantities-missing';
      missingP.textContent = _t('recipe_quantities_missing', currentLang, 'Mengenangaben fehlen');
      quantitiesContainer.appendChild(missingP);
    }
  }

  renderQuantities(currentServings);
  frag.appendChild(quantitiesContainer);

  // ===== STEPPER EVENT HANDLERS =====
  decBtn.addEventListener('click', function() {
    var n = parseInt(countOutput.textContent, 10) - 1;
    if (n < 1) n = 1;
    countOutput.textContent = String(n);
    if (typeof Quantities !== 'undefined') Quantities.setDefaultServings(n);
    renderQuantities(n);
  });

  incBtn.addEventListener('click', function() {
    var n = parseInt(countOutput.textContent, 10) + 1;
    if (n > 12) n = 12;
    countOutput.textContent = String(n);
    if (typeof Quantities !== 'undefined') Quantities.setDefaultServings(n);
    renderQuantities(n);
  });

  // Remove previous listeners before adding new ones (prevents stacking on repeated modal opens)
  if (window._sfcModalServingsHandler) {
    document.removeEventListener('sfc:servingsChanged', window._sfcModalServingsHandler);
  }
  if (window._sfcModalLangHandler) {
    window.removeEventListener('languageChanged', window._sfcModalLangHandler);
  }

  window._sfcModalServingsHandler = function(e) {
    var n = e.detail && e.detail.servings;
    if (n) {
      countOutput.textContent = String(n);
      renderQuantities(n);
    }
  };
  document.addEventListener('sfc:servingsChanged', window._sfcModalServingsHandler);

  window._sfcModalLangHandler = function() {
    // Reason: title, labels, steps and the impact panel depend on the language too,
    // not only the quantities. Render the recipe again, but keep the element the
    // modal was opened from and the focus on the language button.
    var trigger = window._modalTriggerElement;
    var active = document.activeElement;
    displayRecipeDetails(selectedRecipe);
    window._modalTriggerElement = trigger;
    if (active && active.focus) setTimeout(function() { active.focus(); }, 60);
  };
  window.addEventListener('languageChanged', window._sfcModalLangHandler);

  // ===== PREPARATION STEPS =====
  var pPrep = document.createElement('p');
  var strongPrep = document.createElement('strong');
  strongPrep.textContent = preparationLabel;
  pPrep.appendChild(strongPrep);
  frag.appendChild(pPrep);

  var ol = document.createElement('ol');
  steps.forEach(function(step) {
    var li = document.createElement('li');
    li.textContent = step;
    ol.appendChild(li);
  });
  frag.appendChild(ol);

  // Sustainability-Panel einfuegen (wenn Modul geladen)
  if (typeof SustainabilityUI !== 'undefined' && SustainabilityUI.createRecipeImpactPanel) {
    var sustPanel = SustainabilityUI.createRecipeImpactPanel(
      selectedRecipe.ingredients,
      selectedRecipe.id
    );
    frag.appendChild(sustPanel);
  }

  // Inject Recipe structured data for SEO
  if (typeof injectRecipeSchema === 'function') {
    injectRecipeSchema(selectedRecipe);
  }

  openRecipeModal(frag);
}

/**
 * Modal control - open
 */
function openRecipeModal(content) {
  // Store the trigger element for focus restoration
  window._modalTriggerElement = document.activeElement;

  const modalElement = document.getElementById('modal');
  const modalBody = document.getElementById('modal-content');

  if (modalBody) {
    modalBody.textContent = '';
    if (typeof content === 'string') {
      // Fallback: treat as plain text for safety
      modalBody.textContent = content;
    } else {
      modalBody.appendChild(content);
    }
  }

  if (modalElement) {
    modalElement.classList.remove('hidden');
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.setAttribute('aria-modal', 'true');
    document.body.classList.add('modal-open');

    // Set aria-labelledby to the first h3 inside modal content
    var modalTitle = modalBody ? modalBody.querySelector('h3') : null;
    if (modalTitle) {
      modalTitle.id = modalTitle.id || 'modal-title';
      modalElement.setAttribute('aria-labelledby', modalTitle.id);
    }

    // Focus the close button (or first focusable element)
    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      setTimeout(function() { closeBtn.focus(); }, 50);
    }

    // Set up focus trap
    _setupModalFocusTrap(modalElement);
  }
}

/**
 * Focus trap: Tab/Shift+Tab stays inside the modal.
 */
function _setupModalFocusTrap(modalElement) {
  // Remove previous handler if any
  if (window._modalFocusTrapHandler) {
    document.removeEventListener('keydown', window._modalFocusTrapHandler);
  }

  window._modalFocusTrapHandler = function(e) {
    if (e.key !== 'Tab') return;
    if (modalElement.classList.contains('hidden')) return;

    var focusable = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    var first = focusable[0];
    var last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', window._modalFocusTrapHandler);
}

/**
 * Modal control - close
 */
function closeRecipeModal() {
  const modalElement = document.getElementById('modal');

  if (modalElement) {
    modalElement.classList.add('hidden');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // Remove Recipe structured data
  if (typeof removeRecipeSchema === 'function') {
    removeRecipeSchema();
  }

  // Remove focus trap handler
  if (window._modalFocusTrapHandler) {
    document.removeEventListener('keydown', window._modalFocusTrapHandler);
    window._modalFocusTrapHandler = null;
  }

  // Remove servings + language listeners added during modal open
  if (window._sfcModalServingsHandler) {
    document.removeEventListener('sfc:servingsChanged', window._sfcModalServingsHandler);
    window._sfcModalServingsHandler = null;
  }
  if (window._sfcModalLangHandler) {
    window.removeEventListener('languageChanged', window._sfcModalLangHandler);
    window._sfcModalLangHandler = null;
  }

  // Return focus to the element that triggered the modal
  if (window._modalTriggerElement && window._modalTriggerElement.focus) {
    window._modalTriggerElement.focus();
    window._modalTriggerElement = null;
  }
}

// ==================== CATEGORY PAGE LOADER ====================
