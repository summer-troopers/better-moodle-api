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

  async function view(specialtyId) {
    return Specialty.findById(specialtyId);
  }

  async function add(data, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
      const specialty = await Specialty.findById(data.specialtyId);
      if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
      return specialty.addCourse(course);
    }
    return Specialty.create(data);
  }

  async function exists(specialtyId) {
    const result = await Specialty.findById(specialtyId);
    if (result) return true;
    return false;
  }

  async function update(specialtyId, data) {
    return Specialty.update(data, {
      where: { id: specialtyId },
    });
  }

  function remove(specialtyId, queryParams) {
    if (queryParams.courseId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId,
          courseId: queryParams.courseId,
        },
      });
    }

    return Specialty.destroy({ where: { id: specialtyId } });
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
      raw: true,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Specialty.findAndCountAll(query);
  }
  return response;
}
