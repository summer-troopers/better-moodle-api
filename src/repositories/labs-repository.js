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

    const incomingParamKeys = Object.keys(queryParams);
    const incomingParamValues = Object.values(queryParams);

    response = handleId(incomingParamValues[0], response, LabReport, filter, getModels(incomingParamKeys[0]));

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

  function getModels(key) {
    const keys = ['studentId', 'groupId', 'specialty', 'courseId', 'teacherId', 'taskId'];
    const models = [Student, Group, Specialty, Course, Teacher, LabTask];
    const i = keys.findIndex(itKey => key === itKey);
    return models.slice(0, i + 1);
  }
};

function handleId(queryParamId, response, LabReport, filter, models) {
  if (!queryParamId) return null;
  const query = {
    ...filter,
    subQuery: false,
    ...buildIncludes(queryParamId, models),
  };
  response = LabReport.findAndCountAll(query);
  return response.then((results) => {
    if (!Array.isArray(results.rows)) {
      logger.error('NOT_AN_ARRAY');
      return null;
    }
    const resultedRows = results.rows.map((item) => {
      return {
        id: item.id,
        studentId: item.studentId,
        labTaskId: item.labTaskId,
      };
    });
    results.rows = resultedRows;
    return results;
  });
}
