'use strict';

module.exports = function createRepository(model) {
  function list() {
    return model.findAll({});
  }

  async function view(id) {
    return model.findOne({ where: { id } });
  }

  function add(form) {
    return model.create(form);
  }

  async function exists(id) {
    const result = await model.findById(id);
    if (result) return true;
    return false;
  }

  async function update(id, form) {
    return model.update(form, {
      where: { id },
    });
  }

  function remove(id) {
    return model.destroy({ where: { id } });
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
