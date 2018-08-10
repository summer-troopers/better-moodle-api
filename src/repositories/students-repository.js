'use strict';

const errors = require('@feathersjs/errors');
const { Op } = require('sequelize');

module.exports = function createStudentsRepository(connection) {
  const {
    Student,
    Group,
    Specialty,
    Course,
    Teacher,
    LabReport,
    LabTask,
  } = connection.models;

  async function list(queryParams) {
    const {
      limit,
      offset,
      contains,
      groupId,
      specialtyId,
      courseId,
      teacherId,
      laboratoryId,
      taskId,
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


    if (groupId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Group,
          required: true,
          where: {
            id: groupId,
          },
        }],
      });
    }

    if (specialtyId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Group,
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

    if (courseId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Group,
          required: true,
          include: [{
            model: Specialty,
            required: true,
            include: [{
              model: Course,
              required: true,
              where: {
                id: courseId,
              },
            }],
          }],
        }],
      });
    }

    if (teacherId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: Group,
          required: true,
          include: [{
            model: Specialty,
            required: true,
            include: [{
              model: Course,
              required: true,
              include: [{
                model: Teacher,
                required: true,
                where: {
                  id: teacherId,
                },
              }],
            }],
          }],
        }],
      });
    }

    if (laboratoryId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: LabReport,
          required: true,
          where: {
            id: laboratoryId,
          },
        }],
      });
    }

    if (taskId) {
      return Student.findAndCountAll({
        ...filter,
        raw: true,
        subQuery: false,
        include: [{
          model: LabReport,
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

    return Student.findAndCountAll(filter);
  }

  async function view(id) {
    return Student.findById(id);
  }

  async function add(form) {
    return Student.create(form);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id) {
    return Student.update(form, {
      where: { id },
    });
  }

  function remove(id) {
    return Student.destroy({
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
