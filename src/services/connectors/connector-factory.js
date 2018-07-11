'use strict';

const config = require('config');

// eslint-disable-next-line global-require
module.exports = function getConnector() { return require('./sql-connector')(config.mysql); };
