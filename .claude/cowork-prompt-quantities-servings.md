# Cowork-Prompt — Recipe Quantities + Servings Selector

You are adding a new feature to the **Spare Food Calculator** static web app at `C:\Users\Kilian\.vscode\spare-food-calculator\`. Vanilla HTML/JS/CSS, no bundler, no module system. Recipes live in `recipes.js` as a `const recipes = [ {id, title, title_en, ingredients, steps, steps_en, ...}, ... ]` array (~406 entries). Quantities are currently embedded in `steps` strings as free text (e.g. `"Reis zugeben (ca. 300g pro 4 Personen)"`). The recipe modal is rendered by code in `recipes.js` / `ui.js` / `app.js` (find the actual location with `Grep "modal" recipes.js ui.js app.js`).

The user wants:
1. **Structured per-ingredient quantities** on each recipe, calibrated for **4 servings**.
2. **A servings stepper** (− / count / +) in the recipe modal that scales quantities live, default 4, persisted in `localStorage` under `sfc_default_servings`.
3. **Bilingual** UI (DE + EN).
4. **A migration plan** for the ~406 existing recipes.

---

## Data Model

Add a new `quantities` field to each recipe:

```js
{
  id: 1,
  // ...existing fields...
  servings_base: 4,                    // (optional, defaults to 4 globally)
  quantities: {
    'tomate':   { amount: 4,    unit: 'piece' },
    'brot':     { amount: 200,  unit: 'g' },
    'salat':    { amount: 1,    unit: 'head' },
    'olivenöl': { amount: 3,    unit: 'tbsp' },
    'essig':    { amount: 1,    unit: 'tbsp' },
    'salz':     { amount: null, unit: 'taste' },
    'pfeffer':  { amount: null, unit: 'taste' }
  }
}
```

**Units enum (canonical, internal):**
- `g`, `kg` — weight
- `ml`, `l` — volume
- `tbsp`, `tsp` — spoons (1 tbsp = 15 ml; 1 tsp = 5 ml — but display as "EL"/"TL" in DE)
- `piece`, `head`, `clove`, `bunch` — count units
- `pinch`, `taste` — non-scalable (display as "Prise" / "nach Geschmack" — `amount` may be `null`)

Keys of the `quantities` object MUST match strings in `recipe.ingredients` exactly (lowercase, with umlauts as in source). Add a runtime assertion in dev: `Object.keys(quantities).every(k => recipe.ingredients.includes(k))`.

**Display localization:** map `unit` → `{ de: 'EL', en: 'tbsp' }` etc. via a small lookup in a new `js/quantities.js` file.

---

## Scaling Rules

```js
function scale(qty, servings, base) {
  if (qty.amount === null) return qty;          // "nach Geschmack" — never scales
  if (qty.unit === 'pinch') return qty;          // pinch never scales
  return { ...qty, amount: qty.amount * servings / base };
}
```

Display: round to 1 decimal place; if result < 0.1 of unit, downscale to next smaller unit (e.g. 0.05 kg → 50 g) — implement a `normalize()` helper.

**Special cases the prompt-receiver MUST handle:**
- 1 person + recipe needs 1 egg: don't display "0.25 piece" — display "1 piece" with a footnote "Mindestmenge / minimum quantity".
- 8 persons + 1 clove garlic: display "2 cloves" (rounded up for `clove`/`piece`/`head`/`bunch`).
- `taste` and `pinch` units always display as the localized word, no number.

---

## UI

### Recipe modal layout (mock)

```
┌──────────────────────────────────────────┐
│  Rezept-Titel                       [X]  │
│  ────────────────────────────────────    │
│  Personen:  [−] 4 [+]                    │
│  ────────────────────────────────────    │
│  Zutaten:                                │
│    • 4 Tomaten                           │
│    • 200 g Brot                          │
│    • 1 Kopf Salat                        │
│    • 3 EL Olivenöl                       │
│    • 1 EL Essig                          │
│    • Salz nach Geschmack                 │
│    • Pfeffer nach Geschmack              │
│  ────────────────────────────────────    │
│  Zubereitung:                            │
│    1. Altbrot ...                        │
│    ...                                   │
│  ────────────────────────────────────    │
│  [Sustainability panel — existing]       │
└──────────────────────────────────────────┘
```

### Stepper component

- HTML:
  ```html
  <div class="sfc-servings" role="group" aria-labelledby="sfc-servings-label">
    <span id="sfc-servings-label" data-i18n="recipe_servings_label">Personen</span>
    <button type="button" class="sfc-servings-dec" aria-label="..." data-i18n-aria="recipe_servings_dec_aria">−</button>
    <output class="sfc-servings-count">4</output>
    <button type="button" class="sfc-servings-inc" aria-label="..." data-i18n-aria="recipe_servings_inc_aria">+</button>
  </div>
  ```
- JS: clamp range to `[1, 12]`. On change: re-render the ingredients list, persist via `localStorage.setItem('sfc_default_servings', String(n))`.

### Steps text

Steps text **stays as-is** (we are NOT regenerating step text). The structured ingredient list above the steps shows scaled quantities. Mention this trade-off in the recipe modal as a small footnote on first render: "Mengenangaben in den Schritten sind für 4 Personen geschrieben."

(If a future iteration wants placeholder substitution like `{tomate:amount} Tomaten` inside the step strings, that's out of scope for this PR.)

---

## i18n Keys to Add (`i18n.js`)

```
recipe_servings_label          "Personen"                       "Servings"
recipe_servings_dec_aria       "Eine Person weniger"            "One fewer serving"
recipe_servings_inc_aria       "Eine Person mehr"               "One more serving"
recipe_steps_for_4_note        "Mengen in den Schritten sind für 4 Personen geschrieben"
                                                                "Quantities in the steps are written for 4 servings"
