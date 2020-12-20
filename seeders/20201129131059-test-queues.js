'use strict';

const env = process.env.NODE_ENV || 'development';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const now = new Date();
      const inQueue = 'IN_QUEUE';
      await queryInterface.bulkInsert('queues', [
        {user_id: 1, service_id: 1, status: inQueue, created_at: now, updated_at: now},
        {user_id: 2, service_id: 2, status: 'COMPLETED', created_at: now, updated_at: now},
        {user_id: 3, service_id: 3, status: 'IN_PROGRESS', created_at: now, updated_at: now},
        {user_id: 4, service_id: 4, status: 'NO_SHOW', created_at: now, updated_at: now},
        {user_id: 1, service_id: 1, status: inQueue, created_at: now, updated_at: now},
        {user_id: 2, service_id: 2, status: 'COMPLETED', created_at: now, updated_at: now},
      ])
    }
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('businesses', {id: {[Op.in]: [1, 2, 3, 4, 5, 6]}}, {});
  }
};
