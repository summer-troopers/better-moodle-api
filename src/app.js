'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');
const winston = require('../src/services/winston/winston');
const importModels = require('./models/import'); // eslint-disable-line global-require


module.exports = function getApp(connection) {
  const app = express();

  importModels(connection);
  const adminRoute = require('./routes/admin.route')(connection); // eslint-disable-line global-require
  const teacherRoute = require('./routes/teacher.route')(connection); // eslint-disable-line global-require

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', { stream: winston.stream }));

  app.use('/api/v1/admins', adminRoute);
  app.use('/api/v1/teachers', teacherRoute);

  return app;
};
