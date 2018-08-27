'use strict';

const config = require('config');
const createGridFS = require('mongoose-gridfs');
const fs = require('fs');
const faker = require('faker');

const mongooseConnector = require('../services/connectors/mongo-connector')(config.mongo);

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const connection = await mongooseConnector.connect();
    const gridFS = createGridFS({
      collection: 'tasks',
      model: 'LabTasksFile',
      mongooseConnection: connection,
    });
    const LabTasksFile = gridFS.model;

    const file = await new Promise((resolve, reject) => {
      LabTasksFile.write(
        {
          filename: 'Dockerfile',
          contentType: 'text/plain',
        },
        fs.createReadStream('./Dockerfile'),
        (error, createdFile) => {
          if (error) return reject(error);
          return resolve(createdFile);
        },
      );
    });

    const { sequelize } = queryInterface;
    const Teacher = sequelize.import('../models/teacher.js');
    const Course = sequelize.import('../models/course.js');
    const CourseInstance = sequelize.import('../models/course_instance.js');
    return CourseInstance.bulkCreate(await generate10CourseInstances(Teacher, Course, file.id), {});
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('course_instances', null, {});
  },
};

async function generate10CourseInstances(Teacher, Course, fileId) {
  const courses = await Course.findAll({ attributes: ['id'] });
  const teachers = await Teacher.findAll({ attributes: ['id'] });
  const courseInstances = [
    {
      teacherId: 1,
      courseId: 1,
      labTasksFileId: fileId,
    },
  ];

  for (let i = 0; i < 10; i += 1) {
    const courseIndex = faker.random.number(courses.length - 1);
    const teacherIndex = faker.random.number(teachers.length - 1);
    courseInstances.push({
      teacherId: teachers[teacherIndex].id,
      courseId: courses[courseIndex].id,
      labTasksFileId: fileId,
    });
  }

  return courseInstances;
}
