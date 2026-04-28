/**
 * SUSTAINABILITY DATA v2
 * ======================
 * CO2-Aequivalente, Wasser-Fussabdruck und Saisonalitaet pro Zutat.
 *
 * Schema pro Eintrag:
 *   co2         = kg CO2e pro kg Lebensmittel
 *   water       = Liter Wasser pro kg Lebensmittel (Water Footprint)
 *   price       = Durchschnittspreis EUR pro kg
 *   unit        = Bezugseinheit
 *   season      = Array von Monaten (1-12) in denen DACH-Anbau moeglich ist.
 *                 Leeres Array [] = ganzjaehrig verfuegbar / kein saisonaler Anbau.
 *   source_co2  = Key in sustainabilitySources fuer CO2-Daten
 *   source_water = Key in sustainabilitySources fuer Wasser-Daten
 *   source_season = Key in sustainabilitySources fuer Saisonalitaet
 *
 * Preisquellen (Durchschnitt aus 5 Supermaerkten, Stand April 2026):
 *   Hofer, Billa, Spar, Edeka, Lidl. Cross-Check: preismonitor.at
 */

// ==================== QUELLEN-TABELLE ====================

var sustainabilitySources = {
  poore_nemecek_2018: {
    title: 'Reducing food\'s environmental impacts through producers and consumers',
    authors: 'Poore J., Nemecek T.',
    year: 2018,
    journal: 'Science 360(6392), S. 987-992',
    url: 'https://doi.org/10.1126/science.aaq0216'
  },
  mekonnen_hoekstra_2012: {
    title: 'A Global Assessment of the Water Footprint of Farm Animal Products',
    authors: 'Mekonnen M. M., Hoekstra A. Y.',
    year: 2012,
    journal: 'Ecosystems 15(3), S. 401-415',
    url: 'https://doi.org/10.1007/s10021-011-9517-8'
  },
  mekonnen_hoekstra_2011: {
    title: 'The green, blue and grey water footprint of crops and derived crop products',
    authors: 'Mekonnen M. M., Hoekstra A. Y.',
    year: 2011,
    journal: 'Hydrology and Earth System Sciences 15(5), S. 1577-1600',
    url: 'https://doi.org/10.5194/hess-15-1577-2011'
  },
  ble_saisonkalender: {
    title: 'Saisonkalender - Obst und Gemuese',
    authors: 'Bundesanstalt fuer Landwirtschaft und Ernaehrung (BLE)',
    year: 2024,
    journal: '',
    url: 'https://www.bzfe.de/nachhaltiger-konsum/orientierung-beim-einkauf/der-saisonkalender/'
  },
  uba_emissionen_2024: {
    title: 'CO2-Emissionsfaktoren fuer fossile Brennstoffe',
    authors: 'Umweltbundesamt Deutschland',
    year: 2024,
    journal: 'Climate Change 28/2024',
    url: 'https://www.umweltbundesamt.de/themen/verkehr-laerm/emissionsdaten'
  },
  wwf_ernaehrung_2023: {
    title: 'So schmeckt Zukunft: Der kulinarische Kompass fuer eine gesunde Erde',
    authors: 'WWF Deutschland',
    year: 2023,
    journal: '',
    url: 'https://www.wwf.de/themen-projekte/landwirtschaft/ernaehrung-konsum'
  }
};

// ==================== HAUPTDATEN ====================

