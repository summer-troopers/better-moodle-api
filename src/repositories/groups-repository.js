'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { buildIncludes } = require('../helpers/util');

module.exports = function createGroupsRepository(sequelize) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabReport,
    LabTask,
  } = sequelize.models;

  function list(queryParams) {
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

    let response = null;

    const incomingParamKeys = Object.keys(queryParams);
    const incomingParamValues = Object.values(queryParams);

    response = handleId(incomingParamValues[0], response, Group, filter, getModels(incomingParamKeys[0]));

    if (response) {
      return response;
    }
    return Group.findAndCountAll(filter);
  }

  async function view(groupId) {
    return Group.findById(groupId);
  }

  async function add(data) {
    const specialty = await Specialty.findById(data.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.create(data);
  }

  async function exists(groupId) {
    const result = await Group.findById(groupId);
    if (result) return true;
    return false;
  }

  async function update(groupId, data) {
    const specialty = await Specialty.findById(data.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.update(data, {
      where: { id: groupId },
    });
  }

  function remove(groupId) {
    return Group.destroy({
      where: { id: groupId },
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
    const keys = ['specialtyId', 'courseId', 'teacherId', 'taskId', 'laboratoryId', 'studentId'];
    const models = [Specialty, Course, Teacher, LabTask, LabReport, Student];
    const i = keys.findIndex(itKey => key === itKey);
    return models.slice(0, i + 1);
  }
};

function handleId(queryParamId, response, Group, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Group.findAndCountAll(query);
  }
  return response;
}
