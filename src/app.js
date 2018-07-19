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

module.exports = function getApp(sqlConnection, mongoConnection) {
  const app = express();

  importModels(sqlConnection);
  const adminRepository = createRepository(sqlConnection.models.Admin);
  const teacherRepository = createRepository(sqlConnection.models.Teacher);
  const studentRepository = createRepository(sqlConnection.models.Student);
  const courseRepository = createRepository(sqlConnection.models.Course);
  const groupRepository = createRepository(sqlConnection.models.Group);
  const specialtyRepository = createRepository(sqlConnection.models.Specialty);

  const userRepository = createUserRepository(sqlConnection);

  const labsRepository = require('./repositories/labs-repository')(mongoConnection);

  const authenticationRoute = createAuthenticationRoute(userRepository);

  const labsRoute = require('./routes/labs-route')(labsRepository, permissions('crud|r|cr|'));

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
  app.use('/api/v1/labs', labsRoute);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // eslint-disable-next-line no-unused-vars
  app.use((err, request, response, next) => {
    const error = err;
    error.code = err.code || 400;
    return response.status(error.code).json(error.message);
  });

  return app;
};
