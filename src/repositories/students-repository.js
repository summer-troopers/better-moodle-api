'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
// eslint-disable-next-line object-curly-newline
const { handleId, appendParentData, appendDependentCount, projectDatabaseResponse } = require('../helpers/util');

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
      attributes: {
        exclude: ['password'],
      },
    };

    let students = await handleId(queryParams, Student, filter, queryParamsBindings);

    if (!students) students = await Student.findAndCountAll(filter);

    await appendParentData(students.rows, Group);
    await appendDependentCount(students.rows, Student, LabReport);

    return projectDatabaseResponse(students, projector);
  }


  async function view(id) {
    const students = await Student.findAndCountAll({
      where: { id },
    });

    await appendParentData(students.rows, Group);
    await appendDependentCount(student.rows, Student, LabReport);

    const projectedStudents = await projectDatabaseResponse(students, projector);

    return projectedStudents.rows[0];
  }

  async function add(form) {
    const group = await Group.findById(form.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.create(form);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const group = await Group.findById(form.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.update(form, {
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
        throw new errors.Forbidden('CANNOT_DELETE_STUDENT');
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
