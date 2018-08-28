'use strict';

const multer = require('multer');
const express = require('express');
const errors = require('@feathersjs/errors');
const config = require('config');

const roles = require('../helpers/constants/roles');
const createPermissionVerifier = require('../middlewares/permission-verifier');
const parseQueryParams = require('../middlewares/parse-query');
const createIdParamValidator = require('../middlewares/id-param-validator');

module.exports = function createLabReportsRoute(repository, permissions) {
  const router = express.Router();

  const names = {
    userId: 'studentId',
    dependencyId: 'courseInstanceId',
    requiredField: 'labReport',
  };

  const msg = {
    error: {
      notReceived: {
        userId: 'STUDENT_ID_NOT_RECEIVED',
        dependencyId: 'LAB_ID_NOT_RECEIVED',
        file: 'LAB_REPORT_FILE_NOT_RECEIVED',
        id: 'LAB_REPORT_ID_NOT_RECEIVED',
        mark: 'MARK_NOT_RECEIVED',
        review: 'REVIEW_NOT_RECEIVED',
      },
      notFound: 'LAB_REPORT_NOT_FOUND',
    },
    success: {
      add: 'LAB_REPORT_ADDED',
      delete: 'LAB_REPORT_DELETED',
      update: 'LAB_REPORT_REVIEW_UPDATED',
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
    .post(permissionVerifier.create, upload.single(names.requiredField), assertStudentInputFields, add);

  router.param('id', validateId);

  router
    .route('/:id')
    .get(permissionVerifier.read, view)
    .put(permissionVerifier.update, assertTeacherInputFields, update)
    .delete(permissionVerifier.delete, remove);

  return router;

  function assertDependencyReceived(request) {
    let dependencyId = request.body[names.dependencyId];
    dependencyId = dependencyId ? dependencyId.trim() : dependencyId;
    if (!dependencyId) throw new errors.BadRequest(msg.error.notReceived.dependencyId);
  }

  function assertFileReceived(request) {
    const { file } = request;
    if (!file) throw new errors.BadRequest(msg.error.notReceived.file);
  }

  function assertRequiredFieldName(request) {
    const { fieldname } = request.file; // Assuming 'multer' will trim this for me
    if (fieldname !== names.requiredField) throw new errors.BadRequest(msg.error.notReceived.file);
  }

  function assertStudentInputFields(request, response, next) {
    try {
      assertFileReceived(request);
    } catch (error) {
      return next(error);
    }

    try {
      assertDependencyReceived(request);
      assertRequiredFieldName(request);
    } catch (error) {
      repository.removeFile(request.file.id);
      return next(error);
    }

    return next();
  }

  function assertMarkReceived(request) {
    let { mark } = request.body;
    mark = parseInt(mark, 10) || 0;
    if (!mark) throw new errors.BadRequest(msg.error.notReceived.mark);
    request.body.mark = mark;
  }

  function assertReviewReceived(request) {
    let { review } = request.body;
    review = review ? review.trim() : review;
    if (!review) throw new errors.BadRequest(msg.error.notReceived.review);
    request.body.review = review;
  }

  function assertTeacherInputFields(request, response, next) {
    try {
      assertMarkReceived(request);
      assertReviewReceived(request);
    } catch (error) {
      return next(error);
    }

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
    let userId = request.token.userRole === roles.ADMIN ? request.body[names.userId] : request.token.user;
    userId = userId || '1';

    repository
      .add({
        fileId: request.file.id.toString(),
        [names.dependencyId]: request.body[names.dependencyId],
        [names.userId]: userId,
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
        review: request.body.review,
        mark: request.body.mark,
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
