'use strict';

module.exports = {
  mysql: process.env.MYSQL_URI || 'mysql://localhost:3306/moodle',
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  port: process.env.PORT || 3000,
  errorEmails: process.env.ERROR_EMAILS,

  development: {
    username: process.env.SEQUELIZE_USER || 'root',
    password: process.env.SEQUELIZE_PASSWORD || 'pass',
    database: process.env.SEQUELIZE_DB || 'db',
    host: process.env.SEQUELIZE_HOST || 'localhost',
    dialect: process.env.SEQUELIZE_DIALECT || 'mysql',
  },
};
