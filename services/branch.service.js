const {Branch, Business} = require('./../models');
const businessService = require('./business.service');
const { static } = require('express');

module.exports = {
    /**
   *
   * @param {{branchname:string, businessname:string}} body
   */

    //CREATE Operations
    createBranch: async (body) => {
        const businessname = body.businessname;
        const business = await businessService.findBusinessByName(businessname);
        const data = {BusinessId: business.id, ...body};
        data.name = body.branchname;
        const branch = await Branch.create(data);
        return branch.id;
    },

    //READ Operations
    findByName: async (name) => {
        const data = await Branch.findOne({where: {name}});
        const business = await businessService.findBusinessById(data.BusinessId);

        const branch = {branch_details: data, business_details: business};
        return branch;
    }, 

    findById: async (id) => {
        const data = await Branch.findOne({where: {id}});
        const business = await businessService.findBusinessById(data.BusinessId);

        const branch = {branch_details: data, business_details: business};
        return branch;
    },
    
    findBranches: async (pageNo, resultsPerPage) => {
        const pageOffset = resultsPerPage * (pageNo - 1);
        const total_queue_records = await Branch.count();
        const branchPaginate = await Branch.findAll({
            offset: pageOffset,
            limit: resultsPerPage,
            include: [{
                model: Business,
                attributes: {
                    include: [['name', 'business_name']],
                    exclude: ['name', 'id', 'createdAt', 'updatedAt']
                } 
            }],
            attributes: {
                include: [['id', 'branch_id'], ['name', 'branch_name']],
                exclude: ['BusinessId', 'id', 'name']
            }
        })

        return {
            totalRecords: total_queue_records,
            data: branchPaginate
        }
    },

    //UPDATE Operations (need assistance here...)
    updateBranch: async(id, body) => {
        const brName = body.branchname;
        const bsName = body.businessname;
        const branch = await Branch.findOne({where: {id}});

        console.log(branch);
        branch.name = brName;
        branch.BusinessId = await businessService.findBusinessByName(bsName);

        await branch.save();
        return branch;
    }
}
