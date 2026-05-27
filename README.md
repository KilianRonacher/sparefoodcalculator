# SpareFoodCalculator

Eine kleine Web-App gegen Lebensmittelverschwendung. Man tippt ein, was im Kühlschrank übrig ist, und bekommt passende Rezeptvorschläge zurück.

Veröffentlicht als Progressive Web App auf GitHub Pages: https://kilianronacher.github.io/sparefoodcalculator/

## Was die App kann

- Suche über 406 Rezepte mit Fuzzy-Matching (Damerau-Levenshtein-Distanz)
- Toleriert Tippfehler: „Tmoate" findet Tomatenrezepte trotzdem
- Zwei Sprachen: Deutsch und Englisch, umschaltbar per Klick
- Dark Mode
- Offline-fähig nach erstem Aufruf (Service Worker cacht alles lokal)
- CO₂-Bilanz pro Rezept mit kumuliertem Einsparungszähler
- Portionsrechner skaliert Mengen für 1 bis 12 Personen
- Funktioniert auf Smartphone, Tablet und Desktop

## Architektur

Reines Frontend. Kein Server, keine Datenbank, keine externen API-Aufrufe.

- HTML5, CSS3, Vanilla JavaScript (ES6)
- Rezepte liegen als JavaScript-Konstante in `recipes.js` direkt im Browser
- Suche läuft komplett clientseitig
- Nutzereinstellungen (Sprache, Dark Mode, Portionsgröße) im `localStorage`
- Service Worker (`sw.js`) cacht alle Dateien für Offline-Betrieb

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite mit Suchmaske |
| `styles.css` | Layout, Farben, Glassmorphismus, Dark Mode |
| `app.js` | Rezept-Matcher, Modal-Logik, Eingabeverarbeitung |
| `search.js` | Damerau-Levenshtein-Implementation, Suchpipeline |
| `i18n.js` | Übersetzungen Deutsch/Englisch |
| `recipes.js` | 406 Rezepte als JS-Konstante |
| `ingredients.js` | 609 Zutatenbezeichnungen in 15 Kategorien |
| `sw.js` | Service Worker (Cache-First) |
| `manifest.json` | PWA-Manifest |
| `data/sustainability.js` | CO₂-Faktoren pro Zutat |
| `js/quantities.js` | Portionsrechner |
| `js/sustainability.js` | CO₂-Berechnung pro Rezept |
| `js/sustainability-ui.js` | Anzeige der Nachhaltigkeitswerte |
| `pages/` | Kategorie-Seiten und Zutaten-Generator |
| `images/` | Hintergrundbilder und Icons |

## Lokal ausprobieren

Einfach `index.html` im Browser öffnen. Es braucht keinen Webserver.

Optional für saubere Pfade ein lokaler Dev-Server:
```
npx http-server .
```
Öffnet die App unter `http://localhost:8080`.

## Tools

Im Ordner `tools/` liegen einmal verwendete Hilfsskripte zur Datenpflege:
- `translate.js` — Rezepte ins Englische übersetzen
- `process-recipes.js` — Rezepte aus Roh-Daten in das Schema bringen
- `add-quantities.js`, `extract-quantities.js` — Mengenangaben verwalten

Diese Tools sind nicht Teil der Web-App, sondern für die Erstpflege der Rezeptdaten gedacht.

## Lizenz

Privates Schulprojekt im Rahmen der Berufsreifeprüfung am BFI Salzburg, 2026.
