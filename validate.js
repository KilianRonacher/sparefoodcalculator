#!/usr/bin/env node
/**
 * VALIDATION TOOL
 * ================
 * Consolidated validation tool for checking code quality and functionality
 * 
 * Features:
 * - Check JavaScript syntax errors
 * - Validate HTML structure (duplicate IDs, missing elements)
 * - Test theme toggle functionality across all pages
 * - Test language toggle functionality across all pages
 * - Collect and report console errors
 * - Generate comprehensive validation reports
 * 
 * Usage:
 *   node tools/validate.js syntax --file app.js
 *   node tools/validate.js html
 *   node tools/validate.js theme-lang
 *   node tools/validate.js all --report
 *   node tools/validate.js --help
 */

const fs = require('fs');
const path = require('path');

// ==================== SYNTAX CHECKING ====================

function checkSyntax(filePath) {
  console.log(`\n📖 Checking syntax: ${filePath}`);
  
  try {
    require(path.resolve(filePath));
    console.log('✅ No syntax errors found\n');
    return { success: true, errors: [] };
  } catch (error) {
    console.log('❌ Syntax error found:');
    console.log(error.message);
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Extract line number from error message
    const match = error.message.match(/:(\d+):/);
    if (match) {
      const lineNum = parseInt(match[1]);
      
      console.log(`\n📍 Error near line ${lineNum}:`);
      console.log('');
      
      // Show context
      const startLine = Math.max(0, lineNum - 5);
      const endLine = Math.min(lines.length, lineNum + 5);
      
      for (let i = startLine; i < endLine; i++) {
        const prefix = (i + 1) === lineNum ? '>>> ' : '    ';
        console.log(`${prefix}${i + 1}: ${lines[i]}`);
      }
      console.log('');
    }
    
    return { success: false, errors: [error.message] };
  }
}

// ==================== HTML VALIDATION ====================

function walkDirectory(dir, fileExtension = '.html') {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        // Skip node_modules, .git, etc.
        if (!file.startsWith('.') && file !== 'node_modules') {
          results = results.concat(walkDirectory(filePath, fileExtension));
        }
      } else if (filePath.endsWith(fileExtension)) {
        results.push(filePath);
      }
    });
  } catch (err) {
    // Ignore permission errors
  }
  return results;
}

function extractIdsFromHtml(content) {
  const ids = [];
  const idRegex = /id\s*=\s*["']([^"']+)["']/g;
  let match;
  
  while ((match = idRegex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  
  return ids;
}

function extractGetElementIds(jsContent) {
  const ids = new Set();
  const regex = /getElementById\(\s*["']([^"']+)["']\s*\)/g;
  let match;
  
  while ((match = regex.exec(jsContent)) !== null) {
    ids.add(match[1]);
  }
  
  return Array.from(ids);
}

function validateHtml(rootDir = '.') {
  console.log('\n🔍 Scanning HTML files...');
  
  const htmlFiles = walkDirectory(rootDir, '.html');
  const jsFiles = walkDirectory(rootDir, '.js');
  
  console.log(`✅ Found ${htmlFiles.length} HTML files`);
  console.log(`✅ Found ${jsFiles.length} JS files\n`);
  
  const results = {
    duplicateIds: [],
    missingIds: [],
    totalHtmlFiles: htmlFiles.length
  };
  
  // Check for duplicate IDs in HTML files
  console.log('📋 Checking for duplicate IDs in HTML files...');
  let anyDuplicate = false;
  
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const ids = extractIdsFromHtml(content);
    
    const counts = ids.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    
    const dups = Object.entries(counts).filter(([k, v]) => v > 1);
    
    if (dups.length > 0) {
      anyDuplicate = true;
      const relPath = path.relative(rootDir, file);
      console.log(`\n⚠️  File: ${relPath}`);
      dups.forEach(([id, count]) => {
        console.log(`   Duplicate id="${id}" (${count} times)`);
        results.duplicateIds.push({ file: relPath, id, count });
      });
    }
  });
  
  if (!anyDuplicate) {
    console.log('✅ No duplicate IDs found in HTML files');
  }
  
  // Check for missing IDs referenced in JavaScript
  console.log('\n📋 Extracting getElementById calls from JS files...');
  const allJsContent = jsFiles
    .map(p => {
      try {
        return fs.readFileSync(p, 'utf8');
      } catch (err) {
        return '';
      }
    })
    .join('\n');
  
  const expectedIds = extractGetElementIds(allJsContent);
  console.log(`✅ Found ${expectedIds.length} unique getElementById usages`);
  
  // Check which HTML files contain each expected ID
  console.log('\n📋 Checking for missing IDs...');
  const missingMap = {};
  expectedIds.forEach(id => {
    missingMap[id] = [];
  });
  
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    expectedIds.forEach(id => {
      if (!content.includes(`id="${id}"`) && !content.includes(`id='${id}'`)) {
        missingMap[id].push(path.relative(rootDir, file));
      }
    });
  });
  
  let anyMissing = false;
  Object.entries(missingMap).forEach(([id, filesMissing]) => {
    if (filesMissing.length === htmlFiles.length) {
      // ID not present in any HTML file
      anyMissing = true;
      console.log(`\n⚠️  ID "${id}" is not present in any HTML file`);
      results.missingIds.push({ id, severity: 'critical' });
    } else if (filesMissing.length > 0) {
      const pct = Math.round((filesMissing.length / htmlFiles.length) * 100);
      if (pct > 50) {
        anyMissing = true;
        console.log(`\n⚠️  ID "${id}" missing in ${filesMissing.length}/${htmlFiles.length} files (~${pct}%)`);
        console.log(`   Sample files: ${filesMissing.slice(0, 3).join(', ')}`);
        results.missingIds.push({ id, filesCount: filesMissing.length, severity: 'warning' });
      }
    }
  });
  
  if (!anyMissing) {
    console.log('✅ No widespread missing IDs detected');
  }
  
  console.log('\n✅ HTML validation complete!\n');
  return results;
}

