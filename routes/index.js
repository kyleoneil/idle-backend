const express = require('express');
const app = express();
const appConfig = require('./../config/config');
const express_jwt = require('express-jwt');
const userService = require('./../services/user.service');

app.use('/', express_jwt({
  secret: appConfig.secretKey,
  algorithms: ['HS256'],
  credentialsRequired: true
}).unless(
  {
    path: [  // Exclude listed routes from authentication
      /\/health/,
      /\/auth\/login$/,
      {
        url: /\/users$/, // Exclude POST /users or user registration
        methods: 'POST'
      },
    ]
  }
), function (req, res, next) {
  let token = req.headers.authorization;
  const jwtUser = req.user;
  if (jwtUser && req.path !== '/auth/logout') {
    // req.user is the object signed in jwt.sign. See auth.service.js#login
    userService.findById(jwtUser.id).then((user) => {
      if (!user) {
        res.status(401).json({message: 'Unauthorized access.'});
      } else if (!user.token || user.token !== token) {
        res.status(403).json({message: 'Session timeout. Please logout then login again.'});
      } else {
        next();
      }
    })
  } else {
    next();
  }
});

app.use('/auth', require('./auth'));
app.use('/health', require('./health'));
app.use('/users', require('./users'));
// app.use('/services', require('./services/services.router'));

module.exports = app;