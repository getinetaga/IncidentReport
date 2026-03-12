const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));

const DB = path.join(__dirname, 'reports.json');

app.get('/health', (req, res)=> res.json({ok:true}));

app.post('/reports', (req, res)=>{
  const report = req.body;
  console.log('Received report:', report && report.id);
  // Append to file (simple storage)
  try{
    const cur = fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, 'utf8')||'[]') : [];
    cur.push(Object.assign({receivedAt: Date.now()}, report));
    fs.writeFileSync(DB, JSON.stringify(cur, null, 2));
  }catch(e){ console.error(e); }
  res.json({status:'ok'});
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('IncidentReport server listening on', port));
