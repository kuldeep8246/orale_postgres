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
     
  app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
  app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});
// Http Method: GET
// URI        : /getapi
// Read all the user profiles
app.post('/auth', function (req, res) {
    var name = req.body.username;
    var password = req.body.password;
    console.log("user   "+name+"  pass   "+password);
	

    oracledb.getConnection(connAttrs, function (err, connection) {
       
        connection.execute("SELECT * FROM empuser where name=:name and password=:password", {name,password}, {
            
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {
            
           // rs.getRows;
            console.log("LENGTH-->"+ result.length)
            if (result.length > 0) {
			//	req.session.loggedin = true;
				//req.session.username = username;
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
                
        });
    });

  });


  app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});




//   post data in oracle db......
// Http Method: GET
// URI        : /getapi
// Read all the user profiles
app.post('/register', function (req, res) {
    var name = req.body.username;
    var password = req.body.password;
    var city = req.body.city;
    var phoneno = req.body.number;

    console.log("user   "+name+"  pass   "+password+" city  "+city+"number "+phoneno);
	

    oracledb.getConnection(connAttrs, function (err, connection) {
       
        connection.execute("insert into empuser values(emp_seq.nextval,:name,:city,:password,:phoneno)", {name,city,password,phoneno}, {
            autoCommit: true,
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function (err, result) {

            console.log('hello '+result)
            
            res.send("User Created ....")
			res.end();
                
        });
    });

  });

app.listen(3005);