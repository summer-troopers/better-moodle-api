module.exports = function parseQueryParams(request, response, next) {
  request.query.limit = parseInt(request.query.limit, 10) || 50;
  request.query.offset = parseInt(request.query.offset, 10) || 0;
  if (!request.query.contains) request.query.contains = '';

  next();
};
