'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
// eslint-disable-next-line object-curly-newline
const { handleId, appendParentData, appendParentDataDeep } = require('../helpers/util');

module.exports = function createLabReportsRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'reports',
    model: 'LabReportFile',
    mongooseConnection: mongoConnection,
  });

  const LabReportFile = gridFS.model;

  const { models } = sqlConnection;

  const { LabReport, Lab, Student } = models;

  const queryParamsBindings = {
    labId: [Lab],
    studentId: [Student],
    teacherId: [Lab, models.Teacher],
    courseId: [Lab, models.Course],
    groupId: [Student, models.Group],
    specialtyId: [Student, models.Group, models.Specialty],
  };

  const projector = (row) => {
    return {
      id: row.id,
      review: row.review,
      mark: row.mark,
      studentId: row.studentId,
      labId: row.labId,
      student: {
        id: row.student.id,
        firstName: row.student.firstName,
        lastName: row.student.lastName,
        email: row.student.email,
        phoneNumber: row.student.phoneNumber,
        groupId: row.student.groupId,
      },
      lab: {
        id: row.lab.id,
        teacherId: row.lab.teacherId,
        courseId: row.lab.courseId,
        course: {
          id: row.lab.course.id,
          name: row.lab.course.name,
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
      order: [
        ['updatedAt', 'DESC'],
      ],
    };

    let reports = await handleId(queryParams, LabReport, filter, queryParamsBindings, projector);

    if (!reports) reports = await LabReport.findAndCountAll(filter);

    await appendParentData(reports.rows, Student);

    await appendParentDataDeep(reports.rows, [Lab, models.Course]);

    reports.rows = reports.rows.map(projector);

    return reports;
  }

  async function view(id) {
    const report = await LabReport.findById(id);
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

  async function exists(id) {
    const result = await LabReport.findById(id);
    if (!result) return false;
    return true;
  }

  async function add(data) {
    const report = await LabReport.findOne({
      where: {
        labId: data.labId,
        studentId: data.studentId,
      },
    });
    if (report) throw new errors.Conflict('LAB_REPORT_ALREADY_EXISTS');

    const task = await Lab.findById(data.labId);
    if (!task) throw new errors.NotFound('LAB_TASK_NOT_FOUND');
    const student = await Student.findById(data.studentId);
    if (!student) throw new errors.NotFound('STUDENT_NOT_FOUND');

    return LabReport.create({
      labId: data.labId,
      studentId: data.studentId,
      mongoFileId: data.fileId,
    });
  }

  async function update(id, data) {
    return LabReport.update({
      review: data.review,
      mark: data.mark,
    }, {
      where: { id },
    });
  }

  async function remove(id) {
    const report = await LabReport.findById(id);
    await removeFile(report.mongoFileId);
    try {
      return await LabReport.destroy({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_LAB_REPORT');
      }
      throw error;
    }
  }

  function removeFile(fileId) {
    return new Promise((resolve, reject) => {
      LabReportFile.unlinkById(fileId, (error, result) => {
        if (error) {
          if (error.message === 'not found') return null;
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
