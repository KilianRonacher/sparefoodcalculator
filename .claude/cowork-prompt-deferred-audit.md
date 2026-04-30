# Cowork-Prompt — Deferred Audit Findings (Spare Food Calculator)

You are working on the static web app **Spare Food Calculator**, a vanilla HTML/JS/CSS site hosted on GitHub Pages. The repo lives at `C:\Users\Kilian\.vscode\spare-food-calculator\`. There is **no bundler, no module system, no test runner** — code uses script tags, IIFE patterns, and globals like `SustainabilityCalc`, `i18n`, `recipes`, `allIngredients`. Two main pages have side-stats boxes around the main content: `pages/search.html` (recipe generator) and `pages/ingredients-generator.html` (ingredient generator).

A code-quality audit flagged four items that need their own session because they cross multiple files or require new tooling. Work them as **four separate commits** on a feature branch named `chore/audit-followups`.

---

## Item 1 — De-duplicate the side-stats markup

**Problem:** `pages/search.html` (~lines 106-218) and `pages/ingredients-generator.html` (~lines 104-182) contain a **byte-for-byte duplicate block** of the side-stats wrapper:

```html
<div class="sfc-stage">
  <aside class="sfc-side sfc-side-money" aria-labelledby="sfc-money-title"> ... </aside>
  <main id="main" class="container"> ... </main>
  <aside class="sfc-side sfc-side-eco" aria-labelledby="sfc-eco-title"> ... </aside>
