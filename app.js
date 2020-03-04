var oracledb = require('oracledb');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
const db = require('./link')


// oracle  connection
var connAttrs = {
    user          : "system",
    password      : "system",
    connectString : "xe"
  }
           
  var results,connections;

//postgres pg data connetion
  const Pool = require('pg').Pool
  const pool = new Pool({
      user: 'postgres',
      host: '192.168.1.129',
      database: 'demo',
      password: 'system123#',
      port: 5432,
  })

  var arr = [];
  // Http Method: GET   oracle 
// URI        : /getUser


app.get('/getUser', function (req, res) {
  
  oracledb.getConnection(connAttrs, function (err, connection) {
     
      connection.execute("SELECT * FROM mdm_test",{}, {
          outFormat: oracledb.OBJECT // Return the result as Object
      }, function (err, results) {
          if (err) {
              throw err
            }

                          
            Object.keys(results).forEach(function(key) {
              var row = results[key];
              console.log(row.name)
            });
          
            res.contentType('application/json').status(200).send(JSON.stringify(results.rows));   
              
      });
      
  });
  
});


//CREATE NEW USER   Postgres api
const createUser = (request, response) => {
  
  const {sid,name, id } = request.body;
  
  pool.query('INSERT INTO mdm_test (sr_no,name, id) VALUES ($1, $2,$3)', [sid,name, id], (error, results) => {
    console.log("hello");
    if (error) {
      throw error
    }
    console.log("kuldeep   "+results)
    response.status(201).send(`User added with ID: ${results.sid}`)
  })
}
app.post('/postusers', createUser) //CREATE NEW USER




   // Http Method: post
// URI        : /postapi
// Read all the user profiles
app.post('/postapi', function (req, res) {
 
  oracledb.getConnection(connAttrs, function (err, connection) {
      var tid=req.body.tid;
      var name=req.body.name;
      var id =req.body.id;
      console.log(tid+"    "+name+"            "+id);
      connection.execute("INSERT INTO mdm_test VALUES(:id,:name, :city) ", [tid,name, id], {
          autoCommit: true,
          outFormat: oracledb.OBJECT // Return the result as Object
      }, function (err, result) {
          if (err) {
              throw err
            }
          //  res.status(201).set('Location', '/user_profiles/' + req.body.namekp);
            res.send(JSON.stringify({
               status:'Created User'
            }));
            res.end(); 
      });
  });
});

app.listen(3005);