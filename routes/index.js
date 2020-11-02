const express = require('express');
const app = express();

app.use('/health', require('./health'));

module.exports = app;