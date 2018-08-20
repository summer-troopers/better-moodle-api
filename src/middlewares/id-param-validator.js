'use strict';

const errors = require('@feathersjs/errors');

module.exports = function createIdParamValidator(repository, errorMsg) {
  return function validateId(request, response, next, id) {
    if (!id) return next(new errors.BadRequest(errorMsg.notReceived));

    return repository.exists(id)
      .then((result) => {
        if (!result) return next(new errors.NotFound(errorMsg.notFound));

        return next();
      })
      .catch(next);
  };
};
