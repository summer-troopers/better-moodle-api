'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('courses_specialties', {
      specialtyId: {
        type: Sequelize.INTEGER,
        field: 'specialty_id',
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'specialties',
          key: 'id',
        },
      },
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
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('courses_specialties'); },
};
