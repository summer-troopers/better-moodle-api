'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const morgan = require('morgan');
const logger = require('../src/services/winston/logger');

const importModels = require('./models/import');
const createRoute = require('./routes/route-factory');
const createRepository = require('./services/repositories/repository-factory');


module.exports = function getApp(connection) {
  const app = express();

  importModels(connection);
  const adminRepository = createRepository(connection.models.Admin);
  const teacherRepository = createRepository(connection.models.Teacher);
  const studentRepository = createRepository(connection.models.Student);
  const courseRepository = createRepository(connection.models.Course);
  const groupRepository = createRepository(connection.models.Group);
  const specialtyRepository = createRepository(connection.models.Specialty);

  const authenticationRoute = require('./routes/authentication-route')(connection); // eslint-disable-line global-require

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', { stream: logger.stream }));

  app.use('/api/v1/login', authenticationRoute);

  app.use('/api/v1/admins', createRoute(adminRepository));
  app.use('/api/v1/teachers', createRoute(teacherRepository));
  app.use('/api/v1/students', createRoute(studentRepository));
  app.use('/api/v1/courses', createRoute(courseRepository));
  app.use('/api/v1/groups', createRoute(groupRepository));
  app.use('/api/v1/specialties', createRoute(specialtyRepository));

  // eslint-disable-next-line no-unused-vars
  app.use((err, request, response, next) => {
    const error = err;
    error.code = err.code || 400;
    return response.status(error.code).json(error.message);
  });

  return app;
};
