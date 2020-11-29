const {Business, Branch, Service, Queue} = require('./../models');
const branchService = require('./branch.service');

const getIds = (models) => {
  var Ids = [];
  for (x in models) {
    Ids.push(models[x].id);
  }
  return Ids;
}

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
      const branchIds = getIds(await Branch.findAll({where: {BusinessId:id}}));
      await Branch.destroy({where: {BusinessId:id}}); 
      return branchIds;
      }).then(async (branch) => {
        const serviceIds = getIds(await Service.findAll({where: {BranchId:branch}}));
        await Service.destroy({where: {BranchId:branch}}); 
        return serviceIds;
      }).then(async (service) => {
        const queueIds = getIds(await Queue.findAll({where: {ServiceId:service}}));
        await Queue.destroy({where: {ServiceId:service}}); 
      })
    return;
  }
}