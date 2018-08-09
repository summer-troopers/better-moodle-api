const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const errors = require('@feathersjs/errors');
const roles = require('../helpers/constants/roles');

module.exports = function createLabsRepository(mongoConnection, sqlConnection) {
  const gridFS = Grid(mongoConnection.db, mongoose.mongo);
  gridFS.collection('tasks');

  const { LabTask } = sqlConnection.models;

  const gridFSStorage = new GridFsStorage({
    db: mongoConnection.db,
    file: (request, file) => {
      const filename = `Task-${Date.now()}-${file.originalname}`;

      return {
        filename,
        bucketName: 'tasks',
      };
    },
  });

  async function list() {
    const result = await gridFS.files.find().toArray();
    return result;
  }

  async function view(fileName) {
    const result = await gridFS.files.findOne({
      filename: fileName,
    });
    return result;
  }

  function add(fileId, params) {

  }

  async function remove(fileId) {
    await gridFS.remove({
      _id: fileId,
      root: 'fs',
    });
  }

  return {
    list,
    view,
    add,
    remove,
    storage: gridFSStorage,
  };
};
