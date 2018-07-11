'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('admins', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        field: 'first_name',
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        field: 'last_name',
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
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
