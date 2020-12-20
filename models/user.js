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
      // Add role_id bigint not null to users table
      const Role = models.Role;
      Role.hasMany(User, {foreignKey: {allowNull: false}});
      User.belongsTo(Role);
      // Note: business_id bigint should not be null if user role is BUSINESS_OWNER
      const Business = models.Business;
      Business.hasMany(User, {foreignKey: {allowNull: true}});
      User.belongsTo(Business);
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
    token: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
  }, {
    sequelize,
    paranoid: true,
    modelName: 'User',
    underscored: true,
  });
  return User;
};