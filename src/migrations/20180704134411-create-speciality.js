'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('specialities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        field: 'name',
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('specialities'); },
};
