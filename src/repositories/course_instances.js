'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
const roles = require('../helpers/constants/roles');
const { handleId, appendParentData, appendDependentData } = require('../helpers/util');

module.exports = function createCourseInstancesRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'tasks',
    model: 'LabTasksFile',
    mongooseConnection: mongoConnection,
  });

  const LabTasksFile = gridFS.model;

  const { models } = sqlConnection;

  const { CourseInstance, Course, Teacher } = models;

  const queryParamsBindings = {
    courseId: [Course],
    teacherId: [Teacher],
    labReportId: [models.LabReport],
    specialtyId: [models.Specialty],
    groupId: [models.Specialty, models.Group],
    studentId: [models.Specialty, models.Group, models.Student],
  };

  const projector = (row) => {
    return {
      id: row.id,
      teacherId: row.teacherId,
      teacher: {
        id: row.teacher.id,
        firstName: row.teacher.firstName,
        lastName: row.teacher.lastName,
        email: row.teacher.email,
        phoneNumber: row.teacher.phoneNumber,
      },
      courseId: row.courseId,
      course: {
        id: row.course.id,
        name: row.course.name,
        description: row.course.description,
      },
      fileExists: row.labTasksFileId !== null,
      labReports: row.labReports.map((labReportRow) => {
        return {
          id: labReportRow.id,
          studentId: labReportRow.studentId,
          courseInstanceId: labReportRow.courseInstanceId,
        };
      }),
    };
  };

  const gridFSStorage = new GridFsStorage({
    db: mongoConnection.db,
    file: (request, file) => {
      return {
        filename: file.originalname,
        bucketName: 'tasks',
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

    let courseInstances = await handleId(queryParams, CourseInstance, filter, queryParamsBindings);

    if (!courseInstances) courseInstances = await CourseInstance.findAndCountAll(filter);

    await appendParentData(courseInstances.rows, Course);
    await appendParentData(courseInstances.rows, Teacher);
    await appendDependentData(courseInstances.rows, {
      parent: CourseInstance,
      dependent: models.LabReport,
    });

    courseInstances.rows = courseInstances.rows.map(projector);

    return courseInstances;
  }

  async function view(id) {
    const row = await CourseInstance.findById(id);
    const metadata = await getFile(row.labTasksFileId);
    if (!metadata) throw new errors.NotFound('LAB_TASK_FILE_NOT_FOUND');
    const stream = LabTasksFile.readById(row.labTasksFileId);
    return {
      metadata,
      stream,
    };
  }

  function getFile(fileId) {
    return new Promise((resolve, reject) => {
      LabTasksFile.findById(fileId, (error, result) => {
        if (error) {
          if (error.message === 'not found') error = new errors.NotFound('LAB_TASK_FILE_NOT_FOUND');
          logger.error(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  async function exists(id) {
    const result = await CourseInstance.findById(id);
    if (!result) return false;
    return true;
  }

  async function assertNotExists({ courseId, teacherId }) {
    const row = await CourseInstance.findOne({
      where: {
        courseId,
        teacherId,
      },
    });

    if (row) {
      throw new errors.Conflict('COURSE_INSTANCE_ALREADY_EXISTS', {
        reason: 'There is already a combination of this teacher and this course and there can only be one',
      });
    }
  }

  async function add({ courseId, teacherId }) {
    const course = await Course.findById(courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    const teacher = Teacher.findById(teacherId);
    if (!teacher) throw new error.NotFound('TEACHER_NOT_FOUND');

    await assertNotExists({ courseId, teacherId });

    return CourseInstance.create({
      courseId,
      teacherId,
    });
  }

  async function update(id, fileId, user) {
    const instance = await CourseInstance.findById(id);
    if (user.userRole === roles.TEACHER && user.user !== instance.teacherId) {
      throw new errors.Forbidden('UPLOAD_PERMISSIONS_MISSING');
    }

    if (instance.labTasksFileId) await removeFile(instance.labTasksFileId);

    return CourseInstance.update(
      {
        labTasksFileId: fileId,
      },
      {
        where: { id },
      },
    );
  }

  // eslint-disable-next-line complexity
  async function remove(id, user) {
    const instance = await CourseInstance.findById(id);

    let result;

    if (user.userRole === roles.ADMIN) {
      try {
        result = await CourseInstance.destroy({
          where: { id },
        });
      } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
          throw new errors.Conflict('CANNOT_DELETE_COURSE_INSTANCE', {
            reason: 'There is either a lab report or a binding with a specialty that references this resource',
          });
        }
        throw error;
      }
    } else if (user.user === instance.teacherId) {
      result = await CourseInstance.update(
        {
          labTasksFileId: null,
        },
        {
          where: { id },
        },
      );
    } else {
      throw new errors.Forbidden('DELETE_PERMISSIONS_MISSING', {
        reason: 'This is not your course',
      });
    }

    await removeFile(instance.labTasksFileId);

    return result;
  }

  function removeFile(fileId) {
    return new Promise((resolve, reject) => {
      LabTasksFile.unlinkById(fileId, (error, result) => {
        if (error) {
          if (error.message === 'not found') resolve();
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
