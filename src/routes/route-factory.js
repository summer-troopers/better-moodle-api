'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');

module.exports = function createRoute(repository) {
  const router = express.Router();

  router.route('/')
    .get(list) // eslint-disable-line no-use-before-define
    .post(add); // eslint-disable-line no-use-before-define

  router.route('/:id')
    .get(view) // eslint-disable-line no-use-before-define
    .put(update) // eslint-disable-line no-use-before-define
    .delete(remove); // eslint-disable-line no-use-before-define

  function list(request, response, next) {
    repository.list()
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function view(request, response, next) {
    if (!request.params.id) throw new errors.BadRequest('ID_NOT_RECEIVED');
    repository.view(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch((error) => {
        if (error.message === 'ID_NOT_FOUND') return next(new errors.NotFound(error.message));
        return next(new errors.BadRequest(error.message));
      });
  }

  function add(request, response, next) {
    repository.add(request.body)
      .then((result) => {
        response.json(result);
      })
      .catch((error) => {
        if (error.message === 'ID_NOT_FOUND') return next(new errors.NotFound(error.message));
        return next(new errors.BadRequest(error.message));
      });
  }

  function remove(request, response, next) {
    if (!request.params.id) throw new errors.BadRequest('ID_NOT_RECEIVED');
    repository.remove(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch((error) => {
        if (error.message === 'ID_NOT_FOUND') return next(new errors.NotFound(error.message));
        return next(new errors.BadRequest(error.message));
      });
  }

  function update(request, response, next) {
    if (!request.params.id) throw new errors.BadRequest('ID_NOT_RECEIVED');
    repository.update(request.params.id, request.body)
      .then((result) => {
        response.json(result);
      })
      .catch((error) => {
        if (error.message === 'ID_NOT_FOUND') return next(new errors.NotFound(error.message));
        return next(new errors.BadRequest(error.message));
      });
  }

  return router;
};
