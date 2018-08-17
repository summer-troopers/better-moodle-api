'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId, appendDependentData, projectDatabaseResponse } = require('../helpers/util');

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
      specialtyId: item.specialtyId,
      specialty: item.specialty,
    };
  };

  const queryParamsBindings = {
    specialtyId: [Specialty],
    courseId: [Specialty, Course],
    teacherId: [Specialty, Course, Teacher],
    studentId: [Student],
    labReportId: [Student, LabReport],
    taskId: [Student, LabReport, LabTask],
    labCommentId: [Student, LabReport, LabComment],
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
        name: {
          [Op.like]: [`%${contains}%`],
        },
      },
    };

    let groups = await handleId(queryParams, Group, filter, queryParamsBindings, projector);

    if (!groups) groups = await Group.findAndCountAll(filter);

    await appendDependentData(groups, Specialty);

    return projectDatabaseResponse(groups, projector);
  }

  async function view(id) {
    return Group.findById(id);
  }

  async function add(form) {
    const specialty = await Specialty.findById(form.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.create(form);
  }

  async function exists(id) {
    const result = await Group.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const specialty = await Specialty.findById(form.specialtyId);
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
