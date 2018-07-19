const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

module.exports = function createLabsRepository(connection) {
  const gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('fs');

  async function list() {
    const result = await gfs.files.find().toArray();
    return result;
  }

  async function view(fileName) {
    const result = await gfs.files.findOne({ filename: fileName });
    return result;
  }
  function add() {
  }

  async function remove(fileId) {
    await gfs.remove({ _id: fileId, root: 'fs' });
  }

  return {
    list,
    view,
    add,
    remove,
  };
};
