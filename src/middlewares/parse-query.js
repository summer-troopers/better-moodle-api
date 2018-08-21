'use strict';

module.exports = function parseQueryParams(request, response, next) {
  request.query.limit = parseInt(request.query.limit, 10) || 0;
  request.query.offset = parseInt(request.query.offset, 10) || 0;
  request.query.contains = request.query.contains || '';

  next();
};
