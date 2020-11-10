const router = require('express').Router();
const authService = require('./../services/auth.service');
const errorHandler = require('./errorHandler');

router.post('/login', (req, res) => {
  const {email, password} = req.body;
  // Validation should happen in controller level
  if (!email || !password) {
    res.status(400).json({message: "Email and password are required."});
    return;
  }
  return authService.login(email, password)
    .then((result) => res.json(result))
    .catch(errorHandler.handleError(res));
});
router.post('/logout', (req, res) => {
  const jwtUser = req.user;
  return authService.logout(jwtUser.email)
    .then(() => res.json({message: 'Logout successful.'}))
    .catch(errorHandler.handleError(res));
});
module.exports = router;