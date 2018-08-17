'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId, projectDatabaseResponse } = require('../helpers/util');

module.exports = function createCoursesRepository(sequelize) {
  const {
    Course,
    Teacher,
    Specialty,
    Group,
    Student,
    LabReport,
    LabTask,
    LabComment,
  } = sequelize.models;

  const projector = (item) => {
    return {
      id: item.id,
      name: item.name,
    };
  };

  const queryParamsBindings = {
    specialtyId: [Specialty],
    groupId: [Specialty, Group],
    studentId: [Specialty, Group, Student],
    teacherId: [Teacher],
    taskId: [Teacher, LabTask],
    labReportId: [Teacher, LabTask, LabReport],
    labCommentId: [Teacher, LabTask, LabReport, LabComment],
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
        name: {
          [Op.like]: [`%${contains}%`],
        },
      },
    };

    let response = await handleId(queryParams, Course, filter, queryParamsBindings);

    if (!response) response = await Course.findAndCountAll(filter);

    return projectDatabaseResponse(response, projector);
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
          courseId: id,
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
