// All app configs should be declared here so that we have a single place to look for configs
module.exports = {
  apiRoot: '/api',
  port: process.env.PORT || 3000,
  dbPort: process.env.DB_PORT || 3306,
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER || 'idle',
  dbPass: process.env.DB_PASS || 'idle',
  dbName: process.env.DB_NAME || 'idle',
  dbPoolLimit: process.env.DB_POOL_LIMIT || 10,
}