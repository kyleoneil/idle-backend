'use strict';
const {
  Model,
} = require('sequelize');
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns {User}
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /** @type {Role} */
      const {Role} = models.Role;
      User.hasOne(Role); // Will create role_id fk field in users table
    }
  }
  User.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthdate: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
  });
  return User;
};