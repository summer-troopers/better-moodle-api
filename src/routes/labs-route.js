'use strict';

const multer = require('multer');
const express = require('express');
const errors = require('@feathersjs/errors');
const config = require('config');

const roles = require('../helpers/constants/roles');
const createPermissionVerifier = require('../middlewares/permission-verifier');
const parseQueryParams = require('../middlewares/parse-query');
const createIdParamValidator = require('../middlewares/id-param-validator');


module.exports = function createLabsRoute(repository, permissions, routeConfig) {
  const router = express.Router();

  routeConfig = Object.assign(config.labRoutes.default, routeConfig);

  const { names, msg } = routeConfig;

  const validateId = createIdParamValidator(repository, msg.err);

  const permissionVerifier = createPermissionVerifier(permissions);

  const upload = multer({
    storage: repository.storage,
  });

  router.route('/')
    .get(permissionVerifier.read, parseQueryParams, list)
    .post(permissionVerifier.create, upload.single(names.requiredField), assertInputFields, add);

  router.param('id', validateId);

  router.route('/:id')
    .get(permissionVerifier.read, view)
    .put(permissionVerifier.update, upload.single(names.requiredField), update)
    .delete(permissionVerifier.delete, remove);

  return router;

  // eslint-disable-next-line complexity
  function assertInputFields(request, response, next) {
    let dependencyId = request.body[names.dependencyId];
    dependencyId = (dependencyId) ? dependencyId.trim() : dependencyId;
    const { fieldname } = request.file;
    if (dependencyId && fieldname === names.requiredField) return next();

    repository.removeFile(request.file.id);
    if (!dependencyId) return next(new errors.BadRequest(msg.err.missing.dependencyId));

    return next(new errors.BadRequest(msg.err.missing.field));
  }

  function buildData(fileId, dependencyId, userId) {
    const data = {};
    if (fileId) data.fileId = fileId;
    if (dependencyId) data[names.dependencyId] = dependencyId;
    if (userId) data[names.userId] = userId;

    return data;
  }

  async function list(request, response, next) {
    repository.list(request.query)
      .then((result) => {
        response.json({
          total: result.count,
          limit: request.query.limit,
          offset: request.query.offset,
          data: result.rows,
        });

        return next();
      })
      .catch(next);
  }

  function view(request, response, next) {
    repository.view(request.params.id)
      .then((file) => {
        response.attachment(file.metadata.filename);
        response.set('Content-Length', file.metadata.length);
        response.set('Content-MD5', file.metadata.md5);
        file.stream.pipe(response);
      })
      .catch(next);
  }

  function add(request, response, next) {
    let userId = (request.token.userRole === roles.ADMIN) ? request.body[names.userId] : request.token.user;
    userId = userId || '1';

    repository.add(buildData(request.file.id.toString(), request.body[names.dependencyId], userId))
      .then((result) => {
        response.json({
          success: routeConfig.msg.success.add,
          id: result.id,
        });

        return next();
      })
      .catch(next);
  }

  function update(request, response, next) {
    let userId = (request.token.userRole === roles.ADMIN) ? request.body[names.userId] : request.token.user;
    userId = userId || '1';

    repository.update(request.params.id, buildData(request.file.id.toString(), request.body[names.dependencyId], userId))
      .then((result) => {
        if (!result || result.length === 0) return next(new errors.GeneralError(msg.err.unknown.update));
        response.json(msg.success.update);
        return next();
      })
      .catch(next);
  }

  function remove(request, response, next) {
    repository.remove(request.params.id)
      .then((result) => {
        if (result !== 1) return next(new errors.GeneralError(msg.err.unknown.delete));
        response.json(msg.success.delete);
        return next();
      })
      .catch(next);
  }
};
