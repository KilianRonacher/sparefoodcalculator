/**
 * INGREDIENTS DATABASE
 * ====================
 * Zentrale Datenbank aller verfügbaren Zutaten nach Kategorien
 * Wird vom Generator verwendet, um intelligente Vorschläge zu machen
 */

const ingredientsDatabase = {
  
  // ==================== GEMÜSE ====================
  gemüse: [
    'tomate', 'tomaten', 'gurke', 'salat', 'kopfsalat', 'eisbergsalat',
    'karotte', 'karotten', 'möhre', 'möhren', 'zwiebel', 'zwiebeln',
    'knoblauch', 'paprika', 'rote paprika', 'gelbe paprika', 'grüne paprika',
    'zucchini', 'aubergine', 'brokkoli', 'blumenkohl', 'spinat',
    'mangold', 'porree', 'lauch', 'sellerie', 'staudensellerie',
    'fenchel', 'spargel', 'grüner spargel', 'weißer spargel',
    'champignons', 'pilze', 'steinpilze', 'pfifferlinge', 'shiitake',
    'mais', 'erbsen', 'bohnen', 'grüne bohnen', 'kidneybohnen',
    'kichererbsen', 'linsen', 'rote linsen', 'grüne linsen',
    'kürbis', 'hokkaido', 'butternut', 'radieschen', 'rettich',
    'rote beete', 'rüben', 'kohlrabi', 'rosenkohl', 'rotkohl',
    'weißkohl', 'wirsing', 'chinakohl', 'pak choi', 'rucola',
    'feldsalat', 'endivien', 'radicchio', 'chicorée'
  ],

  // ==================== FLEISCH & FISCH ====================
  fleisch: [
    'rindfleisch', 'rind', 'rinderhüfte', 'rinderfilet', 'rindersteak',
    'hackfleisch', 'rinderhack', 'schweinefleisch', 'schwein', 
    'schweineschnitzel', 'schweinefilet', 'schweinehack', 'schweinebraten',
    'speck', 'bacon', 'schinken', 'kochschinken', 'parmaschinken',
    'hähnchen', 'hähnchenbrust', 'hähnchenkeule', 'hähnchenflügel',
    'huhn', 'hühnerbrust', 'pute', 'putenbrust', 'putenschnitzel',
    'ente', 'entenbrust', 'gans', 'lamm', 'lammkeule', 'lammfilet',
    'wild', 'reh', 'hirsch', 'wildschwein'
  ],

  fisch: [
    'lachs', 'lachsfilet', 'forelle', 'dorade', 'wolfsbarsch',
    'kabeljau', 'seelachs', 'scholle', 'thunfisch', 'makrele',
    'hering', 'sardine', 'sardellen', 'anchovis', 'zander',
    'barsch', 'heilbutt', 'seezunge', 'rotbarsch', 'pangasius',
    'garnelen', 'shrimps', 'prawns', 'scampi', 'langusten',
    'hummer', 'krabben', 'muscheln', 'miesmuscheln', 'austern',
    'jakobsmuscheln', 'tintenfisch', 'calamari', 'oktopus'
  ],

  // ==================== MILCHPRODUKTE ====================
  milchprodukte: [
    'milch', 'vollmilch', 'sahne', 'schlagsahne', 'saure sahne',
    'schmand', 'crème fraîche', 'butter', 'margarine', 'butterschmalz',
    'jogurt', 'joghurt', 'griechischer joghurt', 'naturjoghurt',
    'quark', 'topfen', 'magerquark', 'speisequark', 'frischkäse', 'mascarpone',
    'ricotta', 'hüttenkäse', 'cottage cheese', 'mozzarella',
    'parmesan', 'parmigiano', 'gouda', 'edamer', 'emmentaler',
    'cheddar', 'gruyère', 'bergkäse', 'feta', 'schafskäse',
    'ziegenkäse', 'camembert', 'brie', 'roquefort', 'gorgonzola',
    'blauschimmelkäse', 'raclette', 'provolone', 'burrata'
  ],

  // ==================== GETREIDE & KOHLENHYDRATE ====================
  getreide: [
    'mehl', 'weizenmehl', 'dinkelmehl', 'roggenmehl', 'vollkornmehl',
    'maisstärke', 'speisestärke', 'kartoffelstärke', 'backpulver',
    'hefe', 'trockenhefe', 'frischhefe', 'natron', 'brot', 'brötchen',
    'baguette', 'ciabatta', 'toast', 'vollkornbrot', 'schwarzbrot',
    'paniermehl', 'semmelbrösel', 'haferflocken', 'cornflakes',
    'müsli', 'reis', 'basmati', 'jasminreis', 'risottoreis', 'arborio',
    'wildreis', 'vollkornreis', 'couscous', 'bulgur', 'quinoa',
    'polenta', 'grieß', 'hartweizengrieß', 'pasta', 'nudeln',
    'spaghetti', 'penne', 'fusilli', 'tagliatelle', 'lasagneplatten',
    'kartoffeln', 'kartoffel', 'süßkartoffeln', 'batate'
  ],

  // ==================== ÖLE & FETTE ====================
  öle: [
    'olivenöl', 'natives olivenöl', 'olivenöl extra vergine',
    'sonnenblumenöl', 'rapsöl', 'kokosöl', 'sesamöl', 'erdnussöl',
    'walnussöl', 'kürbiskernöl', 'leinöl', 'traubenkernöl',
    'avocadoöl', 'mandelöl', 'palmöl', 'pflanzenfett', 'butterschmalz',
    'ghee', 'schmalz', 'gänseschmalz', 'schweineschmalz'
  ],

  // ==================== GEWÜRZE & KRÄUTER ====================
  gewürze: [
    'salz', 'meersalz', 'grobes salz', 'fleur de sel', 'pfeffer',
    'schwarzer pfeffer', 'weißer pfeffer', 'rosa pfeffer', 'cayennepfeffer',
    'paprikapulver', 'edelsüßes paprikapulver', 'rosenpaprika',
    'chili', 'chiliflocken', 'chilipulver', 'currypulver', 'curry',
    'kurkuma', 'gelbwurz', 'kreuzkümmel', 'cumin', 'koriander',
    'koriandersamen', 'zimtstange', 'zimt', 'gemahlen', 'nelken',
    'muskatnuss', 'muskat', 'kardamom', 'sternanis', 'anis',
    'fenchelsamen', 'kümmel', 'senfkörner', 'senf', 'dijon senf',
    'ingwer', 'ingwerwurzel', 'knoblauchpulver', 'zwiebelpulver',
    'lorbeer', 'lorbeerblätter', 'wacholderbeeren', 'piment',
    'safran', 'sumach', 'za\'atar', 'ras el hanout', 'garam masala',
    'five spice', 'fünf gewürze', 'vanille', 'vanilleschote',
    'vanilleextrakt', 'vanillezucker', 'tonkabohne'
  ],

  kräuter: [
    'petersilie', 'glatte petersilie', 'krause petersilie', 'schnittlauch',
    'basilikum', 'thymian', 'rosmarin', 'oregano', 'majoran',
    'salbei', 'minze', 'pfefferminze', 'dill', 'kerbel', 'estragon',
    'bohnenkraut', 'liebstöckel', 'borretsch', 'kresse', 'brunnenkresse',
    'koriander frisch', 'koriandergrün', 'zitronenmelisse', 'zitronengras',
    'curryblätter', 'kaffirblätter', 'limettenblätter', 'bärlauch'
  ],

  // ==================== SAUCEN & WÜRZMITTEL ====================
  saucen: [
    'tomatenmark', 'tomatensoße', 'passierte tomaten', 'tomatensaft',
    'brühe', 'gemüsebrühe', 'hühnerbrühe', 'rinderbrühe', 'fischfond',
    'sojasauce', 'sojasoße', 'tamari', 'teriyaki', 'worcestersauce',
    'tabasco', 'sriracha', 'sambal oelek', 'harissa', 'ajvar',
    'pesto', 'basilikumpesto', 'pesto rosso', 'tapenade',
    'mayonnaise', 'mayo', 'ketchup', 'bbq sauce', 'barbecue sauce',
    'senf', 'dijon senf', 'süßer senf', 'meerrettich', 'wasabi',
    'essig', 'weißweinessig', 'rotweinessig', 'balsamico', 'aceto balsamico',
    'apfelessig', 'reisessig', 'sherryessig', 'zitronensaft', 'limettensaft'
  ],

  // ==================== OBST ====================
  obst: [
    'apfel', 'äpfel', 'birne', 'birnen', 'banane', 'bananen',
    'orange', 'orangen', 'zitrone', 'zitronen', 'limette', 'limetten',
    'grapefruit', 'mandarine', 'clementine', 'kiwi', 'ananas',
    'mango', 'papaya', 'maracuja', 'passionsfrucht', 'avocado',
    'erdbeeren', 'himbeeren', 'brombeeren', 'heidelbeeren', 'blaubeeren',
    'johannisbeeren', 'stachelbeeren', 'kirschen', 'süßkirschen',
    'sauerkirschen', 'pflaumen', 'zwetschgen', 'aprikosen', 'marillen',
    'pfirsiche', 'nektarinen', 'melone', 'wassermelone', 'honigmelone',
    'weintrauben', 'trauben', 'feigen', 'datteln', 'rosinen',
    'cranberries', 'granatapfel', 'kokosnuss', 'litschi', 'kumquat'
  ],

  // ==================== NÜSSE & SAMEN ====================
  nüsse: [
    'mandeln', 'mandelblättchen', 'mandelstife', 'walnüsse', 'haselnüsse',
    'erdnüsse', 'pistazien', 'cashewnüsse', 'cashews', 'paranüsse',
    'macadamia', 'pekannüsse', 'maronen', 'esskastanien', 'kokosflocken',
    'kokosraspeln', 'sonnenblumenkerne', 'kürbiskerne', 'pinienkerne',
    'sesam', 'sesamkörner', 'schwarzer sesam', 'chiasamen', 'leinsamen',
    'mohn', 'mohnsamen', 'hanfsamen', 'flohsamen'
  ],

  // ==================== SÜSSES & BACKZUTATEN ====================
  süßes: [
    'zucker', 'weißer zucker', 'brauner zucker', 'rohrzucker',
    'puderzucker', 'staubzucker', 'gelierzucker', 'hagelzucker',
    'honig', 'ahornsirup', 'agavendicksaft', 'reissirup', 'melasse',
    'schokolade', 'zartbitterschokolade', 'dunkle schokolade',
    'vollmilchschokolade', 'weiße schokolade', 'schokodrops', 'kakao',
    'kakaopulver', 'backkakao', 'nougatcreme', 'nutella', 'marmelade',
    'konfitüre', 'gelee', 'apfelmus', 'pflaumenmus', 'powidl',
    'löffelbiskuits'
  ],

  // ==================== EIER ====================
  eier: [
    'eier', 'ei', 'hühnerei', 'eigelb', 'eiweiß', 'eierschale',
    'wachteleier'
  ],

  // ==================== GETRÄNKE ====================
  getränke: [
    'wasser', 'mineralwasser', 'sprudelwasser', 'wein', 'weißwein',
    'rotwein', 'sekt', 'champagner', 'prosecco', 'bier', 'helles',
    'dunkles bier', 'rum', 'cognac', 'brandy', 'whisky', 'vodka',
    'gin', 'likör', 'orangenlikör', 'grand marnier', 'amaretto', 'kirschwasser',
    'kaffee', 'espresso', 'tee', 'schwarzer tee', 'grüner tee',
    'kräutertee', 'kamillentee', 'pfefferminztee'
  ],

  // ==================== FERTIGPRODUKTE ====================
  fertigprodukte: [
    'kokosmilch', 'kondensmilch', 'dosenmais', 'dosentomaten',
    'thunfisch aus der dose', 'sardinen', 'oliven', 'schwarze oliven',
    'grüne oliven', 'kapern', 'cornichons', 'gewürzgurken',
    'sauerkraut', 'rotkohl eingelegt', 'eingelegte rote beete'
  ]
};

