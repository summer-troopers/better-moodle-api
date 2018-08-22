'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId, appendParentData, projectDatabaseResponse } = require('../helpers/util');

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
      specialty: {
        id: item.specialty.id,
        name: item.specialty.name,
      },
    };
  };

  const queryParamsBindings = {
    specialtyId: [Specialty],
    courseId: [Specialty, Course],
    teacherId: [Specialty, Course, Teacher],
    studentId: [Student],
    labReportId: [Student, LabReport],
    labTaskId: [Student, LabReport, LabTask],
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

    let groups = await handleId(queryParams, Group, filter, queryParamsBindings);

    if (!groups) groups = await Group.findAndCountAll(filter);

    await appendParentData(groups.rows, Specialty);

    return projectDatabaseResponse(groups, projector);
  }

  async function view(id) {
    const groups = await Group.findAndCountAll({
      where: { id },
    });

    await appendParentData(groups.rows, Specialty);

    const projectedGroups = await projectDatabaseResponse(groups, projector);

    return projectedGroups.rows[0];
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

  async function remove(id) {
    try {
      return await Group.destroy({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Forbidden('CANNOT_DELETE_GROUP');
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
