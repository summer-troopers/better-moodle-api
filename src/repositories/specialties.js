'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId, appendDependentData, appendParentData } = require('../helpers/util');
const { assert } = require('../helpers/db');

module.exports = function createSpecialtiesRepository(sequelize) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabReport,
    CourseInstance,
  } = sequelize.models;

  const projector = (row) => {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      courseInstances: row.courseInstances.map((courseInstanceRow) => {
        return {
          id: courseInstanceRow.id,
          name: courseInstanceRow.course.name,
          description: courseInstanceRow.course.description,
          teacherId: courseInstanceRow.teacherId,
          courseId: courseInstanceRow.courseId,
          fileExists: courseInstanceRow.labTasksFile !== null,
        };
      }),
    };
  };

  const queryParamsBindings = {
    groupId: [Group],
    courseInstanceId: [CourseInstance],
    studentId: [Group, Student],
    teacherId: [CourseInstance, Teacher],
    courseId: [CourseInstance, Course],
    labReportId: [Group, Student, LabReport],
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

    // await appendDependentData(specialties.rows, Specialty, CourseInstance);

    const specCourseInstancesPromises = [];

    specialties.rows.forEach((row) => {
      specCourseInstancesPromises.push(
        new Promise((resolve) => {
          row.getCourseInstances()
            .then((courseInstances) => {
              resolve(appendParentData(courseInstances, Course));
            });
        }),
      );
    });

    const specCourseInstances = await Promise.all(specCourseInstancesPromises);

    specialties.rows.forEach((row, index) => {
      row.courseInstances = specCourseInstances[index];
    });

    specialties.rows = specialties.rows.map(projector);

    return specialties;
  }

  async function view(id) {
    const specialty = await Specialty.findById(id);

    return projector(specialty);
  }

  async function add(data) {
    assert.notTaken.name(data.name, Specialty);

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

  async function remove(id) {
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
