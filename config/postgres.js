module.exports = {
  development: {
    database: process.env.FLOCK_USER_MANAGEMENT_DEVELOPMENT_DATABASE,
    username: process.env.FLOCK_USER_MANAGEMENT_DEVELOPMENT_USERNAME,
    password: process.env.FLOCK_USER_MANAGEMENT_DEVELOPMENT_PASSWORD,
    host: process.env.FLOCK_USER_MANAGEMENT_DEVELOPMENT_HOST,
    dialect: 'postgres',
    logging: true
  },
  test: {
    database: process.env.FLOCK_USER_MANAGEMENT_TEST_DATABASE,
    username: process.env.FLOCK_USER_MANAGEMENT_TEST_USERNAME,
    password: process.env.FLOCK_USER_MANAGEMENT_TEST_PASSWORD,
    host: process.env.FLOCK_USER_MANAGEMENT_TEST_HOST,
    dialect: 'postgres',
    logging: false
  },
  production: {
    database: process.env.FLOCK_USER_MANAGEMENT_PRODUCTION_DATABASE,
    username: process.env.FLOCK_USER_MANAGEMENT_PRODUCTION_USERNAME,
    password: process.env.FLOCK_USER_MANAGEMENT_PRODUCTION_PASSWORD,
    host: process.env.FLOCK_USER_MANAGEMENT_PRODUCTION_HOST,
    dialect: 'postgres',
    logging: false
  }
};
