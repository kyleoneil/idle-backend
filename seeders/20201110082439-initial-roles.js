'use strict';

const {ROLE_CUSTOMER} = require('./../constants/user');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('roles', [
      {id: 1, name: 'SUPER_ADMIN', created_at: now, updated_at: now},
      {id: 2, name: 'BUSINESS_OWNER', created_at: now, updated_at: now},
      {id: 3, name: 'BUSINESS_TELLER', created_at: now, updated_at: now},
      {id: 4, name: ROLE_CUSTOMER, created_at: now, updated_at: now},
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // From https://stackoverflow.com/questions/48232490/sequelize-where-is-an-example-of-using-bulkdelete-with-criteria
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('roles', {id: {[Op.in]: [1, 2, 3, 4]}}, {});
  }
};
