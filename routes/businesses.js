const router = require('express').Router();
const { restart } = require('nodemon');
const businessService = require('./../services/business.service');
const errorHandler = require('./errorHandler');

router.post('/', (req, res) => {
    /**
   * @type {{businessname:string}}
   */
    const body = req.body;
    if(!body.businessname) {
        res.status(400).json({message:"Please enter a business name."});
        return;
    }

    return businessService.findBusinessByName(body.businessname).then((exists) => {
        if (exists) {
            res.status(400).json({message: "Business already exists."})
        } else {
            businessService.createBusiness(body)
                .then((business) => res.json({id: business.id, message: "Business registered successfully."}))
                .catch(errorHandler.handleError(res));
        }
    })
})

router.get('/', (req, res) => {
let {pageNo, resultsPerPage} = req.query;
  let pgNum = (pageNo) ? pageNo : 1;
  let pgRes = (resultsPerPage) ? resultsPerPage : 10;
  return businessService.findBusinesses(pgNum, pgRes)
    .then((results) => res.json(results))
    .catch(errorHandler.handleError(res))
})

router.get('/:id', (req, res) => {
    return businessService.findBusinessById(req.params.id).then((business) => {
        if(!business) {
            res.status(400).json({message:"Error: Business does not exist."});
        } else {
            res.json(business);
        }
    }).catch(errorHandler.handleError(res))
});

router.patch('/:id', (req, res) => {
    /**
   * @type {{businessname:string}}
   */
    const body = req.body;
    if(!body.businessname) {
        res.status(400).json({message:"Please enter a business name."});
        return;
    }

    return businessService.findBusinessByName(body.businessname).then((exists) => {
        if (exists) {
            res.status(400).json({message: "Business already exists."})
        } else {
            businessService.updateBusiness(req.params.id, body.businessname)
                .then((business) => res.json({id: business.id, message: "Business updated successfully."}))
                .catch(errorHandler.handleError(res));
        }
    })
})

router.delete('/:id', (req, res) => {
    return businessService.findBusinessById(req.params.id).then((exists) => {
        if (!exists) {
            res.status(400).json({message: "Error: Business not found"})
        } else {
            businessService.deleteBusiness(req.params.id)
                .then(() => res.json({message: "Business deleted successfully."}))
                .catch(errorHandler.handleError(res));
        }
    })
})

module.exports = router;