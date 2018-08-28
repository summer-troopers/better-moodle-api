'use strict';

const errors = require('@feathersjs/errors');

module.exports = {
  notAllowed: {
    get: createMethodNotAllowedNotifier('GET'),
    post: createMethodNotAllowedNotifier('POST'),
    put: createMethodNotAllowedNotifier('PUT'),
    delete: createMethodNotAllowedNotifier('DELETE'),
  },
};

function createMethodNotAllowedNotifier(methodName) {
  return function methodNotAllowed(request, response, next) {
    return next(new errors.MethodNotAllowed(`${methodName}_NOT_ALLOWED`));
  };
}
