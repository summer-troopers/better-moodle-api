const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { buildIncludes } = require('../helpers/util');

module.exports = function createLabsRepository(connection) {
  const gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('fs');

  const {
    LabReport,
    LabTask,
    Student,
    Group,
    Specialty,
    Course,
    Teacher,
  } = connection.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      groupId,
      specialtyId,
      courseId,
      teacherId,
      taskId,
    } = queryParams;

    const filter = {
      limit,
      offset,
      where: {
        firstName: {
          [Op.like]: [`%${contains}%`],
        },
      },
      attributes: {
        exclude: ['password'],
      },
    };

    let response = null;

    const modelsCollection1 = [Student];
    const modelsCollection2 = modelsCollection1.concat([Group]);
    const modelsCollection3 = modelsCollection2.concat([Specialty]);
    const modelsCollection4 = modelsCollection2.concat([Course]);
    const modelsCollection5 = modelsCollection3.concat([Teacher]);
    const modelsCollection6 = [LabTask];

    response = handleId(studentId, response, LabReport, filter, modelsCollection1);
    response = handleId(groupId, response, LabReport, filter, modelsCollection2);
    response = handleId(specialtyId, response, LabReport, filter, modelsCollection3);
    response = handleId(courseId, response, LabReport, filter, modelsCollection4);
    response = handleId(teacherId, response, LabReport, filter, modelsCollection5);
    response = handleId(taskId, response, LabReport, filter, modelsCollection6);

    if (response) {
      return response;
    }
    return LabReport.findAndCountAll(filter).toArray();
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

function handleId(queryParamId, response, LabReport, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = LabReport.findAndCountAll(query);
  }
  return response;
}
