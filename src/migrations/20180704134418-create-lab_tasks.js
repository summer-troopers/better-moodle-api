'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('lab_tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teacherId: {
        type: Sequelize.INTEGER,
        field: 'teacher_id',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      courseId: {
        type: Sequelize.INTEGER,
        field: 'course_id',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      mongoFileId: {
        type: Sequelize.STRING,
        field: 'mongo_file_id',
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('lab_tasks'); },
};
