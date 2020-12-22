const router = require('express').Router();
const dateUtil = require('./../utils/dateUtil');
const authService = require('./../services/auth.service');
const businessService = require('./../services/business.service');
const branchService = require('./../services/branch.service');
const userService = require('./../services/user.service');
const queueService = require('../services/queue.service');
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

  if (body.roleName === 'BUSINESS_OWNER' || body.roleName === 'BUSINESS_TELLER') {
    if (body.business_id) {
      businessService.findBusinessById(body.business_id).then((result) => {
        if (!result) {
          res.status(400).json({message: "Given business is not registered."});
        }
      }).catch(errorHandler.handleError(res));
    } else if (body.branch_id) {
      branchService.findById(body.branch_id).then((results) => {
        if (!results) {
          res.status(400).json({message: "Given branch is not registered."});
        }
      }).catch(errorHandler.handleError(res));
    } else {
      res.status(400).json({message: "Please enter valid business or branch."});
    }
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
  let pgNum = pageNo ? parseInt(pageNo) : 1;
  let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
  return userService.findPaginated(pgNum, pgRes)
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res));
});

router.post('/', (req, res) => {
  /**
   * @type {{firstname:string, lastname:string, birthdate:string, email:string, password:string}}
   */
});

router.get('/current/queues', (req, res) => {
  let {pageNo, resultsPerPage} = req.query;
  let pgNum = pageNo ? parseInt(pageNo) : 1;
  let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
  return userService.findPaginated(pgNum, pgRes)
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res));
});

router.put('/:id', (req, res) => {
  /**
   * @type {{firstname:string, lastname:string, birthdate:string, email:string, password:string}}
   */
  
  const roleName = req.user.roleName;
  return authService.isAuthorized(roleName, 'SUPER_ADMIN').then((result) => {
    if(result) {
      const body = req.body;
      if (!body.firstname || !body.lastname || !body.email || !body.password) {
        res.status(400).json({message: "First name, last name, email and password are required."});
        return;
      }

      if (body.birthdate && !dateUtil.isValidDateString(body.birthdate)) {
        res.status(400).json({message: "Invalid birthdate format. Should be MM/dd/yyyy."});
        return;
      }

      if (body.business_id) {
        businessService.findBusinessById(body.business_id).then((result) => {
          if (!result) {
            res.status(400).json({message: "Given business is not registered."});
            return; 
          }
        })
      } else if (body.branch_id) {
        branchService.findById(body.branch_id).then((result) => {
          if (!result) {
            res.status(400).json({message: "Given branch is not registered."});
            return; 
          }
        })
      } else {
        res.status(400).json({message: "Please enter valid business or branch."});
        return;
      }

      return userService.userExists(body.email).then((exists) => {
        if (!exists) {
          res.status(400).json({message: "User does not exist."});
        } else {
          userService.update(req.params.id, body)
            .then((user) => res.json({id: user.id, message: "User successfully updated."}))
            .catch(errorHandler.handleError(res));
        }
      })
    } else {
      res.status(400).json({message: "User is not authorized to make changes."});
      return;
    }
    
  }); 
  
});

module.exports = router;
