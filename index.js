/*const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { query } = require('express');
const { Pool } = require('pg');
*/
const { query } = require('express');
const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const { Pool } = require('pg/lib');
const PORT = process.env.PORT || 5000
const { Client } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  //connectionString: process.env.DATABASE_URL || "postgres://postgres:20000916@localhost:5432/jelon"
});

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

var recInf=null;
app.get('/test',async function(req,res){
  //recInf=null;
  var query = await client.query("DELETE FROM jelonTABLE WHERE name='"+recInf.name+"' and color='"+recInf.color+"' ;");
  var query = await client.query("select * from jelonTABLE;");
  var listq={results:query};
  res.render('pages/main',listq);
})
app.get('/main', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM jelonTABLE');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/main', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
  //var query = await client.query("select * from rectangles;");
  //var listq={results:query};
  //res.render('pages/rectangles',listq);
})
/*app.post('/main',async function(req,res){
  console.log( req.body);
  var query = await client.query("INSERT INTO jelonTABLE(name , width , height ,color ) VALUES('"+req.body.iname+"','"+req.body.iwidth+"','"+req.body.iheight+"','"+req.body.icolor+"'); ");
  console.log( "====================add========================");
  var query = await client.query("select * from jelonTABLE;");
  var listq={results:query};
  res.render('pages/main',listq);
  })*/
app.post('/add',async(req,res) =>{
  var name = req.body.name;
  var width = req.body.width;
  var height = req.body.height;
  var color = req.body.color;
  pool.query(`Insert into jelonTABLE (name,color,width,height) VALUES('${name}','${color}',${width},${height})`,async(error,results)=>{res.render('pages/add', results );})
})

app.post('/delete',async(req,res) =>{
  var id = req.body.id;
  pool.query(`delete from jelonTABLE where id = '${id}'`,async(error,results)=>{res.render('pages/delete', results );})
})
/*app.get('/delete', async(req, res) {
  service.deleteById(req.query.id, async(err) {
    res.redirect('/');
  })
});*/
app.get('/detail',(req,res)=>{
  var params = url.parse(req.url, true).query;
  recInf={name:params.name,width:params.width,height:params.height,color:params.color}
  res.render('pages/detail',recInf);
})
  app.get('/name/:id',async(req,res) =>{
  var id = req.params.id;
  pool.query(`select * from jelonTABLE where id = '${id}'`,async(error,result)=>
  {
    var data = {results:result.rows};
    res.render('pages/detail', data);
  })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


  