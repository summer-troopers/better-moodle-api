'use strict';

module.exports = function getSQLRepository(sequelize) {
  require('../../models/index')(sequelize); // eslint-disable-line global-require
  const { Admin } = sequelize.models;

  function list() {
    return Admin.findAll({});
  }

  function add(form) {
    return Admin.create({ firstName: form.firstName });
  }

  return {
    list,
    add,
  };
};
