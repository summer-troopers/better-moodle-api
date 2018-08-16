'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { buildIncludes } = require('../helpers/util');

module.exports = function createCommentRepository(connection) {
  const {
    LabComment,
    LabReport,
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
        LabComment: {
          [Op.like]: [`%${contains}%`],
        },
      },
    };

    let response = null;

    const incomingParamKeys = Object.keys(queryParams);
    const incomingParamValues = Object.values(queryParams);

    response = handleId(incomingParamValues[0], response, LabComment, filter, getModels(incomingParamKeys[0]));

    if (response) {
      return response;
    }
    return LabComment.findAndCountAll(filter);
  }

  // async function view(id) {
  //   return LabComment.findById(id);
  // }

  // async function add(form, queryParams) {
  //   if (queryParams.courseId) {
  //     const course = await Course.findById(queryParams.courseId);
  //     if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
  //     const teacher = await Teacher.findById(form.teacherId);
  //     if (!teacher) throw new errors.NotFound('TEACHER_NOT_FOUND');
  //     return teacher.addCourse(course);
  //   }
  //   return Teacher.create(form);
  // }

  // async function exists(id) {
  //   const result = await Teacher.findById(id);
  //   if (result) return true;
  //   return false;
  // }

  // async function update(id, form) {
  //   return Teacher.update(form, {
  //     where: { id },
  //   });
  // }

  // function remove(id, queryParams) {
  //   if (queryParams.courseId) {
  //     return CourseTeacher.destroy({
  //       where: {
  //         courseId: queryParams.courseId,
  //         teacherId: id,
  //       },
  //     });
  //   }

  //   return Teacher.destroy({
  //     where: { id },
  //   });
  // }

  return {
    list,
    // view,
    // add,
    // update,
    // remove,
    // exists,
  };

  function getModels(key) {
    const keys = ['laboratoryId'];
    const models = [LabReport];
    const i = keys.findIndex(itKey => key === itKey);
    return models.slice(0, i + 1);
  }
};

function handleId(queryParamId, response, LabComment, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = LabComment.findAndCountAll(query);
  }
  return response;
}
