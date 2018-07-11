'use strict';

module.exports = function createRepository(model) {
  function list() {
    return model.findAll({});
  }

  async function view(id) {
    const result = await model.findOne({ where: { id } });
    if (!result) throw new Error('ID_NOT_FOUND');

    return result;
  }

  function add(form) {
    return model.create(form);
  }


  async function update(id, form) {
    const result = await model.update(form, {
      where: { id },
    });
    if (result[0] === 0) throw new Error('ID_NOT_FOUND');

    return result;
  }

  async function remove(id) {
    const result = await model.destroy({ where: { id } });
    if (!result) throw new Error('ID_NOT_FOUND');

    return result;
  }

  return {
    list,
    view,
    add,
    update,
    remove,
  };
};
