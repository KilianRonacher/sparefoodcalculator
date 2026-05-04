# SpareFoodCalculator — Static Prototype (updated)

![Bunte Teller mit Zutaten](hero-image.png)

Kompaktes statisches Frontend mit einem kleinen Express‑Backend (optional).

Wichtige Änderungen:
- Die alte `calculator.html` Seite wurde entfernt und durch eine neue `pages/search.html` ersetzt (Search & Compose).
- (removed) Admin pages have been removed from this project.
- Die zentrale Matching‑Logik bleibt in `app.js` — `findMatchingRecipes`, `processIngredientToken`, `displayRecipeDetails` werden weiterhin verwendet.

Dateien (kurz):
- `index.html` — Startseite
- `styles.css` — Design / Farben / Layout
- `app.js` — Rezept‑Matcher, Modal‑Logik, und client‑helpers (bleibt aktiv)
- `pages/search.html` — Neue Such‑/Compose‑Seite (erzeugt Kompositionen aus gefundenen Rezepten)
- (removed) `pages/recipes-admin.html` — page removed.
- `pages/` — Kategorie‑Seiten (`salat.html`, `suppen.html`, …)
- `images/` — SVG‑Platzhalterbilder

Admin / Import (aktuell):
- (removed) Admin pages are no longer part of the project.

Lokales Testen:
- Öffne `index.html` in einem Browser oder starte das Server‑Backend (wenn du Uploads/DB brauchst).

Server & API (optional):
- `server/index.js` — Express‑App mit Endpunkten:
	- `GET /api/recipes` — liefert Rezepte
	- `POST /api/recipes/import` — importiert/merged Rezept‑Arrays
	- `POST /api/recipes/:id` — partielles Update
	- `PUT /api/recipes/:id` — replace/upsert
	- `POST /api/upload` — Bildupload (multer), Dateien landen in `server/uploads`

So startest du das Backend (Node.js erforderlich):

```powershell
cd c:/Users/Kilian/.vscode/spare-food-calculator/server
npm install
npm start
```

Server default: `http://localhost:3000`. Setze `ADMIN_USER` / `ADMIN_PASS` als Umgebungsvariablen, um Basic‑Auth für Admin‑Routen zu aktivieren.

Konventionen & Hinweise:
- Rezepte werden client‑seitig unter `localStorage` Key `sfc_recipes` gespeichert und beim Laden mit eingebauten Rezepten zusammengeführt.
- DB‑Seeding: `server/db.js` lädt `server/data/recipes.json` in die SQLite DB, wenn die Tabelle leer ist.
- Wenn du das Rezept‑Shape änderst, aktualisiere `app.js` (Import/Export) und `server/db.js` (Serialisierung von `ingredients`/`steps`).

## Development

### Tests

```powershell
node tests/sustainability.test.js
# or via npm:
npm test
```

### i18n Key Validation

Run before opening any PR that adds or renames translation keys in `i18n.js`:

```powershell
npm run validate:i18n
```

The script (`tools/validate-i18n.js`) scans all HTML files under the repo root and `pages/` for `data-i18n="…"` attributes and verifies every key exists in **both** `i18n['de']` and `i18n['en']`.

- Exit 0 — all keys present.  
- Exit 1 — one or more keys missing; the missing keys and their source files are printed.

### Namespace conventions

All identifiers exported by `ingredients.js` live under the global `Ingredients` namespace (e.g. `Ingredients.allIngredients`, `Ingredients.resolveSynonyms`). Do not access them as bare globals — the IIFE wrapper removes them from `window`.

Roadmap (aktuell umgesetzt):
- Such/Compose‑Grundgerüst: `pages/search.html` — Auswahl von Suchergebnissen, Komposition (merge ingredients, concat steps), lokale Speicherung und optionaler Server‑Import.
- (removed) Einzelrezept‑Formular page removed.

Wenn du möchtest, kann ich als nächstes:
- die Compose‑Logik verfeinern (Priorisierung, Mengen, Duplikat‑Normalisierung),
- eine Admin‑Übersicht-Seite bauen, die `sfc_recipes` anzeigt und bearbeitet, oder
- automatisierte Tests für `findMatchingRecipes` hinzufügen.

Sage mir, welchen Schritt ich als Nächstes erledigen soll.

## Development

### Tests ausführen

```bash
npm test
```

Führt i18n-Validierung + Quantities-API-Tests aus (beide müssen Exit 0 liefern).

### i18n-Validierung

Prüft, ob alle `data-i18n`-Keys in den HTML-Dateien auch in `i18n.js` für beide Sprachen (`de` + `en`) vorhanden sind.

```bash
npm run validate:i18n
```

Exit 0 — alle Keys vorhanden. Exit 1 — fehlende Keys werden aufgelistet.

### Quantities-Tests

```bash
npm run test:quantities
```

19 Node-Assert-Tests für `js/quantities.js` (scale, normalize, format, getDefaultServings, setDefaultServings).

## Mengenangaben & Personen-Skalierung

Die Rezept-Detailansicht (Modal) enthält einen Stepper zum Anpassen der Personenzahl (1–12):

- **Stepper**: `-` / `[Zahl]` / `+` Buttons, min 44 × 44 px (WCAG Touch-Target)
- **Skalierung**: Alle Zutatenmengen werden proportional zur gewählten Personenzahl skaliert (`js/quantities.js`)
- **Persistenz**: Gewählte Personenzahl wird in `localStorage` unter Key `sfc_default_servings` gespeichert und beim nächsten Öffnen wiederhergestellt
- **i18n**: Stepper-Labels und Mengeneinheiten wechseln mit der Sprache (DE/EN)
- **Relevante i18n-Keys**: `recipe_servings_label`, `recipe_servings_dec_aria`, `recipe_servings_inc_aria`, `recipe_steps_for_4_note`, `recipe_min_quantity_note`, `recipe_quantities_missing`

### Service Worker

Cache-Version `sfc-v4`. Alle statischen Assets (inkl. `js/quantities.js`, `category-template.js`) werden beim Install gecacht. Offline-Fallback auf `index.html` für Navigation-Requests.
