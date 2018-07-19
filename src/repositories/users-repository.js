'use strict';

const { Op } = require('sequelize');
const roles = require('../helpers/constants/roles');

module.exports = function getUserRepository(models) {
  const { Teacher, Admin, Student } = models;

  function selectUserDB(user, model) {
    return model.findOne({ where: { email: { [Op.eq]: user.email } } });
  }

  async function exists(id, role) { // eslint-disable-line complexity
    if (role === roles.STUDENT) {
      const result = await Student.findById(id);
      if (result) return true;
    } else if (role === roles.TEACHER) {
      const result = await Teacher.findById(id);
      if (result) return true;
    } else if (role === roles.ADMIN) {
      const result = await Admin.findById(id);
      if (result) return true;
    }
    return false;
  }

  async function getUser(form) {
    const student = await selectUserDB(form, Student);
    if (student) return [roles.STUDENT, student.dataValues];

    const teacher = await selectUserDB(form, Teacher);
    if (teacher) return [roles.TEACHER, teacher.dataValues];

    const admin = await selectUserDB(form, Admin);
    if (admin) return [roles.ADMIN, admin.dataValues];

    return null;
  }

  return {
    getUser,
    exists,
  };
};
