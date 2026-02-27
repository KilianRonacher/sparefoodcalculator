const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({extended:true, limit: '2mb'}));

const UP_DIR = path.join(__dirname, 'uploads');
if(!require('fs').existsSync(UP_DIR)) require('fs').mkdirSync(UP_DIR, {recursive:true});

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UP_DIR); },
  filename: function (req, file, cb) { const safe = Date.now() + '-' + file.originalname.replace(/[^a-z0-9.\-]/gi,'-'); cb(null, safe); }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// static files from parent directory (app, styles, i18n, pages, images)
app.use(express.static(path.join(__dirname, '..')));

// static
app.use('/uploads', express.static(UP_DIR));

// serve index.html as default homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// simple admin auth middleware (Basic Auth) - requires ADMIN_USER and ADMIN_PASS env vars
function requireAdmin(req,res,next){
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if(!user || !pass){
    // no admin credentials configured => deny access for security
    return res.status(401).json({ok:false,message:'Admin credentials not configured'});
  }
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Basic ')) return res.status(401).json({ok:false,message:'Unauthorized'});
  const creds = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8').split(':');
  if(creds[0]===user && creds[1]===pass) return next();
  return res.status(403).json({ok:false,message:'Forbidden'});
}

// init DB
db.init().then(()=> console.log('DB initialized')).catch(e=> console.error('DB init failed', e));

// API
app.get('/api/recipes', async (req,res)=>{
  try{
    const list = await db.getAllRecipes();
    res.json({ok:true, recipes: list});
  }catch(e){ res.status(500).json({ok:false,message:String(e)}); }
});

app.post('/api/recipes/import', requireAdmin, async (req,res)=>{
  try{
    const incoming = req.body; if(!Array.isArray(incoming)) return res.status(400).json({ok:false,message:'Array expected'});
    await db.upsertRecipes(incoming);
    const list = await db.getAllRecipes();
    res.json({ok:true, added: incoming.length, total: list.length});
  }catch(e){ res.status(500).json({ok:false,message:String(e)}); }
});

app.post('/api/recipes/:id', requireAdmin, async (req,res)=>{
  try{
    const id = Number(req.params.id);
    const updated = await db.updateRecipe(id, req.body);
    if(!updated) return res.status(404).json({ok:false,message:'Recipe not found'});
    res.json({ok:true, recipe: updated});
  }catch(e){ res.status(500).json({ok:false,message:String(e)}); }
});

// Accept full recipe object replacement/insert (PUT)
app.put('/api/recipes/:id', requireAdmin, async (req,res)=>{
  try{
    const id = Number(req.params.id);
    const recipe = req.body || {};
    recipe.id = id;
    // use upsert to insert or replace
    await db.upsertRecipes([recipe]);
    // return the updated recipe
    const all = await db.getAllRecipes();
    const updated = all.find(r=>r.id===id);
    if(!updated) return res.status(500).json({ok:false,message:'Failed to update'});
    return res.json({ok:true, recipe: updated});
  }catch(e){ res.status(500).json({ok:false,message:String(e)}); }
});

// synonyms endpoint: build from current recipes (simple)
app.get('/api/synonyms', async (req,res)=>{
  try{
    const list = await db.getAllRecipes();
    const map = {};
    list.forEach(r=>{
      (r.ingredients||[]).forEach(ing=>{
        const key = String(ing).toLowerCase();
        if(!map[key]) map[key] = new Set();
        map[key].add(key);
      });
    });
    const out = {};
    Object.keys(map).forEach(k=> out[k]= Array.from(map[k]));
    res.json({ok:true,synonyms: out});
  }catch(e){ res.status(500).json({ok:false,message:String(e)}); }
});

// upload image (protected)
app.post('/api/upload', requireAdmin, upload.single('file'), (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({ok:false,message:'No file uploaded'});
    const url = '/uploads/' + req.file.filename;
    res.json({ok:true, url});
  }catch(e){ res.status(500).json({ok:false,message:String(e)}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('SpareFoodCalculator server running on port', PORT));
