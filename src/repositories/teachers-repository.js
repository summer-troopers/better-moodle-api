'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId } = require('../helpers/util');
const { assert } = require('../helpers/db');

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
    labTaskId: [LabTask],
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
      order: [
        ['updatedAt', 'DESC'],
      ],
    };

    let teachers = await handleId(queryParams, Teacher, filter, queryParamsBindings);

    if (!teachers) teachers = await Teacher.findAndCountAll(filter);

    teachers.rows = teachers.rows.map(projector);

    return teachers;
  }

  async function view(teacherId) {
    const teacher = await Teacher.findById(teacherId);

    return projector(teacher);
  }

  async function add(data, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
      const teacher = await Teacher.findById(data.teacherId);
      if (!teacher) throw new errors.NotFound('TEACHER_NOT_FOUND');
      return teacher.addCourse(course);
    }

    assert.notTaken.email(data.email, [models.Admin, Teacher, models.Student]);

    return Teacher.create(data);
  }

  async function exists(teacherId) {
    const result = await Teacher.findById(teacherId);
    if (result) return true;
    return false;
  }

  async function update(teacherId, data) {
    assert.notTaken.email(data.email, [models.Admin, Teacher, models.Student]);

    return Teacher.update(data, {
      where: { id: teacherId },
    });
  }

  async function remove(teacherId, queryParams) {
    if (queryParams.courseId) {
      return CourseTeacher.destroy({
        where: {
          teacherId,
          courseId: queryParams.courseId,
        },
      });
    }

    try {
      return await Teacher.destroy({
        where: { id: teacherId },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_TEACHER');
      }
      throw error;
    }
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
