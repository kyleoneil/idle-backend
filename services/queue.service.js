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

  getQueues: async (userId, serviceId, pageNo, resultsPerPage) => {
    const where = {}
    if (userId) {
      where.user_id = userId;
    } else if (serviceId) {
      where.service_id = serviceId;
    }

     
    const pageOffset = resultsPerPage * (pageNo - 1);
    const total_queue_records = await Queue.findAll({
      offset: pageOffset,
      limit: resultsPerPage,
      where
    });
  
    return total_queue_records;
  },

  getUserQueues: async (serviceId, pageNo, userId) => {
    const pageOffset = resultsPerPage * (pageNo - 1);
    const total_queue_records = await Queue.findAndCountAll({
      where: {user_id: userId},
      offset: pageOffset,
      limit: resultsPerPage,
    })
  },

  getInProgress: async (serviceId) => {
    const queues = await Queue.findAll({
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

  update: async (id, data) => {
    const {user_id, service_id, teller_id, queue_number, status} = data;
    const queue = await Queue.findOne({where: {id}});
    if (user_id) {
      queue.user_id = user_id;
    }
    if (service_id) {
      queue.service_id = service_id;
    }
    if (teller_id) {
      queue.service_id = teller_id;
    }
    if (queue_number) {
      queue.queue_number = queue_number;
    }
    if (status) {
      queue.status = status;
    }
    return await queue.save();
  }
};
