const router = require('express').Router();
const queueService = require('../services/queue.service');
const errorHandler = require('./errorHandler');

router.get('/queues/current', (req, res) => {
  let {pageNo, resultsPerPage, status} = req.query;
  status = status ? [status] : ['IN_QUEUE', 'IN_PROGRESS'];
  return queueService.getUserQueues(req.user.id, parseInt(pageNo), parseInt(resultsPerPage), status)
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res));
});

module.exports = router;
