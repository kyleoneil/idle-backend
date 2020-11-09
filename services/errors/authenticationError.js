module.exports = class extends require('./serviceError') {
  constructor(message, statusCode) {
    super(message, statusCode || 401);
  }
};