'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId, appendParentData, appendDependentCount } = require('../helpers/util');
const { assert } = require('../helpers/db');

module.exports = function createStudentsRepository(connection) {
  const {
    Student,
    Group,
    Specialty,
    Course,
    Teacher,
    LabReport,
    CourseInstance,
  } = connection.models;

  const projector = (item) => {
    return {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      groupId: item.groupId,
      group: {
        id: item.group.id,
        name: item.group.name,
        specialtyId: item.group.specialtyId,
      },
      labReportCount: item.labReportCount,
    };
  };

  const queryParamsBindings = {
    labReportId: [LabReport],
    groupId: [Group],
    specialtyId: [Group, Specialty],
    courseInstanceId: [Group, Specialty, CourseInstance],
    courseId: [Group, Specialty, CourseInstance, Course],
    teacherId: [Group, Specialty, CourseInstance, Teacher],
  };

  // eslint-disable-next-line complexity
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

    let students = await handleId(queryParams, Student, filter, queryParamsBindings);

    if (!students) students = await Student.findAndCountAll(filter);

    await appendParentData(students.rows, Group);
    await appendDependentCount(students.rows, Student, LabReport);

    students.rows = students.rows.map(projector);

    return students;
  }


  async function view(id) {
    const student = await Student.findById(id);

    await appendParentData([student], Group);
    await appendDependentCount([student], Student, LabReport);

    return projector(student);
  }

  async function add(data) {
    assert.notTaken.email(data.email, [models.Admin, models.Teacher, Student]);

    const group = await Group.findById(data.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.create(data);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, data) {
    assert.notTaken.email(data.email, [models.Admin, models.Teacher, Student]);

    const group = await Group.findById(data.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.update(data, {
      where: { id },
    });
  }

  async function remove(id) {
    try {
      return await Student.destroy({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_STUDENT');
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
