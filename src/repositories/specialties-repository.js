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
    courseId: [Course],
    teacherId: [Course, Teacher],
    groupId: [Group],
    studentId: [Group, Student],
    labReportId: [Group, Student, LabReport],
    labTaskId: [Group, Student, LabReport, LabTask],
    labCommentId: [Group, Student, LabReport, LabComment],
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

  async function view(specialtyId) {
    const specialty = await Specialty.findById(specialtyId);

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

  async function exists(specialtyId) {
    const result = await Specialty.findById(specialtyId);
    if (result) return true;
    return false;
  }

  async function update(specialtyId, data) {
    assert.notTaken.name(data.name, Course);

    return Specialty.update(data, {
      where: { id: specialtyId },
    });
  }

  async function remove(specialtyId, queryParams) {
    if (queryParams.courseId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId,
          courseId: queryParams.courseId,
        },
      });
    }

    try {
      return await Specialty.destroy({
        where: { id: specialtyId },
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
