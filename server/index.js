const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: '*' }));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/CruTransferDb', { useNewUrlParser: true });
const db = mongoose.connection;

// Added check for DB connection
if (!db)
  console.log("Error connecting db")
else
  console.log("Db connected successfully")

// Setup server port
const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Hello World!'));

const apiRoutes = require('./api-routes');
app.use('/api', apiRoutes);


// Command: nodemon index
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})