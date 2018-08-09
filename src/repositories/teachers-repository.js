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

  async function add(form, queryParams) {
    if (queryParams.courseId) {
      return addCourse(form.teacherId, queryParams.courseId);
    }
    if (queryParams.studentId) {
      return addStudent(form.teacherId, queryParams.courseId);
    }
    return Course.create(form);
  }

  async function addCourse(id, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound();
    const course = await Course.findById(id);
    if (!course) throw new errors.NotFound();
    return course.addTeacher(teacher);
  }

  async function addStudent(id, teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new errors.NotFound();
    const student = await Student.findById(id);
    if (!student) throw new errors.NotFound();
    return student.addTeacher(teacher);
  }

  async function exists(id) {
    const result = await Teacher.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const result = await Course.findById(form.courseId);
    if (!result) throw new errors.NotFound();

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
      return CoursesTeacher.destroy({
        where: {
          id: {
            [Op.eq]: id,
          },
          courseId: {
            [Op.eq]: queryParams.courseId,
          },
        },
      });
    }
    if (queryParams.specialtyId) {
      return CoursesSpecialties.destroy({
        where: {
          specialtyId: {
            [Op.eq]: queryParams.specialtyId,
          },
          courseId: {
            [Op.eq]: queryParams.courseId,
          },
        },
      });
    }
    return Teacher.destroy({
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
