module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('courses_teachers', [{
      id_teacher: '1',
      id_course: '1',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('courses_teachers', null, {});
  },
};
