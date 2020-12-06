const router = require('express').Router();
const userService = require('./../services/user.service');
//const Services = require('./../services/service.service');
const queueService = require('./../services/queue.service');
const errorHandler = require('./errorHandler');

// router.post('/', (req, res) => {
//     /**
//      * @type {{user_id:bigint, service_id:bigint}}
//      */
//     const body = req.body;
//     //Validate if there is input
//     if(!body.user_id || !body.service_id){
//         res.status(400).json({message: "User and Service IDs are required."})
//     }

//     if (!userService.findById(body.user_id) || !Services.findService(body.service_id)){
//         console.log("User ID or Service ID does not exist.");
//         res.status(400).json({message: "Failed to queue user."});
//         return;
//     }else{
//         return queueService.createQueue(body)
//             .then((queue) => res.json({id: queue.id, message: "Queue details saved."}))
//             .catch(errorHandler.handleError(res));
//     }
// })

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

router.patch('/queuestatus', (req, res) => {
    const body = req.body;
    // if (if the caller is not a superadmin basically if the caller is a user) {
    //     res.status(403).json({message: "User is not authorized to mark the queue as completed"});
    //     return;
    //   }
    queueService.updQueueStatus(body)
    .then((data) => res.json({data: data, message: "Queue successfully updated."}))
    .catch(errorHandler.handleError(res));
});


router.get('/', (req, res) => {
  let {pageNo, resultsPerPage, serviceId, userId} = req.query;
  let pgNum = pageNo ? parseInt(pageNo) : 1;
  let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
  return queueService.getQueues(userId, serviceId, pgNum, pgRes)
    .then((data) => res.json({data: data, message: "Queue List fetched."}))
    .catch(errorHandler.handleError(res));
});


router.get('/currentqueue', (req, res) => {
  const body = req.body;
  // if (   if the caller is not a superadmin basically if the caller is a user   ) {
  //     res.status(403).json({message: ""});
  //     return;
  //   }
  queueService.getInProgress(body.service_id)
  .then((data) => res.json({data: data, message: "Current Queue List fetched."}))
  .catch(errorHandler.handleError(res));
});



module.exports = router;
