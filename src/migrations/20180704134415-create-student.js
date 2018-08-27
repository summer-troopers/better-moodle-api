'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('students', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        field: 'phone_number',
        unique: true,
      },
      groupId: {
        type: Sequelize.INTEGER,
        field: 'group_id',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'groups',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('students');
  },
};
