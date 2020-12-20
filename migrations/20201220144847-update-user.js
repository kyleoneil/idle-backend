'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'business_id', Sequelize.BIGINT);
    await queryInterface.addConstraint('users', {
      fields: ['business_id'],
      type: 'foreign key',
      name: 'business_idfk',
      references: {
        table: 'businesses',
        field: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('users', 'business_idfk');
    await queryInterface.removeColumn('users', 'business_id');
  }
};
