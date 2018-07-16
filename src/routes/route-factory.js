'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');
const parseQueryParams = require('../middlewares/parse-query');

module.exports = function createRoute(repository, permissions) {
  const router = express.Router();

  router.route('/')
    .get(parseQueryParams, list)
    .post(add);

  router.param('id', validateId);

  router.route('/:id')
    .get(view)
    .put(update)
    .delete(remove);

  function validateId(request, response, next, id) {
    if (!id) return next(new errors.BadRequest('ID_NOT_RECEIVED'));

    return repository.exists(id)
      .then((result) => {
        if (!result) return next(new errors.NotFound('ID_NOT_FOUND'));

        return next();
      })
      .catch(next);
  }

  async function list(request, response, next) {
    if (!permissions[request.token.role].read) return next(new errors.Forbidden());

    return repository.list(request.query)
      .then((result) => {
        response.json({
          total: result.count,
          limit: request.query.limit,
          offset: request.query.offset,
          data: result.rows,
        });
      })
      .catch(next);
  }

  function view(request, response, next) {
    if (!permissions[request.token.role].read) return next(new errors.Forbidden());

    return repository.view(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function add(request, response, next) {
    if (!permissions[request.token.role].create) return next(new errors.Forbidden());

    return repository.add(request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function remove(request, response, next) {
    if (!permissions[request.token.role].delete) return next(new errors.Forbidden());

    return repository.remove(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function update(request, response, next) {
    if (!permissions[request.token.role].update) return next(new errors.Forbidden());

    return repository.update(request.params.id, request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  return router;
};
