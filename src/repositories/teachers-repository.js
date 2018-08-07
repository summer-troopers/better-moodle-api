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
      const i = addCourse(form.teacherId, queryParams.courseId);
      return addCourse(form.i, queryParams.courseId);
    }
    if (queryParams.studentId) {
      return addStudent(form.teacherId, queryParams.courseId);
    }
    return Course.create(form);
  }

  async function addStudent(id, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound();
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound();
    return course.addTeacher(teacher);
  }

  async function addCourse(id, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound();
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound();
    return course.addTeacher(teacher);
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
