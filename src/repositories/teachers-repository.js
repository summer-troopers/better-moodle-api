'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createTeacherRepository(sequelize) {
  const {
    Teacher,
    Course,
    Specialty,
    Group,
    Student,
    LabTask,
    LabReport,
  } = sequelize.models;

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

    if (courseId) {
      return Teacher.findAndCountAll({
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

    if (specialtyId) {
      return Teacher.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Course,
          required: true,
          include: [{
            model: Specialty,
            required: true,
            where: {
              id: specialtyId,
            },
          }],
        }],
      });
    }

    if (groupId) {
      return Teacher.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Course,
          required: true,
          include: [{
            model: Specialty,
            required: true,
            include: [{
              model: Group,
              required: true,
              where: {
                id: groupId,
              },
            }],
          }],
        }],
      });
    }

    if (studentId) {
      return Teacher.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Course,
          required: true,
          include: [{
            model: Specialty,
            required: true,
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
          }],
        }],
      });
    }

    if (taskId) {
      return Teacher.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: LabTask,
          required: true,
          where: {
            id: taskId,
          },
        }],
      });
    }

    if (laboratoryId) {
      return Teacher.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: LabTask,
          required: true,
          include: [{
            model: LabReport,
            required: true,
            where: {
              id: laboratoryId,
            },
          }],
        }],
      });
    }

    return Teacher.findAndCountAll(filter);
  }

  async function view(id) {
    return Teacher.findById(id);
  }

  async function add(form) {
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
