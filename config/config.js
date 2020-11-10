require('dotenv').config();
// All app configs should be declared here so that we have a single place to look for configs

const config = {
  apiRoot: '/api',
  port: process.env.PORT || 3000,
  saltRounds: process.env.SALT_ROUNDS || 10,
  secretKey: process.env.SECRET_KEY || '!dl3-b@ck3nd$',
  development: {
    username: process.env.DB_USER || 'idle',
    password: process.env.DB_PASS || 'idle',
    database: process.env.DB_NAME || 'idle',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mariadb',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mariadb',
  }
};
const env = process.env.NODE_ENV || 'development';
config.dbHost = config[env].host;
config.dbUser = config[env].username;
config.dbPass = config[env].password;
config.dbName = config[env].database;
config.dbDialect = config[env].dialect;

module.exports = config;