/**
 * Alle Zutaten als flache Liste
 */
const allIngredients = Object.values(ingredientsDatabase).flat();

/**
 * Gibt alle Zutaten einer Kategorie zurück
 */
function getIngredientsByCategory(category) {
  return ingredientsDatabase[category] || [];
}

/**
 * Findet die Kategorie einer Zutat
 */
function findCategoryForIngredient(ingredient) {
  const normalized = ingredient.toLowerCase().trim();
  
  for (const [category, items] of Object.entries(ingredientsDatabase)) {
    if (items.some(item => item.toLowerCase() === normalized)) {
      return category;
    }
  }
  
  return 'sonstiges';
}

/**
 * Gibt Kompatibilitäts-Scores zwischen Zutaten zurück
 * Basierend auf Kategorien
 */
function getIngredientCompatibility(ingredient1, ingredient2) {
  const cat1 = findCategoryForIngredient(ingredient1);
  const cat2 = findCategoryForIngredient(ingredient2);
  
  // Kompatibilitäts-Matrix
  const compatibilityMap = {
    'gemüse+fleisch': 0.9,
    'gemüse+fisch': 0.9,
    'gemüse+getreide': 0.85,
    'gemüse+öle': 0.95,
    'gemüse+gewürze': 0.95,
    'gemüse+kräuter': 0.95,
    'gemüse+saucen': 0.9,
    'fleisch+gewürze': 0.95,
    'fleisch+kräuter': 0.95,
    'fleisch+öle': 0.9,
    'fleisch+saucen': 0.9,
    'fleisch+getreide': 0.8,
    'fisch+gewürze': 0.95,
    'fisch+kräuter': 0.95,
    'fisch+öle': 0.9,
    'fisch+zitrone': 0.98,
    'getreide+milchprodukte': 0.85,
    'getreide+eier': 0.9,
    'süßes+milchprodukte': 0.9,
    'süßes+eier': 0.9,
    'süßes+obst': 0.85,
    'obst+nüsse': 0.8,
    'gemüse+milchprodukte': 0.7
  };
  
  const key1 = `${cat1}+${cat2}`;
  const key2 = `${cat2}+${cat1}`;
  
  return compatibilityMap[key1] || compatibilityMap[key2] || 0.5;
}

