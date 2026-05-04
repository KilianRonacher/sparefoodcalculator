# Quantities Migration

## Status
- Pass 1 (automatische Extraktion): `node tools/extract-quantities.js` erzeugt `tools/quantities-draft.json`.
- 10 Probe-Rezepte (ids 1, 5, 11, 18, 26, 50, 100, 200, 302, 405) haben manuell gepruefte quantities-Felder.
- Restliche ~396 Rezepte: schrittweise in Sessions migrieren.

## Vorgehen pro Session

1. recipes.js oeffnen, beim letzten migrierten Rezept weitermachen.
2. Pro Rezept: `ingredients`-Array lesen, Keys exakt kopieren (lowercase, Umlaute beibehalten).
3. Realistische Mengen fuer 4 Portionen schaetzen anhand der Zubereitungsschritte.
4. `quantities`-Objekt inline einfuegen (nach `ingredients`, vor `steps`).
5. Pro Session ~100-150 Rezepte.
6. Commit mit Hinweis auf letzte migrierte id.

## LLM-Prompt-Template (fuer Claude/GPT)

```
Lies das folgende Rezept-Objekt aus recipes.js.
Erstelle ein quantities-Objekt fuer 4 Portionen.
Keys muessen exakt den Eintraegen im ingredients-Array entsprechen (lowercase, Umlaute beibehalten).
Verwende die kanonischen Units: g, kg, ml, l, tbsp, tsp, piece, head, clove, bunch, pinch, taste.
Fuer Gewuerze die "nach Geschmack" verwendet werden: { amount: null, unit: 'taste' }.
Gib nur das quantities-Objekt zurueck, kein anderer Code.

Rezept:
[REZEPT-OBJEKT HIER EINFUEGEN]
```

## apply-quantities.js Workflow (geplant)

1. `quantities-draft.json` laden.
2. Pro Eintrag: quantities-Feld in recipes.js an der richtigen Stelle einfuegen.
3. Manuell ueberpruefen vor Commit.

Dieses Script existiert noch nicht, da die manuelle Migration zuverlaessiger ist.
