'use strict';

const multer = require('multer');
const express = require('express');
const errors = require('@feathersjs/errors');

const createPermissionVerifier = require('../middlewares/permission-verifier');
const parseQueryParams = require('../middlewares/parse-query');
const createIdParamValidator = require('../middlewares/id-param-validator');
const methodNotAllowed = require('../middlewares/method-verifier').notAllowed;

module.exports = function createCourseInstancesRoute(repository, permissions) {
  const router = express.Router();

  const names = {
    userId: 'teacherId',
    dependencyId: 'courseId',
    requiredField: 'labTasksFile',
  };
  const msg = {
    error: {
      notReceived: {
        userId: 'TEACHER_ID_NOT_RECEIVED',
        dependencyId: 'COURSE_ID_NOT_RECEIVED',
        file: 'LAB_TASKS_FILE_NOT_RECEIVED',
        id: 'LAB_ID_NOT_RECEIVED',
      },
      notFound: 'LAB_NOT_FOUND',
    },
    success: {
      add: 'LAB_ADDED',
      delete: 'LAB_DELETED',
      update: 'LAB_TASKS_FILE_UPLOADED',
    },
  };

  const validateId = createIdParamValidator(repository, msg.error);

  const permissionVerifier = createPermissionVerifier(permissions);

  const upload = multer({
    storage: repository.storage,
  });

  router
    .route('/')
    .get(permissionVerifier.read, parseQueryParams, list)
    .post(permissionVerifier.create, assertInputFields, add)
    .put(methodNotAllowed.put)
    .delete(methodNotAllowed.delete);

  router.param('id', validateId);

  router
    .route('/:id')
    .get(permissionVerifier.read, view)
    .post(methodNotAllowed.post)
    .put(permissionVerifier.update, upload.single(names.requiredField), assertFileField, update)
    .delete(permissionVerifier.delete, remove);

  return router;

  // eslint-disable-next-line complexity
  function assertInputFields(request, response, next) {
    let dependencyId = request.body[names.dependencyId];
    dependencyId = dependencyId ? dependencyId.trim() : dependencyId;
    if (!dependencyId) next(new errors.BadRequest(msg.error.notReceived.dependencyId));

    let userId = request.body[names.userId];
    userId = userId ? userId.trim() : userId;
    if (!userId) next(new errors.BadRequest(msg.error.notReceived.userId));

    return next();
  }

  function assertFileField(request, response, next) {
    const { file } = request;
    if (!file) request.file = { id: null };

    return next();
  }

  async function list(request, response, next) {
    repository
      .list(request.query)
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
    repository
      .view(request.params.id)
      .then((file) => {
        response.attachment(file.metadata.filename);
        response.set('Content-Length', file.metadata.length);
        response.set('Content-MD5', file.metadata.md5);
        file.stream.pipe(response);
      })
      .catch(next);
  }

  function add(request, response, next) {
    repository
      .add({
        [names.dependencyId]: request.body[names.dependencyId],
        [names.userId]: request.body[names.userId],
      })
      .then((result) => {
        response.json({
          success: msg.success.add,
          id: result.id,
        });

        return next();
      })
      .catch(next);
  }

  function update(request, response, next) {
    repository
      .update(request.params.id, {
        fileId: request.file.id.toString(),
        userId,
      })
      .then(() => {
        response.json(msg.success.update);

        return next();
      })
      .catch(next);
  }

  function remove(request, response, next) {
    repository
      .remove(request.params.id)
      .then(() => {
        response.json(msg.success.delete);
        return next();
      })
      .catch(next);
  }
};
