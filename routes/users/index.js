const {createUser, getUserByUserId, getUsers, updateUser, deleteUser, login} = require("./user.controller");

const router = require('express').Router();
const auth = require('./../../auth/token_validation');

router.post('/create',  (req, res) => {
  let user = req.body;
  let salt = bcrypt.genSaltSync(saltRounds);
  user.password = bcrypt.hashSync(user.password, salt);
  create(user, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "DB Connection error."
      })
    }
    return res.status(200).json({
      success: 1,
      data: results
    })
  })
});
router.get('/getuser',auth.checkToken, getUsers);
router.get('/:id', auth.checkToken, getUserByUserId);
router.patch('/', auth.checkToken, updateUser);
router.delete('/', auth.checkToken, deleteUser);
router.post('/login', login);

module.exports = router;
