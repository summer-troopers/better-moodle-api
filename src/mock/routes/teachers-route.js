'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');
const parseQueryParams = require('../../middlewares/parse-query');
const hashPassword = require('../../middlewares/hash-password');

module.exports = function createRoute(repository) {
  const router = express.Router();

  router.route('/')
    .get(parseQueryParams, list)
    .post(hashPassword, add);

  router.param('id', validateId);

  router.route('/:id')
    .get(view)
    .put(hashPassword, update)
    .delete(remove);

  router.route('/:id/courses')
    .get(parseQueryParams, listCourses)
    .post(addCourse);

  router.param('courseId', (request, response, next, courseId) => {
    if (!courseId) return next(new errors.BadRequest('COURSE_ID_NOT_RECEIVED'));
    return repository.existsCourse(courseId)
      .then((result) => {
        if (!result) return next(new errors.NotFound('COURSE_ID_NOT_FOUND'));

        return next();
      });
  });

  router.route('/:id/courses/:courseId')
    .delete(removeCourse);

  function validateId(request, response, next, id) {
    if (!id) return next(new errors.BadRequest('ID_NOT_RECEIVED'));

    return repository.exists(id)
      .then((result) => {
        if (!result) return next(new errors.NotFound('ID_NOT_FOUND'));

        return next();
      })
      .catch(next);
  }

  async function list(request, response, next) {
    return repository.list(request.query)
      .then((result) => {
        response.json({
          total: result.count,
          limit: request.query.limit,
          offset: request.query.offset,
          data: result.rows,
        });
      })
      .catch(next);
  }

  function view(request, response, next) {
    return repository.view(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function add(request, response, next) {
    return repository.add(request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function remove(request, response, next) {
    return repository.remove(request.params.id)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function update(request, response, next) {
    return repository.update(request.params.id, request.body)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function listCourses(request, response, next) {
    return repository.listCourses(request.params.id, request.query)
      .then((result) => {
        response.json({
          total: result.count,
          // limit: request.query.limit, // doesn't do anything, bug with sequelize, look in the repository
          // offset: request.query.offset, // the same
          data: result.rows,
        });
      })
      .catch(next);
  }

  function addCourse(request, response, next) {
    return repository.addCourse(request.params.id, request.body.courseId)
      .then((result) => {
        response.json(result);
      })
      .catch(next);
  }

  function removeCourse(request, response, next) {
    return repository.removeCourse(request.params.id, request.params.courseId)
      .then((result) => {
        if (result === 0) return next(new errors.NotFound());
        return response.json(result);
      })
      .catch(next);
  }

  return router;
};
