'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('queues', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
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
        allowNull: true
      },
      queue_number: {
        type: Sequelize.BIGINT
      },
      status: {
        type: Sequelize.ENUM({
          values: ['IN_QUEUE', 'IN_PROGRESS', 'NO_SHOW', 'COMPLETED'],
        }),
        defaultValue: 'IN_QUEUE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Queues');
  }
};