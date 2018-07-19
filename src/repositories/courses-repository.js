'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createCoursesRepository(models) {
  const {
    Course,
    CourseTeacher,
    Teacher,
    CourseSpecialty,
    Specialty,
  } = models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      teacherId,
      specialtyId,
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

    if (teacherId) {
      return Course.findAndCountAll({
        ...filter,
        include: [{
          model: Teacher,
          attributes: [],
          where: {
            id: {
              [Op.eq]: teacherId,
            },
          },
        }],
      });
    }
    if (specialtyId) {
      return Course.findAndCountAll({
        ...filter,
        include: [{
          model: Specialty,
          attributes: [],
          where: {
            id: {
              [Op.eq]: specialtyId,
            },
          },
        }],
      });
    }
    return Course.findAndCountAll(filter);
  }

  async function view(id) {
    return Course.findById(id);
  }

  function add(form, queryParams) {
    if (queryParams.teacherId) {
      return addTeacher(form.courseId, queryParams.teacherId);
    }
    if (queryParams.specialtyId) {
      return addSpecialty(form.courseId, queryParams.specialtyId);
    }
    return Course.create(form);
  }

  async function addTeacher(id, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound();
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound();
    return course.addTeacher(teacher);
  }

  async function addSpecialty(id, specialtyId) {
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) throw new errors.NotFound();
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound();
    return course.addSpecialty(specialty);
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
    if (queryParams.specialtyId) {
      return CourseSpecialty.destroy({
        where: {
          idSpecialty: {
            [Op.eq]: queryParams.specialtyId,
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
