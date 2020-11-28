const {Queue, Service} = require('./../models');
const Services = require('./service.service');
const userServices = require('./user.service');
const { static } = require('express');

module.exports = {
    /**
   *
   * @param {{customer_id:bigint, service_id:bigint}} body
   */
  createQueue: async (body) => {
    const serviceId = body.service_id;
    const userId = body.user_id;
    const service = await Service.findOne({where: {id: serviceId}});
    const customer = await userServices.findById(userId);
    const data = {UserId: customer.id, ServiceId: service.id};
    data.customer_id = body.user_id;
    data.service_id = body.service_id;
    data.queue_number = service.last_in_queue + 1;
    data.status = 1;
    service.last_in_queue++;
    service.save();
    const queue = await Queue.create(data);
    return queue.id;
  },

  getQueues: async (serviceId) => {
    const queues = Queue.findAll({ where: {service_id: serviceId} });
    return queues; 
  },

  getInProgress: async (serviceId) => {
    const queues = Queue.findAll({
      where: {
        service_id: serviceId,
        status: 'IN_PROGRESS'
      }
    });

    return (queues)? queues: 0;
  },

  // updateQueue: async (serviceId) => {
  //   const service = await Service.findOne({ where: {id: serviceId} });
  //   service.last_in_queue++;
  //   await Service.update(
  //     {last_in_queue: service.last_in_queue},
  //     {where: {id: service.id}}
  //   )
  //   return service;
  // },


  updQueueStatus: async (data) => {
    const queue = await Queue.findOne({
      where: {id: data.queue_id},
    });
    const complete = await Queue.update(
      {status: data.queue_status,}, 
     { where: {id: queue.id}}
    );
    return complete;
  }
};
