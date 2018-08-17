'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId } = require('../helpers/util');

module.exports = function createSpecialtiesRepository(sequelize) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
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
    courseId: [Course],
    teacherId: [Specialty, Course, Teacher],
    groupId: [Group],
    studentId: [Group, Student],
    labReportId: [Group, Student, LabReport],
    taskId: [Group, Student, LabReport, LabTask],
    labCommentId: [Group, Student, LabReport, LabComment],
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

    const response = handleId(queryParams, Specialty, filter, queryParamsBindings, projector);


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
};
