'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { buildIncludes } = require('../helpers/util');

module.exports = function createStudentsRepository(connection) {
  const {
    Student,
    Group,
    Specialty,
    Course,
    Teacher,
    LabReport,
    LabTask,
  } = connection.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      groupId,
      specialtyId,
      courseId,
      teacherId,
      laboratoryId,
      taskId,
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

    let response = null;

    const modelsCollection1 = [Group];
    const modelsCollection2 = [Specialty, Group];
    const modelsCollection3 = [Specialty, Group, Course];
    const modelsCollection4 = [Specialty, Group, Course, Teacher];
    const modelsCollection5 = [LabReport];
    const modelsCollection6 = [LabReport, LabTask];

    response = handleId(groupId, response, Student, filter, modelsCollection1);
    response = handleId(specialtyId, response, Student, filter, modelsCollection2);
    response = handleId(courseId, response, Student, filter, modelsCollection3);
    response = handleId(teacherId, response, Student, filter, modelsCollection4);
    response = handleId(laboratoryId, response, Student, filter, modelsCollection5);
    response = handleId(taskId, response, Student, filter, modelsCollection6);

    if (response) {
      return response;
    }
    return Student.findAndCountAll(filter);
  }

  async function view(id) {
    return Student.findById(id);
  }

  async function add(form) {
    const group = Group.findById(form.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.create(form);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const group = Group.findById(form.groupId);
    if (!group) throw new errors.NotFound('GROUP_NOT_FOUND');

    return Student.update(form, {
      where: { id },
    });
  }

  function remove(id) {
    return Student.destroy({
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

function handleId(queryParamId, response, Student, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Student.findAndCountAll(query);
  }
  return response;
}
