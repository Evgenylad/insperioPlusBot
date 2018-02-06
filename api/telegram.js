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

const verifiedUsers = constants.ACEPTED_USERS.evgenyId || constants.ACEPTED_USERS.evgenyId;

// Helper function to write one doc to collection
let insertOneToAnyDb = (collectionName, query, db) => {
  db.collection(collectionName).insertOne(query, function(err, result) {
    if (err) throw err;
    console.log('query have been inserted to db', query);
  });
};

// Helper function to call MongoDb
let callToMongoDb = (query, collection, callback) => {
  MongoClient.connect('mongodb+srv://evgenylad:Sharon50!@telegrambotcluster-la0aj.mongodb.net/telegramBot', (err, client) => {
    let db = client.db(dbName)
    if (err) throw err;
    console.log(query);
    console.log(callback);
    callback(db, collection, query);
    client.close();
  });
};

// Helper function to retrieve all elements from MongoDb
let getAllElements = (db, collection, elem) => {
  db.collection(collection).find({}).toArray(function(err, result) {
    console.log('result in getAllElements callback', result);
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
            let messageQuery = {userId: chatId, lastMessage: lastUserMessage};
            db.collection('messages').find({}).toArray(function(err, result) {
              console.log('messages in db', result[0].lastMessage);
              if (err) throw err;

              if (!result) {
                insertOneToAnyDb('messages', messageQuery, db);
              } else if (user.id === result[0].userId) {
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
  } else {
    callToMongoDb(null, 'messages', getAllElements);
  }
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
    let chatId = message.message.chat.id;
    let user = message.message.chat;
    console.log('user', chatId);

    let obj = {};
    let messageQuery = {};

    if (message.data === 'Income' || message.data === 'Cost') {
      obj = {userId: chatId, cashFlowType: message.data};
      messageQuery = {userId: chatId, welcomeBtnClicked: true};
      // Asking paymentRecipient message code start
      api.sendMessage({
        chat_id: chatId,
        text: 'Укажите контрагента.',
        parse_mode: 'HTML'
        })
        .then(function(message) {
          console.log('message', message);
          console.log('obj1 - ', obj);
          api.on('message', function(message) {
            if (message.text !== '/start') {
              console.log('message 2', message);
              obj.paymentRecipient = message.text;
              console.log('obj2 - ', obj);
              // Asking paymentType message code start
              api.sendMessage({
                chat_id: chatId,
                text: 'Нажмите одну из двух кнопок ниже, чтобы выбрать тип платежа',
                parse_mode: 'HTML',
                reply_markup: JSON.stringify(cashOrTransferMessageAttachedButtons)
              })
              .then(function(message) {
                api.on('inline.callback.query', function(message) {
                  if (message.data === 'Cash' || message.data === 'Transfer') {
                    console.log(message.data);
                    messageQuery.paymentTypeClicked = true;
                    obj.paymentType = message.data;
                    console.log('obj3 - ', obj);
                    console.log('messageQuery3 - ', messageQuery);

                    // Start of saving payment details to DB. Part 1.
                    MongoClient.connect('mongodb+srv://evgenylad:Sharon50!@telegrambotcluster-la0aj.mongodb.net/telegramBot', (err, client) => {
                      let db = client.db(dbName)
                      console.log(' Объект до сохранения в базу расходов первый раз - ', obj);
                      if (err) throw err;

                      db.collection('costs').find({}).toArray(function(err, result) {
                        console.log('записи сохраненные в базе на данный момент', result);
                        if (err) throw err;
                        if (!result) {
                          console.log('!result');
                          db.collection('messages').drop();
                          insertOneToAnyDb('costs', obj, db);
                          insertOneToAnyDb('messages', obj, db);
                        } else {
                          console.log('has result');
                          db.collection('messages').drop();
                          insertOneToAnyDb('costs', obj, db);
                          insertOneToAnyDb('messages', obj, db);
                          api.sendMessage({
                            chat_id: chatId,
                            text: 'Укажите сумму.',
                            parse_mode: 'HTML'
                          })
                          .then(function(message) {
                            console.log(message);
                          })
                          .catch(function(err) {
                            console.log(err);
                          })
                        }
                        client.close();
                      });
                    });
                    // End of saving payment details to DB. Part 1.
                  }
                });
              })
              .catch(function(err) {
                console.log(err);
              });
              // Asking paymentType message code end
            }
          });
        })
        .catch(function(err) {
            console.log(err);
        });
      // Asking paymentRecipient message code end
    }
});

api.on('edited.message', function(message)
{
    // Message that was edited
    console.log('edited message', message);
});

api.on('update', function(message)
{
    // Generic update object
    // Subscribe on it in case if you want to handle all possible
    // event types in one callback
    //console.log(message);
});

module.exports = telegramRouter;