/**
 * Gibt intelligente Vorschläge basierend auf eingegebenen Zutaten
 */
function getSuggestedIngredients(userIngredients, maxSuggestions = 12) {
  if (!userIngredients || userIngredients.length === 0) {
    return [];
  }
  
  const suggestions = new Map();
  
  // Für jede User-Zutat, finde kompatible Zutaten
  userIngredients.forEach(userIng => {
    const category = findCategoryForIngredient(userIng);
    
    // Schlage Zutaten aus kompatiblen Kategorien vor
    const compatibleCategories = {
      'gemüse': ['gewürze', 'kräuter', 'öle', 'saucen'],
      'fleisch': ['gewürze', 'kräuter', 'gemüse', 'öle'],
      'fisch': ['gewürze', 'kräuter', 'gemüse', 'öle', 'obst'],
      'getreide': ['milchprodukte', 'eier', 'gemüse'],
      'obst': ['süßes', 'nüsse', 'milchprodukte']
    };
    
    const targetCategories = compatibleCategories[category] || ['gewürze', 'kräuter'];
    
    targetCategories.forEach(targetCat => {
      const items = getIngredientsByCategory(targetCat);
      items.forEach(item => {
        if (!userIngredients.includes(item)) {
          const score = getIngredientCompatibility(userIng, item);
          if (!suggestions.has(item) || suggestions.get(item) < score) {
            suggestions.set(item, score);
          }
        }
      });
    });
  });
  
  // Sortiere nach Score und gib Top N zurück
  return Array.from(suggestions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxSuggestions)
    .map(([ingredient, score]) => ingredient);
}

