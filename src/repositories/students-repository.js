'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { buildIncludes } = require('../helpers/util');

module.exports = function createStudentsRepository(connection) {
  const {
    Student,
    Group,
    Specialty,
    Course,
    Teacher,
    LabReport,
    LabTask,
  } = connection.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      groupId,
      specialtyId,
      courseId,
      teacherId,
      laboratoryId,
      taskId,
    } = queryParams;

    let response = null;

    const filter = {
      limit,
      offset,
      where: {
        firstName: {
          [Op.like]: [`%${contains}%`],
        },
      },
      attributes: {
        exclude: ['password'],
      },
    };

    const model1 = [Group];
    const model2 = [Group, Specialty];
    const model3 = [Group, Specialty, Course];
    const model4 = [Group, Specialty, Course, Teacher];
    const model5 = [LabReport];
    const model6 = [LabReport, LabTask];

    response = handleId(groupId, response, Student, filter, model1);

    response = handleId(specialtyId, response, Student, filter, model2);

    response = handleId(courseId, response, Student, filter, model3);

    response = handleId(teacherId, response, Student, filter, model4);

    response = handleId(laboratoryId, response, Student, filter, model5);

    response = handleId(taskId, response, Student, filter, model6);

    if (response) {
      return response;
    }
    return Student.findAndCountAll(filter);
  }

  async function view(id) {
    return Student.findById(id);
  }

  async function add(form) {
    return Student.create(form);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Student.update(form, {
      where: { id },
    });
  }

  function remove(id) {
    return Student.destroy({
      where: { id },
    });
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

function handleId(id, response, Student, filter, models) {
  if (id) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(id, models),
    };
    console.log(JSON.stringify(query));
    response = Student.findAndCountAll(query);
  }
  return response;
}
