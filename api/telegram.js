const express = require('express');
const telegramRouter = express.Router();

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database('../db.sqlite');

const constants = require('../config/constants');
const axios = require('axios');
const token = constants.TELEGRAM_TOKEN;
const url = constants.TELEGRAM_URL;
console.log(token);

/*
let setWebhookUrl = url + token + '/setWebhook';
let urlForWebHook = constants.API_URL + 'telegram/' + token;
console.log(urlForWebHook);

axios
  .post(setWebhookUrl, {
    url: urlForWebHook
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(error => {
    console.log(error);
  });
*/
telegramRouter.post('/', (req, res, next) => {
  console.log(req);
});

module.exports = telegramRouter;