recipe_unit_g                  "g"                              "g"
recipe_unit_kg                 "kg"                              "kg"
recipe_unit_ml                 "ml"                              "ml"
recipe_unit_l                  "l"                              "l"
recipe_unit_tbsp               "EL"                             "tbsp"
recipe_unit_tsp                "TL"                             "tsp"
recipe_unit_piece              ""                               ""        (just the number, no suffix)
recipe_unit_pieces             "Stk."                           "pcs"     (use plural form when amount > 1)
recipe_unit_head               "Kopf"                           "head"
recipe_unit_heads              "Köpfe"                          "heads"
recipe_unit_clove              "Zehe"                           "clove"
recipe_unit_cloves             "Zehen"                          "cloves"
recipe_unit_bunch              "Bund"                           "bunch"
recipe_unit_bunches            "Bund"                           "bunches"
recipe_unit_pinch              "Prise"                          "pinch"
recipe_unit_taste              "nach Geschmack"                 "to taste"
```

---

## File Plan

- **Create:** `js/quantities.js` — exports `Quantities` namespace with:
  - `scale(qty, servings, base) → qty`
  - `normalize(qty) → qty` (kg ↔ g, l ↔ ml downscale)
  - `format(qty, lang) → string`
  - `getDefaultServings() → number` (reads `sfc_default_servings`, default 4, clamped 1..12)
  - `setDefaultServings(n)` (writes localStorage, fires `sfc:servingsChanged` custom event)
- **Modify:** `recipes.js` — add `quantities` field on every recipe (migration; see below)
- **Modify:** wherever the recipe modal is rendered — find with `Grep "modal" recipes.js ui.js app.js` — add the stepper component + ingredients list above the steps section. Bind dec/inc handlers. Listen for `sfc:servingsChanged` to re-render. Honor `getDefaultServings()` on first open.
- **Modify:** `i18n.js` — add the 18 new keys above (DE + EN)
- **Modify:** `styles.css` — add `.sfc-servings` rules (flex, button styles matching existing `.btn` look)
- **Modify:** every HTML page that loads `recipes.js` — add `<script src="js/quantities.js"></script>` BEFORE `recipes.js`. Pages: `index.html`, `pages/search.html`, `pages/ingredients-generator.html`, all `pages/<category>.html`.
- **Modify:** `sw.js` — add `/js/quantities.js` to `ASSETS` list, bump `CACHE_VERSION`.

---

## Migration of ~406 Recipes

This is the riskiest part. Three-pass strategy:

### Pass 1 — Automated extraction (one-shot Node script)

Write `tools/extract-quantities.js` that:
1. Loads `recipes.js` (eval in vm sandbox to get the `recipes` array).
2. For each recipe, for each ingredient name, looks at the German `steps` array for substrings of the form `<NUMBER>(g|kg|ml|l|EL|TL|Prise|Stk\.?)` near the ingredient name (within ~30 characters).
3. Emits a draft `quantities` object per recipe to `tools/quantities-draft.json`.
4. For ingredients where no quantity is found in the steps, emits `{ amount: null, unit: 'taste' }` as a placeholder — these need manual review.

Expected hit rate: ~40-60%. Salt, pepper, oil-for-frying, etc. usually have no number in the steps.

### Pass 2 — LLM-assisted fill-in

The user runs the draft through an LLM with this prompt template (per recipe, in batches of 10):

> "For the following recipe (calibrated for 4 servings), fill in reasonable quantities for each ingredient that is currently null. Reply as JSON only. Use canonical units: g, kg, ml, l, tbsp, tsp, piece, head, clove, bunch, pinch, taste. ..."

This is **not in scope of the implementing session** — the implementer just provides the script in Pass 1 plus a markdown file `tools/MIGRATION.md` with the prompt template and instructions for the user.

### Pass 3 — Manual review + commit

User reviews `tools/quantities-draft.json`, edits, then runs `tools/apply-quantities.js` which writes the `quantities` field back into `recipes.js` (preserving formatting via a careful regex-based insertion — write tests for this script).

**For this PR, ship Pass 1 + scripts only. Migrate ~10 representative recipes by hand to prove the data model works end-to-end. The full migration is a separate manual sprint.**

---

## Acceptance Criteria

1. `js/quantities.js` exists, exports the `Quantities` API. Has inline unit-test asserts at module bottom (mirror the pattern at the bottom of `js/sustainability.js`).
2. ~10 hand-migrated recipes (pick a mix: id 1, 5, 11, 18, 26, 50, 100, 200, 300, 405) have a populated `quantities` field.
3. Opening a recipe modal for any of those 10 shows the stepper + scaled ingredients list.
4. `−` and `+` buttons work, are clamped to `[1, 12]`, and persist across page reloads.
5. Switching language (DE ↔ EN) re-renders the ingredients list with the right unit words.
6. Recipes WITHOUT a `quantities` field fall back gracefully: stepper still shown but ingredients list shows the bare ingredient names without quantities, and a small "Mengenangaben fehlen" / "Quantities missing" note. Don't crash.
7. `sw.js` is updated and old caches purge correctly.
8. `tools/extract-quantities.js` runs cleanly: `node tools/extract-quantities.js > /dev/null` exits 0 and writes `tools/quantities-draft.json`.
9. `tools/MIGRATION.md` documents the LLM prompt template and the manual-review workflow.

---

## Step Order (suggested)

1. Add `js/quantities.js` with API + inline asserts. **Commit.**
2. Add the 18 i18n keys to `i18n.js`. **Commit.**
3. Add `<script src="js/quantities.js">` to all pages that load `recipes.js`. Update `sw.js`. **Commit.**
4. Build the stepper component in CSS + JS, wire it into the recipe modal. Test with hardcoded `quantities` for recipe id 1. **Commit.**
5. Manually populate `quantities` for the 10 representative recipes in `recipes.js`. **Commit.**
6. Build `tools/extract-quantities.js`. Generate draft. **Commit.**
7. Write `tools/MIGRATION.md`. **Commit.**

If any single step blows past ~250 LOC of changes, pause and report. Don't try to migrate all 406 recipes in one session — that's the user's manual follow-up work after merge.
