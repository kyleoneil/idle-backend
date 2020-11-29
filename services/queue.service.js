const {Queue, Service} = require('./../models');
const Services = require('./service.service');
const userServices = require('./user.service');
const {static} = require('express');

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

  getQueues: async (pageNo, resultsPerPage, queries) => {
    let {user_id, service_id, teller_id, status} = queries;
    const where = {};
    if (user_id) {
      where.service_id = user_id;
    }
    if (service_id) {
      where.service_id = service_id;
    }
    if (teller_id) {
      where.teller_id = teller_id;
    }
    if (status) {
      where.status = status;
    }
    return {
      totalRecords: await Queue.count({where}),
      data: await Queue.findAll({where})
    }
  },

  getInProgress: async (serviceId) => {
    const queues = Queue.findAll({
      where: {
        service_id: serviceId,
        status: 'IN_PROGRESS'
      }
    });

    return (queues) ? queues : 0;
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
