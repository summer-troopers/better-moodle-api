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
    CourseInstance,
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
    studentId: [Student],
    specialtyId: [Specialty],
    labReportId: [Student, LabReport],
    courseId: [Specialty, CourseInstance, Course],
    teacherId: [Specialty, CourseInstance, Teacher],
    courseInstanceId: [Specialty, CourseInstance],
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
    assert.notTaken.name(data.name, Group);

    const specialty = await Specialty.findById(data.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.create(data);
  }

  async function exists(id) {
    const result = await Group.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, data) {
    assert.notTaken.name(data.name, Group);

    const specialty = await Specialty.findById(data.specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');

    return Group.update(data, {
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
