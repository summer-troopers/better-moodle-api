'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('course_instances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teacherId: {
        type: Sequelize.INTEGER,
        field: 'teacher_id',
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      courseId: {
        type: Sequelize.INTEGER,
        field: 'course_id',
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      labTasksFileId: {
        type: Sequelize.STRING,
        field: 'lab_tasks_file_id',
        allowNull: true,
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
    return queryInterface.dropTable('course_instances');
  },
};
