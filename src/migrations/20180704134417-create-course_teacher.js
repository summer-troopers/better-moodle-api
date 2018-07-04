module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('courses_teachers', {
    idCourse: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: 'id_course',
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    idTeacher: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      field: 'id_teacher',
      references: {
        model: 'teachers',
        key: 'id',
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('courses_teachers'),
};
