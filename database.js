const { Sequelize } = require("sequelize");
const { DB_NAME, DB_PASS, DB_USER, DB_HOST, DB_PORT } = require("./config");

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  pool: {
    max: 200, // Increase this if needed
    min: 0,
    acquire: 30000, // Increase timeout for acquiring a connection
    idle: 10000,
  },
  // logging: true,
  // retry: {
  //   match: [/Deadlock/i, Sequelize.ConnectionError], // Retry on connection errors
  //   max: 3, // Maximum retry 3 times
  //   backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
  //   backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
  // },
});
