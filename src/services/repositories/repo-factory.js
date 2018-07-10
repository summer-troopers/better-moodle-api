'use strict';

module.exports = function createRepository(model) {
  function list() {
    return model.findAll({});
  }

  async function view(id) {
    if (id === undefined) return { error: 'Id not received' };
    const result = await model.findOne({ where: { id } });
    if (!result) return { error: 'Id not found' };

    return result;
  }

  async function add(form) {
    try {
      const result = await model.create(form);
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }


  async function update(id, form) {
    if (id === undefined) return { error: 'Id not received' };
    try {
      const result = await model.update(form, {
        where: { id },
      });
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }

  async function remove(id) {
    if (id === undefined) return { error: 'Id not recieved' };
    const result = await model.destroy({ where: { id } });
    if (!result) return { error: 'Id not found' };

    return true;
  }

  return {
    list,
    view,
    add,
    update,
    remove,
  };
};
