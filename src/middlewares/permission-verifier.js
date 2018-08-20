'use strict';

const errors = require('@feathersjs/errors');

module.exports = function createPermissionVerifier(permissions) {
  return {
    create(request, response, next) {
      if (!permissions[request.token.userRole].create) return next(new errors.Forbidden('CREATE_PERMISSION_MISSING'));
      return next();
    },
    read(request, response, next) {
      if (!permissions[request.token.userRole].read) return next(new errors.Forbidden('READ_PERMISSION_MISSING'));
      return next();
    },
    update(request, response, next) {
      if (!permissions[request.token.userRole].update) return next(new errors.Forbidden('UPDATE_PERMISSION_MISSING'));
      return next();
    },
    delete(request, response, next) {
      if (!permissions[request.token.userRole].delete) return next(new errors.Forbidden('DELETE_PERMISSION_MISSING'));
      return next();
    },
  };
};
