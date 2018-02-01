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
/*
http.createServer((otpions, app) => {
  console.log('otpions');
}).listen(80, (res, req, next) => {
  console.log(`Server is listening on port 80`);
}).listen(PORT, (res, req, next) => {
  console.log(res.on());
  console.log(`Server is listening on port ${PORT}`);
});; */

let server = new http.Server(function(req, res) {
  // API сервера будет принимать только POST-запросы и только JSON, так что записываем
  // всю нашу полученную информацию в переменную jsonString
  var jsonString = '';
  res.setHeader('Content-Type', 'application/json');
  req.on('data', (data) => { // Пришла информация - записали.
    console.log('data');
      jsonString += data;
  });
  console.log(res.on('data'));

  req.on('end', () => {// Информации больше нет - передаём её дальше.
      routing.define(req, res, jsonString); // Функцию define мы ещё не создали.
  });
});
server.listen(443);

module.exports = app;
