'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('courses_specialties', {
      courseId: {
        type: Sequelize.INTEGER,
        field: 'course_id',
        primaryKey: true,
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        field: 'specialty_id',
        primaryKey: true,
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'specialties',
          key: 'id',
        },
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('courses_specialties');
  },
};
