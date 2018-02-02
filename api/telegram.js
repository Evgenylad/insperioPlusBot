'use strict'
const express = require('express');
const telegramRouter = express.Router();
const telegram = require('telegram-bot-api');
const DB = require('../db/db');

let api = new telegram({
  token: '516400841:AAF_JfiI53pYZejY2jW4lRguhJh1MTPepfY',
  updates: {
    enabled: true
  }
});

const constants = require('../config/constants');
const axios = require('axios');
const token = constants.TELEGRAM_TOKEN;
const url = constants.TELEGRAM_URL + token;

let setWebhookUrl = url + '/setWebhook';
let deleteWebhookUrl = url + '/deleteWebhook';
let getWebhookInfoUrl = url + '/getWebhookInfo';
let urlForWebHook = constants.API_URL + 'telegram/' + token;
let setInlineButtons = url +'/InlineKeyboardMarkup'
let db = new DB;

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
  if (message !== undefined && message.text === '/start') {
    let chatId = message.chat.id
    console.log(db);

    api.sendMessage({
      chat_id: chatId,
      text: 'Привет! 😁  \nЯ помогу тебе вести управленческий учет. \nТебе нужно лишь следовать подсказкам.\n \nПотратили деньги или получили? \nНажмите одну из кнопок ниже.',
      reply_markup: JSON.stringify(welcomeToChatMessageAttachedButtons),
      parse_mode: 'HTML'
      })
      .then(function(message) {
        db.connect('mongodb:test')
          .then((message) => {
            let text = message.text;
            console.log(text);
            db.createCollection('messages', (err, res) => {
              console.log(res);
            });
          })
      })
      .catch(function(err) {
          console.log(err);
      });
    }
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
    let chatId = message.message.chat.id
    console.log('calback ', message.message.chat.id);
    if (message.data === 'Income') {
      api.sendMessage({
        chat_id: chatId,
        text: 'От кого получили? \nУкажите контрагента.',
        parse_mode: 'HTML'
        })
        .then(function(message) {
          console.log(message);
        })
        .catch(function(err) {
            console.log(err);
        });
    } else if (message.data === 'Cost') {
      api.sendMessage({
        chat_id: chatId,
        text: 'Кому заплатили? \nУкажите контрагента.',
        parse_mode: 'HTML'
        })
        .then(function(message) {
          console.log(message);
        })
        .catch(function(err) {
            console.log(err);
        });
    }
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
    //console.log(message);
});

module.exports = telegramRouter;
