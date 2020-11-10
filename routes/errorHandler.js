const ServiceError = require('./../services/errors/serviceError');
const logger = require('./../utils/logger');

const logAndParseError = (err) => {
  let statusCode = 500;
  let message = 'Internal server error. Please contact administrator.';
  if (typeof err === 'string') {
    statusCode = 400;
    message = err;
  } else if (err instanceof ServiceError || err.name === 'UnauthorizedError') {
    statusCode = err.status;
    message = err.message;
  } else if (err.name === 'StatusCodeError') {
    const request = `${err.options.method} ${err.options.uri}`;
    logger.warn(`[HTTP Error] Failed to invoke request: ${request}. Response: ${JSON.stringify(err.response.body)}`);
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'RequestError') {
    message = err.message;
    if (err.cause) {
      if (err.cause.code === 'ECONNREFUSED') {
        message = 'Failed to connect to server.';
      }
      // TODO: Add more conversion of code to readable message
    }
    const request = `${err.options.method} ${err.options.uri}`;
    logger.warn(`[HTTP Error] Failed to invoke request: ${request}. Reason: ${message}`);
  } else {
    logger.error(err);
    if (err.statusCode) {
      statusCode = err.statusCode;
    } else if (err.status && parseInt(err.status)) {
      statusCode = err.status;
    }
    // TODO: Add more conversion of status codes to readable message
    if (statusCode === 400) {
      message = 'Invalid request. Please check the API if data submitted are valid.';
    } else if (statusCode === 404) {
      message = 'API does not exist.';
    } else if (err.message) {
      message = err.message;
    }
  }
  logger.error(JSON.stringify({message, statusCode}));
  logger.error(err);
  return {message, statusCode};
};

module.exports = {
  logAndParseError,
  handleError: (res) => {
    return (err) => {
      const {message, statusCode} = logAndParseError(err);
      res.status(statusCode).json({message});
    };
  }
};