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

  async function view(adminId) {
    return Admin.findOne({
      where: { id: adminId },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  function add(data) {
    return Admin.create(data);
  }

  async function exists(adminId) {
    const result = await Admin.findById(adminId);
    if (result) return true;
    return false;
  }

  async function update(adminId, data) {
    return Admin.update(data, {
      where: { id: adminId },
    });
  }

  function remove(adminId) {
    return Admin.destroy({ where: { id: adminId } });
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
