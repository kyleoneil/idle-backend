const {Service} = require('../models');
const branchService = require('./branch.service');
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



  }
};
