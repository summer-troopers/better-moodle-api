'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');
const { assertEmailNotTaken } = require('../helpers/util');

module.exports = function createAdminsRepository(sequelize) {
  const { models } = sequelize;
  const { Admin } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Admin.findAndCountAll({
      offset,
      limit,
      where: { firstName: { [Op.like]: [`%${contains}%`] } },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      order: [
        ['updatedAt', 'DESC'],
      ],
    });
  }

  async function view(adminId) {
    return Admin.findOne({
      where: { id: adminId },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
  }

  async function add(data) {
    assertEmailNotTaken(data.email, [Admin, models.Teacher, models.Student]);

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
