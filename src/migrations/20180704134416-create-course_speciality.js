'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('courses_specialities', {
      idSpecialities: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id_speciality',
        references: {
          model: 'specialities',
          key: 'id',
        },
      },
      idCourse: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id_course',
        references: {
          model: 'courses',
          key: 'id',
        },
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('courses_specialities'); },
};
