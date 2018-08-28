'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId } = require('../helpers/util');
const { assert } = require('../helpers/db');

module.exports = function createTeacherRepository(connection) {
  const { models } = connection;

  const {
    Course,
    Specialty,
    Group,
    Student,
    LabReport,
    CourseInstance,
    Teacher,
  } = connection.models;

  const projector = (row) => {
    return {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      phoneNumber: row.phoneNumber,
      email: row.email,
    };
  };

  const queryParamsBindings = {
    courseId: [Course],
    courseInstanceId: [CourseInstance],
    labReportId: [CourseInstance, LabReport],
    specialtyId: [CourseInstance, Specialty],
    groupId: [CourseInstance, Specialty, Group],
    studentId: [CourseInstance, Specialty, Group, Student],
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

  async function view(id) {
    const teacher = await Teacher.findById(id);

    return projector(teacher);
  }

  async function add(data) {
    assert.notTaken.email(data.email, [models.Admin, Teacher, models.Student]);

    return Teacher.create(data);
  }

  async function exists(id) {
    const result = await Teacher.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, data) {
    assert.notTaken.email(data.email, [models.Admin, Teacher, models.Student]);

    return Teacher.update(data, {
      where: { id },
    });
  }

  async function remove(id) {
    try {
      return await Teacher.destroy({
        where: { id },
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
