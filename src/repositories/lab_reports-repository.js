const mongoose = require('mongoose');
const createGridFS = require('mongoose-gridfs');
const GridFsStorage = require('multer-gridfs-storage');

module.exports = function createLabsRepository(mongoConnection, sqlConnection) {
  const gridFs = createGridFS({
    collection: 'reports',
    model: 'LabReportFile',
    mongooseConnection: mongoConnection.connection,
  });

  const LabReportFile = gridFs.model;

  const { LabReport } = sqlConnection.models;

  const gridFSStorage = new GridFsStorage({
    db: mongoConnection.db,
    file: (request, file) => {
      return {
        filename: file.originalname,
        bucketName: 'reports',
      };
    },
  });

  async function list() {
    return LabReport.findAndCountAll({
      attributes: ['id', 'labTaskId', 'studentId'],
    });
  }

  async function view(id) {
    const report = await LabReport.findById(id);
    const file = await gridFS.files.findOne({
      _id: report.mongoFileId,
    });
    return file;
  }

  async function add(fileId, labTaskId, studentId) {
    const report = await LabReport.findOne({
      where: {
        labTaskId,
        studentId,
      },
    });
    if (report) {
      await remove(report.id);
    }
    return LabReport.create({
      studentId,
      labTaskId,
      mongoFileId: fileId,
    });
  }

  async function remove(id) {
    const report = await LabReport.findById(id);
    const delRes = await gridFS.remove({
      _id: report.mongoFileId,
    });
    return LabReport.destroy({
      where: {
        id: report.id,
      },
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
