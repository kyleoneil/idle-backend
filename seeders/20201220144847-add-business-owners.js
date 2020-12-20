'use strict';

const env = process.env.NODE_ENV || 'development';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const {User} = require('./../models');
      const businessOwner = await User.findOne({where: {email: 'owner@idle.com'}}) // See 20201110083258-initial-users.js
      businessOwner.BusinessId = 1; // See 20201117071950-test-services_branches_businesses.js
      await businessOwner.save();

      const userService = require('./../services/user.service');
      await userService.create({
        firstname: 'Lucio',
        lastname: 'Tan',
        birthdate: '11/11/1994',
        email: 'ltan@idle.com',
        password: 'ltan',
        roleName: 'BUSINESS_OWNER',
        business_id: 2, // See 20201117071950-test-services_branches_businesses.js
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const {User} = require('./../models');
      const businessOwner = await User.findOne({where: {email: 'owner@idle.com'}}) // See 20201110083258-initial-users.js
      businessOwner.BusinessId = null; // See 20201117071950-test-services_branches_businesses.js
      await businessOwner.save();
    }
  }
};
