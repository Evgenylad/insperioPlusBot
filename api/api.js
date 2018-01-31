const express = require('express');
const apiRouter = express.Router();
const artistsRouter = require('./telegram.js');

apiRouter.use('/telegram', telegramRouter);

module.exports = apiRouter;
