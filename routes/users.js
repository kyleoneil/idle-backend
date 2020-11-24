const router = require('express').Router();
const dateUtil = require('./../utils/dateUtil');
const userService = require('./../services/user.service');
const errorHandler = require('./errorHandler');

router.post('/', (req, res) => {
  /**
   * @type {{firstname:string, lastname:string, birthdate:string, email:string,password:string}}
   */
  const body = req.body;
  // Validation should happen in controller level
  if (!body.firstname || !body.lastname || !body.email || !body.password) {
    res.status(400).json({message: "First name, last name, email and password are required."});
    return;
  }
  // Birthdate is optional?
  if (body.birthdate && !dateUtil.isValidDateString(body.birthdate)) {
    res.status(400).json({message: "Invalid birthdate format. Should be MM/dd/yyyy."});
    return;
  }
  // You cannot use await here. See https://javascript.info/async-await#await
  return userService.userExists(body.email).then((exists) => {
    if (exists) {
      res.status(400).json({message: "User already exists"});
    } else {
      userService.create(body)
        .then((user) => res.json({id: user.id, message: "User successfully created."}))
        .catch(errorHandler.handleError(res));
    }
  })
});

router.get('/:id', (req, res) => {
  let {pageNo, resultsPerPage} = req.query;
  return userService.findById(req.params.id)
    .then((user) => res.json(user)) // res.json is equivalent to res.status(200).json(...);
    .catch(errorHandler.handleError(res));
});

router.get('/', (req, res) => {
  let {pageNo, resultsPerPage} = req.query;
  let pgNum = (pageNo) ? pageNo : 1;
  let pgRes = (resultsPerPage) ? resultsPerPage : 10;
  return userService.findPaginated(pgNum, pgRes)
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res));
});

router.post('/', (req, res) => {
  /**
   * @type {{firstname:string, lastname:string, birthdate:string, email:string, password:string}}
   */
});

module.exports = router;
