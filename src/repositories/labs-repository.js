const config = require('config');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const connection = mongoose.createConnection(config.mongo, { useNewUrlParser: true });

let gfs;

connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('fs');
});

module.exports = function createLabsRepository() {
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
