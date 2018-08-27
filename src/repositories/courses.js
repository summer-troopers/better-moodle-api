'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { assert } = require('../helpers/db');
const { handleId, appendDependentDataThrough } = require('../helpers/util');

module.exports = function createCoursesRepository(sequelize) {
  const {
    Course,
    Teacher,
    Specialty,
    Group,
    Student,
    LabReport,
    CourseInstance,
  } = sequelize.models;

  const projector = (row) => {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      teachers: row.teachers.map((teacherRow) => {
        return {
          id: teacherRow.id,
          firstName: teacherRow.firstName,
          lastName: teacherRow.lastName,
          email: teacherRow.email,
          phoneNumber: teacherRow.phoneNumber,
        };
      }),
    };
  };

  const queryParamsBindings = {
    teacherId: [Teacher],
    courseInstanceId: [CourseInstance],
    specialtyId: [CourseInstance, Specialty],
    labReportId: [CourseInstance, LabReport],
    groupId: [CourseInstance, Specialty, Group],
    studentId: [CourseInstance, Specialty, Group, Student],
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

    await appendDependentDataThrough(courses.rows, {
      parent: Course,
      dependent: Teacher,
      through: CourseInstance,
    });

    courses.rows = courses.rows.map(projector);

    return courses;
  }

  async function view(id) {
    const course = await Course.findById(id);

    await appendDependentDataThrough([course], {
      parent: Course,
      dependent: Teacher,
      through: CourseInstance,
    });

    return projector(course);
  }

  async function add(data) {
    assert.notTaken.name(data.name, Course);

    return Course.create(data);
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

  async function remove(id) {
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
