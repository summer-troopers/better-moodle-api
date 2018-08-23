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
    LabTask,
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
      group: {
        id: item.group.id,
        name: item.group.name,
        specialtyId: item.group.specialtyId,
      },
      labReportCount: item.labReportCount,
    };
  };

  const queryParamsBindings = {
    labCommentId: [LabReport, LabComment],
    labReportId: [LabReport],
    groupId: [Group],
    courseId: [Group, Specialty, Course],
    specialtyId: [Group, Specialty],
    labTaskId: [LabReport, LabTask],
    teacherId: [LabReport, LabTask, Teacher],
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


  async function view(studentId) {
    const student = await Student.findById(studentId);

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

  async function exists(studentId) {
    const result = await Student.findById(studentId);
    if (result) return true;
    return false;
  }

  async function update(studentId, data) {
    assert.notTaken.email(data.email, [models.Admin, models.Teacher, Student]);

    const group = await Group.findById(data.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.update(data, {
      where: { id: studentId },
    });
  }

  async function remove(studentId) {
    try {
      return await Student.destroy({
        where: { id: studentId },
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
