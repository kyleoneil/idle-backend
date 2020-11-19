const router = require('express').Router();
const userService = require('./../services/user.service');
const Services = require('./../services/service.service');
const queueService = require('./../services/queue.service');
const errorHandler = require('./errorHandler');

router.post('/', (req, res) => {
    /**
     * @type {{user_id:bigint, service_id:bigint}}
     */
    const body = req.body;
    //Validate if there is input
    if(!body.user_id || !body.service_id){
        res.status(400).json({message: "User and Service IDs are required."})
    }

    if (!userService.findById(body.user_id) || !Services.findService(body.service_id)){
        console.log("User ID or Service ID does not exist.");
        res.status(400).json({message: "Failed to queue user."});
        return;
    }else{
        return queueService.createQueue(body)
            .then((queue) => res.json({id: queue.id, message: "Queue details saved."}))
            .catch(errorHandler.handleError(res));
    }
})

module.exports = router;