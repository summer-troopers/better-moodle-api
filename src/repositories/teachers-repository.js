'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createTeacherRepository(models) {
  const {
    Course,
    Teacher,
    CourseTeacher,
  } = models;

  Teacher.Students = Teacher.associations.Courses.target.associations.Specialties.target.associations.Groups.target.associations.Students;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      studentId,
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

    if (studentId) {
      return Teacher.findAndCountAll({
        ...filter,
        raw: true,
        include: [{
          association: Teacher.Students,
          attributes: [],
          where: {
            id: studentId,
          },
        }],
      });
    }
    return Teacher.findAndCountAll(filter);
  }

  async function view(id) {
    return Teacher.findById(id);
  }

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      const course = await Course.findById(form.teacherId);
      if (!course) throw new errors.NotFound();
      const teacher = await Teacher.findById(queryParams.courseId);
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
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseTeacher.destroy({
        where: {
          idTeacher: {
            [Op.eq]: id,
          },
          idCourse: {
            [Op.eq]: queryParams.courseId,
          },
        },
      });
    }
    return Teacher.destroy({ where: { id: { [Op.eq]: id } } });
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
