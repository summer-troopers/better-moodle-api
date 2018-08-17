'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { buildIncludes } = require('../helpers/util');

module.exports = function createSpecialtiesRepository(sequelize) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabReport,
    LabTask,
  } = sequelize.models;

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
        name: {
          [Op.like]: [`%${contains}%`],
        },
      },
    };

    let response = null;

    const incomingParamKeys = Object.keys(queryParams);
    const incomingParamValues = Object.values(queryParams);

    response = handleId(incomingParamValues[0], response, Specialty, filter, getModels(incomingParamKeys[0]));

    if (response) {
      return response;
    }
    return Specialty.findAndCountAll(filter);
  }

  async function view(id) {
    return Specialty.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
      const specialty = await Specialty.findById(form.specialtyId);
      if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
      return specialty.addCourse(course);
    }
    return Specialty.create(form);
  }

  async function exists(id) {
    const result = await Specialty.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Specialty.update(form, {
      where: { id },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId: id,
          courseId: queryParams.courseId,
        },
      });
    }

    return Specialty.destroy({ where: { id } });
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
    const keys = ['courseId', 'teacherId', 'taskId', 'laboratoryId', 'studentId', 'groupId'];
    const models = [Course, Teacher, LabTask, LabReport, Student, Group];
    const i = keys.findIndex(itKey => key === itKey);
    return models.slice(0, i + 1);
  }
};

function handleId(queryParamId, response, Specialty, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Specialty.findAndCountAll(query);
    return response.then((results) => {
      const resultedRows = results.rows.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      results.rows = resultedRows;
      return results;
    });
  }
  return Specialty.findAndCountAll();
}
