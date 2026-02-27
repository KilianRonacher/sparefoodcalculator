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

Roadmap (aktuell umgesetzt):
- Such/Compose‑Grundgerüst: `pages/search.html` — Auswahl von Suchergebnissen, Komposition (merge ingredients, concat steps), lokale Speicherung und optionaler Server‑Import.
- (removed) Einzelrezept‑Formular page removed.

Wenn du möchtest, kann ich als nächstes:
- die Compose‑Logik verfeinern (Priorisierung, Mengen, Duplikat‑Normalisierung),
- eine Admin‑Übersicht-Seite bauen, die `sfc_recipes` anzeigt und bearbeitet, oder
- automatisierte Tests für `findMatchingRecipes` hinzufügen.

Sage mir, welchen Schritt ich als Nächstes erledigen soll.
