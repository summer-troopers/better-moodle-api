
const config = require('config');
const createGridFS = require('mongoose-gridfs');
const fs = require('fs');

const mongooseConnector = require('../services/connectors/mongo-connector')(config.mongo);

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const connection = await mongooseConnector.connect();
    const gridFS = createGridFS({
      collection: 'reports',
      model: 'LabReportFile',
      mongooseConnection: connection,
    });
    const LabReportFile = gridFS.model;

    const file = await new Promise((resolve, reject) => {
      LabReportFile.write({
        filename: 'Dockerfile',
        contentType: 'text/plain',
      },
      fs.createReadStream('./Dockerfile'),
      (error, createdFile) => {
        if (error) return reject(error);
        return resolve(createdFile);
      });
    });

    const { sequelize } = queryInterface;
    const LabReport = sequelize.import('../models/lab_report.js');
    return LabReport.bulkCreate([{
      studentId: 1,
      labTaskId: 1,
      mongoFileId: file.id,
    }], {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_reports', null, {}); },
};
