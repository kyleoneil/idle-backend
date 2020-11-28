const router = require('express').Router();
const authService = require('./../services/auth.service');
const userService = require('./../services/user.service');
const errorHandler = require('./errorHandler');
let token = '';
router.post('/login', (req, res) => {
  const {email, password} = req.body;
  // Validation should happen in controller level
  if (!email || !password) {
    res.status(400).json({message: "Email and password are required."});
    return;
  }

  return userService.userExists(email).then((exists) => {
    if (!exists) {
      res.status(400).json({message: "Account does not exist."});
    } else {
      authService.checkPwd(email, password).then((valid) => {
        if (!valid) {
          res.status(400).json({message: "Password is incorrect."});
        } else {
          authService.login(email, password)
            .then((result) => res.json(result))
            .catch(errorHandler.handleError(res));
        }
      })
    }
  })
});

router.post('/logout', (req, res) => {
  const jwtUser = req.user;
  return authService.logout(jwtUser.email)
    .then(() => res.json({message: 'Logout successful.'}))
    .catch(errorHandler.handleError(res));
});

module.exports = router;