const {createUser, getUserByUserId, getUsers, updateUser, deleteUser, login} = require("./user.controller");

const router = require('express').Router();
const auth = require('./../../auth/token_validation');

router.post('/create', createUser);
router.get('/getuser',auth.checkToken, getUsers);
router.get('/:id', auth.checkToken, getUserByUserId);
router.patch('/', auth.checkToken, updateUser);
router.delete('/', auth.checkToken, deleteUser);
router.post('/login', login);

module.exports = router;
