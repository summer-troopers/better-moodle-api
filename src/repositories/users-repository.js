'use strict';

const { Op } = require('sequelize');
const roles = require('../helpers/constants/roles');

module.exports = function getUserRepository(sequelize) {
  const { Teacher, Admin, Student } = sequelize.models;

  function selectUserDB(user, model) {
    return model.findOne({ where: { email: { [Op.eq]: user.email } } });
  }

  async function exists(userId, role) { // eslint-disable-line complexity
    if (role === roles.STUDENT) {
      const result = await Student.findById(userId);
      if (result) return true;
    } else if (role === roles.TEACHER) {
      const result = await Teacher.findById(userId);
      if (result) return true;
    } else if (role === roles.ADMIN) {
      const result = await Admin.findById(userId);
      if (result) return true;
    }
    return false;
  }

  async function getUser(data) {
    const student = await selectUserDB(data, Student);
    if (student) return [roles.STUDENT, student.dataValues];

    const teacher = await selectUserDB(data, Teacher);
    if (teacher) return [roles.TEACHER, teacher.dataValues];

    const admin = await selectUserDB(data, Admin);
    if (admin) return [roles.ADMIN, admin.dataValues];

    return null;
  }

  return {
    getUser,
    exists,
  };
};
