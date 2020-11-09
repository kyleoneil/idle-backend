'use strict';
const {
  Model,
} = require('sequelize');
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns {Role}
 */
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Role',
    underscored: true,
  });
  return Role;
};