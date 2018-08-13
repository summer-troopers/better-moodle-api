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
      teacherId,
      specialtyId,
      groupId,
      studentId,
      laboratoryId,
      taskId,
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

    const modelsCollection1 = [Specialty];
    const modelsCollection2 = modelsCollection1.concat([Group]);
    const modelsCollection3 = modelsCollection2.concat([Student]);
    const modelsCollection4 = [Teacher];
    const modelsCollection5 = modelsCollection4.concat([LabTask]);
    const modelsCollection6 = modelsCollection5.concat([LabReport]);

    response = handleId(specialtyId, response, Course, filter, modelsCollection1);
    response = handleId(groupId, response, Course, filter, modelsCollection2);
    response = handleId(studentId, response, Course, filter, modelsCollection3);
    response = handleId(teacherId, response, Course, filter, modelsCollection4);
    response = handleId(taskId, response, Course, filter, modelsCollection5);
    response = handleId(laboratoryId, response, Course, filter, modelsCollection6);

    if (response) {
      return response;
    }
    return Course.findAndCountAll(filter);
  }

  async function view(id) {
    return Course.findById(id);
  }

  function add(form, queryParams) {
    if (queryParams.teacherId) {
      return addTeacher(form.courseId, queryParams.teacherId);
    }
    if (queryParams.specialtyId) {
      return addSpecialty(form.courseId, queryParams.specialtyId);
    }
    return Course.create(form);
  }

  async function addTeacher(id, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound('TEACHER_NOT_FOUND');
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    return course.addTeacher(teacher);
  }

  async function addSpecialty(id, specialtyId) {
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    return course.addSpecialty(specialty);
  }

  async function exists(id) {
    const result = await Course.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Course.update(form, {
      where: { id },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.teacherId) {
      return CourseTeacher.destroy({
        where: {
          id,
          teacherId: queryParams.teacherId,
        },
      });
    }
    if (queryParams.specialtyId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId: queryParams.specialtyId,
          courseId: id,
        },
      });
    }
    return Course.destroy({
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
