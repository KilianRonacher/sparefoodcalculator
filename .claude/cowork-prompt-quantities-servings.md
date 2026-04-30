# Cowork Prompt — Recipe Quantities + Servings Selector

You are adding a new feature to the **Spare Food Calculator** static web app at
`C:\Users\Kilian\.vscode\spare-food-calculator\`.
Vanilla HTML/JS/CSS, no bundler, no module system.
Recipes live in `recipes.js` as `const recipes = [ {id, title, title_en, ingredients, steps, steps_en, ...}, ... ]`
(~406 entries). Quantities are currently embedded as free text inside `steps` strings
(e.g. `"Reis zugeben (ca. 300g pro 4 Personen)"`).
The recipe modal is rendered somewhere in `recipes.js` / `ui.js` / `app.js` —
locate it with `Grep "modal" recipes.js ui.js app.js` before making changes.

Commit directly on `main` (or open a feature branch + PR if you prefer).

---

## Current Codebase State

Read this section before touching any file.

- **`sw.js` `CACHE_VERSION`** is currently **`sfc-v2`**. Bump to **`sfc-v3`** when you add the new asset.
- **`js/quantities.js` does not exist yet** — this is the primary deliverable.
- **`ingredients.js`** is wrapped as `var Ingredients = (function(){...}())`. All symbols live under `Ingredients.*`. This does not affect the quantities feature; noted for context.
- **Already in `sw.js` ASSETS**: `/js/sustainability.js`, `/js/side-stats.js`, `/js/sustainability-ui.js`, `/data/sustainability.js`, `/category-template.js` — don't add them again.
- **`tools/validate-i18n.js` exists** (`npm run validate:i18n`). Run it after adding new i18n keys to confirm zero missing entries.
- **Category pages are script-tag-free (CRITICAL)**:
  `pages/dessert.html`, `pages/fisch.html`, `pages/haendl.html`, `pages/kuchen.html`,
  `pages/rind.html`, `pages/salat.html`, `pages/schwein.html`, `pages/suppen.html`,
  `pages/vorspeisen.html` each contain **only** `<script src="../category-template.js"></script>`.
  All other scripts are injected by `category-template.js` via its `scriptSrcs` array and `document.write()`.
  **Do NOT add `<script>` tags to individual category HTML files.**
  Add `'../js/quantities.js'` to the `scriptSrcs` array in `category-template.js` BEFORE `'../recipes.js'`.

---

## What the User Wants

1. **Structured per-ingredient quantities** on each recipe, calibrated for 4 servings.
2. **A servings stepper** (− / count / +) in the recipe modal that scales quantities live; default 4; persisted in `localStorage` under `sfc_default_servings`.
3. **Bilingual UI** (DE + EN).
4. **A migration plan** for ~406 existing recipes (Pass 1 automation + ~10 hand-migrated recipes for this session as proof-of-concept).

---

## Data Model

Add a `quantities` field (and optional `servings_base`) to each recipe object:

```js
{
  id: 1,
  // ...existing fields unchanged...
  servings_base: 4,          // optional; global default is 4 when absent
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

### Canonical Units (internal identifiers)

| Unit | Category | Display notes |
|------|----------|---------------|
| `g`, `kg` | weight | 1 kg = 1000 g |
| `ml`, `l` | volume | 1 l = 1000 ml |
| `tbsp` | spoon | = 15 ml; display "EL" in DE, "tbsp" in EN |
| `tsp` | spoon | = 5 ml; display "TL" in DE, "tsp" in EN |
| `piece`, `head`, `clove`, `bunch` | count | scalable; round up (see special cases) |
| `pinch`, `taste` | non-scalable | `amount` may be `null`; never multiply |

### Key-match constraint

`Object.keys(quantities)` must be a **strict subset** of `recipe.ingredients` (lowercase, umlauts preserved as in source).
Add a dev-time runtime assertion inside the modal render function:

```js
// DEV ASSERT — remove or guard with a debug flag if perf is a concern
if (recipe.quantities) {
  console.assert(
    Object.keys(recipe.quantities).every(k => recipe.ingredients.includes(k)),
    'quantities key not in ingredients:', recipe.id
  );
}
```

---

## Scaling Rules

```js
function scale(qty, servings, base) {
  if (qty.amount === null) return qty;   // taste / null — never scale
  if (qty.unit === 'pinch') return qty;  // pinch — never scale
  return { ...qty, amount: qty.amount * servings / base };
}
```

- **Display**: round to 1 decimal place.
- **`normalize(qty)`**: if the scaled result is < 0.1 of its unit, downscale to the next smaller unit:
  - `0.05 kg` → `{ amount: 50, unit: 'g' }`
  - `0.08 l` → `{ amount: 80, unit: 'ml' }`
- **Special cases — mandatory**:
  1. **Minimum-quantity footnote**: if the scaled amount of a `piece`/`head`/`clove`/`bunch` falls below 1, display `1 <unit>` and append a footnote: *"Mindestmenge / minimum quantity"*.
  2. **Round up for count units**: for `piece`, `head`, `clove`, `bunch` always `Math.ceil()` the scaled amount (e.g. 8 persons × 1 clove ÷ 4 base = 2 cloves).
  3. **`taste` and `pinch`**: always render as the localized word only — no number, no scaling.

---

## UI

### Recipe modal layout

```
┌──────────────────────────────────────────┐
│  Recipe Title                       [X]  │
│  ────────────────────────────────────    │
│  Servings:  [−] 4 [+]                    │
│  ────────────────────────────────────    │
│  Ingredients:                            │
│    • 4 tomatoes                          │
│    • 200 g bread                         │
│    • 1 head of lettuce                   │
│    • 3 tbsp olive oil                    │
│    • 1 tbsp vinegar                      │
│    • Salt to taste                       │
│    • Pepper to taste                     │
│  ────────────────────────────────────    │
│  Steps: 1. ...                           │
│  ────────────────────────────────────    │
│  [Sustainability panel — existing]       │
└──────────────────────────────────────────┘
```

### Stepper component HTML

```html
<div class="sfc-servings" role="group" aria-labelledby="sfc-servings-label">
  <span id="sfc-servings-label" data-i18n="recipe_servings_label">Personen</span>
  <button type="button" class="sfc-servings-dec"
          aria-label="Eine Person weniger"
          data-i18n-aria="recipe_servings_dec_aria">−</button>
  <output class="sfc-servings-count">4</output>
  <button type="button" class="sfc-servings-inc"
          aria-label="Eine Person mehr"
          data-i18n-aria="recipe_servings_inc_aria">+</button>
</div>
```

### Stepper JS behaviour

- Range clamp: `[1, 12]`.
- On change: re-render the ingredients list, then `localStorage.setItem('sfc_default_servings', String(n))`.
- Fire `document.dispatchEvent(new CustomEvent('sfc:servingsChanged', { detail: { servings: n } }))`.
- On modal open: read `Quantities.getDefaultServings()` for the initial value.
- Listen for `sfc:servingsChanged` to update all open modals (in case multiple are ever shown).

### Steps text

Steps text stays **as-is**. The structured quantity list lives **above** the steps section.
On first render, show a small footnote directly below the ingredients list:

```
i18n key: recipe_steps_for_4_note
DE: "Mengen in den Schritten sind für 4 Personen geschrieben"
EN: "Quantities in the steps are written for 4 servings"
```

### Graceful fallback (no `quantities` field)

If a recipe has no `quantities` field: stepper still renders; the ingredients section shows
the bare ingredient names (plain list), plus a note:

```
i18n: "Mengenangaben fehlen"  /  "Quantities missing"
```

No crash, no hidden elements.

---

## i18n Keys to Add

Add all entries to **both** `i18n['de']` and `i18n['en']` in `i18n.js`.
After editing, run `npm run validate:i18n` and confirm exit 0.

| Key | DE | EN |
|-----|----|----|
| `recipe_servings_label` | Personen | Servings |
| `recipe_servings_dec_aria` | Eine Person weniger | One fewer serving |
| `recipe_servings_inc_aria` | Eine Person mehr | One more serving |
| `recipe_steps_for_4_note` | Mengen in den Schritten sind für 4 Personen geschrieben | Quantities in the steps are written for 4 servings |
| `recipe_quantities_missing` | Mengenangaben fehlen | Quantities missing |
| `recipe_unit_g` | g | g |
| `recipe_unit_kg` | kg | kg |
| `recipe_unit_ml` | ml | ml |
| `recipe_unit_l` | l | l |
| `recipe_unit_tbsp` | EL | tbsp |
| `recipe_unit_tsp` | TL | tsp |
| `recipe_unit_piece` | *(empty string)* | *(empty string)* |
| `recipe_unit_pieces` | Stk. | pcs |
| `recipe_unit_head` | Kopf | head |
| `recipe_unit_heads` | Köpfe | heads |
| `recipe_unit_clove` | Zehe | clove |
| `recipe_unit_cloves` | Zehen | cloves |
| `recipe_unit_bunch` | Bund | bunch |
| `recipe_unit_bunches` | Bund | bunches |
| `recipe_unit_pinch` | Prise | pinch |
| `recipe_unit_taste` | nach Geschmack | to taste |
| `recipe_min_quantity_note` | Mindestmenge | minimum quantity |

---

## File Plan

### CREATE `js/quantities.js`

Expose as `var Quantities = (function() { ... }())` (IIFE, same pattern as `Ingredients`).

Export:

```js
Quantities.scale(qty, servings, base)          // → qty
Quantities.normalize(qty)                      // → qty  (unit downscale)
Quantities.format(qty, lang)                   // → string
Quantities.getDefaultServings()                // → number (localStorage sfc_default_servings, default 4, clamp 1..12)
Quantities.setDefaultServings(n)               // writes localStorage, dispatches sfc:servingsChanged
```

`format(qty, lang)` rules:
- `taste`/`pinch` with `null` amount → return the localized word from i18n (e.g. "nach Geschmack").
- count units with amount > 1 → use plural key (e.g. `recipe_unit_cloves`).
- count units with amount ≤ 1 → use singular key (e.g. `recipe_unit_clove`).
- `piece` singular → empty string (just show the number); plural → "Stk." / "pcs".
- weight/volume/spoon units → always the same key (no plural form).
- Prepend number + space when unit string is non-empty; omit space when empty (`piece` singular).

Add **inline assert tests at the bottom** of the file (mirror the `// ===== SELF-TEST =====` block at the bottom of `js/sustainability.js`). Cover at minimum:
- `scale` with normal amount
- `scale` with `null` (taste)
- `normalize` kg→g crossover
- `format` for taste, piece singular/plural, clove plural, EL
- `getDefaultServings` returns 4 when localStorage is empty

### MODIFY `recipes.js`

Add a `quantities` field to the 10 representative recipes:
**ids: 1, 5, 11, 18, 26, 50, 100, 200, 300, 405**

Use realistic amounts calibrated for 4 servings. Keys must exactly match strings in that recipe's `ingredients` array (read them first, copy verbatim).

### MODIFY recipe modal renderer

Find it with: `Grep "modal" recipes.js ui.js app.js`

Changes:
1. Insert the stepper `<div class="sfc-servings">` block directly **above** the ingredients list.
2. Insert a structured `<ul class="sfc-quantities-list">` (scaled, formatted) **above** the steps section.
3. Insert the `recipe_steps_for_4_note` footnote directly below the quantities list.
4. Bind `−` / `+` click handlers (clamp, persist, re-render, fire event).
5. Read `Quantities.getDefaultServings()` on modal open for the initial count.
6. Listen for `sfc:servingsChanged` to re-render if fired externally.
7. On language change (`languageChanged` event), re-render the quantities list.

### MODIFY `i18n.js`

Add all 22 entries from the table above to both `i18n['de']` and `i18n['en']`.
Run `npm run validate:i18n` afterwards.

### MODIFY `styles.css`

Add `.sfc-servings` rules:

```css
.sfc-servings {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
}
.sfc-servings-dec,
.sfc-servings-inc {
  /* inherit .btn look — match existing button styles in the file */
}
.sfc-servings-count {
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
}
```

### MODIFY pages that load `recipes.js` directly (HTML script-tag approach)

Add `<script src="../js/quantities.js"></script>` (or `<script src="js/quantities.js">` for root-level) **immediately before** the existing `recipes.js` script tag:

- `index.html` → `<script src="js/quantities.js"></script>`
- `pages/search.html` → `<script src="../js/quantities.js"></script>`
- `pages/ingredients-generator.html` → `<script src="../js/quantities.js"></script>`
- `pages/contact.html` → `<script src="../js/quantities.js"></script>`
- `pages/impressum.html` → `<script src="../js/quantities.js"></script>`
- `pages/ingredients-catalog.html` → `<script src="../js/quantities.js"></script>`

### MODIFY `category-template.js` (CRITICAL — do NOT touch individual category HTML files)

The category pages (`dessert.html`, `fisch.html`, `haendl.html`, `kuchen.html`, `rind.html`,
`salat.html`, `schwein.html`, `suppen.html`, `vorspeisen.html`) each load scripts exclusively
through `category-template.js`'s `scriptSrcs` array + `document.write()`.

Add `'../js/quantities.js'` to `scriptSrcs` **before** `'../recipes.js'`:

```js
var scriptSrcs = [
  '../i18n.js',
  '../data/sustainability.js',
  '../js/sustainability.js',
  '../ingredients.js',
  '../search.js',
  '../js/quantities.js',    // ← ADD HERE
  '../recipes.js',
  '../app.js',
  '../ui.js',
  '../js/sustainability-ui.js'
];
```

**Do NOT add `<script>` tags to any of the 9 category HTML files.**

### MODIFY `sw.js`

1. Add `'/js/quantities.js'` to the `ASSETS` array (place it in the `// JS modules (js/)` block alongside the existing `js/` entries).
2. Bump `const CACHE_VERSION = 'sfc-v2'` → **`'sfc-v3'`**.

The existing `activate` handler already purges any cache whose name ≠ `CACHE_VERSION`, so `sfc-v2` is cleaned up automatically — no further changes needed.

---

## Migration of ~406 Recipes

### Pass 1 — Automated extraction (implement in this session)

Create `tools/extract-quantities.js` (Node.js, no external deps beyond `fs`, `path`, `vm`):

1. Load `recipes.js` into a `vm.runInNewContext` sandbox to obtain the `recipes` array.
2. For each recipe, for each ingredient string, scan the German `steps` array for the pattern
   `<NUMBER>\s*(g|kg|ml|l|EL|TL|Prise|Stk\.?)` within ≤ 30 characters of the ingredient name.
3. On match: emit `{ amount: <parsed_number>, unit: <canonical_unit> }`.
   Mapping: `EL → tbsp`, `TL → tsp`, `Prise → pinch`, `Stk. → piece`.
4. No match: emit `{ amount: null, unit: 'taste' }` (placeholder for manual/LLM review).
5. Write the full draft to `tools/quantities-draft.json`.

Expected hit rate: ~40–60%. Salt, pepper, frying oil usually have no number in the steps.

Acceptance: `node tools/extract-quantities.js > /dev/null` exits 0 and writes `tools/quantities-draft.json`.

### Pass 2 — LLM-assisted fill-in (out of scope for this session)

Not implemented here. Write the prompt template into `tools/MIGRATION.md` only.

### Pass 3 — Apply script (out of scope for this session)

`tools/apply-quantities.js` will write the filled-in `quantities` fields back into `recipes.js`
using careful regex-based insertion. Not built in this session.

### This session deliverable

**Hand-migrate the 10 representative recipes** (ids 1, 5, 11, 18, 26, 50, 100, 200, 300, 405)
to prove the data model works end-to-end. Read each recipe's `ingredients` array first, copy keys verbatim.

---

## Acceptance Criteria

1. `js/quantities.js` exists, exposes the `Quantities` API (IIFE), has inline self-test asserts at the bottom (mirror `js/sustainability.js` pattern).
2. ~10 hand-migrated recipes (ids 1, 5, 11, 18, 26, 50, 100, 200, 300, 405) have populated `quantities` fields whose keys match their `ingredients` array exactly.
3. Opening a recipe modal for any of those 10 shows the stepper + scaled ingredient list.
4. `−` and `+` clamp to `[1, 12]`, update the display immediately, and persist `sfc_default_servings` in `localStorage` across reloads.
5. Switching language DE ↔ EN re-renders the ingredient list with the correct unit words.
6. Recipes **without** `quantities` fall back gracefully: stepper still renders, ingredient list shows plain names + "Mengenangaben fehlen / Quantities missing" note. No JS errors.
7. `sw.js` updated: `/js/quantities.js` added to `ASSETS`; `CACHE_VERSION` bumped `sfc-v2` → `sfc-v3`; old caches purge on activate.
8. `node tools/extract-quantities.js > /dev/null` exits 0 and writes `tools/quantities-draft.json`.
9. `tools/MIGRATION.md` documents the LLM prompt template and manual-review workflow.

---

## Suggested Step Order

Each step ends with a commit. If any step exceeds ~250 LOC of changes, **stop and report** rather than forcing it.

1. **`js/quantities.js`** — IIFE, full API, inline self-tests. Commit.
2. **`i18n.js`** — add all 22 keys to both `de` and `en`. Run `npm run validate:i18n`, confirm exit 0. Commit.
3. **Script wiring** — add `<script src="...js/quantities.js">` to the 6 direct-loader HTML pages; add `'../js/quantities.js'` to `scriptSrcs` in `category-template.js`; add `/js/quantities.js` to `sw.js` ASSETS + bump to `sfc-v3`. Commit.
4. **Stepper CSS + modal integration** — `.sfc-servings` rules in `styles.css`; stepper + quantity list injected into the modal; +/− handlers; tested with hardcoded `quantities` for recipe id 1. Commit.
5. **Hand-migrate 10 recipes** — add `quantities` field to ids 1, 5, 11, 18, 26, 50, 100, 200, 300, 405 in `recipes.js`. Commit.
6. **`tools/extract-quantities.js`** — run it, verify exit 0, verify `tools/quantities-draft.json` written. Commit.
7. **`tools/MIGRATION.md`** — LLM prompt template + apply-script workflow documentation. Commit.

---

## Closing Reminders

- All prose in this prompt is English; i18n string values stay in their original language (DE/EN as labelled).
- Never delete or rename existing recipe fields.
- Don't modify sustainability code paths beyond what is listed above.
- After all commits, run a final `npm run validate:i18n` and do a quick smoke test: open one category page and one `index.html` recipe modal and verify the stepper renders.
