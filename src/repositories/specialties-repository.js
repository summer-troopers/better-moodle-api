'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

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

    if (courseId) {
      return Specialty.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Course,
          required: true,
          where: {
            id: courseId,
          },
        }],
      });
    }

    if (teacherId) {
      return Specialty.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Course,
          required: true,
          include: [{
            model: Teacher,
            required: true,
            where: {
              id: teacherId,
            },
          }],
        }],
      });
    }

    if (groupId) {
      return Specialty.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Group,
          required: true,
          where: {
            id: groupId,
          },
        }],
      });
    }

    if (studentId) {
      return Specialty.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Group,
          required: true,
          include: [{
            model: Student,
            required: true,
            where: {
              id: studentId,
            },
          }],
        }],
      });
    }

    if (taskId) {
      return Specialty.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Group,
          required: true,
          include: [{
            model: Student,
            required: true,
            include: [{
              model: LabReport,
              required: true,
              include: [{
                model: LabTask,
                required: true,
                where: {
                  id: taskId,
                },
              }],
            }],
          }],
        }],
      });
    }

    return Specialty.findAndCountAll(filter);
  }

  async function view(id) {
    return Specialty.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(queryParams.courseId);
      if (!course) throw new errors.NotFound();
      const specialty = await Specialty.findById(form.specialtyId);
      if (!specialty) throw new errors.NotFound();
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
    const result = await Course.findById(form.courseId);
    if (!result) throw new errors.NotFound();

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
