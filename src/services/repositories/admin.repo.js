'use strict';

module.exports = function getAdminRepository(sequelize) {
  const { Admin } = sequelize.models;

  function list() {
    return Admin.findAll({});
  }

  return {
    list,
  };
};
