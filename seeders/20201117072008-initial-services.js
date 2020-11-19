'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //To be used in development mode only
    const Services = require('../services/service.service');
    await Services.createService({
      branchname: 'Talamban',
      servicename: 'Savings Deposit'
    }),
    await Services.createService({
      branchname: 'Talamban',
      servicename: 'Debit Loan'
    }),
    await Services.createService({
      branchname: 'Fuente',
      servicename: 'ICU/ER Booking'
    }),
    await Services.createService({
      branchname: 'Fuente',
      servicename: 'DNA Testing'
    })
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op
    await queryInterface.bulkDelete('services', {id: {[Op.in]: [1, 2, 3, 4]}}, {});
  }
};
