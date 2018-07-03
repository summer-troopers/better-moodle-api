const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');
const winston = require('../src/services/winston/winston');

module.exports = (connection) => {
  const app = express();

  const repo = require('./services/repositories/repo.factory')(connection);
  const route = require('./routes/route.factory')(repo);

  app.use(morgan('combined', { stream: winston.stream }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/v1/', route);

  return app;
};
