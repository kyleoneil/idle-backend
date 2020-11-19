'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const queueService = require('./../services/queue.service');
    await queueService.createQueue({
      user_id: 4,     //UID for Customer TestData
      service_id: 2,
      teller_id: 3,
    })
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('businesses', {id: {[Op.in]: [1]}}, {});
  }
};
