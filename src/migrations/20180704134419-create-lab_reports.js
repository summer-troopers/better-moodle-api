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
      labTaskId: {
        type: Sequelize.INTEGER,
        field: 'lab_task_id',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'lab_tasks',
          key: 'id',
        },
      },
      mongoFileId: {
        type: Sequelize.INTEGER,
        field: 'mongo_file_id',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('lab_reports'); },
};
