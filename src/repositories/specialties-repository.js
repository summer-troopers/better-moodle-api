'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { buildIncludes } = require('../helpers/util');

module.exports = function createSpecialtiesRepository(sequelize) {
  const {
    Group,
    Specialty,
    Course,
    Teacher,
    Student,
    LabReport,
    LabTask,
  } = sequelize.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      courseId,
      groupId,
      teacherId,
      studentId,
      laboratoryId,
      taskId,
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

    let response = null;

    const modelsCollection1 = [Course];
    const modelsCollection2 = modelsCollection1.concat([Teacher]);
    const modelsCollection3 = [Group];
    const modelsCollection4 = modelsCollection3.concat([Student]);
    const modelsCollection5 = modelsCollection4.concat([LabReport]);
    const modelsCollection6 = modelsCollection5.concat([LabTask]);

    response = handleId(courseId, response, Specialty, filter, modelsCollection1);
    response = handleId(teacherId, response, Specialty, filter, modelsCollection2);
    response = handleId(groupId, response, Specialty, filter, modelsCollection3);
    response = handleId(studentId, response, Specialty, filter, modelsCollection4);
    response = handleId(laboratoryId, response, Specialty, filter, modelsCollection5);
    response = handleId(taskId, response, Specialty, filter, modelsCollection6);

    if (response) {
      return response;
    }
    return Specialty.findAndCountAll(filter);
  }

  async function view(id) {
    return Specialty.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound('COURSE_NOT_FOUND');
      const specialty = await Specialty.findById(form.specialtyId);
      if (!specialty) throw new errors.NotFound('SPECIALTY_NOT_FOUND');
      return specialty.addCourse(course);
    }
    return Specialty.create(form);
  }

  async function exists(id) {
    const result = await Specialty.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Specialty.update(form, {
      where: { id },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId: id,
          courseId: queryParams.courseId,
        },
      });
    }

    return Specialty.destroy({ where: { id } });
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

function handleId(queryParamId, response, Specialty, filter, models) {
  if (queryParamId) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(queryParamId, models),
    };
    response = Specialty.findAndCountAll(query);
  }
  return response;
}
