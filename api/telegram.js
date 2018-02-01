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
const url = constants.TELEGRAM_URL + token;

let setWebhookUrl = url + '/setWebhook';
let deleteWebhookUrl = url + '/deleteWebhook';
let getWebhookInfoUrl = url + '/getWebhookInfo';
let urlForWebHook = constants.API_URL + 'telegram/' + token;
let setInlineButtons = url +'/InlineKeyboardMarkup'


//Create your inline keyboard markup
const welcomeToChatMessageAttachedButtons = {
  inline_keyboard: [
    [
      {
        text: 'Расход',
        callback_data: 'Cost'
      },
      {
        text: 'Приход',
        callback_data: 'Income'
      }
    ]
  ]
};

api.on('message', function(message)
{
    // Received text message
  if (message.text === '/start') {
    console.log(message.chat.id);
    let chatId = message.chat.id
    api.sendMessage({
      chat_id: chatId,
      text: 'Привет! 😁  \nЯ помогу тебе вести управленческий учет. \nТебе нужно лишь следовать подсказкам.\n \nПотратили деньги или получили? \nНажмите одну из кнопок ниже.',
      reply_markup: JSON.stringify(welcomeToChatMessageAttachedButtons),
      parse_mode: 'HTML'
      })
      .then(function(message) {
          console.log(message);
      })
      .catch(function(err) {
          console.log(err);
      });
    }

    console.log(message.callback_data);
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
    console.log(message.callback_data);
    console.log(message.data);
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
