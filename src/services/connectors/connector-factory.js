'use strict';

const config = require('config');

const sqlConnector = require('./sql-connector')(config.mysql);
const mongoConnector = require('./mongo-connector')(config.mongo);

// eslint-disable-next-line global-require
module.exports = function connectToDBs() {
  return Promise.all([
    sqlConnector.connect(),
    mongoConnector.connect(),
  ]);
};
