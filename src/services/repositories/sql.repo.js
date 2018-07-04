module.exports = (sequelize) => {
  require('../../models/index')(sequelize);
  const { Admin } = sequelize.models;

  function list() {
    return Admin.findAll({});
  }

  function add(form) {
    return Admin.create({ firstName: form.firstName });
  }

  return {
    list,
    add,
  };
};
