'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');
const hashFactory = require('../helpers/hash/hash-factory')();

module.exports = function createRoute(repository, createPermissions) {
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
    request.body.password = await hashFactory.encrypt(request.body.password);
    return next();
  }

  async function list(request, response, next) {
    if (!createPermissions[request.token.role].read) return next(new errors.Forbidden());
    return repository.list()
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function view(request, response, next) {
    if (!createPermissions[request.token.role].read) return next(new errors.Forbidden());
    return repository.view(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function add(request, response, next) {
    if (!createPermissions[request.token.role].write) return next(new errors.Forbidden());
    return repository.add(request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function remove(request, response, next) {
    if (!createPermissions[request.token.role].write) return next(new errors.Forbidden());
    return repository.remove(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function update(request, response, next) {
    if (!createPermissions[request.token.role].write) return next(new errors.Forbidden());
    return repository.update(request.params.id, request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  return router;
};
