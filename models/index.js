'use strict';

const {DataTypes} = require("sequelize");

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('./../config/config');
const db = {};

const dialectOptions = {};
if (config.dbDialect === 'mariadb') {
  // See https://github.com/mariadb-corporation/mariadb-connector-nodejs/issues/48#issuecomment-490319977
  process.env.db_timezone = "Etc/GMT0";
  dialectOptions.timezone = process.env.db_timezone;
}
let sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, {
  dialect: config.dbDialect,
  dialectOptions,
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
