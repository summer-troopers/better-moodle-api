'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');
const parseQueryParams = require('../middlewares/parse-query');
const { hashPasswordOptional } = require('../middlewares/password-hasher');

module.exports = function createRoute(repository, permissions) {
  const router = express.Router();

  router.route('/')
    .get(parseQueryParams, list)
    .post(hashPasswordOptional, add);

  router.param('id', validateId);

  router.route('/:id')
    .get(view)
    .put(hashPasswordOptional, update)
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
    if (!permissions[request.token.userRole].read) return next(new errors.Forbidden('READ_PERMISSION_MISSING'));

    return repository.list(request.query)
      .then((result) => {
        if (result.count === 0) return next(new errors.NotFound('NO_RESULT'));
        return response.json({
          total: result.count,
          limit: request.query.limit,
          offset: request.query.offset,
          data: result.rows,
        });
      })
      .catch(next);
  }

  function view(request, response, next) {
    if (!permissions[request.token.userRole].read) return next(new errors.Forbidden('READ_PERMISSION_MISSING'));

    return repository.view(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function add(request, response, next) {
    if (!permissions[request.token.userRole].create) return next(new errors.Forbidden('CREATE_PERMISSION_MISSING'));

    return repository.add(request.body, request.query)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function remove(request, response, next) {
    if (!permissions[request.token.userRole].delete) return next(new errors.Forbidden('DELETE_PERMISSION_MISSING'));

    return repository.remove(request.params.id, request.query)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function update(request, response, next) {
    if (!permissions[request.token.userRole].update) return next(new errors.Forbidden('UPDATE_PERMISSION_MISSING'));

    return repository.update(request.params.id, request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  return router;
};
