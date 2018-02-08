'use strict'
const express = require('express');
const telegramRouter = express.Router();
const telegram = require('telegram-bot-api');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
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
let setInlineButtons = url +'/InlineKeyboardMarkup';
let userInMessages;
let userInCosts;

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

const cashOrTransferMessageAttachedButtons = {
  inline_keyboard: [
    [
      {
        text: 'Наличные',
        callback_data: 'Cash'
      },
      {
        text: 'Безнал',
        callback_data: 'Transfer'
      }
    ]
  ]
};

const spendingMessageAttachedButtons = {
  inline_keyboard: [
    [
      {
        text: 'Зарплата',
        callback_data: 'Salary'
      },
      {
        text: 'Представительские',
        callback_data: 'Hospitality'
      }
    ],
    [
      {
        text: 'Налоги',
        callback_data: 'Taxes'
      },
      {
        text: 'Банковские расходы',
        callback_data: 'Bank'
      }
    ],
    [
      {
        text: 'Гонорар',
        callback_data: 'Fee'
      },
      {
        text: 'Выручка',
        callback_data: 'Income'
      }
    ],
    [
      {
        text: 'Транспортные',
        callback_data: 'Transportation'
      },
      {
        text: 'Бухгалтерские расходы',
        callback_data: 'Accountant'
      }
    ]
  ]
}

const verifiedUsers = constants.ACEPTED_USERS.evgenyId || constants.ACEPTED_USERS.evgenyId;

// Helper function to write one doc to collection
let insertOneToAnyDb = (collection, query, db) => {
  // db.collection(collection).find({}).toArray(function(err, result) {
  //   let elem = result.length - 1;
  //
  //   console.log(result.length);
  //   console.log('result in getAllElements callback', result);
  //   console.log('result in getAllElements callback', result[elem]);
  //
  //   db.collection(collection).insertOne(query, function(err, result) {
  //     if (err) throw err;
  //     console.log('query have been inserted to db', query);
  //   });
  // });

  db.collection(collection).insertOne(query, function(err, result) {
    if (err) throw err;
    console.log('query have been inserted to db', query);
    console.log('result ', result);
  });
};

// Helper function to call MongoDb
let callToMongoDb = (query, collection, callback) => {
  MongoClient.connect('mongodb+srv://evgenylad:Sharon50!@telegrambotcluster-la0aj.mongodb.net/telegramBot', (err, client) => {
    let db = client.db(dbName)
    if (err) throw err;
    callback(db, collection, query);
    client.close();
  });
};

// Helper function to retrieve all elements from MongoDb
let getAllElements = (db, collection, elem) => {
  db.collection(collection).find({}).toArray(function(err, result) {
    console.log('result in getAllElements callback', typeof result.paymentTypeClicked);
  });
};

// Helper function to retrieve element from MongoDb. Elem should has Object type.
let findElement = (db, collection, elem) => {
  db.collection(collection).findOne(elem, function(err, result) {
    console.log('result in findElement callback', result);
  });
};

api.on('message', function(message)
{

});

api.on('inline.query', function(message)
{
    // Received inline query
    console.log('message inline result', message);
});

api.on('inline.result', function(message)
{
    // Received chosen inline result
    console.log('message inline result', message);
});

api.on('inline.callback.query', function(message)
{
    // New incoming callback query

});

api.on('edited.message', function(message)
{
    // Message that was edited
    console.log('edited message', message);
});

api.on('update', function(message)
{
  // Received text message
  console.log('message type on message', message);
  let chatId;
  let userName;
  let user;
  let userId;
  let lastUserMessage;

  if (message.message !== undefined) {
    message = message.message;
    chatId = message.chat.id;
    userName = message.from.first_name;
    user = message.from;
    userId = message.from.id;
    lastUserMessage = message.text;
    console.log('textMessage ', message);
  } else if (message.callback_query !== undefined) {
    console.log('callbackQuery ', message);
    message = message.callback_query;
    message = message.message;
    chatId = message.chat.id;
    userName = message.from.first_name;
    user = message.from;
    userId = message.from.id;
    lastUserMessage = message.text;
  }

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
            let messageQuery = {userId: chatId, lastMessage: lastUserMessage};
            db.collection('messages').find({}).toArray(function(err, result) {
              console.log('messages in db', result.length);
              if (err) throw err;

              if (result.length === 0) {
                console.log('Пустая коллекция messages', result);
                insertOneToAnyDb('messages', messageQuery, db);
              } else if (user.id === result[0].userId) {
                console.log('messages in db', result);
                db.collection('messages').drop();
                insertOneToAnyDb('messages', messageQuery, db);
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
  } else if (message.text === undefined && message.data !== undefined) {
    console.log('message data - ', message);
    let chatId = message.message.chat.id;
    let user = message.message.chat;
    console.log('user', chatId);

    let obj = {};
    let messageQuery = {};

    if (message.data === 'Income' || message.data === 'Cost') {
      console.log('message type on inline btn click', message);
      obj = {userId: chatId, cashFlowType: message.data};
      messageQuery = {userId: chatId, welcomeBtnClicked: true};
      // Asking paymentRecipient message code start
      api.sendMessage({
        chat_id: chatId,
        text: 'Укажите контрагента.',
        parse_mode: 'HTML'
        })
        .then(function(message) {
          callToMongoDb(obj, 'costs', insertOneToAnyDb)
        })
        .catch(function(err) {
          console.log(err);
        })
    } else if (message.data === 'Cash' || message.data === 'Transfer') {
      api.sendMessage({
        chat_id: chatId,
        text: 'Введите сумму. \nЗнаки ➕ или ➖ указывать НЕ надо.',
        parse_mode: 'HTML'
        })
        .then(function(message) {
          callToMongoDb(obj, 'costs', insertOneToAnyDb)
        })
        .catch(function(err) {
          console.log(err);
        })
    }
  } else {
    callToMongoDb(null, 'messages', getAllElements);
  }
    // Generic update object
    // Subscribe on it in case if you want to handle all possible
    // event types in one callback
    //console.log(message);
});

module.exports = telegramRouter;
