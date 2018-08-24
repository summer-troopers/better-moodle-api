'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { assert } = require('../helpers/db');
const { handleId } = require('../helpers/util');

module.exports = function createCoursesRepository(sequelize) {
  const {
    Course,
    Teacher,
    Specialty,
    Group,
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
    specialtyId: [Specialty],
    groupId: [Specialty, Group],
    studentId: [Specialty, Group, Student],
    teacherId: [Teacher],
    labId: [Teacher, Lab],
    labReportId: [Teacher, Lab, LabReport],
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

    let courses = await handleId(queryParams, Course, filter, queryParamsBindings);

    if (!courses) courses = await Course.findAndCountAll(filter);

    courses.rows = courses.rows.map(projector);

    return courses;
  }

  async function view(id) {
    const course = await Course.findOne(id);

    return projector(course);
  }

  async function add(data, queryParams) {
    if (queryParams.teacherId) {
      return addTeacher(data.courseId, queryParams.teacherId);
    }
    if (queryParams.specialtyId) {
      return addSpecialty(data.courseId, queryParams.specialtyId);
    }

    assert.notTaken.name(data.name, Course);

    return Course.create(data);
  }

  async function addTeacher(id, teacherId) {
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound('TEACHER_NOT_FOUND');
    return course.addTeacher(teacher);
  }

  async function addSpecialty(id, specialtyId) {
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
    return course.addSpecialty(specialty);
  }

  async function exists(id) {
    const result = await Course.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, data) {
    assert.notTaken.name(data.name, Course);

    return Course.update(data, {
      where: { id },
    });
  }

  /* eslint-disable complexity */
  async function remove(id, queryParams) {
    if (queryParams.teacherId) {
      return Lab.destroy({
        where: {
          courseId: id,
          teacherId: queryParams.teacherId,
        },
      });
    }
    if (queryParams.specialtyId) {
      return CourseSpecialty.destroy({
        where: {
          courseId: id,
          specialtyId: queryParams.specialtyId,
        },
      });
    }

    try {
      return await Course.destroy({
        where: { id },
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new errors.Conflict('CANNOT_DELETE_COURSE', error);
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
