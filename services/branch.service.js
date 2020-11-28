const {Branch, Business, Service, Queue} = require('./../models');
const businessService = require('./business.service');
const { static } = require('express');

const getIds = (models) => {
    var Ids = [];
    for (x in models) {
      Ids.push(models[x].id);
    }
    return Ids;
}

module.exports = {
    /**
   *
   * @param {{branchname:string, businessname:string}} body
   */

    //CREATE Operations
    createBranch: async (body) => {
        const businessname = body.businessname;
        const business = await Business.findOne({where: {name: businessname}});
        const data = {BusinessId: business.id, ...body};
        data.name = body.branchname;
        const branch = await Branch.create(data);
        return branch.id;
    },

    //READ Operations
    findByName: async (name) => {
        const data = await Branch.findOne({where: {name}});
        const business = await Business.findOne({where: {id:data.BusinessId}});

        const branch = {branch_details: data, business_details: business};
        return branch;
    }, 

    findById: async (id) => {
        const data = await Branch.findOne({where: {id}});
        const business = await Business.findOne({where: {id: data.BusinessId}});

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

    //UPDATE Operations
    
  
    updateBranch: async(id, body) => {
    /**
     * @type {{branchname:string, businessId:bigint}}
     */
        const brName = body.branchname;
        const bsId = body.businessId;
        const branch = await Branch.findOne({where: {id}});

        branch.name = brName;
        branch.BusinessId = bsId;

        await branch.save();
        return branch;
    },

    //DELETE Operations (In-Progress)
    deleteBranch: async (id) => {
        await Branch.destroy({where: {id}}).then(async () => {
            const serviceIds = getIds(await Service.findAll({where: {BranchId:id}}));
            await Service.destroy({where: {BranchId:id}});
            return serviceIds;
            }).then(async (service) => {
                const queueIds = getIds(await Queue.findAll({where: {ServiceId:service}}));
                await Queue.destroy({where: {ServiceId:service}}); //Change to .destroy l8r
            })
        return;
    }
}