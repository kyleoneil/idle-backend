const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({dirname: 'logs', filename: `error.log`, level: 'error'}),
    new winston.transports.File({dirname: 'logs', filename: `combined.log`}),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.simple(),
  }));
}

module.exports = logger;
module.exports.stream = {
  write: (message, encoding) => {
    logger.info(message.slice(0, -1));
  }
};
