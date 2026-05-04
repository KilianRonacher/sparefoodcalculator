#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RECIPES_PATH = path.join(__dirname, '..', 'recipes.js');
const src = fs.readFileSync(RECIPES_PATH, 'utf8');

// Extract just the recipes array declaration
const startIdx = src.indexOf('const recipes = [');
if (startIdx === -1) { console.error('Cannot find recipes array'); process.exit(1); }

// Find matching bracket
let depth = 0; let endIdx = -1;
for (let i = src.indexOf('[', startIdx); i < src.length; i++) {
  if (src[i] === '[') depth++;
  if (src[i] === ']') { depth--; if (depth === 0) { endIdx = i + 1; break; } }
}

const arrCode = 'var recipes = ' + src.substring(src.indexOf('[', startIdx), endIdx) + ';';
const sandbox = {};
vm.createContext(sandbox);
try { vm.runInContext(arrCode, sandbox, { timeout: 15000 }); } catch(e) {
  // Might have functions not defined - that's ok if we got recipes
}
const recipes = sandbox.recipes;
if (!recipes || !Array.isArray(recipes)) { console.error('Failed to parse recipes'); process.exit(1); }
console.log('Loaded', recipes.length, 'recipes');

const DEFAULTS = {
  'rindfleisch':{amount:500,unit:'g'},'schweinefleisch':{amount:500,unit:'g'},'schweinefilet':{amount:500,unit:'g'},
  'schweineschnitzel':{amount:4,unit:'piece'},'schweinefaschiertes':{amount:500,unit:'g'},
  'hähnchen':{amount:500,unit:'g'},'hähnchenfilet':{amount:500,unit:'g'},'huhn':{amount:500,unit:'g'},
  'pute':{amount:500,unit:'g'},'truthahn':{amount:500,unit:'g'},
  'lamm':{amount:600,unit:'g'},'lammfleisch':{amount:600,unit:'g'},
  'fisch':{amount:400,unit:'g'},'fischfilet':{amount:400,unit:'g'},'lachs':{amount:400,unit:'g'},
  'lachsfilet':{amount:400,unit:'g'},'forelle':{amount:4,unit:'piece'},'thunfisch':{amount:400,unit:'g'},
  'garnelen':{amount:400,unit:'g'},'shrimps':{amount:400,unit:'g'},'muscheln':{amount:500,unit:'g'},
  'tintenfisch':{amount:400,unit:'g'},'kabeljau':{amount:400,unit:'g'},'wolfsbarsch':{amount:400,unit:'g'},
  'dorade':{amount:4,unit:'piece'},'sardinen':{amount:400,unit:'g'},
  'speck':{amount:100,unit:'g'},'schinken':{amount:150,unit:'g'},'wurst':{amount:200,unit:'g'},
  'hackfleisch':{amount:500,unit:'g'},'faschiertes':{amount:500,unit:'g'},'rindfaschiertes':{amount:500,unit:'g'},
  'wild':{amount:500,unit:'g'},'hirsch':{amount:500,unit:'g'},'ente':{amount:600,unit:'g'},
  'entenbrust':{amount:400,unit:'g'},'kaninchen':{amount:600,unit:'g'},
  'eier':{amount:4,unit:'piece'},'ei':{amount:4,unit:'piece'},
  'milch':{amount:250,unit:'ml'},'sahne':{amount:200,unit:'ml'},'schmand':{amount:200,unit:'g'},
  'sauerrahm':{amount:150,unit:'g'},'joghurt':{amount:200,unit:'g'},'butter':{amount:50,unit:'g'},
  'parmesan':{amount:60,unit:'g'},'Käse':{amount:100,unit:'g'},'käse':{amount:100,unit:'g'},
  'mozzarella':{amount:200,unit:'g'},'frischkäse':{amount:150,unit:'g'},'feta':{amount:150,unit:'g'},
  'ricotta':{amount:200,unit:'g'},'mascarpone':{amount:250,unit:'g'},'quark':{amount:250,unit:'g'},
  'creme fraiche':{amount:150,unit:'g'},'schlagobers':{amount:200,unit:'ml'},
  'reis':{amount:300,unit:'g'},'nudeln':{amount:400,unit:'g'},'pasta':{amount:400,unit:'g'},
  'spaghetti':{amount:400,unit:'g'},'penne':{amount:400,unit:'g'},'mehl':{amount:200,unit:'g'},
  'brot':{amount:200,unit:'g'},'toast':{amount:4,unit:'piece'},'tortilla':{amount:4,unit:'piece'},
  'paniermehl':{amount:150,unit:'g'},'couscous':{amount:250,unit:'g'},'bulgur':{amount:250,unit:'g'},
  'quinoa':{amount:250,unit:'g'},'haferflocken':{amount:200,unit:'g'},
  'blätterteig':{amount:275,unit:'g'},'pizzateig':{amount:500,unit:'g'},'teig':{amount:500,unit:'g'},
  'tomate':{amount:4,unit:'piece'},'tomaten':{amount:4,unit:'piece'},'dosentomaten':{amount:400,unit:'g'},
  'zwiebel':{amount:2,unit:'piece'},'zwiebeln':{amount:2,unit:'piece'},
  'knoblauch':{amount:3,unit:'clove'},'karotte':{amount:3,unit:'piece'},'karotten':{amount:3,unit:'piece'},
  'kartoffeln':{amount:500,unit:'g'},'kartoffel':{amount:500,unit:'g'},'süßkartoffel':{amount:400,unit:'g'},
  'paprika':{amount:2,unit:'piece'},'rote paprika':{amount:1,unit:'piece'},'gelbe paprika':{amount:1,unit:'piece'},
  'grüne paprika':{amount:1,unit:'piece'},'zucchini':{amount:2,unit:'piece'},'aubergine':{amount:1,unit:'piece'},
  'pilze':{amount:300,unit:'g'},'champignons':{amount:300,unit:'g'},'spinat':{amount:300,unit:'g'},
  'salat':{amount:1,unit:'head'},'brokkoli':{amount:300,unit:'g'},'blumenkohl':{amount:1,unit:'head'},
  'kohl':{amount:400,unit:'g'},'rotkohl':{amount:400,unit:'g'},'weißkohl':{amount:400,unit:'g'},
  'sauerkraut':{amount:400,unit:'g'},'lauch':{amount:2,unit:'piece'},'porree':{amount:2,unit:'piece'},
  'sellerie':{amount:200,unit:'g'},'fenchel':{amount:1,unit:'piece'},'spargel':{amount:500,unit:'g'},
  'erbsen':{amount:200,unit:'g'},'bohnen':{amount:250,unit:'g'},'linsen':{amount:250,unit:'g'},
  'kichererbsen':{amount:250,unit:'g'},'mais':{amount:200,unit:'g'},'kürbis':{amount:500,unit:'g'},
  'rote beete':{amount:400,unit:'g'},'gurke':{amount:1,unit:'piece'},'radieschen':{amount:1,unit:'bunch'},
  'frühlingszwiebel':{amount:4,unit:'piece'},'frühlingszwiebeln':{amount:4,unit:'piece'},
  'rucola':{amount:100,unit:'g'},'avocado':{amount:2,unit:'piece'},'oliven':{amount:100,unit:'g'},
  'kapern':{amount:2,unit:'tbsp'},'mangold':{amount:300,unit:'g'},'grünkohl':{amount:300,unit:'g'},
  'kohlrabi':{amount:2,unit:'piece'},'pastinake':{amount:3,unit:'piece'},
  'zitrone':{amount:1,unit:'piece'},'limette':{amount:2,unit:'piece'},'orange':{amount:2,unit:'piece'},
  'apfel':{amount:3,unit:'piece'},'äpfel':{amount:3,unit:'piece'},'birne':{amount:3,unit:'piece'},
  'banane':{amount:4,unit:'piece'},'beeren':{amount:250,unit:'g'},'erdbeeren':{amount:300,unit:'g'},
  'himbeeren':{amount:200,unit:'g'},'blaubeeren':{amount:200,unit:'g'},'mango':{amount:1,unit:'piece'},
  'kirschen':{amount:300,unit:'g'},'rosinen':{amount:80,unit:'g'},
  'fond':{amount:500,unit:'ml'},'brühe':{amount:500,unit:'ml'},'rinderbrühe':{amount:1,unit:'l'},
  'hühnerbrühe':{amount:500,unit:'ml'},'gemüsebrühe':{amount:500,unit:'ml'},
  'kokosmilch':{amount:400,unit:'ml'},'rotwein':{amount:200,unit:'ml'},'weißwein':{amount:200,unit:'ml'},
  'wein':{amount:200,unit:'ml'},'bier':{amount:330,unit:'ml'},'wasser':{amount:500,unit:'ml'},
  'sojasauce':{amount:3,unit:'tbsp'},'worcestersauce':{amount:1,unit:'tbsp'},
  'tomatenpüree':{amount:2,unit:'tbsp'},'tomatenmark':{amount:2,unit:'tbsp'},
  'senf':{amount:1,unit:'tbsp'},'essig':{amount:2,unit:'tbsp'},'balsamico':{amount:2,unit:'tbsp'},
  'zitronensaft':{amount:2,unit:'tbsp'},'limettensaft':{amount:2,unit:'tbsp'},
  'olivenöl':{amount:3,unit:'tbsp'},'öl':{amount:3,unit:'tbsp'},'sesamöl':{amount:1,unit:'tbsp'},
  'kokosöl':{amount:2,unit:'tbsp'},'butterschmalz':{amount:2,unit:'tbsp'},
  'salz':{amount:null,unit:'taste'},'pfeffer':{amount:null,unit:'taste'},
  'schwarzer pfeffer':{amount:null,unit:'taste'},'muskatnuss':{amount:1,unit:'pinch'},
  'muskat':{amount:1,unit:'pinch'},'zimt':{amount:1,unit:'tsp'},
  'paprikapulver':{amount:2,unit:'tbsp'},'chilipulver':{amount:1,unit:'tsp'},
  'chili':{amount:1,unit:'piece'},'chilischote':{amount:1,unit:'piece'},
  'cayennepfeffer':{amount:1,unit:'pinch'},'kurkuma':{amount:1,unit:'tsp'},
  'kreuzkümmel':{amount:1,unit:'tsp'},'kümmel':{amount:1,unit:'tsp'},
  'curry':{amount:2,unit:'tbsp'},'currypulver':{amount:2,unit:'tsp'},
  'garam masala':{amount:1,unit:'tsp'},'oregano':{amount:1,unit:'tsp'},
  'thymian':{amount:5,unit:'g'},'rosmarin':{amount:10,unit:'g'},'basilikum':{amount:10,unit:'g'},
  'petersilie':{amount:15,unit:'g'},'schnittlauch':{amount:10,unit:'g'},'dill':{amount:10,unit:'g'},
  'koriander':{amount:10,unit:'g'},'minze':{amount:10,unit:'g'},'salbei':{amount:5,unit:'g'},
  'lorbeerblatt':{amount:2,unit:'piece'},'lorbeer':{amount:2,unit:'piece'},
  'kräuter':{amount:15,unit:'g'},'gewürze':{amount:null,unit:'taste'},
  'ingwer':{amount:20,unit:'g'},'vanille':{amount:1,unit:'piece'},'vanillezucker':{amount:1,unit:'piece'},
  'majoran':{amount:1,unit:'tsp'},'estragon':{amount:5,unit:'g'},
  'zucker':{amount:100,unit:'g'},'honig':{amount:2,unit:'tbsp'},'ahornsirup':{amount:2,unit:'tbsp'},
  'backpulver':{amount:1,unit:'tsp'},'hefe':{amount:7,unit:'g'},
  'kakao':{amount:30,unit:'g'},'schokolade':{amount:200,unit:'g'},'puderzucker':{amount:50,unit:'g'},
  'stärke':{amount:2,unit:'tbsp'},'speisestärke':{amount:2,unit:'tbsp'},
  'mandeln':{amount:80,unit:'g'},'walnüsse':{amount:60,unit:'g'},'haselnüsse':{amount:60,unit:'g'},
  'cashews':{amount:60,unit:'g'},'erdnüsse':{amount:60,unit:'g'},'pinienkerne':{amount:30,unit:'g'},
  'sesam':{amount:2,unit:'tbsp'},'sonnenblumenkerne':{amount:30,unit:'g'},
  'kürbiskerne':{amount:30,unit:'g'},
  'fleur de sel':{amount:null,unit:'taste'},'tofu':{amount:400,unit:'g'},
  'pesto':{amount:3,unit:'tbsp'},'harissa':{amount:1,unit:'tbsp'},
  'currypaste':{amount:2,unit:'tbsp'},'fischsauce':{amount:2,unit:'tbsp'},
  'gelatine':{amount:4,unit:'piece'},'mascarpone':{amount:250,unit:'g'},
};

