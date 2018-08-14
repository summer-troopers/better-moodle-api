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

  async function view(id) {
    const report = await LabReport.findById(id);
    const stream = LabReportFile.readById(report.mongoFileId);
    const metadata = await getFile(report.mongoFileId);
    return {
      metadata,
      stream,
    };
  }

  function getFile(id) {
    return new Promise((resolve, reject) => {
      LabReportFile.findById(id, (error, result) => {
        if (error) {
          logger.error(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  async function exists(id) {
    const result = await LabReport.findById(id);
    if (!result) return false;
    return true;
  }

  async function add(fileId, labTaskId, studentId) {
    const task = await LabTask.findById(labTaskId);
    if (!task) throw new errors.NotFound('LAB_TASK_NOT_FOUND');
    const student = await Student.findById(studentId);
    if (!student) throw new errors.NotFound('STUDENT_NOT_FOUND');
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
    await removeFile(report.mongoFileId);
    return LabReport.destroy({
      where: {
        id: report.id,
      },
    });
  }

  function removeFile(id) {
    return new Promise((resolve, reject) => {
      LabReportFile.unlinkById(id, (error, result) => {
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
    remove,
    removeFile,
    storage: gridFSStorage,
  };
};
