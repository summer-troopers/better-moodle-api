'use strict';

const { Op } = require('sequelize');

module.exports = function createSpecialtiesRepository(models) {
  const { Specialty } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Specialty.findAndCountAll({
      offset,
      limit,
      where: { name: { [Op.like]: [`%${contains}%`] } },
    });
  }

  async function view(id) {
    return Specialty.findById(id);
  }

  function add(form) {
    return Specialty.create(form);
  }

  async function exists(id) {
    const result = await Specialty.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Specialty.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id) {
    return Specialty.destroy({ where: { id: { [Op.eq]: id } } });
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
