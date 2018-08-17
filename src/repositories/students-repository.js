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

    const incomingParamKeys = Object.keys(queryParams);
    const incomingParamValues = Object.values(queryParams);

    response = handleId(incomingParamValues[0], response, Student, filter, getModels(incomingParamKeys[0]));

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

  function getModels(key) {
    const keys = ['groupId', 'specialtyId', 'courseId', 'teacherId', 'taskId', 'laboratoryId'];
    const models = [Group, Specialty, Course, Teacher, LabTask, LabReport];
    const i = keys.findIndex(itKey => key === itKey);
    return models.slice(0, i + 1);
  }
};

function handleId(queryParamId, response, Student, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Student.findAndCountAll(query);
    return response.then((results) => {
      const x = results.rows.map((item) => {
        return {
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          phoneNumber: item.phoneNumber,
          groupId: item.groupId,
        };
      });
      results.rows = x;
      return results;
    });
  }
  return Student.findAndCountAll();
}
