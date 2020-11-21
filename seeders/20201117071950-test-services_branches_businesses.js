'use strict';

const env = process.env.NODE_ENV || 'development';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      //To be used in development mode only
      const now = new Date();
      await queryInterface.bulkInsert('businesses', [
        {id: 1, name: 'ABC Banking Company', created_at: now, updated_at: now},
        {id: 2, name: 'XYZ Medical Operations', created_at: now, updated_at: now},
      ]);
      await queryInterface.bulkInsert('branches', [
        {id: 1, name: 'Talamban', business_id: 1, created_at: now, updated_at: now},
        {id: 2, name: 'Fuente', business_id: 2, created_at: now, updated_at: now},
      ]);
      await queryInterface.bulkInsert('services', [
        {id: 1, name: 'Savings Deposit', branch_id: 1, created_at: now, updated_at: now},
        {id: 2, name: 'Debit Loan', branch_id: 1, created_at: now, updated_at: now},
        {id: 3, name: 'ICU/ER Booking', branch_id: 2, created_at: now, updated_at: now},
        {id: 4, name: 'DNA Testing', branch_id: 2, created_at: now, updated_at: now},
      ])
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('services', {id: {[Op.in]: [1, 2, 3, 4]}}, {});
      await queryInterface.bulkDelete('branches', {id: {[Op.in]: [1, 2]}}, {});
      await queryInterface.bulkDelete('businesses', {id: {[Op.in]: [1, 2]}}, {});
    }
  }
};
