'use strict';

const errors = require('@feathersjs/errors');
const hashFactory = require('../helpers/hash/hash-factory')();

module.exports = async function hashPassword(request, response, next) {
  if (!request.body.password) return next(new errors.BadRequest('PASSWORD_NOT_RECEIVED'));
  request.body.password = await hashFactory.encrypt(request.body.password);
  return next();
};
