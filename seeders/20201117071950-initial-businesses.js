'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //To be used in development mode only
    const now = new Date();
    await queryInterface.bulkInsert('businesses', [
      {id: 1, name: 'ABC Banking Company', created_at: now, updated_at: now},
      {id: 2, name: 'XYZ Medical Operations', created_at: now, updated_at: now},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('businesses', {id: {[Op.in]: [1, 2]}}, {});
  }
};
