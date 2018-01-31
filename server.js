const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const apiRouter = require('./api/api');

//const sqlite3 = require('sqlite3');
//const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const PORT = process.env.PORT || 80;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('https://singleclick.ru/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
