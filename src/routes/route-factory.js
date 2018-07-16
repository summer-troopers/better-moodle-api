'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');


module.exports = function createRoute(repository) {
  const router = express.Router();

  router.route('/')
    .get(parseQueryParams, list) // eslint-disable-line no-use-before-define
    .post(add); // eslint-disable-line no-use-before-define

  router.param('id', validateId); // eslint-disable-line no-use-before-define

  router.route('/:id')
    .get(view) // eslint-disable-line no-use-before-define
    .put(update) // eslint-disable-line no-use-before-define
    .delete(remove); // eslint-disable-line no-use-before-define

  function validateId(request, response, next, id) {
    if (!id) return next(new errors.BadRequest('ID_NOT_RECEIVED'));
    return repository.exists(id)
      .then((result) => {
        if (!result) return next(new errors.NotFound('ID_NOT_FOUND'));
        return next();
      })
      .catch(next);
  }

  function parseQueryParams(request, response, next) {
    if (!request.query.limit) request.query.limit = '50';
    request.query.limit = parseInt(request.query.limit, 10);

    if (!request.query.offset) request.query.offset = '0';
    request.query.offset = parseInt(request.query.offset, 10);

    if (!request.query.contains) request.query.contains = '';

    next();
  }

  function list(request, response, next) {
    repository.list(request.query)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function view(request, response, next) {
    repository.view(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function add(request, response, next) {
    repository.add(request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function remove(request, response, next) {
    repository.remove(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function update(request, response, next) {
    repository.update(request.params.id, request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  return router;
};
