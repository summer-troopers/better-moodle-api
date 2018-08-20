'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { FeathersError } = require('@feathersjs/errors');
const config = require('config');

const swaggerDocument = require('../swagger.json');
const logger = require('../src/services/winston/logger');

const importModels = require('./models');
const createRoute = require('./routes/route-factory');
const createAuthenticationRoute = require('./routes/authentication-route');
const createLabsRoute = require('./routes/labs-route');

const createUserRepository = require('./repositories/users-repository');
const createAuthorizationVerifier = require('./middlewares/authorization-verifier');

const { permissions } = require('./helpers/util');

module.exports = function getApp(sqlConnection, mongoConnection) {
  const app = express();

  importModels(sqlConnection);

  const adminsRepository = require('./repositories/admins-repository')(sqlConnection); // eslint-disable-line global-require
  const teachersRepository = require('./repositories/teachers-repository')(sqlConnection); // eslint-disable-line global-require
  const studentsRepository = require('./repositories/students-repository')(sqlConnection); // eslint-disable-line global-require
  const coursesRepository = require('./repositories/courses-repository')(sqlConnection); // eslint-disable-line global-require
  const groupsRepository = require('./repositories/groups-repository')(sqlConnection); // eslint-disable-line global-require
  const specialtiesRepository = require('./repositories/specialties-repository')(sqlConnection); // eslint-disable-line global-require

  const userRepository = createUserRepository(sqlConnection);

  const labCommentsRepository = require('./repositories/lab-comments-repository')(sqlConnection); // eslint-disable-line global-require
  const labReportsRepository = require('./repositories/lab_reports-repository')(mongoConnection, sqlConnection); // eslint-disable-line global-require
  const labTasksRepository = require('./repositories/lab_tasks-repository')(mongoConnection, sqlConnection); // eslint-disable-line global-require

  const labReportsRoute = createLabsRoute(labReportsRepository, permissions('crud|r|crud|'), config.labRoutes.labReports);
  const labTasksRoute = createLabsRoute(labTasksRepository, permissions('crud|crud|r|'), config.labRoutes.labTasks);

  app.use(cors({
    exposedHeaders: 'Content-Disposition',
  }));
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
  app.use('/api/v1/lab_comments', createRoute(labCommentsRepository, permissions('crud|crud|r')));
  app.use('/api/v1/lab_reports', labReportsRoute);
  app.use('/api/v1/lab_tasks', labTasksRoute);

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
