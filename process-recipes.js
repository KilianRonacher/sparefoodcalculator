#!/usr/bin/env node
/**
 * RECIPE PROCESSING TOOL
 * =======================
 * Consolidated tool for all recipe data processing operations
 * 
 * Features:
 * - Merge recipe data from multiple sources
 * - Deduplicate recipes based on ingredients
 * - Merge recipe steps into main app.js
 * - Normalize ingredient names
 * 
 * Usage:
 *   node tools/process-recipes.js merge --source recipe_steps.js --target app.js
 *   node tools/process-recipes.js dedupe --file app.js
 *   node tools/process-recipes.js --help
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

// ==================== NORMALIZATION & MAPPING ====================

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const herbTokens = new Set([
  'kraeuter', 'krauter', 'kraeutermix', 'krautermix',
  'basilikum', 'dill', 'thymian', 'rosmarin', 'oregano',
  'petersilie', 'schnittlauch', 'salbei'
].map(normalize));

const stapleTokens = new Set([
  'salz', 'pfeffer', 'schwarzer pfeffer', 'weisser pfeffer', 'weißer pfeffer',
  'olivenol', 'olivenoel', 'oel', 'ol', 'wasser'
].map(normalize));

const nonVegTokens = new Set([
  'fleisch', 'rind', 'rindfleisch', 'schwein', 'schweinefleisch',
  'haehnchen', 'hähnchen', 'huhn', 'gefluegel', 'lamm', 'kalb',
  'wild', 'fisch', 'lachs', 'thunfisch', 'kabeljau', 'forelle',
  'speck', 'schinken', 'bacon', 'salami', 'wurst', 'chorizo'
].map(normalize));

function buildCanonicalLookup(aliases) {
  const lookup = {};
  Object.entries(aliases || {}).forEach(([canonical, variants]) => {
    (variants || []).forEach((v) => {
      lookup[normalize(v)] = canonical;
    });
  });
  return lookup;
}

function isVegetarianRecipe(recipe) {
  const ingredients = recipe && recipe.ingredients ? recipe.ingredients : [];
  return !ingredients.some((ing) => {
    const n = normalize(ing);
    for (const k of nonVegTokens) {
      if (n.includes(k)) return true;
    }
    return false;
  });
}

function isMeatFishCategory(recipe) {
  return ['rind', 'schwein', 'haendl', 'fisch'].includes(recipe.category);
}

function mapIngredient(ing, loose, canonicalLookup) {
  const n = normalize(ing);
  const canon = canonicalLookup[n] ? normalize(canonicalLookup[n]) : n;
  
  if (stapleTokens.has(n) || stapleTokens.has(canon)) return '';
  if (loose && herbTokens.has(n)) return 'kraeuter';
  
  return canon;
}

function buildRecipeKey(recipe, canonicalLookup = {}) {
  const isVeg = isVegetarianRecipe(recipe);
  const loose = isVeg && !isMeatFishCategory(recipe);
  
  const ingredients = (recipe.ingredients || [])
    .map((ing) => mapIngredient(ing, loose, canonicalLookup))
    .filter(Boolean)
    .sort();
  
  if (!loose) {
    return `strict|${ingredients.join('|')}`;
  }
  
  const main = recipe.ingredients && recipe.ingredients.length 
    ? mapIngredient(recipe.ingredients[0], true, canonicalLookup) 
    : '';
  
  return `loose|${main}|${ingredients.join('|')}`;
}

// ==================== DEDUPLICATION ====================

function deduplicateRecipes(filePath) {
  console.log(`\n📖 Reading file: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find recipes array
  const marker = 'const recipes = [';
  const start = content.indexOf(marker);
  if (start === -1) {
    console.error('❌ recipes array not found');
    process.exit(1);
  }
  
  const arrayStart = content.indexOf('[', start);
  let depth = 0;
  let arrayEnd = -1;
  
  for (let i = arrayStart; i < content.length; i++) {
    const ch = content[i];
    if (ch === '[') depth++;
    if (ch === ']') depth--;
    if (depth === 0) {
      arrayEnd = i;
      break;
    }
  }
  
  if (arrayEnd === -1) {
    console.error('❌ recipes array end not found');
    process.exit(1);
  }
  
  const before = content.slice(0, arrayStart);
  const after = content.slice(arrayEnd + 1);
  const arrayText = content.slice(arrayStart, arrayEnd + 1);
  
  console.log('✅ Parsing recipes...');
  const recipes = vm.runInNewContext(arrayText);
  console.log(`✅ Found ${recipes.length} recipes`);
  
  // Extract ingredient aliases if present
  const aliasMarker = 'const ingredientAliases = {';
  const aliasStart = content.indexOf(aliasMarker);
  let ingredientAliases = {};
  
  if (aliasStart !== -1) {
    const braceStart = content.indexOf('{', aliasStart);
    let braceDepth = 0;
    let braceEnd = -1;
    
    for (let i = braceStart; i < content.length; i++) {
      const ch = content[i];
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
      if (braceDepth === 0) {
        braceEnd = i;
        break;
      }
    }
    
    if (braceEnd !== -1) {
      const aliasText = content.slice(braceStart, braceEnd + 1);
      ingredientAliases = vm.runInNewContext(`(${aliasText})`);
      console.log(`✅ Found ingredient aliases`);
    }
  }
  
  const canonicalLookup = buildCanonicalLookup(ingredientAliases);
  
  console.log('🔄 Deduplicating...\n');
  
  const kept = [];
  const keyToIndex = new Map();
  const removed = [];
  
  for (const recipe of recipes) {
    const key = buildRecipeKey(recipe, canonicalLookup);
    
    if (!keyToIndex.has(key)) {
      keyToIndex.set(key, kept.length);
      kept.push(recipe);
      continue;
    }
    
    const idx = keyToIndex.get(key);
    const existing = kept[idx];
    const currentLen = (recipe.ingredients || []).length;
    const existingLen = (existing.ingredients || []).length;
    
    // Keep the one with fewer ingredients (more specific)
    if (currentLen < existingLen) {
      removed.push(existing);
      kept[idx] = recipe;
    } else {
      removed.push(recipe);
    }
  }
  
  console.log(`✅ Deduplication complete!`);
  console.log(`   Original: ${recipes.length} recipes`);
  console.log(`   Kept: ${kept.length} recipes`);
  console.log(`   Removed: ${removed.length} duplicates\n`);
  
  if (removed.length > 0 && removed.length <= 20) {
    console.log('Removed recipes:');
    removed.forEach(r => console.log(`  - ${r.title} (ID: ${r.id})`));
    console.log('');
  } else if (removed.length > 20) {
    console.log('Sample of removed recipes:');
    removed.slice(0, 10).forEach(r => console.log(`  - ${r.title} (ID: ${r.id})`));
    console.log(`  ... and ${removed.length - 10} more\n`);
  }
  
  // Rebuild array
  const jsString = (value) => {
    return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  };
  
  const lines = kept.map((r) => {
    const ingredients = (r.ingredients || []).map(jsString).join(',');
    const steps = (r.steps || []).map(jsString).join(',');
    
    let line = `  { id:${r.id}, title:${jsString(r.title)}, category:${jsString(r.category)}, difficulty:${jsString(r.difficulty)}, ingredients:[${ingredients}], steps:[${steps}]`;
    
    // Add bilingual fields if present
    if (r.title_en) line += `, title_en:${jsString(r.title_en)}`;
    if (r.steps_en) {
      const stepsEn = r.steps_en.map(jsString).join(',');
      line += `, steps_en:[${stepsEn}]`;
    }
    if (r.ingredients_en) {
      const ingredientsEn = r.ingredients_en.map(jsString).join(',');
      line += `, ingredients_en:[${ingredientsEn}]`;
    }
    
    line += ' }';
    return line;
  });
  
  const newArrayText = `[\n${lines.join(',\n')}\n]`;
  const newContent = before + newArrayText + after;
  
  // Backup original
  const backupPath = filePath + '.backup';
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log(`💾 Backed up original to: ${backupPath}`);
  
  // Write deduplicated version
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`💾 Saved deduplicated file: ${filePath}\n`);
}

// ==================== MERGING ====================

function mergeRecipeSteps(sourceFile, targetFile) {
  console.log(`\n📖 Reading source: ${sourceFile}`);
  console.log(`📖 Reading target: ${targetFile}`);
  
  // Read target content
  let targetContent = fs.readFileSync(targetFile, 'utf-8');
  
  // Read and prepare source
  const stepsContent = fs.readFileSync(sourceFile, 'utf-8');
  
  // Create temporary exportable version
  const tempFile = 'temp_export_steps.js';
  const exportableSteps = stepsContent.replace(
    /^const recipeSteps = /m,
    'module.exports = '
  );
  fs.writeFileSync(tempFile, exportableSteps);
  
  // Import recipe steps
  const recipeSteps = require(path.resolve(tempFile));
  console.log(`✅ Loaded ${Object.keys(recipeSteps).length} recipes from source`);
  
  console.log('🔄 Merging recipe steps...\n');
  
  let replacementCount = 0;
  let skipCount = 0;
  
  for (const [recipeId, steps] of Object.entries(recipeSteps)) {
    const stepsJson = JSON.stringify(steps);
    
    // Find recipe with this ID and empty steps
    const pattern = new RegExp(
      `(\\{\\s*id:${recipeId},[^}]*?steps:)\\[\\](?=\\s*[},])`,
      's'
    );
    
    if (pattern.test(targetContent)) {
      targetContent = targetContent.replace(pattern, `$1${stepsJson}`);
      replacementCount++;
      
      if (replacementCount % 30 === 0) {
        console.log(`  Merged ${replacementCount} recipes...`);
      }
    } else {
      skipCount++;
    }
  }
  
  console.log(`\n✅ Merge complete!`);
  console.log(`   Successfully merged: ${replacementCount}`);
  console.log(`   Skipped (already filled): ${skipCount}`);
  
  // Backup original
  const backupPath = targetFile + '.backup';
  fs.writeFileSync(backupPath, fs.readFileSync(targetFile, 'utf-8'), 'utf-8');
  console.log(`\n💾 Backed up original to: ${backupPath}`);
  
  // Write merged content
  fs.writeFileSync(targetFile, targetContent, 'utf-8');
  console.log(`💾 Updated: ${targetFile}`);
  
  // Cleanup
  fs.unlinkSync(tempFile);
  
  // Verify
  const finalContent = fs.readFileSync(targetFile, 'utf-8');
  const emptyCount = (finalContent.match(/steps:\[\]/g) || []).length;
  console.log(`\n✅ Verification: ${emptyCount} recipes still have empty steps`);
  
  if (emptyCount === 0) {
    console.log(`🎉 SUCCESS! All recipes now have cooking instructions!\n`);
  }
}

// ==================== CLI ====================

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         RECIPE PROCESSING TOOL                             ║
║         Merge, Dedupe & Normalize Recipes                  ║
╚════════════════════════════════════════════════════════════╝

Commands:
  dedupe    Remove duplicate recipes based on ingredients
  merge     Merge recipe steps from one file to another

Usage:
  node tools/process-recipes.js dedupe --file <path>
  node tools/process-recipes.js merge --source <source> --target <target>
  node tools/process-recipes.js --help

Examples:
  node tools/process-recipes.js dedupe --file app.js
  node tools/process-recipes.js merge --source recipe_steps.js --target app.js
    `);
    process.exit(0);
  }
  
  const command = args[0];
  
  if (command === 'dedupe') {
    const fileIndex = args.indexOf('--file');
    if (fileIndex === -1 || !args[fileIndex + 1]) {
      console.error('❌ Missing --file argument');
      process.exit(1);
    }
    
    const filePath = args[fileIndex + 1];
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    
    deduplicateRecipes(filePath);
    
  } else if (command === 'merge') {
    const sourceIndex = args.indexOf('--source');
    const targetIndex = args.indexOf('--target');
    
    if (sourceIndex === -1 || !args[sourceIndex + 1]) {
      console.error('❌ Missing --source argument');
      process.exit(1);
    }
    
    if (targetIndex === -1 || !args[targetIndex + 1]) {
      console.error('❌ Missing --target argument');
      process.exit(1);
    }
    
    const sourceFile = args[sourceIndex + 1];
    const targetFile = args[targetIndex + 1];
    
    if (!fs.existsSync(sourceFile)) {
      console.error(`❌ Source file not found: ${sourceFile}`);
      process.exit(1);
    }
    
    if (!fs.existsSync(targetFile)) {
      console.error(`❌ Target file not found: ${targetFile}`);
      process.exit(1);
    }
    
    mergeRecipeSteps(sourceFile, targetFile);
    
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.error('Use --help for usage information');
    process.exit(1);
  }
}

module.exports = {
  deduplicateRecipes,
  mergeRecipeSteps,
  buildRecipeKey,
  normalize
};
