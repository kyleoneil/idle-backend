const express = require('express');
const app = express();

app.use('/health', require('./health'));
app.use('/users', require('./users/user.router'));

module.exports = app;