'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { buildIncludes } = require('../helpers/util');

module.exports = function createCoursesRepository(sequelize) {
  const {
    Course,
    Teacher,
    Specialty,
    Group,
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

    response = handleId(incomingParamValues[0], response, Course, filter, getModels(incomingParamKeys[0]));

    if (response) {
      return response;
    }
    return Course.findAndCountAll(filter);
  }

  async function view(courseId) {
    return Course.findById(courseId);
  }

  function add(data, queryParams) {
    if (queryParams.teacherId) {
      return addTeacher(data.courseId, queryParams.teacherId);
    }
    if (queryParams.specialtyId) {
      return addSpecialty(data.courseId, queryParams.specialtyId);
    }
    return Course.create(data);
  }

  async function addTeacher(courseId, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound('TEACHER_NOT_FOUND');
    const course = await Course.findById(courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    return course.addTeacher(teacher);
  }

  async function addSpecialty(courseId, specialtyId) {
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
    const course = await Course.findById(courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    return course.addSpecialty(specialty);
  }

  async function exists(courseId) {
    const result = await Course.findById(courseId);
    if (result) return true;
    return false;
  }

  async function update(courseId, data) {
    return Course.update(data, {
      where: { id: courseId },
    });
  }

  function remove(courseId, queryParams) {
    if (queryParams.teacherId) {
      return CourseTeacher.destroy({
        where: {
          courseId,
          teacherId: queryParams.teacherId,
        },
      });
    }
    if (queryParams.specialtyId) {
      return CourseSpecialty.destroy({
        where: {
          courseId,
          specialtyId: queryParams.specialtyId,
        },
      });
    }
    return Course.destroy({
      where: { id: courseId },
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
    const keys = ['specialtyId', 'groupId', 'studentId', 'laboratoryId', 'taskId', 'teacherId'];
    const models = [Specialty, Group, Student, LabReport, LabTask, Teacher];
    const i = keys.findIndex(itKey => key === itKey);
    return models.slice(0, i + 1);
  }
};

function handleId(queryParamId, response, Course, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Course.findAndCountAll(query);
  }
  return response;
}
