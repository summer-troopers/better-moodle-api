'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('courses_specialties', {
      idSpecialties: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id_specialty',
        references: {
          model: 'specialties',
          key: 'id',
        },
      },
      idCourse: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id_course',
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
