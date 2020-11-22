'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //To be used in development mode only
    const branchService = require('./../services/branch.service');
    await branchService.createBranch({
      branchname: 'Talamban',
      businessname: 'ABC Banking Company'
    }),
    await branchService.createBranch({
      branchname: 'Fuente',
      businessname: 'XYZ Medical Operations'
    })
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
      await queryInterface.bulkDelete('branches', {id: {[Op.in]: [1]}}, {});
  }
};
