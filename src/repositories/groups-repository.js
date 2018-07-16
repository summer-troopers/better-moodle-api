'use strict';

const { Op } = require('sequelize');
const errors = require('@feathersjs/errors');

module.exports = function createGroupsRepository(models) {
  const { Group, Specialty } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    return Group.findAndCountAll({
      offset,
      limit,
      where: { name: { [Op.like]: [`%${contains}%`] } },
    });
  }

  async function view(id) {
    return Group.findById(id);
  }

  async function add(form) {
    const result = await Specialty.findById(form.idSpecialty);
    if (!result) throw new errors.NotFound();

    return Group.create(form);
  }

  async function exists(id) {
    const result = await Group.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    const result = await Specialty.findById(form.idSpecialty);
    if (!result) throw new errors.NotFound('');

    return Group.update(form, {
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id) {
    return Group.destroy({ where: { id: { [Op.eq]: id } } });
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
