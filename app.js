const express = require('express');
const logger = require('./utils/logger');
logger.debug('Overriding \'Express\' logger');
const app = express();
app.use(require('morgan')(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
  'stream': logger.stream,
}));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
