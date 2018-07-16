'use strict';

const { Op } = require('sequelize');

module.exports = function createTeachersRepository(models) {
  const { Teacher } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Teacher.findAndCountAll({
      offset,
      limit,
      where: { firstName: { [Op.like]: [`%${contains}%`] } },
    });
  }

  async function view(id) {
    return Teacher.findById(id);
  }

  function add(form) {
    return Teacher.create(form);
  }

  async function exists(id) {
    const result = await Teacher.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return Teacher.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id) {
    return Teacher.destroy({ where: { id: { [Op.eq]: id } } });
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
