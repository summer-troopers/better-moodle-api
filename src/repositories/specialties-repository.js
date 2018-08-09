'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

module.exports = function createSpecialtiesRepository(sequelize) {
  const {
    Specialty,
    Course,
    CourseSpecialty,
    Teacher,
    Group,
    Student,
  } = sequelize.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      courseId,
      teacherId,
      groupId,
      studentId,
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
        include: [{
          model: Course,
          where: {
            id: courseId,
          },
        }],
      });
    }

    if (teacherId) {
      return Specialty.findAndCountAll({
        ...filter,
        include: [{
          model: Course,
          include: [{
            model: Teacher,
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
        include: [{
          model: Group,
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
        include: [{
          model: Group,
          include: [{
            model: Student,
            where: {
              id: studentId,
            },
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
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId: {
            [Op.eq]: id,
          },
          courseId: {
            [Op.eq]: queryParams.courseId,
          },
        },
      });
    }
    return Specialty.destroy({ where: { id: { [Op.eq]: id } } });
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
