
const express = require('express');
const app = express();
const appConfig = require('./../config/config');
const express_jwt = require('express-jwt');
const userService = require('./../services/user.service');
const auth = require('./../auth/token_validation');
let token = '';

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
  token = req.headers.authorization;
  const jwtUser = req.user;
  if (jwtUser && req.path !== '/auth/logout') {
    // req.user is the object signed in jwt.sign. See auth.service.js#login
    userService.findById(jwtUser.id).then((user) => {
      if (!user) {
        res.status(401).json({message: 'Unauthorized access.'});
      } else if (!user.token || user.token !== token) {
        res.status(403).json({message: 'Session timeout. Please logout then login again.'});
      } else {
        console.log({token});
        next();
      }
    })
  } else {
    next();
  }
});

app.use('/auth', require('./auth'));
app.use('/businesses', require('./businesses'));
app.use('/branches', require('./branches'));
app.use('/users', require('./users'));
app.use('/queues', require('./queues'));
app.use('/services', require('./services'));
app.use('/me', require('./me'));

module.exports = app;
