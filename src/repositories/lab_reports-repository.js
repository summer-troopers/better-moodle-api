const errors = require('@feathersjs/errors');
const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const logger = require('../services/winston/logger');
// const GridFSBucket = require('mongodb');

// FIXME: THIS IS NOT FINISHED, DECIDE BETWEEN 'mongoose-gridfs' or 'GridFSBucket'
// Let's try 'mongoose-gridfs' for now

module.exports = function createLabsRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'reports',
    model: 'LabReportFile',
    mongooseConnection: mongoConnection,
  });

  const LabReportFile = gridFS.model;

  const { LabReport } = sqlConnection.models;

  const gridFSStorage = new GridFsStorage({
    db: mongoConnection.db,
    file: (request, file) => {
      return {
        filename: file.originalname,
        bucketName: 'reports',
      };
    },
  });

  async function list(queryParams) {
    const { limit, offset } = queryParams;
    return LabReport.findAndCountAll({
      limit,
      offset,
      attributes: ['id', 'labTaskId', 'studentId'],
    });
  }

  async function view(id) {
    const report = await LabReport.findById(id);
    if (!report) throw new errors.NotFound('LAB_REPORT_NOT_FOUND');
    const stream = LabReportFile.readById(report.mongoFileId);
    const metadata = await new Promise((resolve, reject) => {
      LabReportFile.findById(report.mongoFileId, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
    return {
      metadata,
      stream,
    };
  }

  async function add(fileId, labTaskId, studentId) {
    const report = await LabReport.findOne({
      where: {
        labTaskId,
        studentId,
      },
    });
    if (report) {
      await remove(report.id);
    }
    return LabReport.create({
      labTaskId,
      studentId,
      mongoFileId: fileId,
    });
  }

  async function remove(id) {
    const report = await LabReport.findById(id);
    await new Promise((resolve, reject) => {
      LabReportFile.unlinkById(report.mongoFileId, (error, result) => {
        if (error) {
          logger.error(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
    return LabReport.destroy({
      where: {
        id: report.id,
      },
    });
  }

  return {
    list,
    view,
    add,
    remove,
    storage: gridFSStorage,
  };
};
