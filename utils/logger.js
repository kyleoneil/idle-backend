const winston = require('winston');
const fileLoggingFormat = winston.format.combine(
  winston.format.uncolorize(),
  winston.format.errors({stack: true}),
  winston.format.timestamp(),
  winston.format.json(),
);
const logger = winston.createLogger({
  level: 'info',
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({
      dirname: 'logs',
      filename: `error.log`,
      level: 'error',
      // format: winston.format.uncolorize()
      format: fileLoggingFormat
    }),
    new winston.transports.File({
      dirname: 'logs',
      filename: `combined.log`,
      format: fileLoggingFormat
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    handleExceptions: true,
    format: winston.format.simple()
  }));
}

module.exports = logger;
module.exports.stream = {
  write: (message, encoding) => {
    logger.info(message.slice(0, -1));
  }
};
