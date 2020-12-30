'use strict';

const {ROLE_CUSTOMER} = require('./../constants/user');
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
      });
      await userService.create({
        firstname: 'test',
        lastname: 'businessowner',
        birthdate: '06/09/1991',
        email: 'owner@idle.com',
        password: 'businessowner',
        roleName: 'BUSINESS_OWNER'
      });
      await userService.create({
        firstname: 'test',
        lastname: 'businessteller',
        birthdate: '11/11/1994',
        email: 'teller@idle.com',
        password: 'businessteller',
        roleName: 'BUSINESS_TELLER'
      });
      await userService.create({
        firstname: 'test',
        lastname: 'customer',
        birthdate: '03/05/1997',
        email: 'customer@idle.com',
        password: 'customer',
        roleName: ROLE_CUSTOMER
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('users', {id: {[Op.in]: [1,2,3,4]}}, {});
    }
  }
};
