const config = require('config');
const multer = require('multer');
const express = require('express');
const errors = require('@feathersjs/errors');
const roles = require('../helpers/constants/roles');
const normalizeCourseId = require('../middlewares/body-param-normalizer')('courseId');

module.exports = function createLabsRoute(repository, permissions) {
  const router = express.Router();

  const upload = multer({
    storage: repository.storage,
  });

  router.route('/')
    .get(list)
    .post(upload.any(), normalizeCourseId, filesToFile, add);

  router.route('/:filename')
    .get(view);

  router.route('/:id')
    .delete(remove);

  return router;

  // eslint-disable-next-line complexity
  function checkFileInput(request) {
    const { labTaskId, courseId } = request.body;
    const role = request.token.userRole;
    if (role === roles.STUDENT && !labTaskId) throw new errors.BadRequest('LAB_TASK_ID_MISSING');
    if (role === roles.TEACHER && !courseId) throw new errors.BadRequest('COURSE_ID_MISSING');
    if (request.file.fieldname === 'labReport' && !labTaskId) throw new errors.BadRequest('LAB_TASK_ID_MISSING');
    if (request.file.fieldname === 'labTask' && !courseId) throw new errors.BadRequest('COURSE_ID_MISSING');
  }

  function add(request, response, next) {
    if (!permissions[request.token.userRole].create) return next(new errors.Forbidden('WRITE_PERMISSION_MISSING'));

    try {
      checkFileInput(request);
    } catch (error) {
      repository.remove(request.file.id);
      throw error;
    }

    if (!request.file) return next(new errors.BadRequest('FILE_NOT_RECEIVED'));

    repository.add(request.file.id, request.body);

    response.json({
      success: 'FILE_ADDED',
      id: request.file.id,
    });

    return next();
  }

  async function list(request, response, next) {
    if (!permissions[request.token.userRole].read) return next(new errors.Forbidden('READ_PERMISSION_MISSING'));

    const resultFiles = await repository.list();
    if (!resultFiles || resultFiles.length === 0) return next(new errors.NotFound('FILES_NOT_FOUND'));

    response.json(resultFiles);

    return next();
  }

  async function view(request, response, next) {
    if (!permissions[request.token.userRole].read) return next(new errors.Forbidden('READ_PERMISSION_MISSING'));

    const resultFile = await repository.view(request.params.filename);
    if (!resultFile || resultFile.length === 0) return next(new errors.NotFound('FILE_NOT_FOUND'));

    response.json(resultFile);

    return next();
  }

  async function remove(request, response, next) {
    if (!permissions[request.token.userRole].delete) return next(new errors.Forbidden('DELETE_PERMISSION_MISSING'));

    const deleteResult = await repository.remove(request.params.id);
    response.json(deleteResult);

    return next();
  }
};
