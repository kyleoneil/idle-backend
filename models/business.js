'use strict';
const {
  Model
} = require('sequelize');
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns {Business}
 */
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Business.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Business',
    underscored: true,
  });
  return Business;
};