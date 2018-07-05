'use strict';

module.exports = function getRepository(connection) {
  return require('./sql.repo')(connection); // eslint-disable-line global-require
};
