'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        field: 'first_name',
      },
      lastName: {
        type: Sequelize.STRING,
        field: 'last_name',
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        field: 'phone_number',
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('admins'); },
};
