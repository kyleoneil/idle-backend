const router = require('express').Router();
const Services = require('../services/service.service');
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

module.exports = router;