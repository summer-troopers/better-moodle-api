'use strict';

const { Op } = require('sequelize');

module.exports = function createCoursesRepository(models) {
  const { Course } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Course.findAndCountAll({
      offset,
      limit,
      where: { name: { [Op.like]: [`%${contains}%`] } },
    });
  }

  async function view(id) {
    return Course.findById(id);
  }

  function add(form) {
    return Course.create(form);
  }

  async function exists(id) {
    const result = await Course.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Course.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id) {
    return Course.destroy({ where: { id: { [Op.eq]: id } } });
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
