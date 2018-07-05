'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');
const winston = require('../src/services/winston/winston');

module.exports = function getApp(connection) {
  const app = express();

  const repo = require('./services/repositories/repo.factory')(connection); // eslint-disable-line global-require
  const route = require('./routes/route.factory')(repo); // eslint-disable-line global-require

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', { stream: winston.stream }));


  app.use('/api/v1/', route);

  return app;
};
