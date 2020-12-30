const router = require('express').Router();
const authService = require('./../services/auth.service');
const branchService = require('../services/branch.service');
const Services = require('../services/service.service');
const errorHandler = require('./errorHandler');

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
            Services.createService(body)
                .then((service) => res.json({id: service.id, message: "Service has been created."}))
                .catch(errorHandler.handleError(res))
        }
    })
})

router.get('/', (req, res) => {
    let {pageNo, resultsPerPage, branchId} = req.query;
    let pgNum = pageNo ? parseInt(pageNo) : 1;
    let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
    return Services.getServices(pgNum, pgRes, branchId)
        .then((results) => res.json(results))
        .catch(errorHandler.handleError(res))
})

router.get('/:id', (req, res) => {
    return Services.getServiceDetails(req.params.id)
        .then((service) => res.json(service))
        .catch(errorHandler.handleError(res));
});

router.get('/:id/queues', (req, res) => {
    let {pageNo, resultsPerPage} = req.query;
    let pgNum = pageNo ? parseInt(pageNo) : 1;
    let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
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

router.patch('/:id/nextqueue', (req, res) => {
    return Services.nextQueue(req.params.id)
        .then((data) => res.json({id: data.id,queue_number: data.queue_number, message: "Next queue."}))
        .catch(errorHandler.handleError(res));
});

router.put('/:id', (req, res) => {
    /**
   * @type {{servicename:string, branchId:bigint}}
   */
    const roleName = req.user.roleName;
    return authService.isAuthorized(roleName, 'BUSINESS_OWNER').then((result) => {
        if (result) {
            const body = req.body;
            if (!body.servicename) {
                res.status(400).json({message: "Please enter a service name."})
            }
        
            return branchService.findById(body.branchId).then((exists) => {
                if (!exists) {
                    res.status(400).json({message: "Branch does not exist."});
                } else {
                    Services.updateService(req.params.id, body)
                        .then((service) => res.json({id: service.id, message: "Service has been updated."}))
                        .catch(errorHandler.handleError(res));
                }
            })
        } else {
            res.status(400).json({message: "User is not authorized to make changes."});
            return;
        }
    })
    
})

router.delete('/:id', (req, res) => {
    const roleName = req.user.roleName;
    return authService.isAuthorized(roleName, 'BUSINESS_OWNER').then((result) => {
        if (result) {
            return Services.deleteService(req.params.id)
                .then(() => res.json({message: "Service deleted successfully."}))
                .catch(errorHandler.handleError(res));
        } else {
            res.status(400).json({message: "User is not authorized to make changes."});
            return;
        }
    })
})


module.exports = router;
