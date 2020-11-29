'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('queues', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      customer_id: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        allowNull: false
      },
      service_id: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'services',
          },
          key: 'id'
        },
        allowNull: false
      },
      teller_id: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        allowNull: false
      },
      queue_number: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      status: {
        type: Sequelize.TEXT,

      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Queues');
  }
};
