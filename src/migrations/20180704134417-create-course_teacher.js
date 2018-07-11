'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('courses_teachers', {
      idCourse: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id_course',
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      idTeacher: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id_teacher',
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
