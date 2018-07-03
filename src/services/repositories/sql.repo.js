module.exports = (sequelize) => {
  require('../../models/sql.model')(sequelize);
  const { Test } = sequelize.models;

  function list() {
    return Test.findAll({});
  }

  return {
    list,
  };
};
