const router = require('express').Router();
const branchService = require('./../services/branch.service');
const businessService = require('./../services/business.service');
const errorHandler = require('./errorHandler');

router.post('/', (req, res) => {
    /**
   *
   * @param {{branchname:string, businessname:string}} body
   */

   const body = req.body;
   if (!body.businessname || !body.branchname) {
        res.status(400).json({message: "Branch name and business name are required."});
        return;
   }

   return businessService.findBusinessByName(body.businessname).then((exists) => {
       if (!exists) {
            res.status(400).json({message: "Business does not exist."});
       } else {
            branchService.createBranch(body)
                .then((branch) => res.json({id: branch.id, message: "Branch has been created."}))
                .catch(errorHandler.handleError(res));
       }
   })
})

router.get('/', (req, res) => {
    let {pageNo, resultsPerPage} = req.query;
    let pgNum = pageNo ? parseInt(pageNo) : 1;
    let pgRes = resultsPerPage ? parseInt(resultsPerPage) : 10;
      return branchService.findBranches(pgNum, pgRes)
        .then((results) => res.json(results))
        .catch(errorHandler.handleError(res))
    })

router.get('/:id', (req, res) => {
    return branchService.findById(req.params.id).then((branch) => {
        if(!branch) {
            res.status(400).json({message:"Error: Branch does not exist."});
        } else {
            res.json(branch);
        }
    }).catch(errorHandler.handleError(res))
})

router.patch('/:id', (req, res) => {
    /**
   * @type {{branchname:string, businessId:string}}
   */
    const body = req.body;
    if (!body.branchname) {
        res.status(400).json({message: "Please enter a branch name."})
    }

    return businessService.findBusinessById(body.businessId).then((exists) => {
        if (!exists) {
            res.status(400).json({message: "Business does not exist."});
        } else {
            branchService.updateBranch(req.params.id, body)
                .then((branch) => res.json({id: branch.id, message: "Branch has been updated."}))
                .catch(errorHandler.handleError(res));
        }
    })
})

router.delete('/:id', (req, res) => {
    return branchService.deleteBranch(req.params.id)
        .then(() => res.json({message: "Branch deleted successfully."}))
        .catch(errorHandler.handleError(res));
})

module.exports = router;
