'use strict';

const errors = require('@feathersjs/errors');
const hasher = require('../helpers/hash/hash-factory')();

module.exports = {
  hashPassword,
  hashPasswordOptional,
};

async function hashPassword(request, response, next) {
  if (!request.body.password) return next(new errors.BadRequest('PASSWORD_NOT_RECEIVED'));
  request.body.password = await hasher.encrypt(request.body.password);
  return next();
}

async function hashPasswordOptional(request, response, next) {
  if (request.body.password) {
    request.body.password = await hasher.encrypt(request.body.password);
  }
  return next();
}
