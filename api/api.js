const express = require('express');
const apiRouter = express.Router();
const telegramRouter = require('./telegram.js');

apiRouter.use('/telegram', telegramRouter);

module.exports = apiRouter;
