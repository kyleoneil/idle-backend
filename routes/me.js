const router = require('express').Router();
const queueService = require('../services/queue.service');
const userService = require('../services/user.service');
const errorHandler = require('./errorHandler');

router.get('/', (req, res) => {
  userService.findById(req.user.id)
    .then((user) => res.json(user))
    .catch(errorHandler.handleError(res));
});

router.get('/queues/current', (req, res) => {
  let {pageNo, resultsPerPage} = req.query;
  return queueService.getUserQueues(req.user.id, parseInt(pageNo), parseInt(resultsPerPage), ['IN_QUEUE', 'IN_PROGRESS'])
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res));
});

router.get('/queues/history', (req, res) => {
  let {pageNo, resultsPerPage} = req.query;
  return queueService.getUserQueues(req.user.id, parseInt(pageNo), parseInt(resultsPerPage), ['NO_SHOW', 'COMPLETED'])
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res));
});

module.exports = router;
