'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('lab_reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: Sequelize.INTEGER,
        field: 'student_id',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
      },
      labId: {
        type: Sequelize.INTEGER,
        field: 'lab_id',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'labs',
          key: 'id',
        },
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mark: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mongoFileId: {
        type: Sequelize.STRING,
        field: 'mongo_file_id',
        allowNull: false,
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
  down(queryInterface, Sequelize) { return queryInterface.dropTable('lab_reports'); },
};
