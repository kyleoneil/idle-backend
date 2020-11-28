const bcrypt = require('bcrypt');
const {secretKey} = require('./../config/config');
const jwt = require('jsonwebtoken');
const userService = require('./user.service');
const AuthenticationError = require('./errors/authenticationError');

module.exports = {
  login: async (email, rawPassword) => {
    const user = await userService.findByEmail(email, true);
     if (!user || !bcrypt.compareSync(rawPassword, user.password)) {
       // DO NOT put detailed error message. See https://owasp.org/www-community/Improper_Error_Handling
       throw new AuthenticationError("User with email and password not found")
     }
    const o = {
      id: user.id,
      name: user.name,
      roleName: user.Role.name,
      email,
    }
    o.token = "Bearer " + jwt.sign(o, secretKey, {expiresIn: '4h'}); // TODO: expiry? 
    user.token = o.token;                                // TODO Completed
    user.lastLogin = new Date();
    await user.save();
    return o;
  },
  logout: async (email) => {
    const user = await userService.findByEmail(email);
    user.token = null;
    return user.save();
  },

  checkPwd: async (email, rawPass) => {
    const user = await userService.findByEmail(email, true);
    return bcrypt.compareSync(rawPass, user.password);
  }
}
