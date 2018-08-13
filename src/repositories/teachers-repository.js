'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');
const { buildIncludes } = require('../helpers/util');

module.exports = function createTeacherRepository(connection) {
  const {
    Teacher,
    Course,
    Specialty,
    Group,
    Student,
    LabTask,
    LabReport,
  } = connection.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      courseId,
      specialtyId,
      groupId,
      studentId,
      taskId,
      laboratoryId,
    } = queryParams;

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

    let response = null;

    const modelsCollection1 = [Course];
    const modelsCollection2 = modelsCollection1.concat([Specialty]);
    const modelsCollection3 = modelsCollection2.concat([Group]);
    const modelsCollection4 = modelsCollection3.concat([Student]);
    const modelsCollection5 = [LabTask];
    const modelsCollection6 = modelsCollection5.concat([LabReport]);

    response = handleId(courseId, response, Teacher, filter, modelsCollection1);
    response = handleId(specialtyId, response, Teacher, filter, modelsCollection2);
    response = handleId(groupId, response, Teacher, filter, modelsCollection3);
    response = handleId(studentId, response, Teacher, filter, modelsCollection4);
    response = handleId(taskId, response, Teacher, filter, modelsCollection5);
    response = handleId(laboratoryId, response, Teacher, filter, modelsCollection6);

    if (response) {
      return response;
    }
    return Teacher.findAndCountAll(filter);
  }

  async function view(id) {
    return Teacher.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound();
      const teacher = await Teacher.findById(form.teacherId);
      if (!teacher) throw new errors.NotFound();
      return teacher.addCourse(course);
    }
    return Teacher.create(form);
  }

  async function exists(id) {
    const result = await Teacher.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Teacher.update(form, {
      where: { id },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseTeacher.destroy({
        where: {
          courseId: queryParams.courseId,
          teacherId: id,
        },
      });
    }

    return Teacher.destroy({
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


function handleId(querryParamId, response, Teacher, filter, models) {
  if (querryParamId) {
    const query = {
      ...filter,
      raw: true,
      subQuery: false,
      ...buildIncludes(querryParamId, models),
    };
    response = Teacher.findAndCountAll(query);
  }
  return response;
}
