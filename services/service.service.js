const {Service, Queue, Branch, Business} = require('../models');
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
    const service = await Service.findOne({
      where: {id: serviceId}
    });
    return service;
  },
  queueService: async(body)=>{
    let verify = await Service.findOne({
      where: {id: body.serviceId}
    });
    if(verify.length > 0){
      let data = await Queue.create({
        service_id:body.serviceId,
        user_id:body.userId,
        queue_number:verify.last_in_queue + 1
      });
    }
  },

  getServiceQueue: async (serviceId, pageNo, resultsPerPage) => {
    const pageOffset = resultsPerPage * (pageNo - 1);
    const total_queue_records = await Queue.findAndCountAll({
      where: {service_id: serviceId},
      offset: pageOffset,
      limit: resultsPerPage,
      include: [{
        model: Service,
        where: {id: serviceId},
        attributes: {
          include: [['name', 'service_name']],
          exclude: ['name', 'branch_id', 'BranchId', 'id', 'last_in_queue', 'current_queue', 'createdAt', 'updatedAt']
        },
        include: [{
          model: Branch,
          attributes: {
            include: [['name', 'branch_name']],
            exclude: ['name', 'BusinessId', 'id', 'createdAt', 'updatedAt']
          },
          include: [{
            model: Business,
            attributes: {
              include: [['name', 'business_name']],
              exclude: ['name', 'id', 'createdAt', 'updatedAt']
            }
          }]
        }]
      }],
      
      attributes: {
        include: [['id', 'queue_id']],
        exclude: ['id', 'ServiceId', 'UserId', 'teller_id', 'queue_number', 'createdAt', 'updatedAt']
      }
    })
  
    return total_queue_records;
  },

  getServiceDetails: async (serviceId) => {
    const service = await Service.findOne({ where: {id: serviceId} });
    const branch = await branchService.findById(service.BranchId);
    const business = await businessService.findBusinessById(branch.BusinessId);

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
