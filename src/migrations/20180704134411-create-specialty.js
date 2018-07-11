'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('specialties', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        field: 'name',
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('specialties'); },
};
