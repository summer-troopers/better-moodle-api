'use strict';

const { Op } = require('sequelize');

module.exports = function createAdminsRepository(models) {
  const { Admin } = models;

  function list(queryParams) {
    const { limit, offset, contains } = queryParams;

    const getData = Admin.findAll({
      offset,
      limit,
      where: { firstName: { [Op.like]: [`%${contains}%`] } },
    });

    const getTotal = Admin.count();

    return Promise.all([
      getData,
      getTotal,
    ]);
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
      where: { id: { [Op.eq]: id } },
    });
  }

  function remove(id) {
    return Admin.destroy({ where: { id: { [Op.eq]: id } } });
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
