'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId } = require('../helpers/util');
const { assert } = require('../helpers/db');

module.exports = function createSpecialtiesRepository(sequelize) {
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
    };
  };

  const queryParamsBindings = {
    courseId: [Course],
    teacherId: [Course, Teacher],
    groupId: [Group],
    studentId: [Group, Student],
    labReportId: [Group, Student, LabReport],
    labId: [Group, Student, LabReport, Lab],
  };

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

    let specialties = await handleId(queryParams, Specialty, filter, queryParamsBindings);

    if (!specialties) specialties = await Specialty.findAndCountAll(filter);

    specialties.rows = specialties.rows.map(projector);

    return specialties;
  }

  async function view(id) {
    const specialty = await Specialty.findById(id);

    return projector(specialty);
  }

  async function add(data, queryParams) {
    assert.notTaken.name(data.name, Course);

    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
      const specialty = await Specialty.findById(data.specialtyId);
      if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
      return specialty.addCourse(course);
    }
    return Specialty.create(data);
  }

  async function exists(id) {
    const result = await Specialty.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, data) {
    assert.notTaken.name(data.name, Course);

    return Specialty.update(data, {
      where: { id },
    });
  }

  async function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId: id,
          courseId: queryParams.courseId,
        },
      });
    }

    try {
      return await Specialty.destroy({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_SPECIALTY');
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
