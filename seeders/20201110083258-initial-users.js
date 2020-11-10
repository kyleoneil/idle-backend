'use strict';

const env = process.env.NODE_ENV || 'development';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      // Create the user in development mode only
      const userService = require('./../services/user.service');
      await userService.create({
        firstname: 'admin',
        lastname: 'admin',
        birthdate: '01/28/1988',
        email: 'admin@idle.com',
        password: 'admin',
        roleName: 'SUPER_ADMIN'
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('users', {email: {[Op.in]: ['admin@idle.com']}}, {});
    }
  }
};
