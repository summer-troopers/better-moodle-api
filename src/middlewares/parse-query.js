module.exports = function parseQueryParams(request, response, next) {
  if (!request.query.limit) request.query.limit = '50';
  request.query.limit = parseInt(request.query.limit, 10);

  if (!request.query.offset) request.query.offset = '0';
  request.query.offset = parseInt(request.query.offset, 10);

  if (!request.query.contains) request.query.contains = '';

  next();
}
