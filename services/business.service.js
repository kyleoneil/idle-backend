const {Business, Branch, Service, Queue} = require('./../models');
const branchService = require('./branch.service');

module.exports = {
  //CREATE Operations
  createBusiness: async (body) => {
    const name = body.businessname;
    const copy = {name};
    const business = await Business.create(copy);
    return business.id;
  },

  //READ Operations
  findBusinessByName: async (name) => Business.findOne({where: {name}}),
  findBusinessById: async (id) => Business.findOne({where: {id}}),

  findBusinesses: async (pageNo, resultsPerPage) => {
    const pageOffset = resultsPerPage * (pageNo - 1);
    const total_queue_records = await Business.count();
    const businessPaginate = await Business.findAll({
      offset: pageOffset,
      limit: resultsPerPage,
      attributes: {
        include: [['id', 'branch_id']],
        exclude: ['BusinessId', 'id']
      }
    })

    return {
      totalRecords: total_queue_records,
      data: businessPaginate
    }
  },

  //UPDATE Operations
  
  updateBusiness: async (id, data) => {
  /**
   * @type {{businessname:string}}
   */
    const newName = data;
    const business = await Business.findOne({where: {id}});

    business.name = newName;
    await business.save();

    return business;
  },

  //DELETE Operations (In-Progress)
  deleteBusiness: async (id) => {
    await Business.destroy({where: {id}}).then(async () => {
        return await Branch.findAll({where: {BusinessId:id}})
      }).then(async (branch) => {
        const services = await Service.findAll({where: {BranchId: branch.id}});
        await branch.destroy();
        return services;
      }).then(async (service) => {
        const queues = await Queue.findAll({where: {ServiceId: service.id}});
        await service.destroy();
        return queues;
      }).then(async (queue) => {
        await queue.destroy();
        return;
      })
    return;
  }
}