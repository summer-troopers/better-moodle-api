'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId, projectDatabaseResponse } = require('../helpers/util');

module.exports = function createTeacherRepository(connection) {
  const {
    Course,
    Specialty,
    Group,
    Student,
    LabReport,
    LabTask,
    Teacher,
    LabComment,
  } = connection.models;

  const projector = (item) => {
    return {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      groupId: item.groupId,
    };
  };

  const queryParamsBindings = {
    taskId: [LabTask],
    labReportId: [LabTask, LabReport],
    labCommentId: [LabTask, LabReport, LabComment],
    courseId: [Course],
    specialtyId: [Course, Specialty],
    groupId: [Course, Specialty, Group],
    studentId: [Course, Specialty, Group, Student],
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

    let response = await handleId(queryParams, Teacher, filter, queryParamsBindings);

    if (response) response = await Teacher.findAndCountAll(filter);

    return projectDatabaseResponse(response, projector);
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
};