</div>
```

(Only the contents of `<main>` differ between pages.) When a copywriter changes the German word "Geld gespart" to "Geld eingespart" they must remember to edit both files.

**Acceptance:**
1. Markup of the two `<aside>` elements lives in exactly one place.
2. Both pages render byte-identical side-stats sections (compare via DevTools "Copy outerHTML" of `.sfc-stage` after load).
3. `data-i18n` keys still trigger translation when the language toggle changes.
4. Side boxes update when `sfc:balanceChanged` fires (existing behavior in `js/side-stats.js`).
5. Lighthouse score for both pages does not regress (the asides must render before main thread becomes idle, otherwise CLS suffers).

**Pick one of three approaches** (your call — explain trade-offs in commit msg):
- **(a) Inject from JS** — extend `js/side-stats.js` with a `renderBoxes()` that builds and inserts the asides on DOMContentLoaded. Removes 36 lines from each HTML page.
  - Risk: SSR-less injection causes layout shift. Mitigate with reserved CSS grid columns (already done in `styles.css` `.sfc-stage`).
- **(b) HTML partial + fetch loader** — extract `pages/_partials/side-stats.html`. Both pages contain only `<div class="sfc-stage" data-partial="side-stats"></div>` and a tiny loader script does `fetch().then(r=>r.text()).then(html=>...)`.
  - Risk: extra network hop on slow connections; CORS not an issue on same-origin GH Pages.
- **(c) Build-time include** — write a tiny Node script in `tools/build-pages.js` that processes `<!-- @include side-stats.html -->` markers. Run pre-commit. Source files become `pages/search.src.html`, generated files `pages/search.html`.
  - Risk: adds a build step the user explicitly avoided.

**Recommended:** (a). Lowest churn, fits existing JS-side-stats pattern.

**Files to touch (approach a):**
- `js/side-stats.js` — add `renderBoxes()` and call it from `init()` before `update()`. The function should idempotently no-op if `.sfc-side` elements already exist (so existing pages keep working until removal).
- `pages/search.html` lines 108-114 and 209-217 — remove the two `<aside>` blocks, leave `<div class="sfc-stage">` and `<main>` and `</div>`.
- `pages/ingredients-generator.html` lines 106-112 and 173-181 — same.
- Don't forget the i18n keys: `sfc_box_money_title`, `sfc_box_money_sub`, `sfc_box_eco_title`, `sfc_box_eco_co2_sub`, `sfc_box_eco_water_sub` — preserve their `data-i18n` attributes when generating the asides programmatically. The i18n driver re-translates anything with `data-i18n` on `languageChanged`, so as long as the attributes are on the generated DOM nodes, translations keep working.

**Don't touch:** `category-template.js` and the per-category pages (`pages/dessert.html`, `pages/fisch.html`, etc.) — those don't have side-stats boxes and shouldn't get them in this PR.

---

## Item 2 — Reduce global namespace pollution from `ingredients.js`

**Problem:** `ingredients.js:188` declares `const allIngredients = Object.values(ingredientsDatabase).flat();` at top level. This binds to the global scope (the file is loaded as a classic script). It already collided once with inline page code (the user reported this verbally — confirm with `git log --all --grep="allIngredients"`).

The file's IIFE-style export is at line ~356 (`return { ..., allIngredients, ... };`) but the top-level `const` is **outside** that IIFE — it leaks regardless.

**Acceptance:**
1. `window.allIngredients` is `undefined` after `ingredients.js` loads.
2. All call sites that previously used the global `allIngredients` now use `Ingredients.allIngredients` (or whatever the module export object is named).
3. No console errors on any page that loads `ingredients.js`.
4. `pages/ingredients-catalog.html` still renders the catalog correctly.
5. `pages/ingredients-generator.html` "Generate Ingredients" button still produces a list.

**Approach:**
1. Read the full structure of `ingredients.js` first — it's a mix of top-level code and function declarations. The cleanest move is to wrap the entire file in `var Ingredients = (function(){ ... return {...}; })();` if it isn't already.
2. Grep the codebase for unqualified `allIngredients` references (`Grep -r "\ballIngredients\b"`). For each one outside `ingredients.js` itself, change to `Ingredients.allIngredients` (or the existing namespace name — check what the file already exports).
3. If `ingredients.js` *is* already an IIFE that returns `{ allIngredients, ... }` but the `const allIngredients` on line 188 is *also* a global outside the IIFE, the fix is simpler: move the `const` inside the IIFE. Verify by reading the file.

**Files to touch:** `ingredients.js`, plus any `pages/*.html` and `js/*.js` and `app.js` / `search.js` / `ui.js` that reference `allIngredients` unqualified.

---

## Item 3 — Validate `data-i18n` keys against `i18n.js`

**Problem:** `data-i18n="some_key"` attributes are sprinkled across all HTML files. When a developer renames a key in `i18n.js`, stale references silently fall back to showing the literal key on screen. There is currently **no automated check**.

**Acceptance:**
1. New script `tools/validate-i18n.js` (Node, no deps beyond `fs` and built-in `path`).
2. Script scans every `*.html` file under repo root and `pages/`, extracts every `data-i18n="..."` value.
3. Script loads `i18n.js` (it sets a global `i18n` — load via `require` won't work directly; either parse the file with regex for top-level keys, or wrap evaluation in a sandboxed `vm.runInNewContext`).
4. For each extracted key, verify it exists in `i18n.de` AND `i18n.en`.
5. Exit code 0 if all keys present in both languages; exit code 1 with a human-readable list of missing keys otherwise.
6. Add an npm script entry: `"validate:i18n": "node tools/validate-i18n.js"` in `package.json`.
7. Document in `README.md` under a new "Development" section: "Run `npm run validate:i18n` before opening a PR that changes translation keys."

**Don't:** Set up Husky / pre-commit hooks. The user prefers manual scripts.

**Files to touch:** `tools/validate-i18n.js` (create), `package.json` (add script entry), `README.md` (add doc).

---

## Item 4 — Service worker cache list update

**Problem:** `sw.js` lines 2-34 list `ASSETS` to pre-cache on install. Several files added in recent commits are missing:

```
js/side-stats.js
js/sustainability.js
js/sustainability-ui.js
data/sustainability.js   (verify path — may be data/sustainability.json or similar)
category-template.js
robots.txt
sitemap.xml
```

**Acceptance:**
1. Every file referenced via `<script src="...">` or `<link href="...">` in any HTML page is in `ASSETS`.
2. `CACHE_VERSION` bumps from `sfc-v1` to `sfc-v2` so existing PWAs install a fresh cache.
3. Old `sfc-v1` cache is purged in the `activate` handler (read existing handler — likely already does this, but verify).
4. Manual test: load app offline (DevTools → Application → Service Workers → Offline), reload. All pages render. No 404s in Network tab.

**Files to touch:** `sw.js`.

**Caveat:** Watch out for paths. Existing entries use leading `/` (e.g. `/styles.css`) — match that style. Verify each new path actually exists in the repo before adding it (e.g. `data/sustainability.js` may actually be `data/sustainability-data.js` — check first with `Glob "data/*"`).

---

## Workflow

1. Create branch: `git checkout -b chore/audit-followups`
2. Each item gets its own commit. Commit messages:
   - `refactor(side-stats): inject side-boxes from JS to remove HTML duplication`
   - `refactor(ingredients): scope allIngredients into Ingredients namespace`
   - `chore(tools): add validate-i18n script`
   - `chore(sw): update cache manifest and bump version`
3. After all four commits, push and open a PR with a checklist linking each commit to its acceptance criteria.

If any item turns out to be more than ~200 lines of churn, stop and report back instead of forcing it.
