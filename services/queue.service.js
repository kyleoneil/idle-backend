const {Queue} = require('./../models');
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
    const service = await Services.findService(serviceId);
    const customer = await userServices.findById(userId);
    const data = {UserId: customer.id, ServiceId: service.id};
    data.customer_id = body.user_id;
    data.service_id = body.service_id;
    data.queue_number = service.last_in_queue + 1;
    Services.updateQueue(serviceId);
    console.log(data);
    const queue = await Queue.create(data);
    return queue.id;
  }
};