/**
 * Österreichisch ↔ Deutsch Synonym-Mapping
 * Bidirektional: Eingabe "Erdäpfel" findet Kartoffel-Rezepte und umgekehrt.
 */
const ingredientSynonyms = {
  'erdäpfel': 'kartoffeln',
  'paradeiser': 'tomaten',
  'topfen': 'quark',
  'karfiol': 'blumenkohl',
  'fisolen': 'grüne bohnen',
  'marillen': 'aprikosen',
  'ribisel': 'johannisbeeren',
  'obers': 'sahne',
  'faschiertes': 'hackfleisch',
  'kren': 'meerrettich',
  'germ': 'hefe',
  'kukuruz': 'mais',
  'palatschinken': 'pfannkuchen',
  'powidl': 'pflaumenmus',
  'schwammerl': 'pilze',
  'melanzani': 'aubergine',
  'vogerlsalat': 'feldsalat',
  'eierschwammerl': 'pfifferlinge',
  'hendl': 'hähnchen',
  'beiried': 'roastbeef',
  'schlagobers': 'schlagsahne',
  'staubzucker': 'puderzucker'
};

/**
 * Reverse-Lookup erstellen: deutsch → österreichisch
 */
const ingredientSynonymsReverse = {};
for (const [austrian, german] of Object.entries(ingredientSynonyms)) {
  ingredientSynonymsReverse[german] = austrian;
}

/**
 * Löst ein Wort bidirektional auf:
 * Gibt ein Array aller Synonyme zurück (inkl. Originalwort).
 */
function resolveSynonyms(word) {
  const lower = word.toLowerCase().trim();
  const result = [lower];

  if (ingredientSynonyms[lower]) {
    result.push(ingredientSynonyms[lower]);
  }
  if (ingredientSynonymsReverse[lower]) {
    result.push(ingredientSynonymsReverse[lower]);
  }
  return result;
}

// Exportiere für Verwendung in anderen Scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ingredientsDatabase,
    allIngredients,
    getIngredientsByCategory,
    findCategoryForIngredient,
    getIngredientCompatibility,
    getSuggestedIngredients,
    ingredientSynonyms,
    ingredientSynonymsReverse,
    resolveSynonyms
  };
}
