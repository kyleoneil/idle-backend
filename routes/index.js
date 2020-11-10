const express = require('express');
const app = express();

app.use('/auth', require('./auth'));
app.use('/health', require('./health'));
app.use('/users', require('./users'));
// app.use('/services', require('./services/services.router'));

module.exports = app;