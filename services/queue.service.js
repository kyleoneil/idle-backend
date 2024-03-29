const {Business, Branch, Queue, Service, sequelize} = require('./../models');
const ServiceError = require('./errors/serviceError');

module.exports = {
  /**
   *
   * @param {{user_id:bigint, service_id:bigint}} body
   */
  createQueue: async (body) => {
    const {user_id, service_id} = body;
    return await sequelize.transaction(async (t) => {
      const service = await Service.findOne({where: {id: service_id}, lock: t.LOCK.UPDATE, transaction: t});
      const queueNumber = service.last_in_queue + 1;
      service.last_in_queue = queueNumber;
      return Promise.all([
          Queue.create({
            UserId: user_id,
            ServiceId: service_id,
            queue_number: queueNumber,
            status: 'IN_QUEUE'
          }, {transaction: t}),
          service.save({transaction: t})
        ]
      ).then((promisesResult) => promisesResult[0].id);
    });
  },

  findAll: async (pageNo, resultsPerPage, serviceId, status) => {
    const where = {}
    if (serviceId) {
      where.service_id = serviceId;
    }
    if (status) {
      where.status = status;
    }

    const pageOffset = resultsPerPage * (pageNo - 1);

    const total_queue_records = await Queue.count({where})
    const queuePaginate = await Queue.findAll({
      offset: pageOffset,
      limit: resultsPerPage,
      where
    });

    return {
      totalRecords: total_queue_records,
      data: queuePaginate
    }
  },

  getUserQueues: async (userId, pageNo, resultsPerPage, status = ['IN_QUEUE', 'IN_PROGRESS']) => {
    const where = {user_id: userId, status};
    const total_queue_records = await Queue.count({where});

    const options = {
      where,
      attributes: {
        exclude: ['updatedAt', 'deletedAt', 'UserId', 'ServiceId']
      },
      include: [{
        model: Service,
        attributes: {
          include: [['name', 'service_name']],
          exclude: ['id', 'name', 'last_in_queue', 'current_queue', 'createdAt', 'updatedAt', 'deletedAt', 'BranchId']
        },
        include: [{
          model: Branch,
          attributes: {
            exclude: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt']
          },
          include: [{
            model: Business,
            attributes: {
              include: [['name', 'business_name']],
              exclude: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt']
            }
          }]
        }]
      }]
    };

    if (pageNo && resultsPerPage) {
      options.offset = resultsPerPage * (pageNo - 1);
      options.limit = resultsPerPage;
    }

    const queuePaginate = await Queue.findAll(options);

    return {
      totalRecords: total_queue_records,
      data: queuePaginate
    }
  },

  getInProgress: async (serviceId) => {
    const queues = await Queue.findAll({
      where: {
        service_id: serviceId,
        status: 'IN_PROGRESS'
      }
    });

    return (queues) ? queues : 0;
  },

  //UPDATE Operations
  update: async (id, teller, status) => {
    const queue = await Queue.findOne({
      where: {id},
      attributes: {
        include: ['teller_id']
      }

    });

    if (status) { //WIP: Teller_ID Update Nonfunctional atm
      const queueupdate = await Queue.update(
        {
          status,
          teller_id: teller
        },
        {where: {id: queue.id}},
      )
    }
    console.log(queue.teller_id);
    return await queue.save();
  },

  markQueueAsCompleted: async (id) => {
    const queue = await Queue.findOne({where: {id}});
    if (queue.status !== 'IN_PROGRESS') {
      throw new ServiceError('Queue is not in progress');
    }
    queue.status = 'COMPLETED';
    return queue.save();
  }
};
