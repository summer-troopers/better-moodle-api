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
      collection: 'reports',
      model: 'LabReportFile',
      mongooseConnection: connection,
    });
    const LabReportFile = gridFS.model;

    const file = await new Promise((resolve, reject) => {
      LabReportFile.write(
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
    const Student = sequelize.import('../models/student.js');
    const CourseInstance = sequelize.import('../models/course_instance.js');
    const LabReport = sequelize.import('../models/lab_report.js');
    return LabReport.bulkCreate(await generate10LabReports(Student, CourseInstance, file.id), {});
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('lab_reports', null, {});
  },
};

async function generate10LabReports(Student, CourseInstance, fileId) {
  const students = await Student.findAll({ attributes: ['id'] });
  const courseInstances = await CourseInstance.findAll({ attributes: ['id'] });
  const labReports = [
    {
      studentId: 1,
      courseInstanceId: 1,
      review: 'This is a review',
      mark: 5,
      labReportFileId: fileId,
    },
  ];

  for (let i = 0; i < 10; i += 1) {
    const studentIndex = faker.random.number(students.length - 1);
    const courseInstanceIndex = faker.random.number(courseInstances.length - 1);

    labReports.push({
      studentId: students[studentIndex].id,
      courseInstanceId: courseInstances[courseInstanceIndex].id,
      review: faker.lorem.sentence(),
      mark: faker.random.number({ min: 4, max: 10 }),
      labReportFileId: fileId,
    });
  }

  return labReports;
}
