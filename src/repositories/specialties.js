'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { handleId, appendDependentDataThrough, appendParentData } = require('../helpers/util');
const { assert } = require('../helpers/db');

module.exports = function createSpecialtiesRepository(sequelize) {
  const { models } = sequelize;

  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabReport,
    CourseInstance,
  } = models;

  const projector = (row) => {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      courseInstances: row.courseInstances.map((courseInstanceRow) => {
        return {
          id: courseInstanceRow.id,
          teacherId: courseInstanceRow.teacherId,
          teacher: {
            id: courseInstanceRow.teacher.id,
            firstName: courseInstanceRow.teacher.firstName,
            lastName: courseInstanceRow.teacher.lastName,
            email: courseInstanceRow.teacher.email,
            phoneNumber: courseInstanceRow.teacher.phoneNumber,
          },
          courseId: courseInstanceRow.courseId,
          course: {
            id: courseInstanceRow.course.id,
            name: courseInstanceRow.course.name,
            description: courseInstanceRow.course.description,
          },
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
    labReportId: [Group, Student, LabReport], // TODO: Not sure about this one, needs more thinking
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

    await appendDependentDataThrough(specialties.rows, {
      parent: Specialty,
      dependent: CourseInstance,
      through: models.CourseInstanceSpecialty,
    });

    await Promise.all(specialties.rows.map(row => appendParentData(row.courseInstances, Course)));
    await Promise.all(specialties.rows.map(row => appendParentData(row.courseInstances, Teacher)));

    specialties.rows = specialties.rows.map(projector);

    return specialties;
  }

  async function view(id) {
    const specialty = await Specialty.findById(id);

    await appendDependentDataThrough([specialty], {
      parent: Specialty,
      dependent: CourseInstance,
      through: models.CourseInstanceSpecialty,
    });

    await appendParentData(specialty.courseInstances, Course);
    await appendParentData(specialty.courseInstances, Teacher);

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
