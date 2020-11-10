'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const Business = models.Business;
      Business.hasMany(Branch, {foreignKey: {allowNull: false}});
      Branch.belongsTo(Business);
    }
  }
  Branch.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Branch',
    underscored: true,
    // indexes: [{unique: true, fields: ['business_id', 'name']}]
  });
  return Branch;
};