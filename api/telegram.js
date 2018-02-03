'use strict'
const express = require('express');
const telegramRouter = express.Router();
const telegram = require('telegram-bot-api');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'telegramBot';

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

const verifiedUsers = constants.ACEPTED_USERS.evgenyId || constants.ACEPTED_USERS.evgenyId;
api.on('message', function(message)
{
    // Received text message
    let chatId = message.chat.id;
    let userName = message.from.first_name;
    let user = message.from;
    let userId = message.from.id;
    let lastUserMessage = message.text;

  if (message !== undefined && message.text === '/start') {
    if (userId === verifiedUsers) {
      api.sendMessage({
        chat_id: chatId,
        text: `Привет, ${userName}! 😁  \nЯ помогу тебе вести управленческий учет. \nТебе нужно лишь следовать подсказкам.\n \nПотратили деньги или получили? \nНажмите одну из кнопок ниже.`,
        reply_markup: JSON.stringify(welcomeToChatMessageAttachedButtons),
        parse_mode: 'HTML'
        })
        .then(function(message) {
          MongoClient.connect('mongodb+srv://evgenylad:Sharon50!@telegrambotcluster-la0aj.mongodb.net/telegramBot', (err, client) => {
            let db = client.db(dbName)
            if (err) throw err;
            let myQuery = {user: user, lastMessage: lastUserMessage};
            db.collection('messages').find({}).toArray(function(err, result) {
              console.log(result);
              if (err) throw err;
              if (!result) {
                db.collection('messages').insertOne(myQuery, function(err, result) {
                  if (err) throw err;
                  client.close();
                });
              } else {
                db.collection('messages').drop();
                db.collection('messages').insertOne(myQuery, function(err, result) {
                  if (err) throw err;
                  client.close();
                });
              }
              client.close();
            });
          });
        });
    } else {
      api.sendMessage({
        chat_id: chatId,
        text: `У вас нет доступа к данному сервису!`,
        parse_mode: 'HTML'
        })
        .then(function(message) {

        });
    }
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
    console.log('callback ', message.message.chat.id);
    console.log(message.message);
    // MongoClient.connect('mongodb+srv://evgenylad:Sharon50!@telegrambotcluster-la0aj.mongodb.net/telegramBot', (err, client) => {
    //   let db = client.db(dbName)
    //   if (err) throw err;
    //   db.collection('messages').find({}).toArray(function(err, result) {
    //     console.log(result);
    //     console.log(result[0].user.id);
    //     return result
    //   })
    //   .then(function(result) {
    //     console.log(result);
    //   });
    // });
    let obj = {};

    if (message.data === 'Income' || message.data === 'Cost') {
      api.sendMessage({
        chat_id: chatId,
        text: 'Укажите контрагента.',
        parse_mode: 'HTML'
        })
        .then(function(message) {
          console.log('message', message);
          api.on('message', function(message) {
            console.log('message 2', message);
            obj.paymentRecipient = message.text
          });
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
