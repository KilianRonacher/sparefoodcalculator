# SpareFoodCalculator — Task-Tracking

## Endphase – Verifikation & Bugfixes (2026-05-04)

- [x] Phase 1 Verifikation: i18n-Pipeline (24 Keys ✓), Quantities-Selftest (✓), 406 Rezepte mit quantities (✓), SW-Registrierung in app.js (✓)
- [x] Phase 2 Fehleranalyse: Alle Bugs statisch aufgedeckt und bestätigt (siehe Befundliste PLANNING.md)
- [x] Task 8: i18n-Hardcodes in recipes.js Modal durch `_t()`-Aufrufe ersetzt (7 Stellen)
- [x] Task 9: Memory-Leak Modal-Listener behoben (`_sfcModalServingsHandler` + `_sfcModalLangHandler` mit Cleanup in closeRecipeModal)
- [x] Task 10: Listener-Leak in `loadCategoryRecipes` behoben (`_sfcCategoryLangHandler` wird ersetzt statt gestapelt)
- [x] Task 11: SW `sfc-v4` gebumpt, fetch-Handler härtet (nur same-origin 200-Responses cachen)
- [x] Task 12: Stepper-Buttons ≥ 44 × 44px (WCAG Touch-Target), focus-visible Ring, active-Scale
- [x] Task 13: `<html lang>` wird beim Sprachwechsel in i18n.js synchronisiert
- [x] Task 14: Doppelter CTA in index.html entfernt; og:image + twitter:image .png → .webp (index.html + 14 pages/)
- [x] Task 15: `aria-controls` verknüpft Stepper-Buttons mit Mengenliste per ID
- [x] Task 16: `tests/quantities.test.js` angelegt (19 Tests, alle PASS); `npm test` script in package.json
- [x] Task 17: README.md und TASK.md aktualisiert

## Entdeckte Zusatzbugs (während der Arbeit)

- Alle 14 Kategorie-Seiten hatten `hero-image.png` in og:image → alle auf `.webp` korrigiert
- `recipe_min_quantity_note` i18n-Key war bereits von Cowork-Agent in i18n.js eingetragen → kein zusätzlicher Schritt nötig

## Offene Punkte (bewusst ausgelassen)

- `recipes.js` ist >1900 Zeilen (> 500-Zeilen-Richtlinie): Refactoring kurz vor Facharbeit-Abgabe zu riskant → nicht umgesetzt
- `document.write` in `category-template.js`: funktioniert, Lighthouse-Abzug akzeptiert
- Browser-basierte Tests (Lighthouse, Screenreader, Offline-Test): manuell vom Nutzer durchzuführen

## Akzeptanzkriterien – Status

| Kriterium | Status |
|---|---|
| `npm run validate:i18n` → Exit 0 | ✓ |
| `npm test` → Exit 0 | ✓ |
| `node tools/extract-quantities.js` → Exit 0 | ✓ (unverändert) |
| Stepper ≥ 44px Touch-Target | ✓ |
| aria-Labels lokalisiert via _t() | ✓ |
| Listener-Leaks behoben | ✓ |
| SW sfc-v4 + fetch-Härtung | ✓ |
| `<html lang>` Sync | ✓ |
| og:image nur .webp | ✓ |
| Kein Doppel-CTA | ✓ |
| aria-controls Stepper → Mengenliste | ✓ |
