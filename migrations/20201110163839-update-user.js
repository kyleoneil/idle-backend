'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'token', Sequelize.STRING);
    await queryInterface.addColumn('users', 'last_login', Sequelize.DATE);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'token');
    await queryInterface.removeColumn('users', 'last_login');
  }
};
