'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const Branch = models.Branch;
      Branch.hasMany(Service, {foreignKey: {allowNull: false}});
      Service.belongsTo(Branch);
    }
  }
  Service.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    last_in_queue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    current_queue: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Service',
    underscored: true,
    // indexes: [{unique: true, fields: ['branch_id', 'name']}] // TODO: for some reason, it does not work
  });
  return Service;
};
