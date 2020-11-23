const router = require('express').Router();
const Service = require('../services/service.service');
const errorHandler = require('./errorHandler');

router.get('/:id', (req, res) => {
    return Services.getServiceDetails(req.params.id)
        .then((service) => res.json(service))
        .catch(errorHandler.handleError(res));
});

// router.get('/:id/queues', (req, res) => {
//     return Services.getServiceDetails(req.params.id)
//         .then((service) => res.json(service))
//         .catch(errorHandler.handleError(res));
// });

router.patch('/nextqueue', (req, res) => {
    const body = req.body;
    // if (   if the caller is not a superadmin basically if the caller is a user   ) {
    //     res.status(403).json({message: "User is not authorized to get the next queue"});
    //     return;
    //   }
    Service.nextQueue(body.service_id)
    .then((data) => res.json({id: data.id,queue_number: data.queue_number, message: "Next queue."}))
    .catch(errorHandler.handleError(res));
});

module.exports = router;