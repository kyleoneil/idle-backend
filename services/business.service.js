const {Business} = require('./../models');

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
      limit: resultsPerPage
    })

    return {
      totalRecords: total_queue_records,
      data: businessPaginate
    }
  },

  //UPDATE Operations
  updateBusiness: async (id, data) => {
    const newName = data;
    const business = await Business.findOne({where: {id}});

    business.name = newName;
    await business.save();

    return business;
  },

  //DELETE Operations
  deleteBusiness: async (id) => {
    const business = await Business.findOne({where: {id}});

    await business.destroy();

    return;
  }
}
