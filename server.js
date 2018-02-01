'use strict'
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let http = require('http');
let https = require('https');

const apiRouter = require('./api/api');

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 443;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('https://singleclick.ru/api', apiRouter);

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
