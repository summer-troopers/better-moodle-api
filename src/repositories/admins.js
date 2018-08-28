'use strict';

const { Op } = require('sequelize');
const { assert } = require('../helpers/db');

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

  async function view(id) {
    return Admin.findOne({
      where: { id },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
  }

  async function add(data) {
    await assert.notTaken.email(data.email, [Admin, models.Teacher, models.Student]);
    await assert.notTaken.phoneNumber(data.phoneNumber, [Admin, models.Teacher, models.Student]);

    return Admin.create(data);
  }

  async function exists(id) {
    const result = await Admin.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, data) {
    await assert.notTaken.email(data.email, [Admin, models.Teacher, models.Student]);
    await assert.notTaken.phoneNumber(data.phoneNumber, [Admin, models.Teacher, models.Student]);

    return Admin.update(data, {
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