function getQuantity(ingredient) {
  if (DEFAULTS[ingredient]) return { ...DEFAULTS[ingredient] };
  const lower = ingredient.toLowerCase();
  if (DEFAULTS[lower]) return { ...DEFAULTS[lower] };
  for (const [key, val] of Object.entries(DEFAULTS)) {
    if (lower.includes(key) || key.includes(lower)) return { ...val };
  }
  return { amount: null, unit: 'taste' };
}

// Process file line by line
const lines = src.split('\n');
const newLines = [];
let modified = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/\{\s*id:(\d+)/);
  
  if (idMatch && line.includes('ingredients:') && !line.includes('quantities:')) {
    const id = parseInt(idMatch[1]);
    const recipe = recipes.find(r => r.id === id);
    
    if (recipe && recipe.ingredients && Array.isArray(recipe.ingredients)) {
      const qParts = [];
      for (const ing of recipe.ingredients) {
        const q = getQuantity(ing);
        const aStr = q.amount === null ? 'null' : q.amount;
        qParts.push("'" + ing + "':{amount:" + aStr + ",unit:'" + q.unit + "'}");
      }
      const qStr = "quantities:{" + qParts.join(',') + "}, ";
      
      // Insert after ingredients:[...], 
      const newLine = line.replace(
        /(ingredients:\[[^\]]*\]),\s*/,
        '$1, ' + qStr
      );
      
      if (newLine !== line) {
        newLines.push(newLine);
        modified++;
      } else {
        newLines.push(line);
        console.log('  WARN: could not insert quantities for id:', id);
      }
    } else {
      newLines.push(line);
    }
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync(RECIPES_PATH, newLines.join('\n'), 'utf8');
console.log('Modified ' + modified + ' recipes');

// Verify
const newSrc = fs.readFileSync(RECIPES_PATH, 'utf8');
const qCount = (newSrc.match(/quantities:/g) || []).length;
console.log('Total quantities: fields now:', qCount);
