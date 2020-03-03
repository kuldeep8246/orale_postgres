var oracledb = require('oracledb');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());



// connection
var connAttrs = {
    user          : "system",
    password      : "system",
    connectString : "xe"
  }
           
 

  // Http Method: GET
// URI        : /getUser
// Read all the user profiles
app.get('/getUser', function (req, res) {
  
  oracledb.getConnection(connAttrs, function (err, connection) {
     
      connection.execute("SELECT * FROM mdm_test",{}, {
          outFormat: oracledb.OBJECT // Return the result as Object
      }, function (err, result) {
          if (err) {
              throw err
            }
            res.contentType('application/json').status(200).send(JSON.stringify(result.rows));    
      });
  });
});

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