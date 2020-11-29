const router = require('express').Router();
const branchService = require('../services/branch.service');
const businessService = require('../services/business.service');
const serviceService = require('../services/service.service');
const queueService = require('../services/queue.service');
const errorHandler = require('./errorHandler');

router.post('/:id/queue', (req, res) => {
    return serviceService.queueUserToService(req.user.id, req.params.id)
      .then((queue) => res.json(queue))
      .catch(errorHandler.handleError(res));
})

router.post('/', (req, res) => {
    /**
     *
     * @param {{servicename:string, branchname:string}} body
     */

    if (!req.body.servicename || !req.body.branchname) {
        res.status(400).json({message: "Service name and branch name are required."});
        return;
    }

    return branchService.findByName(req.body.branchname).then((exists) => {
        if (!exists) {
            res.status(400).json({message: "Branch does not exist."});
        } else {
            const body = {last_in_queue: 0, current_queue: 0, ...req.body};
            serviceService.createService(body)
                .then((service) => res.json({id: service.id, message: "Service has been created."}))
                .catch(errorHandler.handleError(res))
        }
    })
})

router.get('/', (req, res) => {
    let {pageNo, resultsPerPage, branchId} = req.query;
    let pgNum = pageNo ? parseInt(pageNo) : 1;
    let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
    return serviceService.getServices(pgNum, pgRes, branchId)
        .then((results) => res.json(results))
        .catch(errorHandler.handleError(res))
})

router.get('/:id', (req, res) => {
    return serviceService.getServiceDetails(req.params.id)
        .then((service) => res.json(service))
        .catch(errorHandler.handleError(res));
});

router.patch('/nextqueue', (req, res) => {
    const body = req.body;
    // if (   if the caller is not a superadmin basically if the caller is a user   ) {
    //     res.status(403).json({message: "User is not authorized to get the next queue"});
    //     return;
    //   }
    serviceService.nextQueue(body.service_id)
    .then((data) => res.json({id: data.id,queue_number: data.queue_number, message: "Next queue."}))
    .catch(errorHandler.handleError(res));
});

router.patch('/:id', (req, res) => {
    req.user.id
    /**
   * @type {{servicename:string, branchId:bigint}}
   */
    const body = req.body;
    if (!body.servicename) {
        res.status(400).json({message: "Please enter a service name."})
    }

    return branchService.findById(body.branchId).then((exists) => {
        if (!exists) {
            res.status(400).json({message: "Branch does not exist."});
        } else {
            serviceService.updateService(req.params.id, body)
                .then((service) => res.json({id: service.id, message: "Service has been updated."}))
                .catch(errorHandler.handleError(res));
        }
    })
})

router.delete('/:id', (req, res) => {
    return serviceService.deleteService(req.params.id)
        .then(() => res.json({message: "Service deleted successfully."}))
        .catch(errorHandler.handleError(res));
})


module.exports = router;
