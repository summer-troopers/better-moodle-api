'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');
const { handleId } = require('../helpers/util');

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
      attributes: {
        exclude: ['mongoFileId', 'createdAt', 'updatedAt'],
      },
    };

    const response = handleId(queryParams, LabTask, filter, queryParamsBindings, projector);

    if (response) return response;

    return LabTask.findAndCountAll(filter);
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
          logger.error(error);
          return reject(error);
        }
        return resolve(result);
      });
    });
  }

  async function exists(id) {
    const result = await LabTask.findById(id);
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
      await update(task.id, data);
    }
    return LabTask.create({
      courseId: data.courseId,
      teacherId: data.teacherId,
      mongoFileId: data.fileId,
    });
  }

  function update(labTaskId, data) {
    return LabTask.update(data, {
      where: { id: labTaskId },
    });
  }

  async function remove(labTaskId) {
    const task = await LabTask.findById(labTaskId);
    await removeFile(task.mongoFileId);
    return LabTask.destroy({
      where: {
        id: task.id,
      },
    });
  }

  function removeFile(fileId) {
    return new Promise((resolve, reject) => {
      LabTaskFile.unlinkById(fileId, (error, result) => {
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
