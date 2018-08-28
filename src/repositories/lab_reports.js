'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
// eslint-disable-next-line object-curly-newline
const { handleId, appendParentDataDeep } = require('../helpers/util');

module.exports = function createLabReportsRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'reports',
    model: 'LabReportFile',
    mongooseConnection: mongoConnection,
  });

  const LabReportFile = gridFS.model;

  const { models } = sqlConnection;

  const { LabReport, CourseInstance, Student } = models;

  const queryParamsBindings = {
    courseInstanceId: [CourseInstance],
    studentId: [Student],
    teacherId: [CourseInstance, models.Teacher],
    courseId: [CourseInstance, models.Course],
    groupId: [Student, models.Group],
    // TODO: Is this the right route, there is a shorter one, but does that mean this is not the right one?
    specialtyId: [Student, models.Group, models.Specialty],
  };

  const projector = (row) => {
    return {
      id: row.id,
      review: row.review,
      mark: row.mark,
      studentId: row.studentId,
      student: {
        id: row.student.id,
        firstName: row.student.firstName,
        lastName: row.student.lastName,
        email: row.student.email,
        phoneNumber: row.student.phoneNumber,
        groupId: row.student.groupId,
        group: {
          id: row.student.group.id,
          name: row.student.group.name,
          specialtyId: row.student.group.specialtyId,
          specialty: {
            id: row.student.group.specialty.id,
            name: row.student.group.specialty.name,
            description: row.student.group.specialty.description,
          },
        },
      },
      courseInstanceId: row.courseInstanceId,
      courseInstance: {
        id: row.courseInstance.id,
        teacherId: row.courseInstance.teacherId,
        teacher: {
          id: row.courseInstance.teacher.id,
          firstName: row.courseInstance.teacher.firstName,
          lastName: row.courseInstance.teacher.lastName,
          email: row.courseInstance.teacher.email,
          phoneNumber: row.courseInstance.teacher.phoneNumber,
        },
        courseId: row.courseInstance.courseId,
        course: {
          id: row.courseInstance.course.id,
          name: row.courseInstance.course.name,
          description: row.courseInstance.course.description,
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
      order: [['updatedAt', 'DESC']],
    };

    let reports = await handleId(queryParams, LabReport, filter, queryParamsBindings, projector);

    if (!reports) reports = await LabReport.findAndCountAll(filter);

    await appendParentDataDeep(reports.rows, [Student, models.Group, models.Specialty]);
    await appendParentDataDeep(reports.rows, [CourseInstance, models.Course]);
    await appendParentDataDeep(reports.rows, [CourseInstance, models.Teacher]);

    reports.rows = reports.rows.map(projector);

    return reports;
  }

  async function view(id) {
    const report = await LabReport.findById(id);
    const metadata = await getFile(report.labReportFileId);
    if (!metadata) throw new errors.NotFound('LAB_REPORT_FILE_NOT_FOUND');
    const stream = LabReportFile.readById(report.labReportFileId);
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
        courseInstanceId: data.courseInstanceId,
        studentId: data.studentId,
      },
    });
    if (report) throw new errors.Conflict('LAB_REPORT_ALREADY_EXISTS');

    const task = await CourseInstance.findById(data.courseInstanceId);
    if (!task) throw new errors.NotFound('LAB_TASK_NOT_FOUND');
    const student = await Student.findById(data.studentId);
    if (!student) throw new errors.NotFound('STUDENT_NOT_FOUND');

    return LabReport.create({
      courseInstanceId: data.courseInstanceId,
      studentId: data.studentId,
      labReportFileId: data.fileId,
    });
  }

  async function update(id, data) {
    return LabReport.update(
      {
        review: data.review,
        mark: data.mark,
      },
      {
        where: { id },
      },
    );
  }

  async function remove(id) {
    const report = await LabReport.findById(id);
    await removeFile(report.labReportFileId);
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
