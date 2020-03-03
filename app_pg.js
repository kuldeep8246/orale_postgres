const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./link')
const port = 3005

var auth = require('basic-auth');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/api', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

  
app.get('/getusers', db.getUsers) //GET USER DETAILS
app.get('/getusers12', db.getUsers1) //GET USER DETAILS



app.post('/postusers', db.createUser) //CREATE NEW USER



app.listen(port, () => {
  console.log(`App running on port ${port}.`) //3005
})