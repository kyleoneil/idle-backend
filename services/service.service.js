const {Service} = require('../models');
const branchService = require('./branch.service');
const businessService = require('./business.service');
const queueService = require('./queue.service');
const { static } = require('express');

module.exports = {
    /**
   *
   * @param {{servicename:string, branchname:string}} body
   */
  createService: async (body) => {
    const branchname = body.branchname;
    const branch = await branchService.findByName(branchname);
    const data = {BranchId: branch.id, ...body};
    data.name = body.servicename;
    const service = await Service.create(data);
    return service.id;
  },

  findService: async (serviceId) => {
    const service = await Service.findOne({ where: {id: serviceId} });
    return service;
  },

  getServiceDetails: async (serviceId) => {
    const service = await Service.findOne({ where: {id: serviceId} });
    const branch = await branchService.findById(service.BranchId);
    const business = await businessService.findBusinessById(branch.BusinessId);

    console.log(service);
    console.log(branch);
    console.log(business);

    const data = {
      business_name: business.name,
      branch_name: branch.name,
      service_name: service.name,
      last_in_queue: service.last_in_queue,
      in_progress_queues: await queueService.getInProgress(serviceId)
    };

    return data;
  },

  

  updateQueue: async (serviceId) => {
    const service = await Service.findOne({ where: {id: serviceId} });
    service.last_in_queue++;
    await Service.update(
      {last_in_queue: service.last_in_queue},
      {where: {id: service.id}}
    )
    return service;
  }
};
