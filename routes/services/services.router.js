const {getServiceDetails,getQueue} = require("./services.controller");

const router = require('express').Router();
const auth = require('./../../auth/token_validation');


router.get('/servicedetails/:id', getServiceDetails);
router.get('/:id/queues',getQueue);

module.exports = router;