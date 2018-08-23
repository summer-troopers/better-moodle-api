'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
const { handleId, appendParentData, projectDatabaseResponse } = require('../helpers/util');

module.exports = function createLabTasksRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'tasks',
    model: 'LabTaskFile',
    mongooseConnection: mongoConnection,
  });

  const LabTaskFile = gridFS.model;

  const { models } = sqlConnection;

  const { LabTask, Course, Teacher } = models;

  const queryParamsBindings = {
    courseId: [Course],
    teacherId: [Teacher],
    labReportId: [models.LabReport],
    specialtyId: [Course, models.Specialty],
    groupId: [Course, models.Specialty, models.Group],
    labCommentId: [models.LabReport, models.LabComment],
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

    let tasks = await handleId(queryParams, LabTask, filter, queryParamsBindings);

    if (!tasks) tasks = await LabTask.findAndCountAll(filter);

    await appendParentData(tasks.rows, Course);
    await appendParentData(tasks.rows, Teacher);

    return projectDatabaseResponse(tasks, projector);
  }

  async function view(labTaskId) {
    const task = await LabTask.findById(labTaskId);
    const metadata = await getFile(task.mongoFileId);
    if (!metadata) throw new errors.NotFound('LAB_TASK_FILE_NOT_FOUND');
    const stream = LabTaskFile.readById(task.mongoFileId);
    return {
      metadata,
      stream,
    };
  }

  function getFile(fileId) {
    return new Promise((resolve, reject) => {
      LabTaskFile.findById(fileId, (error, result) => {
        if (error) {
          if (error.message === 'not found') error = new errors.NotFound('LAB_TASK_FILE_NOT_FOUND');
          logger.error(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  async function exists(labTaskId) {
    const result = await LabTask.findById(labTaskId);
    if (!result) return false;
    return true;
  }

  async function add(data) {
    const course = await Course.findById(data.courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    const teacher = Teacher.findById(data.teacherId);
    if (!teacher) throw new error.NotFound('TEACHER_NOT_FOUND');
    const task = await LabTask.findOne({
      where: {
        courseId: data.courseId,
        teacherId: data.teacherId,
      },
    });
    if (task) {
      return update(task.id, data);
    }
    return LabTask.create({
      courseId: data.courseId,
      teacherId: data.teacherId,
      mongoFileId: data.fileId,
    });
  }

  async function update(labTaskId, data) {
    const task = await LabTask.findById(labTaskId);
    if (data.fileId) {
      await removeFile(task.mongoFileId);
      data.mongoFileId = data.fileId;
    }
    return LabTask.update(data, {
      where: { id: labTaskId },
    });
  }

  async function remove(labTaskId) {
    const task = await LabTask.findById(labTaskId);
    await removeFile(task.mongoFileId);

    try {
      return await LabTask.destroy({
        where: { id: labTaskId },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_LAB_TASK');
      }
      throw error;
    }
  }

  function removeFile(fileId) {
    return new Promise((resolve, reject) => {
      LabTaskFile.unlinkById(fileId, (error, result) => {
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
