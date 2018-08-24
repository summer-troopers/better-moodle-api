'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
const { handleId, appendParentData } = require('../helpers/util');

module.exports = function createLabTasksRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'tasks',
    model: 'LabTaskFile',
    mongooseConnection: mongoConnection,
  });

  const LabTasksFile = gridFS.model;

  const { models } = sqlConnection;

  const { Lab, Course, Teacher } = models;

  const queryParamsBindings = {
    courseId: [Course],
    teacherId: [Teacher],
    labReportId: [models.LabReport],
    specialtyId: [Course, models.Specialty],
    groupId: [Course, models.Specialty, models.Group],
    studentId: [Course, models.Specialty, models.Group, models.Student],
  };

  const projector = (row) => {
    return {
      id: row.id,
      teacherId: row.teacherId,
      courseId: row.courseId,
      teacher: {
        id: row.teacher.id,
        firstName: row.teacher.firstName,
        lastName: row.teacher.lastName,
        email: row.teacher.email,
        phoneNumber: row.teacher.phoneNumber,
      },
      course: {
        id: row.course.id,
        name: row.course.name,
      },
      fileExists: (row.mongoFileId !== null),
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
      order: [
        ['updatedAt', 'DESC'],
      ],
    };

    let labs = await handleId(queryParams, Lab, filter, queryParamsBindings);

    if (!labs) labs = await Lab.findAndCountAll(filter);

    await appendParentData(labs.rows, Course);
    await appendParentData(labs.rows, Teacher);

    labs.rows = labs.rows.map(projector);

    return labs;
  }

  async function view(id) {
    const task = await Lab.findById(id);
    const metadata = await getFile(task.mongoFileId);
    if (!metadata) throw new errors.NotFound('LAB_TASK_FILE_NOT_FOUND');
    const stream = LabTasksFile.readById(task.mongoFileId);
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
    const result = await Lab.findById(id);
    if (!result) return false;
    return true;
  }

  async function add({ courseId, teacherId }) {
    const course = await Course.findById(courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    const teacher = Teacher.findById(teacherId);
    if (!teacher) throw new error.NotFound('TEACHER_NOT_FOUND');
    const task = await Lab.findOne({
      where: {
        courseId,
        teacherId,
      },
    });
    if (task) throw new errors.Conflict('LAB_ALREADY_EXISTS');

    return Lab.create({
      courseId,
      teacherId,
    });
  }

  async function update(id, fileId) {
    const lab = await Lab.findById(id);
    if (lab && lab.mongoFileId) await removeFile(lab.mongoFileId);

    return Lab.update({
      mongoFileId: fileId,
    }, {
      where: { id },
    });
  }

  async function remove(id) {
    const task = await Lab.findById(id);

    let result;

    try {
      result = Lab.destroy({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_LAB');
      }
      throw error;
    }

    await removeFile(task.mongoFileId);

    return result;
  }

  function removeFile(fileId) {
    return new Promise((resolve, reject) => {
      LabTasksFile.unlinkById(fileId, (error, result) => {
        if (error) {
          if (error.message === 'not found') error = new errors.NotFound('LAB_TASK_FILE_NOT_FOUND');
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
