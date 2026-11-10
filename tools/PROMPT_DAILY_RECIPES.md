# Daily Recipe Generation — Autonomous Prompt

**Working directory:** `C:\Users\Kilian\.vscode\spare-food-calculator`

You are running as a scheduled cron job. Your task is to add 50 new, original recipes to the SpareFoodCalculator website database. Follow every step exactly.

---

## Step 1 — Search for recipe name ideas

Before writing any recipe, do web searches to gather **name ideas only**. You will write all recipe content yourself (original text — do NOT copy or paraphrase from copyrighted sites).

Run these searches (one per cuisine block):

```
Search: "österreichische Rezepte klassisch Ideen Liste"
Search: "ungarische Rezepte traditionell Ideen"
Search: "deutsche Rezepte regional Hausmannskost Ideen"
Search: "chinesische Rezepte authentisch Gerichte Namen"
Search: "indische Rezepte Curry Dal Ideen Liste"
Search: "japanische Rezepte klassisch Ideen"
Search: "französische Rezepte traditionell Ideen"
Search: "italienische Rezepte regional Ideen Liste"
```

From the search results collect **dish names only** (not instructions or quantities). Use those names as inspiration, then write every word of each recipe yourself.

---

## Step 2 — Generate 50 original recipes

Distribute the 50 recipes across cuisines as follows:

| Cuisine | Count |
|---|---|
| Österreichisch / Ungarisch | 12 |
| Deutsch (regional) | 8 |
| Chinesisch | 8 |
| Indisch | 7 |
| Japanisch | 6 |
| Französisch | 5 |
| Italienisch | 4 |

**Rules for every recipe:**

1. `title` — German name, correct Umlauts (ü ä ö ß — NEVER write ue/ae/oe/ss as substitutes)
2. `title_en` — English translation
3. `category` — exactly one of: `vorspeise`, `hauptgericht`, `beilage`, `suppe`, `dessert`, `frühstück`, `snack`, `getränk`
4. `difficulty` — exactly one of: `einfach`, `mittel`, `gehoben`
5. `ingredients` — array of German ingredient strings, lowercase (e.g. `"rindfleisch"`, `"karotten"`)
6. `quantities` — object keyed by each ingredient string; each value `{ "amount": <number|null>, "unit": "<unit>" }`. For "to taste" use `{ "amount": null, "unit": "taste" }`.
7. `steps` — 4–7 steps in German
8. `steps_en` — same steps in English, same count as `steps`

**Allowed units:** `g`, `kg`, `ml`, `l`, `piece`, `tsp`, `tbsp`, `cup`, `taste`, `pinch`, `slice`, `bunch`, `clove`, `can`

**Quantity rules:**
- Every ingredient in `ingredients` must have an entry in `quantities`
- `amount` must be a number (integer or decimal) or `null`
- Spices / salt / pepper: `{ "amount": null, "unit": "taste" }`

---

## Step 3 — Write the JSON output file

Write all 50 recipes to:
```
data\recipes-TODAY.json
```
(replace TODAY with the current date as YYYY-MM-DD)

The file must be a valid JSON array:

```json
[
  {
    "title": "Wiener Tafelspitz",
    "title_en": "Viennese Boiled Beef",
    "category": "hauptgericht",
    "difficulty": "mittel",
    "ingredients": ["tafelspitz", "karotten", "sellerie", "zwiebel", "salz", "pfeffer", "lorbeer"],
    "quantities": {
      "tafelspitz":  { "amount": 800,  "unit": "g"     },
      "karotten":    { "amount": 200,  "unit": "g"     },
      "sellerie":    { "amount": 100,  "unit": "g"     },
      "zwiebel":     { "amount": 1,    "unit": "piece" },
      "salz":        { "amount": null, "unit": "taste" },
      "pfeffer":     { "amount": null, "unit": "taste" },
      "lorbeer":     { "amount": 2,    "unit": "piece" }
    },
    "steps": [
      "Tafelspitz in kaltem Wasser aufsetzen und langsam zum Kochen bringen.",
      "Schaum abschöpfen und Gemüse hinzufügen.",
      "Bei niedriger Hitze 2–3 Stunden köcheln lassen.",
      "Fleisch herausnehmen, in Scheiben schneiden und mit Brühe servieren."
    ],
    "steps_en": [
      "Place beef in cold water and slowly bring to a boil.",
      "Skim foam and add vegetables.",
      "Simmer on low heat for 2–3 hours.",
      "Remove meat, slice, and serve with broth."
    ]
  }
]
```

---

## Step 4 — Collect new ingredients

Compare all ingredient strings from your 50 recipes against the known ingredient list in `ingredients.js`. For each ingredient that does NOT already appear in `ingredients.js`, add it to a second file:

```
data\new-ingredients-TODAY.json
```

Format:
```json
[
  { "de": "tamarindenpaste", "category": "saucen" },
  { "de": "shichimi togarashi", "category": "gewürze" }
]
```

Valid categories: `gemüse`, `fleisch`, `fisch`, `milchprodukte`, `getreide`, `öle`, `gewürze`, `kräuter`, `saucen`, `obst`, `nüsse`, `süßes`, `eier`, `getränke`, `fertigprodukte`

---

## Step 5 — Run the append tool

```powershell
cd C:\Users\Kilian\.vscode\spare-food-calculator
node tools\append-daily-recipes.js --input data\recipes-TODAY.json
```

Expected output: `"added": 50` (or less if some were already in the database — that is fine).
If the tool exits with an error, read the error message and fix the JSON before retrying.

---

## Step 6 — Run the ingredients update tool

```powershell
node tools\update-ingredients.js --input data\new-ingredients-TODAY.json
```

---

## Step 7 — Commit and push to GitHub

After a successful append, commit and push so the live GitHub Pages site is updated.

```powershell
cd C:\Users\Kilian\.vscode\spare-food-calculator
$today = (Get-Date -Format "yyyy-MM-dd")
git add data\recipes.json data\recipe-history.json ingredients.js
git commit -m "chore(data): daily recipe update $today"
git push origin main
```

If `git push` fails (e.g. auth error), log the error in the report and skip — the next day's run will include both batches.

---

## Step 8 — Report

Print a short summary:
- How many recipes were added
- How many were skipped as duplicates
- How many new ingredients were added
- Whether the git push succeeded or failed
- Any other errors encountered
