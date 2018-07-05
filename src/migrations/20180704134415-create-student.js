'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('students', {
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
        type: Sequelize.INTEGER,
        field: 'phone_number',
      },
      idGroup: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'id_group',
        references: {
          model: 'groups',
          key: 'id',
        },
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('students'); },
};
