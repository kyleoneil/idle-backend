const router = require('express').Router();
const queueService = require('../services/queue.service');
const errorHandler = require('./errorHandler');

router.get('/queues', (req, res) => {
  let {pageNo, resultsPerPage, status} = req.query;
  let pgNum = pageNo ? parseInt(pageNo) : 1;
  let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
  status = status ? [status] : ['IN_QUEUE', 'IN_PROGRESS'];
  return queueService.getUserQueues(req.user.id, pgNum, pgRes, status)
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res));
});

module.exports = router;
