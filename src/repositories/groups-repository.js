'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId } = require('../helpers/util');

module.exports = function createGroupsRepository(sequelize) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabReport,
    LabTask,
    LabComment,
  } = sequelize.models;

  const projector = (item) => {
    return {
      id: item.id,
      name: item.name,
    };
  };

  const queryParamsBindings = {
    specialtyId: [Specialty],
    courseId: [Specialty, Course],
    teacherId: [Specialty, Course, Teacher],
    studentId: [Student],
    laboratoryId: [Student, LabReport],
    taskId: [Student, LabReport, LabTask],
    labCommentId: [Student, LabReport, LabComment],
  };

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

    const response = handleId(queryParams, Group, filter, queryParamsBindings, projector);

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
