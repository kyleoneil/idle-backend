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

      const businessTeller = await User.findOne({where: {email: 'teller@idle.com'}})
      businessTeller.BusinessId = 1;
      businessTeller.BranchId = 1;
      await businessTeller.save();
      await userService.create({
        firstname: 'Lucio',
        lastname: 'Teller',
        birthdate: '11/11/1994',
        email: 'lteller@idle.com',
        password: 'lteller',
        roleName: 'BUSINESS_TELLER',
        business_id: 2,
        branch_id: 2 
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (env === 'development') {
      const Op = Sequelize.Op
      await queryInterface.bulkDelete('users', {id: {[Op.in]: [5]}}, {});
    }
  }
};
