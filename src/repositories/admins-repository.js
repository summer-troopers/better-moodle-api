'use strict';

const { Op } = require('sequelize');

module.exports = function createAdminsRepository(sequelize) {
  const { Admin } = sequelize.models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Admin.findAndCountAll({
      offset,
      limit,
      where: { firstName: { [Op.like]: [`%${contains}%`] } },
    });
  }

  async function view(id) {
    return Admin.findById(id);
  }

  function add(form) {
    return Admin.create(form);
  }

  async function exists(id) {
    const result = await Admin.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Admin.update(form, {
      where: { id },
    });
  }

  function remove(id) {
    return Admin.destroy({ where: { id } });
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
