const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'CruTransferDB';
// const client = new MongoClient(url);
// // Use connect method to connect to the server
// client.connect(function (err) {
//   assert.equal(null, err);
//   console.log('Connected successfully to MongoDb');

//   const db = client.db(dbName);

//   client.close();
// });

let bodyParser = require('body-parser');
let mongoose = require('mongoose');

const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/CruTransferDb', { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Hello World!'));

let apiRoutes = require('./api-routes');
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})