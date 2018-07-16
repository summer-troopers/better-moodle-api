'use strict';

const roles = require('../helpers/constants/roles');

module.exports = function getAuthenticationRepository(sequelize) {
  const { Teacher, Admin, Student } = sequelize.models;

  function selectUserDB(user, model) {
    return model.findOne({ where: { email: user.email, password: user.password } });
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
  };
};
