# SFC Endabnahme – Verifikation, Fehleranalyse und Verbesserungen Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den implementierten SFC-Mengen-/Personen-Skalierungs-Stack systematisch verifizieren, sämtliche aufgedeckten Bugs/UX/a11y/Perf/SEO/i18n/SW-Mängel beheben und die Site in einen abgabefertigen Zustand für die Facharbeit überführen.

**Architecture:** Vanilla JS Multi-Page App mit Service Worker (cache-first), zentralem `Quantities`-IIFE in `js/quantities.js`, modal-basiertem Rezept-Detail-Render in `recipes.js`, i18n-Tabelle in `i18n.js` (DE/EN) und `category-template.js`, das via `document.write` die Kategorie-Seitenstruktur synchron injiziert. 406 Rezepte mit `quantities`-Feldern.

**Tech Stack:** Plain HTML5 + CSS3 + ES5/ES2015 Vanilla JS, Service Worker (sfc-v3), node-Tools (validate-i18n.js, extract-quantities.js), keine Build-Pipeline.

**Projektpfad:** `C:\Users\Kilian\Facharbeit\Facharbeit\spare-food-calculator`

---

## Vorab-Befundliste (aus statischer Code-Inspektion)

Diese Bugs/Schwachstellen wurden bereits bei der Vorab-Analyse aufgedeckt und werden in den Tasks unten konkret adressiert:

1. **Doppelte HTML-`id`-Vergabe pro Modal-Open.** `recipes.js:1581` setzt `servingsLabel.id = 'sfc-servings-label'`. Beim mehrfachen Öffnen verschiedener Rezepte wird derselbe DOM-Knoten zwar ersetzt, aber `aria-labelledby="sfc-servings-label"` referenziert global – akzeptabel, solange Modal pro Zeit nur ein Stepper enthält.
2. **Memory-Leak / Mehrfach-Listener.** `recipes.js:1711` registriert pro Modal-Open einen `'sfc:servingsChanged'`-Listener auf `document` und einen `'languageChanged'`-Listener auf `window`. Die werden NIE entfernt → bei jedem Rezept-Klick wächst die Listener-Liste. Re-Renders werden N-mal ausgeführt.
3. **Hardcodierte deutsch/englische Strings statt i18n-Keys.** Im Render-Pfad werden ad-hoc-Übersetzungen verwendet (`'Mengen in den Schritten…'`, `'Mindestmenge'`, `'Eine Person weniger'`, `'Servings'/'Personen'`, `'Quantities missing'`), obwohl die i18n-Keys (`recipe_steps_for_4_note`, `recipe_servings_label`, `recipe_quantities_missing`, `recipe_servings_dec_aria`, `recipe_servings_inc_aria`) existieren.
4. **Fehlender i18n-Key für „Mindestmenge".** Es gibt keinen `recipe_min_quantity_note`-Key.
5. **Stepper-Buttons haben keinen `aria-controls`-Bezug** zur Mengenliste, wodurch Screenreader den Zusammenhang nicht erkennen.
6. **`servings_base` wird einmalig gelesen, beim Wechsel der Rezeptdaten aber nicht zurückgesetzt** – pro Modal-Render OK, aber `currentServings` wird aus `getDefaultServings()` gelesen (gewollt globaler State; Akzeptanz prüfen).
7. **Service Worker `sw.js` cached zwar `/js/quantities.js`, aber NICHT `/category-template.js` als Cache-Entry**, doch SIEHT die Datei korrekt im ASSETS-Array → manuell verifizieren. (Aktuell: ja, vorhanden.) **Kein `cache.put` Schutz für opaque/redirect-Responses** im fetch-Handler – kann fehlerhafte 404-Antworten cachen.
8. **`document.write` in `category-template.js`.** Funktioniert dank synchronem `<script>`-Tag, aber:
   - Lighthouse zieht hierfür Punkte ab.
   - Bei langsamer 3G blockiert es das Parsing.
   - Im Offline-/SW-Kontext führt jeder `document.write`-Aufruf nach `DOMContentLoaded` zum Wipe der Seite (hier vermieden, aber fragil).
