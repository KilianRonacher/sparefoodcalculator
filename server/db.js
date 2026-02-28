const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = path.join(__dirname, 'data', 'recipes.db');
const JSON_FILE = path.join(__dirname, 'data', 'recipes.json');

if(!fs.existsSync(path.join(__dirname, 'data'))){
  fs.mkdirSync(path.join(__dirname, 'data'), {recursive:true});
}

const db = new sqlite3.Database(DB_FILE);

function runAsync(sql, params=[]) {
  return new Promise((resolve,reject)=>{
    db.run(sql, params, function(err){ if(err) reject(err); else resolve(this); });
  });
}
function allAsync(sql, params=[]) {
  return new Promise((resolve,reject)=>{ db.all(sql, params, (err,rows)=> err? reject(err): resolve(rows)); });
}
function getAsync(sql, params=[]) {
  return new Promise((resolve,reject)=>{ db.get(sql, params, (err,row)=> err? reject(err): resolve(row)); });
}

async function init(){
  await runAsync(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY,
    title TEXT,
    category TEXT,
    difficulty TEXT,
    ingredients TEXT,
    steps TEXT,
    image TEXT
  )`);

  // If empty, try to load JSON seed
  const row = await getAsync('SELECT COUNT(1) as c FROM recipes');
  if(row && row.c === 0){
    try{
      if(fs.existsSync(JSON_FILE)){
        const raw = fs.readFileSync(JSON_FILE,'utf8');
        const arr = JSON.parse(raw || '[]');
        const insert = db.prepare('INSERT INTO recipes (id,title,category,difficulty,ingredients,steps,image) VALUES (?,?,?,?,?,?,?)');
        db.serialize(()=>{
          arr.forEach(r=>{
            insert.run(r.id, r.title, r.category || '', r.difficulty || '', JSON.stringify(r.ingredients || []), JSON.stringify(r.steps || []), r.image || null);
          });
          insert.finalize();
        });
      }
    }catch(e){ console.warn('Failed seeding DB from JSON', e); }
  }
}

async function getAllRecipes(){
  const rows = await allAsync('SELECT * FROM recipes ORDER BY id');
  return rows.map(r=>({
    id: r.id,
    title: r.title,
    category: r.category,
    difficulty: r.difficulty,
    ingredients: JSON.parse(r.ingredients || '[]'),
    steps: JSON.parse(r.steps || '[]'),
    image: r.image || null
  }));
}

async function upsertRecipes(list){
  // list: array of recipe objects
  const stmt = await new Promise((res,rej)=>{ db.prepare('INSERT OR REPLACE INTO recipes (id,title,category,difficulty,ingredients,steps,image) VALUES (?,?,?,?,?,?,?)', function(err){ if(err) rej(err); else res(this); }); });
  return new Promise((resolve,reject)=>{
    db.serialize(()=>{
      try{
        list.forEach(r=>{
          const id = r.id || Date.now() + Math.floor(Math.random()*1000);
          stmt.run(id, r.title || '', r.category || '', r.difficulty || '', JSON.stringify(r.ingredients || []), JSON.stringify(r.steps || []), r.image || null);
        });
        stmt.finalize(err=> err? reject(err): resolve(true));
      }catch(e){ reject(e); }
    });
  });
}

async function updateRecipe(id, patch){
  const rec = await getAsync('SELECT * FROM recipes WHERE id = ?', [id]);
  if(!rec) return null;
  const cur = {
    id: rec.id,
    title: rec.title,
    category: rec.category,
    difficulty: rec.difficulty,
    ingredients: JSON.parse(rec.ingredients || '[]'),
    steps: JSON.parse(rec.steps || '[]'),
    image: rec.image
  };
  const updated = {...cur, ...patch};
  await runAsync('UPDATE recipes SET title=?,category=?,difficulty=?,ingredients=?,steps=?,image=? WHERE id=?', [updated.title, updated.category, updated.difficulty, JSON.stringify(updated.ingredients||[]), JSON.stringify(updated.steps||[]), updated.image || null, id]);
  return updated;
}

module.exports = { init, getAllRecipes, upsertRecipes, updateRecipe };
