const router = require('express').Router();
const userService = require('./../services/user.service');
//const Services = require('./../services/service.service');
const queueService = require('./../services/queue.service');
const errorHandler = require('./errorHandler');

router.post('/', (req, res) => {
    const body = req.body;
     if ( !body.user_id || !body.service_id) {
         res.status(400).json({message: "There is no user id or servrice id"});
         return;
       }
       userService.findById(body.user_id).then((exists) => {
        if (!exists) {
          res.status(400).json({message: "User doesn't exists"});
        } else {
         queueService.createQueue(body)
        .then((id) => res.json({id: id, message: "Queue successfully created."}))
        .catch(errorHandler.handleError(res));
        }
        });
});

router.post('/:id/completed', (req, res) => {
    queueService.markQueueAsCompleted(req.params.id)
    .then((data) => res.json({data: data, message: "Queue successfully updated."}))
    .catch(errorHandler.handleError(res));
});

router.get('/', (req, res) => {
  let {pageNo, resultsPerPage, serviceId, status} = req.query;
  let pgNum = pageNo ? parseInt(pageNo) : 1;
  let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
  return queueService.findAll(pgNum, pgRes, serviceId, status)
    .then((data) => res.json({data: data, message: "Queue List fetched."}))
    .catch(errorHandler.handleError(res));
});

router.get('/:id/currentqueue', (req, res) => {
  return queueService.getInProgress(req.params.id)
    .then((data) => res.json({data: data}))
    .catch(errorHandler.handleError(res));
});

router.patch('/:id', (req, res) => {
  let {status} = req.query;
  const uID = req.params.id;
  const tellerID = parseInt(req.user.id)
  return queueService.update(uID, tellerID, status)
    .then((results) => res.json({data: results, message: "Queue Updated Successfully."}))
    .catch(errorHandler.handleError(res));
});

module.exports = router;
