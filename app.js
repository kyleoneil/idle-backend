const express = require('express');
const app = express();
const logger = require('./utils/logger');
const appConfig = require('./config/config');
const errorHandler = require('./routes/errorHandler');

const cors = require('cors');

logger.debug('Overriding \'Express\' logger');

app.use(require('morgan')(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
  'stream': logger.stream,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(appConfig.apiRoot, require('./routes'));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  errorHandler.handleError(res)(err);
});
module.exports = app; 
