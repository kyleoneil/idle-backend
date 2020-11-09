const {User} = require('./../models');
const bcrypt = require('bcrypt');
const {saltRounds, secretKey} = require('./../config/config');
const jwt = require('jsonwebtoken');
const userService = require('./user.service');
const AuthenticationError = require('./errors/authenticationError');

module.exports = {
  login: async (email, rawPassword) => {
    const user = await userService.findByEmail(email);
    if (!user || !bcrypt.compareSync(rawPassword, user.password)) {
      // DO NOT put detailed error message. See https://owasp.org/www-community/Improper_Error_Handling
      throw new AuthenticationError("User with email and password not found")
    }
    // We will deal with the expiry later
    const _generateToken = (id, name, email, expiresIn) => {
      const o = {id, name, email};
      const options = {};
      if (expiresIn) {
        options.expiresIn = expiresIn;
      }
      return 'Bearer ' + jwt.sign(o, secretKey, options);
    };
    // See https://codeburst.io/a-simple-guide-to-destructuring-and-es6-spread-operator-e02212af5831
    const {id, name, email} = user;
    return {
      token: _generateToken(user.id, user.name, user.email),
      email,
      id,
      name,
      role: <role name>
    }
  }
}