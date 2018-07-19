const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

module.exports = function createLabsRepository(connection) {
  let gfs;

  connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('fs');
  });

  function list() {
    const result = gfs.files.find().toArray();
    return result;
  }

  function view(fileName) {
    const result = gfs.files.findOne({ filename: fileName });
    return result;
  }
  function add() {
  }

  function remove(fileId) {
    gfs.remove({ _id: fileId, root: 'fs' });
  }

  return {
    list,
    view,
    add,
    remove,
  };
};
