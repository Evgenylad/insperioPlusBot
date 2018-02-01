'use strict'
const express = require('express');
const apiRouter = express.Router();
const telegramRouter = require('./telegram.js');

apiRouter.use('/telegram', telegramRouter);

apiRouter.get('/', (req, res, next) => {
  console.log('req');
});

module.exports = apiRouter;
