const express = require('express');
const app = express();
const logger = require('./utils/logger');
const appConfig = require('./config/config');
const cors = require('cors');

logger.debug('Overriding \'Express\' logger');

app.use(require('morgan')(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
  'stream': logger.stream,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(appConfig.apiRoot, require('./routes'));

module.exports = app; 
