'use strict';

const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');

const logger = require('../services/winston/logger');

module.exports = function createLabTasksRepository(mongoConnection, sqlConnection) {
  const gridFS = createGridFS({
    collection: 'tasks',
    model: 'LabTaskFile',
    mongooseConnection: mongoConnection,
  });

  const LabTaskFile = gridFS.model;

  const { LabTask, Course, Teacher } = sqlConnection.models;

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
    return LabTask.findAndCountAll({
      limit,
      offset,
      attributes: ['id', 'courseId', 'teacherId'],
    });
  }

  async function view(id) {
    const task = await LabTask.findById(id);
    const stream = LabTaskFile.readById(task.mongoFileId);
    const metadata = await getFile(task.mongoFileId);
    return {
      metadata,
      stream,
    };
  }

  function getFile(id) {
    return new Promise((resolve, reject) => {
      LabTaskFile.findById(id, (error, result) => {
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

  async function add(fileId, courseId, teacherId) {
    const course = await Course.findById(courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    const teacher = Teacher.findById(teacherId);
    if (!teacher) throw new error.NotFound('TEACHER_NOT_FOUND');
    const task = await LabTask.findOne({
      where: {
        courseId,
        teacherId,
      },
    });
    if (task) {
      await remove(task.id);
    }
    return LabTask.create({
      courseId,
      teacherId,
      mongoFileId: fileId,
    });
  }

  async function remove(id) {
    const task = await LabTask.findById(id);
    await removeFile(task.mongoFileId);
    return LabTask.destroy({
      where: {
        id: task.id,
      },
    });
  }

  function removeFile(id) {
    return new Promise((resolve, reject) => {
      LabTaskFile.unlinkById(id, (error, result) => {
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
