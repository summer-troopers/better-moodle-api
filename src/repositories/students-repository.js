'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

module.exports = function createStudentsRepository(models) {
  const { Student, Group } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Student.findAndCountAll({
      offset,
      limit,
      where: { firstName: { [Op.like]: [`%${contains}%`] } },
    });
  }

  async function view(id) {
    return Student.findById(id);
  }

  async function add(form) {
    const result = await Group.findById(form.idGroup);
    if (!result) throw new errors.NotFound();

    return Student.create(form);
  }

  async function exists(id) {
    const result = await Student.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const result = await Group.findById(form.idGroup);
    if (!result) throw new errors.NotFound();

    return Student.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id) {
    return Student.destroy({ where: { id: { [Op.eq]: id } } });
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
