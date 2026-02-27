# Tools Verzeichnis

Konsolidierte Toolsammlung für das SpareFoodCalculator Projekt.

## 🎯 Übersicht

Alle Tools wurden von **13+ einzelnen Scripts** in **3 zentrale Tools** konsolidiert:

### 1. **translate.js** - Übersetzungs-Tool
Übersetzt Rezepte von Deutsch nach Englisch.

**Funktionen:**
- Rezepttitel übersetzen (Deutsch → Englisch)
- Kochanweisungen übersetzen (Deutsch → Englisch)
- Zutaten übersetzen (Deutsch → Englisch)
- Bilinguale Struktur generieren (title/title_en, steps/steps_en)

**Verwendung:**
```bash
# Komplette Datei übersetzen
node tools/translate.js --file app.js

# Hilfe anzeigen
node tools/translate.js --help
```

**Konsolidiert:**
- ✗ translate_recipes.js
- ✗ translate_all_recipes.py
- ✗ generate_translations.js
- ✗ fix_recipes.py

---

### 2. **process-recipes.js** - Rezept-Verarbeitungs-Tool
Merged und dedupliziert Rezeptdaten.

**Funktionen:**
- Recipe Steps von einer Datei in eine andere mergen
- Doppelte Rezepte entfernen (basierend auf Zutaten)
- Zutatennamen normalisieren
- Vegetarische Rezepte identifizieren

**Verwendung:**
```bash
# Rezepte deduplizieren
node tools/process-recipes.js dedupe --file app.js

# Recipe Steps mergen
node tools/process-recipes.js merge --source recipe_steps.js --target app.js

# Hilfe anzeigen
node tools/process-recipes.js --help
```

**Konsolidiert:**
- ✗ merge_recipes.js
- ✗ merge_translations.js
- ✗ tools/dedupe_recipes.js

---

### 3. **validate.js** - Validierungs-Tool
Prüft Code-Qualität und Funktionalität.

**Funktionen:**
- JavaScript Syntax-Fehler prüfen
- HTML-Struktur validieren (doppelte IDs, fehlende Elemente)
- Theme Toggle testen (Dark/Light Mode)
- Language Toggle testen (DE/EN Umschaltung)
- Console-Fehler sammeln
- Umfassende Reports generieren

**Verwendung:**
```bash
# Syntax einer Datei prüfen
node tools/validate.js syntax --file app.js

# HTML validieren
node tools/validate.js html

# Theme & Language Toggles testen
node tools/validate.js theme-lang

# Alles prüfen + Report erstellen
node tools/validate.js all --report

# Hilfe anzeigen
node tools/validate.js --help
```

**Konsolidiert:**
- ✗ check_syntax.js
- ✗ tools/check_html.js
- ✗ tools/check_theme_lang.js
- ✗ tools/collect_console.js
- ✗ tools/generate_theme_lang_report.js

---

## ⚠️ Wichtige Hinweise

### Dependencies

Einige Tools benötigen zusätzliche Packages:

**validate.js** (für Theme/Lang Testing):
```bash
npm install jsdom
```

Falls nicht installiert, werden diese Features übersprungen.

### Backups

Alle Tools, die Dateien modifizieren, erstellen automatisch Backups:
- `app.js.backup`
- `recipes.json.backup`

Falls etwas schiefgeht, kannst du die Backup-Datei wiederherstellen.

---

## 📊 Vorher/Nachher

### Vorher (13+ Tools):
```
Root-Verzeichnis:
├── translate_recipes.js
├── translate_all_recipes.py
├── generate_translations.js
├── fix_recipes.py
├── merge_recipes.js
├── merge_translations.js
└── check_syntax.js

tools/ Verzeichnis:
├── dedupe_recipes.js
├── check_html.js
├── check_theme_lang.js
├── collect_console.js
└── generate_theme_lang_report.js
```

### Nachher (3 Tools):
```
tools/
├── translate.js          (→ 4 alte Tools)
├── process-recipes.js    (→ 3 alte Tools)
└── validate.js           (→ 5 alte Tools)
```

**Reduzierung:** 13 → 3 Tools (**77% weniger** 🎉)

---

## 🔧 Beibehaltene Dateien

Diese Dateien sind **keine Tools**, sondern **Daten/Bibliotheken** und wurden beibehalten:

- **i18n.js** - UI-Übersetzungen (Deutsch/Englisch) für die Website
- **ingredients.js** - Zentrale Zutaten-Datenbank nach Kategorien
- **app.js** - Hauptanwendung mit 319 Rezepten
- **recipes-Translation.js** - Konsolidierte bilinguale Rezepte

---

## 📝 Beispiel-Workflow

### Typischer Entwicklungs-Workflow:

```bash
# 1. Rezepte übersetzen
node tools/translate.js --file recipes-Translation.js

# 2. Duplikate entfernen
node tools/process-recipes.js dedupe --file app.js

# 3. Alles validieren
node tools/validate.js all --report

# 4. Report im reports/ Ordner prüfen
```

### Für deine Matura:

```bash
# Vor der Präsentation: Vollständige Validierung
node tools/validate.js all --report

# Schneller Syntax-Check während der Entwicklung
node tools/validate.js syntax --file app.js
```

---

## 🎓 Für die Maturaprüfung

Diese Tools zeigen:
- ✅ **Code-Organisation** - Von 13 unorganisierten Tools zu 3 strukturierten Modulen
- ✅ **DRY-Prinzip** - Don't Repeat Yourself (keine doppelten Funktionen mehr)
- ✅ **Wartbarkeit** - Ein zentraler Ort für jede Funktionalität
- ✅ **Dokumentation** - Klare CLI-Interfaces mit --help
- ✅ **Best Practices** - Automatische Backups, Error Handling, Reports

---

## 💡 Tipps

1. **Immer mit --help starten** um alle Optionen zu sehen
2. **Backups prüfen** bevor du modifizierte Dateien überschreibst
3. **Reports nutzen** für Dokumentation und Fehlersuche
4. **Tests laufen lassen** vor jeder größeren Änderung

---

## 🐛 Probleme?

Falls ein Tool nicht funktioniert:

1. Prüfe ob alle Dependencies installiert sind
2. Stelle sicher, dass du im richtigen Verzeichnis bist
3. Nutze `--help` um die korrekte Syntax zu sehen
4. Prüfe die Backup-Dateien falls etwas schiefging

---

Erstellt: Februar 2026  
Projekt: SpareFoodCalculator (Maturaprüfung)  
Autor: Kilian Ronacher