// ==================== THEME & LANGUAGE TOGGLE TESTING ====================

async function testThemeAndLanguageToggles(rootDir = '.') {
  console.log('\n🧪 Testing theme and language toggles...');
  console.log('⚠️  Note: This requires jsdom package installed\n');
  
  try {
    const { JSDOM, VirtualConsole } = require('jsdom');
    
    const htmlFiles = walkDirectory(rootDir, '.html');
    const results = [];
    
    console.log(`Testing ${htmlFiles.length} pages...\n`);
    
    for (const file of htmlFiles) {
      const relPath = path.relative(rootDir, file);
      process.stdout.write(`  Testing ${relPath}... `);
      
      try {
        const vConsole = new VirtualConsole();
        vConsole.on('error', () => {});
        
        const dom = await JSDOM.fromFile(file, {
          runScripts: 'dangerously',
          resources: 'usable',
          virtualConsole: vConsole,
          url: 'file://' + file.replace(/\\/g, '/'),
          beforeParse(window) {
            const store = {};
            const shim = {
              getItem(key) {
                return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
              },
              setItem(key, value) {
                store[key] = String(value);
              },
              removeItem(key) {
                delete store[key];
              },
              clear() {
                Object.keys(store).forEach(k => delete store[k]);
              }
            };
            
            try {
              Object.defineProperty(window, 'localStorage', {
                value: shim,
                configurable: true
              });
            } catch (e) {
              window.localStorage = shim;
            }
            
            try {
              window.eval('var localStorage = window.localStorage');
            } catch (e) {}
          }
        });
        
        await new Promise(r => setTimeout(r, 300));
        
        const document = dom.window.document;
        const result = {
          page: relPath,
          theme: { found: false, toggles: false, initialDark: false },
          lang: { found: false, toggles: false, beforeText: null, afterText: null }
        };
        
        // Test theme toggle
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
          result.theme.found = true;
          result.theme.initialDark = document.body.classList.contains('dark-mode');
          
          try {
            themeBtn.click();
            await new Promise(r => setTimeout(r, 100));
          } catch (e) {}
          
          const after1 = document.body.classList.contains('dark-mode');
          
          try {
            themeBtn.click();
            await new Promise(r => setTimeout(r, 100));
          } catch (e) {}
          
          const after2 = document.body.classList.contains('dark-mode');
          result.theme.toggles = (after1 !== result.theme.initialDark) && (after2 === result.theme.initialDark);
        }
        
        // Test language toggle
        const langBtn = document.getElementById('lang-toggle-btn');
        if (langBtn) {
          result.lang.found = true;
          result.lang.beforeText = String(langBtn.textContent || '');
          
          try {
            langBtn.click();
            await new Promise(r => setTimeout(r, 150));
          } catch (e) {}
          
          result.lang.afterText = String(langBtn.textContent || '');
          result.lang.toggles = result.lang.beforeText !== result.lang.afterText;
        }
        
        results.push(result);
        process.stdout.write('done\n');
        
      } catch (e) {
        results.push({ page: relPath, error: String(e) });
        process.stdout.write('error\n');
      }
    }
    
    console.log('\n📊 Summary:\n');
    results.forEach(r => {
      if (r.error) {
        console.log(`❌ ${r.page}: ERROR - ${r.error}`);
        return;
      }
      
      const themeStatus = r.theme.found ? (r.theme.toggles ? '✅' : '❌') : '⚠️ ';
      const langStatus = r.lang.found ? (r.lang.toggles ? '✅' : '❌') : '⚠️ ';
      
      console.log(`${r.page}:`);
      console.log(`  Theme: ${themeStatus} ${r.theme.found ? (r.theme.toggles ? 'OK' : 'FAIL') : 'MISSING'}`);
      console.log(`  Lang:  ${langStatus} ${r.lang.found ? (r.lang.toggles ? 'OK' : 'FAIL') : 'MISSING'}`);
    });
    
    console.log('');
    return results;
    
  } catch (err) {
    console.log('⚠️  jsdom not installed. Run: npm install jsdom');
    console.log('   Theme/Language toggle testing skipped\n');
    return null;
  }
}

