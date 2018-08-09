const config = require('config');
const multer = require('multer');
const express = require('express');
const errors = require('@feathersjs/errors');
const roles = require('../helpers/constants/roles');
const normalizeLabTaskId = require('../middlewares/body-param-normalizer')('labTaskId');
const extractFile = require('../middlewares/file-extractor');
const createPermissionVerifier = require('../middlewares/permission-verifier');

module.exports = function createLabsRoute(repository, permissions) {
  const router = express.Router();

  const permissionVerifier = createPermissionVerifier(permissions);

  const upload = multer({
    storage: repository.storage,
  });

  router.route('/')
    .get(permissionVerifier.read, list)
    .post(permissionVerifier.create, upload.any(), normalizeLabTaskId, extractFile, checkInputFields, add);

  router.route('/:filename')
    .get(permissionVerifier.read, view);

  router.route('/:id')
    .delete(permissionVerifier.delete, remove);

  return router;

  // eslint-disable-next-line complexity
  function checkInputFields(request, response, next) {
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
    repository.list()
      .then((result) => {
        if (!result || result.count === 0) return next(new errors.NotFound('FILES_NOT_FOUND'));
        response.json({
          total: result.count,
          limit: 'NOT_IMPLEMENTED',
          offset: 'NOT_IMPLEMENTED',
          data: result.rows,
        });

        return next();
      })
      .catch(next);
  }

  async function view(request, response, next) {
    const resultFile = await repository.view(request.params.id);
    if (!resultFile || resultFile.length === 0) return next(new errors.NotFound('FILE_NOT_FOUND'));

    response.json(resultFile);

    return next();
  }

  async function remove(request, response, next) {
    const deleteResult = await repository.remove(request.params.id);
    response.json(deleteResult);

    return next();
  }
};
