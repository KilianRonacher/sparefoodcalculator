# Projekt-Struktur (Konsolidiert) 

**Stand:** 25. Februar 2026  
**Projekt:** SpareFoodCalculator - Maturaprüfung

---

## ✅ Vor der Konsolidierung

### Vorher: 24 JavaScript-Dateien

#### Tools (13 Dateien):
- ❌ translate_recipes.js
- ❌ translate_all_recipes.py
- ❌ generate_translations.js
- ❌ fix_recipes.py
- ❌ merge_recipes.js
- ❌ merge_translations.js
- ❌ check_syntax.js
- ❌ tools/dedupe_recipes.js
- ❌ tools/check_html.js
- ❌ tools/check_theme_lang.js
- ❌ tools/collect_console.js
- ❌ tools/generate_theme_lang_report.js

#### Rezept-Dateien (11 Dateien):
- ❌ recipe_steps_complete.js
- ❌ recipe-translations-en.js
- ❌ recipes_all_translated.js
- ❌ recipes_bilingual_complete.js
- ❌ recipes_complete_bilingual.js
- ❌ recipes_translated.js
- ❌ recipes-Translation.js
- ❌ ALL_434_RECIPES_BILINGUAL.js
- ❌ ALL_RECIPES_TRANSLATED.js
- ❌ app_recipes_complete_english.js
- ❌ app_translated_complete.js

---

## 🎯 Nach der Konsolidierung

### Nachher: 8 JavaScript-Dateien

#### Hauptanwendung (1 Datei):
- ✅ **app.js** - Hauptanwendung mit allen 319 Rezepten

#### Daten & Bibliotheken (2 Dateien):
- ✅ **i18n.js** - UI-Übersetzungen (Deutsch/Englisch)
- ✅ **ingredients.js** - Zutaten-Datenbank nach Kategorien

#### Tools (3 Dateien):
- ✅ **tools/translate.js** - Übersetzungs-Tool
- ✅ **tools/process-recipes.js** - Verarbeitungs-Tool
- ✅ **tools/validate.js** - Validierungs-Tool

#### Server-Backend (2 Dateien):
- ✅ **server/index.js** - Express-Server
- ✅ **server/db.js** - SQLite-Datenbank

---

## 📊 Statistik

**Reduzierung:** 24 → 8 Dateien (**67% weniger** 🎉)

- **13 Tool-Dateien** → **3 Tools**
- **11 Rezept-Dateien** → **1 Datei** (app.js)

---

## 📁 Aktuelle Struktur

```
spare-food-calculator/
├── app.js                      ← 319 Rezepte + Anwendungslogik
├── i18n.js                     ← UI-Übersetzungen DE/EN
├── ingredients.js              ← Zutaten-Datenbank
├── styles.css
├── package.json
├── README.md
│
├── tools/
│   ├── translate.js            ← Übersetzungen DE→EN
│   ├── process-recipes.js      ← Merge & Dedupe
│   ├── validate.js             ← Syntax, HTML, Testing
│   └── README.md               ← Tool-Dokumentation
│
├── server/
│   ├── index.js                ← Express-Server
│   ├── db.js                   ← SQLite-DB
│   ├── package.json
│   ├── index.html              ← Server-Startseite
│   └── data/
│       └── recipes.json        ← 90 Rezepte für DB-Seeding
│
├── pages/
│   ├── search.html
│   ├── salat.html
│   ├── suppen.html
│   ├── vorspeisen.html
│   ├── rind.html
│   ├── schwein.html
│   ├── haendl.html
│   ├── fisch.html
│   ├── dessert.html
│   ├── kuchen.html
│   ├── contact.html
│   └── impressum.html
│
├── images/
└── reports/
    └── validation_report_*.txt
```

---

## 🎓 Für die Matura

Diese Struktur zeigt:
- ✅ **Klarheit** - Jede Datei hat einen eindeutigen Zweck
- ✅ **Wartbarkeit** - Kein Raten mehr, welche Datei die aktuelle ist
- ✅ **Organisation** - Tools in tools/, Server in server/
- ✅ **Best Practice** - DRY (Don't Repeat Yourself)

---

## 🔧 Verwendung

### Hauptanwendung starten:
```bash
# In Browser öffnen
start index.html
```

### Tools verwenden:
```bash
# Rezepte übersetzen
node tools/translate.js --file app.js

# Duplikate entfernen
node tools/process-recipes.js dedupe --file app.js

# Alles validieren
node tools/validate.js all --report
```

### Server starten:
```bash
cd server
npm install
npm start
# Server läuft auf http://localhost:3000
```

---

## 💾 Backup-Info

Falls du die alten Dateien brauchst, findest du sie in Git History oder:
- Backup-Dateien mit `.backup` Endung wurden automatisch erstellt
- Git commit vor der Konsolidierung: siehe `git log`

---

## 📝 Wichtige Hinweise

### app.js enthält:
- ✅ 319 Rezepte (vollständig)
- ✅ Alle Rezept-Kategorien (salat, suppen, rind, schwein, haendl, fisch, dessert, kuchen)
- ✅ Such- und Filter-Logik
- ✅ Dark-Mode & Language-Toggle
- ✅ Fuzzy-Matching für Zutaten
- ✅ Modal-System für Rezept-Details

### i18n.js enthält:
- ✅ Deutsche UI-Texte
- ✅ Englische UI-Texte
- ⚠️ NICHT die Rezept-Übersetzungen (die sind in app.js)

### ingredients.js enthält:
- ✅ Kategorisierte Zutaten-Liste
- ✅ Verwendung für Autocomplete & Vorschläge
- ✅ Keine Rezepte (nur Zutaten-Datenbank)

---

## ⚠️ Was NICHT gelöscht wurde

Diese Dateien sind wichtig und wurden BEHALTEN:
- **app.js** - DIE zentrale Datei
- **i18n.js** - UI-Übersetzungen
- **ingredients.js** - Zutaten-Datenbank
- **server/** - Backend-Code
- **pages/** - HTML-Seiten
- **styles.css** - Styling

---

Erstellt: 25. Februar 2026  
Autor: Kilian Ronacher  
Projekt: SpareFoodCalculator (Maturaprüfung)
