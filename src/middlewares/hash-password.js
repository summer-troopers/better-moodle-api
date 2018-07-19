'use strict';

const hashFactory = require('../helpers/hash/hash-factory')();

module.exports = async function hashPassword(request, response, next) {
  if (!request.body.password) return next();
  request.body.password = await hashFactory.encrypt(request.body.password);

  return next();
};
