const appConfig = require('./../app-config');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: appConfig.dbHost,
  port: appConfig.dbPort,
  user: appConfig.dbUser,
  password: appConfig.dbPass,
  database: appConfig.dbName,
  connectionLimit: appConfig.dbPoolLimit,
});

module.exports = pool;