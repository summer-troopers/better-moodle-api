'use strict';

const roles = require('../helpers/constants/roles');

module.exports = function getUserRepository(sequelize) {
  const { Teacher, Admin, Student } = sequelize.models;

  function selectUserDB(user, model) {
    return model.findOne({ where: { email: user.email } });
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

  async function returnUser(form) {
    const student = await selectUserDB(form, Student);
    if (student) return { role: roles.STUDENT, user: student };

    const teacher = await selectUserDB(form, Teacher);
    if (teacher) return { role: roles.TEACHER, user: teacher };

    const admin = await selectUserDB(form, Admin);
    if (admin) return { role: roles.ADMIN, user: admin };

    return null;
  }

  return {
    returnUser,
    exists,
  };
};
