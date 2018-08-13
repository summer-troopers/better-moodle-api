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
      courseId,
      specialtyId,
      teacherId,
      studentId,
      laboratoryId,
      taskId,
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

    const modelsCollection1 = [Specialty];
    const modelsCollection2 = modelsCollection1.concat([Course]);
    const modelsCollection3 = modelsCollection2.concat([Teacher]);
    const modelsCollection4 = [Student];
    const modelsCollection5 = modelsCollection4.concat([LabReport]);
    const modelsCollection6 = modelsCollection5.concat([LabTask]);

    response = handleId(specialtyId, response, Group, filter, modelsCollection1);
    response = handleId(courseId, response, Group, filter, modelsCollection2);
    response = handleId(teacherId, response, Group, filter, modelsCollection3);
    response = handleId(studentId, response, Group, filter, modelsCollection4);
    response = handleId(laboratoryId, response, Group, filter, modelsCollection5);
    response = handleId(taskId, response, Group, filter, modelsCollection6);

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
