'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { handleId, projectDatabaseResponse } = require('../helpers/util');

module.exports = function createCoursesRepository(sequelize) {
  const {
    Course,
    Teacher,
    Specialty,
    Group,
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
    groupId: [Specialty, Group],
    studentId: [Specialty, Group, Student],
    teacherId: [Teacher],
    labTaskId: [Teacher, LabTask],
    labReportId: [Teacher, LabTask, LabReport],
    labCommentId: [Teacher, LabTask, LabReport, LabComment],
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
    };

    let response = await handleId(queryParams, Course, filter, queryParamsBindings);

    if (!response) response = await Course.findAndCountAll(filter);

    return projectDatabaseResponse(response, projector);
  }

  async function view(courseId) {
    return Course.findOne({
      where: { id: courseId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  function add(data, queryParams) {
    if (queryParams.teacherId) {
      return addTeacher(data.courseId, queryParams.teacherId);
    }
    if (queryParams.specialtyId) {
      return addSpecialty(data.courseId, queryParams.specialtyId);
    }
    return Course.create(data);
  }

  async function addTeacher(courseId, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound('TEACHER_NOT_FOUND');
    const course = await Course.findById(courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    return course.addTeacher(teacher);
  }

  async function addSpecialty(courseId, specialtyId) {
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
    const course = await Course.findById(courseId);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    return course.addSpecialty(specialty);
  }

  async function exists(courseId) {
    const result = await Course.findById(courseId);
    if (result) return true;
    return false;
  }

  async function update(courseId, data) {
    return Course.update(data, {
      where: { id: courseId },
    });
  }

  /* eslint-disable complexity */
  async function remove(courseId, queryParams) {
    if (queryParams.teacherId) {
      return CourseTeacher.destroy({
        where: {
          courseId,
          teacherId: queryParams.teacherId,
        },
      });
    }
    if (queryParams.specialtyId) {
      return CourseSpecialty.destroy({
        where: {
          courseId,
          specialtyId: queryParams.specialtyId,
        },
      });
    }

    try {
      return await Course.destroy({
        where: { id: courseId },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_COURSE');
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
