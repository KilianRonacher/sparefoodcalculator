# Code Structure Overview

A simple guide to understanding and editing the SpareFoodCalculator codebase.

## File Organization

```
spare-food-calculator/
├── server/
│   ├── index.html        (Start page, canonical entry point)
│   └── index.js          (Optional Node.js server for uploads/recipes)
├── pages/                (Category & generator pages)
│   ├── search.html       (Ingredient generator — main workflow)
│   ├── salat.html        (Category: Salads)
│   ├── suppen.html       (Category: Soups)
│   └── ... (other category pages)
├── app.js                (Main application logic)
├── i18n.js               (Multi-language support: DE & EN)
├── styles.css            (Styling & themes)
└── index.html            (Redirects to server/index.html)
```

## Key Concepts

### 1. Recipe Database (`app.js`)

- **Data Storage**: `recipes` array contains all recipes (title, category, ingredients, steps).
- **Local Storage**: Users' custom recipes are stored in `localStorage['sfc_recipes']`.
- **Categories**: salat, suppen, vorspeisen, rind, schwein, haendl, fisch, dessert, kuchen, saucen, oele, gewuerze.

### 2. Matching Algorithm

- **Fuzzy Matching**: Uses **Levenshtein distance** to match user input to recipe ingredients.
- **Normalization**: Removes diacritics (ä → a) and applies simple stemming.
- **Aliases**: Maps ingredient variants (tomato/tomate) to a canonical form.
- **Scoring**: Recipes are ranked by match percentage (0–100%).

### 3. UI Components

- **Modal**: Recipe details displayed in a modal dialog.
- **Dark Mode**: Toggle via `localStorage['sfc_theme']` (light/dark).
- **Language Toggle**: Switch between Deutsch (DE) and English (EN) via `localStorage['sfc_lang']`.
- **Mobile Navigation**: Hamburger menu on small screens.

### 4. Categories Modal

- Accessible via the Categories button (desktop nav).
- Dynamically generated from the `categoryMapping` object in `setupCategoriesButton()`.
- Links adapt based on page location (root vs. `pages/` folder).

## `app.js` Structure

The file is organized into clear sections with comments:

```javascript
// ==================== DATA ====================
// Recipe definitions, aliases, ingredient mappings

// ==================== MATCHING & SEARCH ====================
// Fuzzy matching, Levenshtein distance, scoring

// ==================== UI & MODALS ====================
// Display search results, show recipe details, modal control

// ==================== STORAGE & PERSISTENCE ====================
// Load/save recipes to localStorage, import/export

// ==================== CATEGORY & NAVIGATION ====================
// Category search, synonym expansion

// ==================== THEME & LANGUAGE ====================
// Dark mode toggle, language switcher

// ==================== MOBILE & CATEGORIES ====================
// Mobile nav, category modal

// ==================== INITIALIZATION ====================
// DOMContentLoaded event handler, component setup
```

## How to Edit

### Add a New Recipe

1. Open `app.js`
2. Find the `const recipes = [...]` array
3. Add a new recipe object:

```javascript
{
  id: 20,
  title: 'My Recipe',
  category: 'salat',
  difficulty: 'einfach',
  ingredients: ['tomate', 'salat', 'öl'],
  steps: ['Step 1', 'Step 2']
}
```

### Add a Translation

1. Open `i18n.js`
2. Find the relevant language dictionary (`i18n['de']` or `i18n['en']`)
3. Add a key-value pair:

```javascript
i18n['de']['my_key'] = 'Mein Wert';
i18n['en']['my_key'] = 'My value';
```

4. Use in HTML with `data-i18n="my_key"`

### Add a New Category

1. Add a new category HTML file in `pages/` (e.g., `pages/mein-rezept.html`)
2. Include the standard header with toggles (copy from an existing category page)
3. Add the category to `categoryMapping` in `setupCategoriesButton()`:

```javascript
mein_rezept: { href: `${pagesPrefix}mein-rezept.html`, icon: '🎨' }
```

4. Add translations to `i18n.js`:

```javascript
i18n['de']['mein_rezept'] = 'Mein Rezept';
i18n['en']['mein_rezept'] = 'My Recipe';
```

### Adjust Theme Colors

Open `styles.css` and modify the CSS variables:

```css
:root {
  --color-background: #fff7fb;
  --color-accent-red: #ff6b6b;
  --color-text-primary: #1b1b1b;
}
```

## Testing

Run the headless theme/language test:

```bash
node tools/check_theme_lang.js
```

This verifies that dark mode and language toggles work on all pages.

## Key Functions

| Function | Purpose |
|----------|---------|
| `findMatchingRecipes(ingredients)` | Main matching engine |
| `displaySearchResults(recipes)` | Render search results |
| `setupThemeToggle()` | Dark mode toggle |
| `setupLanguageToggle()` | Language switch |
| `setupCategoriesButton()` | Category modal |
| `initializeCategorySearch()` | Filter recipes on category pages |

## Notes

- **No Admin Pages**: Admin functionality was removed to simplify the codebase. If you need recipe import/export, add a dedicated module.
- **Localization**: All UI text uses `data-i18n` attributes and is managed in `i18n.js`.
- **Responsive Design**: Uses CSS grid and flexbox for mobile/desktop adaptation.
- **Persistence**: All user settings and custom recipes are stored in browser `localStorage`.

## Questions?

Refer to the code comments in `app.js`, `i18n.js`, and `styles.css` for detailed explanations of individual functions and logic.
