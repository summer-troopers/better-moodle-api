'use strict';

module.exports = function getTeacherRepository(sequelize) {
  const { Teacher } = sequelize.models;

  function list() {
    return Teacher.findAll({});
  }

  async function view(id) {
    if (id === undefined) return { error: 'Teacher ID not recieved' };
    const result = await Teacher.findOne({ where: { id } });
    if (!result) return { error: 'Teacher id not found' };

    return result;
  }

  async function add(form) {
    try {
      const result = await Teacher.create(form);
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }


  async function update(id, form) {
    if (id === undefined) return { error: 'Teacher ID not recieved' };
    try {
      const result = await Teacher.update(form, {
        where: { id },
      });
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }

  async function remove(id) {
    if (id === undefined) return { error: 'Teacher ID not recieved' };
    const result = await Teacher.destroy({ where: { id } });
    if (!result) return { error: 'Teacher id not found' };

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
