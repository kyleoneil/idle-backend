const router = require('express').Router();
const Services = require('../services/service.service');
const errorHandler = require('./errorHandler');

router.get('/:id', (req, res) => {
    return Services.getServiceDetails(req.params.id)
        .then((service) => res.json(service))
        .catch(errorHandler.handleError(res));
});

router.get('/:id/queues', (req, res) => {
    let {pageNo, resultsPerPage} = req.query;
    let pgNum = (pageNo) ? pageNo : 1;
    let pgRes = (resultsPerPage) ? resultsPerPage : 10;
    return Services.getServiceQueue(req.params.id, pgNum, pgRes)
        .then((service) => {
            if(service){
                res.json(service);
            }else{
                res.json({message: "Service queue is empty."});
            }
        }) 
        .catch(errorHandler.handleError(res));
});

module.exports = router;