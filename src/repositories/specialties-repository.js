'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId, projectDatabaseResponse } = require('../helpers/util');

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

    let response = await handleId(queryParams, Specialty, filter, queryParamsBindings);

    if (!response) response = await Specialty.findAndCountAll(filter);

    return projectDatabaseResponse(response, projector);
  }

  async function view(specialtyId) {
    return Specialty.findOne({
      where: { id: specialtyId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  async function add(data, queryParams) {
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
