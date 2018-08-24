'use strict';

const express = require('express');

const parseQueryParams = require('../middlewares/parse-query');
const { hashPasswordOptional } = require('../middlewares/password-hasher');
const createIdParamValidator = require('../middlewares/id-param-validator');
const createPermissionVerifier = require('../middlewares/permission-verifier');

module.exports = function createRoute(repository, permissions) {
  const router = express.Router();

  // temporary solution
  // full implementation is used in 'lab-routes'
  // if it's good I can implement it completely for this as well
  const errorMsg = {
    notFound: 'ID_NOT_FOUND',
    notReceived: 'ID_NOT_RECEIVED',
  };

  const validateId = createIdParamValidator(repository, errorMsg);

  const permissionVerifier = createPermissionVerifier(permissions);

  router.route('/')
    .get(permissionVerifier.read, parseQueryParams, list)
    .post(permissionVerifier.create, hashPasswordOptional, add);

  router.param('id', validateId);

  router.route('/:id')
    .get(permissionVerifier.read, view)
    .put(permissionVerifier.update, hashPasswordOptional, update)
    .delete(permissionVerifier.delete, remove);

  async function list(request, response, next) {
    repository.list(request.query)
      .then((result) => {
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
    repository.view(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function add(request, response, next) {
    repository.add(request.body, request.query)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function remove(request, response, next) {
    repository.remove(request.params.id, request.query)
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
