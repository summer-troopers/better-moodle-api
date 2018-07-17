'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const logger = require('../src/services/winston/logger');

const importModels = require('./models/import');
const createRoute = require('./routes/route-factory');
const createAuthenticationRoute = require('./routes/authentication-route');

const createRepository = require('./repositories/repository-factory');
const createUserRepository = require('./repositories/user-repository');
const { permissions } = require('./helpers/util');
const createAuthorizationVerifier = require('./middlewares/authorization-verifier');

module.exports = function getApp(connection) {
  const app = express();

  importModels(connection);
  const adminRepository = createRepository(connection.models.Admin);
  const teacherRepository = createRepository(connection.models.Teacher);
  const studentRepository = createRepository(connection.models.Student);
  const courseRepository = createRepository(connection.models.Course);
  const groupRepository = createRepository(connection.models.Group);
  const specialtyRepository = createRepository(connection.models.Specialty);

  const userRepository = createUserRepository(connection);

  const authenticationRoute = createAuthenticationRoute(userRepository);

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', { stream: logger.stream }));

  app.use('/api/v1/login', authenticationRoute);

  app.use(createAuthorizationVerifier(userRepository).validateUser);

  app.use('/api/v1/admins', createRoute(adminRepository, permissions('crud|||')));
  app.use('/api/v1/teachers', createRoute(teacherRepository, permissions('crud|r|r|')));
  app.use('/api/v1/students', createRoute(studentRepository, permissions('crud|r|r|')));
  app.use('/api/v1/courses', createRoute(courseRepository, permissions('crud|r|r|')));
  app.use('/api/v1/groups', createRoute(groupRepository, permissions('crud|r|r|')));
  app.use('/api/v1/specialties', createRoute(specialtyRepository, permissions('crud|r|r|')));

  // eslint-disable-next-line no-unused-vars
  app.use((err, request, response, next) => {
    const error = err;
    error.code = err.code || 400;
    return response.status(error.code).json(error);
  });

  return app;
};
