'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('courses_teachers', {
      courseId: {
        type: Sequelize.INTEGER,
        field: 'course_id',
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      teacherId: {
        type: Sequelize.INTEGER,
        field: 'teacher_id',
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('courses_teachers'); },
};
