'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

module.exports = function createSpecialtiesRepository(models) {
  const {
    Specialty,
    Course,
    CourseSpecialty,
  } = models;

  const SpecialtyCourses = Specialty.associations.Courses;
  const CoursesTeachers = SpecialtyCourses.target.associations.Teachers;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      courseId,
      teacherId,
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
        include: [{
          association: SpecialtyCourses,
          required: true,
          attributes: [],
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
        include: [{
          association: SpecialtyCourses,
          required: true,
          attributes: [],
          include: [{
            association: CoursesTeachers,
            required: true,
            attributes: [],
            where: {
              id: teacherId,
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
    return Specialty.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.courseId) {
      return CourseSpecialty.destroy({
        where: {
          idSpecialty: {
            [Op.eq]: id,
          },
          idCourse: {
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
