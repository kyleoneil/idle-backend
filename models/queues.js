'use strict';
const {
  Model
} = require('sequelize');
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns {Queue}
 */
module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const User = models.User;
      const Service = models.Service;
      User.hasMany(Queue, {foreignKey: {allowNull: false}});
      Queue.belongsTo(User);
      Service.hasMany(Queue, {foreignKey:{allowNull: false}});
      Queue.belongsTo(Service);
    }
  };
  Queue.init({
    //To be checked (Causes UnhandledPromiseRejectionWarning when added)
    // indexes: [
    //   {
    //     fields: ['customer_id', 'service_id', 'teller_id']
    //   }
    // ],
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    }, 
    queue_number: DataTypes.BIGINT,
    status: DataTypes.ENUM({
      values: ['IN_QUEUE', 'IN_PROGRESS', 'NO_SHOW', 'COMPLETED'],
      defaultValue: 'IN_QUEUE'
    })
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Queue',
    underscored: true,
  });
  return Queue;
};