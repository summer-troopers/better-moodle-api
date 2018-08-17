'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
const { handleId } = require('../helpers/util');

module.exports = function createLabReportsRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'reports',
    model: 'LabReportFile',
    mongooseConnection: mongoConnection,
  });

  const LabReportFile = gridFS.model;

  const { models } = sqlConnection;

  const { LabReport, LabTask, Student } = models;

  const queryParamsBindings = {
    labTaskId: [LabTask],
    studentId: [Student],
    labCommentId: [models.LabComment],
    teacherId: [LabTask, models.Teacher],
    courseId: [LabTask, models.Course],
    groupId: [Student, models.Group],
    specialtyId: [Student, models.Group, models.Specialty],
  };

  const projector = (row) => {
    return {
      id: row.id,
      studentId: row.studentId,
      labReportId: row.labReportId,
    };
  };

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

    const filter = {
      limit,
      offset,
      attributes: {
        exclude: ['mongoFileId', 'createdAt', 'updatedAt'],
      },
    };

    const response = handleId(queryParams, LabReport, filter, queryParamsBindings, projector);

    if (response) return response;

    return LabReport.findAndCountAll(filter);
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
