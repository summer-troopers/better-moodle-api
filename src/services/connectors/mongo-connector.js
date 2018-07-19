'use strict';

const mongoose = require('mongoose');

module.exports = function getMongoConnector(uri) {
  return {
    connect, // eslint-disable-line no-use-before-define
  };

  function connect() {
    return mongoose.createConnection(uri, { useNewUrlParser: true });
  }
};
