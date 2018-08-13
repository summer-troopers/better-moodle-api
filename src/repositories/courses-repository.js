'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createCoursesRepository(sequelize) {
  const {
    Course,
    Teacher,
    Specialty,
    Group,
    Student,
    LabReport,
    LabTask,
  } = sequelize.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      teacherId,
      specialtyId,
      groupId,
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

    if (specialtyId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Specialty,
          required: true,
          where: {
            id: specialtyId,
          },
        }],
      });
    }

    if (groupId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
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
      });
    }

    if (studentId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
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
      });
    }

    if (laboratoryId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Specialty,
          required: true,
          include: [{
            model: Group,
            required: true,
            include: [{
              model: Student,
              required: true,
              include: [{
                model: LabReport,
                required: true,
                where: {
                  id: laboratoryId,
                },
              }],
            }],
          }],
        }],
      });
    }

    if (teacherId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Teacher,
          required: true,
          where: {
            id: teacherId,
          },
        }],
      });
    }

    if (taskId) {
      return Course.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Teacher,
          required: true,
          include: [{
            model: LabTask,
            required: true,
            where: {
              id: taskId,
            },
          }],
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
      where: { id },
    });
  }

  function remove(id, queryParams) {
    if (queryParams.teacherId) {
      return CourseTeacher.destroy({
        where: {
          id,
          teacherId: queryParams.teacherId,
        },
      });
    }
    if (queryParams.specialtyId) {
      return CourseSpecialty.destroy({
        where: {
          specialtyId: queryParams.specialtyId,
          courseId: id,
        },
      });
    }
    return Course.destroy({
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
