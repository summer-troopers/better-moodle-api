'use strict';

const { Op } = require('sequelize');

module.exports = function createTeachersRepository(models) {
  const { Teacher, Course, CourseTeacher } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Teacher.findAndCountAll({
      offset,
      limit,
      where: { firstName: { [Op.like]: [`%${contains}%`] } },
    });
  }

  async function view(id) {
    return Teacher.findById(id);
  }

  function add(form) {
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

  function remove(id) {
    return Teacher.destroy({ where: { id: { [Op.eq]: id } } });
  }

  async function existsCourse(id) {
    const result = await Course.findById(id);
    if (!result) return false;

    return true;
  }

  async function listCourses(id/* , queryParams */) {
    // const { limit, offset } = queryParams;

    return CourseTeacher.findAndCountAll({
      where: {
        idTeacher: {
          [Op.eq]: id,
        },
      },
      include: [
        { model: Course, required: true },
      ],
      // offset, // because they somehow break the query, bug with sequelize?
      // limit,
    });
  }

  function addCourse(teacherId, courseId) {
    return CourseTeacher.create({
      idTeacher: teacherId,
      idCourse: courseId,
    });
  }

  function removeCourse(teacherId, courseId) {
    return CourseTeacher.destroy({
      where: {
        idTeacher: {
          [Op.eq]: teacherId,
        },
        idCourse: {
          [Op.eq]: courseId,
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
    listCourses,
    existsCourse,
    addCourse,
    removeCourse,
  };
};
