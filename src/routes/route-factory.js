'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');
const hashFactory = require('../helpers/hash/hash-factory')();

module.exports = function createRoute(repository) {
  const router = express.Router();

  router.route('/')
    .get(list) // eslint-disable-line no-use-before-define
    .post(hashPassword, add); // eslint-disable-line no-use-before-define

  router.param('id', validateId); // eslint-disable-line no-use-before-define

  router.route('/:id')
    .get(view) // eslint-disable-line no-use-before-define
    .put(hashPassword, update) // eslint-disable-line no-use-before-define
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

  async function hashPassword(request, response, next) {
    if (!request.body.password) return next();
    const hashedPassword = await hashFactory.encrypt(request.body.password);
    request.body.password = hashedPassword;
    return next();
  }

  function list(request, response, next) {
    repository.list()
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
