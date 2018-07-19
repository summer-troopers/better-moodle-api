'use strict';

const config = require('config');

// eslint-disable-next-line global-require
module.exports = { getSQLConnector, getMongoConnector };

function getSQLConnector() { return require('./sql-connector')(config.mysql); }

function getMongoConnector() { return require('./mongo-connector')(config.mongo); }
