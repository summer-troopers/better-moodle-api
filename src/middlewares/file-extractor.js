'use strict';

module.exports = function extractFileFromFiles(request, response, next) {
  const { files } = request;
  if (files)[request.file] = files;
  request.file.good = true;
  return next();
};
