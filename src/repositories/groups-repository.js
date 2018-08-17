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

  async function view(id) {
    return Group.findById(id);
  }

  async function add(form) {
    const specialty = Specialty.findById(form.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.create(form);
  }

  async function exists(id) {
    const result = await Group.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const specialty = Specialty.findById(form.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.update(form, {
      where: { id },
    });
  }

  function remove(id) {
    return Group.destroy({
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
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Group.findAndCountAll(query);
    return response.then((results) => {
      const resultedRows = results.rows.map((item) => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      results.rows = resultedRows;
      return results;
    });
  }
  return Group.findAndCountAll();
}
