'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const morgan = require('morgan');
const winston = require('../src/services/winston/winston');
const importModels = require('./models/import');
const createRoute = require('./routes/route-factory');
const createRepository = require('./services/repositories/repo-factory');


module.exports = function getApp(connection) {
  const app = express();

  importModels(connection);
  const adminRepo = createRepository(connection.models.Admin);
  const teacherRepo = createRepository(connection.models.Teacher);
  const studentRepo = createRepository(connection.models.Student);
  const courseRepo = createRepository(connection.models.Course);
  const groupRepo = createRepository(connection.models.Group);
  const specialityRepo = createRepository(connection.models.Speciality);

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('combined', { stream: winston.stream }));

  app.use('/api/v1/admins', createRoute(adminRepo));
  app.use('/api/v1/teachers', createRoute(teacherRepo));
  app.use('/api/v1/students', createRoute(studentRepo));
  app.use('/api/v1/courses', createRoute(courseRepo));
  app.use('/api/v1/groups', createRoute(groupRepo));
  app.use('/api/v1/specialities', createRoute(specialityRepo));

  return app;
};