// ==================== REPORT GENERATION ====================

function generateReport(results, outputPath) {
  const lines = [];
  const timestamp = new Date().toISOString();
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('              VALIDATION REPORT');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push(`Generated: ${timestamp}`);
  lines.push('');
  
  if (results.syntax) {
    lines.push('─────────────────────────────────────────────────────');
    lines.push('SYNTAX VALIDATION');
    lines.push('─────────────────────────────────────────────────────');
    results.syntax.forEach(r => {
      lines.push(`File: ${r.file}`);
      lines.push(`Status: ${r.success ? '✅ PASS' : '❌ FAIL'}`);
      if (r.errors.length > 0) {
        r.errors.forEach(err => lines.push(`  Error: ${err}`));
      }
      lines.push('');
    });
  }
  
  if (results.html) {
    lines.push('─────────────────────────────────────────────────────');
    lines.push('HTML VALIDATION');
    lines.push('─────────────────────────────────────────────────────');
    lines.push(`Total HTML files scanned: ${results.html.totalHtmlFiles}`);
    lines.push(`Duplicate IDs found: ${results.html.duplicateIds.length}`);
    lines.push(`Missing IDs (critical): ${results.html.missingIds.filter(m => m.severity === 'critical').length}`);
    lines.push('');
    
    if (results.html.duplicateIds.length > 0) {
      lines.push('Duplicate IDs:');
      results.html.duplicateIds.forEach(d => {
        lines.push(`  - ${d.file}: id="${d.id}" (${d.count} times)`);
      });
      lines.push('');
    }
    
    if (results.html.missingIds.length > 0) {
      lines.push('Missing IDs:');
      results.html.missingIds.forEach(m => {
        lines.push(`  - ${m.id} (${m.severity})`);
      });
      lines.push('');
    }
  }
  
  if (results.themeLang) {
    lines.push('─────────────────────────────────────────────────────');
    lines.push('THEME & LANGUAGE TOGGLE TESTING');
    lines.push('─────────────────────────────────────────────────────');
    
    results.themeLang.forEach(r => {
      if (r.error) {
        lines.push(`${r.page}: ERROR - ${r.error}`);
      } else {
        const themeStatus = r.theme.found ? (r.theme.toggles ? 'OK' : 'FAIL') : 'MISSING';
        const langStatus = r.lang.found ? (r.lang.toggles ? 'OK' : 'FAIL') : 'MISSING';
        
        lines.push(`${r.page}:`);
        lines.push(`  Theme: ${themeStatus}`);
        lines.push(`  Language: ${langStatus}`);
        if (r.lang.found) {
          lines.push(`    Before: "${r.lang.beforeText}" → After: "${r.lang.afterText}"`);
        }
      }
      lines.push('');
    });
  }
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('                  END OF REPORT');
  lines.push('═══════════════════════════════════════════════════════');
  
  const reportContent = lines.join('\n');
  
  if (outputPath) {
    const reportDir = path.dirname(outputPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, reportContent, 'utf8');
    console.log(`\n💾 Report saved to: ${outputPath}\n`);
  }
  
  return reportContent;
}

// ==================== CLI ====================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║              VALIDATION TOOL                               ║
║         Syntax, HTML & Functionality Testing               ║
╚════════════════════════════════════════════════════════════╝

Commands:
  syntax       Check JavaScript syntax errors
  html         Validate HTML structure
  theme-lang   Test theme and language toggles
  all          Run all validations

Options:
  --file <path>     Specify file for syntax checking
  --report          Generate report file (in reports/ folder)
  --help            Show this help

Examples:
  node tools/validate.js syntax --file app.js
  node tools/validate.js html
  node tools/validate.js theme-lang
  node tools/validate.js all --report
    `);
    process.exit(0);
  }
  
  const command = args[0];
  const shouldReport = args.includes('--report');
  const results = {};
  
  if (command === 'syntax') {
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
    
    const result = checkSyntax(filePath);
    results.syntax = [{ file: filePath, ...result }];
    
  } else if (command === 'html') {
    results.html = validateHtml();
    
  } else if (command === 'theme-lang') {
    results.themeLang = await testThemeAndLanguageToggles();
    
  } else if (command === 'all') {
    console.log('\n🔍 Running all validations...\n');
    
    // Syntax check on main files
    const mainFiles = ['app.js', 'i18n.js', 'ingredients.js'];
    results.syntax = [];
    
    mainFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const result = checkSyntax(file);
        results.syntax.push({ file, ...result });
      }
    });
    
    // HTML validation
    results.html = validateHtml();
    
    // Theme/Lang testing
    results.themeLang = await testThemeAndLanguageToggles();
    
    console.log('✅ All validations complete!\n');
    
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.error('Use --help for usage information');
    process.exit(1);
  }
  
  // Generate report if requested
  if (shouldReport) {
    const reportPath = path.join('reports', `validation_report_${Date.now()}.txt`);
    generateReport(results, reportPath);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = {
  checkSyntax,
  validateHtml,
  testThemeAndLanguageToggles,
  generateReport
};
