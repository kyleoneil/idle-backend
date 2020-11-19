const {Branch, Business} = require('./../models');
const businessService = require('./business.service');
const { static } = require('express');

module.exports = {
    /**
   *
   * @param {{branchname:string, businessname:string}} body
   */
    createBranch: async (body) => {
        const businessname = body.businessname;
        const business = await businessService.findBusinessByName(businessname);
        const data = {BusinessId: business.id, ...body};
        data.name = body.branchname;
        const branch = await Branch.create(data);
        return branch.id;
    },
    findByName: async (name) => {
        const branch = Branch.findOne({where: {name}});
        return branch;
    }, 

    findById: async (id) => {
       const branch = Branch.findOne({where: {id}});
       return branch;
    } 
}