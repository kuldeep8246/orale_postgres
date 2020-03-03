const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '192.168.1.129',
    database: 'demo',
    password: 'system123#',
    port: 5432,
})
const fs = require('fs');
var rawdata = fs.readFileSync('config.json');
var student = JSON.parse(rawdata);
var auth = require('basic-auth');

//CHECK AUTHENTICATION OF USER
 function checkUser (name, pass){
  for(var i=0;i<student.users.length;i++)
  {
    if (student.users[i].name==name && student.users[i].pwd==pass)
    {   
        console.log(student.users[i].name+" Exists");
        return true;
    }
  }
      console.log("Check Username and Password")
      return false;
}



//GET USER DETAILS
const getUsers = (request, response) => {
 
  pool.query('SELECT * FROM mdm_test', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}





//CREATE NEW USER
const createUser = (request, response) => {
  
  const {sid,name, id } = request.body;
  
  pool.query('INSERT INTO mdm_test (sr_no,name, id) VALUES ($1, $2,$3)', [sid,name, id], (error, results) => {
    console.log("hello");
    if (error) {
      throw error
    }
    console.log("kuldeep   "+results)
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}




const getUsers1 = (request, response) => {
    pool.query('SELECT * FROM mdm_test', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
//IMPORTING FUNCTIONS TO BE CALLED IN MAINLINK.JS
module.exports = {
  checkUser,
  getUsers,
  createUser,
  getUsers1,
}