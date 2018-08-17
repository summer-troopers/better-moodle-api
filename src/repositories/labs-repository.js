'use strict';

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { handleId } = require('../helpers/util');

module.exports = function createLabsRepository(connection) {
  const gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('fs');

  const {
    LabTask,
    LabComment,
    Student,
    Group,
    Specialty,
    Course,
    Teacher,
  } = connection.models;

  const projector = (item) => {
    return {
      id: item.id,
      studentId: item.studentId,
      labTaskId: item.labTaskId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  };

  const queryParamsBindings = {
    labCommentId: [LabComment],
    studentId: [Student],
    groupId: [Student, Group],
    specialtyId: [Student, Group, Specialty],
    labTaskId: [LabTask],
    teacherId: [LabTask, Teacher],
    courseId: [LabTask, Teacher, Course],
  };

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

    const response = handleId(queryParams, LabReport, filter, queryParamsBindings, projector);

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
<<<<<<< HEAD
=======

function handleId(queryParamId, response, LabReport, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = LabReport.findAndCountAll(query);
    return response.then((results) => {
      const resultedRows = results.rows.map((item) => {
        return {
          id: item.id,
          studentId: item.studentId,
          labTaskId: item.labTaskId,
          mongoFileId: item.mongoFileId,
        };
      });
      results.rows = resultedRows;
      return results;
    });
  }
  return LabReport.findAndCountAll(query);
}
>>>>>>> removed extra properties from conditioned view of models
