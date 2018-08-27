'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { FeathersError } = require('@feathersjs/errors');

const swaggerDocument = require('../swagger.json');
const logger = require('../src/services/winston/logger');

const importModels = require('./models');
const createRoute = require('./routes/resources');
const createAuthenticationRoute = require('./routes/authentication');
const createLabReportsRoute = require('./routes/lab_reports');

const createUserRepository = require('./repositories/users');
const createAuthorizationVerifier = require('./middlewares/authorization-verifier');

const { permissions } = require('./helpers/util');

module.exports = function getApp(sqlConnection, mongoConnection) {
  const app = express();

  importModels(sqlConnection);

  const adminsRepository = require('./repositories/admins')(sqlConnection); // eslint-disable-line global-require
  const teachersRepository = require('./repositories/teachers')(sqlConnection); // eslint-disable-line global-require
  const studentsRepository = require('./repositories/students')(sqlConnection); // eslint-disable-line global-require
  const coursesRepository = require('./repositories/courses')(sqlConnection); // eslint-disable-line global-require
  const groupsRepository = require('./repositories/groups')(sqlConnection); // eslint-disable-line global-require
  const specialtiesRepository = require('./repositories/specialties')(sqlConnection); // eslint-disable-line global-require

  // eslint-disable-next-line global-require
  const courseInstancesSpecialtiesRepository = require('./repositories/course-instances_specialties')(sqlConnection);

  const userRepository = createUserRepository(sqlConnection);

  const labReportsRepository = require('./repositories/lab_reports')(mongoConnection, sqlConnection); // eslint-disable-line global-require
  const courseInstancesRepository = require('./repositories/course_instances')(mongoConnection, sqlConnection); // eslint-disable-line global-require

  // eslint-disable-next-line global-require
  const courseInstancesRoute = require('./routes/course_instances')(
    courseInstancesRepository,
    permissions('crud|ru|r'),
  );

  // eslint-disable-next-line global-require
  const courseInstancesSpecialtiesRoute = require('./routes/course_instances-specialties')(
    courseInstancesSpecialtiesRepository,
    permissions('crud|r|r'),
  );

  app.use(
    cors({
      exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-MD5'],
    }),
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', { stream: logger.stream }));

  app.use('/', express.static('dist/better-moodle-ui'));

  app.use('/api/v1/login', createAuthenticationRoute(userRepository));

  app.use('/api', createAuthorizationVerifier(userRepository).validateUser);

  app.use('/api/v1/admins', createRoute(adminsRepository, permissions('crud||')));
  app.use('/api/v1/teachers', createRoute(teachersRepository, permissions('crud|r|r')));
  app.use('/api/v1/students', createRoute(studentsRepository, permissions('crud|r|r')));
  app.use('/api/v1/courses', createRoute(coursesRepository, permissions('crud|r|r')));
  app.use('/api/v1/groups', createRoute(groupsRepository, permissions('crud|r|r')));
  app.use('/api/v1/specialties', createRoute(specialtiesRepository, permissions('crud|r|r')));
  app.use('/api/v1/lab_reports', createLabReportsRoute(labReportsRepository, permissions('crud|ru|cr|')));
  app.use('/api/v1/course_instances', courseInstancesRoute);
  app.use('/api/v1/course_instances-specialties', courseInstancesSpecialtiesRoute);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // eslint-disable-next-line no-unused-vars
  app.use((err, request, response, next) => {
    let error;
    if (err instanceof FeathersError) {
      error = err.toJSON();
    } else {
      logger.error(err);
      error = err;
      error.code = err.code || 500;
      error.message = err.message || 'UNKNOWN_SERVER_ERROR';
    }
    return response.status(error.code).json(error.message);
  });

  return app;
};
