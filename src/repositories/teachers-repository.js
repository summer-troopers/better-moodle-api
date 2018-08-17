'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { buildIncludes } = require('../helpers/util');
const logger = require('../services/winston/logger');

module.exports = function createTeacherRepository(connection) {
  const {
    Course,
    Specialty,
    Group,
    Student,
    LabReport,
    LabTask,
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

    response = handleId(incomingParamValues[0], response, Teacher, filter, getModels(incomingParamKeys[0]));

    if (response) {
      return response;
    }
    return Teacher.findAndCountAll(filter);
  }

  async function view(id) {
    return Teacher.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
      const teacher = await Teacher.findById(form.teacherId);
      if (!teacher) throw new errors.NotFound('TEACHER_NOT_FOUND');
      return teacher.addCourse(course);
    }
    return Teacher.create(form);
  }

  async function exists(id) {
    const result = await Teacher.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Teacher.update(form, {
      where: { id },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseTeacher.destroy({
        where: {
          courseId: queryParams.courseId,
          teacherId: id,
        },
      });
    }

    return Teacher.destroy({
      where: { id },
    });
  }

  return {
    list,
    view,
    add,
    update,
    remove,
    exists,
  };

  function getModels(key) {
    const keys = ['courseId', 'specialtyId', 'groupId', 'studentId', 'laboratoryId', 'taskId'];
    const models = [Course, Specialty, Group, Student, LabReport, LabTask];
    const i = keys.findIndex(itKey => key === itKey);
    return models.slice(0, i + 1);
  }
};

function handleId(queryParamId, response, Teacher, filter, models) {
  if (!queryParamId) return null;
  const query = {
    ...filter,
    subQuery: false,
    ...buildIncludes(queryParamId, models),
  };
  response = Teacher.findAndCountAll(query);
  return response.then((results) => {
    if (!Array.isArray(results.rows)) {
      logger.error('NOT_AN_ARRAY');
      return null;
    }
    const resultedRows = results.rows.map((item) => {
      return {
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phoneNumber: item.phoneNumber,
      };
    });
    results.rows = resultedRows;
    return results;
  });
}
