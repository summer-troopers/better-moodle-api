module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('courses_specialities', {
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
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('courses_specialities'),
};
