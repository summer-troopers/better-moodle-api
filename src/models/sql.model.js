const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Test = sequelize.define('Test', {
    name: {
      type: Sequelize.STRING,
    },
  }, {
    freezeTableName: true,
  });
  Test.sync();
};
