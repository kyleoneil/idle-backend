'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const now = new Date();
      const inQueue = 'IN-QUEUE';
      await queryInterface.bulkInsert('queues', [
        {id: 1, user_id: 1, service_id: 1, status: inQueue, created_at: now, updated_at: now},
        {id: 2, user_id: 2, service_id: 2, status: 'COMPLETED', created_at: now, updated_at: now},
        {id: 3, user_id: 3, service_id: 3, status: 'IN_PROGRESS', created_at: now, updated_at: now},
        {id: 4, user_id: 4, service_id: 4, status: 'NO_SHOW', created_at: now, updated_at: now},
        {id: 5, user_id: 1, service_id: 1, status: inQueue, created_at: now, updated_at: now},
        {id: 6, user_id: 2, service_id: 2, status: 'COMPLETED', created_at: now, updated_at: now},
      ])
    }
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('businesses', {id: {[Op.in]: [1, 2, 3, 4, 5, 6]}}, {});
  }
};
