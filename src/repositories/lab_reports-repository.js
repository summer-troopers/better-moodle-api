'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
// eslint-disable-next-line object-curly-newline
const { handleId, appendParentData, appendParentDataDeep, projectDatabaseResponse } = require('../helpers/util');

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
      labTaskId: row.labTaskId,
      student: {
        id: row.student.id,
        firstName: row.student.firstName,
        lastName: row.student.lastName,
        email: row.student.email,
        phoneNumber: row.student.phoneNumber,
        groupId: row.student.groupId,
      },
      labTask: {
        id: row.labTask.id,
        teacherId: row.labTask.teacherId,
        courseId: row.labTask.courseId,
        course: {
          id: row.labTask.course.id,
          name: row.labTask.course.name,
        },
      },
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
    };

    let reports = await handleId(queryParams, LabReport, filter, queryParamsBindings, projector);

    if (!reports) reports = await LabReport.findAndCountAll(filter);

    await appendParentData(reports.rows, Student);

    await appendParentDataDeep(reports.rows, [LabTask, models.Course]);

    return projectDatabaseResponse(reports, projector);
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
          if (error.message === 'not found') error = new errors.NotFound('LAB_REPORT_FILE_NOT_FOUND');
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
    if (data.fileId) {
      await removeFile(report.mongoFileId);
      data.mongoFileId = data.fileId;
    }
    const result = LabReport.update(data, {
      where: { id: labReportId },
    });

    return result;
  }

  async function remove(labReportId) {
    const report = await LabReport.findById(labReportId);
    await removeFile(report.mongoFileId);
    try {
      return await LabReport.destroy({
        where: {
          id: labReportId,
        },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Forbidden('CANNOT_DELETE_REPORT');
      }
      throw error;
    }
  }

  function removeFile(fileId) {
    return new Promise((resolve, reject) => {
      LabReportFile.unlinkById(fileId, (error, result) => {
        if (error) {
          if (error.message === 'not found') error = new errors.NotFound('LAB_REPORT_FILE_NOT_FOUND');
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
