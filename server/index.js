const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const express = require('express')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: '*' }));


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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})