require('dotenv').config();
// All app configs should be declared here so that we have a single place to look for configs
const config = {
  apiRoot: '/api',
  port: process.env.PORT || 3000,
  dbPort: process.env.DB_PORT || 3306,
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'idle',
  dbPass: process.env.DB_PASS || 'idle',
  dbName: process.env.DB_NAME || 'idle',
  dbDialect: 'mariadb',
  saltRounds: process.env.SALT_ROUNDS || 10,
  secretKey: process.env.SECRET_KEY || '!dl3-b@ck3nd$'
};
config.development = {
  username: config.dbUser,
  password: config.dbPass,
  database: config.dbName,
  host: '127.0.0.1',
  dialect: config.dbDialect,
}

module.exports = config;
