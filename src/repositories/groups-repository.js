'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId, appendParentData } = require('../helpers/util');
const { assert } = require('../helpers/util');

module.exports = function createGroupsRepository(sequelize) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabReport,
    Lab,
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
    labId: [Student, LabReport, Lab],
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
      order: [
        ['updatedAt', 'DESC'],
      ],
    };

    let groups = await handleId(queryParams, Group, filter, queryParamsBindings);

    if (!groups) groups = await Group.findAndCountAll(filter);

    await appendParentData(groups.rows, Specialty);

    groups.rows = groups.rows.map(projector);

    return groups;
  }

  async function view(id) {
    const group = await Group.findById(id);

    group.specialty = await group.getSpecialty();

    return projector(group);
  }

  async function add(data) {
    assert.notTaken.name(data.name, Course);

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
    assert.notTaken.name(data.name, Course);

    const specialty = await Specialty.findById(data.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.update(data, {
      where: { id: groupId },
    });
  }

  async function remove(groupId) {
    try {
      return await Group.destroy({
        where: { id: groupId },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_GROUP');
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
