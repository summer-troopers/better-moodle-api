'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createCoursesRepository(models) {
  const { Course, CourseTeacher, Teacher } = models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      teacherId,
    } = queryParams;

    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) throw new errors.NotFound();
      const courseTeacherPairs = await CourseTeacher.findAndCountAll({
        where: {
          idTeacher: {
            [Op.eq]: teacherId,
          },
        },
        include: [
          { model: Course, required: true },
        ],
      });
      return courseTeacherPairs;
    }
    return Course.findAndCountAll({
      offset,
      limit,
      where: {
        name: {
          [Op.like]: [`%${contains}%`],
        },
      },
    });
  }

  async function view(id) {
    return Course.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.teacherId) {
      if (!(await Teacher.findById(queryParams.teacherId))) throw new errors.NotFound();
      if (!(await exists(form.courseId))) throw new errors.NotFound();
      return CourseTeacher.create({
        idTeacher: queryParams.teacherId,
        idCourse: form.courseId,
      }); // 'add' changes if 'teacherId' is defined
    }
    return Course.create(form);
  }

  async function exists(id) {
    const result = await Course.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Course.update(form, {
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.teacherId) {
      return CourseTeacher.destroy({
        where: {
          idTeacher: {
            [Op.eq]: queryParams.teacherId,
          },
          idCourse: {
            [Op.eq]: id,
          },
        },
      });
    }
    return Course.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
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
