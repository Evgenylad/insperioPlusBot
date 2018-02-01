'use strict'
const express = require('express');
const telegramRouter = express.Router();
const telegram = require('telegram-bot-api');

let api = new telegram({
  token: '516400841:AAF_JfiI53pYZejY2jW4lRguhJh1MTPepfY',
  updates: {
    enabled: true
  }
});

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database('../db.sqlite');

const constants = require('../config/constants');
const axios = require('axios');
const token = constants.TELEGRAM_TOKEN;
const url = constants.TELEGRAM_URL;

let setWebhookUrl = url + token + '/setWebhook';
let getWebhookInfoUrl = url + token + '/getWebhookInfo';
let urlForWebHook = constants.API_URL + 'telegram/' + api.token;

api.setWebhook(setWebhookUrl,  {
    url: urlForWebHook
  })
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.log('error', error);
  });

api.on('message', function(message)
{
    // Received text message
    console.log(message);
});

api.on('inline.query', function(message)
{
    // Received inline query
    console.log(message);
});

api.on('inline.result', function(message)
{
    // Received chosen inline result
    console.log(message);
});

api.on('inline.callback.query', function(message)
{
    // New incoming callback query
    console.log(message);
});

api.on('edited.message', function(message)
{
    // Message that was edited
    console.log(message);
});

api.on('update', function(message)
{
    // Generic update object
    // Subscribe on it in case if you want to handle all possible
    // event types in one callback
    console.log(message);
});

module.exports = telegramRouter;
