'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');

module.exports = function createLabReportsRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'reports',
    model: 'LabReportFile',
    mongooseConnection: mongoConnection,
  });

  const LabReportFile = gridFS.model;

  const { LabReport, LabTask, Student } = sqlConnection.models;

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

  async function view(labReportId) {
    const report = await LabReport.findById(labReportId);
    const metadata = await getFile(report.mongoFileId);
    if (!metadata) throw new errors.NotFound('LAB_REPORT_FILE_NOT_FOUND');
    const stream = LabReportFile.readById(report.mongoFileId);
    return {
      metadata,
      stream,
    };
  }

  function getFile(fileId) {
    return new Promise((resolve, reject) => {
      LabReportFile.findById(fileId, (error, result) => {
        if (error) {
          logger.error(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  async function exists(labReportId) {
    const result = await LabReport.findById(labReportId);
    if (!result) return false;
    return true;
  }

  async function add(data) {
    const task = await LabTask.findById(data.labTaskId);
    if (!task) throw new errors.NotFound('LAB_TASK_NOT_FOUND');
    const student = await Student.findById(data.studentId);
    if (!student) throw new errors.NotFound('STUDENT_NOT_FOUND');
    const report = await LabReport.findOne({
      where: {
        labTaskId: data.labTaskId,
        studentId: data.studentId,
      },
    });
    if (report) {
      return update(report.id, data);
    }
    return LabReport.create({
      labTaskId: data.labTaskId,
      studentId: data.studentId,
      mongoFileId: data.fileId,
    });
  }

  async function update(labReportId, data) {
    const report = await LabReport.findById(labReportId);
    await removeFile(report.mongoFileId);
    return LabReport.update(data, {
      where: { id: labReportId },
    });
  }

  async function remove(labReportId) {
    const report = await LabReport.findById(labReportId);
    await removeFile(report.mongoFileId);
    return LabReport.destroy({
      where: {
        id: report.id,
      },
    });
  }

  function removeFile(fileId) {
    return new Promise((resolve, reject) => {
      LabReportFile.unlinkById(fileId, (error, result) => {
        if (error) {
          logger.error(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  return {
    list,
    view,
    exists,
    add,
    update,
    remove,
    removeFile,
    storage: gridFSStorage,
  };
};
