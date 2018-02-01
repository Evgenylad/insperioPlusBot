'use strict'
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

let http = require('http');
let https = require('https');

const apiRouter = require('./api/api');

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 443;
// Indicate the middleware that Express should use
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());

// Define a single route; to be used to provide the Mongopop Restfull
// API
app.use('/api', apiRouter);

// The `public` folder will contain the files that need to be accessed
// by the client app (e.g. Angular .js files).
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(function(req, res) {
  console.log(req);
  file.serve(req, res);
}).listen(80);

https.createServer(function(req, res) {
  console.log(req);
}).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
