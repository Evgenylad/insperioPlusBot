'use strict'
const express = require('express');
const apiRouter = express.Router();

apiRouter.use('/telegram', telegramRouter);

apiRouter.get('/', (req, res, next) => {
  console.log('req');
});

module.exports = apiRouter;