9. **Keine Pytest-Suite – Projekt ist JS, also Pytest nicht relevant.** Stattdessen sollen Node-basierte Tests (mocha/jest oder Plain-Node-Asserts) in `tests/` existieren. Nur `sustainability.test.js` ist vorhanden.
10. **`recipes.js` ist 1940 Zeilen** (≫ 500-Zeilen-Richtlinie aus CLAUDE.md). Splitten ist aber riskant kurz vor Abgabe – wird vermerkt, NICHT umgesetzt (nur `displayRecipeDetails` extraktion erlaubt).
11. **Header/HTML-Inkonsistenz `index.html`.** Doppelte CTA – „Calculator"-Button erscheint sowohl in der Nav (Line 258) als auch außerhalb der Nav (Line 266). Letzterer ist nicht in `nav` – semantisch problematisch und visuell doppelt.
12. **`og:image` zeigt auf `hero-image.png`, gecached wird `hero-image.webp`.** Inkonsistenz Sharing-Card vs. Asset.
13. **`pages/search.html` lang="de"`** auch in i18n-EN-Modus → `<html lang>` wird nicht mit `setLang` synchronisiert. SEO/a11y-Mangel.
14. **Sitemap und robots.txt prüfen** auf Stand.
15. **Kein dunkles Theme auf Startseite (`index.html` zwingt `light`)** – Inkonsistenz.
16. **Touch-Target-Größe der Stepper-Buttons** ist `2rem × 2rem` = 32px → unter den 44px WCAG/Apple-Empfehlung.
17. **`languageChanged`-Listener in `loadCategoryRecipes`** (recipes.js:1937) wird bei jedem Aufruf hinzugefügt → pro Rerender ein neuer Listener.

---

## File Structure (welche Dateien werden berührt)

| Datei | Zweck | Änderungstyp |
|---|---|---|
| `js/quantities.js` | Mengen-API | Mini-Patch (1 i18n-Key-Lookup hinzufügen) |
| `recipes.js` | Modal-Render, Stepper, Quantities-Liste | Hauptänderungen: Listener-Cleanup, i18n-Keys, a11y |
| `i18n.js` | Übersetzungstabelle | Neue Keys: `recipe_min_quantity_note`, evtl. `recipe_no_recipes_found_in_category` |
| `sw.js` | Cache | Bump `CACHE_VERSION` → `sfc-v4`, fetch-Handler härten (nur 200-Responses cachen) |
| `styles.css` | Stepper-Größen, Touch-Targets | Min 44 × 44px, Hover-States, Focus-Visible |
| `index.html` | Doppel-CTA entfernen, og:image fixen | Strukturelle Korrektur |
| `pages/*.html` | `<html lang>` wird mit JS gesynced | Min-Patch via i18n.js |
| `i18n.js` (setLang-Funktion) | `document.documentElement.lang` updaten | 1 Zeile |
| `tools/validate-i18n.js` | unverändert | Nur Lauf zur Verifikation |
| `tests/quantities.test.js` | NEU – Pytest-Äquivalent in Node | Node Assert-Tests |
| `README.md` | Dokumentation der finalen Features | Update |
| `TASK.md` | Task-Tracking | NEU/Update |

---

## Phase 1 – VERIFIKATION (Tasks 1–6)

### Task 1: Smoke-Test der i18n-Pipeline und Quantities-Selftest

**Files:**
- Read: `tools/validate-i18n.js`
- Read: `js/quantities.js`
- Test: Browser-DevTools-Console nach Laden von `index.html`

- [ ] **Step 1: Lauf `npm run validate:i18n`**

```bash
cd C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator
npm run validate:i18n
```
Expected: Exit 0, keine fehlenden Keys.

- [ ] **Step 2: Statische Server starten (Python 3)**

```bash
cd C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator
python -m http.server 5500
```
Expected: Server läuft auf http://localhost:5500.

- [ ] **Step 3: Im Browser `http://localhost:5500/` öffnen, DevTools-Console prüfen**

Erwartet: Zeile `[Quantities] All self-tests passed.` und KEINE roten `console.assert`-Fehler.

- [ ] **Step 4: Befunde notieren**

Wenn ein Selftest scheitert: Bug in `js/quantities.js` reparieren, Test wiederholen, dann commit.

- [ ] **Step 5: Commit (nur falls Anpassungen nötig)**

```bash
git add js/quantities.js
git commit -m "fix(quantities): repair self-test X"
```

### Task 2: Verifikation des Stepper-/Quantities-Renderings im Modal

**Files:**
- Test in Browser: `pages/rind.html` → ein Rezept öffnen

- [ ] **Step 1: Kategorieseite öffnen**

URL: `http://localhost:5500/pages/rind.html`. Erwartet: 9+ Rezeptkarten erscheinen, keine JS-Fehler in Console.

- [ ] **Step 2: Rezept öffnen**

Klick auf erste Karte → Modal öffnet sich. Erwartet sichtbar:
- `Personen [-] [4] [+]` Stepper.
- Liste mit gerenderten Mengen (`200 g Brot`, `4 Tomate`, `nach Geschmack` etc.).
- Hinweis-Text „Mengen in den Schritten sind für 4 Personen geschrieben".
- „Zubereitung:" + nummerierte Schritte.

- [ ] **Step 3: Stepper-Funktionstest**

Klick auf [+] → Counter zeigt `5`, Mengen ändern sich (z.B. `200 g → 250 g`). Klick auf [-] auf 1 → Mengen ändern sich, `1 Zehe Knoblauch` etc., Mindestmenge-Hinweis erscheint bei countable units, deren rohe Skalierung < 1.

- [ ] **Step 4: Sprachtest**

Im offenen Modal Sprache auf EN umstellen → Mengen + Hinweistext + Stepper-Label übersetzt. Erwartet: KEINE deutschen Wörter mehr in der Mengenliste.

- [ ] **Step 5: Persistenz-Test**

Modal schließen, anderes Rezept öffnen → Stepper steht weiterhin auf zuletzt gewähltem Wert (localStorage `sfc_default_servings`).

- [ ] **Step 6: Browser-Reload-Test**

Seite neu laden, Rezept öffnen → Stepper-Wert bleibt erhalten.

- [ ] **Step 7: Befunde dokumentieren**

Pro Bug 1 Bullet in `TASK.md` unter „Discovered During Work" (z.B. „Stepper-Aria-Label nicht übersetzt", „Hinweis-Text nicht aus i18n-Key").

### Task 3: Service-Worker-Cache & Offline-Fallback prüfen

**Files:**
- Test in DevTools → Application → Service Workers

- [ ] **Step 1: Service Worker registrieren**

Prüfen, ob in `index.html` / `app.js` der SW aktuell registriert wird:

```bash
grep -n "serviceWorker" C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator/app.js C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator/index.html
```

Wenn keine `navigator.serviceWorker.register('/sw.js')` Zeile existiert → BUG: SW wird nie geladen!

- [ ] **Step 2: Cache-Inhalt prüfen**

DevTools → Application → Cache Storage → `sfc-v3`. Erwartet: alle 39 Einträge aus `sw.js:ASSETS` enthalten + `/js/quantities.js`.

- [ ] **Step 3: Offline-Test**

DevTools → Network → Offline. Reload `pages/rind.html`. Erwartet: Seite lädt, Rezeptliste erscheint, Modal funktioniert.

- [ ] **Step 4: Cache-Bust-Test**

`CACHE_VERSION` in `sw.js` von `sfc-v3` auf `sfc-v4` bumpen, hard reload, Application-Tab → alter Cache `sfc-v3` muss gelöscht sein.

- [ ] **Step 5: Befund: SW-Registrierung-Status festhalten**

Falls SW nicht registriert ist → in Task 11 fixen.

### Task 4: i18n-Vollständigkeitsprüfung

**Files:**
- Read: `i18n.js`
- Run: `tools/validate-i18n.js`

- [ ] **Step 1: Run validate-i18n**

```bash
cd C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator
node tools/validate-i18n.js
```
Expected: Exit 0.

- [ ] **Step 2: Manuelle Suche nach hardcodierten Strings im Render-Pfad**

```bash
grep -n "'Personen'\|'Servings'\|'Eine Person'\|'One fewer'\|'Mindestmenge'\|'minimum quantity'\|'Mengen in den Schritten'\|'Quantities in the steps'\|'Mengenangaben fehlen'\|'Quantities missing'" C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator/recipes.js
```
Erwartung: 0 Treffer (sollte alles über i18n laufen). REAL: 7+ Treffer → Bugs in Task 8.

- [ ] **Step 3: Suche nach `data-i18n` ohne i18n-Eintrag**

`tools/validate-i18n.js` deckt das ab → verlassen wir uns drauf.

- [ ] **Step 4: Befund festhalten**

In `TASK.md`: „i18n-Hardcodes in recipes.js Modal" → Task 8.

### Task 5: Daten-Integrität der `quantities`-Felder

**Files:**
- `recipes.js` (Datenarray)
- `tools/extract-quantities.js`

- [ ] **Step 1: Anzahl Rezepte vs. Anzahl `quantities`-Blöcke**

```bash
cd C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator
node -e "var s=require('fs').readFileSync('recipes.js','utf8'); console.log('ids:',(s.match(/\bid:\s*\d+/g)||[]).length, 'quantities:',(s.match(/quantities:\s*\{/g)||[]).length);"
```
Expected: `ids: 406 quantities: 406`.

- [ ] **Step 2: Konsistenz-Check `quantities`-Keys ⊂ `ingredients`**

Skript:
```bash
node -e "
var fs=require('fs');
eval(fs.readFileSync('recipes.js','utf8').replace(/^const recipes/,'global.recipes'));
var bad=[];
recipes.forEach(function(r){
  if(!r.quantities) return;
  Object.keys(r.quantities).forEach(function(k){
    if(r.ingredients.indexOf(k)===-1) bad.push(r.id+': '+k);
  });
});
console.log(bad.length?bad.join('\n'):'OK');
"
```
Expected: `OK`.

- [ ] **Step 3: Falls Bug → Datenkorrektur**

Pro Verstoß: Schlüssel im `quantities`-Objekt umbenennen oder Zutat zu `ingredients` ergänzen.

- [ ] **Step 4: Run `tools/extract-quantities.js`**

```bash
node tools/extract-quantities.js
```
Expected: Exit 0.

- [ ] **Step 5: Commit (falls Daten korrigiert wurden)**

```bash
git add recipes.js
git commit -m "fix(data): align quantities keys with ingredients"
```

### Task 6: a11y-Audit (Screenreader, Tastatur, Kontraste)

**Files:**
- Browser: Lighthouse CI / axe DevTools

- [ ] **Step 1: Lighthouse a11y im Inkognito laufen lassen**

DevTools → Lighthouse → Mobile, Accessibility-Kategorie. Notiere Score.

- [ ] **Step 2: Tastatur-Navigation-Test**

`Tab` durch Modal: Schließen-Button → Stepper [-] → Output → [+] → Mengenliste → Schritte. Kein Element darf übersprungen werden, Focus muss sichtbar sein.

- [ ] **Step 3: Stepper-aria-Label-Sprachtest**

Sprache auf EN. Inspect [-]-Button → `aria-label` muss `"One fewer serving"` sein, nicht `"Eine Person weniger"`. Bug-Liste füllen.

- [ ] **Step 4: Touch-Target-Größe messen**

DevTools → Stepper-Button selektieren → Computed: width + height. Bei < 44px → BUG (Task 12).

- [ ] **Step 5: Befunde in TASK.md sammeln**

Z.B.: „Stepper aria-label nicht übersetzt", „Touch-Target 32px statt 44px".

---

## Phase 2 – FEHLERANALYSE (Tasks 7)

### Task 7: Vollständiger Site-Audit (UX, Perf, SEO, Mobile, JS-Errors)

**Files:**
- Alle Seiten in Browser, DevTools Console + Network + Lighthouse

- [ ] **Step 1: Console-Error-Sweep**

Reihum öffnen: `index.html`, `pages/search.html`, `pages/rind.html`, `pages/dessert.html`, `pages/ingredients-catalog.html`, `pages/contact.html`, `pages/impressum.html`. Pro Seite Console auf rote Fehler scannen, in `TASK.md` eintragen.

- [ ] **Step 2: Network-Audit**

Pro Seite: 404? falsche MIME? Bilder die nicht in WebP geliefert werden? `og:image` referenziert `hero-image.png` aber Cache hat nur `hero-image.webp` → BUG.

- [ ] **Step 3: Lighthouse-Audit (Mobile)**

Pro Seite Lighthouse → Performance, Accessibility, Best Practices, SEO. Werte unter 90 dokumentieren.

- [ ] **Step 4: SEO-Sweep**

Pro Seite prüfen:
- `<title>` vorhanden, < 60 Zeichen
- `<meta description>` vorhanden, < 160 Zeichen
- `canonical` korrekt
- `og:image` referenziert existierende Datei (.webp – nicht .png)
- `<html lang>` aktuell zur Sprache
- `sitemap.xml` enthält Seite

- [ ] **Step 5: Mobile-Test**

DevTools → Device Mode → iPhone SE (375 × 667). Pro Seite prüfen: kein horizontales Scrollen, alle Buttons ≥ 44 × 44, Modal scrollbar.

- [ ] **Step 6: i18n-Live-Test**

Sprache toggeln auf jeder Seite. Welche Texte bleiben deutsch trotz EN-Modus? Liste füllen.

- [ ] **Step 7: Caching/Reload-Test**

Hard reload mit gedrückter Shift-Taste. SW-Cache gelöscht? Neue Version geladen? `localStorage` Werte beibehalten?

- [ ] **Step 8: Befund-Konsolidierung**

Alle gefundenen Bugs nach Schweregrad sortieren:
1. **Blocker:** Function-broken, JS-Errors, fehlender SW, kaputtes Modal.
2. **Major:** Hardcoded i18n, Memory-Leaks, Touch-Targets.
3. **Minor:** Doppelte CTA, og:image-Mismatch, lang-Sync.
4. **Cosmetic:** Fehlende Hover-Animationen.

In `TASK.md` als priorisierte Liste eintragen.

---

## Phase 3 – VERBESSERUNGEN (Tasks 8–17)

### Task 8: i18n-Hardcodes in `recipes.js` ersetzen + neuen Key

**Files:**
- Modify: `recipes.js:1582-1683`
- Modify: `i18n.js` (neuer Key `recipe_min_quantity_note`)

- [ ] **Step 1: Test schreiben (manueller QA-Check)**

Erstelle `tests/i18n-render.checklist.md` mit allen Stellen, die übersetzt sein müssen.

- [ ] **Step 2: i18n-Key hinzufügen**

In `i18n.js` direkt nach Zeile 387:
```js
i18n['de']['recipe_min_quantity_note'] = 'Mindestmenge';
i18n['en']['recipe_min_quantity_note'] = 'minimum quantity';
```

- [ ] **Step 3: `recipes.js` umbauen – Helper definieren**

Direkt vor `displayRecipeDetails` (Zeile 1537) hinzufügen:
```js
function _t(key, lang, fallback) {
  if (typeof i18n !== 'undefined' && i18n[lang] && i18n[lang][key] !== undefined) return i18n[lang][key];
  if (typeof i18n !== 'undefined' && i18n['de'] && i18n['de'][key] !== undefined) return i18n['de'][key];
  return fallback || key;
}
```

- [ ] **Step 4: Hardcodes ersetzen**

In `recipes.js:1583`:
```js
servingsLabel.textContent = _t('recipe_servings_label', lang, 'Personen');
```
In `1589`:
```js
decBtn.setAttribute('aria-label', _t('recipe_servings_dec_aria', lang, 'Eine Person weniger'));
```
In `1601`:
```js
incBtn.setAttribute('aria-label', _t('recipe_servings_inc_aria', lang, 'Eine Person mehr'));
```
In `1649`:
```js
footnote.textContent = ' (' + _t('recipe_min_quantity_note', currentLang, 'Mindestmenge') + ')';
```
In `1661-1663`:
```js
noteP.textContent = _t('recipe_steps_for_4_note', currentLang, 'Mengen in den Schritten sind für 4 Personen geschrieben');
```
In `1679`:
```js
missingP.textContent = _t('recipe_quantities_missing', currentLang, 'Mengenangaben fehlen');
```

- [ ] **Step 5: Validate-i18n-Lauf**

```bash
node tools/validate-i18n.js
```
Expected: Exit 0.

- [ ] **Step 6: Manuelle Verifikation im Browser**

DE → EN umschalten im offenen Modal → alle Texte wechseln.

- [ ] **Step 7: Commit**

```bash
git add recipes.js i18n.js
git commit -m "refactor(modal): use i18n keys for stepper + quantity texts"
```

### Task 9: Memory-Leak: Listener pro Modal-Open beheben

**Files:**
- Modify: `recipes.js:1704-1717` (servingsHandler + languageChanged)

- [ ] **Step 1: Bestehende Listener-Variablen-Felder identifizieren**

Aktuell werden `servingsHandler` und ein anonymer `languageChanged`-Handler pro Aufruf von `displayRecipeDetails` registriert, aber nie entfernt.

- [ ] **Step 2: Globale Handler-Referenzen einführen**

In `recipes.js` direkt vor `displayRecipeDetails`:
```js
// Handler-Referenzen für sauberes Cleanup beim Schließen des Modals
window._sfcModalServingsHandler = null;
window._sfcModalLangHandler = null;
```

- [ ] **Step 3: Im Modal-Open Handler zuweisen + alte entfernen**

In `recipes.js:1704` (vor `var servingsHandler`):
```js
// Vorherigen Handler entfernen, falls vorhanden
if (window._sfcModalServingsHandler) {
  document.removeEventListener('sfc:servingsChanged', window._sfcModalServingsHandler);
}
if (window._sfcModalLangHandler) {
  window.removeEventListener('languageChanged', window._sfcModalLangHandler);
}

window._sfcModalServingsHandler = function(e) {
  var n = e.detail && e.detail.servings;
  if (n) {
    countOutput.textContent = String(n);
    renderQuantities(n);
  }
};
document.addEventListener('sfc:servingsChanged', window._sfcModalServingsHandler);

window._sfcModalLangHandler = function() {
  var n = parseInt(countOutput.textContent, 10) || 4;
  renderQuantities(n);
};
window.addEventListener('languageChanged', window._sfcModalLangHandler);
```
(Ersetzt die alten Zeilen 1704–1717.)

- [ ] **Step 4: Cleanup im `closeRecipeModal`**

In `closeRecipeModal` (Suche per grep, ca. Zeile 1820+) ergänzen:
```js
if (window._sfcModalServingsHandler) {
  document.removeEventListener('sfc:servingsChanged', window._sfcModalServingsHandler);
  window._sfcModalServingsHandler = null;
}
if (window._sfcModalLangHandler) {
  window.removeEventListener('languageChanged', window._sfcModalLangHandler);
  window._sfcModalLangHandler = null;
}
```

- [ ] **Step 5: Manueller Test**

In DevTools → `getEventListeners(document)['sfc:servingsChanged'].length`. Modal 5x öffnen + schließen → Wert bleibt 0–1, nicht 5.

- [ ] **Step 6: Commit**

```bash
git add recipes.js
git commit -m "fix(modal): cleanup event listeners on close to prevent leak"
```

### Task 10: Listener-Leak in `loadCategoryRecipes`

**Files:**
- Modify: `recipes.js:1937` (`window.addEventListener('languageChanged', function() { loadCategoryRecipes(...)`)

- [ ] **Step 1: Identifizierung**

Zeile 1937 fügt bei jedem Aufruf von `loadCategoryRecipes` einen weiteren Listener hinzu → bei Sprachwechsel werden N Re-Renders ausgeführt.

- [ ] **Step 2: Patch**

Vor `loadCategoryRecipes` (Zeile 1865) einfügen:
```js
var _sfcCategoryLangHandler = null;
```
Im Body, am Ende, ersetzen:
```js
// Vorherigen Listener entfernen
if (_sfcCategoryLangHandler) {
  window.removeEventListener('languageChanged', _sfcCategoryLangHandler);
}
_sfcCategoryLangHandler = function() {
  loadCategoryRecipes(categoryName);
};
window.addEventListener('languageChanged', _sfcCategoryLangHandler);
```

- [ ] **Step 3: Verifikation**

DevTools: 5x Sprache toggeln → Console zeigt nicht 32 (2^5) Re-Renders, sondern 5.

- [ ] **Step 4: Commit**

```bash
git add recipes.js
git commit -m "fix(category): replace duplicated language listener instead of stacking"
```

### Task 11: Service Worker registrieren + Cache-Härtung + Bump

**Files:**
- Check: `app.js` ob SW dort registriert wird
- Modify: `sw.js` (Cache-Version bump, fetch hardening)
- Modify: `app.js` (falls SW nicht registriert wird) ODER `index.html` Footer-Script

- [ ] **Step 1: Aktuelle Registrierung prüfen**

```bash
grep -n "serviceWorker\.register" C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator/*.js C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator/*.html
```
Falls 0 Treffer → SW wird NIE geladen → Add registration.

- [ ] **Step 2: SW-Registration hinzufügen (falls fehlt)**

In `app.js` (Ende):
```js
// Service Worker registrieren (nur in Production: localhost erlaubt)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      console.log('[SW] registered, scope:', reg.scope);
    }).catch(function(err) {
      console.warn('[SW] registration failed:', err);
    });
  });
}
```

- [ ] **Step 3: `sw.js` – Cache-Version bumpen**

In `sw.js:1`:
```js
const CACHE_VERSION = 'sfc-v4';
```

- [ ] **Step 4: Fetch-Handler härten**

In `sw.js:74` (innerhalb `fetch.then`):
```js
// NUR 200-Responses cachen (kein 4xx, kein opaque)
if (response.ok && response.status === 200 && event.request.method === 'GET' && response.type === 'basic') {
  var clone = response.clone();
  caches.open(CACHE_VERSION).then(function(cache) {
    cache.put(event.request, clone);
  });
}
```

- [ ] **Step 5: ASSETS-Liste auf Vollständigkeit prüfen**

Sicherstellen, dass `/category-template.js` enthalten ist – aktuell drin. Auch `/data/sustainability.js`, `/js/sustainability.js`, `/js/sustainability-ui.js` – drin.

- [ ] **Step 6: Test**

Hard reload, Application-Tab → Cache `sfc-v4` exists, `sfc-v3` gone. Offline-Test → alle Seiten laden.

- [ ] **Step 7: Commit**

```bash
git add sw.js app.js
git commit -m "chore(sw): bump to v4, harden fetch, ensure registration"
```

### Task 12: Touch-Target-Größe Stepper-Buttons

**Files:**
- Modify: `styles.css:806-822`

- [ ] **Step 1: CSS anpassen**

Ersetze `styles.css:806-822`:
```css
.sfc-servings-dec,
.sfc-servings-inc {
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: 1px solid var(--color-border, #ccc);
  border-radius: 8px;
  background: var(--color-surface, #fff);
  color: var(--color-text, #333);
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.1s;
  line-height: 1;
}

.sfc-servings-dec:focus-visible,
.sfc-servings-inc:focus-visible {
  outline: 2px solid var(--color-accent-teal, #4ecdc4);
  outline-offset: 2px;
}

.sfc-servings-dec:active,
.sfc-servings-inc:active {
  transform: scale(0.95);
}
```

- [ ] **Step 2: Test im DevTools-Mobile-Mode**

Stepper anclicken → ≥ 44 × 44, Focus-Ring sichtbar mit Tab.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "fix(a11y): stepper buttons meet 44px touch target + focus-visible"
```

### Task 13: `<html lang>` mit Sprachwechsel synchronisieren

**Files:**
- Modify: `i18n.js:972` Bereich (setLang dispatch)

- [ ] **Step 1: setLang-Funktion lokalisieren**

```bash
grep -n "function setLang\|languageChanged" C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator/i18n.js
```

- [ ] **Step 2: `documentElement.lang` setzen**

Direkt vor dem `dispatchEvent('languageChanged')` (Zeile 972) einfügen:
```js
if (document && document.documentElement) {
  document.documentElement.lang = targetLanguage;
}
```

- [ ] **Step 3: Test**

Sprache toggeln → DevTools Inspector → `<html lang="en">` bzw. `<html lang="de">`.

- [ ] **Step 4: Commit**

```bash
git add i18n.js
git commit -m "fix(i18n): sync <html lang> with active language"
```

### Task 14: `index.html` Doppel-CTA + og:image fixen

**Files:**
- Modify: `index.html:266` (entferne nicht-`nav`-CTA)
- Modify: `index.html:12-18` (og:image .png → .webp)

- [ ] **Step 1: Doppel-CTA entfernen**

Lösche Zeile `index.html:266`:
```html
<a href="pages/search.html" class="btn primary header-cta" data-i18n="calculator">Calculator</a>
```
(Bleibt das `<a class="cta">` innerhalb der `<nav>`.)

- [ ] **Step 2: og:image korrigieren**

Ersetze in `index.html:12, 18`:
```html
<meta property="og:image" content="https://sparefoodcalculator.com/images/hero-image.webp" />
...
<meta name="twitter:image" content="https://sparefoodcalculator.com/images/hero-image.webp" />
```
Gleiche Korrektur in allen Seiten unter `pages/`:
```bash
grep -l "hero-image.png" C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator/pages/
```
Pro Treffer: `.png` → `.webp`.

- [ ] **Step 3: Visueller Test**

Index laden → CTAs jetzt nur noch in der Nav + zentralem Hero. Keine Duplikate.

- [ ] **Step 4: Commit**

```bash
git add index.html pages/*.html
git commit -m "fix(seo): correct og:image to .webp + remove duplicate CTA"
```

### Task 15: Stepper-aria-controls + minor a11y-Polish

**Files:**
- Modify: `recipes.js:1586-1604` (Stepper-Buttons)
- Modify: `recipes.js:1608-1610` (Quantities-Container ID)

- [ ] **Step 1: Quantities-Container deterministische ID geben**

In `recipes.js:1609`:
```js
quantitiesContainer.className = 'sfc-quantities-container';
quantitiesContainer.id = 'sfc-quantities-list-' + (selectedRecipe.id || 'x');
```

- [ ] **Step 2: aria-controls auf Stepper-Buttons setzen**

Direkt nach `decBtn.setAttribute('aria-label', …)` und `incBtn.setAttribute('aria-label', …)`:
```js
decBtn.setAttribute('aria-controls', 'sfc-quantities-list-' + (selectedRecipe.id || 'x'));
incBtn.setAttribute('aria-controls', 'sfc-quantities-list-' + (selectedRecipe.id || 'x'));
```

- [ ] **Step 3: Test mit Screenreader-Simulation**

DevTools → Accessibility-Tab → Stepper-Button auswählen → „Controls: sfc-quantities-list-…" sichtbar.

- [ ] **Step 4: Commit**

```bash
git add recipes.js
git commit -m "feat(a11y): aria-controls links stepper to quantities list"
```

### Task 16: Node-Tests für `quantities.js` API anlegen

**Files:**
- Create: `tests/quantities.test.js`

- [ ] **Step 1: Testdatei erstellen**

`tests/quantities.test.js`:
```js
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

// Lade i18n + quantities in Sandbox
const ctx = vm.createContext({ console, document: { dispatchEvent(){}, addEventListener(){} }, localStorage: { getItem(){return null;}, setItem(){} }, CustomEvent: function(){} });
vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../i18n.js'),'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../js/quantities.js'),'utf8'), ctx);
const Q = ctx.Quantities;

// Expected use
assert.strictEqual(Q.scale({amount:200,unit:'g'},8,4).amount, 400, 'scale linear');
// Edge: pinch never scales
assert.strictEqual(Q.scale({amount:1,unit:'pinch'},8,4).amount, 1, 'pinch unscaled');
// Failure: null amount
assert.strictEqual(Q.scale({amount:null,unit:'taste'},8,4).amount, null, 'null stays null');
// normalize kg→g
const n = Q.normalize({amount:0.05,unit:'kg'});
assert.strictEqual(n.unit,'g'); assert.strictEqual(n.amount,50);
// format taste DE
assert.ok(Q.format({amount:null,unit:'taste'},'de').text.indexOf('Geschmack')!==-1);

console.log('quantities.test.js: ALL PASS');
```

- [ ] **Step 2: Lauf**

```bash
cd C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator
node tests/quantities.test.js
```
Expected: `quantities.test.js: ALL PASS`.

- [ ] **Step 3: package.json scripts erweitern**

```json
"scripts": {
  "validate:i18n": "node tools/validate-i18n.js",
  "test:quantities": "node tests/quantities.test.js",
  "test": "npm run validate:i18n && npm run test:quantities"
}
```

- [ ] **Step 4: Commit**

```bash
git add tests/quantities.test.js package.json
git commit -m "test: add node-assert tests for quantities API"
```

### Task 17: README + TASK.md aktualisieren

**Files:**
- Modify: `README.md`
- Create/Update: `TASK.md`

- [ ] **Step 1: README.md ergänzen**

Abschnitt „Mengenangaben & Personen-Skalierung" hinzufügen:
- Beschreibung der Stepper-Funktion (1–12 Personen)
- localStorage-Key `sfc_default_servings`
- i18n-Keys (`recipe_servings_label`, `recipe_min_quantity_note`, `recipe_steps_for_4_note`)
- Test-Commands (`npm test`, `npm run validate:i18n`)

- [ ] **Step 2: TASK.md aktualisieren**

```markdown
## Endphase – Verifikation & Bugfixes (2026-05-04)

- [x] Phase 1 Verifikation (Quantities, Modal, SW, i18n, Daten, a11y)
- [x] i18n-Hardcodes in recipes.js Modal entfernt
- [x] Memory-Leak Listener-Stacking gefixt
- [x] SW-Registrierung + Cache-Härtung + v4
- [x] Touch-Target ≥ 44px
- [x] <html lang> Sync
- [x] og:image .webp + Doppel-CTA entfernt
- [x] aria-controls für Stepper
- [x] Node-Tests für Quantities

### Discovered During Work
- (Bugs, die in Phase 2 gefunden wurden, hier eintragen)
```

- [ ] **Step 3: Commit**

```bash
git add README.md TASK.md
git commit -m "docs: update README + TASK for endphase fixes"
```

---

## Akzeptanzkriterien (Definition of Done)

Vor dem Schluss-Commit MÜSSEN alle folgenden Kriterien erfüllt sein:

- [ ] `npm run validate:i18n` → Exit 0
- [ ] `npm test` → Exit 0 (validate:i18n + quantities Tests)
- [ ] `node tools/extract-quantities.js` → Exit 0
- [ ] Browser-Console: keine roten Fehler auf `index.html`, `pages/search.html`, `pages/rind.html`, `pages/dessert.html`
- [ ] Modal Stepper [-]/[+] funktioniert auf Touch + Desktop, ≥ 44 × 44 px
- [ ] Mengen werden bei Sprachwechsel ohne Modal-Schließen sofort übersetzt
- [ ] Stepper-aria-Labels wechseln mit Sprache
- [ ] `recipe_steps_for_4_note` und `recipe_min_quantity_note` korrekt übersetzt
- [ ] Service Worker `sfc-v4` registriert, Offline-Reload funktioniert
- [ ] Listener-Anzahl bleibt konstant beim mehrfachen Modal-Open (kein Leak)
- [ ] `<html lang>` synchron mit `localStorage.sfc_lang`
- [ ] Keine `hero-image.png`-Referenz in og:image (nur `.webp`)
- [ ] Lighthouse Mobile: Accessibility ≥ 95, SEO ≥ 95, Best-Practices ≥ 90 auf `pages/rind.html` und `pages/search.html`
- [ ] README.md und TASK.md auf aktuellem Stand

---

## Cowork-Prompt (zur direkten Übergabe)

```
Du übernimmst die Endabnahme des SFC (Spare Food Calculator) Projekts unter
C:/Users/Kilian/Facharbeit/Facharbeit/spare-food-calculator.

Lies zuerst PLANNING.md komplett. Arbeite die Tasks 1–17 in der vorgegebenen
Reihenfolge ab. Halte dich exakt an die Code-Snippets und Akzeptanzkriterien.

Phase 1 (Tasks 1–6) ist VERIFIKATION: Reproduziere die genannten Browser-/CLI-
Tests und protokolliere ALLE neuen Bugs in TASK.md unter "Discovered During Work".
Wenn ein Vorab-Befund in PLANNING.md sich nicht reproduzieren lässt, hake ihn
ab und vermerke das.

Phase 2 (Task 7) ist FEHLERANALYSE: Site-weiter Audit (Console, Network, Lighthouse,
SEO, Mobile, i18n). Ergebnisse priorisiert in TASK.md.

Phase 3 (Tasks 8–17) ist UMSETZUNG: pro Task TDD-Style commiten (kleinster
sinnvoller Commit, kein --no-verify, keine destructive git ops).

Akzeptanzkriterien (siehe PLANNING.md "Definition of Done") MÜSSEN erfüllt sein:
- npm run validate:i18n → Exit 0
- npm test → Exit 0
- node tools/extract-quantities.js → Exit 0
- Keine Console-Fehler auf den 4 Hauptseiten
- Stepper ≥ 44px, aria-Labels lokalisiert, Listener-Leak behoben
- SW sfc-v4 registriert + Offline-Reload OK
- <html lang> Sync, og:image .webp
- Lighthouse Mobile: a11y ≥ 95, SEO ≥ 95, Best-Practices ≥ 90 auf rind.html + search.html

NICHT zulässig:
- recipes.js in mehrere Dateien splitten (zu riskant kurz vor Abgabe)
- Build-Pipeline einführen
- Daten-Schema von quantities ändern (406 Rezepte stabil)
- Service-Worker-Strategie auf network-first ändern (cache-first ist gewollt)

Falls Bugs außerhalb von PLANNING.md auftauchen, die kritisch sind, dokumentiere
sie in TASK.md "Discovered During Work" und löse sie nur, wenn sie als Blocker
oder Major eingestuft sind.

Nach Abschluss: zeige Git-Log der neuen Commits + Lighthouse-Ergebnisse.
```

---

## Self-Review

**Spec coverage:**
- Phase 1 Verifikation der Cowork-Bericht-Items: Tasks 1–6 ✓
- Phase 2 Site-weiter Audit: Task 7 ✓
- Phase 3 Verbesserungen aller gefundenen Bugs: Tasks 8–17 ✓
- 22+ i18n-Keys verifiziert in Task 4 ✓
- 6 HTML-Seiten + Verdrahtung: indirekt über Task 2 + 7 ✓
- 406 Rezepte mit quantities: Task 5 explizit ✓
- Tools (extract-quantities, MIGRATION.md): Task 5 ✓

**Placeholder-Scan:** Keine TBD/TODO/„fill in details" – alle Code-Snippets sind komplett.

**Type/API-Konsistenz:** `Quantities.scale/normalize/format/getDefaultServings/setDefaultServings`, `_t`-Helper, `sfc:servingsChanged`, `languageChanged` einheitlich verwendet.
