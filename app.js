require('dotenv').config();
const express = require('express');
const logger = require('./utils/logger');
const appConfig = require('./app-config');
logger.debug('Overriding \'Express\' logger');
const app = express();

app.use(require('morgan')(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
  'stream': logger.stream,
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(appConfig.apiRoot, require('./routes'));

module.exports = app;
