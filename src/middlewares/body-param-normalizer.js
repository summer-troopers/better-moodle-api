'use strict';

module.exports = function createBodyParamNormalizer(paramName) {
  return function normalizeBodyParam(request, response, next) {
    const param = request.body[paramName];
    request.body[paramName] = (param === '') ? undefined : param;
    return next();
  };
};
