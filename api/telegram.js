'use strict'
const express = require('express');
const telegramRouter = express.Router();

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database('../db.sqlite');

const constants = require('../config/constants');
const axios = require('axios');
const token = constants.TELEGRAM_TOKEN;
const url = constants.TELEGRAM_URL;

let setWebhookUrl = url + token + '/setWebhook';
let getWebhookInfoUrl = url + token + '/getWebhookInfo';
let urlForWebHook = constants.API_URL + 'telegram/' + token;

axios.post(setWebhookUrl, {
    url: urlForWebHook
  })
  .then(res => {
  })
  .catch(error => {
    console.log('error', error);
  });

axios.get(getWebhookInfoUrl)
  .then(res => {
  })
  .catch(error => {
    console.log('error', error);
  });

telegramRouter.post('/', (req, res, next) => {
  console.log('query');
  console.log(req.query);
});

module.exports = telegramRouter;