var sustainabilityData = {

  // ==================== FLEISCH ====================
  'rindfleisch':       { co2: 13.3, water: 15415, price: 14.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'rind':              { co2: 13.3, water: 15415, price: 14.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'rinderhüfte':       { co2: 13.3, water: 15415, price: 18.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'rinderfilet':       { co2: 13.3, water: 15415, price: 38.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'rindersteak':       { co2: 13.3, water: 15415, price: 24.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'hackfleisch':       { co2: 8.5,  water: 8000,  price: 8.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'rinderhack':        { co2: 13.3, water: 15415, price: 9.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schweinefleisch':   { co2: 4.6,  water: 5988,  price: 8.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schwein':           { co2: 4.6,  water: 5988,  price: 8.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schweineschnitzel': { co2: 4.6,  water: 5988,  price: 9.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schweinefilet':     { co2: 4.6,  water: 5988,  price: 12.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schweinehack':      { co2: 4.6,  water: 5988,  price: 7.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schweinebraten':    { co2: 4.6,  water: 5988,  price: 8.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schweinefaschiertes': { co2: 4.6, water: 5988, price: 7.50, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'speck':             { co2: 4.6,  water: 5988,  price: 12.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'bacon':             { co2: 4.6,  water: 5988,  price: 14.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schinken':          { co2: 4.6,  water: 5988,  price: 16.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'hähnchen':          { co2: 2.9,  water: 4325,  price: 7.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'hähnchenbrust':     { co2: 2.9,  water: 4325,  price: 10.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'hähnchenkeule':     { co2: 2.9,  water: 4325,  price: 5.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'huhn':              { co2: 2.9,  water: 4325,  price: 7.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'pute':              { co2: 3.2,  water: 4325,  price: 10.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'putenbrust':        { co2: 3.2,  water: 4325,  price: 12.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'ente':              { co2: 3.5,  water: 4325,  price: 12.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'entenbrust':        { co2: 3.5,  water: 4325,  price: 18.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'lamm':              { co2: 24.0, water: 10412, price: 18.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'lammkeule':         { co2: 24.0, water: 10412, price: 16.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'lammfilet':         { co2: 24.0, water: 10412, price: 28.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'wild':              { co2: 6.0,  water: 4000,  price: 20.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2012' },
  'fleischbällchen':   { co2: 6.0,  water: 8000,  price: 9.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2012' },

  // ==================== FISCH ====================
  'fisch':             { co2: 3.0,  water: 2000,  price: 12.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'lachs':             { co2: 5.1,  water: 2585,  price: 22.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'lachsfilet':        { co2: 5.1,  water: 2585,  price: 24.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'forelle':           { co2: 3.0,  water: 2000,  price: 14.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'kabeljau':          { co2: 3.0,  water: 2000,  price: 18.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'thunfisch':         { co2: 3.5,  water: 2500,  price: 20.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'garnelen':          { co2: 11.0, water: 3500,  price: 24.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'shrimps':           { co2: 11.0, water: 3500,  price: 24.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },

  // ==================== MILCHPRODUKTE ====================
  'milch':             { co2: 1.3,  water: 1020,  price: 1.30,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'vollmilch':         { co2: 1.3,  water: 1020,  price: 1.30,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'sahne':             { co2: 3.7,  water: 1800,  price: 4.50,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schlagsahne':       { co2: 3.7,  water: 1800,  price: 4.50,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'schmand':           { co2: 2.0,  water: 1400,  price: 4.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'crème fraîche':     { co2: 2.0,  water: 1400,  price: 5.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'butter':            { co2: 9.0,  water: 5553,  price: 8.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'joghurt':           { co2: 1.2,  water: 1020,  price: 2.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'jogurt':            { co2: 1.2,  water: 1020,  price: 2.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'quark':             { co2: 1.5,  water: 1200,  price: 3.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'topfen':            { co2: 1.5,  water: 1200,  price: 3.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'frischkäse':        { co2: 2.5,  water: 1500,  price: 6.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'mascarpone':        { co2: 3.0,  water: 1800,  price: 8.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'ricotta':           { co2: 2.5,  water: 1500,  price: 7.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'mozzarella':        { co2: 4.5,  water: 2500,  price: 7.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'parmesan':          { co2: 5.7,  water: 5060,  price: 16.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'gouda':             { co2: 5.7,  water: 5060,  price: 8.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'emmentaler':        { co2: 5.7,  water: 5060,  price: 10.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'cheddar':           { co2: 5.7,  water: 5060,  price: 9.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'feta':              { co2: 4.0,  water: 3400,  price: 8.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'käse':              { co2: 5.7,  water: 5060,  price: 9.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'Käse':              { co2: 5.7,  water: 5060,  price: 9.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },

  // ==================== EIER ====================
  'eier':              { co2: 1.9,  water: 3265,  price: 3.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'ei':                { co2: 1.9,  water: 3265,  price: 3.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },
  'eigelb':            { co2: 1.9,  water: 3265,  price: 3.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },

  // ==================== GETREIDE & BEILAGEN ====================
  'reis':              { co2: 2.5,  water: 2497,  price: 2.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'risottoreis':       { co2: 2.5,  water: 2497,  price: 4.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'pasta':             { co2: 0.8,  water: 1849,  price: 1.80,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'nudeln':            { co2: 0.8,  water: 1849,  price: 1.80,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'spaghetti':         { co2: 0.8,  water: 1849,  price: 1.60,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'penne':             { co2: 0.8,  water: 1849,  price: 1.60,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'fusilli':           { co2: 0.8,  water: 1849,  price: 1.60,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'lasagneplatten':    { co2: 0.8,  water: 1849,  price: 2.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'brot':              { co2: 0.8,  water: 1608,  price: 3.20,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'paniermehl':        { co2: 0.8,  water: 1608,  price: 2.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'mehl':              { co2: 0.6,  water: 1849,  price: 1.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'haferflocken':      { co2: 0.5,  water: 1788,  price: 2.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'couscous':          { co2: 0.8,  water: 1849,  price: 3.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'quinoa':            { co2: 1.0,  water: 4500,  price: 6.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'kartoffeln':        { co2: 0.3,  water: 287,   price: 1.50,  unit: 'kg', season: [6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'kartoffel':         { co2: 0.3,  water: 287,   price: 1.50,  unit: 'kg', season: [6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'süßkartoffeln':     { co2: 0.4,  water: 500,   price: 3.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },

  // ==================== GEMUESE ====================
  // Saisonmonate nach BLE-Saisonkalender fuer DACH-Freilandanbau
  'tomate':            { co2: 0.4,  water: 214,   price: 3.50,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'tomaten':           { co2: 0.4,  water: 214,   price: 3.50,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'gurke':             { co2: 0.3,  water: 353,   price: 1.80,  unit: 'kg', season: [5,6,7,8,9], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'salat':             { co2: 0.4,  water: 237,   price: 2.00,  unit: 'kg', season: [5,6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'karotte':           { co2: 0.3,  water: 195,   price: 1.50,  unit: 'kg', season: [6,7,8,9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'karotten':          { co2: 0.3,  water: 195,   price: 1.50,  unit: 'kg', season: [6,7,8,9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'zwiebel':           { co2: 0.3,  water: 272,   price: 1.50,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'zwiebeln':          { co2: 0.3,  water: 272,   price: 1.50,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'knoblauch':         { co2: 0.4,  water: 589,   price: 8.00,  unit: 'kg', season: [7,8,9], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'paprika':           { co2: 0.5,  water: 379,   price: 4.00,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'rote paprika':      { co2: 0.5,  water: 379,   price: 4.00,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'gelbe paprika':     { co2: 0.5,  water: 379,   price: 4.00,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'zucchini':          { co2: 0.3,  water: 353,   price: 2.50,  unit: 'kg', season: [6,7,8,9], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'aubergine':         { co2: 0.4,  water: 362,   price: 3.00,  unit: 'kg', season: [7,8,9], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'brokkoli':          { co2: 0.5,  water: 285,   price: 4.00,  unit: 'kg', season: [6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'blumenkohl':        { co2: 0.4,  water: 285,   price: 3.00,  unit: 'kg', season: [5,6,7,8,9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'spinat':            { co2: 0.3,  water: 292,   price: 5.00,  unit: 'kg', season: [3,4,5,9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'pilze':             { co2: 0.6,  water: 200,   price: 6.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'champignons':       { co2: 0.6,  water: 200,   price: 5.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'mais':              { co2: 0.5,  water: 1222,  price: 2.50,  unit: 'kg', season: [8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'erbsen':            { co2: 0.4,  water: 595,   price: 3.00,  unit: 'kg', season: [6,7,8], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'spargel':           { co2: 0.5,  water: 500,   price: 8.00,  unit: 'kg', season: [4,5,6], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'kürbis':            { co2: 0.3,  water: 336,   price: 2.00,  unit: 'kg', season: [9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'rote beete':        { co2: 0.3,  water: 132,   price: 2.50,  unit: 'kg', season: [9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'kohlrabi':          { co2: 0.3,  water: 200,   price: 2.50,  unit: 'kg', season: [5,6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'rosenkohl':         { co2: 0.4,  water: 285,   price: 4.00,  unit: 'kg', season: [10,11,12,1,2], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'rotkohl':           { co2: 0.3,  water: 200,   price: 1.50,  unit: 'kg', season: [9,10,11,12,1,2], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'fenchel':           { co2: 0.3,  water: 200,   price: 4.00,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'sellerie':          { co2: 0.3,  water: 200,   price: 3.00,  unit: 'kg', season: [7,8,9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'staudensellerie':   { co2: 0.3,  water: 200,   price: 3.50,  unit: 'kg', season: [7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'lauch':             { co2: 0.3,  water: 200,   price: 2.50,  unit: 'kg', season: [8,9,10,11,12,1,2,3], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'porree':            { co2: 0.3,  water: 200,   price: 2.50,  unit: 'kg', season: [8,9,10,11,12,1,2,3], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'rucola':            { co2: 0.4,  water: 237,   price: 8.00,  unit: 'kg', season: [5,6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'feldsalat':         { co2: 0.4,  water: 237,   price: 10.00, unit: 'kg', season: [10,11,12,1,2,3], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'pak choi':          { co2: 0.3,  water: 200,   price: 5.00,  unit: 'kg', season: [6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'mangold':           { co2: 0.3,  water: 200,   price: 4.00,  unit: 'kg', season: [6,7,8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },

  // ==================== OBST ====================
  'apfel':             { co2: 0.4,  water: 822,   price: 2.50,  unit: 'kg', season: [8,9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'banane':            { co2: 0.7,  water: 790,   price: 1.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'bananen':           { co2: 0.7,  water: 790,   price: 1.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'orange':            { co2: 0.4,  water: 560,   price: 2.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'zitrone':           { co2: 0.3,  water: 642,   price: 3.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'limette':           { co2: 0.3,  water: 642,   price: 5.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'erdbeeren':         { co2: 1.0,  water: 347,   price: 6.00,  unit: 'kg', season: [5,6,7], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'himbeeren':         { co2: 1.0,  water: 400,   price: 12.00, unit: 'kg', season: [6,7,8], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'heidelbeeren':      { co2: 1.0,  water: 400,   price: 10.00, unit: 'kg', season: [6,7,8,9], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'blaubeeren':        { co2: 1.0,  water: 400,   price: 10.00, unit: 'kg', season: [6,7,8,9], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'kirschen':          { co2: 0.6,  water: 600,   price: 7.00,  unit: 'kg', season: [6,7], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'birne':             { co2: 0.4,  water: 822,   price: 2.80,  unit: 'kg', season: [8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'mango':             { co2: 1.5,  water: 1600,  price: 5.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'ananas':            { co2: 1.0,  water: 255,   price: 2.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'avocado':           { co2: 1.3,  water: 1981,  price: 5.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'weintrauben':       { co2: 0.5,  water: 608,   price: 4.00,  unit: 'kg', season: [8,9,10], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },

  // ==================== HUELSENFRUECHTE & TOFU ====================
  'linsen':            { co2: 0.9,  water: 5874,  price: 3.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'rote linsen':       { co2: 0.9,  water: 5874,  price: 3.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'grüne linsen':      { co2: 0.9,  water: 5874,  price: 4.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'kichererbsen':      { co2: 0.8,  water: 4177,  price: 3.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'bohnen':            { co2: 1.8,  water: 5053,  price: 2.50,  unit: 'kg', season: [7,8,9], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'kidneybohnen':      { co2: 1.8,  water: 5053,  price: 2.50,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'tofu':              { co2: 1.0,  water: 2523,  price: 5.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },

  // ==================== NUESSE & SAMEN ====================
  'mandeln':           { co2: 1.2,  water: 16194, price: 12.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'walnüsse':          { co2: 1.0,  water: 9063,  price: 14.00, unit: 'kg', season: [9,10,11], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'pinienkerne':       { co2: 1.5,  water: 8000,  price: 40.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'sesam':             { co2: 0.8,  water: 9371,  price: 8.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'cashewnüsse':       { co2: 1.2,  water: 14218, price: 14.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },

  // ==================== OELE & FETTE ====================
  'olivenöl':          { co2: 3.2,  water: 14430, price: 8.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'öl':                { co2: 2.5,  water: 6800,  price: 3.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'sonnenblumenöl':    { co2: 2.0,  water: 6800,  price: 2.50,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'rapsöl':            { co2: 2.0,  water: 4300,  price: 2.80,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'sesamöl':           { co2: 2.5,  water: 9371,  price: 10.00, unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'kokosöl':           { co2: 2.5,  water: 2687,  price: 8.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'butterschmalz':     { co2: 9.0,  water: 5553,  price: 10.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2012' },

  // ==================== GEWUERZE & KRAEUTER ====================
  'salz':              { co2: 0.1,  water: 0,     price: 0.50,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'pfeffer':           { co2: 0.5,  water: 7000,  price: 20.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'schwarzer pfeffer': { co2: 0.5,  water: 7000,  price: 20.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'paprikapulver':     { co2: 0.5,  water: 3000,  price: 12.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'curry':             { co2: 0.5,  water: 3000,  price: 15.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'currypulver':       { co2: 0.5,  water: 3000,  price: 15.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'chili':             { co2: 0.5,  water: 3000,  price: 15.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'ingwer':            { co2: 0.5,  water: 1657,  price: 8.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'muskatnuss':        { co2: 0.5,  water: 5000,  price: 30.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'zimt':              { co2: 0.5,  water: 3000,  price: 18.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'kurkuma':           { co2: 0.5,  water: 3000,  price: 15.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'basilikum':         { co2: 0.3,  water: 200,   price: 15.00, unit: 'kg', season: [6,7,8,9], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'petersilie':        { co2: 0.3,  water: 200,   price: 10.00, unit: 'kg', season: [4,5,6,7,8,9,10], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'schnittlauch':      { co2: 0.3,  water: 200,   price: 12.00, unit: 'kg', season: [3,4,5,6,7,8,9,10], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'thymian':           { co2: 0.3,  water: 200,   price: 15.00, unit: 'kg', season: [5,6,7,8,9], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'rosmarin':          { co2: 0.3,  water: 200,   price: 15.00, unit: 'kg', season: [5,6,7,8,9,10], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'oregano':           { co2: 0.3,  water: 200,   price: 15.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'dill':              { co2: 0.3,  water: 200,   price: 12.00, unit: 'kg', season: [5,6,7,8,9], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'kräuter':           { co2: 0.3,  water: 200,   price: 12.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'koriander':         { co2: 0.3,  water: 200,   price: 12.00, unit: 'kg', season: [6,7,8,9], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011', source_season: 'ble_saisonkalender' },
  'lorbeer':           { co2: 0.3,  water: 200,   price: 25.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'lorbeerblätter':    { co2: 0.3,  water: 200,   price: 25.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'fleur de sel':      { co2: 0.1,  water: 0,     price: 25.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'vanille':           { co2: 1.0,  water: 15000, price: 80.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },

  // ==================== SAUCEN & WUERZMITTEL ====================
  'tomatenmark':       { co2: 1.0,  water: 500,   price: 4.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'passierte tomaten': { co2: 0.6,  water: 400,   price: 2.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'sojasauce':         { co2: 0.8,  water: 2145,  price: 5.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'essig':             { co2: 0.3,  water: 300,   price: 2.00,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'balsamico':         { co2: 0.5,  water: 600,   price: 6.00,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'senf':              { co2: 0.5,  water: 3300,  price: 4.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'honig':             { co2: 0.5,  water: 2000,  price: 10.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'zucker':            { co2: 0.6,  water: 1782,  price: 1.20,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'fond':              { co2: 0.5,  water: 500,   price: 3.00,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'brühe':             { co2: 0.5,  water: 500,   price: 3.00,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'gemüsebrühe':       { co2: 0.3,  water: 300,   price: 3.00,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'hühnerbrühe':       { co2: 0.6,  water: 800,   price: 3.50,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2012' },
  'rinderbrühe':       { co2: 1.0,  water: 1500,  price: 4.00,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2012' },
  'kokosmilch':        { co2: 1.5,  water: 2687,  price: 3.50,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'rotwein':           { co2: 1.0,  water: 870,   price: 5.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'weißwein':          { co2: 1.0,  water: 870,   price: 5.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'zitronensaft':      { co2: 0.3,  water: 642,   price: 3.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'limettensaft':      { co2: 0.3,  water: 642,   price: 5.00,  unit: 'l', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'ketchup':           { co2: 0.5,  water: 530,   price: 3.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'mayonnaise':        { co2: 1.5,  water: 2000,  price: 4.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'teriyaki':          { co2: 0.8,  water: 2145,  price: 6.00,  unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'pesto':             { co2: 2.0,  water: 3000,  price: 10.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'ajvar':             { co2: 0.5,  water: 400,   price: 5.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },

  // ==================== SUESSES & BACKZUTATEN ====================
  'schokolade':        { co2: 3.5,  water: 17196, price: 8.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'kakao':             { co2: 3.5,  water: 27000, price: 10.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'kakaopulver':       { co2: 3.5,  water: 27000, price: 10.00, unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'puderzucker':       { co2: 0.6,  water: 1782,  price: 2.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'staubzucker':       { co2: 0.6,  water: 1782,  price: 2.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'backpulver':        { co2: 0.3,  water: 100,   price: 5.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'gelatine':          { co2: 2.0,  water: 5000,  price: 20.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2012' },
  'hefe':              { co2: 0.3,  water: 100,   price: 5.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'marmelade':         { co2: 0.8,  water: 1000,  price: 4.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'ahornsirup':        { co2: 1.0,  water: 2000,  price: 18.00, unit: 'l', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'löffelbiskuits':    { co2: 1.0,  water: 1849,  price: 5.00,  unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' },
  'Gemüse':            { co2: 0.4,  water: 300,   price: 3.00,  unit: 'kg', season: [], source_co2: 'poore_nemecek_2018', source_water: 'mekonnen_hoekstra_2011' },
  'roter pfeffer':     { co2: 0.5,  water: 7000,  price: 20.00, unit: 'kg', season: [], source_co2: 'wwf_ernaehrung_2023', source_water: 'mekonnen_hoekstra_2011' }
};

/**
 * Standard-Mengen pro Zutat in Gramm, wenn keine explizite Menge im Rezept steht.
 */
var defaultAmounts = {
  hauptzutat: 200,
  nebenzutat: 50,
  gewürz: 5,
  öl: 20
};

/**
 * Bestimmt ob eine Zutat eine Haupt- oder Nebenzutat ist
 */
function getIngredientRole(ingredientName) {
  var lower = ingredientName.toLowerCase().trim();

  var spiceList = [
    'salz', 'pfeffer', 'schwarzer pfeffer', 'paprikapulver', 'curry', 'currypulver',
    'chili', 'chiliflocken', 'muskatnuss', 'muskat', 'zimt', 'kurkuma', 'koriander',
    'lorbeer', 'lorbeerblätter', 'fleur de sel', 'vanille', 'oregano', 'thymian',
    'rosmarin', 'basilikum', 'petersilie', 'schnittlauch', 'dill', 'kräuter',
    'ingwer', 'backpulver', 'hefe', 'natron', 'roter pfeffer'
  ];
  if (spiceList.indexOf(lower) !== -1) return 'gewürz';

  var oilList = [
    'olivenöl', 'öl', 'sonnenblumenöl', 'rapsöl', 'sesamöl', 'kokosöl',
    'butterschmalz', 'essig', 'balsamico', 'sojasauce', 'zitronensaft',
    'limettensaft', 'senf', 'ketchup', 'mayonnaise', 'teriyaki',
    'tomatenmark', 'honig', 'rotwein', 'weißwein'
  ];
  if (oilList.indexOf(lower) !== -1) return 'öl';

  if (typeof findCategoryForIngredient === 'function') {
    var cat = findCategoryForIngredient(lower);
    if (['fleisch', 'fisch', 'getreide', 'gemüse', 'milchprodukte', 'obst', 'eier'].indexOf(cat) !== -1) {
      return 'hauptzutat';
    }
  }

  return 'nebenzutat';
}

/**
 * Gibt die geschaetzte Menge in Gramm fuer eine Zutat zurueck
 */
function getEstimatedGrams(ingredientName) {
  var role = getIngredientRole(ingredientName);
  switch (role) {
    case 'gewürz':    return defaultAmounts.gewürz;
    case 'öl':        return defaultAmounts.öl;
    case 'hauptzutat': return defaultAmounts.hauptzutat;
    default:           return defaultAmounts.nebenzutat;
  }
}

/**
 * Gibt die Quell-Information fuer einen bestimmten Wert zurueck
 * @param {string} ingredientName
 * @param {string} field - 'co2' oder 'water'
 * @returns {object|null} Source-Objekt oder null
 */
function getSourceForValue(ingredientName, field) {
  var lower = ingredientName.toLowerCase().trim();
  var data = sustainabilityData[lower];
  if (!data) return null;

  var sourceKey;
  if (field === 'co2') {
    sourceKey = data.source_co2 || data.source;
  } else if (field === 'water') {
    sourceKey = data.source_water || data.source;
  } else if (field === 'season') {
    sourceKey = data.source_season;
  }

  if (!sourceKey) return null;
  return sustainabilitySources[sourceKey] || null;
}

/**
 * Prueft ob eine Zutat im angegebenen Monat Saison hat (DACH-Region).
 * Zutaten ohne season-Array gelten als ganzjaehrig.
 * Unbekannte Zutaten geben true zurueck (kein negativer Einfluss).
 * @param {string} ingredientName
 * @param {number} currentMonth - 1-12
 * @returns {boolean}
 */
function isInSeason(ingredientName, currentMonth) {
  var lower = ingredientName.toLowerCase().trim();

  // Synonym-Aufloesung wenn verfuegbar
  if (typeof resolveSynonyms === 'function') {
    var synonyms = resolveSynonyms(lower);
    for (var s = 0; s < synonyms.length; s++) {
      var d = sustainabilityData[synonyms[s]];
      if (d) {
        lower = synonyms[s];
        break;
      }
    }
  }

  var data = sustainabilityData[lower];
  if (!data) return true; // unbekannte Zutat: kein negativer Einfluss
  if (!data.season || data.season.length === 0) return true; // ganzjaehrig

  return data.season.indexOf(currentMonth) !== -1;
}

/**
 * Berechnet den Saisonalitaets-Score fuer ein Rezept.
 * @param {string[]} ingredients
 * @param {number} currentMonth - 1-12
 * @returns {{ score: number, inSeason: number, total: number, status: string }}
 *   status: 'green' (100%), 'yellow' (>=50%), 'red' (<50%)
 */
function getSeasonalityScore(ingredients, currentMonth) {
  if (!ingredients || ingredients.length === 0) {
    return { score: 1, inSeason: 0, total: 0, status: 'green' };
  }

  var inSeason = 0;
  var total = ingredients.length;

  for (var i = 0; i < ingredients.length; i++) {
    if (isInSeason(ingredients[i], currentMonth)) {
      inSeason++;
    }
  }

  var score = total > 0 ? inSeason / total : 1;
  var status = 'red';
  if (score >= 1) status = 'green';
  else if (score >= 0.5) status = 'yellow';

  return {
    score: Math.round(score * 100) / 100,
    inSeason: inSeason,
    total: total,
    status: status
  };
}

/**
 * Gibt den besten Monat fuer ein Rezept zurueck (meiste saisonale Zutaten).
 * @param {string[]} ingredients
 * @returns {number} Monat 1-12
 */
function getBestMonth(ingredients) {
  if (!ingredients || ingredients.length === 0) return new Date().getMonth() + 1;

  var best = 1;
  var bestCount = 0;

  for (var m = 1; m <= 12; m++) {
    var count = 0;
    for (var i = 0; i < ingredients.length; i++) {
      if (isInSeason(ingredients[i], m)) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      best = m;
    }
  }

  return best;
}

/**
 * Monatsnamen fuer die Anzeige
 */
var monthNames = {
  de: ['', 'Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni',
       'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['', 'January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December']
};

// Export fuer Node.js Tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sustainabilityData: sustainabilityData,
    sustainabilitySources: sustainabilitySources,
    defaultAmounts: defaultAmounts,
    getIngredientRole: getIngredientRole,
    getEstimatedGrams: getEstimatedGrams,
    getSourceForValue: getSourceForValue,
    isInSeason: isInSeason,
    getSeasonalityScore: getSeasonalityScore,
    getBestMonth: getBestMonth,
    monthNames: monthNames
  };
}
