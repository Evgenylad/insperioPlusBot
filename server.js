'use strict'
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let key = fs.readFileSync('../encryption/private.key');
let cert = fs.readFileSync( '../encryption/singleclick.csr' );

let https = require('https');

const apiRouter = require('./api/api');

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 443;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('https://singleclick.ru/api', apiRouter);

let options = {
  key: key,
  cert: cert
}

https.createServer(options, app).listen(443, () => {
  console.log(options);
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
