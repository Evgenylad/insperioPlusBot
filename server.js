'use strict'
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');

let key = fs.readFileSync('../encryption/private.key');
let cert = fs.readFileSync( '../encryption/singleclick.csr' );

let http = require('http');
let https = require('https');

const apiRouter = require('./api/api');

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 443;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api', apiRouter);

let options = {
  key: key,
  cert: cert
}

http.createServer((otpions, app) => {
  console.log('app');
  file.serve(req, res);
}).listen(80);

https.createServer((otpions, app) => {
  console.log(app);
}).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
