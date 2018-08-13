'use strict';

const multer = require('multer');
const express = require('express');
const errors = require('@feathersjs/errors');

const roles = require('../helpers/constants/roles');
const extractFile = require('../middlewares/file-extractor');
const createPermissionVerifier = require('../middlewares/permission-verifier');
const parseQueryParams = require('../middlewares/parse-query');

const normalizeLabTaskId = require('../middlewares/body-param-normalizer')('labTaskId');

module.exports = function createLabsRoute(repository, permissions) {
  const router = express.Router();

  const permissionVerifier = createPermissionVerifier(permissions);

  const upload = multer({
    storage: repository.storage,
  });

  router.route('/')
    .get(permissionVerifier.read, parseQueryParams, list)
    .post(permissionVerifier.create, upload.any(), normalizeLabTaskId, extractFile, assertInputFields, add);

  router.route('/:id')
    .get(permissionVerifier.read, view)
    .delete(permissionVerifier.delete, remove);

  return router;

  // eslint-disable-next-line complexity
  function assertInputFields(request, response, next) {
    if (request.body.labTaskId) return next();
    repository.remove(request.file.id);
    return next(new errors.BadRequest('LAB_TASK_ID_MISSING'));
  }

  function add(request, response, next) {
    let studentId = (request.token.userRole === roles.ADMIN) ? request.body.studentId : request.token.user;
    studentId = studentId || '0';

    repository.add(request.file.id.toString(), request.body.labTaskId, studentId)
      .then((result) => {
        response.json({
          success: 'FILE_ADDED',
          id: result.id,
        });

        return next();
      })
      .catch(next);
  }

  async function list(request, response, next) {
    repository.list(request.query)
      .then((files) => {
        if (!files || files.count === 0) return next(new errors.NotFound('FILES_NOT_FOUND'));
        response.json({
          total: files.count,
          limit: request.query.limit,
          offset: request.query.offset,
          data: files.rows,
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

  function remove(request, response, next) {
    repository.remove(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }
};
