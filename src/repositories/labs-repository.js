'use strict';

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
<<<<<<< HEAD
<<<<<<< HEAD
const { handleId } = require('../helpers/util');
=======
const { buildIncludes } = require('../helpers/util');
const logger = require('../services/winston/logger');
>>>>>>> moved generic function handleId from repositories to util
=======
const { handleId } = require('../helpers/util');
>>>>>>> refactored generic functions in repository, added connection to tables with oneToMany bindings(labComment, student and group)

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
    taskId: [LabTask],
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

    const response = handleId(queryParams, LabReport, filter, queryParamsBindings);

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
<<<<<<< HEAD
=======

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
>>>>>>> removed extra properties from conditioned view of models
=======
>>>>>>> refactored generic functions in repository, added connection to tables with oneToMany bindings(labComment, student and group)
